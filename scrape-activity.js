/**
 * Ultra-Precise freeCodeCamp Activity Scraper
 * 
 * Captures ONLY genuine user activity with zero fabrication
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
  console.log(`🕵️ Precisely capturing activity for: ${USERNAME}`);
  
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
    
    // Wait for heatmap with longer timeout
    await page.waitForSelector(SCRAPE_OPTIONS.heatmapSelector, { 
      timeout: 30000,
      visible: true 
    });
    
    console.log('📊 Extracting pinpoint-precise activity data...');
    
    // Hyper-precise data extraction
    const activityData = await page.evaluate(() => {
      const result = [];
      const cells = document.querySelectorAll('.react-calendar-heatmap rect');
      
      cells.forEach(cell => {
        const tooltip = cell.getAttribute('data-tip');
        if (!tooltip) return;
        
        // More robust regex to handle variations
        const match = tooltip.match(/(\d+)\s*points? on ([A-Za-z]+ \d+, \d+)/);
        if (!match) return;
        
        const count = parseInt(match[1], 10);
        const dateStr = new Date(match[2]).toISOString().split('T')[0];
        
        // Critical: Only capture cells with more than 0 points
        if (count > 0) {
          let level = 0;
          if (cell.classList.contains('color-scale-a-lot')) level = 4;
          else if (cell.classList.contains('color-scale-some')) level = 3;
          else if (cell.classList.contains('color-scale-little')) level = 2;
          else if (cell.classList.contains('color-scale-1')) level = 1;
          
          result.push({ 
            date: dateStr, 
            count, 
            level 
          });
        }
      });
      
      return result;
    });
    
    console.log(`📝 Captured ${activityData.length} EXACT activity entries`);
    
    // Save data with precise logging
    await saveActivityData(activityData);
    
  } catch (error) {
    console.error('❌ Precise scraping error:', error);
    
    // Explicit empty array save
    await saveActivityData([]);
  } finally {
    await browser.close();
  }
}

/**
 * Precision Data Saving
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
    
    console.log(`💾 PRECISE Data saved: ${data.length} entries`);
    console.log('📁 Files written:', publicOutputPath, rootOutputPath);
  } catch (error) {
    console.error('❌ Precise data save error:', error);
  }
}

// Execute the ultra-precise scraper
scrapeActivity();
