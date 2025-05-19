import { Builder, By, Key, until } from 'selenium-webdriver';
import fs from 'fs-extra';
import path from 'path';
import xlsx from 'xlsx';
import mysql from 'mysql2/promise';



let interrupted = false;
let data = [];
let uniqueJobs = new Set();
let gstTracker = {};

const industry = process.argv[2] || "Software Development";
const city = process.argv[3] || "Bangalore";

const downloadsFolder = path.join(__dirname, "exports");
if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder);

const baseFileName = `${industry}_${city}_Hirist_Enriched.xlsx`;

function getNextAvailableFilename(basePath, fileName) {
    const name = path.basename(fileName, '.xlsx');
    const ext = '.xlsx';
    let counter = 1;
    let candidate = path.join(basePath, fileName);
    while (fs.existsSync(candidate)) {
        candidate = path.join(basePath, `${name}(${counter})${ext}`);
        counter++;
    }
    return candidate;
}

const filePath = getNextAvailableFilename(downloadsFolder, baseFileName);

function saveData() {
    if (data.length > 0) {
        const desiredOrder = ['Job_Title', 'Company_Name', 'Location', 'Address', 'Phone', 'Website', 'GST Number(s)'];
        const orderedData = data.map(row => {
            const orderedRow = {};
            for (let key of desiredOrder) {
                orderedRow[key] = row[key] || '';
            }
            return orderedRow;
        });
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");
        xlsx.writeFile(workbook, filePath);
        console.log(`Data saved to: ${filePath}`);
    }
}

process.on('SIGINT', () => {
    console.log("\nInterrupted. Saving data...");
    interrupted = true;
    saveData();
});

// ---------------------- AD Popups --------------------- //
async function closeAds(driver) {
    try {
        const closeBtn = await driver.wait(until.elementLocated(By.xpath("//span[contains(@class, 'ns-') and text()='Close']")), 5000);
        await closeBtn.click();
        console.log("[INFO] Closed popup ad (Type 1).");
    } catch (e) {
        console.log("[INFO] Type 1 popup not found.");
    }

    try {
        const dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
        await dismissBtn.click();
        console.log("[INFO] Closed popup ad (Type 2).");
    } catch (e) {
        console.log("[INFO] Type 2 popup not found.");
    }
}

// ---------------------- GST SCRAPER --------------------- //
async function getGstNumbers(driver, companyName) {
    let gstNumbers = [];
    try {
        await driver.executeScript("window.open('');");
        await driver.switchTo().window((await driver.getAllWindowHandles())[1]);
        await driver.get("https://findgst.in/gstin-by-name");
        await driver.sleep(2000);
        await closeAds(driver);

        const input = await driver.wait(until.elementLocated(By.id("gstnumber")), 10000);
        await input.clear();
        await input.sendKeys(companyName);
        await driver.findElement(By.xpath("//input[@value='Find GST number']")).click();
        await driver.sleep(3000);

        await driver.executeScript("window.scrollBy(0, 800);");
        await driver.sleep(2000);

        const results = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
        for (let block of results) {
            const text = await block.getText();
            const matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error for ${companyName}:`, e.message);
    } finally {
        const handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.close();
            await driver.switchTo().window(handles[0]);
        }
    }
    return [...new Set(gstNumbers)];
}

// ---------------- GOOGLE MAPS SCRAPER ---------------- //
async function getGoogleMapsData(companyName, location, driver) {
    try {
        await driver.executeScript("window.open('');");
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[handles.length - 1]);

        const searchQuery = `${companyName} ${location}`;
        await driver.get(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`);
        await driver.sleep(5000);

        try {
            const firstResult = await driver.findElement(By.xpath("(//a[contains(@href, '/place/')])[1]"));
            await driver.executeScript("arguments[0].click();", firstResult);
            await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 5000);
            await driver.sleep(3000);
        } catch { }

        let name = companyName, address = "N/A", phone = "N/A", website = "N/A";

        try {
            name = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText();
        } catch { }

        try {
            address = await driver.findElement(By.xpath("//div[contains(@class, 'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText();
        } catch { }

        try {
            const websiteElem = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]"));
            website = await websiteElem.getAttribute("href");
        } catch { }

        try {
            phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText();
        } catch { }

        return { "Address": address, "Phone": phone, "Website": website };
    } catch (e) {
        console.log(`[Google Maps] Error for ${companyName}:`, e.message);
        return { "Company_Name": companyName, "Address": "N/A", "Phone": "N/A", "Website": "N/A" };
    } finally {
        const handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.close();
            await driver.switchTo().window(handles[0]);
        }
    }
}

