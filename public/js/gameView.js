

// Constructor
function GameView(game, canvas, page) {
  this.game = game;
  this.canvas = canvas;
  this.page = page;
  this.context = this.canvas.getContext('2d');
  this.scale = 1;
  this.avatarOffset = {x: 0, y: -20};
  this.avatarCount = 27;
  this.avatarColumns = 9;
  this.avatarSpacing = 50;
  this.buttonOffset = {x: 0, y: 165};
  this.buttonSize = {x: 240, y: 60};
  this.createImages();
}

// Class methods
GameView.prototype.update = function() {
  if(!this.bounds) return;
  this.clear();
  this.drawPlayers();
  this.drawProjectiles();
  this.drawObstacles();
  switch(this.game.state.phase) {
    case 'join':
      if(this.avatarTaken(this.avatarSelection)) this.avatarSelection=undefined;
      this.drawAlphaScreen();
      this.drawLabel({x:this.bounds.x/2, y:80}, 'Websockets Game', 'black', 'center', 40);
      this.drawLabel({x:this.bounds.x/2, y:160}, 'Choose your player', 'black');
      this.drawButton({x:this.bounds.x/2+this.buttonOffset.x, y:this.bounds.y/2+this.buttonOffset.y}, this.buttonSize);
      this.drawAvatars(this.avatarSelection, {x: this.bounds.x/2, y: 205});
      break;
    case 'queue':
      this.drawAlphaScreen();
      var message = (this.game.state.nextGame < 0) ? 'Waiting for players' : 'Game starts in '+this.game.state.nextGame+'s';
      this.drawLabel({x:this.bounds.x/2, y:200}, 'Queue', 'black');
      this.drawLabel({x:this.bounds.x/2, y:300}, message, 'black');
      break;
    case 'play':
      this.drawHud(0.5, this.game.state.ammo, this.game.state.nextPhase);
      break;
    case 'results':
      this.drawAlphaScreen();
      this.drawLabel({x:this.bounds.x/2, y:200}, 'Results', 'black');
      this.drawLabel({x:this.bounds.x/2, y:300}, 'Game starts in '+this.game.state.nextGame+'s', 'black');
      break;
  }
};
GameView.prototype.clear = function() {
  this.context.clearRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawPlayers = function() {
  this.game.state.players.forEach(function(player) {
    this.context.fillStyle = player.color;
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2*Math.PI);
    this.context.closePath();
    this.context.fill();
    this.drawAvatar(this.imageObjects[player.avatar], player.position);
  }.bind(this));
};
GameView.prototype.drawProjectiles = function() {
  this.game.state.projectiles.forEach(function(projectile) {
    this.context.fillStyle = projectile.color;
    this.context.beginPath();
    this.context.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, 2*Math.PI);
    this.context.closePath();
    this.context.fill();
  }.bind(this));
};
GameView.prototype.drawHud = function(alpha, ammo, timeout) {
  this.context.fillStyle = 'rgba(200, 130, 0, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 20, 10, 0, 2*Math.PI);
  this.context.closePath();
  this.context.fill();
  this.context.fillStyle = 'rgba(128, 128, 128, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 45, 10, 0, 2*Math.PI);
  this.context.closePath();
  this.context.fill();
  this.context.strokeStyle = 'rgba(255, 255, 255, '+alpha+')';
  this.context.lineWidth = 3;
  this.context.beginPath();
  this.context.moveTo(20, 35);
  this.context.lineTo(20, 45);
  this.context.lineTo(27.01, 52.07);
  this.context.stroke();
  this.context.closePath();
  this.drawLabel({x:35, y:20}, ammo, 'rgba(0, 0, 0, '+alpha+')', 'left', 20);
  this.drawLabel({x:35, y:45}, timeout, 'rgba(0, 0, 0, '+alpha+')', 'left', 20);
};
GameView.prototype.drawAlphaScreen = function() {
  var alpha = 0.7;

  this.context.fillStyle = 'rgba(255, 255, 255, '+alpha+')';
  this.context.fillRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = obstacle.color;
    this.context.fillRect(obstacle.position.x-obstacle.size.x/2, obstacle.position.y-obstacle.size.y/2, obstacle.size.x, obstacle.size.y);
  }.bind(this));
};
GameView.prototype.drawAvatar = function(imageObject, position, selected){
  if(!(imageObject instanceof Image)) return;
  var radius = 15;

  if(selected){
    this.context.fillStyle = 'rgb(60, 160, 230)';
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius*1.6, 0, 2*Math.PI);
    this.context.closePath();
    this.context.fill();
  }
  this.context.drawImage(imageObject, position.x-radius, position.y-radius, radius*2, radius*2);
};
GameView.prototype.drawAvatars = function(selectedIndex, aposition) {
  for(var i=0; i<this.avatarCount; i++){
    if(this.imageObjects[i] === undefined) continue;
    var position = {
      x:aposition.x+(i%this.avatarColumns-(this.avatarColumns-1)/2)*this.avatarSpacing,
      y:aposition.y+Math.floor(i/this.avatarColumns)*this.avatarSpacing
    };

    this.drawAvatar(this.imageObjects[i], position, this.avatarSelection===i);
    if(this.avatarTaken(i)){
      this.drawAvatar(this.imageObjects[this.avatarCount], position);
    }
  }
};
GameView.prototype.drawLabel = function(position, text, color, align, size) {
  this.context.fillStyle = color || 'white';
  this.context.textAlign = align || 'center';
  this.context.textBaseline = 'middle';
  this.context.font = 'bold '+(size || 25)+'px Arial';
  this.context.fillText(text, position.x, position.y);
};
GameView.prototype.drawButton = function(position, size) {
  this.context.fillStyle = (this.avatarSelection===undefined) ? 'rgb(128, 128, 128)' : 'rgb(60, 160, 230)';
  this.context.fillRect(position.x-size.x/2, position.y-size.y/2, size.x, size.y);
  this.drawLabel(position, 'Join game');
};
GameView.prototype.avatarTaken = function(index) {
  var taken = [];
  this.game.state.players.forEach(function(player) {
    taken.push(player.avatar);
  }.bind(this));
  return (taken.indexOf(index) >= 0);
};
GameView.prototype.avatarHit = function(x, y) {
  var hitRadius = 20;

  for(var i=0; i < this.avatarCount; i++){
    var center = {
      x: this.bounds.x/2+this.avatarOffset.x+(i%this.avatarColumns-(this.avatarColumns-1)/2)*this.avatarSpacing,
      y: this.bounds.y/2+this.avatarOffset.y+Math.floor(i/this.avatarColumns)*this.avatarSpacing
    };
    if(Math.abs(x-center.x)<hitRadius && Math.abs(y-center.y)<hitRadius && !this.avatarTaken(i))
      this.avatarSelection = i;
  }
};
GameView.prototype.buttonHit = function(x, y) {
  var center = {
    x: this.bounds.x/2+this.buttonOffset.x,
    y: this.bounds.y/2+this.buttonOffset.y
  };
  if(Math.abs(x-center.x)<this.buttonSize.x && Math.abs(y-center.y)<this.buttonSize.y && this.avatarSelection!==undefined){
    this.game.addPlayer(this.avatarSelection);
  }
};
GameView.prototype.createImages = function() {
  this.imageObjects = [];
  for(var i=0; i<this.avatarCount; i++){
    var image = new Image();
    image.src = 'img/avatar'+i+'.png';
    this.imageObjects.push(image);
  }
  var image = new Image();
  image.src = 'img/notAvailable.png';
  this.imageObjects.push(image);
};
