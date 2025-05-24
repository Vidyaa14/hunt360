import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import os from 'os';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------- CLI & Global Setup ----------------------------- //
if (process.argv.length !== 4) {
    console.log('Usage: node script.js <industry> <city>');
    process.exit(1);
}

const industry = process.argv[2];
const city = process.argv[3];
const data = [];
const gstTracker = {};

// Get the system's Downloads folder path (for Windows, macOS, Linux)
const downloadsFolder = path.join(__dirname, 'exports');
if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder);

// Ensure the Downloads directory exists
if (!fs.existsSync(downloadsFolder)) {
    console.error('Error: Downloads directory not found.');
    process.exit(1);
}

const baseFileName = `${industry}_${city}_Foundit.xlsx`;
let filePath = path.join(downloadsFolder, baseFileName);

// Check if file exists and increment filename if necessary
let fileIndex = 1;
while (fs.existsSync(filePath)) {
    filePath = path.join(
        downloadsFolder,
        `${baseFileName.replace('.xlsx', '')}(${fileIndex}).xlsx`
    );
    fileIndex++;
}

// Database connection configuration
let ca;
try {
    ca = fs.readFileSync(path.join(__dirname, '..', 'certs', 'ca.pem'));
} catch (err) {
    console.error('Error loading certificate:', err.message);
    process.exit(1);
}

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        ca: ca,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

