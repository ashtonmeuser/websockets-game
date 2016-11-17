let key_code = {'left': 37, 'right': 39, 'up': 38, 'down': 40};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};

window.onload = function() {
  var socket = io();
  var canvas = document.getElementById('canvas');
  var game = new Game(socket);
  var gameView = new GameView(game, canvas);
  var mobile = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  socket.on('initialize', function(data) {
    gameView.bounds = data.bounds;
    if(mobile){ // Portrait
      canvas.width = gameView.bounds['y'];
      canvas.height = gameView.bounds['x'];
      canvas.getContext('2d').transform(0, 1, -1, 0, gameView.bounds['y'], 0);
    }else{ // Landscape
      canvas.width = gameView.bounds['x'];
      canvas.height = gameView.bounds['y'];
    }
    handleResizeCanvas(gameView);
  });

  socket.on('state', function(state) {
    game.updateState(state);
  });

  (function animate(){ // Recursive animation call
    getUserInput(game);
    gameView.update();
    requestAnimationFrame(animate);
  })();

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('resize', function(event) {handleResizeCanvas(gameView);}, false);
  if(mobile){
    canvas.addEventListener('touchstart', function(event) {handleClick(event, gameView, game);}, false);
    window.addEventListener('deviceorientation', function(event) {handleAccelerometer(event, game);}, false);
  }else{
    canvas.addEventListener('click', function(event) {handleClick(event, gameView, game);}, true);
  }
};

function getUserInput(game) {
  var x = 0;
  var y = 0;
  if(key_state.left) x -= 1;
  if(key_state.right) x += 1;
  if(key_state.up) y -= 1;
  if(key_state.down) y += 1;
  game.updatePlayerAcceleration(x, y);
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

function handleResizeCanvas(gameView) {
  let ratio = gameView.canvas.width / gameView.canvas.height;

  if(document.body.clientHeight*ratio < document.body.clientWidth){
    gameView.scale = gameView.canvas.height / document.body.clientHeight;
    gameView.canvas.style.width = (100*ratio)+'vh';
    gameView.canvas.style.height = (100)+'vh';
  }else{
    gameView.scale = gameView.canvas.width / document.body.clientWidth;
    gameView.canvas.style.width = (100)+'vw';
    gameView.canvas.style.height= (100/ratio)+'vw';
  }
}

function handleClick(event, gameView, game) {
  var x = 0;
  var y = 0;
  if(event.type === 'touchstart'){
    var tempX = (event.changedTouches[0].clientX-canvas.offsetLeft)*gameView.scale;
    var tempY = (event.changedTouches[0].clientY-canvas.offsetTop)*gameView.scale;
    x = tempY;
    y = -tempX + gameView.bounds.y;
  }else if(event.type === 'click'){
    x = (event.clientX-canvas.offsetLeft)*gameView.scale;
    y = (event.clientY-canvas.offsetTop)*gameView.scale;
  }
  game.addProjectile(x, y);
  event.preventDefault();
}

function handleAccelerometer(event, game) {
  var x = 0;
  var y = 0;
  if(Math.abs(event.beta) > 2){
    x = event.beta/20;
  }
  if(Math.abs(event.gamma) > 2){
    y = -event.gamma/20;
  }
  game.updatePlayerAcceleration(x, y);
}
