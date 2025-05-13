/*const { Builder, By, until, Key } = require('selenium-webdriver');
const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await

const industry = process.argv[2];
const city = process.argv[3];

if (!industry || !city) {
  console.error("Usage: node glassdoor_scraper.js <industry> <city>");
  process.exit(1);
}

const downloadsFolder = path.join(os.homedir(), '/Downloads');
let baseName = `${industry}_${city}_Glassdoor.xlsx`;
let filePath = path.join(downloadsFolder, baseName);
let fileCount = 1;

while (fs.existsSync(filePath)) {
  baseName = `${industry}_${city}_Glassdoor(${fileCount}).xlsx`;
  filePath = path.join(downloadsFolder, baseName);
  fileCount++;
}

const data = [["Job_Title", "Company", "Location", "Address", "Phone", "Website", "GST Number(s)"]];
const existingJobs = new Set();
const gstTracker = {};

const sleep = ms => new Promise(res => setTimeout(res, ms));

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'corporate_db' // Replace with your database name
};

async function saveDataToDatabase() {
    if (data.length <= 1) return; // Skip if only headers exist

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        for (let i = 1; i < data.length; i++) { // Start from index 1 to skip headers
            const row = data[i];
            const query = `
                INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(query, [
                row[1], // Job_Title1
                row[2], // Company_Name2
                row[0], // Location0
                row[3], // Address
                row[4], // Phone
                row[5], // Website
                row[6]  // GST Number(s)
            ]);
        }
        console.log(`Saved ${data.length - 1} records to database.`);
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
    await sleep(1000);
  } catch {}

  try {
    const dismissBtn = await driver.wait(until.elementLocated(By.xpath("//div[@id='dismiss-button']")), 5000);
    await dismissBtn.click();
    await sleep(1000);
  } catch {}
}

async function closeGlassdoorSignupPopup(driver) {
    try {
      const popup = await driver.findElement(By.xpath("//div[@data-test='authModalContainerV2-content']"));
      if (popup) {
        const closeBtn = await popup.findElement(By.xpath(".//button[contains(@class, 'CloseButton')]"));
        await closeBtn.click();
        console.log("[INFO] Closed Glassdoor signup/login modal.");
        await sleep(1000);
      }
    } catch {
      // Popup not found, continue silently
    }
  }
  

async function getGstNumbers(driver, companyName) {
  let gstNumbers = [];

  try {
    await driver.executeScript("window.open('');");
    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);
    await driver.get("https://findgst.in/gstin-by-name");

    await sleep(2000);
    await closeAds(driver);

    const searchInput = await driver.wait(until.elementLocated(By.id("gstnumber")), 10000);
    await searchInput.clear();
    await searchInput.sendKeys(companyName);

    await driver.findElement(By.xpath("//input[@value='Find GST number']")).click();
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0, 800);");
    await sleep(2000);

    const resultBlocks = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
    for (let block of resultBlocks) {
      const text = await block.getText();
      const matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
      if (matches) gstNumbers.push(...matches);
    }

  } catch (e) {
    console.log(`[GST] Error for ${companyName}: ${e.message}`);
  } finally {
    const handles = await driver.getAllWindowHandles();
    if (handles.length > 1) {
      await driver.close();
      await driver.switchTo().window(handles[0]);
      await sleep(1000);
    }
  }

  if (gstNumbers.length > 0) {
    if (!gstTracker[companyName]) gstTracker[companyName] = new Set();
    for (let gst of gstNumbers) {
      if (!gstTracker[companyName].has(gst)) {
        gstTracker[companyName].add(gst);
        return gst;
      }
    }
  }

  return "N/A";
}

async function getGoogleMapsData(driver, companyName, location) {
  try {
    await driver.executeScript("window.open('');");
    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);
    await driver.get(`https://www.google.com/maps/search/${companyName} ${location}`);
    await sleep(3000);

    try {
      await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 10000);
    } catch {
      const firstResult = await driver.wait(until.elementLocated(By.xpath("(//a[contains(@href, '/place/')])[1]")), 10000);
      await firstResult.click();
      await driver.wait(until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")), 10000);
    }

    const name = await driver.findElement(By.xpath("//h1[@class='DUwDvf lfPIob']")).getText().catch(() => companyName);
    const address = await driver.findElement(By.xpath("//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]")).getText().catch(() => "N/A");
    const website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute("href").catch(() => "N/A");
    const phone = await driver.findElement(By.xpath("//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]")).getText().catch(() => "N/A");

    return { name, address, phone, website };
  } catch (e) {
    console.log(`[Maps] Error: ${e.message}`);
    return { name: companyName, address: "N/A", phone: "N/A", website: "N/A" };
  } finally {
    const handles = await driver.getAllWindowHandles();
    if (handles.length > 1) {
      await driver.close();
      await driver.switchTo().window(handles[0]);
      await sleep(2000);
    }
  }
}

async function scrapeGlassdoor() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get("https://www.glassdoor.co.in/Job/index.htm");
    const wait = driver.wait(until.elementLocated(By.xpath("//input[@id='searchBar-jobTitle']")), 15000);
    await wait.sendKeys(industry);
    const locationInput = await driver.findElement(By.xpath("//input[@id='searchBar-location']"));
    await locationInput.sendKeys(city, Key.RETURN);
    await sleep(5000);

    while (true) {
      await closeAds(driver);
      await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
      await sleep(5000);

      const jobCards = await driver.findElements(By.xpath("//div[contains(@class, 'JobCard_jobCardContainer__arQlW')]"));
      let newDataFound = false;

      for (const job of jobCards) {
        try {
          const title = await job.findElement(By.xpath(".//a[contains(@class, 'JobCard_jobTitle')]")).getText();
          if (existingJobs.has(title)) continue;

          const company = await job.findElement(By.xpath(".//span[contains(@class, 'EmployerProfile_compactEmployerName')]")).getText();
          const location = await job.findElement(By.xpath(".//div[contains(@class, 'JobCard_location')]")).getText();
          const selectedLoc = location.split(',')[0].trim();

          const maps = await getGoogleMapsData(driver, company, selectedLoc);
          const gst = await getGstNumbers(driver, company);

          data.push([title, company, location, maps.address, maps.phone, maps.website, gst]);
          existingJobs.add(title);
          console.log(`Saved: ${title} | ${company} | GST: ${gst}`);
          newDataFound = true;

        } catch (e) {
          console.log("Job parsing error:", e.message);
        }
      }

      await saveDataToDatabase(); // Save to database

      try {
        const loadMore = await driver.findElement(By.xpath("//button[@data-test='load-more']"));
        await loadMore.click();
        await sleep(5000);
        await closeGlassdoorSignupPopup(driver); // 🔥 NEW popup handler
      } catch {
        if (!newDataFound) break;
      }
    }

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");
    xlsx.writeFile(workbook, filePath);
    console.log(`Excel saved: ${filePath}`);
  } catch (e) {
    console.error("Error during scraping:", e.message);
  } finally {
    await driver.quit();
  }
}

scrapeGlassdoor();*/

