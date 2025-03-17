/**
 * Enhanced debug script for activity heatmap with persistent controls
 * Allows reopening the diagnostic panel and refreshing the tests
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if debug mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const debugEnabled = urlParams.has('debug');
  
  console.log('🔍 Heatmap Debug: Initializing diagnostics');
  
  if (debugEnabled) {
    // Create persistent debug button that stays visible
    const debugButton = document.createElement('button');
    // Rest of button creation and event handler code...
    
    // Auto-open panel on page load
    showDebugPanel();
  }
  
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Heatmap Debug: Initializing diagnostics');
  
  // Create persistent debug button that stays visible
  const debugButton = document.createElement('button');
  debugButton.textContent = 'Debug Heatmap';
  debugButton.id = 'open-debug-panel';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '10px';
  debugButton.style.right = '10px';
  debugButton.style.zIndex = '9998';
  debugButton.style.padding = '5px 10px';
  debugButton.style.backgroundColor = '#4CAF50';
  debugButton.style.color = 'white';
  debugButton.style.border = 'none';
  debugButton.style.borderRadius = '4px';
  debugButton.style.cursor = 'pointer';
  document.body.appendChild(debugButton);
  
  // Function to create and show the debug panel
  function showDebugPanel() {
    // Remove any existing panel
    const existingPanel = document.querySelector('.debug-panel');
    if (existingPanel) existingPanel.remove();
    
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.classList.add('debug-panel');
    debugPanel.style.position = 'fixed';
    debugPanel.style.bottom = '50px';
    debugPanel.style.right = '10px';
    debugPanel.style.backgroundColor = 'rgba(0,0,0,0.8)';
    debugPanel.style.color = 'white';
    debugPanel.style.padding = '10px';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.maxWidth = '400px';
    debugPanel.style.maxHeight = '80vh';
    debugPanel.style.overflow = 'auto';
    debugPanel.style.zIndex = '9999';
    debugPanel.style.fontSize = '12px';
    debugPanel.style.fontFamily = 'monospace';
    
    // Add header with close and reload buttons
    debugPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <strong>Heatmap Diagnostics</strong>
        <div>
          <button id="reload-debug" style="background: none; border: none; color: white; cursor: pointer; margin-right: 10px;">Reload</button>
          <button id="close-debug" style="background: none; border: none; color: white; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Handle close button - hide panel but keep the open button visible
    document.getElementById('close-debug').addEventListener('click', function() {
      debugPanel.remove();
    });
    
    // Handle reload button - refresh all tests
    document.getElementById('reload-debug').addEventListener('click', function() {
      showDebugPanel(); // This recreates the panel and runs all tests
    });
    
    // Run all the diagnostic tests
    runDiagnostics(debugPanel);
    
    return debugPanel;
  }
  
  // Add section function
  function addSection(panel, title, status = 'In progress', details = '') {
    const section = document.createElement('div');
    section.style.marginBottom = '10px';
    section.innerHTML = `
      <div><strong>${title}</strong></div>
      <div style="color: ${status === 'Success' ? '#4CAF50' : status === 'Failed' ? '#F44336' : '#2196F3'}">
        ${status}${details ? ': ' + details : ''}
      </div>
      <div class="details" style="margin-top: 5px;"></div>
    `;
    panel.appendChild(section);
    return section.querySelector('.details');
  }
  
  // Run all diagnostics
  function runDiagnostics(panel) {
    // Check heatmap container
    const heatmapContainer = document.getElementById('activity-heatmap');
    addSection(panel, '**Heatmap Container**', heatmapContainer ? 'Found' : 'Not found');
    
    // Start data check
    const dataCheckSection = addSection(panel, '**Checking data files...**');
    
    // Function to test file access with cache-busting
    async function checkFile(path, sectionTitle) {
      const section = addSection(panel, sectionTitle);
      
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`${path}?_=${timestamp}`);
        
        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            
            // Check for March activity to highlight recent data
            const marchActivity = data.filter(entry => 
              entry.date.startsWith('2025-03-') && entry.count > 0
            );
            
            let marchHtml = '';
            if (marchActivity.length > 0) {
              marchHtml = `<div style="margin-top: 5px; background: #2d4263; padding: 5px; border-radius: 3px;">
                <strong>March 2025 Activity:</strong><br>
                ${marchActivity.map(entry => 
                  `${entry.date}: ${entry.count} points (level ${entry.level})`
                ).join('<br>')}
              </div>`;
            }
            
            section.innerHTML = `Success: ${data.length} entries<br><br>
              <pre style="background: #333; padding: 5px; overflow: auto; max-height: 100px;">
              ${JSON.stringify(data.slice(0, 3), null, 2)}
              </pre>
              ${marchHtml}`;
          } catch (e) {
            section.textContent = `Failed to parse JSON: ${e.message}`;
          }
        } else {
          section.textContent = `Failed: ${response.status}`;
        }
      } catch (e) {
        section.textContent = `Error: ${e.message}`;
      }
    }
    
    // Get base URL info
    const baseUrlSection = addSection(panel, '**Base URL Info**');
    const pathname = window.location.pathname;
    const hostname = window.location.hostname;
    const fullUrl = window.location.href;
    baseUrlSection.innerHTML = `
      Pathname: ${pathname}<br>
      Hostname: ${hostname}<br>
      Full URL: ${fullUrl}<br>
    `;
    
    // Run all checks
    checkFile('activity-data.json', '**Data from activity-data.json**');
    checkFile('/activity-data.json', '**Fetch /activity-data.json**');
    checkFile('./activity-data.json', '**Data from ./activity-data.json**');
    checkFile('public/activity-data.json', '**Data from public/activity-data.json**');
    checkFile('/public/activity-data.json', '**Fetch /public/activity-data.json**');
    checkFile('./public/activity-data.json', '**Data from ./public/activity-data.json**');
    checkFile('../activity-data.json', '**Data from ../activity-data.json**');
    checkFile('docs/activity-data.json', '**Data from docs/activity-data.json**');
    
    // If this is GitHub Pages, try repo-specific paths
    if (hostname.includes('github.io')) {
      const repoName = pathname.split('/')[1]; // Assumes pathname format /repoName/...
      if (repoName) {
        checkFile(`/${repoName}/activity-data.json`, `**Fetch /${repoName}/activity-data.json**`);
        checkFile(`/${repoName}/public/activity-data.json`, `**Fetch /${repoName}/public/activity-data.json**`);
        checkFile(`/${repoName}/docs/activity-data.json`, `**Fetch /${repoName}/docs/activity-data.json**`);
      }
    }
    
    // Update status
    dataCheckSection.textContent = 'Complete';
  }
  
  // Handle the persistent debug button click
  debugButton.addEventListener('click', function() {
    showDebugPanel();
  });
  
  // Auto-open panel on page load
  showDebugPanel();
});
