var svg = d3.select("#tron").append("svg")
	.attr("width", 500)
	.attr("height", 500);

var rect = svg.append("rect")
	.attr({
	    width: 500,
	    height: 500,
	    fill: 'black'
	});

var line = d3.svg.line()
	.x(function(d) { console.log(d); return d.x; })
	.y(function(d) { console.log(d); return d.y; })
	.interpolate("linear");

var data = [ {'x': 75, 'y': 75 }, {'x': 150, 'y': 75}, {'x': 150, 'y': 150} ];


function update(data) {
    var circle = svg.selectAll("circle").data(data);

    circle.enter().append("circle")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; } )
	.attr("r", 10)
	.attr("fill", "steelblue");
}
//circle.exit().remove();
/*var paths = svg.selectAll("path").data(data);

    paths.enter().append("path")
	.attr("class", "tron-path")
	.attr("d", line(data))
	.attr("stroke", "blue")
	.attr("stroke-width", 2)
	.attr("fill", "none");

paths.exit().remove();*/


setInterval(function() {
    data.push({'x': data[data.length - 1].x, 'y': data[data.length - 1].y + 50});
    update(data);
}, 1000);




	


