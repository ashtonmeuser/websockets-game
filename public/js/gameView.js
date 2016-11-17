

// Constructor
function GameView(game, canvas, page) {
  this.game = game;
  this.canvas = canvas;
  this.page = page;
  this.gameTransparency = 0.1;
  this.context = this.canvas.getContext('2d');
}

// Class methods
GameView.prototype.update = function() {

  this.clear();

  // Display Intro/Game/Results Canvases
  switch (this.page) {

    case 'Intro': {  // Intro - display game title, enter player name, choose icon, game in background.

      // Backfill
      this.context.fillStyle = 'rgba('+150+','+10+','+200+','+.5+')';
      this.context.fillRect(0,0,800,450);

      // Text, Avatars and Buttons
      for (var i = 0; i < constants.button.length; i++){
        this.drawImage(constants.button[i], constants.buttonPos[i], constants.buttonSize[i]);
      }
      for (var i = 0; i < constants.text.length; i++){
        this.drawText(constants.text[i], constants.textFill[i], constants.textFont[i], constants.textPos[i])
      }
      for (var i = 0; i < constants.avatar.length; i++){
        this.drawImage(constants.avatar[i], constants.avatarPos[i], constants.avatarSize);
      }

      // // Display game in background.
      // this.drawPlayers(function(player) {
      //   this.drawLabel(player.position, player.name);
      // }.bind(this));
      // this.drawObstacles();
      // break;
    }

    case 'Game': {  // Game - display game in foreground.

      // Display game in background.
      this.drawPlayers(function(player) {
        this.drawLabel(player.position, player.name);
      }.bind(this));
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
GameView.prototype.drawPlayers = function(callback) {
  this.game.state.players.forEach(function(player, index) {
    this.context.fillStyle = 'rgba('+256+','+0+','+0+','+this.gameTransparency+')';
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    callback(player);
  }.bind(this));
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = 'rgba('+100+','+50+','+150+','+this.gameTransparency+')';
    this.context.beginPath();
    this.context.fillRect(obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
    this.context.closePath();
    this.context.fill();
  }.bind(this));
};
GameView.prototype.drawLabel = function(position, text, size, color) {
  this.context.fillStyle = 'rgba('+256+','+256+','+256+','+this.gameTransparency+')';
  this.context.textAlign = 'center';
  this.context.textBaseline = 'middle';
  this.context.font = 'bold '+(size || 25)+'px Arial';
  this.context.fillText(text, position.x, position.y);
}
GameView.prototype.pageChangeGame = function(){
  this.page = 'Game';
}
GameView.prototype.drawImage = function(source, position, size){

  var imgObject = new Image();

  imgObject.src = source;
  this.context.drawImage(imgObject, position.x, position.y, size.w, size.h);
  console.log(position.x);
}
GameView.prototype.drawText = function(text, fill, font, position){
  this.context.font = font;
  this.context.fillStyle = fill;
  this.context.fillText(text, position.x, position.y);
}
