function drawScatterplot(data) {
  // Chart Area
  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  innerChartS = svg;

  // Define scales
  xScaleS.domain([0, d3.max(data, (d) => d.star)]).range([0, innerWidth]);
  yScaleS
    .domain([0, d3.max(data, (d) => d.energyConsumption)])
    .range([innerHeight, 0]);

  // Draw circles
  innerChartS
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScaleS(d.star))
    .attr("cy", (d) => yScaleS(d.energyConsumption))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d.screenTech)) // Use colorScale to color points depending on screenTech
    .attr("opacity", 0.6); 

  // Axis
  svg
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleS));

  svg.append("g").call(d3.axisLeft(yScaleS));
}
