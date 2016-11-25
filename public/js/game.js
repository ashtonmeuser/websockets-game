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
Game.prototype.addProjectile = function(x, y) {
  this.socket.emit('addProjectile', x, y);
}
