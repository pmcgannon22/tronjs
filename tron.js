var Tron = (function() {
    var Grid = {
	init: function() {
	    var margin = {top: 20, right: 10, bottom: 20, left: 20};
	    this.margin = margin;
	    this.width = this.size - margin.left - margin.right;
	    this.height = this.size - margin.top - margin.bottom;
	    this.svg = d3.select("#tron").append("svg")
		.attr("width", this.width + margin.left + margin.right)
		.attr("height", this.height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var squareSize = this.size/this.gridSize;
	    var squares = [];
	    var normal = [];
	    
	    //1 for grid pixel size
	    var count = 0;
	    for(var i = 0; i < this.size; i+= (squareSize + 1), count += 1) {
		normal.push(count);
		squares.push(i + margin.left);
	    }
	    this.nS = normal.length;
	    console.log(normal);
	    
	    this.x = d3.scale.quantize().domain(normal)
		.range(squares);
	    
	    this.y = d3.scale.quantize().domain(normal)
		.range(squares);
	},
	nSquares: function() {
	    return this.nS || 0;
	},
	draw: function() {
	    var svg = this.svg;
	    var rect = svg.append("rect")
		    .attr({
			x: this.margin.left,
			y: this.margin.top,
			width: this.width,
			height: this.height,
			fill: 'black'
		    });
	    var grid = svg.append("g").attr("class", "grid");
	    grid.selectAll("line.horizontalGrid").data(this.y.range()).enter()
		.append("line")
		.attr(
		    {
			"class":"horizontalGrid",
			"x1" : this.x(0),
			"x2" : this.x(this.size),
			"y1" : function(d){ return d;},
			"y2" : function(d){ return d;},
			"fill" : "none",
			"shape-rendering" : "crispEdges",
			"stroke" : "green",
			"stroke-width" : "1px"
		    });


	    grid.selectAll("line.verticalGrid").data(this.x.range()).enter()
		.append("line")
		.attr(
		    {
			"class":"horizontalGrid",
			"y1" : this.y(0),
			"y2" : this.y(this.size),
			"x1" : function(d){ return d;},
			"x2" : function(d){ return d;},
			"fill" : "none",
			"shape-rendering" : "crispEdges",
			"stroke" : "green",
			"stroke-width" : "1px"
		    });
	},
	update: function(player1, player2) {
	    this.players[0].push(player1);
	    this.players[1].push(player2);
	    
	    var squares = this.svg.append("g").attr("class", "grid-squares");
	    var p1 = squares.selectAll("rect.square.player1").data(this.players[0]);
	    var p2 = squares.selectAll("rect.square.player2").data(this.players[1]);
	    var x = this.x,
		y = this.y,
		squareSize = (this.size/this.gridSize + 1);
	    
	    console.log(x);	    
	    var update_player = function(n, player, color) {

		player.attr("class", "square");
		player.enter().append("rect")
		    .attr({
			class: "square player" + n,
			x: function(d) { return x(d.x); },
			y: function(d) { return y(d.y); },
			width: squareSize,
    			height: squareSize,
			fill: color
		    });
	    };

	    update_player(1, p1, "green");
	    update_player(2, p2, "white");
	},
	players: [[],[]],
	size: 600,
	gridSize: 50
    };

    Grid.init();
    Grid.draw();
    //Grid.update([{x: 1, y:1}], [{x:5, y:10}]);



    

    /*var c = 0;
     setInterval(function() {
     c++;
     data.push({'x': c, 'y': 0});
     update(data);
     }, 1000);*/




    /*var KeyboardListener = {
	init: function(config) {
	    this
	 onKeyDown: function(callback) {
	     $(document).keydown(function(e) {
		 callback(e);
	     });
	 }
     }; */
	 
     

    return {
	update: function(player1, player2) {
	    Grid.update(player1, player2);
	},
	size: function() {
	    return Grid.nSquares();
	}
    };
})();


console.log(Tron.size());
Tron.update({x: 3, y: 4}, {x: 2, y:2});
//setTimeout(function() { Tron.update([{x: 3, y: 4}, {x: 4, y: 4}], [{x:10, y:10}]) }, 1000);
