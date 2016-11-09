// Constructor
function GameView(game, canvas, socket) {
  this.game = game;
  this.canvas = canvas;
  this.socket = socket;
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
  this.drawPlayers();
};
GameView.prototype.drawPlayers = function() {
  this.game.state.players.forEach(function(player) {
    this.context.fillStyle = 'red';
    this.context.beginPath();
    this.context.arc(50, 50, 20, 0, 2 * Math.PI);
    this.context.fill();
  }.bind(this));
};
