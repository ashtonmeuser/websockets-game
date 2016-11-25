// Constructor
function Game(socket) {
  this.socket = socket;
  this.updateState({
    'players': [],
    'obstacles': [],
    'projectiles': []
  })
};

// Class methods
Game.prototype.updateState = function(state) {
  this.state = state;
}
Game.prototype.updatePlayerAcceleration = function(x, y) {
  if(x !== 0 || y !== 0) this.socket.emit('updatePlayerAcceleration', x, y);
}
Game.prototype.shootProjectile = function(x, y) {
  this.socket.emit('shootProjectile', x, y);
}
