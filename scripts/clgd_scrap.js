import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up download folder
const downloadsFolder = path.join(__dirname, 'exports');
if (!fs.existsSync(downloadsFolder)) await fs.mkdirSync(downloadsFolder);

// Validate command-line arguments: <state_name> <CITY_NAME> <COURSE_NAME>
const args = process.argv.slice(2);
if (args.length !== 3) {
    console.error(
        'Usage: node clgd_scrap.js <state_name> <CITY_NAME> <COURSE_NAME>'
    );
    process.exit(1);
}
const STATE_NAME = args[0];
const CITY_NAME = args[1];
const COURSE_NAME = args[2];
console.log(`Scraping data for ${STATE_NAME}, ${CITY_NAME}, ${COURSE_NAME}`);

// Create safe filenames and set up Excel file path
const safe_STATE_NAME = STATE_NAME.replace(/\W+/g, '');
const safe_CITY_NAME = CITY_NAME.replace(/\W+/g, '');
const safe_COURSE_NAME = COURSE_NAME.replace(/\W+/g, '');
const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
const excelFile = path.join(
    downloadsFolder,
    `${safe_STATE_NAME}_${safe_CITY_NAME}_${safe_COURSE_NAME}_${timestamp}.xlsx`
);
const fileName = path.basename(excelFile);

