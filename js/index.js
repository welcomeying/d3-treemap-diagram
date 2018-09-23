 // Get data
var MOVIES_FILE = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";

d3.json(MOVIES_FILE, function (error, data) {
	if (error) throw error;
	var root = d3.hierarchy(data).
	sum(function (d) {return d.value;}).
	sort(function (a, b) {return b.height - a.height || b.value - a.value;});

	// Define color constant
	var color = d3.scaleOrdinal(d3.schemeCategory10);

	// Set the dimensions of the canvas / graph
	var w = 1000;
	var h = 600;
	var margin = 150;
	var marginLeft = 50;
	var marginBottom = 50;

	var svg = d3.select("body").
	append("svg").
	attr("width", w + margin + marginLeft).
	attr("height", h + margin + marginBottom).
	append("g").
	attr('class', "graph").
	attr("transform", "translate(" + marginLeft + "," + margin + ")");

	// Define treemap constant
	var treemap = d3.treemap().size([w, h]).tile(d3.treemapSquarify);
	treemap(root);

	// Add title and description
	svg.append("text").
	attr("id", "title").
	attr("x", w / 2).
	attr("text-anchor", "middle").
	attr("y", -60).
	text("Movie Sales").
	style("font-size", "45px");

	svg.append("text").
	attr("id", "description").
	attr("x", w / 2).
	attr("text-anchor", "middle").
	attr("y", -25).
	html("Top Most Sold Movies Grouped by Category").
	style("font-size", "18px");

	// Define tooltip
	var tooltip = d3.select("body").
	append("div").
	style("visibility", "hidden").
	attr("id", "tooltip");

	// Add rects and tooltip
	var cell = svg.selectAll("g").
	data(root.leaves()).
	enter().append("g").
	attr("transform", function (d) {return "translate(" + d.x0 + "," + d.y0 + ")";});

	cell.append("rect").
	attr("width", function (d) {return d.x1 - d.x0 - 0.5;}).
	attr("height", function (d) {return d.y1 - d.y0 - 0.5;}).
	attr("class", "tile").
	attr("data-name", function (d) {return d.data.name;}).
	attr("data-category", function (d) {return d.data.category;}).
	attr("data-value", function (d) {return d.data.value;}).
	style("fill", function (d) {return color(d.data.category);}).
	on("mouseover", function (d) {
		tooltip.style("visibility", "visible").
		attr("data-value", d3.select(this).attr("data-value")).
		html(d.data.name + "</br>Category: " + d.data.category + "</br>Value: " + d.data.value).
		style("left", d3.event.pageX + 10 + "px").
		style("top", d3.event.pageY + "px");
	}).
	on("mouseout", function () {return tooltip.style("visibility", "hidden");});

	cell.append("text").
	selectAll("tspan").
	data(function (d) {return d.data.name.split(/(?=[A-Z][^A-Z])/g);}).
	enter().
	append("tspan").
	attr("x", 5).
	attr("y", function (d, i) {return 14 + i * 10;}).
	text(function (d) {return d;}).
	style("font-size", "11px").
	style('fill', 'white');

	// Add legend
	var legend = svg.selectAll(".legend").
	data(color.domain().reverse()).
	enter().
	append("g").
	attr("id", "legend").
	attr("transform", function (d, i) {
		return "translate(50," + (h / 15 - i * 20) + ")";
	});

	legend.append("rect").
	attr("class", "legend-item").
	attr("x", w - 30).
	attr("y", 80).
	attr("width", 18).
	attr("height", 18).
	style("fill", color);

	legend.append("text").
	attr("x", w - 10).
	attr("y", 88).
	attr("dy", ".35em").
	style("text-anchor", "start").
	text(function (d) {
		return d;
	});

});