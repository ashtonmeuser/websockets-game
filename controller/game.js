var Player = require('../model/player');
var Vector = require('../model/vector');
var constants = require('../data/constants');

// Constructor
function Game() {
  this.players = {}; // Array of active players
}

// Class methods
Game.prototype.addPlayer = function(id) {
  this.players[id] = new Player(id);
};
Game.prototype.removePlayer = function(id) {
  delete this.players[id];
};
Game.prototype.reset = function(){
  this.forEachPlayer(this.removePlayer(player.id));
};
Game.prototype.state = function(){
  var players = [];
  this.forEachPlayer(function(player){ players.push(player); });
  return {
    'players': players.map(function(player) {return player.toState();})
  }
};
Game.prototype.forEachPlayer = function(callback){
  for(var id in this.players) {
    callback(this.players[id]);
  }
};
Game.prototype.tick = function() { // To be called from game loop
  this.updateVelocities();
  this.updatePositions();
};
Game.prototype.acceleratePlayer = function(id, x, y) {
  var player = this.players[id];
  if(player != undefined)
    player.velocity.add(new Vector(x, y).upperLimit(1).lowerLimit(-1).multiply(constants.playerAcceleration));
};
Game.prototype.updateVelocities = function() {
  this.forEachPlayer(function(player){
    player.velocity.multiply(1-constants.playerFriction);
    if(player.velocity.magnitude() < constants.minSpeed)
      player.velocity.multiply(0);
    else if(player.velocity.magnitude() > constants.maxPlayerSpeed)
      player.velocity.multiply(constants.maxPlayerSpeed/player.velocity.magnitude());
  });
};
Game.prototype.updatePositions = function() {
  this.forEachPlayer(function(player){
    player.position.add(player.velocity);
    player.position.lowerLimit(player.radius);
    player.position.upperLimit(constants.bounds.copy().subtract(player.radius));
  });
};

// Export class
module.exports = Game;
