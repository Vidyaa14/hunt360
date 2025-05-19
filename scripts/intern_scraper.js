import fs from 'fs';
import mysql from 'mysql2/promise';
import os from 'os';
import path from 'path';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromedriverPath = process.env.CHROMEDRIVER_BIN || '/usr/bin/chromedriver';
const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);

const industry = process.argv[2];
let locationInput = process.argv[3];

if (!industry || !locationInput) {
    console.log("Usage: node script.js <industry> <location>");
    process.exit(1);
}

const searchTerm = `${industry}`;
const downloadsFolder = path.join(__dirname, "exports");
if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder);

function getUniqueFilename(baseName) {
    const ext = '.xlsx';
    let filename = baseName + ext;
    let counter = 1;
    while (fs.existsSync(path.join(downloadsFolder, filename))) {
        filename = `${baseName}(${counter})${ext}`;
        counter++;
    }
    return path.join(downloadsFolder, filename);
}

const filename = getUniqueFilename(`Internshala_${industry.replace(/ /g, '_')}_${locationInput.replace(/ /g, '_')}_Internships`);
const headers = ['Job_Title', 'Company_Name', 'Location', 'Address', 'Phone', 'Website', 'GST Number(s)'];
const rows = [];

let ca;
try {
    ca = fs.readFileSync(path.join(__dirname, "..", "certs", "ca.pem"));
} catch (err) {
    console.error("Error loading certificate:", err.message);
    process.exit(1);
}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { ca },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

async function saveDataToDatabase() {
    if (rows.length === 0) return;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        for (let row of rows) {
            const query = `
                INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(query, [
                row[1], // Company_Name
                row[2], // Location
                row[0], // Job_Title
                row[3], // Address
                row[4], // Phone
                row[5], // Website
                row[6]  // GST Number(s)
            ]);
        }
        console.log(`Saved ${rows.length} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

async function closeAds(driver) {
    try {
        const closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        await driver.sleep(1000);
    } catch { }
    try {
        const dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        await driver.sleep(1000);
    } catch { }
}

async function getGST(driver, companyName, location) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        let tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[1]);
        await driver.get("https://findgst.in/gstin-by-name");
        await driver.sleep(2000);
        await closeAds(driver);

        const input = await driver.wait(until.elementLocated(By.id('gstnumber')), 10000);
        await input.clear();
        await input.sendKeys(companyName);

        const btn = await driver.findElement(By.xpath("//input[@value='Find GST number']"));
        await btn.click();

        await driver.sleep(5000);
        await driver.executeScript("window.scrollBy(0, 800);");

        const resultBlocks = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of resultBlocks) {
            let text = await block.getText();
            let matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error: ${companyName} | ${e.message}`);
    } finally {
        let tabs = await driver.getAllWindowHandles();
        if (tabs.length > 1) {
            await driver.close();
            await driver.switchTo().window(tabs[0]);
        }
    }
    return [...new Set(gstNumbers)];
}

async function getMapData(driver, company, location) {
    let data = {
        company: company,
        address: "N/A",
        phone: "N/A",
        website: "N/A"
    };
    try {
        await driver.executeScript("window.open('');");
        let tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[1]);
        await driver.get(`https://www.google.com/maps/search/${company} ${location}`);
        await driver.sleep(3000);

        try {
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 10000);
        } catch {
            const firstResult = await driver.findElement(By.xpath("(//a[contains(@href, '/place/')])[1]"));
            await firstResult.click();
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 10000);
        }

        data.company = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText();

        try {
            data.address = await driver.findElement(By.xpath("//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText();
        } catch { }
        try {
            data.website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute("href");
        } catch { }
        try {
            data.phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText();
        } catch { }
    } catch (e) {
        console.log(`[Maps] Error: ${company} | ${e.message}`);
    } finally {
        let tabs = await driver.getAllWindowHandles();
        if (tabs.length > 1) {
            await driver.close();
            await driver.switchTo().window(tabs[0]);
        }
    }
    return data;
}

