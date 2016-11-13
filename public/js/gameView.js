

// Constructor
function GameView(game, canvas) {
  this.game = game;
  this.canvas = canvas;
  this.page = 1;
  this.gameTransparency = 0.1;
  this.context = this.canvas.getContext('2d');
}

// Class methods
GameView.prototype.update = function() {
  this.clear();

  // Display Intro/Game/Results Canvases
  switch (this.page) {

    case 1: {  // Intro - Shows game in background.
      this.context.fillStyle = 'rgba('+256+','+256+','+256+','+1+')';
      this.context.beginPath();
      this.context.fillRect(0,0,800,450);
      this.context.closePath();
      this.context.fill();

      // Game in background.
      this.drawPlayers(function(player) {
        this.drawLabel(player.position, player.name);
      }.bind(this));
      this.drawObstacles();
      break;
    }

    case 2: {  // Game
      this.drawPlayers(function(player) {
        this.drawLabel(player.position, player.name);
      }.bind(this));
      this.drawObstacles();
      break;
    }

    case 3: {  // Results

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
  this.context.fillStyle = color || 'white';
  this.context.textAlign = 'center';
  this.context.textBaseline = 'middle';
  this.context.font = 'bold '+(size || 25)+'px Arial';
  this.context.fillText(text, position.x, position.y);
}
GameView.prototype.pageIntro = function() {
  this.page = 1;
}
GameView.prototype.pageGame = function() {
  this.page = 2;
}
GameView.prototype.pageResults = function() {
  this.page = 3;
}
