// Constructor
function GameView(game, canvas) {
  this.game = game;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.scale = 1;
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
      this.drawTextScreen(0.6);
      this.drawLabel({x:this.bounds.x/2, y:200}, 'Select character and click join', 'black');
      break;
    case 'queue':
      this.drawTextScreen(0.6);
      var message = (this.game.state.nextGame < 0) ? 'Waiting for players' : 'Game starts in '+this.game.state.nextGame+'s';
      this.drawLabel({x:this.bounds.x/2, y:200}, 'Queue', 'black');
      this.drawLabel({x:this.bounds.x/2, y:300}, message, 'black');
      break;
    case 'play':
      this.drawHud(0.5, this.game.state.ammo, this.game.state.nextPhase);
      break;
    case 'results':
      this.drawTextScreen(0.6);
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
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.drawLabel(player.position, player.name);
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
GameView.prototype.drawHud = function(alpha, ammo, timeout) {
  this.context.fillStyle = 'rgba(200, 130, 0, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 20, 10, 0, 2 * Math.PI);
  this.context.closePath();
  this.context.fill();
  this.context.fillStyle = 'rgba(128, 128, 128, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 45, 10, 0, 2 * Math.PI);
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
GameView.prototype.drawTextScreen = function(alpha) {
  this.context.fillStyle = 'rgba(255, 255, 255, '+alpha+')';
  this.context.fillRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = obstacle.color;
    this.context.fillRect(obstacle.position.x-obstacle.size.x/2, obstacle.position.y-obstacle.size.y/2, obstacle.size.x, obstacle.size.y);
  }.bind(this));
};
GameView.prototype.drawLabel = function(position, text, color, align, size) {
  this.context.fillStyle = color || 'white';
  this.context.textAlign = align || 'center';
  this.context.textBaseline = 'middle';
  this.context.font = 'bold '+(size || 25)+'px Arial';
  this.context.fillText(text, position.x, position.y);
}
