// Constructor
function Game(socket) {
  this.socket = socket;
  this.updateState({
    players: [],
    obstacles: [],
    projectiles: []
  })
};

// Class methods
Game.prototype.updateState = function(state) {
  this.state = state;
  var player = this.getPlayer(this.id);
  if(player !== undefined)
    this.state.ammo = player.ammo;
}
Game.prototype.updatePlayerAcceleration = function(x, y) {
  if(x !== 0 || y !== 0) this.socket.emit('updatePlayerAcceleration', x, y);
}
Game.prototype.shootProjectile = function(x, y) {
  this.socket.emit('shootProjectile', x, y);
}
Game.prototype.getPlayer = function(id) {
  var matches = this.state.players.filter(function(player) {
    return player.id == id;
  });
  if(matches.length > 0)
    return matches[0];
};
