document.addEventListener("DOMContentLoaded", function () {
  const csvUrl = "./data/data.csv";
  const container = document.getElementById("tv-data-list");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Initialize filter variables
  const brandSelect = document.getElementById("filter-brand");
  const techSelect = document.getElementById("filter-tech");
  const sizeSelect = document.getElementById("filter-size");
  const filterBtn = document.getElementById("btn-filter");

  let allTVData = []; // All raw data
  let filteredData = []; // Data after filtering
  let currentIndex = 0;
  const itemsPerPage = 12;

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      // Only get records from a particular Brand
      allTVData = results.data.filter((item) => item.Brand_Reg);

      // Auto Dropdown creation
      setupDropdowns();

      // Show the raw data first
      applyFilters();
    },
  });

  function setupDropdowns() {
    // Get a list of Brands
    const brands = [...new Set(allTVData.map((item) => item.Brand_Reg))].sort();
    brands.forEach((b) => {
      brandSelect.innerHTML += `<option value="${b}">${b}</option>`;
    });

    // Get a list of ScreenTech
    const techs = [
      ...new Set(allTVData.map((item) => item.Screen_Tech)),
    ].sort();
    techs.forEach((t) => {
      techSelect.innerHTML += `<option value="${t}">${t}</option>`;
    });
  }

  function getSizeGroup(inchValue) {
    const size = parseFloat(inchValue);
    if (isNaN(size)) return "";

    if (size > 120) return "giant";
    if (size > 110) return "ultra-huge";
    if (size > 100) return "super-huge";
    if (size > 90) return "huge";
    if (size > 80) return "x-large";
    if (size > 70) return "large";
    if (size > 60) return "medium-large";
    if (size > 50) return "medium";
    if (size > 40) return "medium-small";
    if (size > 30) return "small";
    if (size > 20) return "very-small";
    if (size > 10) return "tiny";
    return "mini";
  }

  // Core function for filtering
  function applyFilters() {
    const brandVal = document.getElementById("filter-brand").value;
    const techVal = document.getElementById("filter-tech").value;
    const sizeGroupVal = document.getElementById("filter-size").value;

    filteredData = allTVData.filter((tv) => {
      const matchBrand = !brandVal || tv.Brand_Reg === brandVal;
      const matchTech = !techVal || tv.Screen_Tech === techVal;

      // Filter the new size group
      const currentSizeGroup = getSizeGroup(tv.Screensize_inch);
      const matchSize = !sizeGroupVal || currentSizeGroup === sizeGroupVal;

      return matchBrand && matchTech && matchSize;
    });

    // Sort by Star2
    filteredData.sort(
      (a, b) => (parseFloat(b.Star2) || 0) - (parseFloat(a.Star2) || 0),
    );

    currentIndex = 0;
    container.innerHTML = "";
    displayNextBatch();
  }

  function displayNextBatch() {
    if (!container) return;

    const nextSlice = filteredData.slice(
      currentIndex,
      currentIndex + itemsPerPage,
    );

    nextSlice.forEach((tv) => {
      const starValue = parseFloat(tv.Star2) || 0;
      let statusClass =
        starValue >= 8 ? "Good" : starValue >= 5 ? "Medium" : "Poor";

      const card = document.createElement("div");
      card.className = "data-card";
      card.innerHTML = `
                <div class="card-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>${tv.Brand_Reg}</strong> ${tv.Model_No}</span>
                        <div class="badge ${statusClass}">${statusClass}</div>
                    </div>
                </div>
                <div class="card-body">
                    <p><strong>Size:</strong> ${tv.Screensize_inch} inches</p>
                    <p><strong>Technology:</strong> ${tv.Screen_Tech}</p>
                    <p><strong>Energy Use:</strong> ${tv["Labelled energy consumption (kWh/year)"]} kWh/year</p>
                    <p><strong>Cost Est:</strong> $${(tv["Labelled energy consumption (kWh/year)"] * 0.3).toFixed(2)} /year</p>
                    <div class="star-rating-display" style="font-size: 1.5rem; margin: 10px 0;">
                        ${generateStars(starValue)}
                    </div>
                </div>
            `;
      container.appendChild(card);
    });

    currentIndex += itemsPerPage;
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        currentIndex >= filteredData.length ? "none" : "block";
    }
  }

  // Add Event Listener
  if (filterBtn) filterBtn.addEventListener("click", applyFilters);
  if (loadMoreBtn) loadMoreBtn.addEventListener("click", displayNextBatch);

  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = "";
    for (let i = 0; i < fullStars; i++)
      starsHtml += '<span style="color: #FFD700;">★</span>';
    if (hasHalfStar) starsHtml += '<span style="color: #FFD700;">⯪</span>';
    const emptyStars = 10 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++)
      starsHtml += '<span style="color: #ccc;">☆</span>';
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
