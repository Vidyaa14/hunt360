/*const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs-extra');
const path = require('path');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await
// const ExcelJS = require('exceljs');

let interrupted = false;
let data = [];
let gstTracker = {};
let filePath; // Declare filePath globally for signal handlers

process.on('SIGINT', () => {
    console.log('\nScript interrupted! Saving the data...');
    interrupted = true;
    saveData(filePath); // Ensure data is saved on interrupt
    process.exit();
});
process.on('SIGTERM', () => {
    console.log('\nScript terminated! Saving the data...');
    interrupted = true;
    saveData(filePath); // Ensure data is saved on termination
    process.exit();

});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeAds(driver) {
    try {
        let closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        console.log("[INFO] Closed popup ad (Type 1).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 1 popup not found.");
    }

    try {
        let dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        console.log("[INFO] Closed popup ad (Type 2).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 2 popup not found.");
    }
}

async function getGSTNumbers(driver, companyName, location) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get("https://findgst.in/gstin-by-name");

        await delay(2000);
        await closeAds(driver);

        let searchInput = await driver.wait(until.elementLocated(By.id("gstnumber")), 10000);
        await searchInput.clear();
        await searchInput.sendKeys(companyName);
        await driver.findElement(By.xpath("//input[@value='Find GST number']")).click();
        await delay(5000);
        await driver.executeScript("window.scrollBy(0, 800);");
        await delay(2000);

        let results = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of results) {
            let text = await block.getText();
            let matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error for ${companyName}: ${e}`);
    } finally {
        if ((await driver.getAllWindowHandles()).length > 1) {
            await driver.close();
            await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
            await delay(1000);
        }
    }
    return [...new Set(gstNumbers)];
}

async function getGoogleMapsData(driver, companyName, location) {
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get(`https://www.google.com/maps/search/${encodeURIComponent(companyName)} ${encodeURIComponent(location)}`);

        try {
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
        } catch {
            try {
                let firstResult = await driver.wait(until.elementLocated(By.xpath("(//a[contains(@href, '/place/')])[1]")), 15000);
                await driver.executeScript("arguments[0].click();", firstResult);
                await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
            } catch {
                throw new Error("No results found");
            }
        }

        let name = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText();
        let address = await driver.findElement(By.xpath("//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText().catch(() => "N/A");
        let website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute("href").catch(() => "N/A");
        let phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText().catch(() => "N/A");

        return {
            "Company_Name": name || companyName,
            "Address": address,
            "Phone": phone,
            "Website": website
        };
    } catch (e) {
        console.log(`[Maps] Error for ${companyName}: ${e}`);
        return {
            "Company_Name": companyName,
            "Address": "N/A",
            "Phone": "N/A",
            "Website": "N/A"
        };
    } finally {
        await driver.close();
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        await delay(2000);
    }
}

function getUniquexlsxPath(baseName) {
    const downloads = path.join(require("os").homedir(), "Downloads");
    const base = path.join(downloads, baseName + ".xlsx");
    if (!fs.existsSync(base)) return base;

    let i = 1;
    let newPath;
    do {
        newPath = path.join(downloads, `${baseName}(${i}).xlsx`);
        i++;
    } while (fs.existsSync(newPath));
    return newPath;
}

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'corporate_db'
};
function transformRecord(record) {
    const location = record["Location"] ? record["Location"].split(",")[0].trim() : "N/A";
    const phone = (record["Phone"] && record["Phone"].length > 0 ? String(record["Phone"]).slice(0, 25) : "N/A");
    const website = (record["Website"] && record["Website"].length > 0 ? String(record["Website"]).slice(0, 255) : "N/A");
    const gstNumbers = (record["GST Number(s)"] && record["GST Number(s)"].length > 0 ? String(record["GST Number(s)"]).split(",")[0].trim() : "N/A");
    return {
        "job_title": record["Job_Title"] || "N/A",
        "company_name": record["Company_Name"],
        "location": location,
        "address": record["Address"],
        "phone_number": phone,
        "website_link": website,
        "gst_number": gstNumbers
    };
}

async function saveDataToDatabase() {
    if (data.length === 0) return;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        for (let record of data) {
            const transformedRecord = transformRecord(record);
            const query = `
                INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number, created_at, updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'No')
                ON DUPLICATE KEY UPDATE
                    address = VALUES(address),
                    phone_number = VALUES(phone_number),
                    website_link = VALUES(website_link),
                    gst_number = VALUES(gst_number),
                    updated = 'Yes'
            `;
            await connection.execute(query, [
                transformedRecord.company_name,
                transformedRecord.location,
                transformedRecord.job_title,
                transformedRecord.address,
                transformedRecord.phone_number,
                transformedRecord.website_link,
                transformedRecord.gst_number
            ]);
        }
        console.log(`Saved ${data.length} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}
async function saveData(filePath) {
    if (data.length === 0) return;

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Naukri Data");
    xlsx.writeFile(workbook, filePath);

    console.log(`Saved ${data.length} records to: ${filePath}`);
}

(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();

    const industry = process.argv[2] || "IT Services";
    const city = process.argv[3] || "Mumbai";
    const fileName = `${industry}_${city}_Naukri`;
    const filePath = getUniquexlsxPath(fileName);

    try {
        await driver.get("https://www.naukri.com/nlogin/login?URL=https://www.naukri.com/mnjuser/homepage");
        await driver.wait(until.elementLocated(By.tagName("body")), 15000);
        await delay(5000);

        await driver.executeScript(`
            let overlays = document.querySelectorAll('.nI-gNb-sb__placeholder');
            overlays.forEach(el => el.remove());
        `);

        let searchInput = await driver.findElement(By.css(".suggestor-input"));
        await driver.executeScript("arguments[0].click();", searchInput);
        await searchInput.sendKeys(`${industry}, ${city}`);
        await driver.findElement(By.className("nI-gNb-sb__icon-wrapper")).click();
        await delay(5000);

        let noMorePages = false;

        while (!interrupted && !noMorePages) {
            await driver.executeScript("window.scrollBy(0, document.body.scrollHeight);");
            await delay(3000);

            let jobs = await driver.findElements(By.css("a.title"));
            let companies = await driver.findElements(By.css("div.row2 span a.comp-name"));
            let locations = await driver.findElements(By.css("div.row3 span.loc-wrap span.loc span.locWdth"));

            for (let i = 0; i < Math.min(companies.length, locations.length); i++) {
                let jobTitle = await jobs[i].getText().catch(() => "N/A");
                let companyName = await companies[i].getText().catch(() => "N/A");
                let location = await locations[i].getText().catch(() => "N/A");
                let shortLocation = location.split(",")[0].trim();

                if (!data.some(d => d["Company_Name"] === companyName && d["Location"] === shortLocation)) {
                    const mapsInfo = await getGoogleMapsData(driver, companyName, shortLocation);
                    const gstNumbers = await getGSTNumbers(driver, companyName, shortLocation);
                    let gstToSave = "N/A";

                    if (gstNumbers.length > 0) {
                        gstTracker[companyName] = gstTracker[companyName] || new Set();
                        for (let gst of gstNumbers) {
                            if (!gstTracker[companyName].has(gst)) {
                                gstToSave = gst;
                                gstTracker[companyName].add(gst);
                                break;
                            }
                        }
                    }

                    let record = {
                        "Job_Title": jobTitle,
                        "Company_Name": companyName,
                        "Location": shortLocation,
                        "Address": mapsInfo["Address"],
                        "Phone": mapsInfo["Phone"],
                        "Website": mapsInfo["Website"],
                        "GST Number(s)": gstToSave
                    };

                    data.push(record);
                    console.log(`Added: ${companyName} | GST: ${gstToSave}`);
                }
            }

            await saveData(filePath);

            try {
                let nextButton = await driver.wait(until.elementLocated(By.xpath("//a[span[text()='Next']]")), 10000);
                await driver.executeScript("arguments[0].click();", nextButton);
                await delay(3000);
            } catch {
                console.log("No more pages.");
                noMorePages = true;
            }
        }
    } finally {
        await driver.quit();
        console.log("Browser closed.");
        await saveData(filePath);
        console.log(`Final data saved in: ${filePath}`);
    }
})();
*/
/*
const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs-extra');
const path = require('path');
const xlsx = require('xlsx');
// const ExcelJS = require('exceljs');

let interrupted = false;
let data = [];
let gstTracker = {};

process.on('SIGINT', () => {
    console.log('\nScript interrupted! Saving the data...');
    interrupted = true;
});
process.on('SIGTERM', () => {
    console.log('\nScript terminated! Saving the data...');
    interrupted = true;
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeAds(driver) {
    try {
        let closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        console.log("[INFO] Closed popup ad (Type 1).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 1 popup not found.");
    }

    try {
        let dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        console.log("[INFO] Closed popup ad (Type 2).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 2 popup not found.");
    }
}

async function getGSTNumbers(driver, companyName, location) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get("https://findgst.in/gstin-by-name");

        await delay(2000);
        await closeAds(driver);

        let searchInput = await driver.wait(until.elementLocated(By.id("gstnumber")), 10000);
        await searchInput.clear();
        await searchInput.sendKeys(companyName);
        await driver.findElement(By.xpath("//input[@value='Find GST number']")).click();
        await delay(5000);
        await driver.executeScript("window.scrollBy(0, 800);");
        await delay(2000);

        let results = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of results) {
            let text = await block.getText();
            let matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error for ${companyName}: ${e}`);
    } finally {
        if ((await driver.getAllWindowHandles()).length > 1) {
            await driver.close();
            await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
            await delay(1000);
        }
    }
    return [...new Set(gstNumbers)];
}

async function getGoogleMapsData(driver, companyName, location) {
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get(`https://www.google.com/maps/search/${encodeURIComponent(companyName)} ${encodeURIComponent(location)}`);

        try {
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
        } catch {
            try {
                let firstResult = await driver.wait(until.elementLocated(By.xpath("(//a[contains(@href, '/place/')])[1]")), 15000);
                await driver.executeScript("arguments[0].click();", firstResult);
                await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
            } catch {
                throw new Error("No results found");
            }
        }

        let name = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText();
        let address = await driver.findElement(By.xpath("//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText().catch(() => "N/A");
        let website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute("href").catch(() => "N/A");
        let phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText().catch(() => "N/A");

        return {
            "Company_Name": name || companyName,
            "Address": address,
            "Phone": phone,
            "Website": website
        };
    } catch (e) {
        console.log(`[Maps] Error for ${companyName}: ${e}`);
        return {
            "Company_Name": companyName,
            "Address": "N/A",
            "Phone": "N/A",
            "Website": "N/A"
        };
    } finally {
        await driver.close();
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        await delay(2000);
    }
}

function getUniquexlsxPath(baseName) {
    const downloads = path.join(require("os").homedir(), "Downloads");
    const base = path.join(downloads, baseName + ".xlsx");
    if (!fs.existsSync(base)) return base;

    let i = 1;
    let newPath;
    do {
        newPath = path.join(downloads, `${baseName}(${i}).xlsx`);
        i++;
    } while (fs.existsSync(newPath));
    return newPath;
}

async function saveData(filePath) {
    if (data.length === 0) return;

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Naukri Data");
    xlsx.writeFile(workbook, filePath);

    console.log(`Saved ${data.length} records to: ${filePath}`);
}

(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();

    const industry = process.argv[2] || "IT Services";
    const city = process.argv[3] || "Mumbai";
    const fileName = `${industry}_${city}_Naukri`;
    const filePath = getUniquexlsxPath(fileName);

    try {
        await driver.get("https://www.naukri.com/nlogin/login?URL=https://www.naukri.com/mnjuser/homepage");
        await driver.wait(until.elementLocated(By.tagName("body")), 15000);
        await delay(5000);

        await driver.executeScript(`
            let overlays = document.querySelectorAll('.nI-gNb-sb__placeholder');
            overlays.forEach(el => el.remove());
        `);

        let searchInput = await driver.findElement(By.css(".suggestor-input"));
        await driver.executeScript("arguments[0].click();", searchInput);
        await searchInput.sendKeys(`${industry}, ${city}`);
        await driver.findElement(By.className("nI-gNb-sb__icon-wrapper")).click();
        await delay(5000);

        let noMorePages = false;

        while (!interrupted && !noMorePages) {
            await driver.executeScript("window.scrollBy(0, document.body.scrollHeight);");
            await delay(3000);

            let jobs = await driver.findElements(By.css("a.title"));
            let companies = await driver.findElements(By.css("div.row2 span a.comp-name"));
            let locations = await driver.findElements(By.css("div.row3 span.loc-wrap span.loc span.locWdth"));

            for (let i = 0; i < Math.min(companies.length, locations.length); i++) {
                let jobTitle = await jobs[i].getText().catch(() => "N/A");
                let companyName = await companies[i].getText().catch(() => "N/A");
                let location = await locations[i].getText().catch(() => "N/A");
                let shortLocation = location.split(",")[0].trim();

                if (!data.some(d => d["Company_Name"] === companyName && d["Location"] === shortLocation)) {
                    const mapsInfo = await getGoogleMapsData(driver, companyName, shortLocation);
                    const gstNumbers = await getGSTNumbers(driver, companyName, shortLocation);
                    let gstToSave = "N/A";

                    if (gstNumbers.length > 0) {
                        gstTracker[companyName] = gstTracker[companyName] || new Set();
                        for (let gst of gstNumbers) {
                            if (!gstTracker[companyName].has(gst)) {
                                gstToSave = gst;
                                gstTracker[companyName].add(gst);
                                break;
                            }
                        }
                    }

                    let record = {
                        "Job_Title": jobTitle,
                        "Company_Name": companyName,
                        "Location": shortLocation,
                        "Address": mapsInfo["Address"],
                        "Phone": mapsInfo["Phone"],
                        "Website": mapsInfo["Website"],
                        "GST Number(s)": gstToSave
                    };

                    data.push(record);
                    console.log(`Added: ${companyName} | GST: ${gstToSave}`);
                }
            }

            await saveData(filePath);

            try {
                let nextButton = await driver.wait(until.elementLocated(By.xpath("//a[span[text()='Next']]")), 10000);
                await driver.executeScript("arguments[0].click();", nextButton);
                await delay(3000);
            } catch {
                console.log("No more pages.");
                noMorePages = true;
            }
        }
    } finally {
        await driver.quit();
        console.log("Browser closed.");
        await saveData(filePath);
        console.log(`Final data saved in: ${filePath}`);
    }
})();
*/
import { Builder, By, Key, until } from 'selenium-webdriver';
import fs from 'fs-extra';
import path from 'path';
import xlsx from 'xlsx';
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await

