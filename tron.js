window.onload = function() {
    var socket = io.connect(window.location.href);
}


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

var isAlive = false;
var playerNumber = 0;

$(document).keydown(function(e){
        if(isAlive == true){
            //left arrow
            if (e.keyCode == 37) {
                cDirection = e.keyCode - 36;
                socket.emit("direction", {'direction' : cDirection});
                return false;
            }
            //up arrow
            if (e.keyCode == 38) {
                cDirection = e.keyCode - 36;
                socket.emit("direction", {'direction' : cDirection});
                return false;
            }
            //right arrow
            if (e.keyCode == 39) {
                cDirection = e.keyCode - 36;
                socket.emit("direction", {'direction' : cDirection});
                return false;
            }
            //down arrow
            if (e.keyCode == 40) {
                cDirection = e.keyCode - 36;
                socket.emit("direction", {'direction' : cDirection});
                return false;
            }
        }
});

socket.on("crash", function(data) {
        isAlive = false;
        window.alert("You Lost");
    });
/*
data =
{playberNumber : int,
initialDireciton : int,
[{'x': xValue, 'y' : yValue}, {'x': xValue, 'y' : yValue}]
}

*/
socket.on("start", function(data){
        isAlive = true;
        playerNumber = data.playerNumber;
        cDirection = data.initialDirection;
        update(data.initialLocation[1], data.initialLocation[2]);
    });

socket.on("ready", function(data){
    if(window.confirm("Are you ready to begin?")){
        socket.emit("playerready", {});
    }
    });
/*
data = 
{ locationList : [{'x': xValue, 'y' : yValue}, {'x': xValue, 'y' : yValue}]
*/
socket.on("update", function(data){
        update(data.locationList[1], data.locationList[2]);
    });
