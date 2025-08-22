import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * Cross-platform ChromeDriver configuration
 */
export class BrowserConfig {
    static getChromeDriverPath() {
        const platform = os.platform();
        
        // Common ChromeDriver paths for different platforms
        const driverPaths = {
            win32: [
                path.join(process.cwd(), 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe'),
                path.join(process.cwd(), 'node_modules', '.bin', 'chromedriver.cmd'),
                'C:\\Program Files\\ChromeDriver\\chromedriver.exe',
                'C:\\Program Files (x86)\\ChromeDriver\\chromedriver.exe'
            ],
            linux: [
                '/usr/bin/chromedriver',
                '/usr/local/bin/chromedriver',
                path.join(process.cwd(), 'node_modules', 'chromedriver', 'bin', 'chromedriver')
            ],
            darwin: [
                '/usr/local/bin/chromedriver',
                path.join(process.cwd(), 'node_modules', 'chromedriver', 'bin', 'chromedriver')
            ]
        };

        const paths = driverPaths[platform] || driverPaths.linux;
        
        for (const driverPath of paths) {
            if (fs.existsSync(driverPath)) {
                console.log(`[BrowserConfig] Using ChromeDriver: ${driverPath}`);
                return driverPath;
            }
        }
        
        throw new Error(`ChromeDriver not found. Please install chromedriver for ${platform}`);
    }

    static getChromeOptions(headless = true) {
        const options = new chrome.Options();
        
        // Cross-platform Chrome binary detection
        const platform = os.platform();
        const chromePaths = {
            win32: [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            ],
            linux: [
                '/usr/bin/google-chrome',
                '/usr/bin/chromium-browser',
                '/snap/bin/chromium'
            ],
            darwin: [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            ]
        };

        const chromePath = chromePaths[platform]?.find(p => fs.existsSync(p));
        if (chromePath) {
            options.setChromeBinaryPath(chromePath);
        }

        // Essential options for stability
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-cache');
        options.addArguments('--window-size=1920,1080');
        
        if (headless) {
            options.addArguments('--headless=new');
        }

        // User data directory for session persistence
        const userDataDir = path.join(os.tmpdir(), `chrome-profile-${Date.now()}`);
        options.addArguments(`--user-data-dir=${userDataDir}`);

        return options;
    }

    static async createDriver(headless = true) {
        const service = new chrome.ServiceBuilder(this.getChromeDriverPath());
        const options = this.getChromeOptions(headless);
        
        return new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
    }
}
