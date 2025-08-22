import { Builder, By, Key, until } from 'selenium-webdriver';
import fs from 'fs-extra';
import path from 'path';
import xlsx from 'xlsx';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let interrupted = false;
let data = [];

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

function getUniquexlsxPath(baseName) {
    const downloadsFolder = path.join(__dirname, 'exports');
    if (!fs.existsSync(downloadsFolder)) fs.mkdirSync(downloadsFolder);

    const base = path.join(downloadsFolder, baseName + '.xlsx');
    if (!fs.existsSync(base)) return base;

    let i = 1;
    let newPath;
    do {
        newPath = path.join(downloadsFolder, `${baseName}(${i}).xlsx`);
        i++;
    } while (fs.existsSync(newPath));
    return newPath;
}

async function saveData(filePath) {
    if (data.length === 0) return;

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Hirist Data');
    xlsx.writeFile(workbook, filePath);

    console.log(`Saved ${data.length} records to: ${filePath}`);
}

(async function main() {
    let driver = await new Builder().forBrowser('chrome').build();

    const industry = process.argv[2] || 'IT Services';
    const city = process.argv[3] || 'Bangalore';
    const fileName = `${industry}_${city}_Hirist`;
    const filePath = getUniquexlsxPath(fileName);

    try {
        await driver.get('https://www.hirist.com/');
        await driver.wait(until.elementLocated(By.tagName('body')), 15000);
        await delay(3000);

        // Search for jobs
        let searchInput = await driver.findElement(By.id('keyword'));
        await searchInput.sendKeys(industry);
        
        let locationInput = await driver.findElement(By.id('location'));
        await locationInput.sendKeys(city);
        
        await driver.findElement(By.css('.search-btn')).click();
        await delay(5000);

        let jobs = await driver.findElements(By.css('.job-list'));
        
        for (let job of jobs) {
            try {
                let jobTitle = await job.findElement(By.css('.job-title')).getText();
                let companyName = await job.findElement(By.css('.company-name')).getText();
                let location = await job.findElement(By.css('.location')).getText();
                
                let record = {
                    Job_Title: jobTitle,
                    Company_Name: companyName,
                    Location: location,
                    Address: 'N/A',
                    Phone: 'N/A',
                    Website: 'N/A',
                    'GST Number(s)': 'N/A'
                };

                data.push(record);
                console.log(`Found: ${jobTitle} -> ${companyName} -> ${location}`);
            } catch (e) {
                console.log('Error processing job:', e.message);
            }
        }

    } finally {
        await driver.quit();
        console.log('Browser closed.');
        await saveData(filePath);
        console.log(`Final data saved in: ${filePath}`);
    }
})();
