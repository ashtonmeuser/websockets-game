// Constructor
function GameView(game, canvas) {
  this.game = game;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
}

// Class methods
GameView.prototype.update = function() {
  this.clear();
  this.drawPlayers(function(player) {
    this.drawLabel(player.position, player.name);
  }.bind(this));
  this.drawObstacles();
};
GameView.prototype.clear = function() {
  if(!this.bounds) return;
  this.context.clearRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawPlayers = function(callback) {
  this.game.state.players.forEach(function(player, index) {
    this.context.fillStyle = player.color;
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    callback(player);
  }.bind(this));
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = obstacle.color;
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
