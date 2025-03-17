/**
 * Activity Data Loader
 * This script fetches the latest activity data and stores it in localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the JSON file with activity data
    fetch('activity-data.json')
        .then(response => {
            // If the file doesn't exist yet or there's an error, we'll use the sample data
            if (!response.ok) {
                console.log('Activity data file not found, will use sample data');
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // Store the data in localStorage for future use
                localStorage.setItem('fccActivityData', JSON.stringify(data));
                localStorage.setItem('fccActivityLastUpdated', new Date().toISOString());
                
                // If the heatmap is already rendered with sample data, update it
                if (window.updateHeatmap && typeof window.updateHeatmap === 'function') {
                    window.updateHeatmap(data);
                }
                
                console.log('Updated activity data from JSON file');
            }
        })
        .catch(error => {
            console.error('Error loading activity data:', error);
        });
});
