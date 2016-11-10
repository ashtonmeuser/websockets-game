let key_code = {'left': 37, 'right': 39, 'up': 38, 'down': 40};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};
var socket = io();

window.onload = function() {
  var canvas = document.getElementById('canvas');
  var game = new Game();
  var gameView = new GameView(game, canvas);

  socket.on('initialize', function(data) {
    canvas.width = data.bounds.x;
    canvas.height = data.bounds.y;
    gameView.bounds = data.bounds;
  });

  socket.on('state', function(state) {
    game.updateState(state);
    // console.log(state);
  });

  (function animate(){ // Recursive animation call
    gameView.update();
    requestAnimationFrame(animate);
  })();

  setInterval(function() { // TODO: Try including in animation loop
    addPlayerVelocity();
  }, 1000/60);

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
};

function addPlayerVelocity() {
  var x = 0;
  var y = 0;
  if(key_state.left) x -= 1;
  if(key_state.right) x += 1;
  if(key_state.up) y -= 1;
  if(key_state.down) y += 1;
  if(x != 0 || y != 0) socket.emit('updatePlayerAcceleration', x, y);
}

// Event handlers

function handleKeyDown(event) {
  for(var direction in key_code){
    if(event.keyCode === key_code[direction])
      key_state[direction] = true;
  }
}

function handleKeyUp(event) {
  for(var direction in key_code){
    if(event.keyCode === key_code[direction])
      key_state[direction] = false;
  }
}
