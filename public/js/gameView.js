

// Constructor
function GameView(game, canvas, page) {
  this.game = game;
  this.canvas = canvas;
  this.page = page;
  this.gameTransparency = 0.1;
  this.context = this.canvas.getContext('2d');
  this.scale = 1;
  this.avatarSelection = -1;
  this.avatarAvailable = Array.apply(null, Array(constants.avatar.length)).map(Number.prototype.valueOf,1);;
}

// Class methods
GameView.prototype.update = function() {

  var position = {x:0, y:0};
  this.clear();

  // Display Intro/Game/Results Canvases
  switch (this.page) {

    case 'Intro': {  // Intro - display game title, choose icon, enter game button.
      this.drawPlayers();
      this.drawProjectiles();
      this.drawObstacles();
      // Backfill
      this.context.fillStyle = 'rgba('+256+','+256+','+256+','+.6+')';
      this.context.fillRect(0,0,800,450);
      this.context.fillStyle = 'rgba('+100+','+200+','+250+','+.6+')';
      this.context.fillRect(0,0,800,450);

      // Draw avatar selection highlight.
      if (this.avatarSelection >=0 && this.avatarAvailable[this.avatarSelection] === 1){
        this.context.fillStyle = 'rgba('+256+','+256+','+256+','+1+')';
        position.x = constants.avatarPos[this.avatarSelection].x + (constants.avatarSize.w/2);
        position.y = constants.avatarPos[this.avatarSelection].y + (constants.avatarSize.h/2);
        this.context.beginPath();
        this.context.arc(position.x, position.y, constants.avatarSize.h/2 + 4, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
      }

      // Text, Avatars and Buttons
      for (var i = 0; i < constants.button.length; i++){
        this.drawImage(constants.button[i], constants.buttonPos[i], constants.buttonSize[i], false);
      }
      for (var i = 0; i < constants.text.length; i++){
        this.drawText(constants.text[i], constants.textFill[i], constants.textFont[i], constants.textPos[i])
      }
      for (var i = 0; i < constants.avatar.length; i++){
        this.drawImage(constants.avatar[i], constants.avatarPos[i], constants.avatarSize, true);
        if (!this.avatarAvailable[i]){
          this.context.globalAlpha = 0.4;
          this.drawImage('notAvailable.png', constants.avatarPos[i], constants.avatarSize, true);
          this.context.globalAlpha = 1;
        }
      }


      break;
    }
    case 'Game': {  // Game - display game in foreground.
      this.drawPlayers();
      this.drawProjectiles();
      this.drawObstacles();
      break;
    }
    case 'Results': {  // Results - display winner.


      break;
    }

    default:{
    }
  }

};
GameView.prototype.clear = function() {
  if(!this.bounds) return;
  this.context.clearRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawPlayers = function() {
  this.game.state.players.forEach(function(player) {
    this.context.fillStyle = player.color;
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.drawAvatar(player.position, player.avatar);
  }.bind(this));
};
GameView.prototype.drawProjectiles = function() {
  this.game.state.projectiles.forEach(function(projectile) {
    this.context.fillStyle = projectile.color;
    this.context.beginPath();
    this.context.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }.bind(this));
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = obstacle.color;
    this.context.fillRect(obstacle.position.x-obstacle.size.x/2, obstacle.position.y-obstacle.size.y/2, obstacle.size.x, obstacle.size.y);
  }.bind(this));
};
GameView.prototype.drawAvatar = function(position, avatar) {
  var shift = constants.avatarSize.h/2;
  var pos = {x: 0, y: 0};
  pos.x = position.x - shift;
  pos.y = position.y - shift;
  this.drawImage(constants.avatar[avatar], pos, constants.avatarSize, true);
}
GameView.prototype.pageChangeGame = function(){
  this.page = 'Game';
}
GameView.prototype.drawImage = function(source, position, size, round){

  var imgObject = new Image();
  var radius = size.h / 2;

  imgObject.src = source;
  if (round){
    this.context.save();
    this.context.beginPath();
    this.context.arc(position.x + radius, position.y + radius, radius, 0, 2*Math.PI, false);
    this.context.closePath();
    this.context.clip();
    this.context.drawImage(imgObject, position.x, position.y, size.w, size.h);
    this.context.restore();
  } else{
    this.context.drawImage(imgObject, position.x, position.y, size.w, size.h);
  }
}
GameView.prototype.drawText = function(text, fill, font, position){
  this.context.font = font;
  this.context.fillStyle = fill;
  this.context.fillText(text, position.x, position.y);
}
GameView.prototype.avatarSelect = function(selection){
  this.avatarSelection = selection;
}
GameView.prototype.populateAvatars = function(){
  this.game.state.players.forEach(function(player) {
  this.avatarAvailable[this.game.state.players.avatar] = 0;
  }.bind(this));
}
