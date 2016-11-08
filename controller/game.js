// Constructor
function Game() {
  this.players = {}; // Array of active players
}

// Class methods
Game.prototype.addPlayer = function(id) {
  this.players[id] = {'id': id};
};
Game.prototype.removePlayer = function(id) {
  delete this.players[id];
};
Game.prototype.reset = function(){
  this.forEachPlayer(this.removePlayer(player.id));
};
Game.prototype.state = function(){
  var players = []
  this.forEachPlayer(function(player){ players.push(player); });
  return {
    'players': players.map(toState)
  }
};
Game.prototype.forEachPlayer = function(callback){
  for(var id in this.players) {
    callback(this.players[id]);
  }
};
Game.prototype.tick = function() { // To be called from game loop
  console.log('tick');
};

// Export class
module.exports = Game

// Utilities
function toState(player) { // Map player object to expected state
  return {id: player.id};
};
