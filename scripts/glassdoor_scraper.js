import { spawn } from 'child_process';
import path from 'path';

// Test the fixed glassdoor scraper
const testScraper = () => {
    console.log('Testing Glassdoor scraper...');
    
    // Test with sample parameters
    const industry = 'Software Engineer';
    const city = 'Mumbai';
    
    console.log(`Running scraper for: ${industry} in ${city}`);
    
    const scraper = spawn('node', [
        path.join(__dirname, 'glassdoor_scraper_fixed.js'),
        industry,
        city
    ], {
        cwd: __dirname,
        stdio: 'inherit'
    });
    
    scraper.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Scraper completed successfully!');
        } else {
            console.error(`❌ Scraper failed with code: ${code}`);
        }
    });
    
    scraper.on('error', (error) => {
        console.error('❌ Error running scraper:', error.message);
    });
};

// Run the test
testScraper();
