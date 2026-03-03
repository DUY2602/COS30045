// =======================EXERCISE 4 SCRIPT========================
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1100 500")
  .style("border", "1px solid black");

d3.csv("../data/data_ex_4.csv").then((rawData) => {
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