async function saveDataToDatabase() {
    if (data.length === 0) return;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        for (let record of data) {
            const query = `
                INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(query, [
                record['Company_Name'],
                record['Location'],
                record['Job_Title'],
                record['Address'],
                record['Phone'],
                record['Website'],
                record['GST Number(s)'],
            ]);
        }
        console.log(`Saved ${data.length} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// ----------------------------- Save Data to Excel ----------------------------- //
async function saveData() {
    await saveDataToDatabase(); // Save to database first
    if (data.length > 0) {
        const headers = [
            'Job_Title',
            'Company_Name',
            'Location',
            'Address',
            'Phone',
            'Website',
            'GST Number(s)',
        ];

        // Create a 2D array with the correct column order
        const rows = data.map((d) => [
            d['Job_Title'],
            d['Company_Name'],
            d['Location'],
            d['Address'],
            d['Phone'],
            d['Website'],
            d['GST Number(s)'],
        ]);
        const worksheetData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        // const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Foundit Data');
        XLSX.writeFile(wb, filePath);
        console.log(`Data saved. Records: ${data.length}`);
        console.log(`Saved to: ${filePath}`);
    }
}

// ----------------------------- Main Scraping Function ----------------------------- //
async function scrapeData() {
    try {
        await driver.get('https://www.foundit.in/');
        await driver.wait(until.elementLocated(By.tagName('body')), 10000);

        const searchInput = await driver.findElement(
            By.id('heroSectionDesktop-skillsAutoComplete--input')
        );
        await searchInput.clear();
        await searchInput.sendKeys(`${industry}, ${city}`);

        const searchBtn = await driver.findElement(
            By.xpath("//button[span[text()='Search']]")
        );
        await searchBtn.click();
        await driver.sleep(5000);

        let interrupted = false;
        process.on('SIGINT', () => {
            console.log('\nInterrupted! Saving progress...');
            interrupted = true;
        });

        while (!interrupted) {
            await driver.wait(
                until.elementLocated(By.css('div.jobTitle')),
                10000
            );

            const jobTitles = await driver.findElements(By.css('div.jobTitle'));
            const companies = await driver.findElements(
                By.xpath(
                    "//div[contains(@class, 'infoSection')]//div[contains(@class, 'companyName')]/p"
                )
            );
            const locations = await driver.findElements(
                By.css('div.details.location')
            );

            for (
                let i = 0;
                i <
                Math.min(jobTitles.length, companies.length, locations.length);
                i++
            ) {
                const jobTitle = await jobTitles[i].getText();
                const company = await companies[i].getText();
                const location = await locations[i].getText();

                if (
                    !data.some(
                        (d) =>
                            d['Company_Name'] === company &&
                            d['Location'] === location
                    )
                ) {
                    const gmapInfo = await getGoogleMapsData(company, location);
                    const gstNumbers = await getGstNumbers(company, location);

                    let gstToSave = 'N/A';
                    if (gstNumbers.length > 0) {
                        if (!gstTracker[company]) {
                            gstTracker[company] = new Set();
                        }

                        for (const gst of gstNumbers) {
                            if (!gstTracker[company].has(gst)) {
                                gstToSave = gst;
                                gstTracker[company].add(gst);
                                break;
                            }
                        }
                    }

                    gmapInfo['Job_Title'] = jobTitle;
                    gmapInfo['Company_Name'] = company;
                    gmapInfo['Location'] = location;
                    gmapInfo['GST Number(s)'] = gstToSave;

                    data.push(gmapInfo);
                    console.log(
                        `[SCRAPED] ${jobTitle} | ${company} | ${location} | GST: ${gstToSave}`
                    );
                }
            }

            saveData();

            try {
                const nextBtn = await driver.findElement(
                    By.css('div.arrow.arrow-right')
                );
                await nextBtn.click();
                await driver.sleep(4000);
            } catch (err) {
                console.log('No more pages.');
                break;
            }
        }
    } catch (err) {
        console.error(`Error occurred: ${err}`);
    } finally {
        await driver.quit();
        saveData();
        console.log('Scraping completed.');
    }
}

// ----------------------------- Helper Functions ----------------------------- //
async function getGoogleMapsData(company, location) {
    try {
        await driver.executeScript("window.open('');");
        const tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[1]);

        await driver.get(
            `https://www.google.com/maps/search/${company} ${location}`
        );
        await driver.sleep(5000);

        try {
            // Check if detail view (h1) is already available
            await driver.wait(
                until.elementLocated(By.css('h1.DUwDvf.lfPIob')),
                5000
            );
        } catch {
            // If not, try clicking the first result
            try {
                const firstResult = await driver.wait(
                    until.elementLocated(
                        By.xpath("(//a[contains(@href, '/place/')])[1]")
                    ),
                    5000
                );
                await firstResult.click();
                await driver.sleep(3000);
                await driver.wait(
                    until.elementLocated(By.css('h1.DUwDvf.lfPIob')),
                    10000
                );
            } catch (err) {
                throw new Error('No results found to click.');
            }
        }

        const name = await driver
            .findElement(By.css('h1.DUwDvf.lfPIob'))
            .getText();
        const address = await driver
            .findElement(By.css('div.Io6YTe.fontBodyMedium'))
            .getText()
            .catch(() => 'N/A');
        const website = await driver
            .findElement(By.xpath("//a[contains(@aria-label, 'Website')]"))
            .getAttribute('href')
            .catch(() => 'N/A');
        const phone = await driver
            .findElement(
                By.xpath(
                    "//span[contains(text(),'Phone')]/following-sibling::span"
                )
            )
            .getText()
            .catch(() => 'N/A');

        return {
            // "Company Name": name || company,
            Address: address || 'N/A',
            Phone: phone || 'N/A',
            Website: website || 'N/A',
        };
    } catch (err) {
        console.error(`[Google Maps] Error for ${company}: ${err}`);
        return {
            // "Company Name": company,
            Address: 'N/A',
            Phone: 'N/A',
            Website: 'N/A',
        };
    } finally {
        const tabs = await driver.getAllWindowHandles();
        await driver.close();
        await driver.switchTo().window(tabs[0]);
    }
}

async function getGstNumbers(company, location) {
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);

        await driver.get('https://findgst.in/gstin-by-name');
        await driver.sleep(2000);

        const searchInput = await driver.findElement(By.id('gstnumber'));
        await searchInput.clear();
        await searchInput.sendKeys(company);

        const findBtn = await driver.findElement(
            By.xpath("//input[@value='Find GST number']")
        );
        await findBtn.click();
        await driver.sleep(3000);

        const gstElements = await driver.findElements(
            By.xpath(
                "//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"
            )
        );
        const gstNumbers = [];
        for (let el of gstElements) {
            const text = await el.getText();
            const matches = text.match(
                /\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g
            );
            if (matches) {
                gstNumbers.push(...matches);
            }
        }

        return gstNumbers;
    } catch (err) {
        console.error(`[GST] Error for ${company}: ${err}`);
        return [];
    } finally {
        const allHandles = await driver.getAllWindowHandles();
        await driver.close();
        await driver.switchTo().window(allHandles[0]);
    }
}

// ----------------------------- Browser Setup ----------------------------- //
const driver = new Builder().forBrowser('chrome').build();

// ----------------------------- Start Scraping ----------------------------- //
scrapeData();
