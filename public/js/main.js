onload = function() {
  var canvas = document.getElementById('canvas');
  var socket = io();
  var game = new Game();
  var gameView = new GameView(game, canvas, socket);

  socket.on('state', function(state) {
    game.updateState(state);
  });

  (function animate(){ // Recursive animation call
    gameView.update();
    requestAnimationFrame(animate);
  })();
};
