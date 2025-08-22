import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import xlsx from 'xlsx';

// Import route files
import authRoutes from './routes/auth.routes.js';
import campusRoutes from './routes/campus.routes.js';
import corporateRoutes from './routes/corporate.routes.js';
import hrhuntRoutes from './routes/hrhunt.routes.js';
import emailRoutes from './routes/email.routes.js';
import linkedinRoutes from './routes/linkedin.routes.js';

import './utils/warmup.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/resumes/' });

// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://hunt360.vercel.app',
  'https://hunt360.onrender.com',
];

// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ashlokchaudhary',
    resave: false,
    saveUninitialized: false,
  })
);

// Swagger Docs
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(YAML.load('./docs/endpoints.yaml'))
);

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/hrhunt', hrhuntRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/email-service', emailRoutes);
app.use('/api/linkedin', linkedinRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// User Update Endpoint
app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, phone } = req.body;

  const sql = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
  db.query(sql, [name, email, phone, userId], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "User updated successfully", result });
  });
});

// Scraping Endpoint
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.post('/api/corporate/scrape', async (req, res) => {
  const { website, course, state, city, district } = req.body;

  // Validate inputs
  if (!website || !state || (website === 'Collegedunia' && !city) || (website === 'AISHE' && !district)) {
    console.error('Missing required fields:', { website, course, state, city, district });
    return res.status(400).json({ error: `Website, state, and ${website === 'Collegedunia' ? 'city' : 'district'} are required.` });
  }

  // Correct common typos
  const correctedState = state.toLowerCase() === 'maharastra' ? 'Maharashtra' : state;
  const correctedCourse = course && course.toLowerCase() === 'bmm' ? 'Bachelor of Mass Media' : (course || '');
  const location = website === 'Collegedunia' ? city : district;
  console.log(`Starting scrape for website: ${website}, state: ${correctedState}, location: ${location}, course: ${correctedCourse || 'N/A'}`);

  // Setup paths and filenames
  const downloadsFolder = path.join(__dirname, 'downloads');
  const safeState = correctedState.replace(/\W+/g, '');
  const safeLocation = location.replace(/\W+/g, '');
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const fileName = `Scraped_${website}_${safeState}_${safeLocation}_${timestamp}.xlsx`;
  const filePath = path.join(downloadsFolder, fileName);

  // Ensure downloads folder exists
  try {
    await fs.access(downloadsFolder).catch(() => fs.mkdir(downloadsFolder, { recursive: true }));
  } catch (err) {
    console.error('Failed to create downloads folder:', err.message);
    return res.status(500).json({ error: `Failed to create downloads folder: ${err.message}` });
  }

  // Excel setup
  const collegeduniaColumns = [
    'File',
    'College Name',
    'Annual Fees',
    'Placement',
    'Ranking',
    'Course',
    'State',
    'City',
  ];
  const aisheColumns = [
    'File',
    'College Name',
    'State',
    'District',
    'Course',
    'Annual Fees',
    'Placement Fees',
    'Address',
    'Phone',
  ];

  const createWorkbook = async (columns) => {
    const workbook = xlsx.utils.book_new();
    const sheetData = [columns];
    const worksheet = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    await fs.writeFile(filePath, xlsx.write(workbook, { type: 'buffer' }));
  };

  const appendToWorkbook = async (rows) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets['Sheet1'];
    const newRows = rows.map((row) => row.map((cell) => cell || ''));
    xlsx.utils.sheet_add_aoa(sheet, newRows, { origin: -1 });
    await fs.writeFile(filePath, xlsx.write(workbook, { type: 'buffer' }));
  };

  try {
    if (website === 'Collegedunia') {
      // Collegedunia scraping with Puppeteer
      let browser;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
          timeout: 60000,
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        console.log('Navigating to Collegedunia...');
        await page.goto('https://collegedunia.com/india-colleges', { waitUntil: 'networkidle2', timeout: 30000 }).catch(err => {
          throw new Error(`Failed to load Collegedunia: ${err.message}`);
        });

        const selectFilter = async (filterType, value, placeholder) => {
          try {
            console.log(`Selecting ${filterType} filter: ${value}`);
            await page.waitForSelector(`button[data-filter-toggle="${filterType}"]`, { timeout: 10000 });
            await page.evaluate((filterType) => {
              const btn = document.querySelector(`button[data-filter-toggle="${filterType}"]`);
              if (!btn) throw new Error(`Filter button for ${filterType} not found`);
              btn.click();
            }, filterType);

            await page.waitForSelector(`input[placeholder="${placeholder}"]`, { timeout: 10000 });
            await page.type(`input[placeholder="${placeholder}"]`, value);

            const options = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('ul li')).map(li => li.textContent.trim());
            });
            console.log(`Available ${filterType} options:`, options);

            const optionSelector = `//li[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${value.toLowerCase()}')]`;
            let [option] = await page.$x(optionSelector);
            if (!option) {
              console.log(`Exact match for "${value}" not found. Trying partial match...`);
              for (const opt of options) {
                if (opt.toLowerCase().includes(value.toLowerCase())) {
                  const [partialOption] = await page.$x(`//li[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${opt.toLowerCase()}')]`);
                  if (partialOption) {
                    await page.evaluate(el => el.click(), partialOption);
                    console.log(`Selected partial match: ${opt}`);
                    return;
                  }
                }
              }
              throw new Error(`No matching option found for "${value}". Available: ${options.join(', ')}`);
            }
            await page.evaluate(el => el.click(), option);
            await page.waitForTimeout(3000);
            console.log(`${filterType} "${value}" selected successfully`);
          } catch (error) {
            throw new Error(`Failed to select ${filterType}: ${error.message}`);
          }
        };

        if (correctedCourse) await selectFilter('course_tag_id', correctedCourse, 'FIND COURSE');
        await selectFilter('state', correctedState, 'FIND STATE');
        await selectFilter('city', city, 'FIND CITIES');

        console.log('Scrolling to load all colleges...');
        let previousCount = 0;
        let stableCount = 0;
        const maxAttempts = 20;
        const maxStable = 5;
        const data = [];

        while (stableCount < maxStable && previousCount < maxAttempts) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(3000);

          const rows = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('table.listing-table tbody tr'));
            if (tableRows.length) {
              return tableRows.map(row => ({ tag: 'tr', element: row }));
            }
            return Array.from(document.querySelectorAll('div.college_block')).map(div => ({ tag: 'div', element: div }));
          });

          console.log(`Loaded ${rows.length} rows so far...`);
          if (rows.length === previousCount) {
            stableCount++;
          } else {
            stableCount = 0;
          }
          previousCount = rows.length;
        }

        if (!rows.length) {
          throw new Error('No colleges found. Check filter inputs or website structure.');
        }

        console.log('Saving screenshot and page source...');
        await page.screenshot({ path: path.join(__dirname, 'collegedunia_screenshot.png'), fullPage: true });
        const pageSource = await page.content();
        await fs.writeFile(path.join(__dirname, 'collegedunia_page.html'), pageSource);

        console.log('Scraping college data...');
        for (const row of rows) {
          try {
            let college_name, course_fees, placement, ranking;
            if (row.tag === 'tr') {
              college_name = await page.evaluate(el => el.querySelector('td:nth-child(2) h3')?.textContent.trim() || 'N/A', row.element);
              course_fees = await page.evaluate(el => el.querySelector('td:nth-child(3) span')?.textContent.trim() || 'N/A', row.element);
              placement = await page.evaluate(el => el.querySelector('td:nth-child(4)')?.textContent.trim() || 'N/A', row.element);
              ranking = await page.evaluate(el => el.querySelector('td:nth-child(6)')?.textContent.trim() || 'N/A', row.element);
            } else {
              college_name = await page.evaluate(el => el.querySelector('h3')?.textContent.trim() || 'N/A', row.element);
              course_fees = await page.evaluate(el => el.querySelector('span.text-green')?.textContent.trim() || 'N/A', row.element);
              placement = await page.evaluate(el => el.querySelector('div.placement')?.textContent.trim() || 'N/A', row.element);
              ranking = await page.evaluate(el => el.querySelector('span.rank-span')?.textContent.trim() || 'N/A', row.element);
            }

            data.push([fileName, college_name, course_fees, placement, ranking, correctedCourse, correctedState, city]);
            console.log(`Scraped: ${college_name}`);
          } catch (error) {
            console.error(`Error scraping row: ${error.message}`);
          }
        }

        if (!data.length) {
          throw new Error('No data scraped. Check collegedunia_page.html.');
        }

        await createWorkbook(collegeduniaColumns);
        await appendToWorkbook(data);

        res.download(filePath, fileName, async (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Failed to download file.' });
            return;
          }
          await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
        });

        await browser.close();
      } catch (error) {
        if (browser) await browser.close();
        throw error;
      }
    } else if (website === 'AISHE') {
      // AISHE scraping with Selenium
      let driver;
      try {
        const options = new chrome.Options();
        options.addArguments('--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        console.log('Navigating to AISHE dashboard...');
        await driver.get('https://dashboard.aishe.gov.in/hedirectory/#/institutionDirectory/universityDetails/C/ALL');
        await driver.wait(until.elementLocated(By.tagName('body')), 25000);

        try {
          await driver.wait(until.elementLocated(By.className('loadermainbg')), 10000);
          await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className('loadermainbg'))), 20000);
        } catch (err) {
          console.log('No loading screen or already hidden');
          await driver.executeScript("document.querySelector('.loadermainbg')?.style.display='none';");
        }

        const clickWithJs = async (element) => {
          await driver.executeScript('arguments[0].scrollIntoView();', element);
          await driver.executeScript('arguments[0].click();', element);
        };

        console.log(`Selecting state: ${correctedState}`);
        const stateDropdown = await driver.wait(until.elementLocated(By.css('mat-select[formcontrolname="state1"]')), 15000);
        await clickWithJs(stateDropdown);

        const stateSearch = await driver.wait(until.elementLocated(By.css('input[formcontrolname="value"]')), 10000);
        await stateSearch.sendKeys(correctedState, Key.RETURN);

        const stateOptions = await driver.findElements(By.css('mat-option'));
        const stateOptionTexts = await Promise.all(stateOptions.map(opt => opt.getText()));
        console.log('Available state options:', stateOptionTexts);

        const stateOption = await driver.wait(
          until.elementLocated(By.xpath(`//mat-option/span[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${correctedState.toLowerCase()}')]`)),
          10000
        );
        await clickWithJs(stateOption);
        console.log(`✅ Selected state: ${correctedState}`);

        await driver.sleep(2000);
        console.log(`Selecting district: ${district}`);
        const districtDropdown = await driver.wait(until.elementLocated(By.css('mat-select[formcontrolname="district1"]')), 15000);
        await clickWithJs(districtDropdown);

        const districtSearch = await driver.wait(until.elementLocated(By.css('input[formcontrolname="value"]')), 10000);
        await districtSearch.sendKeys(district, Key.RETURN);

        const districtOptions = await driver.findElements(By.css('mat-option'));
        const districtOptionTexts = await Promise.all(districtOptions.map(opt => opt.getText()));
        console.log('Available district options:', districtOptionTexts);

        const districtOption = await driver.wait(
          until.elementLocated(By.xpath(`//mat-option/span[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${district.toLowerCase()}')]`)),
          10000
        );
        await clickWithJs(districtOption);
        console.log(`✅ Selected district: ${district}`);

        await driver.wait(until.elementLocated(By.css('mat-table')), 20000);

        console.log('Saving screenshot and page source...');
        await driver.takeScreenshot().then(data => fs.writeFile(path.join(__dirname, 'aishe_screenshot.png'), Buffer.from(data, 'base64')));
        const pageSource = await driver.getPageSource();
        await fs.writeFile(path.join(__dirname, 'aishe_page.html'), pageSource);

        await createWorkbook(aisheColumns);

        const uniqueColleges = new Set();
        let pageNum = 1;

        console.log('Scraping college data...');
        while (true) {
          const rows = await driver.findElements(By.css('mat-row'));
          const data = [];

          for (const row of rows) {
            const cells = await row.findElements(By.css('mat-cell'));
            if (cells.length >= 11) {
              const collegeName = (await cells[1].getText()).trim();
              if (!uniqueColleges.has(collegeName)) {
                uniqueColleges.add(collegeName);
                data.push([fileName, collegeName, correctedState, district, correctedCourse, '', '', '', '']);
              }
            }
          }

          if (data.length > 0) {
            console.log(`✅ Page ${pageNum++}: Scraped ${data.length} colleges`);
            await appendToWorkbook(data);
          }

          const nextBtn = await driver.findElement(By.css('button.mat-mdc-paginator-navigation-next'));
          const isDisabled = await nextBtn.getAttribute('disabled');
          if (isDisabled) break;
          await clickWithJs(nextBtn);
          await driver.sleep(3000);
        }

        if (uniqueColleges.size === 0) {
          throw new Error('No colleges found. Check filter inputs or website structure.');
        }

        console.log('Starting Google Maps lookups...');
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets['Sheet1'];
        const jsonData = xlsx.utils.sheet_to_json(sheet).slice(1);

        for (const [index, row] of jsonData.entries()) {
          const collegeName = row['College Name'];
          if (!collegeName) continue;

          console.log(`Fetching details for: ${collegeName}...`);
          let newDriver;
          try {
            newDriver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
            await newDriver.get('https://www.google.com/maps');
            await newDriver.wait(until.elementLocated(By.id('searchboxinput')), 10000);

            const searchBox = await newDriver.findElement(By.id('searchboxinput'));
            await searchBox.clear();
            await searchBox.sendKeys(`${collegeName}, ${correctedState}`, Key.RETURN);
            await newDriver.wait(until.elementLocated(By.css("button[data-item-id='address']")), 10000);

            const address = await newDriver
              .findElement(By.css("button[data-item-id='address']"))
              .then(el => el.getAttribute('aria-label'))
              .then(label => label.replace('Address: ', '').trim())
              .catch(() => 'N/A');

            const phone = await newDriver
              .findElement(By.css("button[data-item-id^='phone']"))
              .then(el => el.getAttribute('aria-label'))
              .then(label => label.replace('Phone: ', '').trim())
              .catch(() => 'N/A');

            const cellAddress = `H${index + 2}`;
            const cellPhone = `I${index + 2}`;
            sheet[cellAddress] = { t: 's', v: address };
            sheet[cellPhone] = { t: 's', v: phone };
          } catch (err) {
            console.error(`Error fetching details for ${collegeName}:`, err.message);
            const cellAddress = `H${index + 2}`;
            const cellPhone = `I${index + 2}`;
            sheet[cellAddress] = { t: 's', v: 'N/A' };
            sheet[cellPhone] = { t: 's', v: 'N/A' };
          } finally {
            if (newDriver) await newDriver.quit();
          }
        }

        await fs.writeFile(filePath, xlsx.write(workbook, { type: 'buffer' }));
        console.log(`Final data updated in ${filePath}`);

        res.download(filePath, fileName, async (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Failed to download file.' });
            return;
          }
          await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
        });

        await driver.quit();
      } catch (error) {
        if (driver) await driver.quit();
        throw error;
      }
    } else {
      throw new Error('Invalid website selected.');
    }
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ error: `Scraping failed: ${error.message}` });
  }
});

// Mock Previous Scrapes Endpoint
app.get('/api/corporate/previous-scrapes', (req, res) => {
  const mockData = [
    {
      File: 'Scraped_Collegedunia_Maharashtra_Mumbai_20250821122800.xlsx',
      'College Name': 'St. Xavier\'s College',
      'Annual Fees': '₹60,000',
      Placement: '75% placed, ₹4 LPA',
      Ranking: '#15 NIRF',
      Course: 'Bachelor of Mass Media',
      State: 'Maharashtra',
      City: 'Mumbai',
      Address: 'N/A',
      Phone: 'N/A',
    },
    {
      File: 'Scraped_AISHE_Maharashtra_Mumbai_20250821122800.xlsx',
      'College Name': 'Kishinchand Chellaram College',
      State: 'Maharashtra',
      District: 'Mumbai',
      Course: '',
      'Annual Fees': '',
      'Placement Fees': '',
      Address: '123, Dinshaw Wachha Rd, Mumbai',
      Phone: '022 2285 5726',
    },
  ];
  res.json(mockData);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;