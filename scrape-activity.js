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
    
    // Robust heatmap selector wait
    await page.waitForSelector(SCRAPE_OPTIONS.heatmapSelector, { 
      timeout: 15000,
      visible: true 
    });
    
    console.log('📊 Extracting pinpoint-accurate activity data...');
    
    // Hyper-precise data extraction
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
        
        // STRICT: Only capture cells with EXACTLY matching tooltip
        if (count > 0) {
          let level = 0;
          if (cell.classList.contains('color-scale-4')) level = 4;
          else if (cell.classList.contains('color-scale-3')) level = 3;
          else if (cell.classList.contains('color-scale-2')) level = 2;
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
    
    // Save ONLY real data
    await saveActivityData(activityData);
    
  } catch (error) {
    console.error('❌ Scraping encountered precise error:', error);
    
    // Explicitly save empty array - NO FABRICATION
    await saveActivityData([]);
  } finally {
    await browser.close();
  }
}

/**
 * Ultra-Safe Data Saving
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
  } catch (error) {
    console.error('❌ Error saving precise data:', error);
  }
}

// Execute the precise scraper
scrapeActivity();
