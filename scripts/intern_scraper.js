import { Builder, By, Key, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadsFolder = path.join(__dirname, 'exports');
if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder, { recursive: true });

const industry = process.argv[2];
let city = process.argv[3];

if (!industry || !city) {
    console.log('Usage: node script.js <industry> <city>');
    process.exit(1);
}

const searchTerm = `${industry}`;

// Unique Excel file creation
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

const filename = getUniqueFilename(`Internshala_${industry.replace(/ /g, '_')}_${city.replace(/ /g, '_')}_Internships`);

const headers = ['Job_Title', 'Company_Name', 'Location', 'Address', 'Phone', 'Website', 'GST Number(s)'];
const rows = [];

// Database connection configuration
let ca;
try {
    ca = fs.readFileSync(path.join(__dirname, '..', 'certs', 'ca.pem'));
} catch (err) {
    console.error('Error loading certificate:', err.message);
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

export async function saveDataToDatabase() {
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
                row[6], // GST Number(s)
            ]);
        }
        console.log(`Saved ${rows.length} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

export async function closeAds(driver) {
    try {
        const closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        await driver.sleep(1000);
    } catch (e) { }
    try {
        const dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        await driver.sleep(1000);
    } catch (e) { }
}

export async function getGST(driver, companyName, location) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        let tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[1]);
        await driver.get('https://findgst.in/gstin-by-name');

        await driver.sleep(2000);
        await closeAds(driver);

        const input = await driver.wait(until.elementLocated(By.id('gstnumber')), 10000);
        await input.clear();
        await input.sendKeys(companyName);

        const btn = await driver.findElement(By.xpath("//input[@value='Find GST number']"));
        await btn.click();

        await driver.sleep(5000);
        await driver.executeScript('window.scrollBy(0, 800);');

        const resultBlocks = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of resultBlocks) {
            let text = await block.getText();
            let matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error: ${companyName} | ${e}`);
    } finally {
        let tabs = await driver.getAllWindowHandles();
        if (tabs.length > 1) {
            await driver.close();
            await driver.switchTo().window(tabs[0]);
        }
    }
    return [...new Set(gstNumbers)];
}

export async function getMapData(driver, company, location) {
    let data = {
        company,
        address: 'N/A',
        phone: 'N/A',
        website: 'N/A',
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
            data.website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute('href');
        } catch { }
        try {
            data.phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText();
        } catch { }
    } catch (e) {
        console.log(`[Maps] Error: ${company} | ${e}`);
    } finally {
        let tabs = await driver.getAllWindowHandles();
        if (tabs.length > 1) {
            await driver.close();
            await driver.switchTo().window(tabs[0]);
        }
    }
    return data;
}