// ---------------- MAIN SCRAPER ---------------- //
(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get("https://www.hirist.tech/");
        await driver.wait(until.elementLocated(By.tagName("body")), 15000);
        console.log("Page loaded.");
        await driver.sleep(2000);

        await driver.executeScript(`
            document.querySelectorAll('.nI-gNb-sb__placeholder').forEach(el => el.remove());
        `);

        const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search Jobs']"));
        await searchInput.sendKeys(`${industry}, ${city}`, Key.ENTER);
        await driver.sleep(5000);

        let prevCount = 0, noNewScrolls = 0;

        while (!interrupted && noNewScrolls < 5) {
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            await driver.sleep(3000);

            const jobs = await driver.findElements(By.xpath("//*[contains(@class, 'job-description')]"));
            if (jobs.length === prevCount) {
                noNewScrolls++;
            } else {
                noNewScrolls = 0;
                prevCount = jobs.length;
            }

            for (let job of jobs) {
                if (interrupted) break;
                try {
                    const titleEl = await job.findElement(By.css("div.job-description .job-title a"));
                    const title = await titleEl.getText();
                    const jobLink = await titleEl.getAttribute("href");
                    const jobKey = `${title}-${jobLink}`;
                    if (uniqueJobs.has(jobKey)) continue;
                    uniqueJobs.add(jobKey);

                    await driver.executeScript("window.open(arguments[0]);", jobLink);
                    const handles = await driver.getAllWindowHandles();
                    await driver.switchTo().window(handles[handles.length - 1]);
                    await driver.sleep(3000);

                    let company = "Not Provided", location = "N/A";
                    try {
                        company = await driver.findElement(By.xpath("//*[@id='observer-div']/div/div[3]/div[2]/div/div/div[2]/a[1]")).getText();
                    } catch { }
                    try {
                        location = await driver.findElement(By.xpath("//*[@id='location']")).getText();
                    } catch { }

                    const selectedLocation = location.split(',')[0].trim();

                    await driver.close();
                    await driver.switchTo().window(handles[0]);

                    const mapsData = await getGoogleMapsData(company, selectedLocation, driver);
                    const gstNumbers = await getGstNumbers(driver, company, selectedLocation);

                    let gstToSave = "N/A";
                    if (gstNumbers.length) {
                        if (!gstTracker[company]) gstTracker[company] = new Set();
                        for (const gst of gstNumbers) {
                            if (!gstTracker[company].has(gst)) {
                                gstToSave = gst;
                                gstTracker[company].add(gst);
                                break;
                            }
                        }
                    }

                    const fullRecord = {
                        "Job_Title": title,
                        "Company_Name": company,         // from Hirist, preserved
                        "Location": selectedLocation,
                        "Address": mapsData.Address || "N/A",
                        "Phone": mapsData.Phone || "N/A",
                        "Website": mapsData.Website || "N/A",
                        "GST Number(s)": gstToSave
                    };


                    data.push(fullRecord);
                    console.log(`Scraped: ${title} -> ${company} -> ${location} | GST: ${gstToSave}`);
                    saveData();
                } catch (err) {
                    console.log("Error scraping job:", err.message);
                }
            }
        }

    } catch (err) {
        console.error("Unexpected error:", err);
    } finally {
        await driver.quit();
        saveData();
        console.log("Driver closed.");
    }
})();

// Database connection configuration
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

async function saveData() {
    await saveDataToDatabase(); // Save to database first
    if (data.length > 0) {
        const desiredOrder = ['Job_Title', 'Company_Name', 'Location', 'Address', 'Phone', 'Website', 'GST Number(s)'];
        const orderedData = data.map(row => {
            const orderedRow = {};
            for (let key of desiredOrder) {
                orderedRow[key] = row[key] || '';
            }
            return orderedRow;
        });
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");
        xlsx.writeFile(workbook, filePath);
        console.log(`Data saved to: ${filePath}`);
    }
}