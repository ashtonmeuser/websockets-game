// Constructor
function GameView(game, canvas) {
  this.game = game;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
}

// Class methods
GameView.prototype.update = function() {
  this.clear()
  this.drawPlayers();
};
GameView.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
GameView.prototype.update = function() {
  if(!this.bounds) return;
  this.context.clearRect(0, 0, this.bounds.x, this.bounds.y); // Clear canvas
  this.drawPlayers();
};
GameView.prototype.drawPlayers = function() {
  this.game.state.players.forEach(function(player) {
    this.context.fillStyle = 'red';
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.fill();
  }.bind(this));
};
