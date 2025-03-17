/**
 * freeCodeCamp Portfolio - Certification Section Toggle
 * This script handles the expand/collapse functionality for certification sections
 * with progressive enhancement support.
 */

// IMMEDIATELY remove the no-js class to signal JavaScript is available
document.documentElement.classList.remove('no-js');

// Wait until the DOM is fully loaded before running the main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'cert-title'
    const certificationTitles = document.querySelectorAll('.cert-title');
    
    // Log how many certification titles were found (for debugging)
    
    
    // Add click event listeners to each certification title
    certificationTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Get the parent card element
            const certCard = this.parentElement;
            
            // Toggle classes for expand/collapse effect
            if (certCard.classList.contains('expanded')) {
                // If it's expanded, collapse it
                certCard.classList.remove('expanded');
                certCard.classList.add('collapsed');
            } else {
                // If it's collapsed, expand it
                certCard.classList.remove('collapsed');
                certCard.classList.add('expanded');
            }
            
            // Log the action for debugging
            
        });
    });
    
    // Set the initial states based on current classes
    document.querySelectorAll('.cert-card').forEach(card => {
        if (!card.classList.contains('expanded') && !card.classList.contains('collapsed')) {
            // If no state is set, default to collapsed
            card.classList.add('collapsed');
        }
    });
});
