import { Builder, By, until } from 'selenium-webdriver';
import db from '../config//database.js';
import { saveDataToExcel } from '../utils/excel.js';

export async function scrapeData(industry, city) {
    const driver = new Builder().forBrowser('chrome').build();
    const data = [];
    const gstTracker = {};

    async function getGoogleMapsData(company, location) {
        try {
            await driver.executeScript("window.open('');");
            const tabs = await driver.getAllWindowHandles();
            await driver.switchTo().window(tabs[1]);

            await driver.get(`https://www.google.com/maps/search/${company} ${location}`);
            await driver.sleep(5000);

            try {
                await driver.wait(until.elementLocated(By.css('h1.DUwDvf.lfPIob')), 5000);
            } catch {
                try {
                    const firstResult = await driver.wait(until.elementLocated(By.xpath("(//a[contains(@href, '/place/')])[1]")), 5000);
                    await firstResult.click();
                    await driver.sleep(3000);
                    await driver.wait(until.elementLocated(By.css('h1.DUwDvf.lfPIob')), 10000);
                } catch {
                    throw new Error('No results found to click.');
                }
            }

            const name = await driver.findElement(By.css('h1.DUwDvf.lfPIob')).getText();
            const address = await driver.findElement(By.css('div.Io6YTe.fontBodyMedium')).getText().catch(() => 'N/A');
            const website = await driver.findElement(By.xpath("//a[contains(@aria-label, 'Website')]")).getAttribute('href').catch(() => 'N/A');
            const phone = await driver.findElement(By.xpath("//span[contains(text(),'Phone')]/following-sibling::span")).getText().catch(() => 'N/A');

            return { Address: address, Phone: phone, Website: website };
        } catch (error) {
            console.error(`[Google Maps] Error for ${company}: ${error}`);
            return { Address: 'N/A', Phone: 'N/A', Website: 'N/A' };
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

            const findBtn = await driver.findElement(By.xpath("//input[@value='Find GST number']"));
            await findBtn.click();
            await driver.sleep(3000);

            const gstElements = await driver.findElements(By.xpath("//p[contains(@class, 'yellow') and contains(@class, 'lighten-5')]"));
            const gstNumbers = [];
            for (const el of gstElements) {
                const text = await el.getText();
                const matches = text.match(/\b\d{2}[A-Z0-9]{10}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g);
                if (matches) {
                    gstNumbers.push(...matches);
                }
            }

            return gstNumbers;
        } catch (error) {
            console.error(`[GST] Error for ${company}: ${error}`);
            return [];
        } finally {
            const allHandles = await driver.getAllWindowHandles();
            await driver.close();
            await driver.switchTo().window(allHandles[0]);
        }
    }

    async function saveDataToDatabase() {
        if (!data.length) return;

        let connection;
        try {
            connection = await db.getConnection();
            for (const record of data) {
                const query = `
          INSERT INTO scraped_data (company_name, location, job_title, address, phone_number, website_link, gst_number)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
                await connection.query(query, [
                    record.Company_Name,
                    record.Location,
                    record.Job_Title,
                    record.Address,
                    record.Phone,
                    record.Website,
                    record['GST Number(s)'],
                ]);
            }
            console.log(`Saved ${data.length} records to database.`);
        } catch (error) {
            console.error(`[DB] Error saving data: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async function saveData() {
        await saveDataToDatabase();
        await saveDataToExcel(data, industry, city);
    }

    try {
        await driver.get('https://www.foundit.in/');
        await driver.wait(until.elementLocated(By.tagName('body')), 10000);

        const searchInput = await driver.findElement(By.id('heroSectionDesktop-skillsAutoComplete--input'));
        await searchInput.clear();
        await searchInput.sendKeys(`${industry}, ${city}`);

        const searchBtn = await driver.findElement(By.xpath("//button[span[text()='Search']]"));
        await searchBtn.click();
        await driver.sleep(5000);

        let interrupted = false;
        process.on('SIGINT', () => {
            console.log('\nInterrupted! Saving progress...');
            interrupted = true;
        });

        while (!interrupted) {
            await driver.wait(until.elementLocated(By.css('div.jobTitle')), 10000);

            const jobTitles = await driver.findElements(By.css('div.jobTitle'));
            const companies = await driver.findElements(By.xpath("//div[contains(@class, 'infoSection')]//div[contains(@class, 'companyName')]/p"));
            const locations = await driver.findElements(By.css('div.details.location'));

            for (let i = 0; i < Math.min(jobTitles.length, companies.length, locations.length); i++) {
                const jobTitle = await jobTitles[i].getText();
                const company = await companies[i].getText();
                const location = await locations[i].getText();

                if (!data.some((d) => d.Company_Name === company && d.Location === location)) {
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

                    gmapInfo.Job_Title = jobTitle;
                    gmapInfo.Company_Name = company;
                    gmapInfo.Location = location;
                    gmapInfo['GST Number(s)'] = gstToSave;

                    data.push(gmapInfo);
                    console.log(`[SCRAPED] ${jobTitle} | ${company} | ${location} | GST: ${gstToSave}`);
                }
            }

            await saveData();

            try {
                const nextBtn = await driver.findElement(By.css('div.arrow.arrow-right'));
                await nextBtn.click();
                await driver.sleep(4000);
            } catch {
                console.log('No more pages.');
                break;
            }
        }
    } catch (error) {
        console.error(`Error occurred: ${error}`);
    } finally {
        await driver.quit();
        await saveData();
        console.log('Scraping completed.');
    }
}