const { join } = path; // destructuring join from path
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let interrupted = false;
let data = [];
let gstTracker = {};

process.on('SIGINT', () => {
    console.log('\nScript interrupted! Saving the data...');
    interrupted = true;
});
process.on('SIGTERM', () => {
    console.log('\nScript terminated! Saving the data...');
    interrupted = true;
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeAds(driver) {
    try {
        let closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        console.log("[INFO] Closed popup ad (Type 1).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 1 popup not found.");
    }

    try {
        let dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        console.log("[INFO] Closed popup ad (Type 2).");
        await delay(1000);
    } catch {
        console.log("[INFO] Type 2 popup not found.");
    }
}

async function getGSTNumbers(driver, companyName, location) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get("https://findgst.in/gstin-by-name");

        await delay(2000);
        await closeAds(driver);

        let searchInput = await driver.wait(until.elementLocated(By.id("gstnumber")), 10000);
        await searchInput.clear();
        await searchInput.sendKeys(companyName);
        await driver.findElement(By.xpath("//input[@value='Find GST number']")).click();
        await delay(5000);
        await driver.executeScript("window.scrollBy(0, 800);");
        await delay(2000);

        let results = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of results) {
            let text = await block.getText();
            let matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error for ${companyName}: ${e}`);
    } finally {
        if ((await driver.getAllWindowHandles()).length > 1) {
            await driver.close();
            await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
            await delay(1000);
        }
    }
    return [...new Set(gstNumbers)];
}

async function getGoogleMapsData(driver, companyName, location) {
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get(`https://www.google.com/maps/search/${encodeURIComponent(companyName)} ${encodeURIComponent(location)}`);

        try {
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
        } catch {
            try {
                let firstResult = await driver.wait(until.elementLocated(By.xpath("(//a[contains(@href, '/place/')])[1]")), 15000);
                await driver.executeScript("arguments[0].click();", firstResult);
                await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 15000);
            } catch {
                throw new Error("No results found");
            }
        }

        let name = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText();
        let address = await driver.findElement(By.xpath("//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText().catch(() => "N/A");
        let website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute("href").catch(() => "N/A");
        let phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText().catch(() => "N/A");

        return {
            "Company_Name": name || companyName,
            "Address": address,
            "Phone": phone,
            "Website": website
        };
    } catch (e) {
        console.log(`[Maps] Error for ${companyName}: ${e}`);
        return {
            "Company_Name": companyName,
            "Address": "N/A",
            "Phone": "N/A",
            "Website": "N/A"
        };
    } finally {
        await driver.close();
        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
        await delay(2000);
    }
}

function getUniquexlsxPath(baseName) {
    const downloadsFolder = path.join(__dirname, "exports");
    if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder);

    const base = path.join(downloads, baseName + ".xlsx");
    if (!fs.existsSync(base)) return base;

    let i = 1;
    let newPath;
    do {
        newPath = path.join(downloads, `${baseName}(${i}).xlsx`);
        i++;
    } while (fs.existsSync(newPath));
    return newPath;
}

