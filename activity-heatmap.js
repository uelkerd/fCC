/**
 * Precision Activity Heatmap Renderer
 * 
 * Displays ONLY genuine user activity without assumptions
 */
document.addEventListener('DOMContentLoaded', function() {
  const HEATMAP_CONFIG = {
    container: document.getElementById('activity-heatmap'),
    dateRangeElement: document.querySelector('.activity-date-range'),
    emptyStateMessage: 'No freeCodeCamp activity recorded yet'
  };

  /**
   * Format dates for human readability
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
   * Render empty state when no activity exists
   */
  function renderEmptyState() {
    HEATMAP_CONFIG.container.innerHTML = '';
    
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'heatmap-empty-state';
    emptyMessage.textContent = HEATMAP_CONFIG.emptyStateMessage;
    
    HEATMAP_CONFIG.container.appendChild(emptyMessage);
    
    // Default date range to current period
    if (HEATMAP_CONFIG.dateRangeElement) {
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      
      HEATMAP_CONFIG.dateRangeElement.textContent = 
        `${sixMonthsAgo.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
  }

  /**
   * Fetch activity data with strict validation
   * @returns {Promise<Array>} Activity entries
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
          
          // Strict filtering for actual activity
          const validData = data.filter(entry => entry.count > 0);
          return validData;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${path}:`, error);
      }
    }
    
    return []; // Explicit empty array
  }

  /**
   * Render heatmap with strict activity data
   * @param {Array} activityData - Verified activity entries
   */
  function renderHeatmap(activityData) {
    // Immediate empty state if no data
    if (activityData.length === 0) {
      renderEmptyState();
      return;
    }

    // Sort data chronologically
    const sortedData = activityData.sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Clear previous content
    HEATMAP_CONFIG.container.innerHTML = '';
    
    // Create month labels
    const monthLabels = createMonthLabels(sortedData);
    HEATMAP_CONFIG.container.appendChild(monthLabels);
    
    // Create activity grid
    const grid = createActivityGrid(sortedData);
    HEATMAP_CONFIG.container.appendChild(grid);
    
    // Update date range display
    updateDateRange(sortedData);
  }

  /**
   * Create month labels from activity data
   * @param {Array} sortedData - Chronologically sorted data
   * @returns {HTMLElement} Month labels container
   */
  function createMonthLabels(sortedData) {
    const monthLabels = document.createElement('div');
    monthLabels.className = 'heatmap-month-labels';
    
    const monthSet = new Set(sortedData.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })
    ));
    
    monthSet.forEach(month => {
      const label = document.createElement('div');
      label.className = 'heatmap-month-label';
      label.textContent = month;
      monthLabels.appendChild(label);
    });
    
    return monthLabels;
  }

  /**
   * Create activity grid from data
   * @param {Array} sortedData - Chronologically sorted data
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
   * @param {Array} sortedData - Chronologically sorted data
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
      console.error('Heatmap rendering failed:', error);
      renderEmptyState();
    });
});
