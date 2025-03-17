/**
 * freeCodeCamp Activity Scraper
 * This script uses Puppeteer to scrape activity data from a freeCodeCamp profile
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Get the freeCodeCamp username from environment variables
const username = process.env.FCC_USERNAME || 'uelkerd'; // Default to your GitHub username

async function scrapeActivity() {
  console.log(`Starting to scrape activity for user: ${username}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the freeCodeCamp profile page
    await page.goto(`https://www.freecodecamp.org/${username}`, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Page loaded, looking for activity heatmap...');
    
    // Wait for the activity heatmap to load
    await page.waitForSelector('.react-calendar-heatmap', { timeout: 10000 });
    
    // Extract the activity data
    const activityData = await page.evaluate(() => {
      const result = [];
      
      // Find all activity cells in the heatmap
      const cells = document.querySelectorAll('.react-calendar-heatmap-tile');
      
      cells.forEach(cell => {
        // Skip cells without dates (empty cells)
        if (!cell.dataset.date) return;
        
        // Extract data from cell
        const date = cell.dataset.date;
        
        // Extract count from class or data attribute
        let count = 0;
        
        // Look for classes containing activity level
        const classList = cell.classList;
        if (classList.contains('color-empty')) {
          count = 0;
        } else if (classList.contains('color-scale-a-lot')) {
          // Find the count from tooltip or data attribute if possible
          const tooltipMatch = cell.getAttribute('data-tip')?.match(/(\d+) contributions/);
          count = tooltipMatch ? parseInt(tooltipMatch[1]) : 20; // Default high value if exact count not found
        } else if (classList.contains('color-scale-some')) {
          count = 10; // Medium activity
        } else if (classList.contains('color-scale-little')) {
          count = 3; // Low activity
        }
        
        result.push({ date, count });
      });
      
      return result;
    });
    
    console.log(`Found ${activityData.length} activity entries`);
    
    // Sort by date
    activityData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save to JSON file
    fs.writeFileSync('activity-data.json', JSON.stringify(activityData, null, 2));
    console.log('Activity data saved to activity-data.json');
    
  } catch (error) {
    console.error('Error scraping activity data:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeActivity();
