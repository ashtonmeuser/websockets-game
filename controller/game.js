var Player = require('../model/player');
var Team = require('../model/team');
var Vector = require('../model/vector');
var Obstacle = require('../model/obstacle');
var Projectile = require('../model/projectile');
var constants = require('../data/constants');

// Constructor
function Game() {
  this.players = {};
  this.teams = [];
  this.obstacles = [];
  this.projectiles = [];
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
    this.obstacles.push(new Obstacle(100*(index+1), 100*(index+1), 150, 40));
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
    'obstacles': this.obstacles.map(function(obstacle) {return obstacle.toState();}),
    'projectiles': this.projectiles.map(function(projectile) {return projectile.toState();})
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
  this.playerCollisions();
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
  this.projectiles.forEach(function(projectile) {
    projectile.velocity.multiply(1-constants.projectileFriction);
    if(projectile.velocity.magnitude() < constants.minSpeed)
      projectile.velocity.multiply(0);
    else if(projectile.velocity.magnitude() > constants.projectileSpeed)
      projectile.velocity.normal().multiply(constants.projectileSpeed);
  }); // TODO: Refactor
};
Game.prototype.updatePositions = function() {
  this.forEachPlayer(function(player){
    player.position.add(player.velocity);
    player.position.lowerLimit(player.radius);
    player.position.upperLimit(constants.bounds.copy().subtract(player.radius));
  });
  this.projectiles.forEach(function(projectile) {
    var upperBounds = constants.bounds.copy().subtract(projectile.radius);
    projectile.position.add(projectile.velocity);
    if(projectile.position.x < projectile.radius || projectile.position.x > upperBounds.x)
      projectile.velocity.multiply(new Vector(-constants.projectileRestitution, 1));
    if(projectile.position.y < projectile.radius || projectile.position.y > upperBounds.y)
      projectile.velocity.multiply(new Vector(1, -constants.projectileRestitution));
    projectile.position.lowerLimit(projectile.radius);
    projectile.position.upperLimit(upperBounds);
  }); // TODO: Refactor
};
Game.prototype.playerCollisions = function() {
  this.forEachPlayer(function(player1){
    this.forEachPlayer(function(player2){
      if(player1 === player2) return;

      var deltaPosition = player1.position.copy().subtract(player2.position);
      while(deltaPosition.magnitude() < 2*player1.radius){
        if(deltaPosition.magnitude() == 0){
          player1.position.add(player1.radius)
        }else{
          player1.position.add(deltaPosition.copy().normal().divide(2));
          player2.position.subtract(deltaPosition.copy().normal().divide(2));
        }
        deltaPosition = player1.position.copy().subtract(player2.position);
      }
    });
  }.bind(this));
};
Game.prototype.projectileCollisions = function() {
  this.projectiles.forEach(function(projectile1, index1){
    this.projectiles.forEach(function(projectile2, index2){
      if(projectile1 === projectile2) return;

      var deltaPosition = projectile1.position.copy().subtract(projectile2.position);
      var collisionNormal = deltaPosition.copy().normal();
      var speed1 = projectile1.velocity.magnitude();
      var speed2 = projectile2.velocity.magnitude();
      var hit = false;
      while(deltaPosition.magnitude() < 2*projectile1.radius){
        if(deltaPosition.magnitude() == 0){
          projectile1.position.add(projectile1.radius);
        }else if(speed1 == 0 && speed2 == 0){
          projectile1.position.add(collisionNormal.copy().divide(2));
          projectile2.position.subtract(collisionNormal.copy().divide(2));
        }else{
          var ratio = speed1/(speed1+speed2);
          projectile1.position.subtract(projectile1.velocity.copy().normal().multiply(ratio));
          projectile2.position.subtract(projectile2.velocity.copy().normal().multiply(1-ratio));
        }
        deltaPosition = projectile1.position.copy().subtract(projectile2.position);
        collisionNormal = deltaPosition.copy().normal();
        hit = true;
      }
      if(hit){
        var totalSpeed = speed1+speed2;
        projectile1.add(totalSpeed)
        var velocity1 = projectile1.velocity.copy();
        var velocity2 = projectile2.velocity.copy();
        projectile1.add
        projectile1.velocity.subtract(collisionNormal.copy().multiply(2*collisionNormal.copy().dot(projectile1.velocity)));
        projectile2.velocity.subtract(collisionNormal.copy().multiply(2*collisionNormal.copy().dot(projectile2.velocity)));
        console.log(collisionNormal);
        console.log(projectile2.velocity);
        // projectile1.velocity.multiply(0);
        // projectile2.velocity.multiply(0);

      }
    }.bind(this));
  }.bind(this));
};
Game.prototype.addProjectile = function(id, x, y) {
  var projectile = new Projectile();
  projectile.position = this.players[id].position.copy();
  projectile.velocity = new Vector(x, y).subtract(projectile.position).normal().multiply(constants.projectileSpeed);
  this.projectiles.push(projectile);
}

// Export class
module.exports = Game;