(async () => {
    const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-profile-'));

    const options = new chrome.Options()
        .addArguments(
            `--user-data-dir=${tempProfileDir}`,
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--headless=new'
        );

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(serviceBuilder)
        .build();

    let gstTracker = {};
    const SCRAPE_TIMEOUT_MS = 3 * 60 * 1000;
    const startTime = Date.now();

    const maharashtraCities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'];
    let citiesToScrape = [locationInput];

    if (locationInput.toLowerCase() === 'maharashtra') {
        console.log('Detected state input. Scraping for cities: ', maharashtraCities);
        citiesToScrape = maharashtraCities;
    }

    try {
        await driver.manage().window().maximize();
        await driver.get("https://internshala.com/");
        await driver.wait(until.elementLocated(By.xpath("//button[@class='search-cta']")), 10000).click();
        await driver.sleep(2000);

        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @placeholder='Search here...']")), 10000);
        await searchInput.sendKeys(searchTerm, Key.RETURN);
        await driver.sleep(5000);

        try {
            const closePopup = await driver.findElement(By.id("close_popup"));
            await closePopup.click();
            await driver.sleep(2000);
        } catch { }

        try {
            const internshipsTab = await driver.findElement(By.xpath("//a[contains(text(),'Internships')]"));
            await internshipsTab.click();
            await driver.sleep(2000);
        } catch { }

        for (let city of citiesToScrape) {
            console.log(`Scraping for city: ${city}`);
            const locationDropdown = await driver.wait(until.elementLocated(By.xpath('//*[@id="city_sidebar_chosen"]')), 10000);
            await locationDropdown.click();
            await driver.sleep(1000);

            const locationInputField = await driver.wait(until.elementLocated(By.xpath('//*[@id="city_sidebar_chosen"]//input')), 10000);
            await locationInputField.clear();
            await locationInputField.sendKeys(city);
            await driver.sleep(1000);

            try {
                const suggestion = await driver.wait(until.elementLocated(By.xpath(`//li[contains(text(), '${city}')]`)), 5000);
                await suggestion.click();
            } catch {
                console.log(`No suggestion found for ${city}. Using input as is.`);
                await locationInputField.sendKeys(Key.RETURN);
            }
            await driver.sleep(2000);

            let page = 1;
            while (true) {
                if (Date.now() - startTime > SCRAPE_TIMEOUT_MS) {
                    console.log("Timeout reached. Stopping scraping.");
                    break;
                }

                const cards = await driver.findElements(By.css('.individual_internship'));
                console.log(`Scraping page ${page} with ${cards.length} cards in ${city}`);
                let foundAtLeastOne = false;

                for (let card of cards) {
                    try {
                        let title = await card.findElement(By.css('.job-internship-name a')).getText();
                        let company = await card.findElement(By.css('.company-name')).getText();
                        let locationText = await card.findElement(By.css('.locations a')).getText();

                        const locations = locationText.split(',').map(loc => loc.trim().toLowerCase());
                        const isWorkFromHome = await card.findElements(By.css('.locations .ic-16-home')).then(elements => elements.length > 0);

                        let selectedLocation = locationText;
                        if (isWorkFromHome) {
                            selectedLocation = 'Work from home';
                        } else if (!locations.some(loc => loc.includes(city.toLowerCase()))) {
                            console.log(`Skipping card: ${title} @ ${company} (Locations: ${locationText} does not include ${city})`);
                            continue;
                        } else {
                            selectedLocation = locations.find(loc => loc.includes(city.toLowerCase())) || locations[0];
                        }

                        foundAtLeastOne = true;
                        const enriched = await getMapData(driver, company, selectedLocation);
                        const gstNumbers = await getGST(driver, company, selectedLocation);

                        let gstToSave = "N/A";
                        if (gstNumbers.length > 0) {
                            gstToSave = gstNumbers.join(", ");
                            gstTracker[company] = gstNumbers;
                        } else if (gstTracker[company]) {
                            gstToSave = gstTracker[company].join(", ");
                        }

                        rows.push([
                            title,
                            enriched.company,
                            selectedLocation,
                            enriched.address,
                            enriched.phone,
                            enriched.website,
                            gstToSave
                        ]);

                        console.log(`Scraped: ${title} @ ${company} in ${selectedLocation}`);

                    } catch (e) {
                        console.error(`Error processing card in ${city}: ${e.message}`);
                        continue;
                    }
                }

                if (!foundAtLeastOne) {
                    console.log(`No more relevant listings found in ${city}. Moving to next city or exiting.`);
                    break;
                }

                try {
                    const nextBtn = await driver.findElement(By.xpath("//a[contains(text(), 'Next')]"));
                    await nextBtn.click();
                    await driver.sleep(3000);
                    page++;
                } catch {
                    console.log(`No next page button found in ${city}. Moving to next city or exiting.`);
                    break;
                }
            }
        }

        if (rows.length === 0) {
            console.log("No internships found for the specified criteria.");
        } else {
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, filename);
            console.log(`Excel saved as ${filename}`);

            await saveDataToDatabase();
        }

    } catch (err) {
        console.error("Fatal error:", err.message);
    } finally {
        await driver.quit();
        fs.rmSync(tempProfileDir, { recursive: true, force: true });
    }
})();