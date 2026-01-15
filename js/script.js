// script.js - JavaScript for page switching and dynamic year

function showPage(pageId) {
  // Hide all page sections
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // Show the selected page
  document.getElementById(pageId).style.display = "block";

  // Update active navigation link
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(`nav-${pageId}`).classList.add("active");
}

// Set the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Initialize the home page on load
window.onload = function () {
  showPage("home");
};

// Đảm bảo year được set trên tất cả các trang
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElements = document.querySelectorAll('#year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Smooth scrolling for anchor links (optional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});