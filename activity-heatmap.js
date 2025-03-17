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
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`${path}?_=${timestamp}`);
        
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
   * Create activity grid from data with improved error handling and styling
   * @param {Array} sortedData - Chronologically sorted data
   * @returns {HTMLElement} Activity grid
   */
      function createActivityGrid(sortedData) {
        try {
          debugLog(`Creating grid with ${sortedData.length} cells`);
          
          const grid = document.createElement('div');
          grid.className = 'heatmap-grid';
          
          // Calculate grid dimensions
          const numWeeks = Math.ceil(sortedData.length / 7);
          
          // Fix the grid layout - this is the key change
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = `repeat(${numWeeks}, 12px)`;
          grid.style.gridTemplateRows = 'repeat(7, 12px)';
          grid.style.gap = '2px';
          grid.style.width = '100%'; 
          grid.style.justifyContent = 'space-between'; // Distribute columns evenly
          
          // Group data by week for proper rendering
          const weeks = [];
          for (let i = 0; i < numWeeks; i++) {
            weeks.push(sortedData.slice(i * 7, (i + 1) * 7));
          }
          
          // Create cells ordered by column (week) for proper display
          for (let row = 0; row < 7; row++) {
            for (let col = 0; col < weeks.length; col++) {
              const weekData = weeks[col];
              const entry = weekData[row];
              
              if (!entry) continue; // Skip if no data for this day
              
              const cell = document.createElement('div');
              cell.className = 'heatmap-cell';
              cell.style.width = '12px';
              cell.style.height = '12px';
              cell.style.borderRadius = '2px';
              
              // Place cell in proper position in grid
              cell.style.gridColumn = `${col + 1}`;
              cell.style.gridRow = `${row + 1}`;
              
              // Ensure level is within valid range
              const level = Math.max(0, Math.min(4, entry.level || 0));
              
              // Apply color based on level
              const colors = [
                '#ebedf0', // Level 0
                '#9be9a8', // Level 1
                '#40c463', // Level 2
                '#30a14e', // Level 3
                '#216e39'  // Level 4
              ];
              cell.style.backgroundColor = colors[level];
              
              cell.setAttribute('data-level', level);
              cell.setAttribute('data-date', entry.date);
              cell.title = `${entry.count || 0} points on ${formatDate(entry.date)}`;
              
              grid.appendChild(cell);
            }
          }
          
          return grid;
        } catch (error) {
          console.error('❌ Fatal error creating grid:', error);
          // Create a basic fallback grid
          const fallbackGrid = document.createElement('div');
          fallbackGrid.textContent = 'Error rendering activity. See console for details.';
          fallbackGrid.style.color = 'red';
          return fallbackGrid;
        }
      }
  /**
   * Create month labels from activity data
   * @param {Array} sortedData - Chronologically sorted data
   * @returns {HTMLElement} Month labels container
   */
  function createMonthLabels(sortedData) {
    const monthLabels = document.createElement('div');
    monthLabels.className = 'heatmap-month-labels';
    monthLabels.style.display = 'flex';
    monthLabels.style.justifyContent = 'space-between';
    monthLabels.style.marginBottom = '5px';
    
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
      label.style.fontSize = '12px';
      label.style.color = '#586069';
      monthLabels.appendChild(label);
    });
    
    return monthLabels;
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
    
    // Remove loading message first
    const loadingMessage = HEATMAP_CONFIG.container.querySelector('.loading-message');
    if (loadingMessage) loadingMessage.remove();
    
    // Ensure we have data
    if (!activityData || !Array.isArray(activityData) || activityData.length === 0) {
      debugLog('No activity data to render, showing empty state');
      renderEmptyState();
      return;
    }

    try {
      // Clear previous content
      HEATMAP_CONFIG.container.innerHTML = '';
      
      // Sort data chronologically
      const sortedData = activityData.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      // Create month labels
      const monthLabels = createMonthLabels(sortedData);
      HEATMAP_CONFIG.container.appendChild(monthLabels);
      
      // Create activity grid with explicit visibility
      const grid = createActivityGrid(sortedData);
      grid.style.display = 'grid'; // Force grid display
      grid.style.visibility = 'visible'; // Ensure visibility
      HEATMAP_CONFIG.container.appendChild(grid);
      
      // Update date range display
      updateDateRange(sortedData);
      
      // Check if we actually rendered anything
      setTimeout(() => {
        const cells = HEATMAP_CONFIG.container.querySelectorAll('.heatmap-cell');
        debugLog(`After rendering, found ${cells.length} visible cells`);
        
        if (cells.length === 0) {
          // Emergency fallback if no cells were rendered
          HEATMAP_CONFIG.container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <p>Activity data loaded (${activityData.length} entries) but rendering failed.</p>
              <p>Try refreshing the page or check console for errors.</p>
              <div style="margin-top: 10px; background: #f8f9fa; padding: 10px; border-radius: 4px; text-align: left;">
                <strong>Recent activity:</strong><br>
                ${activityData.filter(entry => entry.count > 0).slice(-5).map(entry => 
                  `${entry.date}: ${entry.count} points`
                ).join('<br>')}
              </div>
            </div>
          `;
        }
      }, 100);
      
      debugLog('Heatmap rendering complete');
    } catch (error) {
      console.error('❌ Error during heatmap rendering:', error);
      // Emergency fallback
      HEATMAP_CONFIG.container.innerHTML = `
        <div style="color: red; padding: 20px; text-align: center;">
          Error rendering activity heatmap.<br>
          ${error.message}
        </div>
      `;
    }
  }

  // Main execution with improved loading handling
  debugLog('Heatmap initialization started');
  
  // Clear existing content and add loading message
  if (HEATMAP_CONFIG.container) {
    HEATMAP_CONFIG.container.innerHTML = '<div class="loading-message" style="text-align: center; padding: 20px;">Loading activity data...</div>';
  }
  
  fetchActivityData()
    .then(data => {
      debugLog(`Fetched ${data.length} activity entries`);
      // Force a small delay to ensure DOM is ready
      setTimeout(() => {
        renderHeatmap(data);
      }, 50);
    })
    .catch(error => {
      console.error('❌ Heatmap rendering failed:', error);
      if (HEATMAP_CONFIG.container) {
        HEATMAP_CONFIG.container.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            Failed to load activity data.<br>
            ${error.message}
          </div>
        `;
      }
    });
});
