/**
 * Heatmap Diagnostic Tool
 * Add this script to debug activity data issues
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Heatmap Diagnostic Tool loaded');
  
  // Create diagnostic button
  const debugButton = document.createElement('button');
  debugButton.textContent = 'Diagnose Heatmap';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '10px';
  debugButton.style.right = '10px';
  debugButton.style.zIndex = '9999';
  debugButton.style.padding = '8px 12px';
  debugButton.style.backgroundColor = '#0a0a23';
  debugButton.style.color = 'white';
  debugButton.style.border = '1px solid #f5f6f7';
  debugButton.style.borderRadius = '4px';
  debugButton.style.cursor = 'pointer';
  
  document.body.appendChild(debugButton);
  
  debugButton.addEventListener('click', async function() {
    // Create or update diagnostic panel
    let panel = document.getElementById('heatmap-diagnostic-panel');
    
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'heatmap-diagnostic-panel';
      panel.style.position = 'fixed';
      panel.style.top = '20px';
      panel.style.right = '20px';
      panel.style.width = '400px';
      panel.style.maxHeight = '80vh';
      panel.style.overflowY = 'auto';
      panel.style.backgroundColor = '#0a0a23';
      panel.style.color = '#f5f6f7';
      panel.style.padding = '15px';
      panel.style.borderRadius = '8px';
      panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      panel.style.zIndex = '10000';
      panel.style.fontFamily = 'monospace';
      panel.style.fontSize = '14px';
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.padding = '4px 8px';
      closeButton.style.backgroundColor = '#444';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      
      closeButton.addEventListener('click', function() {
        panel.remove();
      });
      
      panel.appendChild(closeButton);
      document.body.appendChild(panel);
    }
    
    // Clear previous content
    panel.innerHTML = '<h3 style="margin-top:0">Heatmap Diagnostics</h3>';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.padding = '4px 8px';
    closeButton.style.backgroundColor = '#444';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.addEventListener('click', function() {
      panel.remove();
    });
    
    panel.appendChild(closeButton);
    
    // Check heatmap container
    const heatmapContainer = document.getElementById('activity-heatmap');
    addDiagnosticItem(panel, 'Heatmap Container', heatmapContainer ? 'Found' : 'Missing', heatmapContainer ? 'green' : 'red');
    
    // Try to fetch activity data from multiple sources
    const paths = [
      'activity-data.json',
      '/activity-data.json',
      './activity-data.json',
      'public/activity-data.json',
      '/public/activity-data.json',
      './public/activity-data.json'
    ];
    
    addDiagnosticItem(panel, 'Checking data files...', 'In progress', 'orange');
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        
        if (response.ok) {
          try {
            const text = await response.text();
            const data = JSON.parse(text);
            
            addDiagnosticItem(
              panel, 
              `Data from ${path}`, 
              `Success: ${Array.isArray(data) ? data.length : 'Not an array'} entries`, 
              'green'
            );
            
            if (Array.isArray(data) && data.length > 0) {
              // Show sample data
              const sampleData = data.slice(0, 3);
              const sampleItem = document.createElement('pre');
              sampleItem.style.background = '#111';
              sampleItem.style.padding = '8px';
              sampleItem.style.borderRadius = '4px';
              sampleItem.style.fontSize = '12px';
              sampleItem.style.overflow = 'auto';
              sampleItem.textContent = JSON.stringify(sampleData, null, 2);
              panel.appendChild(sampleItem);
            }
          } catch (e) {
            addDiagnosticItem(panel, `Parse error ${path}`, e.message, 'red');
          }
        } else {
          addDiagnosticItem(panel, `Fetch ${path}`, `Failed: ${response.status}`, 'red');
        }
      } catch (e) {
        addDiagnosticItem(panel, `Request ${path}`, `Error: ${e.message}`, 'red');
      }
    }
    
    // Create emergency data button
    const createButton = document.createElement('button');
    createButton.textContent = 'Create Emergency Data';
    createButton.style.padding = '8px 12px';
    createButton.style.backgroundColor = '#0a0a23';
    createButton.style.color = 'white';
    createButton.style.border = '1px solid #f5f6f7';
    createButton.style.borderRadius = '4px';
    createButton.style.marginTop = '15px';
    createButton.style.cursor = 'pointer';
    createButton.style.width = '100%';
    
    createButton.addEventListener('click', function() {
      // Create emergency activity data with the last 7 days
      const emergencyData = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        emergencyData.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10) + 1,
          level: Math.floor(Math.random() * 4) + 1
        });
      }
      
      // Create a download link for the data
      const dataStr = JSON.stringify(emergencyData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', 'activity-data.json');
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      addDiagnosticItem(panel, 'Emergency Data', 'Created and downloaded', 'green');
    });
    
    panel.appendChild(createButton);
    
    // Reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.style.padding = '8px 12px';
    reloadButton.style.backgroundColor = '#0a0a23';
    reloadButton.style.color = 'white';
    reloadButton.style.border = '1px solid #f5f6f7';
    reloadButton.style.borderRadius = '4px';
    reloadButton.style.marginTop = '10px';
    reloadButton.style.cursor = 'pointer';
    reloadButton.style.width = '100%';
    
    reloadButton.addEventListener('click', function() {
      window.location.reload();
    });
    
    panel.appendChild(reloadButton);
  });
  
  function addDiagnosticItem(panel, label, status, color) {
    const item = document.createElement('div');
    item.style.margin = '5px 0';
    item.style.padding = '5px';
    item.style.borderLeft = `3px solid ${color}`;
    
    item.innerHTML = `
      <div style="font-weight:bold">${label}</div>
      <div style="color:${color}">${status}</div>
    `;
    
    panel.appendChild(item);
  }
});