// Database connection configuration

// Load the certificate (adjusted path to go up one directory)
let ca;
try {
    ca = fs.readFileSync(path.join(__dirname, "..", "certs", "isrgrootx1.pem"));
} catch (err) {
    console.error("Error loading certificate:", err.message);
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
                record["Company_Name"],
                record["Location"],
                record["Job_Title"],
                record["Address"],
                record["Phone"],
                record["Website"],
                record["GST Number(s)"]
            ]);
        }
        console.log(`Saved ${data.length} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

async function saveData(filePath) {
    await saveDataToDatabase(); // Save to database first
    if (data.length === 0) return;

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Naukri Data");
    xlsx.writeFile(workbook, filePath);

    console.log(`Saved ${data.length} records to: ${filePath}`);
}

(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();

    const industry = process.argv[2] || "IT Services";
    const city = process.argv[3] || "Mumbai";
    const fileName = `${industry}_${city}_Naukri`;
    const filePath = getUniquexlsxPath(fileName);

    try {
        await driver.get("https://www.naukri.com/nlogin/login?URL=https://www.naukri.com/mnjuser/homepage");
        await driver.wait(until.elementLocated(By.tagName("body")), 15000);
        await delay(5000);

        await driver.executeScript(`
            let overlays = document.querySelectorAll('.nI-gNb-sb__placeholder');
            overlays.forEach(el => el.remove());
        `);

        let searchInput = await driver.findElement(By.css(".suggestor-input"));
        await driver.executeScript("arguments[0].click();", searchInput);
        await searchInput.sendKeys(`${industry}, ${city}`);
        await driver.findElement(By.className("nI-gNb-sb__icon-wrapper")).click();
        await delay(5000);

        let noMorePages = false;

        while (!interrupted && !noMorePages) {
            await driver.executeScript("window.scrollBy(0, document.body.scrollHeight);");
            await delay(3000);

            let jobs = await driver.findElements(By.css("a.title"));
            let companies = await driver.findElements(By.css("div.row2 span a.comp-name"));
            let locations = await driver.findElements(By.css("div.row3 span.loc-wrap span.loc span.locWdth"));

            for (let i = 0; i < Math.min(companies.length, locations.length); i++) {
                let jobTitle = await jobs[i].getText().catch(() => "N/A");
                let companyName = await companies[i].getText().catch(() => "N/A");
                let location = await locations[i].getText().catch(() => "N/A");
                let shortLocation = location.split(",")[0].trim();

                if (!data.some(d => d["Company_Name"] === companyName && d["Location"] === shortLocation)) {
                    const mapsInfo = await getGoogleMapsData(driver, companyName, shortLocation);
                    const gstNumbers = await getGSTNumbers(driver, companyName, shortLocation);
                    let gstToSave = "N/A";

                    if (gstNumbers.length > 0) {
                        gstTracker[companyName] = gstTracker[companyName] || new Set();
                        for (let gst of gstNumbers) {
                            if (!gstTracker[companyName].has(gst)) {
                                gstToSave = gst;
                                gstTracker[companyName].add(gst);
                                break;
                            }
                        }
                    }

                    let record = {
                        "Job_Title": jobTitle,
                        "Company_Name": companyName,
                        "Location": shortLocation,
                        "Address": mapsInfo["Address"],
                        "Phone": mapsInfo["Phone"],
                        "Website": mapsInfo["Website"],
                        "GST Number(s)": gstToSave
                    };

                    data.push(record);
                    console.log(`Added: ${companyName} | GST: ${gstToSave}`);
                }
            }

            await saveData(filePath);

            try {
                let nextButton = await driver.wait(until.elementLocated(By.xpath("//a[span[text()='Next']]")), 10000);
                await driver.executeScript("arguments[0].click();", nextButton);
                await delay(3000);
            } catch {
                console.log("No more pages.");
                noMorePages = true;
            }
        }
    } finally {
        await driver.quit();
        console.log("Browser closed.");
        await saveData(filePath);
        console.log(`Final data saved in: ${filePath}`);
    }
})();
