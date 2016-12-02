let key_code = {'left': [37, 65], 'right': [39, 68], 'up': [38, 87], 'down': [40, 83]};
var key_state = {'left': false, 'right': false, 'up': false, 'down': false};

// Constructor
const constants = {
  // Avatars
  'avatar': [ 'avatarStar.png',
              'avatarSkull.png',
              'avatarDarth.png',
              'avatarBone.png',
              'avatarFish.png',
              'avatarDeathstar.png',
              'avatarGhost.png',
              'avatarSpider.png',
              'avatarBomb.png',
              'avatarSwords.png',
              'avatarDragon.png',
              'avatarFlame.png',
              'avatarBatman.png',
              'avatarDragon2.png',
              'avatarPokeball.png',
              'avatarShield.png',
              'avatarHeart.png',
              'avatarGladiator.png',
              'avatarKnight.png',
              'avatarRadioactive.png',
              'avatarTiefighter.png',
              'avatarSaturn.png',
              'avatarWand.png',
              'avatarUniverse.png',
              'avatarNuke.png',
              'avatarRocket.png',
              'avatarPirate.png'],
  'avatarPos': {x:0, y:-20},
  'avatarSpacing': 50,
  'avatarColumns': 9,
  'avatarSize': {w:35, h:35},
  // Buttons
  'button': ['blueButton.jpg'],
  'buttonPos': [{x:0, y:165}],
  'buttonSize': [{w:120, h:40}],
  // Text
  'textJoin': [ 'Poly Wars',
            'Choose your Player',
            'Enter Game',
            'Created by: Ashton Meuser & Zachary Lang'],
  'textJoinSize': [ 80,
                20,
                15,
                12],
  'textJoinColor': ['black',
                    'black',
                    'black',
                    'black'],
  'textJoinPos': [{x:0, y:-150},
                  {x:0, y:-50},
                  {x:0, y:165},
                  {x:250, y:210}]
};

window.onload = function() {
  var socket = io();
  var canvas = document.getElementById('canvas');
  var game = new Game(socket);
  var gameView = new GameView(game, canvas);
  var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  socket.on('initialize', function(data) {
    game.id = data.id;
    gameView.bounds = data.bounds;
    canvas.style.display = 'block';
    if(mobile){ // Portrait
      canvas.width = gameView.bounds['y'];
      canvas.height = gameView.bounds['x'];
      canvas.getContext('2d').transform(0, 1, -1, 0, gameView.bounds['y'], 0);
    }else{ // Landscape
      canvas.width = gameView.bounds['x'];
      canvas.height = gameView.bounds['y'];
    }
    handleResizeCanvas(gameView);
    // gameView.populateAvatars();
  });

  socket.on('state', function(state) {
    window.s = state; // DEBUG
    window.g = game; // DEBUG
    game.updateState(state);
    gameView.populateAvatars();
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
    canvas.addEventListener('touchstart', handleGameClick, false);
    window.addEventListener('deviceorientation', handleAccelerometer, false);
  }else{
    canvas.addEventListener('click', function(event){handleClick(event, gameView, game, socket);}, false);
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

function handleKeyDown(event) {
  for(var direction in key_code){
    if(key_code[direction].indexOf(event.keyCode) >= 0)
      key_state[direction] = true;
  }
}

function handleKeyUp(event) {
  for(var direction in key_code){
    if(key_code[direction].indexOf(event.keyCode) >= 0)
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

function handleClick(event, gameView, game, socket) {
  var mousePos = {x: 0, y:0};
  var avatarSelection = -1;
  var rows = Math.ceil(constants.avatar.length/constants.avatarColumns);
  if(event.type === 'touchstart'){
    var tempX = (event.changedTouches[0].clientX-canvas.offsetLeft)*gameView.scale;
    var tempY = (event.changedTouches[0].clientY-canvas.offsetTop)*gameView.scale;
    mousePos.x = tempY;
    mousePos.y = -tempX + gameView.bounds.y;
  }else if(event.type === 'click'){
    mousePos.x = (event.clientX-canvas.offsetLeft)*gameView.scale;
    mousePos.y = (event.clientY-canvas.offsetTop)*gameView.scale;
  }

  // Detect item clicked.
  // Enter game button.
  var center = {x: gameView.bounds.x/2+constants.buttonPos[0].x, y:gameView.bounds.y/2+constants.buttonPos[0].y}
  if(Math.abs(mousePos.x-center.x)<constants.buttonSize[0].w/2 && Math.abs(mousePos.y-center.y)<constants.buttonSize[0].h/2 && gameView.avatarAvailable[gameView.avatarSelection] == 1){
    socket.emit('addPlayer', gameView.avatarSelection);
  }
  // Avatar hit.
  for (var i = 0; i < constants.avatar.length; i++){
    var center = {x: gameView.bounds.x/2+constants.avatarPos.x+(i%constants.avatarColumns-constants.avatarColumns/2)*constants.avatarSpacing+constants.avatarSize.w/2, y:gameView.bounds.y/2+constants.avatarPos.y+Math.floor(i/constants.avatarColumns)*constants.avatarSpacing+constants.avatarSize.h/2}
    if(Math.abs(mousePos.x-center.x)<constants.avatarSize.w/2 && Math.abs(mousePos.y-center.y)<constants.avatarSize.h/2){
      if (gameView.avatarAvailable[i] == 1){
        gameView.avatarSelection = i;
      }
    }
  }
  game.shootProjectile(mousePos.x, mousePos.y);
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

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
    y: Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height) + 1
  };
}
