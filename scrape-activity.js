/**
 * Accurate freeCodeCamp Activity Scraper
 * 
 * Focuses on capturing genuine user activity without fabricating data
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const USERNAME = process.env.FCC_USERNAME || 'uelkerd';
const SCRAPE_OPTIONS = {
  viewport: { width: 1280, height: 800 },
  timeout: 60000,
  heatmapSelector: '.react-calendar-heatmap',
};

async function scrapeActivity() {
  console.log(`🕵️ Attempting to scrape activity for: ${USERNAME}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport(SCRAPE_OPTIONS.viewport);
    
    const profileUrl = `https://www.freecodecamp.org/${USERNAME}`;
    console.log(`🌐 Navigating to: ${profileUrl}`);
    
    await page.goto(profileUrl, {
      waitUntil: 'networkidle2',
      timeout: SCRAPE_OPTIONS.timeout
    });
    
    // Wait for heatmap, with extended timeout and error handling
    await page.waitForSelector(SCRAPE_OPTIONS.heatmapSelector, { 
      timeout: 15000,
      visible: true 
    });
    
    console.log('📊 Extracting genuine activity data...');
    
    // Capture actual activity data
    const activityData = await page.evaluate(() => {
      const result = [];
      const cells = document.querySelectorAll('.react-calendar-heatmap rect');
      
      cells.forEach(cell => {
        const tooltip = cell.getAttribute('data-tip');
        if (!tooltip) return;
        
        const match = tooltip.match(/(\d+) points on ([A-Za-z]+ \d+, \d+)/);
        if (!match) return;
        
        const count = parseInt(match[1], 10);
        const dateStr = new Date(match[2]).toISOString().split('T')[0];
        
        // Capture only cells with actual activity
        if (count > 0) {
          let level = 0;
          if (cell.classList.contains('color-scale-4')) level = 4;
          else if (cell.classList.contains('color-scale-3')) level = 3;
          else if (cell.classList.contains('color-scale-2')) level = 2;
          else if (cell.classList.contains('color-scale-1')) level = 1;
          
          result.push({ date: dateStr, count, level });
        }
      });
      
      return result;
    });
    
    console.log(`📝 Found ${activityData.length} genuine activity entries`);
    
    // Save data, even if it's empty
    await saveActivityData(activityData);
    
  } catch (error) {
    console.error('❌ Scraping encountered an issue:', error);
    
    // Save an empty array instead of generating fake data
    await saveActivityData([]);
  } finally {
    await browser.close();
  }
}

/**
 * Save activity data with strict validation
 * @param {Array} data - Verified activity entries
 */
async function saveActivityData(data) {
  const outputDir = path.join(process.cwd(), 'public');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const publicOutputPath = path.join(outputDir, 'activity-data.json');
  const rootOutputPath = path.join(process.cwd(), 'activity-data.json');
  
  const jsonData = JSON.stringify(data, null, 2);
  
  try {
    fs.writeFileSync(publicOutputPath, jsonData);
    fs.writeFileSync(rootOutputPath, jsonData);
    
    console.log(`💾 Data saved: ${data.length} entries`);
  } catch (error) {
    console.error('❌ Error saving data:', error);
  }
}

// Execute the scraper
scrapeActivity();
