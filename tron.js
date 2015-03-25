var svg = d3.select("#tron").append("svg")
	.attr("width", 500)
	.attr("height", 500);

var line = d3.svg.line()
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; })
	.interpolate("linear");

p = [ {'x': 75, 'y': 75 }, {'x': 150, 'y': 75}, {'x': 150, 'y': 150} ];

var lineDraw = svg.append("path")
	.attr("d", line(p))
	.attr("stroke", "blue")
	.attr("stroke-width", 2)
	.attr("fill", "none");
	