const { Builder, By, until, Key } = require('selenium-webdriver');
const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await

const industry = process.argv[2];
const city = process.argv[3];

if (!industry || !city) {
    console.error('Usage: node glassdoor_scraper.js <industry> <city>');
    process.exit(1);
}

const downloadsFolder = path.join(os.homedir(), 'Downloads');
let baseName = `${industry}_${city}_Glassdoor.xlsx`;
let filePath = path.join(downloadsFolder, baseName);
let fileCount = 1;

while (fs.existsSync(filePath)) {
    baseName = `${industry}_${city}_Glassdoor(${fileCount}).xlsx`;
    filePath = path.join(downloadsFolder, baseName);
    fileCount++;
}

const data = [
    [
        'Job_Title',
        'Company_Name',
        'Location',
        'Address',
        'Phone',
        'Website',
        'GST Number(s)',
    ],
];
const existingJobs = new Set();
const gstTracker = {};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const ca = fs.readFileSync(join(__dirname, 'certs', 'isrgrootx1.pem'));

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', // Replace with your MySQL username2
    password: process.env.DB_PASS || 'VD12@cstl', // Replace with your MySQL password
    database: process.env.DB_NAME || 'mydatabase',
    ssl: {
        ca: ca,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, // Replace with your database name
};

async function saveDataToDatabase() {
    if (data.length <= 1) return; // Skip if only headers exist

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        for (let i = 1; i < data.length; i++) {
            // Start from index 1 to skip headers
            const row = data[i];
            const query = `
              INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number)
              VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
            await connection.execute(query, [
                row[1], // Job_Title1
                row[2], // Company_Name2
                row[0], // Location0
                row[3], // Address
                row[4], // Phone
                row[5], // Website
                row[6], // GST Number(s)
            ]);
        }
        console.log(`Saved ${data.length - 1} records to database.`);
    } catch (e) {
        console.error(`[DB] Error saving data: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

async function closeAds(driver) {
    try {
        const closeBtn = await driver.wait(
            until.elementLocated(
                By.xpath("//span[contains(@class, 'ns-') and text()='Close']")
            ),
            5000
        );
        await closeBtn.click();
        await sleep(1000);
    } catch {}

    try {
        const dismissBtn = await driver.wait(
            until.elementLocated(By.xpath("//div[@id='dismiss-button']")),
            5000
        );
        await dismissBtn.click();
        await sleep(1000);
    } catch {}
}

async function closeGlassdoorSignupPopup(driver) {
    try {
        const popup = await driver.findElement(
            By.xpath("//div[@data-test='authModalContainerV2-content']")
        );
        if (popup) {
            const closeBtn = await popup.findElement(
                By.xpath(".//button[contains(@class, 'CloseButton')]")
            );
            await closeBtn.click();
            console.log('[INFO] Closed Glassdoor signup/login modal.');
            await sleep(1000);
        }
    } catch {
        // Popup not found, continue silently
    }
}

async function getGstNumbers(driver, companyName) {
    let gstNumbers = [];

    try {
        await driver.executeScript("window.open('');");
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        await driver.get('https://findgst.in/gstin-by-name');

        await sleep(2000);
        await closeAds(driver);

        const searchInput = await driver.wait(
            until.elementLocated(By.id('gstnumber')),
            10000
        );
        await searchInput.clear();
        await searchInput.sendKeys(companyName);

        await driver
            .findElement(By.xpath("//input[@value='Find GST number']"))
            .click();
        await sleep(3000);
        await driver.executeScript('window.scrollBy(0, 800);');
        await sleep(2000);

        const resultBlocks = await driver.findElements(
            By.xpath(
                "//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"
            )
        );
        for (let block of resultBlocks) {
            const text = await block.getText();
            const matches = text.match(
                /\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g
            );
            if (matches) gstNumbers.push(...matches);
        }
    } catch (e) {
        console.log(`[GST] Error for ${companyName}: ${e.message}`);
    } finally {
        const handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.close();
            await driver.switchTo().window(handles[0]);
            await sleep(1000);
        }
    }

    if (gstNumbers.length > 0) {
        if (!gstTracker[companyName]) gstTracker[companyName] = new Set();
        for (let gst of gstNumbers) {
            if (!gstTracker[companyName].has(gst)) {
                gstTracker[companyName].add(gst);
                return gst;
            }
        }
    }

    return 'N/A';
}

async function getGoogleMapsData(driver, companyName, location) {
    try {
        await driver.executeScript("window.open('');");
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        await driver.get(
            `https://www.google.com/maps/search/${companyName} ${location}`
        );
        await sleep(3000);

        try {
            await driver.wait(
                until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")),
                10000
            );
        } catch {
            const firstResult = await driver.wait(
                until.elementLocated(
                    By.xpath("(//a[contains(@href, '/place/')])[1]")
                ),
                10000
            );
            await firstResult.click();
            await driver.wait(
                until.elementLocated(By.xpath("//h1[@class='DUwDvf lfPIob']")),
                10000
            );
        }

        const name = await driver
            .findElement(By.xpath("//h1[@class='DUwDvf lfPIob']"))
            .getText()
            .catch(() => companyName);
        const address = await driver
            .findElement(
                By.xpath(
                    "//div[contains(@class,'Io6YTe') and contains(@class, 'fontBodyMedium')]"
                )
            )
            .getText()
            .catch(() => 'N/A');
        const website = await driver
            .findElement(By.xpath("//a[contains(@aria-label, 'Website')]"))
            .getAttribute('href')
            .catch(() => 'N/A');
        const phone = await driver
            .findElement(
                By.xpath(
                    "//div[starts-with(text(), '0') and contains(@class, 'Io6YTe')]"
                )
            )
            .getText()
            .catch(() => 'N/A');

        return { name, address, phone, website };
    } catch (e) {
        console.log(`[Maps] Error: ${e.message}`);
        return {
            name: companyName,
            address: 'N/A',
            phone: 'N/A',
            website: 'N/A',
        };
    } finally {
        const handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.close();
            await driver.switchTo().window(handles[0]);
            await sleep(2000);
        }
    }
}

