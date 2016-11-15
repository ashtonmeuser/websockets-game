let key_code = {'left': 37, 'right': 39, 'up': 38, 'down': 40};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};
var socket = io();

// Constructor
const constants = {
  // Avatars
  'avatars': ['avatarStar.png',
              'avatarYoshi.png'],
  'avatarPosX': [500, 425],
  'avatarPosY': [425, 425],
  'avatarSizeX': 60,
  'avatarSizeY': 60,
  'avatarAlt': ['Star',
                'Yoshi'],
  'buttons': ['blueButton.jpg'],
  'buttonPosX': [600],
  'buttonPosY': [600],
  'buttonSizeX': [249],
  'buttonSizeY': [89],
};


window.onload = function() {
  var canvas = document.getElementById('canvas');
  var game = new Game();
  var gameView = new GameView(game, canvas, 'Intro');
  var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  // var enterGameButton = document.createElement("button-enter");

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
    gameView.buildGraphics();
  }, constants);

  socket.on('state', function(state) {
    game.updateState(state);
  });

  (function animate(){ // Recursive animation call
    getUserInput();
    gameView.update();
    requestAnimationFrame(animate);
  })();

  // enterGameButton.addEventListener('mousedown', handleGameButtonPress, false);
  // enterGameButton.addEventListener('mouseup', handleEnterGame.bind(null, enterGameButton, gameView, constants), false);
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
function handleGameButtonPress(){
  this.style.boxShadow = '0 8px 16px 0 rgba(0,0,0,0.1), 0 6px 20px 0 rgba(0,0,0,0.1)';
}

// Remove the intro screen, raise transparency of game.
function handleEnterGame(enterGameButton, gameView, constants){

  // Player has entered proper name and chosen icon.
  if (1){
    gameView.gameTransparency = 1;
    gameView.page = 'Game';

    // Hide button and graphics.
    enterGameButton.style.visibility = 'hidden';

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
