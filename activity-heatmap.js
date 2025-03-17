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
    // Remove any existing content
    heatmapContainer.innerHTML = '';
    
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
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'heatmap-tooltip';
        tooltip.textContent = `${activity.count} points on ${formatDate(dateStr)}`;
        
        // Set data attributes for styling and tooltips
        cell.setAttribute('data-level', activity.level);
        cell.setAttribute('data-date', dateStr);
        cell.title = `${activity.count} points on ${formatDate(dateStr)}`;
        
        // Add hover effect
        cell.addEventListener('mouseenter', () => {
          cell.appendChild(tooltip);
        });
        
        cell.addEventListener('mouseleave', () => {
          if (tooltip.parentElement) {
            cell.removeChild(tooltip);
          }
        });
      }
      
      currentDay.setDate(currentDay.getDate() + 1);
      dayCount++;
    }
    
    // Add everything to the container
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
  
  // Fetch and render activity data
  async function fetchActivityData() {
    const fetchPaths = [
      'activity-data.json',
      'public/activity-data.json'
    ];
    
    for (const path of fetchPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${path}:`, error);
      }
    }
    
    // Fallback to sample data if all fetches fail
    return generateSampleData();
  }
  
  // Generate sample data if no real data is available
  function generateSampleData() {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const random = Math.random();
      
      let count = 0;
      let level = 0;
      
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
    
    return data;
  }
  
  // Main execution
  fetchActivityData()
    .then(renderHeatmap)
    .catch(error => {
      console.error('Failed to render heatmap:', error);
      renderHeatmap(generateSampleData());
    });
});
