#!/usr/bin/env nodejs
(function() {
      // connection data
  var port = 3701;
      connect = require('connect'),
      serve = require('serve-static'),
      io = require('socket.io').listen(
        connect().use(serve("../index.html")).listen(port)),

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
      gridX = 20, gridY = 20,
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

      for(var player in Object.keys(players)) {
        // calculate next location
        switch(players[player].direction) {
          case 1 /*left*/:
            next[x] = players[player].x - 1;
            next[y] = players[player].y;
            break;
          case 2 /*up*/:
            next[x] = players[player].x;
            next[y] = players[player].y - 1;
            break;
          case 3 /*right*/:
            next[x] = players[player].x + 1;
            next[y] = players[player].y;
            break;
          case 4 /*down*/:
            next[x] = players[player].x;
            next[y] = players[player].y + 1;
            break;
        }

        // lol
        if(grid[next.x][next.y]) {
          players[player].alive = false;
          player.emit('crash', { rekt_irl: true });
          --alivePlayers;
        }
        else {
          // increment location
          players[player].x = next.x;
          players[player].y = next.y;

          // set it as marked
          grid[next.x][next.y] = true;

          // track new locations
          newLocations.push(next.x, next.y);
        }
      }

      //TODO: handle replaying/waitQueue
      for(var player in Object.keys(players)) {
        if(players[player].alive) {
          if(alivePlayers <= 1)
            player.emit('win');
          else
            //TODO: in client, socket.on('update', ...) should be update(data[1]. data[2])
            // ie remove need for object
            player.emit('update', { locationList: newLocations });
        }
        else {
          if(alivePlayers <= 1)
            player.emit('lose');
        }
        // stop the interval to stop the "game loop"
        clearInterval(interval);
      }
    }, 1500);
  };

  io.sockets.on('connection', function(socket) {
    ++numPlayers;
    ++alivePlayers;

    // TODO: do we need playerNumber?
    // track players and seed their loc/dir as they stream in
    players[socket] = { playerNumber: numPlayers,
                        alive: true,
                        x: (numPlayers % 2 == 0) ?
                              Math.floor(1/4 * gridX) :
                              Math.floor(3/4 * gridX),
                       // calculate the closest power of 2 greater than the number of players
                        y: Math.floor((1/(Math.pow(Math.ceil(
                              Math.log(MAX_ALLOWED_PLAYERS + 1)/Math.log(2)), 2))) * gridY),
                        direction: (numPlayers % 2 == 0) ? 3/*right*/: 1/*left*/ };

    // seed the locations as players stream in
    seedLocations.push({ x: players[socket].x,
                         y: players[socket].y });

    // set their initial location as taken
    grid[players[socket].x][players[socket].y] = true;

    socket.emit('join');

    // TODO: change the "ready" event to query the players if they want to wait for more players or go
    // wait until an appropriate number of players have joined to initiate game
    if (numPlayers >= MIN_ALLOWED_PLAYERS && numPlayers <= MAX_ALLOWED_PLAYERS) {
      for(var player in Object.keys(players)) {
        player.emit('ready');
      }
    }
    // TODO: do something with waitQueue
    // add extra players to a waiting queue and notify them
    if (gameStarted || numPlayers > MAX_ALLOWED_PLAYERS) {
      socket.emit('waitqueue');
      waitQueue.push(socket);
    }

    socket.on('playerready', function(data) {
      ++readyPlayers;

      // if everyone is ready, start the game
      if (readyPlayers == numPlayers) {
        gameStarted = true;
        for(var player in Object.keys(players)) {
          player.emit('start', { playerNumber: players[player].playerNumber,
                                 initialDirection: players[player].direction,
                                 initialLocation: seedLocations });
        }
        startGame();
      }
    });

    socket.on('direction', function(data) {
      players[socket].direction = data.direction;
    });
  });
})();
