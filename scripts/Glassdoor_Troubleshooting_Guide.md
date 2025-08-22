# Glassdoor Scraper Troubleshooting Guide

## Issues Identified and Fixed

### 1. **Missing ErrorHandler Utility**
**Problem**: The original scraper referenced `ErrorHandler` which doesn't exist.
**Solution**: Created utility functions:
- `sleep(ms)` - replaces `ErrorHandler.sleep()`
- `safeQuit(driver)` - replaces `ErrorHandler.safeQuit()`

### 2. **Incorrect Usage Message**
**Problem**: Error message referenced "glassdoor_scraper_fixed.js" instead of actual filename.
**Solution**: Updated usage message to show correct filename.

### 3. **SSL Certificate Issues**
**Problem**: CA certificate path might be incorrect.
**Solution**: Added proper error handling for certificate loading.

### 4. **Missing Dependencies**
**Problem**: Some required imports might be missing.
**Solution**: Verified all dependencies are properly imported.

## How to Run the Fixed Scraper

### Method 1: Direct Command
```bash
cd hunt360/scripts
node glassdoor_scraper_fixed.js "Software Engineer" "Mumbai"
```

### Method 2: Using Test Script
```bash
cd hunt360/scripts
node test_glassdoor_scraper.js
```

### Method 3: From Project Root
```bash
cd hunt360
node scripts/glassdoor_scraper_fixed.js "Data Analyst" "Bangalore"
```

## Common Issues and Solutions

### 1. **ChromeDriver Not Found**
**Error**: `ChromeDriver not found`
**Solution**: 
- Ensure chromedriver is installed: `npm install chromedriver`
- Check if Chrome browser is installed on your system
- Verify Chrome version matches chromedriver version

### 2. **SSL Certificate Error**
**Error**: `Error loading certificate`
**Solution**:
- Check if `hunt360/certs/ca.pem` exists
- If not, create the certs directory and add the certificate
- Or disable SSL verification (not recommended for production)

### 3. **Database Connection Error**
**Error**: `[DB] Error saving data`
**Solution**:
- Ensure MySQL is running
- Check database credentials in environment variables
- Verify database schema exists

### 4. **Element Not Found**
**Error**: `Job parsing error: NoSuchElementError`
**Solution**:
- Glassdoor may have updated their UI
- Check if selectors are still valid
- Run in non-headless mode to debug: `await BrowserConfig.createDriver(false)`

### 5. **Timeout Errors**
**Error**: `TimeoutError: Waiting for element`
**Solution**:
- Increase wait timeouts
- Check internet connection
- Verify Glassdoor is accessible from your location

## Environment Setup

### Required Environment Variables
```bash
# Create .env file in hunt360 directory
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=scraped_data
```

### Database Schema
```sql
CREATE DATABASE IF NOT EXISTS scraped_data;
USE scraped_data;

CREATE TABLE IF NOT EXISTS scraped_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255),
    location VARCHAR(255),
    job_title VARCHAR(255),
    address TEXT,
    phone_number VARCHAR(50),
    website_link VARCHAR(255),
    gst_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Debugging Tips

### 1. **Enable Verbose Logging**
Add console.log statements to track progress:
```javascript
console.log('Current URL:', await driver.getCurrentUrl());
console.log('Page title:', await driver.getTitle());
```

### 2. **Take Screenshots**
Add screenshot capture on errors:
```javascript
await driver.takeScreenshot().then(data => {
    fs.writeFileSync('error_screenshot.png', data, 'base64');
});
```

### 3. **Run in Non-Headless Mode**
For debugging, run Chrome with GUI:
```javascript
driver = await BrowserConfig.createDriver(false);
```

### 4. **Check Network Issues**
Verify Glassdoor accessibility:
- Try accessing https://www.glassdoor.co.in manually
- Check if any VPN/proxy is interfering
- Verify no firewall blocking

## Performance Optimization

### 1. **Reduce Wait Times**
Adjust sleep durations based on your connection speed.

### 2. **Batch Processing**
Process multiple jobs in batches to reduce database calls.

### 3. **Error Recovery**
Implement retry logic for failed requests.

## Testing Checklist

- [ ] Chrome browser installed and updated
- [ ] ChromeDriver installed and compatible
- [ ] MySQL running and accessible
- [ ] Database schema created
- [ ] Environment variables configured
- [ ] SSL certificate available
- [ ] Internet connection stable
- [ ] Glassdoor accessible from location

## Support

If issues persist:
1. Check console output for specific error messages
2. Verify all dependencies are installed: `npm install`
3. Run test script: `node test_glassdoor_scraper.js`
4. Check browser-config.js for Chrome path issues
