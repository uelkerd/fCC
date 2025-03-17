document.addEventListener('DOMContentLoaded', function() {
    // Get all certification titles
    const certTitles = document.querySelectorAll('.cert-title');
    
    // Add click event listener to each title
    certTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Toggle the expanded class on the parent card
            this.parentElement.classList.toggle('expanded');
            this.parentElement.classList.toggle('collapsed');
        });
    });
});
