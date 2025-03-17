/**
 * Accurate Activity Heatmap Renderer
 * 
 * Focuses on displaying genuine user activity with minimal assumptions
 */
document.addEventListener('DOMContentLoaded', function() {
  const HEATMAP_CONFIG = {
    container: document.getElementById('activity-heatmap'),
    dateRangeElement: document.querySelector('.activity-date-range'),
    emptyStateMessage: 'No activity recorded yet'
  };

  /**
   * Format dates in a human-readable way
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Render empty state when no activity is found
   */
  function renderEmptyState() {
    HEATMAP_CONFIG.container.innerHTML = '';
    
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'heatmap-empty-state';
    emptyMessage.textContent = HEATMAP_CONFIG.emptyStateMessage;
    
    HEATMAP_CONFIG.container.appendChild(emptyMessage);
    
    // Update date range to current period
    if (HEATMAP_CONFIG.dateRangeElement) {
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
      
      HEATMAP_CONFIG.dateRangeElement.textContent = 
        `${sixMonthsAgo.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
  }

  /**
   * Fetch and process activity data
   */
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
    
    return []; // Return empty array if no data found
  }

  /**
   * Render heatmap with actual activity data
   * @param {Array} activityData - Genuine activity entries
   */
  function renderHeatmap(activityData) {
    // If no activity, show empty state
    if (activityData.length === 0) {
      renderEmptyState();
      return;
    }

    // Sort and process data
    const sortedData = activityData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Clear previous content
    HEATMAP_CONFIG.container.innerHTML = '';
    
    // Create month labels (if data exists)
    const monthLabels = createMonthLabels(sortedData);
    const grid = createActivityGrid(sortedData);
    
    // Append to container
    HEATMAP_CONFIG.container.appendChild(monthLabels);
    HEATMAP_CONFIG.container.appendChild(grid);
    
    // Update date range
    updateDateRange(sortedData);
  }

  /**
   * Create month labels for the heatmap
   * @param {Array} sortedData - Sorted activity data
   * @returns {HTMLElement} Month labels container
   */
  function createMonthLabels(sortedData) {
    const monthLabels = document.createElement('div');
    monthLabels.className = 'heatmap-month-labels';
    
    const months = new Set();
    sortedData.forEach(item => {
      const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
      months.add(month);
    });
    
    Array.from(months).forEach(month => {
      const label = document.createElement('div');
      label.className = 'heatmap-month-label';
      label.textContent = month;
      monthLabels.appendChild(label);
    });
    
    return monthLabels;
  }

  /**
   * Create activity grid
   * @param {Array} sortedData - Sorted activity data
   * @returns {HTMLElement} Activity grid
   */
  function createActivityGrid(sortedData) {
    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    
    sortedData.forEach(entry => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.setAttribute('data-level', entry.level);
      cell.setAttribute('data-date', entry.date);
      cell.title = `${entry.count} points on ${formatDate(entry.date)}`;
      
      grid.appendChild(cell);
    });
    
    return grid;
  }

  /**
   * Update date range display
   * @param {Array} sortedData - Sorted activity data
   */
  function updateDateRange(sortedData) {
    if (HEATMAP_CONFIG.dateRangeElement) {
      const startDate = new Date(sortedData[0].date);
      const endDate = new Date(sortedData[sortedData.length - 1].date);
      
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
      
      HEATMAP_CONFIG.dateRangeElement.textContent = dateRangeText;
    }
  }

  // Main execution
  fetchActivityData()
    .then(renderHeatmap)
    .catch(error => {
      console.error('Failed to render heatmap:', error);
      renderEmptyState();
    });
});
