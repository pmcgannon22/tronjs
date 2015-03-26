#!/usr/bin/env nodejs
(function() {
      // connection data
  var port = 3701;
      connect = require('connect'),
      serve = require('serve-static'),
      app = connect().use(serve(__dirname + "/../")).listen(port),
      io = require('socket.io').listen(app),

      // grid
      initgrid = function(length, width) {
        var grid = [],
            row;
        // + 2 for boundary
        for(var i = 0; i < length + 2; ++i) {
          row = [];
          for(var j = 0; j < width + 2; ++j) {
            row.push(
              (i == 0 || j == 0 || i == length + 1 || j == width + 1)
            );
          }
          grid.push(row);
        }
        return grid;
      },
      //TODO: fix gridsize <-> display size mapping
      gridX = 45, gridY = 55,
      grid = initgrid(gridX, gridY),

      // player metadata
      players = {},
      numPlayers = 0,
      readyPlayers = 0,
      alivePlayers = 0;
      MIN_ALLOWED_PLAYERS = 2,
      MAX_ALLOWED_PLAYERS = 2,

      // game metadata
      seedLocations = [],
      gameStarted = false,
      waitQueue = [],

  startGame = function() {
    var interval = setInterval(function() {
      var next = {},
          newLocations = [],
          winner = false;

      for(var player in players) {
        // calculate next location
        switch(players[player].direction) {
          case 1 /*left*/:
            next.x = players[player].x - 1;
            next.y = players[player].y;
            break;
          case 2 /*up*/:
            next.x = players[player].x;
            next.y = players[player].y - 1;
            break;
          case 3 /*right*/:
            next.x = players[player].x + 1;
            next.y = players[player].y;
            break;
          case 4 /*down*/:
            next.x = players[player].x;
            next.y = players[player].y + 1;
            break;
        }

        // lol
        if(grid[next.x][next.y]) {
          players[player].alive = false;
          players[player].socket.emit('crash', { rekt_irl: true });
          --alivePlayers;
        }
        else {
          // increment location
          players[player].x = next.x;
          players[player].y = next.y;

          // set it as marked
          grid[next.x][next.y] = true;

          // track new locations
          newLocations.push({ x: next.x,
                              y: next.y });
        }
      }

      for(var player in players) {
        if(players[player].alive) {
          if(alivePlayers <= 1) {
            players[player].socket.emit('win');

            // stop the interval to stop the "game loop"
            // note: this will continue running the current interval
            clearInterval(interval);
            //TODO: reset the game, handle waitQueue
          }
          else
            players[player].socket.emit('update', { newLocations: newLocations });
        }
        else {
          if(alivePlayers <= 1)
            players[player].socket.emit('lose');
        }
      }
    //TODO: game mode difficulties by changing the update value
    }, 100);
  };

  io.sockets.on('connection', function(socket) {
    ++numPlayers;
    ++alivePlayers;
    console.log("Joined. Total players: " + numPlayers);

    // TODO: do we need playerNumber?
    // track players and seed their loc/dir as they stream in
    players[socket.id] = { playerNumber: numPlayers,
                        alive: true,
                        x: (numPlayers % 2 == 0) ?
                              Math.floor(1/4 * gridX) :
                              Math.floor(3/4 * gridX),
                       // calculate the closest power of 2 greater than the number of players
                        y: Math.floor((1/(Math.pow(Math.ceil(
                              Math.log(MAX_ALLOWED_PLAYERS + 1)/Math.log(2)), 2))) * gridY),
                        direction: (numPlayers % 2 == 0) ? 3/*right*/: 1/*left*/,
                        socket: socket };

    // seed the locations as players stream in
    seedLocations.push({ x: players[socket.id].x,
                         y: players[socket.id].y });

    // set their initial location as taken
    grid[players[socket.id].x][players[socket.id].y] = true;

    socket.emit('join');

    // TODO: change the "ready" event to query the players if they want to wait for more players or go
    // wait until an appropriate number of players have joined to initiate game
    if (numPlayers >= MIN_ALLOWED_PLAYERS && numPlayers <= MAX_ALLOWED_PLAYERS) {
      for(var player in players) {
        console.log("checking if player ready...");
        players[player].socket.emit('ready');
      }
    }
    // TODO: do something with waitQueue
    // add extra players to a waiting queue and notify them
    if (gameStarted || numPlayers > MAX_ALLOWED_PLAYERS) {
      console.log("adding player " + players[socket.id].playerNumber + " to wait Queue");
      socket.emit('waitqueue');
      waitQueue.push(socket);
    }

    socket.on('playerready', function(data) {
      ++readyPlayers;
      console.log("Total players ready: " + readyPlayers);

      // if everyone is ready, start the game
      if (readyPlayers == numPlayers) {
        console.log("starting game...");
        gameStarted = true;
        for(var player in players) {
          players[player].socket.emit('start',
                               { playerNumber: players[player].playerNumber,
                                 initialDirection: players[player].direction,
                                 initialLocations: seedLocations });
        }
        startGame();
      }
    });

    socket.on('direction', function(data) {
      players[socket.id].direction = data.direction;
    });
  });
})();
