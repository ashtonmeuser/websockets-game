var Player = require('../model/player');
var Integrator = require('../model/integrator');
var Team = require('../model/team');
var Obstacle = require('../model/obstacle');
var Projectile = require('../model/projectile');
var Physics = require('physicsjs');

// Constructor
function Game() {
  // Physics
  this.bounds = {x: 800, y: 450};
  this.world = Physics();
  this.extensions();
  this.behaviors();
  this.integrators();
  this.subscribers();
  // Empty state
  this.players = {};
  this.teams = [];
  this.obstacles = [];
  this.projectiles = [];
  // Setup game
  this.addObstacles(1);
  this.addTeams(['red', 'blue']);
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
    Physics.behavior('body-impulse-response', {
      check: 'collisions:desired'
    }),
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
Game.prototype.subscribers = function() {
  this.world.on('collisions:detected', function(data){
    for(var i=0; i<data.collisions.length; i++){
      var collision = data.collisions[i];
      if(collision.bodyA.name === 'projectile' && collision.bodyB.name === 'player' || collision.bodyA.name === 'player' && collision.bodyB.name === 'projectile'){
        var player = (collision.bodyA.name === 'player') ? collision.bodyA : collision.bodyB;
        var projectile = (collision.bodyA.name === 'projectile') ? collision.bodyA : collision.bodyB;

        if(projectile.active){
          if(!projectile.newborn || projectile.owner.shooter !== player.owner)
            this.playerHit(player.owner, projectile.owner);
        }else if(player.owner.ammo < player.owner.maxAmmo){
          data.collisions.splice(i, 1); // Do not record collision
          if(player.state.pos.dist(projectile.state.pos) < player.radius)
            this.ammoPickup(player.owner, projectile.owner);
        }
      }
    }
    this.world.emit('collisions:desired', data);
  }.bind(this));
}
Game.prototype.addPlayer = function(id, avatar) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  var player = new Player(id, smallestTeam, avatar, 100, 100);

  this.players[id] = player;
  this.world.add(player.body);
};
Game.prototype.removePlayer = function(id) {
  var player = this.players[id];
  player.delete();
  delete this.players[id];
};
Game.prototype.playerHit = function(player, projectile) {
  player.alive = false;
  console.log('kill');
}
Game.prototype.ammoPickup = function(player, projectile) {
  player.ammo++;
  projectile.delete();
  this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
}
Game.prototype.addTeams = function(names) {
  for(var index=0; index<names.length; index++){
    this.teams.push(new Team(names[index]));
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
  if(player != undefined && player.alive){
    player.body.accelerate(Physics.vector(x, y).clamp(Physics.vector(-1, -1), Physics.vector(1, 1)).mult(player.body.acceleration));
    player.body.sleep(false);
  }
};
Game.prototype.addProjectile = function(id, x, y) {
  var player = this.players[id];
  if(player != undefined && player.alive && player.ammo>0){
    player.ammo--;
    var projectile = new Projectile(this.players[id]);
    projectile.accelerate(x, y);
    this.world.add(projectile.body);
    this.projectiles.push(projectile);
  }
}

// Export class
module.exports = Game;
