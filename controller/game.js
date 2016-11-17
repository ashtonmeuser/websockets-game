var Player = require('../model/player');
var Integrator = require('../model/integrator');
var Team = require('../model/team');
var Obstacle = require('../model/obstacle');
var Projectile = require('../model/projectile');
var Color = require('../model/color');
var Physics = require('physicsjs');

// Constructor
function Game() {
  // Physics
  this.bounds = {x: 800, y: 450};
  this.world = Physics();
  this.extensions();
  this.behaviors();
  this.integrators();
  // Empty state
  this.players = {};
  this.teams = [];
  this.obstacles = [];
  this.projectiles = [];
  // Setup game
  this.addObstacles(1);
  this.addTeams(2);
}

// Instance methods
Game.prototype.extensions = function() {
  Player.extension();
  Projectile.extension();
  Integrator.extension();
  Obstacle.extension();
};
Game.prototype.behaviors = function() {
  this.world.add([
    Physics.behavior('body-impulse-response'),
    Physics.behavior('body-collision-detection'),
    Physics.behavior('sweep-prune'),
    Physics.behavior('edge-collision-detection', {
      aabb: Physics.aabb(0, 0, 800, 450),
      restitution: 0.6,
      cof: 0.2
    })
  ]);
};
Game.prototype.integrators = function() {
  this.world.add(Physics.integrator('verlet-custom'));
}
Game.prototype.addPlayer = function(id) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  var player = new Player(id, smallestTeam, 0, 0);

  this.players[id] = player;
  this.world.add(player.body);
};
Game.prototype.removePlayer = function(id) {
  var player = this.players[id];
  this.world.remove(player.body);
  player.delete();
  delete this.players[id];
};
Game.prototype.addTeams = function(count) {
  var teamColors = [new Color(220, 70, 110), new Color(50, 180, 220)];
  var teamNames = ['red', 'blue'];
  for(var index=0; index<count; index++){
    this.teams.push(new Team(teamNames[index], teamColors[index]));
  }
}
Game.prototype.addObstacles = function(count) {
  for(var index=0; index<count; index++){
    var obstacle = new Obstacle(400, 225);
    this.obstacles.push(obstacle);
    this.world.add(obstacle.body);
  }
}
Game.prototype.reset = function() {
  this.forEachPlayer(function(player) {this.removePlayer(player.id);}.bind(this));
};
Game.prototype.state = function(callback) {
  var players = [];
  this.forEachPlayer(function(player) {
    players.push(player.toState());
  });
  return {
    'players': players,
    'obstacles': this.obstacles.map(function(obstacle) {return obstacle.toState();}),
    'projectiles': this.projectiles.map(function(projectile) {return projectile.toState();})
  };
};
Game.prototype.forEachPlayer = function(callback) {
  for(var id in this.players) {
    callback(this.players[id]);
  }
};
Game.prototype.tick = function() {
  this.world.step();
};
Game.prototype.acceleratePlayer = function(id, x, y) {
  var player = this.players[id];
  if(player != undefined){
    player.body.accelerate(Physics.vector(x, y).normalize().mult(player.body.acceleration));
    player.body.sleep(false);
  }
};
Game.prototype.addProjectile = function(id, x, y) {
  var projectile = new Projectile(this.players[id]);
  projectile.accelerate(x, y);
  this.projectiles.push(projectile);
  this.world.add(projectile.body);
}

// Export class
module.exports = Game;
