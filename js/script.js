// === 1. CẤU HÌNH CHUNG CHO EXERCISE 5 (ĐỒNG BỘ THÔNG SỐ) ===
const config5 = {
  margin: { top: 40, right: 30, bottom: 60, left: 70 },
  width: 600,
  height: 400,
};
const innerW = config5.width - config5.margin.left - config5.margin.right;
const innerH = config5.height - config5.margin.top - config5.margin.bottom;

// === 2. NAVIGATION & INITIALIZATION ===
document.addEventListener("DOMContentLoaded", function () {
  const csvUrl = "./data/data.csv";
  const container = document.getElementById("tv-data-list");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const brandSelect = document.getElementById("filter-brand");
  const techSelect = document.getElementById("filter-tech");
  const sizeSelect = document.getElementById("filter-size");
  const filterBtn = document.getElementById("btn-filter");

  let allTVData = [];
  let filteredData = [];
  let currentIndex = 0;
  const itemsPerPage = 12;

  // Xử lý chuyển trang từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const targetPage = urlParams.get("target");
  if (targetPage) {
    switchPage(targetPage);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Load Data cho trang chủ (TV List)
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      allTVData = results.data.filter((item) => item.Brand_Reg);
      setupDropdowns();
      applyFilters();
    },
  });

  function setupDropdowns() {
    if (!brandSelect || !techSelect) return;
    const brands = [...new Set(allTVData.map((item) => item.Brand_Reg))].sort();
    brands.forEach((b) => {
      brandSelect.innerHTML += `<option value="${b}">${b}</option>`;
    });

    const techs = [
      ...new Set(allTVData.map((item) => item.Screen_Tech)),
    ].sort();
    techs.forEach((t) => {
      techSelect.innerHTML += `<option value="${t}">${t}</option>`;
    });
  }

  function applyFilters() {
    const brandVal = brandSelect?.value;
    const techVal = techSelect?.value;
    const sizeGroupVal = sizeSelect?.value;

    filteredData = allTVData.filter((tv) => {
      const matchBrand = !brandVal || tv.Brand_Reg === brandVal;
      const matchTech = !techVal || tv.Screen_Tech === techVal;
      const currentSizeGroup = getSizeGroup(tv.Screensize_inch);
      const matchSize = !sizeGroupVal || currentSizeGroup === sizeGroupVal;
      return matchBrand && matchTech && matchSize;
    });

    filteredData.sort(
      (a, b) => (parseFloat(b.Star2) || 0) - (parseFloat(a.Star2) || 0),
    );
    currentIndex = 0;
    if (container) container.innerHTML = "";
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
            <p><strong>Tech:</strong> ${tv.Screen_Tech}</p>
            <p><strong>Energy:</strong> ${tv["Labelled energy consumption (kWh/year)"]} kWh/y</p>
            <p><strong>Cost:</strong> $${(tv["Labelled energy consumption (kWh/year)"] * 0.3).toFixed(2)}/y</p>
            <div class="star-rating-display">${generateStars(starValue)}</div>
        </div>`;
      container.appendChild(card);
    });
    currentIndex += itemsPerPage;
    if (loadMoreBtn)
      loadMoreBtn.style.display =
        currentIndex >= filteredData.length ? "none" : "block";
  }

  if (filterBtn) filterBtn.addEventListener("click", applyFilters);
  if (loadMoreBtn) loadMoreBtn.addEventListener("click", displayNextBatch);
});

// === 3. HELPER FUNCTIONS ===
function switchPage(pageName) {
  const pages = document.querySelectorAll(".page-section");
  pages.forEach((page) => {
    page.style.display = "none";
  });
  const selectedPage = document.getElementById("page-" + pageName);
  if (selectedPage) {
    selectedPage.style.display = "block";
    window.scrollTo(0, 0);
  }
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const activeNav = document.getElementById("nav-" + pageName);
  if (activeNav) activeNav.classList.add("active");
}

function getSizeGroup(inchValue) {
  const size = parseFloat(inchValue);
  if (isNaN(size)) return "";
  if (size > 70) return "large";
  if (size > 50) return "medium";
  if (size > 30) return "small";
  return "tiny";
}

function generateStars(rating) {
  let html = "";
  for (let i = 0; i < Math.floor(rating); i++)
    html += '<span style="color: #FFD700;">★</span>';
  if (rating % 1 !== 0) html += '<span style="color: #FFD700;">⯪</span>';
  for (let i = 0; i < 10 - Math.ceil(rating); i++)
    html += '<span style="color: #ccc;">☆</span>';
  return html;
}

// === 4. EXERCISE 5 VISUALIZATIONS (D3.JS) ===

// 5.1 SCATTER PLOT
d3.csv("./data/data_5_1.csv").then((data) => {
  const formattedData = data.map((d) => ({
    size: +d.Screensize_inch,
    energy: +d["Labelled energy consumption (kWh/year)"],
  }));
  createScatterPlot(formattedData);
});

const createScatterPlot = (data) => {
  d3.select(".responsive-five-one").selectAll("*").remove();
  const svg = d3
    .select(".responsive-five-one")
    .append("svg")
    .attr("viewBox", `0 0 ${config5.width} ${config5.height}`)
    .append("g")
    .attr(
      "transform",
      `translate(${config5.margin.left},${config5.margin.top})`,
    );

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.size)])
    .range([0, innerW]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.energy)])
    .range([innerH, 0]);
  const color = d3
    .scaleSequential()
    .domain([0, d3.max(data, (d) => d.energy)])
    .interpolator(d3.interpolateInferno);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.size))
    .attr("cy", (d) => y(d.energy))
    .attr("r", 5)
    .attr("fill", (d) => color(d.energy))
    .attr("opacity", 0.7);

  svg
    .append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x));
    
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - config5.margin.left)
    .attr("x", 0 - innerH / 2)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Energy Consumption (kWh)");

  svg
    .append("text")
    .attr("x", innerW / 2)
    .attr("y", innerH + 45)
    .attr("text-anchor", "middle")
    .text("Screensize (inch)")
    .style("font-weight", "bold");
};

// 5.2 DONUT CHART
d3.csv("./data/data_5_2.csv").then((data) => {
  const formattedData = data.map((d) => ({
    tech: d.Screen_Tech,
    star: +d["Sum(Star2)"],
  }));
  createDonutChart(formattedData);
});

const createDonutChart = (data) => {
  d3.select(".responsive-five-two").selectAll("*").remove();

  // Sum to count %
  const total = d3.sum(data, (d) => d.star);

  const radius = Math.min(innerW, innerH) / 2;
  const svg = d3
    .select(".responsive-five-two")
    .append("svg")
    .attr("viewBox", `0 0 ${config5.width} ${config5.height}`)
    .append("g")
    .attr("transform", `translate(${config5.width / 2},${config5.height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pie = d3.pie().value((d) => d.star);
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  // Donut slices
  svg
    .selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.tech))
    .attr("stroke", "white");

  svg
    .selectAll("text")
    .data(pie(data))
    .join("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .selectAll("tspan")
    .data((d) => [
      d.data.tech,
      ((d.data.star / total) * 100).toFixed(1) + "%", 
    ])
    .join("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => (i === 0 ? 0 : "1.2em"))
    .text((d) => d);
};

// 5.3 BAR CHART
d3.csv("./data/data_5_3.csv").then((data) => {
  const formattedData = data.map((d) => ({
    brand: d.Brand_Reg,
    count: +d["Count(Model_No)"],
  }));
  createBarCharts(formattedData);
});

const createBarCharts = (data) => {
  d3.select(".responsive-five-three").selectAll("*").remove();
  const svg = d3
    .select(".responsive-five-three")
    .append("svg")
    .attr("viewBox", `0 0 ${config5.width} ${config5.height}`)
    .append("g")
    .attr(
      "transform",
      `translate(${config5.margin.left},${config5.margin.top})`,
    );

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, innerW])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count) * 1.1])
    .range([innerH, 0]);

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.brand))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d) => innerH - y(d.count))
    .attr("fill", "#4e79a7");

  svg
    .append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -innerH / 2)
    .attr("text-anchor", "middle")
    .text("Model Count")
    .style("font-weight", "bold");
};

