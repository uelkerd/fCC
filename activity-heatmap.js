document.addEventListener('DOMContentLoaded', function() {
  const heatmapContainer = document.getElementById('activity-heatmap');
  
  // Function to format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Function to get month name
  function getMonthName(date) {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  
  // Function to render the heatmap
  function renderHeatmap(activityData) {
    // Get date range for the heatmap
    const dates = activityData.map(item => new Date(item.date));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    
    // Create month labels
    const monthLabels = document.createElement('div');
    monthLabels.className = 'heatmap-month-labels';
    
    const months = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthName = getMonthName(currentDate);
      if (!months.includes(monthName)) {
        months.push(monthName);
        
        const label = document.createElement('div');
        label.className = 'heatmap-month-label';
        label.textContent = monthName;
        monthLabels.appendChild(label);
      }
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Create the grid
    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    
    // Create a map of dates to activity counts
    const activityMap = {};
    activityData.forEach(item => {
      activityMap[item.date] = {
        count: item.count,
        level: item.level
      };
    });
    
    // Generate cells for each day
    const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const weeksNeeded = Math.ceil(daysBetween / 7);
    
    // Initialize the grid with empty cells
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < weeksNeeded; col++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        grid.appendChild(cell);
      }
    }
    
    // Fill in the grid with actual data
    let currentDay = new Date(startDate);
    let dayCount = 0;
    
    while (currentDay <= endDate) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const dayOfWeek = currentDay.getDay(); // 0 = Sunday, 6 = Saturday
      const weekNum = Math.floor(dayCount / 7);
      
      const cellIndex = dayOfWeek + (weekNum * 7);
      const cell = grid.children[cellIndex];
      
      if (cell) {
        const activity = activityMap[dateStr] || { count: 0, level: 0 };
        
        // Set data attributes for styling and tooltips
        cell.setAttribute('data-level', activity.level);
        cell.setAttribute('data-date', dateStr);
        cell.setAttribute('title', `${activity.count} points on ${formatDate(dateStr)}`);
      }
      
      currentDay.setDate(currentDay.getDate() + 1);
      dayCount++;
    }
    
    // Add everything to the container
    heatmapContainer.innerHTML = '';
    heatmapContainer.appendChild(monthLabels);
    heatmapContainer.appendChild(grid);
    
    // Update the date range text
    const dateRangeEl = document.querySelector('.activity-date-range');
    if (dateRangeEl) {
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      
      let dateRangeText = `${startMonth} ${startYear}`;
      if (startYear !== endYear) {
        dateRangeText += ` - ${endMonth} ${endYear}`;
      } else if (startMonth !== endMonth) {
        dateRangeText += ` - ${endMonth} ${endYear}`;
      }
      
      dateRangeEl.textContent = dateRangeText;
    }
  }
  
  // Function to generate sample data if needed
  function generateSampleData() {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    // Fill in all dates in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const random = Math.random();
      
      let count = 0;
      let level = 0;
      
      // Generate some random activity
      if (random > 0.7) {
        count = Math.floor(Math.random() * 5) + 1;
        level = 1;
      } else if (random > 0.85) {
        count = Math.floor(Math.random() * 10) + 5;
        level = 2;
      } else if (random > 0.95) {
        count = Math.floor(Math.random() * 15) + 15;
        level = 3;
      } else if (random > 0.98) {
        count = Math.floor(Math.random() * 20) + 30;
        level = 4;
      }
      
      data.push({
        date: dateStr,
        count,
        level
      });
    }
    
    // Add recent activity
    const recent = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(recent);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const index = data.findIndex(item => item.date === dateStr);
      if (index !== -1) {
        data[index].count = Math.floor(Math.random() * 50) + 50;
        data[index].level = 4;
      }
    }
    
    return data;
  }
  
  // Try to fetch activity data
  fetch('activity-data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Activity data not found');
      }
      return response.json();
    })
    .then(data => {
      // Save to localStorage for caching
      localStorage.setItem('fccActivityData', JSON.stringify(data));
      localStorage.setItem('fccActivityLastUpdated', new Date().toISOString());
      
      // Render the heatmap
      renderHeatmap(data);
    })
    .catch(error => {
      console.warn('Error loading activity data:', error);
      
      // Try to use cached data
      const cachedData = localStorage.getItem('fccActivityData');
      const lastUpdated = localStorage.getItem('fccActivityLastUpdated');
      
      if (cachedData && lastUpdated) {
        const now = new Date();
        const updated = new Date(lastUpdated);
        
        // Use cached data if it's less than 24 hours old
        if (now - updated < 24 * 60 * 60 * 1000) {
          console.log('Using cached activity data');
          renderHeatmap(JSON.parse(cachedData));
          return;
        }
      }
      
      // Generate and use sample data as fallback
      console.log('Generating sample activity data');
      const sampleData = generateSampleData();
      renderHeatmap(sampleData);
    });
});
