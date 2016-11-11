var Player = require('../model/player');
var Team = require('../model/team');
var Vector = require('../model/vector');
var StaticRectangle = require('../model/staticRectangle');
var constants = require('../data/constants');

// Constructor
function Game() {
  this.players = {};
  this.teams = [];
  this.obstacles = [];
}

// Class methods
Game.prototype.addPlayer = function(id) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  this.players[id] = new Player(id, smallestTeam);
};
Game.prototype.removePlayer = function(id) {
  this.players[id].delete();
  delete this.players[id];
};
Game.prototype.addTeams = function(count) {
  for(var index=0; index<count; index++){
    this.teams.push(new Team(constants.teamNames[index], constants.teamColors[index]));
  }
}
Game.prototype.addObstacles = function(count) {
  for(var index=0; index<count; index++){
    this.obstacles.push(new StaticRectangle(100*(index+1), 100*(index+1), 150, 40));
  }
}
Game.prototype.reset = function(){
  this.forEachPlayer(function(player) {this.removePlayer(player.id);}.bind(this));
};
Game.prototype.state = function(){
  var players = [];
  this.forEachPlayer(function(player) {players.push(player.toState());});
  return {
    'players': players,
    'obstacles': this.obstacles.map(function(obstacle) {return obstacle.toState();})
  };
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
      player.velocity.normal().multiply(constants.maxPlayerSpeed);
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
