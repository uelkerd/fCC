/**
 * freeCodeCamp Activity Heatmap
 * This script loads and displays the user's coding activity from freeCodeCamp
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load activity data from localStorage
    const savedData = localStorage.getItem('fccActivityData');
    const lastUpdated = localStorage.getItem('fccActivityLastUpdated');
    
    // Function to format dates for display in tooltip
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // If we have saved data and it's recent (updated in the last 24 hours)
    const now = new Date();
    if (savedData && lastUpdated && (now - new Date(lastUpdated) < 24 * 60 * 60 * 1000)) {
        console.log('Using cached activity data from localStorage');
        renderHeatmap(JSON.parse(savedData));
    } else {
        console.log('No recent data found, displaying sample data');
        // Sample data until the real data is fetched by the GitHub Action
        const sampleData = generateSampleData();
        renderHeatmap(sampleData);
    }
    
    // Function to render the heatmap
    function renderHeatmap(activityData) {
        // Calculate date range (6 months ago from today)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        
        // Initialize the calendar heatmap
        const heatmap = new CalendarHeatmap()
            .data(activityData)
            .selector('#activity-heatmap')
            .colorRange(['#161b22', '#39d353'])
            .tooltipEnabled(true)
            .tooltipUnit('contributions')
            .legendEnabled(false)
            .startDate(startDate)
            .endDate(endDate)
            .onClick(function(data) {
                console.log('Clicked on:', data);
            });
            
        // Set custom tooltip text
        heatmap.tooltipHTML(function(data) {
            return data.count + ' contributions on ' + formatDate(data.date);
        });
        
        // Draw the heatmap
        heatmap.draw();
        
        // Update the date range text
        document.querySelector('.activity-date-range').textContent = 
            formatDate(startDate) + ' - ' + formatDate(endDate);
    }
    
    // Function to generate sample data for initial display
    function generateSampleData() {
        const data = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        
        // Loop through each day in the date range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Generate random activity count (more likely to be 0)
            const random = Math.random();
            let count = 0;
            
            if (random > 0.7) count = Math.floor(Math.random() * 3) + 1;
            if (random > 0.85) count = Math.floor(Math.random() * 5) + 3;
            if (random > 0.95) count = Math.floor(Math.random() * 10) + 8;
            
            // Add to data array
            if (count > 0 || Math.random() > 0.5) { // Include some days with 0 count
                data.push({
                    date: new Date(d).toISOString().split('T')[0],
                    count: count
                });
            }
        }
        
        return data;
    }
});
