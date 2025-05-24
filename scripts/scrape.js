import fs from "fs/promises";
import path from "path";
import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up download folder
const downloadsFolder = path.join(__dirname, "exports");
if (!await fs.access(downloadsFolder).catch(() => false)) {
    await fs.mkdir(downloadsFolder);
}

// Get CLI arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error("Usage: node scrap.js <state_name> <district_name>");
    process.exit(1);
}

const STATE_NAME = args[0];
const DISTRICT_NAME = args[1];
console.log(`Scraping data for ${STATE_NAME}, ${DISTRICT_NAME}`);

// Setup paths and filenames
const safeState = STATE_NAME.replace(/\W+/g, "");
const safeDistrict = DISTRICT_NAME.replace(/\W+/g, "");
const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
const excelFile = path.join(downloadsFolder, `${safeState}_${safeDistrict}_${timestamp}.xlsx`);
console.log(`Saving data to: ${excelFile}`);

// Excel setup
const columns = [
    "File",
    "College Name",
    "State",
    "District",
    "Course",
    "Annual Fees",
    "Placement Fees",
    "Address",
    "Phone"
];

const createWorkbook = async () => {
    const workbook = xlsx.utils.book_new();
    const sheetData = [columns];
    const worksheet = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    await fs.writeFile(excelFile, xlsx.write(workbook, { type: "buffer" }));
};

const appendToWorkbook = async (rows) => {
    const workbook = xlsx.readFile(excelFile);
    const sheet = workbook.Sheets["Sheet1"];
    const newRows = rows.map(row => row.map(cell => cell || ""));
    xlsx.utils.sheet_add_aoa(sheet, newRows, { origin: -1 });
    await fs.writeFile(excelFile, xlsx.write(workbook, { type: "buffer" }));
};

// Main scraping logic
(async function scrape() {
    await createWorkbook();

    const options = new chrome.Options();
    options.addArguments("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        await driver.get("https://dashboard.aishe.gov.in/hedirectory/#/institutionDirectory/universityDetails/C/ALL");

        // Wait for page to load
        await driver.wait(until.elementLocated(By.tagName("body")), 25000);

        // Handle loading screen
        try {
            await driver.wait(until.elementLocated(By.className("loadermainbg")), 10000);
            await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("loadermainbg"))), 20000);
        } catch {
            await driver.executeScript("document.querySelector('.loadermainbg').style.display='none';");
        }

        const clickWithJs = async (element) => {
            await driver.executeScript("arguments[0].scrollIntoView();", element);
            await driver.executeScript("arguments[0].click();", element);
        };

        // State selection
        const stateDropdown = await driver.wait(
            until.elementLocated(By.css('mat-select[formcontrolname="state1"]')),
            15000
        );
        await clickWithJs(stateDropdown);

        const stateSearch = await driver.wait(
            until.elementLocated(By.css('input[formcontrolname="value"]')),
            10000
        );
        await stateSearch.sendKeys(STATE_NAME, Key.RETURN);

        const stateOption = await driver.wait(
            until.elementLocated(By.xpath(`//mat-option/span[contains(., '${STATE_NAME}')]`)),
            10000
        );
        await clickWithJs(stateOption);
        console.log(`✅ Selected state: ${STATE_NAME}`);

        // District selection
        await driver.sleep(2000); // Brief pause for dropdowns to update
        const districtDropdown = await driver.wait(
            until.elementLocated(By.css('mat-select[formcontrolname="district1"]')),
            15000
        );
        await clickWithJs(districtDropdown);

        const districtSearch = await driver.wait(
            until.elementLocated(By.css('input[formcontrolname="value"]')),
            10000
        );
        await districtSearch.sendKeys(DISTRICT_NAME, Key.RETURN);

        const districtOption = await driver.wait(
            until.elementLocated(By.xpath(`//mat-option/span[contains(., '${DISTRICT_NAME}')]`)),
            10000
        );
        await clickWithJs(districtOption);
        console.log(`✅ Selected district: ${DISTRICT_NAME}`);

        // Wait for data load
        await driver.wait(until.elementLocated(By.css("mat-table")), 20000);

        // Scrape college data
        const uniqueColleges = new Set();
        let page = 1;

        while (true) {
            const rows = await driver.findElements(By.css("mat-row"));
            const data = [];

            for (const row of rows) {
                const cells = await row.findElements(By.css("mat-cell"));
                if (cells.length >= 11) {
                    const collegeName = (await cells[1].getText()).trim();

                    if (!uniqueColleges.has(collegeName)) {
                        uniqueColleges.add(collegeName);
                        data.push([
                            path.basename(excelFile),
                            collegeName,
                            STATE_NAME,
                            DISTRICT_NAME,
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]);
                    }
                }
            }

            if (data.length > 0) {
                console.log(`✅ Page ${page++}: Scraped ${data.length} colleges`);
                await appendToWorkbook(data);
            }

            // Pagination handling
            const nextBtn = await driver.findElement(By.css("button.mat-mdc-paginator-navigation-next"));
            if (await nextBtn.getAttribute("disabled")) break;
            await clickWithJs(nextBtn);
            await driver.sleep(3000);
        }

        console.log("✅ Scraping completed. Starting Google Maps lookups...");

        // Google Maps lookup for address and phone
        const workbook = xlsx.readFile(excelFile);
        const sheet = workbook.Sheets["Sheet1"];
        const jsonData = xlsx.utils.sheet_to_json(sheet).slice(1); // Skip header row

        for (const [index, row] of jsonData.entries()) {
            const collegeName = row["College Name"];
            if (!collegeName) continue;

            console.log(`Fetching details for: ${collegeName}...`);
            let newPage;
            try {
                newPage = await new Builder()
                    .forBrowser("chrome")
                    .setChromeOptions(options)
                    .build();

                await newPage.get("https://www.google.com/maps");
                await newPage.wait(until.elementLocated(By.id("searchboxinput")), 10000);
                const searchBox = await newPage.findElement(By.id("searchboxinput"));
                await searchBox.clear();
                await searchBox.sendKeys(collegeName, Key.RETURN);
                await newPage.wait(until.elementLocated(By.css("button[data-item-id='address']")), 10000);

                const address = await newPage
                    .findElement(By.css("button[data-item-id='address']"))
                    .then(el => el.getAttribute("aria-label"))
                    .then(label => label.replace("Address: ", "").trim())
                    .catch(() => "N/A");

                const phone = await newPage
                    .findElement(By.css("button[data-item-id^='phone']"))
                    .then(el => el.getAttribute("aria-label"))
                    .then(label => label.replace("Phone: ", "").trim())
                    .catch(() => "N/A");

                // Update the row in the Excel file
                const cellAddress = `H${index + 2}`; // Address column
                const cellPhone = `I${index + 2}`; // Phone column
                sheet[cellAddress] = { t: "s", v: address };
                sheet[cellPhone] = { t: "s", v: phone };
            } catch (e) {
                console.error(`Error fetching details for ${collegeName}:`, e.message);
                const cellAddress = `H${index + 2}`;
                const cellPhone = `I${index + 2}`;
                sheet[cellAddress] = { t: "s", v: "N/A" };
                sheet[cellPhone] = { t: "s", v: "N/A" };
            } finally {
                if (newPage) await newPage.quit();
            }
        }

        // Write updated Excel file
        await fs.writeFile(excelFile, xlsx.write(workbook, { type: "buffer" }));
        console.log(`Final data updated in ${excelFile}`);

    } catch (err) {
        console.error("❌ Error occurred:", err);
    } finally {
        await driver.quit();
    }
})();