async function scrapeGlassdoor() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.glassdoor.co.in/Job/index.htm');
        const wait = driver.wait(
            until.elementLocated(By.xpath("//input[@id='searchBar-jobTitle']")),
            15000
        );
        await wait.sendKeys(industry);
        const locationInput = await driver.findElement(
            By.xpath("//input[@id='searchBar-location']")
        );
        await locationInput.sendKeys(city, Key.RETURN);
        await sleep(5000);

        while (true) {
            await closeAds(driver);
            await driver.executeScript(
                'window.scrollTo(0, document.body.scrollHeight);'
            );
            await sleep(5000);

            const jobCards = await driver.findElements(
                By.xpath(
                    "//div[contains(@class, 'JobCard_jobCardContainer__arQlW')]"
                )
            );
            let newDataFound = false;

            for (const job of jobCards) {
                try {
                    const title = await job
                        .findElement(
                            By.xpath(
                                ".//a[contains(@class, 'JobCard_jobTitle')]"
                            )
                        )
                        .getText();
                    if (existingJobs.has(title)) continue;

                    const company = await job
                        .findElement(
                            By.xpath(
                                ".//span[contains(@class, 'EmployerProfile_compactEmployerName')]"
                            )
                        )
                        .getText();
                    const location = await job
                        .findElement(
                            By.xpath(
                                ".//div[contains(@class, 'JobCard_location')]"
                            )
                        )
                        .getText();
                    const selectedLoc = location.split(',')[0].trim();

                    const maps = await getGoogleMapsData(
                        driver,
                        company,
                        selectedLoc
                    );
                    const gst = await getGstNumbers(driver, company);

                    data.push([
                        title,
                        company,
                        location,
                        maps.address,
                        maps.phone,
                        maps.website,
                        gst,
                    ]);
                    existingJobs.add(title);
                    console.log(`Saved: ${title} | ${company} | GST: ${gst}`);
                    newDataFound = true;
                } catch (e) {
                    console.log('Job parsing error:', e.message);
                }
            }
            await saveDataToDatabase();
            try {
                const loadMore = await driver.findElement(
                    By.xpath("//button[@data-test='load-more']")
                );
                await loadMore.click();
                await sleep(5000);
                await closeGlassdoorSignupPopup(driver); // 🔥 NEW popup handler
            } catch {
                if (!newDataFound) break;
            }
        }

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Jobs');
        xlsx.writeFile(workbook, filePath);
        console.log(`Excel saved: ${filePath}`);
    } catch (e) {
        console.error('Error during scraping:', e.message);
    } finally {
        try {
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.aoa_to_sheet(data);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Jobs');
            xlsx.writeFile(workbook, filePath);
            console.log(`Partial data saved to Excel: ${filePath}`);
        } catch (saveError) {
            console.error('Failed to save Excel:', saveError.message);
        }

        try {
            await driver.quit();
        } catch {}
    }
}

scrapeGlassdoor();