const columns = [
    'File',
    'College Name',
    'Anual_fees',
    'Placement_fees',
    'Ranking',
    'Course',
    'State',
    'District', // using city as district here
    'Address',
    'Phone',
];

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // set headless:true when not debugging
    const page = await browser.newPage();
    await page.goto('https://collegedunia.com/india-colleges', {
        waitUntil: 'networkidle2',
    });
    await page.waitForTimeout(5000); // allow page to load

    // ---------- APPLY FILTERS ----------
    // 1. Filter by Course
    try {
        await page.waitForXPath(
            "//button[@data-filter-toggle='course_tag_id']",
            { visible: true }
        );
        const [courseFilterBtn] = await page.$x(
            "//button[@data-filter-toggle='course_tag_id']"
        );
        if (courseFilterBtn) {
            await courseFilterBtn.click();
            console.log("Clicked on 'Course' filter.");
        }
        // Wait for input field and type the course name
        await page.waitForXPath("//input[@placeholder='FIND COURSE']", {
            visible: true,
        });
        const [courseInput] = await page.$x(
            "//input[@placeholder='FIND COURSE']"
        );
        await courseInput.type(COURSE_NAME);
        // Wait and click the li option that contains COURSE_NAME text
        await page.waitForXPath(`//li[contains(., '${COURSE_NAME}')]`, {
            visible: true,
        });
        const [courseOption] = await page.$x(
            `//li[contains(., '${COURSE_NAME}')]`
        );
        await courseOption.click();
        console.log(`Selected '${COURSE_NAME}'.`);
    } catch (err) {
        console.error('Error applying course filter:', err.message);
    }

    // 2. Filter by State
    try {
        await page.waitForXPath("//button[@data-filter-toggle='state']", {
            visible: true,
        });
        const [stateFilterBtn] = await page.$x(
            "//button[@data-filter-toggle='state']"
        );
        if (stateFilterBtn) {
            await stateFilterBtn.click();
            console.log("Clicked on 'State' filter.");
        }
        await page.waitForXPath("//input[@placeholder='FIND STATE']", {
            visible: true,
        });
        const [stateInput] = await page.$x(
            "//input[@placeholder='FIND STATE']"
        );
        await stateInput.type(STATE_NAME);
        await page.waitForXPath(`//li[contains(., '${STATE_NAME}')]`, {
            visible: true,
        });
        const [stateOption] = await page.$x(
            `//li[contains(., '${STATE_NAME}')]`
        );
        await stateOption.click();
        console.log(`Selected '${STATE_NAME}'.`);
    } catch (err) {
        console.error('Error applying state filter:', err.message);
    }

    // 3. Filter by City
    try {
        await page.waitForXPath("//button[@data-filter-toggle='city']", {
            visible: true,
        });
        const [cityFilterBtn] = await page.$x(
            "//button[@data-filter-toggle='city']"
        );
        if (cityFilterBtn) {
            await cityFilterBtn.click();
            console.log("Clicked on 'City' filter.");
        }
        await page.waitForXPath("//input[@placeholder='FIND CITIES']", {
            visible: true,
        });
        const [cityInput] = await page.$x(
            "//input[@placeholder='FIND CITIES']"
        );
        await cityInput.type(CITY_NAME);
        await page.waitForXPath(`//li[contains(., '${CITY_NAME}')]`, {
            visible: true,
        });
        const [cityOption] = await page.$x(`//li[contains(., '${CITY_NAME}')]`);
        await cityOption.click();
        console.log(`Selected '${CITY_NAME}'.`);
    } catch (err) {
        console.error('Error applying city filter:', err.message);
    }

    // Allow time for filter results to load
    await page.waitForTimeout(5000);

    // ---------- SCROLL TO LOAD ALL COLLEGES ----------
    let prevCount = 0;
    let scrollAttempts = 0;
    const scrollLimit = 60;
    let stableCountCounter = 0;
    const stableCountIterations = 5;
    let validRows = [];

    while (scrollAttempts < scrollLimit) {
        // Scroll to the bottom of the page
        await page.evaluate(() =>
            window.scrollTo(0, document.body.scrollHeight)
        );
        await page.waitForTimeout(4000); // wait for new rows to load

        // Evaluate number of valid rows in the table
        validRows = await page.evaluate(() => {
            // Return only rows that contain an <h3> element (assuming these are valid college rows)
            const nodes = Array.from(
                document.querySelectorAll('table.listing-table tbody tr')
            );
            return nodes
                .filter((node) => node.querySelector('h3'))
                .map((node) => {
                    // Get inner text from the row in case you need to see count differences
                    return node.innerText;
                });
        });
        const currentCount = validRows.length;
        console.log(`Loaded ${currentCount} valid rows so far...`);
        if (currentCount === prevCount) {
            stableCountCounter++;
            if (stableCountCounter >= stableCountIterations) {
                console.log('Reached end of the list.');
                break;
            }
        } else {
            stableCountCounter = 0;
        }
        prevCount = currentCount;
        scrollAttempts++;
    }
    if (scrollAttempts === scrollLimit) {
        console.log('Scroll limit reached. Stopping to avoid infinite loop.');
    }

    // ---------- SCRAPE COLLEGE DATA ----------
    // Extract data from each valid row. Use page.$$eval to process DOM nodes.
    const collegeData = await page.$$eval(
        'table.listing-table tbody tr',
        (rows, fileName, COURSE_NAME, STATE_NAME, CITY_NAME) => {
            const data = [];
            rows.forEach((row) => {
                // Process only rows that have an <h3> (indicating a valid college entry)
                if (row.querySelector('h3')) {
                    try {
                        // Using relative selectors based on your code:
                        // Get the college name from the second <td> element's <h3>
                        const collegeName =
                            row
                                .querySelector('td:nth-child(2) h3')
                                ?.innerText.trim() || '';
                        // Course fees from third <td> with a span having class containing 'text-green'
                        const courseFees =
                            row
                                .querySelector(
                                    "td:nth-child(3) span[class*='text-green']"
                                )
                                ?.innerText.trim() || '';
                        // For placement, get average and highest from fourth <td>.
                        const placementAvgElem = row.querySelector(
                            "td:nth-child(4) span[title='Average Package']"
                        )
                            ? row.querySelector(
                                  "td:nth-child(4) span[title='Average Package']"
                              ).previousElementSibling
                            : null;
                        const placementHighestElem = row.querySelector(
                            "td:nth-child(4) span[title='Highest Package']"
                        )
                            ? row.querySelector(
                                  "td:nth-child(4) span[title='Highest Package']"
                              ).previousElementSibling
                            : null;
                        const placementAvg = placementAvgElem
                            ? placementAvgElem.innerText.trim()
                            : '';
                        const placementHighest = placementHighestElem
                            ? placementHighestElem.innerText.trim()
                            : '';
                        const placement = `Average: ${placementAvg}, Highest: ${placementHighest}`;
                        // Ranking from sixth <td> (assumed structure based on your code)
                        const ranking =
                            row
                                .querySelector('td:nth-child(6) span.rank-span')
                                ?.innerText.trim() || '';
                        data.push({
                            File: fileName,
                            'College Name': collegeName,
                            Anual_fees: courseFees,
                            Placement_fees: placement,
                            Ranking: ranking,
                            Course: COURSE_NAME,
                            State: STATE_NAME,
                            District: CITY_NAME,
                            Address: '',
                            Phone: '',
                        });
                    } catch (err) {
                        // Skip row if any error occurs
                        console.error('Error processing row:', err);
                    }
                }
            });
            return data;
        },
        fileName,
        COURSE_NAME,
        STATE_NAME,
        CITY_NAME
    );

    console.log(`Scraping completed! Total colleges: ${collegeData.length}`);

    // ---------- SAVE TO EXCEL ----------
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define columns for the worksheet
    worksheet.columns = columns.map((header) => ({ header, key: header }));
    // Add all scraped rows to the worksheet
    collegeData.forEach((data) => {
        worksheet.addRow(data);
    });

    // Write Excel file to disk
    await workbook.xlsx.writeFile(excelFile);
    console.log(`Data saved to: ${excelFile}`);

    // ---------- GOOGLE MAPS SCRAPING FOR EACH COLLEGE ----------
    // Helper function to fetch address and phone from Google Maps
    async function getCollegeDetails(collegeName) {
        console.log(`Fetching details for: ${collegeName}...`);
        const mapPage = await browser.newPage();
        try {
            await mapPage.goto('https://www.google.com/maps', {
                waitUntil: 'networkidle2',
            });
            await mapPage.waitForSelector('#searchboxinput', { visible: true });
            await mapPage.evaluate(() => {
                document.querySelector('#searchboxinput').value = '';
            });
            await mapPage.type('#searchboxinput', collegeName);
            await mapPage.keyboard.press('Enter');
            // Wait for the results to load (adjust the wait time if needed)
            await mapPage.waitForTimeout(5000);

            // Grab the address
            const address = await mapPage.evaluate(() => {
                const btn = document.querySelector(
                    "button[data-item-id='address']"
                );
                if (btn) {
                    return btn
                        .getAttribute('aria-label')
                        .replace('Address: ', '')
                        .trim();
                }
                return 'N/A';
            });
            // Grab the phone number
            const phone = await mapPage.evaluate(() => {
                const btn = document.querySelector(
                    "button[data-item-id^='phone']"
                );
                if (btn) {
                    return btn
                        .getAttribute('aria-label')
                        .replace('Phone: ', '')
                        .trim();
                }
                return 'N/A';
            });
            await mapPage.close();
            return { address, phone };
        } catch (e) {
            console.error(
                `Error fetching details for ${collegeName}:`,
                e.message
            );
            await mapPage.close();
            return { address: 'N/A', phone: 'N/A' };
        }
    }

    await workbook.xlsx.readFile(excelFile);
    const sheet = workbook.getWorksheet('Sheet1');

    for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        const collegeName = row.getCell('College Name').value;
        if (!collegeName) continue;
        const { address, phone } = await getCollegeDetails(collegeName);
        row.getCell('Address').value = address;
        row.getCell('Phone').value = phone;
        row.commit();
        await workbook.xlsx.writeFile(excelFile);
    }
    console.log(`Final data updated in ${excelFile}`);

    await browser.close();
})();
