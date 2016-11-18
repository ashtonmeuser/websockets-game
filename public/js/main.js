let key_code = {'left': 37, 'right': 39, 'up': 38, 'down': 40};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};

// Constructor
const constants = {
  // Avatars
  'avatar': [ 'avatarStar.png',
              'avatarYoshi.png'],
  'avatarPos': [{'x':150, 'y':200},
                {'x':200, 'y':200}],
  'avatarSize': {'w':40, 'h':40},
  // Buttons
  'button': ['blueButton.jpg'],
  'buttonPos': [{'x':320, 'y':370}],
  'buttonSize': [{'w':120, 'h':40}],
  // Text
  'text': [ 'Poly Wars',
            'Choose your Player',
            'Enter Game'],
  'textFont': [ '80px Tahoma',
                '20px Tahoma',
                '15px Helvetica'],
  'textFill': [ 'black',
                'black',
                'black'],
  'textPos': [{'x':380, 'y':70},
              {'x':380, 'y':150},
              {'x':380, 'y':389}]
};
// var images = constants.avatars.map(function(avatar) {return new Image().source=avatar;});


window.onload = function() {
  var socket = io();
  var canvas = document.getElementById('canvas');
  var game = new Game(socket);
  var gameView = new GameView(game, canvas, 'Intro');
  var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

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
    window.s = state;
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
function handleGameButtonPress(){
  this.style.boxShadow = '0 8px 16px 0 rgba(0,0,0,0.1), 0 6px 20px 0 rgba(0,0,0,0.1)';
}

// Remove the intro screen, raise transparency of game.
function handleEnterGame(){

  // Player has entered proper name and chosen icon.
  if (1){
    document.getElementById(gameView).gameTransparency = 1;
    document.getElementById(gameView).page = 'Game';
    // gameView.gameTransparency = 1;
    // gameView.page = 'Game';

    // Hide button and graphics.
    for(var i = 0; i < constants.buttons.length; i++){
      document.getElementById(constants.buttons[i]).style.visibility = 'hidden';
    }
    for(var i = 0; i < constants.avatars.length; i++){
      document.getElementById(constants.avatars[i]).style.visibility = 'hidden';
    }
  }
}

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
