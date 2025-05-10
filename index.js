/**
 * freeCodeCamp Portfolio - Certification Section Toggle
 * This script handles the expand/collapse functionality for certification sections
 * with progressive enhancement support.
 */

// IMMEDIATELY remove the no-js class to signal JavaScript is available
document.documentElement.classList.remove("no-js");

// Wait until the DOM is fully loaded before running the main functionality
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'cert-title'
  const certificationTitles = document.querySelectorAll(".cert-title");

  // Log how many certification titles were found (for debugging)

  // Add click event listeners to each certification title
  certificationTitles.forEach((title) => {
    title.addEventListener("click", function () {
      // Get the parent card element
      const certCard = this.parentElement;

      // Toggle classes for expand/collapse effect
      if (certCard.classList.contains("expanded")) {
        // If it's expanded, collapse it
        certCard.classList.remove("expanded");
        certCard.classList.add("collapsed");
      } else {
        // If it's collapsed, expand it
        certCard.classList.remove("collapsed");
        certCard.classList.add("expanded");
      }

      // Log the action for debugging
    });
  });

  // Set the initial states based on current classes
  document.querySelectorAll(".cert-card").forEach((card) => {
    if (
      !card.classList.contains("expanded") &&
      !card.classList.contains("collapsed")
    ) {
      // If no state is set, default to collapsed
      card.classList.add("collapsed");
    }
  });
});

//  JavaScript file to enhance the "zap" effect with some additional dynamic behavior

document.addEventListener("DOMContentLoaded", function () {
  const welcomeHeading = document.querySelector("#welcome-section h1");

  if (welcomeHeading) {
    // Add electric "zap" particles effect on click
    welcomeHeading.addEventListener("click", function (e) {
      createZapEffect(e.clientX, e.clientY);

      // Change the text occasionally for extra engagement
      const greetings = [
        "Hello!",
        "Hi there!",
        "Welcome!",
        "Hey!",
        "Greetings!",
      ];

      // Only change text sometimes to keep it interesting
      if (Math.random() > 0.5) {
        const newGreeting =
          greetings[Math.floor(Math.random() * greetings.length)];

        // Animate the text change
        welcomeHeading.style.opacity = "0";
        setTimeout(() => {
          welcomeHeading.textContent = newGreeting;
          welcomeHeading.style.opacity = "1";
        }, 300);
      }
    });
  }

  // Create the zap particle effect
  function createZapEffect(x, y) {
    const container = document.querySelector("#welcome-section");
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");

      // Style the particle
      particle.style.position = "absolute";
      particle.style.backgroundColor = getRandomColor();
      particle.style.width = "8px";
      particle.style.height = "8px";
      particle.style.borderRadius = "50%";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.pointerEvents = "none";
      particle.style.opacity = "1";
      particle.style.zIndex = "1000";

      // Add to container
      container.appendChild(particle);

      // Animate outward
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 15;
      const distance = 50 + Math.random() * 100;
      const duration = 500 + Math.random() * 500;

      // Use animation
      particle.animate(
        [
          {
            transform: `translate(0, 0) scale(1)`,
            opacity: 1,
          },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
        },
      );

      // Remove the particle after animation completes
      setTimeout(() => {
        particle.remove();
      }, duration);
    }
  }

  // Generate random color from your theme palette
  function getRandomColor() {
    const colors = [
      "#4d5bce", // accent-color
      "#6d28d9", // gradient color
      "#4338ca", // expanded-gradient-start
      "#3730a3", // expanded-gradient-end
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
});
