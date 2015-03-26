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