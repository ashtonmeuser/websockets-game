// Constructor
function Game(socket) {
  this.socket = socket;
  this.updateState({
    players: [],
    obstacles: [],
    projectiles: [],
    queue: []
  })
};

// Class methods
Game.prototype.updateState = function(state) {
  this.state = state;
  var player = this.getPlayer(this.id);
  if(this.state.queue.indexOf(this.id) >= 0){
    this.state.phase = 'queue';
  }else{
    var player = this.getPlayer(this.id);
    if(player !== undefined)
      this.state.ammo = player.ammo;
    else
      this.state.phase = 'join';
  }
}
Game.prototype.updatePlayerAcceleration = function(x, y) {
  if(x !== 0 || y !== 0) this.socket.emit('updatePlayerAcceleration', x, y);
}
Game.prototype.shootProjectile = function(x, y) {
  this.socket.emit('shootProjectile', x, y);
}
Game.prototype.addPlayer = function(avatar) {
  this.socket.emit('addPlayer', avatar);
}
Game.prototype.getPlayer = function(id) {
  var matches = this.state.players.filter(function(player) {
    return player.id == id;
  });
  if(matches.length > 0)
    return matches[0];
};
