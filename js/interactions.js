function populateFilters(data) {
  // 1. Technology filter
  const screenContainer = d3.select("#filters_screen");
  const screenButtons = screenContainer
    .selectAll("button")
    .data(filters_screen)
    .enter()
    .append("button")
    .text((d) => d.label)
    .classed("active", (d) => d.isActive)
    .on("click", function (event, d) {
      filters_screen.forEach((f) => (f.isActive = false));
      d.isActive = true;
      screenButtons.classed("active", (f) => f.isActive);
      applyCombinedFilters(data);
    });

  // 2. Size filter
  const sizeContainer = d3.select("#filters_size");
  const sizeButtons = sizeContainer
    .selectAll("button")
    .data(filters_size)
    .enter()
    .append("button")
    .text((d) => d.label)
    .classed("active", (d) => d.isActive)
    .on("click", function (event, d) {
      filters_size.forEach((f) => (f.isActive = false));
      d.isActive = true;
      sizeButtons.classed("active", (f) => f.isActive);
      applyCombinedFilters(data);
    });

  // 3. Combine filters
  function applyCombinedFilters(data) {
    const activeTech = filters_screen.find((f) => f.isActive).id;
    const activeSize = filters_size.find((f) => f.isActive).id;

    const filteredData = data.filter((d) => {
      const matchTech = activeTech === "all" || d.screenTech === activeTech;
      const matchSize = activeSize === "all" || +d.screenSize === activeSize;
      return matchTech && matchSize;
    });

    updateHistogramWithTransition(filteredData);
  }

  function updateHistogramWithTransition(filteredData) {
    const updatedBins = binGenerator(filteredData);
    yScale.domain([0, d3.max(updatedBins, (d) => d.length)]);

    const svg = d3.select("#histogram svg g");
    const bars = svg.selectAll(".bar").data(updatedBins);

    bars
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("y", innerHeight)
      .remove();

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(800)
      .ease(d3.easeBackOut) // Transition effect
      .attr("x", (d) => xScale(d.x0) + 1)
      .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("y", (d) => yScale(d.length))
      .attr("height", (d) => innerHeight - yScale(d.length));

    svg.select(".y-axis").transition().duration(800).call(d3.axisLeft(yScale));
  }
}

// Create tooltip when hover on circle
function createTooltip() {
    const tooltip = innerChartS.append("g")
        .attr("id", "tooltip")
        .style("opacity", 0); 

    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("fill", "white")
        .attr("stroke", "var(--primary)") 
        .attr("rx", 10); 

    tooltip.append("text")
        .attr("x", tooltipWidth / 2 - 55)
        .attr("y", tooltipHeight / 2 + 4)
        .attr("class", "tooltip-text")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "var(--text-dark)");
}

function handleMouseEvents() {
    innerChartS.selectAll("circle")
        .on("mouseenter", function(e, d) {
            // Display tooltip when hover
            const tooltip = d3.select("#tooltip");
            
            tooltip
              .select("text")
              .text(`Size: ${d.screenSize} | Tech: ${d.screenTech}`); // Hiện kích thước màn hình

            tooltip
              .transition()
              .duration(200)
              .style("opacity", 1)
              .attr(
                "transform",
                `translate(${xScaleS(d.star) - tooltipWidth / 2}, ${yScaleS(d.energyConsumption) + 10})`,);        
              })
        .on("mouseleave", function() {
            // Hide tooltip when mouse leaves
            d3.select("#tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
}
