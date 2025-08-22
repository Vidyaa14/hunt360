import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up ChromeDriver...');

// Check if chromedriver is installed
try {
    const chromedriverPath = path.join(__dirname, '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
    if (fs.existsSync(chromedriverPath)) {
        console.log('ChromeDriver found:', chromedriverPath);
    } else {
        console.log('ChromeDriver not found, installing...');
        execSync('npm install chromedriver@latest', { stdio: 'inherit' });
    }
} catch (error) {
    console.error('Error setting up ChromeDriver:', error.message);
}

// Create a simple test script
const testScript = `
import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js';
import { BrowserConfig } from './scripts/utils/browser-config.js';

async function testChromeDriver() {
    let driver;
    try {
        console.log('Testing ChromeDriver...');
        driver = await BrowserConfig.createDriver(true);
        await driver.get('https://www.google.com');
        console.log('ChromeDriver test successful!');
        await driver.quit();
    } catch (error) {
        console.error('ChromeDriver test failed:', error.message);
        if (driver) await driver.quit();
    }
}

testChromeDriver();
`;

fs.writeFileSync(path.join(__dirname, '..', 'test-chromedriver.js'), testScript);
console.log('Test script created: test-chromedriver.js');
