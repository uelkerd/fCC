/**
 * Enhanced debug script for activity heatmap
 * Add this to your page to get more detailed diagnostics
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Heatmap Debug: Initializing diagnostics');
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.classList.add('debug-panel');
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
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
  
  // Add header with close button
  debugPanel.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <strong>Heatmap Diagnostics</strong>
      <button id="close-debug" style="background: none; border: none; color: white; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(debugPanel);
  
  // Handle close button
  document.getElementById('close-debug').addEventListener('click', function() {
    debugPanel.style.display = 'none';
  });
  
  // Add section function
  function addSection(title, status = 'In progress', details = '') {
    const section = document.createElement('div');
    section.style.marginBottom = '10px';
    section.innerHTML = `
      <div><strong>${title}</strong></div>
      <div style="color: ${status === 'Success' ? '#4CAF50' : status === 'Failed' ? '#F44336' : '#2196F3'}">
        ${status}${details ? ': ' + details : ''}
      </div>
      <div class="details" style="margin-top: 5px;"></div>
    `;
    debugPanel.appendChild(section);
    return section.querySelector('.details');
  }
  
  // Check heatmap container
  const heatmapContainer = document.getElementById('activity-heatmap');
  addSection('**Heatmap Container**', heatmapContainer ? 'Found' : 'Not found');
  
  // Start data check
  const dataCheckSection = addSection('**Checking data files...**');
  
  // Function to test file access
  async function checkFile(path, sectionTitle) {
    const section = addSection(sectionTitle);
    
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          section.innerHTML = `Success: ${data.length} entries<br><br><pre style="background: #333; padding: 5px; overflow: auto; max-height: 100px;">${JSON.stringify(data.slice(0, 3), null, 2)}</pre>`;
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
  const baseUrlSection = addSection('**Base URL Info**');
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
});
