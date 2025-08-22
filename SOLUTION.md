# Node.js Error Resolution Guide

## Problem Summary
You encountered multiple Node.js errors when running your scraping scripts:
1. `ERR_MODULE_NOT_FOUND` for selenium-webdriver/chrome
2. ChromeDriver not found (ENOENT error)
3. Import path issues with ESM modules

## Complete Solution

### ✅ Step 1: Fix Import Statements
The main issue was incorrect ESM import syntax. I've updated `browser-config.js` to use the correct format:

```javascript
// ✅ Correct (ESM):
import * as chrome from 'selenium-webdriver/chrome.js';

// ❌ Incorrect:
import chrome from 'selenium-webdriver/chrome';
```

### ✅ Step 2: Run the Fix Scripts
Execute these commands to fix all issues:

```bash
# Navigate to your project directory
cd hunt360

# Run the import fix script
node scripts/fix-imports.js

# Run the ChromeDriver setup script
node scripts/setup-chromedriver.js
```

### ✅ Step 3: Manual Fixes for Scraper Files
Update all scraper files to use the correct import syntax:

**In each scraper file (glassdoor_scraper.js, intern_scraper.js, etc.):**

Replace:
```javascript
import chrome from 'selenium-webdriver/chrome';
```

With:
```javascript
import * as chrome from 'selenium-webdriver/chrome.js';
```

### ✅ Step 4: Verify Installation
Run this test to verify everything works:

```bash
node test-chromedriver.js
```

## Files Updated
- ✅ `scripts/utils/browser-config.js` - Fixed ESM imports
- ✅ `scripts/fix-imports.js` - Automated import fixer
- ✅ `scripts/setup-chromedriver.js` - ChromeDriver setup script
- ✅ `test-chromedriver.js` - Test script for verification

## Common Issues and Solutions

### Issue 1: Module Not Found
**Error**: `Cannot find module 'selenium-webdriver/chrome'`
**Solution**: Use `import * as chrome from 'selenium-webdriver/chrome.js'`

### Issue 2: ChromeDriver Not Found
**Error**: `spawn /usr/bin/chromedriver ENOENT`
**Solution**: Run `node scripts/setup-chromedriver.js`

### Issue 3: ESM Module Resolution
**Error**: `ERR_MODULE_NOT_FOUND`
**Solution**: Ensure all imports use `.js` extension for ESM modules

## Quick Fix Commands
```bash
# One-liner to fix everything
cd hunt360 && node scripts/fix-imports.js && node scripts/setup-chromedriver.js
```

## Verification
After running the fixes, test your application:
```bash
node index.js
```

Your scraping scripts should now work without the Node.js errors!
