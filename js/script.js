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

// =======================EXERCISE 4 SCRIPT========================

const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1100 500")
  .style("border", "1px solid black");

d3.csv("data/data_ex_4.csv").then((rawData) => {
  const data = rawData
    .map((d) => ({
      brand: d.Brand_Reg || "Unknown",
      count: +d.Count || 0,
    }))
    .filter((d) => d.count > 0);

  console.log(
    "Data loaded:",
    data.sort((a, b) => b.count - a.count),
  );

  if (data.length > 0) {
    createBarChart(data);
  } else {
    console.error("Error loading data!");
  }
});

const createBarChart = (data) => {
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .range([0, 500]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, 500])
    .padding(0.1);

  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScale(d.brand)})`);

  barAndLabel
    .append("rect")
    .attr("class", (d) => `bar bar-${d.count}`)
    .attr("x", 100)
    .attr("y", 0)
    .attr("width", (d) => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "red");

  barAndLabel
    .append("text")
    .text((d) => d.brand)
    .attr("x", 95)
    .attr("y", yScale.bandwidth() / 2 + 5)
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "13px");

  barAndLabel
    .append("text")
    .text((d) => d.count)
    .attr("x", (d) => 100 + xScale(d.count) + 5)
    .attr("y", yScale.bandwidth() / 2 + 5)
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
};

// =======================EXERCISE 5 SCRIPT========================

// ============================5.1 SCATTER PLOT==============================
d3.csv("./data/data_5_1.csv").then((rawData) => {
  const data = rawData.map((d) => ({
    size: +d.Star2,
    energy: +d["Labelled energy consumption (kWh/year)"],
  }));
  createScatterPlot(data);
});

const createScatterPlot = (data) => {
  // 1. Setting up the chart
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 2. Define scales
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.size)])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.energy)])
    .range([height, 0]);

  // 3. Plot data
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.size))
    .attr("cy", (d) => yScale(d.energy))
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("opacity", 0.6);

  // 4. Axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").call(d3.axisLeft(yScale));

  // 1. Label X
  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", 450)
    .attr("y", 460)
    .text("Screen Size (inches)")
    .style("font-family", "sans-serif")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  // 2. Label Y
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .text("Energy Consumption (kWh/year)")
    .style("font-family", "sans-serif")
    .style("font-size", "14px")
    .style("font-weight", "bold");
};

// ============================5.2 DONUT CHART==============================

d3.csv("./data/data_5_2.csv").then((rawData) => {
  const data = rawData.map((d) => ({
    screenTech: d.Screen_Tech,
    energy: +d["Mean(Labelled energy consumption (kWh/year))"],
  }));

  createDonutChart(data);
});

const createDonutChart = (data) => {
  // 1. Cấu hình kích thước
  const width = 300;
  const height = 300;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  d3.select(".responsive-svg-container");

  const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // 2. Thiết lập bảng màu (mỗi Brand một màu)
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.screenTech))
    .range(d3.schemeCategory10);

  // 3. Tính toán vị trí các lát bánh (Pie)
  const pie = d3
    .pie()
    .value((d) => d.energy)
    .sort(null); // Giữ nguyên thứ tự từ file CSV

  const data_ready = pie(data);

  // 4. Định nghĩa cung tròn (Arc)
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5) // Độ rộng của lỗ hổng ở giữa (Donut)
    .outerRadius(radius);

  // 5. Vẽ các lát Donut
  svg
    .selectAll("path")
    .data(data_ready)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.screenTech))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.8);

  // 6. Thêm nhãn tên Brand (Labels)
  svg
    .selectAll("text")
    .data(data_ready)
    .join("text")
    .text((d) => d.data.screenTech)
    .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Đặt chữ vào giữa lát bánh
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "black")
    .style("font-weight", "bold");
};

// ===========================5.3 BAR CHART==============================

d3.csv("./data/data_5_3.csv").then((rawData) => {
  const data = rawData
    .map((d) => ({
      tech: d.Screen_Tech,
      meanEnergy: +d["Mean(Labelled energy consumption (kWh/year))"],
    }))
    .filter((d) => d.meanEnergy > 0);

  createBarCharts(data);
});

const createBarCharts = (data) => {
  const width = 600;
  const height = 400;
  const margin = { top: 30, right: 30, bottom: 70, left: 60 };

  d3.select(".responsive-svg-container");

  const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 1. Thiết lập Scales
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.tech))
    .range([0, width - margin.left - margin.right])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.meanEnergy) * 1.1]) // Thêm 10% khoảng trống phía trên
    .range([height - margin.top - margin.bottom, 0]);

  // 2. Vẽ các cột (Bars)
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.tech))
    .attr("y", (d) => y(d.meanEnergy))
    .attr("width", x.bandwidth())
    .attr(
      "height",
      (d) => height - margin.top - margin.bottom - y(d.meanEnergy),
    )
    .attr("fill", "#4e79a7")
    .on("mouseover", function () {
      d3.select(this).attr("fill", "#e15759");
    }) // Đổi màu khi hover
    .on("mouseout", function () {
      d3.select(this).attr("fill", "#4e79a7");
    });

  // 3. Thêm Trục X
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "12px");

  // 4. Thêm Trục Y
  svg.append("g").call(d3.axisLeft(y));

  // 5. Thêm nhãn tên trục Y
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -(height / 2) + margin.top)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Mean Energy Consumption (kWh/year)");
};

// ===========================5.4 LINE CHART==============================

d3.csv("./data/data_5_4.csv").then((rawData) => {
  const data = rawData.map((d) => ({
    year: +d.Year,
    avg: +d["Average Price (notTas-Snowy)"],
  }));

  createOnlyAveragePlot(data);
});

const createOnlyAveragePlot = (data) => {
  // 1. Tăng margin mạnh tay để chắc chắn trục có chỗ hiển thị
  const margin = { top: 40, right: 40, bottom: 60, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Xóa nội dung cũ
  d3.select(".responsive-svg-container");

  // 2. Tạo SVG với viewBox rộng rãi
  const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 800 400`) // Phải khớp với width/height tổng
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 3. Scales (Giữ nguyên logic của bạn)
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.avg) * 1.1])
    .range([height, 0]);

  // 4. Vẽ trục X (Quan trọng: Phải có CSS hoặc thuộc tính màu)
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(10));

  // Tùy chỉnh màu sắc trực tiếp cho trục X để tránh bị CSS ẩn
  xAxis.selectAll("path, line").attr("stroke", "#333");
  xAxis.selectAll("text").attr("fill", "#333").style("font-size", "12px");

  // 5. Vẽ trục Y
  const yAxis = svg.append("g").call(d3.axisLeft(y).ticks(8));

  yAxis.selectAll("path, line").attr("stroke", "#333");
  yAxis.selectAll("text").attr("fill", "#333").style("font-size", "12px");

  // 6. Vẽ đường Line (Thêm hiệu ứng mượt)
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

  // 7. Thêm các điểm tròn
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.avg))
    .attr("r", 4)
    .attr("fill", "#ff4500");
};