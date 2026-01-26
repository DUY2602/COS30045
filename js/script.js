document.addEventListener("DOMContentLoaded", function () {
  const csvUrl = "./data/data.csv";
  const container = document.getElementById("tv-data-list");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Store full data from CSV
  let allTVData = [];

  // Current position in the data array
  let currentIndex = 0;

  // Shows 12 TV per click
  const itemsPerPage = 12;

  // Parse data file then store it and display the first batch
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      allTVData = results.data;

      // Display the first 12 items immediately
      displayNextBatch();
    },
  });

  // Function to slice next 12 items and append to current list
  function displayNextBatch() {
    if (!container) return;

    // Get the next slice of data (12 items) from the current index
    const nextSlice = allTVData.slice(
      currentIndex,
      currentIndex + itemsPerPage
    );

    // Loop through the slice and create HTML elements
    nextSlice.forEach((tv) => {
      const starValue = parseFloat(tv.Star) || 0;
      let statusClass =
        starValue >= 8 ? "Good" : starValue >= 5 ? "Medium" : "Poor";

      const card = document.createElement("div");
      card.className = "data-card";
      card.innerHTML = `
                <div class="card-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${tv.Brand_Reg} ${tv.Model_No}</span>
                        <div class="badge ${statusClass}">${statusClass}</div>
                    </div>
                </div>
                <div class="card-body">
                    <p><strong>Size:</strong> ${tv.Screensize_inch} inches</p>
                    <p><strong>Technology:</strong> ${tv.Screen_Tech}</p>
                    <p><strong>Energy Use:</strong> ${
                      tv["Labelled energy consumption (kWh/year)"]
                    } kWh/year</p>
                    <p><strong>Cost Est:</strong> $${(
                      tv["Labelled energy consumption (kWh/year)"] * 0.3
                    ).toFixed(2)} /year</p>
                    <div class="star-rating-display" style="font-size: 1.5rem; margin: 10px 0;">
                        ${generateStars(starValue)}
                    </div>
                </div>
            `;
      container.appendChild(card);
    });

    // Update the index for the next "Show More" click
    currentIndex += itemsPerPage;

    // Hide the "Show More" button if no more data is available
    if (currentIndex >= allTVData.length && loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
  }

  // Handle "Show More" button click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", displayNextBatch);
  }

  // Function to generate star rating HTML based on value
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = "";

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span style="color: #FFD700;">★</span>';
    }

    // Add half star if applicable
    if (hasHalfStar) {
      starsHtml += '<span style="color: #FFD700;">⯪</span>';
    }

    // Add empty stars for the remainder
    const emptyStars = 10 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span style="color: #ccc;">☆</span>';
    }
    return starsHtml;
  }
});

// === NAVIGATION LOGIC ===
function switchPage(pageName) {
  // 1. Hide all page sections
  const pages = document.querySelectorAll(".page-section");
  pages.forEach((page) => {
    page.style.display = "none";
  });

  // 2. Display the selected page section
  const selectedPage = document.getElementById("page-" + pageName);
  if (selectedPage) {
    selectedPage.style.display = "block";
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }

  // 3. Update active status on navigation menu
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const activeNav = document.getElementById("nav-" + pageName);
  if (activeNav) {
    activeNav.classList.add("active");
  }
}
