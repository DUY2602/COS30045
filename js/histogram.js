function drawHistogram(data) {
  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Domain for scales
  xScale
    .domain([0, d3.max(data, (d) => d.energyConsumption)])
    .range([0, innerWidth]);

  const bins = binGenerator(data);
  yScale.domain([0, d3.max(bins, (d) => d.length)]).range([innerHeight, 0]);

  // Draw bars
  svg
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.x0) + 1)
    .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
    .attr("y", (d) => yScale(d.length))
    .attr("height", (d) => innerHeight - yScale(d.length))
    .attr("fill", barColor);

  // Axis
  svg
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));
}
