let key_code = {'left': 37, 'right': 39, 'up': 38, 'down': 40};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};
var socket = io();

window.onload = function() {
  var canvas = document.getElementById('canvas');
  var game = new Game();
  var gameView = new GameView(game, canvas);
  var mobile = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  socket.on('initialize', function(data) {
    gameView.bounds = data.bounds;
    if(mobile){
      canvas.width = gameView.bounds['y'];
      canvas.height = gameView.bounds['x'];
      canvas.getContext('2d').transform(0, 1, -1, 0, gameView.bounds['y'], 0);
    }else{ // Laptop/desktop, landscape
      canvas.width = gameView.bounds['x'];
      canvas.height = gameView.bounds['y'];
    }
    handleResizeCanvas(canvas);
  });

  socket.on('state', function(state) {
    game.updateState(state);
  });

  (function animate(){ // Recursive animation call
    gameView.update();
    getUserInput();
    requestAnimationFrame(animate);
  })();

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('resize', function(event){handleResizeCanvas(canvas);});
  if(mobile){
    canvas.addEventListener('touchstart', handleClick, false);
    window.addEventListener('deviceorientation', handleAccelerometer, false);
  }else{
    canvas.addEventListener('click', handleClick, true);
  }
};

function getUserInput() {
  var x = 0;
  var y = 0;
  if(key_state.left) x -= 1;
  if(key_state.right) x += 1;
  if(key_state.up) y -= 1;
  if(key_state.down) y += 1;
  updatePlayerAcceleration(x, y);
}

function updatePlayerAcceleration(x, y) {
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

function handleResizeCanvas(canvas) {
  let ratio = canvas.width / canvas.height;

  if(document.body.clientHeight*ratio < document.body.clientWidth){
    scale = canvas.height / document.body.clientHeight;
    canvas.style.width = (100*ratio)+'vh';
    canvas.style.height = (100)+'vh';
  }else{
    scale = canvas.width / document.body.clientWidth;
    canvas.style.width = (100)+'vw';
    canvas.style.height= (100/ratio)+'vw';
  }
}

function handleClick(event) {
  event.preventDefault();
}

function handleAccelerometer(event) {
  var x = 0;
  var y = 0;
  if(Math.abs(event.beta) > 2){
    x = event.beta/20;
  }
  if(Math.abs(event.gamma) > 2){
    y = -event.gamma/20;
  }
  updatePlayerAcceleration(x, y);
}