export async function main() {
    const chromeService = new chrome.ServiceBuilder('/usr/bin/chromedriver');

    // Create a unique user data directory
    const uniqueUserDataDir = path.join(__dirname, `chrome-profile-${Date.now()}-${process.pid}`);
    if (!fs.existsSync(uniqueUserDataDir)) {
        fs.mkdirSync(uniqueUserDataDir, { recursive: true });
    }


    // Configure Chrome options
    const chromeOptions = new chrome.Options();
    chromeOptions.setChromeBinaryPath('/usr/bin/chromium-browser');
    chromeOptions.addArguments(`--user-data-dir=${uniqueUserDataDir}`);
    chromeOptions.addArguments('--no-sandbox'); // For containerized environments
    chromeOptions.addArguments('--disable-dev-shm-usage'); // Avoid resource issues
    chromeOptions.addArguments('--headless=new'); // Run in headless mode to reduce conflicts
    chromeOptions.addArguments('--disable-gpu'); // Disable GPU for headless
    chromeOptions.addArguments('--disable-extensions'); // Disable extensions to avoid conflicts
    chromeOptions.addArguments('--disable-cache'); // Prevent cache-related issues
    chromeOptions.addArguments('--window-size=1920,1080'); // Set window size for consistency

    // Initialize WebDriver with Chrome options
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .setChromeService(chromeService)
        .build();

    let gstTracker = {};

    try {
        await driver.manage().window().maximize();
        await driver.get('https://internshala.com/');
        await driver.wait(until.elementLocated(By.xpath("//button[@class='search-cta']")), 10000).click();
        await driver.sleep(2000);

        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @placeholder='Search here...']")), 10000);
        await searchInput.sendKeys(searchTerm, Key.RETURN);
        await driver.sleep(5000);

        try {
            const closePopup = await driver.findElement(By.id('close_popup'));
            await closePopup.click();
            await driver.sleep(2000);
        } catch { }

        try {
            const internshipsTab = await driver.findElement(By.xpath("//a[contains(text(),'Internships')]"));
            await internshipsTab.click();
            await driver.sleep(2000);
        } catch { }

        const locationSuggestions = await driver.findElements(By.xpath("//a[contains(@class, 'location-link')]"));
        let matchedCity = null;
        for (let suggestion of locationSuggestions) {
            const suggestionText = await suggestion.getText();
            if (suggestionText.toLowerCase().includes(city.toLowerCase())) {
                matchedCity = suggestionText;
                break;
            }
        }

        if (matchedCity) {
            console.log(`City suggestion found: ${matchedCity}`);
            city = matchedCity;
        } else {
            console.log(`No exact city match found. Continuing with the search for: ${city}`);
        }

        const locationDropdown = await driver.wait(until.elementLocated(By.xpath('//*[@id="city_sidebar_chosen"]')), 10000);
        await locationDropdown.click();

        await driver.sleep(1000);
        const locationInput = await driver.wait(until.elementLocated(By.xpath('//*[@id="city_sidebar_chosen"]//input')), 10000);
        await locationInput.clear();
        await locationInput.sendKeys(city);
        await locationInput.sendKeys(Key.RETURN);
        await driver.sleep(2000);

        let page = 1;
        while (true) {
            const cards = await driver.findElements(By.css('.individual_internship'));
            console.log(`Scraping page ${page} with ${cards.length} cards`);

            let foundAtLeastOne = false;

            for (let card of cards) {
                try {
                    const title = await card.findElement(By.css('h3.job-internship-name a.job-title-href')).getText();
                    const company = await card.findElement(By.css('p.company-name')).getText();
                    const locationText = await card.findElement(By.css('div.row-1-item.locations span a')).getText();

                    if (!locationText.toLowerCase().includes(city.toLowerCase())) continue;

                    foundAtLeastOne = true;
                    const selectedLocation = locationText.split(',')[0].trim();

                    const enriched = await getMapData(driver, company, selectedLocation);
                    const gstNumbers = await getGST(driver, company, selectedLocation);
                    let gstToSave = 'N/A';

                    if (gstNumbers.length) {
                        gstTracker[company] = gstTracker[company] || new Set();
                        for (let gst of gstNumbers) {
                            if (!gstTracker[company].has(gst)) {
                                gstToSave = gst;
                                gstTracker[company].add(gst);
                                break;
                            }
                        }
                    }

                    rows.push([
                        title,
                        company,
                        selectedLocation,
                        enriched.address,
                        enriched.phone,
                        enriched.website,
                        gstToSave,
                    ]);

                    console.log(`${title} | ${company} | ${selectedLocation} | GST: ${gstToSave}`);
                } catch (e) {
                    console.log('Card parsing failed:', e);
                }
            }

            if (!foundAtLeastOne) {
                console.log(`No internships found matching the city "${city}".`);
            }

            await saveDataToDatabase();

            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Internships');
            XLSX.writeFile(wb, filename);
            console.log(`Data saved to: ${filename}`);

            try {
                const nextBtn = await driver.wait(until.elementLocated(By.id('navigation-forward')), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", nextBtn);
                await nextBtn.click();
                page++;
                await driver.sleep(5000);
            } catch {
                console.log('No more pages.');
                break;
            }
        }
    } catch (e) {
        console.error('Fatal Error:', e);
    } finally {
        await driver.quit();
    }
}

main();