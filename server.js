var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var Game = require('./controller/game');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 5000));
var server = http.Server(app);
var io = socketio(server);
var game = new Game();

app.get('/', function(request, response) {
  response.render('pages/index');
});

server.listen(app.get('port'), function(){
  console.log('Node app running on port ', app.get('port'));
});

setInterval(function() { // Progress game, emit state
  game.tick();
  io.emit('state', game.state());
}, 1000/60);

io.on('connection', function(io){ // Listen for connections
  console.log('Connection ', io.id);
  game.addPlayer(io.id);

  io.on('disconnect', function(){ // Listen for disconnections
    console.log('Disconnection ', io.id);
    game.removePlayer(io.id);
  });
});
