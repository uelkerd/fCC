/**
 * Improved Activity Heatmap Renderer
 * 
 * Displays user activity with robust error handling and diagnostics
 */
document.addEventListener('DOMContentLoaded', function() {
  const HEATMAP_CONFIG = {
    container: document.getElementById('activity-heatmap'),
    dateRangeElement: document.querySelector('.activity-date-range'),
    emptyStateMessage: 'No freeCodeCamp activity recorded yet',
    debugMode: true // Enable for troubleshooting
  };

  // Add debug log function
  function debugLog(...args) {
    if (HEATMAP_CONFIG.debugMode) {
      console.log('🔍 [Heatmap Debug]', ...args);
    }
  }

  /**
   * Format dates for human readability
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      debugLog('Date formatting error:', error);
      return dateString || 'Unknown date';
    }
  }

  /**
   * Render empty state when no activity exists
   */
  function renderEmptyState() {
    debugLog('Rendering empty state');
    
    if (!HEATMAP_CONFIG.container) {
      console.error('❌ Heatmap container element not found!');
      return;
    }
    
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
   * Create a basic placeholder activity for today
   * @returns {Array} Single activity entry for today
   */
  function createPlaceholderActivity() {
    const today = new Date();
    return [{
      date: today.toISOString().split('T')[0],
      count: 1,
      level: 1
    }];
  }

  /**
   * Get the base URL for the current page, handling GitHub Pages subpaths
   * @returns {string} Base URL including any path prefix
   */
  function getBaseUrl() {
    const fullPath = window.location.pathname;
    
    // For GitHub Pages, if we're in a project repo (not username.github.io)
    // we need to include the repo name in the base URL
    if (fullPath.includes('/fCC/')) {
      // Extract the part up to and including 'fCC/'
      const pathParts = fullPath.split('/fCC/');
      return pathParts[0] + '/fCC/';
    }
    
    // For other cases, just return the directory part of the current path
    const pathWithoutFilename = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
    return pathWithoutFilename || '/';
  }

  /**
   * Fetch activity data with improved error handling
   * @returns {Promise<Array>} Activity entries
   */
  async function fetchActivityData() {
    debugLog('Attempting to fetch activity data');
    
    // Get the base URL for GitHub Pages compatibility
    const baseUrl = getBaseUrl();
    debugLog(`Using base URL: ${baseUrl}`);
    
    // Try multiple file paths with both absolute and relative paths
    const fetchPaths = [
      // Relative paths
      'activity-data.json',
      './activity-data.json',
      '../activity-data.json',
      'public/activity-data.json',
      './public/activity-data.json',
      
      // Base URL paths (for GitHub Pages with subpaths)
      `${baseUrl}activity-data.json`,
      `${baseUrl}public/activity-data.json`,
      `${baseUrl}docs/activity-data.json`,
      
      // Absolute paths from root
      '/activity-data.json',
      '/public/activity-data.json',
      '/docs/activity-data.json',
      
      // If GitHub Pages uses username.github.io/fCC format
      '/fCC/activity-data.json',
      '/fCC/public/activity-data.json'
    ];
    
    let fetchErrors = [];
    
    for (const path of fetchPaths) {
      try {
        debugLog(`Trying path: ${path}`);
        const response = await fetch(path);
        
        if (response.ok) {
          const rawText = await response.text();
          debugLog(`Got data from ${path}, length: ${rawText.length} chars`);
          
          try {
            const data = JSON.parse(rawText);
            
            if (!Array.isArray(data)) {
              debugLog(`Data is not an array: ${typeof data}`);
              continue;
            }
            
            debugLog(`Successfully parsed JSON with ${data.length} entries`);
            
            // Accept ALL entries, including those with 0 count
            return data;
          } catch (jsonError) {
            debugLog(`JSON parse error from ${path}:`, jsonError);
            fetchErrors.push(`JSON parse error from ${path}: ${jsonError.message}`);
          }
        } else {
          debugLog(`Failed to fetch from ${path}: ${response.status} ${response.statusText}`);
          fetchErrors.push(`${path}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        debugLog(`Network error from ${path}:`, error);
        fetchErrors.push(`${path}: ${error.message}`);
      }
    }
    
    // Log all fetch errors if all attempts failed
    console.warn('❗ All fetch attempts failed:', fetchErrors);
    
    // Create placeholder data for display
    debugLog('Creating placeholder activity');
    return createPlaceholderActivity();
  }

  /**
   * Render heatmap with activity data
   * @param {Array} activityData - Activity entries
   */
  function renderHeatmap(activityData) {
    debugLog(`Rendering heatmap with ${activityData.length} entries`);
    
    if (!HEATMAP_CONFIG.container) {
      console.error('❌ Heatmap container element not found!');
      return;
    }
    
    // Ensure we have data
    if (!activityData || !Array.isArray(activityData) || activityData.length === 0) {
      debugLog('No activity data to render, showing empty state');
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
    
    debugLog('Heatmap rendering complete');
  }

  /**
   * Create month labels from activity data
   * @param {Array} sortedData - Chronologically sorted data
   * @returns {HTMLElement} Month labels container
   */
  function createMonthLabels(sortedData) {
    const monthLabels = document.createElement('div');
    monthLabels.className = 'heatmap-month-labels';
    
    // Get all unique months in the data
    const monthSet = new Set(sortedData.map(entry => {
      try {
        return new Date(entry.date).toLocaleDateString('en-US', { month: 'short' });
      } catch (e) {
        debugLog('Month label error for date:', entry.date, e);
        return '';
      }
    }).filter(m => m));  // Filter out empty strings
    
    debugLog('Month labels:', Array.from(monthSet));
    
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
      try {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // Ensure level is within valid range
        const level = Math.max(0, Math.min(4, entry.level || 0));
        cell.setAttribute('data-level', level);
        cell.setAttribute('data-date', entry.date);
        cell.title = `${entry.count || 0} points on ${formatDate(entry.date)}`;
        
        grid.appendChild(cell);
      } catch (error) {
        debugLog('Cell creation error for entry:', entry, error);
      }
    });
    
    return grid;
  }

  /**
   * Update date range display
   * @param {Array} sortedData - Chronologically sorted data
   */
  function updateDateRange(sortedData) {
    if (!HEATMAP_CONFIG.dateRangeElement || sortedData.length === 0) return;
    
    try {
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
      debugLog('Date range updated:', dateRangeText);
    } catch (error) {
      debugLog('Date range update error:', error);
    }
  }

  // Main execution
  debugLog('Heatmap initialization started');
  
  // Remove loading message if present
  const loadingMessage = document.querySelector('.loading-message');
  if (loadingMessage) loadingMessage.textContent = 'Looking for activity data...';
  
  fetchActivityData()
    .then(data => {
      debugLog(`Fetched ${data.length} activity entries`);
      renderHeatmap(data);
    })
    .catch(error => {
      console.error('❌ Heatmap rendering failed:', error);
      renderEmptyState();
    })
    .finally(() => {
      if (loadingMessage) loadingMessage.remove();
    });
});
