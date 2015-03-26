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




	

var cPosition = {'x' : 150, 'y' : 150};
//1 - left, 2-up, 3-right, 4-down 
var cDirection = 2;
var MAX_X = 1000;
var MAX_Y = 1000;
var stepSize = 50;

$(document).keydown(function(e){
        //left arrow
        if (e.keyCode == 37) {
            cDirection = e.keyCode - 36;
            stepLocation();
            return false;
        }
        //up arrow
        if (e.keyCode == 38) {
            cDirection = e.keyCode - 36;
            stepLocation();
            return false;
        }
        //right arrow
        if (e.keyCode == 39) {
            cDirection = e.keyCode - 36;
            stepLocation();
            return false;
        }
        //down arrow
        if (e.keyCode == 40) {
            cDirection = e.keyCode - 36;
            stepLocation();
            return false;
        }
});

function stepLocation(){
    var tempPosition = cPosition;
    switch (cDirection){
    case 1:
        tempPosition.x -= stepSize;
        break;
    case 2:
        tempPosition.y += stepSize;
        break;
    case 3:
        tempPosition.x += stepSize;
        break;
    case 4:
        tempPosition.y -= stepSize;
        break;   
    }
    if(tempPosition.x < 0 || tempPosition.y < 0 ||
       tempPosition.x > MAX_X ||
       tempPosition.y > MAX_Y)
        {
            window.alert ("You died");
        }
    else {
        cPosition = tempPosition;
        p.push(cPosition);
    }
}
