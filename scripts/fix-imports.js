import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptsDir = path.join(__dirname);
const filesToFix = [
    'glassdoor_scraper.js',
    'intern_scraper.js',
    'shine_scraper.js',
    'naukri_scraper.js',
    'hirist_scraper.js',
    // Add other scraper files here
];

function fixImports() {
    filesToFix.forEach(file => {
        const filePath = path.join(scriptsDir, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Fix import statements
            content = content.replace(
                /import chrome from 'selenium-webdriver\/chrome';/g,
                "import * as chrome from 'selenium-webdriver/chrome.js';"
            );
            
            // Fix other potential issues
            content = content.replace(
                /from 'selenium-webdriver\/chrome'/g,
                "from 'selenium-webdriver/chrome.js'"
            );
            
            fs.writeFileSync(filePath, content);
            console.log(`Fixed imports in ${file}`);
        }
    });
}

fixImports();
console.log('Import fixes completed!');