// 5.4 LINE CHART
d3.csv("./data/data_5_4.csv").then((data) => {
  const formattedData = data.map((d) => ({
    year: +d.Year,
    avg: +d["Average Price (notTas-Snowy)"],
  }));
  createOnlyAveragePlot(formattedData);
});

const createOnlyAveragePlot = (data) => {
  d3.select(".responsive-five-four").selectAll("*").remove();
  const svg = d3
    .select(".responsive-five-four")
    .append("svg")
    .attr("viewBox", `0 0 ${config5.width} ${config5.height}`)
    .append("g")
    .attr(
      "transform",
      `translate(${config5.margin.left},${config5.margin.top})`,
    );

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, innerW]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.avg) * 1.1])
    .range([innerH, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));
  svg.append("g").call(d3.axisLeft(y));

  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.avg))
    .curve(d3.curveMonotoneX);
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#ff4500")
    .attr("stroke-width", 3)
    .attr("d", line);
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.avg))
    .attr("r", 4)
    .attr("fill", "#ff4500");

  svg.append("g").call(d3.axisLeft(y));

  // LABEL X
  svg
    .append("text")
    .attr("x", innerW / 2)
    .attr("y", innerH + 45)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Year");

  // LABEL Y
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - config5.margin.left + 20)
    .attr("x", 0 - innerH / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Average Price ($)");
};
