/**
 * freeCodeCamp Activity Scraper
 * This script uses Puppeteer to scrape activity data from a freeCodeCamp profile
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Get the freeCodeCamp username from environment variables or use default
const username = process.env.FCC_USERNAME || 'uelkerd';

async function scrapeActivity() {
  console.log(`Starting to scrape activity for user: ${username}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to ensure all elements are visible
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the freeCodeCamp profile page
    const url = `https://www.freecodecamp.org/${username}`;
    console.log(`Navigating to ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Page loaded, looking for activity heatmap...');
    
    // Wait for the activity heatmap to load
    await page.waitForSelector('.react-calendar-heatmap', { 
      timeout: 10000,
      visible: true 
    });
    
    console.log('Found heatmap, extracting data...');
    
    // Extract the activity data
    const activityData = await page.evaluate(() => {
      const result = [];
      
      // Get all activity cells from the heatmap
      const cells = document.querySelectorAll('.react-calendar-heatmap rect');
      
      cells.forEach(cell => {
        // Extract date and count from the tooltip data
        const tooltip = cell.getAttribute('data-tip');
        if (!tooltip) return;
        
        // Parse the tooltip text: "X points on Month Day, Year"
        const match = tooltip.match(/(\d+) points on ([A-Za-z]+ \d+, \d+)/);
        if (!match) return;
        
        const count = parseInt(match[1], 10);
        const dateStr = match[2];
        const date = new Date(dateStr).toISOString().split('T')[0];
        
        // Determine activity level from class
        let level = 0;
        if (cell.classList.contains('color-scale-a-lot')) level = 4;
        else if (cell.classList.contains('color-scale-some')) level = 3;
        else if (cell.classList.contains('color-scale-little')) level = 2;
        else if (cell.classList.contains('color-empty') && count > 0) level = 1;
        
        result.push({
          date,
          count,
          level
        });
      });
      
      return result;
    });
    
    console.log(`Found ${activityData.length} activity entries`);
    
    // Sort by date
    activityData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Fill in missing dates with zero counts
    const filledData = fillMissingDates(activityData);
    
    // Save to JSON file in the public directory
    const outputFile = path.join(process.cwd(), 'public', 'activity-data.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(filledData, null, 2));
    console.log(`Activity data saved to ${outputFile}`);
    
    // Also create a fallback file in the root for GitHub Pages compatibility
    fs.writeFileSync('activity-data.json', JSON.stringify(filledData, null, 2));
    console.log('Fallback activity data saved to activity-data.json');
    
  } catch (error) {
    console.error('Error scraping activity data:', error);
    
    // Generate sample data as fallback
    console.log('Generating sample data as fallback...');
    const sampleData = generateSampleData();
    
    fs.writeFileSync('activity-data.json', JSON.stringify(sampleData, null, 2));
    console.log('Sample activity data saved to activity-data.json');
    
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Function to fill in missing dates with zero counts
function fillMissingDates(data) {
  if (data.length === 0) return generateSampleData();
  
  const result = [];
  const dateMap = {};
  
  // Create a map of existing dates
  data.forEach(item => {
    dateMap[item.date] = item;
  });
  
  // Get start and end dates
  const sortedDates = data.map(item => new Date(item.date)).sort((a, b) => a - b);
  let startDate = sortedDates[0];
  const endDate = new Date(); // Today
  
  // Ensure we have at least 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (startDate > sixMonthsAgo) {
    startDate = sixMonthsAgo;
  }
  
  // Fill in all dates in the range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    if (dateMap[dateStr]) {
      result.push(dateMap[dateStr]);
    } else {
      result.push({
        date: dateStr,
        count: 0,
        level: 0
      });
    }
  }
  
  return result;
}

// Function to generate sample data
function generateSampleData() {
  const data = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  // Generate data for each day
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    // Generate more activity for weekdays, less for weekends
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const random = Math.random();
    
    let count = 0;
    let level = 0;
    
    if (!isWeekend && random > 0.6) {
      count = Math.floor(Math.random() * 5) + 1;
      level = 1;
    }
    
    if (!isWeekend && random > 0.75) {
      count = Math.floor(Math.random() * 10) + 5;
      level = 2;
    }
    
    if (!isWeekend && random > 0.9) {
      count = Math.floor(Math.random() * 15) + 15;
      level = 3;
    }
    
    if (!isWeekend && random > 0.97) {
      count = Math.floor(Math.random() * 20) + 30;
      level = 4;
    }
    
    data.push({
      date: dateStr,
      count,
      level
    });
  }
  
  // Add some recent activity for demonstration
  const recentDays = 4;
  for (let i = 0; i < recentDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Find and update the recent date
    const index = data.findIndex(item => item.date === dateStr);
    if (index !== -1) {
      data[index].count = Math.floor(Math.random() * 50) + 50;
      data[index].level = 4;
    }
  }
  
  return data;
}

// Execute the scraper
scrapeActivity();
