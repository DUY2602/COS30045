document.addEventListener("DOMContentLoaded", function () {
  const csvUrl = "./data/data.csv";
  const container = document.getElementById("tv-data-list");

  // Parse data file then call function to display on web
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      displayTVData(results.data);
    },
  });

  // Function generate star
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = "";

    // Add full star
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span style="color: #FFD700;">★</span>';
    }

    // Add half star
    if (hasHalfStar) {
      starsHtml += '<span style="color: #FFD700;">⯪</span>';
    }

    // Add empty star if not fully rated
    const emptyStars = 10 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span style="color: #ccc;">☆</span>';
    }
    return starsHtml;
  }

  function displayTVData(tvList) {
    if (!container) return;
    container.innerHTML = "";

    // Get 12 TV displayed (Filtering logic)
    const filteredData = tvList.filter((tv) => tv.Brand_Reg).slice(0, 12);

    filteredData.forEach((tv) => {
      const starValue = parseFloat(tv.Star) || 0;

      // Get the badge based on number of stars
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
                            <p><strong>Size:</strong> ${
                              tv.Screensize_inch
                            } inches</p>
                            <p><strong>Technology:</strong> ${
                              tv.Screen_Tech
                            }</p>
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
  }
});

// === NAVIGATION LOGIC ===
function switchPage(pageName) {

  // Hide the unselected page
  const pages = document.querySelectorAll(".page-section");
  pages.forEach((page) => {
    page.style.display = "none";    // Using display none
  });

  // 2. Display selected page
  const selectedPage = document.getElementById("page-" + pageName);
  if (selectedPage) {
    selectedPage.style.display = "block";   // Using display block

    // Scroll to top
    window.scrollTo(0, 0);
  }

  // 3. Use active class for correct Menu display (header)
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const activeNav = document.getElementById("nav-" + pageName);
  if (activeNav) {
    activeNav.classList.add("active");
  }
}
