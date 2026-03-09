// js/shared-constants.js
const margin = { top: 10, right: 30, bottom: 60, left: 70 };
const width = 800;
const height = 300;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

let innerChartS;

const tooltipWidth = 130;
const tooltipHeight = 25;

// Use colors that match the web design
const barColor = "#C68642";
const bodyBackgroundColor = "#FDF6F0";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

const colorScale = d3.scaleOrdinal()
  .domain(["LCD", "LED", "OLED"])
  .range(["#fbc067", "#7b5122", "#101010"]);

  
const filters_screen = [
  { id: "all", label: "All Tech", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

const filters_size = [
  { id: "all", label: "All Sizes", isActive: true },
  { id: 24, label: '24"', isActive: false },
  { id: 32, label: '32"', isActive: false },
  { id: 55, label: '55"', isActive: false },
  { id: 65, label: '65"', isActive: false },
  { id: 98, label: '98"', isActive: false },
];

const binGenerator = d3
  .bin()
  .value((d) => d.energyConsumption)
  .thresholds(25);
