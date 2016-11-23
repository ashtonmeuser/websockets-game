var Player = require('../model/player');
var Integrator = require('../model/integrator');
var Team = require('../model/team');
var Obstacle = require('../model/obstacle');
var Projectile = require('../model/projectile');
var Random = require('../model/random');
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
};
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
        }else if(player.owner.alive && player.owner.ammo<player.owner.maxAmmo){
          data.collisions.splice(i, 1); // Do not record collision
          if(player.state.pos.dist(projectile.state.pos) < player.radius)
            this.ammoPickup(player.owner, projectile.owner);
        }
      }
    }
    this.world.emit('collisions:desired', data);
  }.bind(this));
};
Game.prototype.addPlayer = function(id) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  var player = new Player(id, smallestTeam);

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
};
Game.prototype.ammoPickup = function(player, projectile) {
  player.ammo++;
  projectile.delete();
  this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
};
Game.prototype.addTeams = function(names) {
  for(var index=0; index<names.length; index++){
    this.teams.push(new Team(names[index]));
  }
};
Game.prototype.addObstacles = function(count) {
  var verticalObstacleMatrix = [
    [Random.rangedRandomInt(0, 1), Random.rangedRandomInt(0, 1), Random.rangedRandomInt(0, 1)],
    [Random.rangedRandomInt(2, 3), Random.rangedRandomInt(2, 3), Random.rangedRandomInt(2, 3)]
  ];
  var horizontalRow = Random.rangedRandomInt(0, 2);
  var horizontalColumn = Random.rangedRandomInt(0, 1);
  var positions = [
    // Known vertical
    {x: 130, y: 56.25, h: 112.5},
    {x: 130, y: 56.25+112.5*3, h: 112.5},
    {x: 670, y: 56.25, h: 112.5},
    {x: 670, y: 56.25+112.5*3, h: 112.5},
    // Known horizontal
    {x: 137.5, y: 225, w: 275},
    {x: 662.5, y: 225, w: 275},
  ];

  // Prevent closing in a corner
  if(horizontalRow === 1 // Horizontal obstacle is vertically centered
    || verticalObstacleMatrix[horizontalRow?1:0][horizontalColumn*2] !== (horizontalRow?2:1) // Horizontally exterior vertical obstacle is vertically interior
    || verticalObstacleMatrix[horizontalRow?1:0][1] !== (horizontalRow?3:0)){ // Horizontally centered vertical obstacle is vertically exterior
    positions.push({x: 332.5+135*horizontalColumn, y: 112.5*(horizontalRow+1), w: 155}); // Push horizontal obstacle position
  }
  // Push vertical obstacle positions
  for(var i=0; i<verticalObstacleMatrix.length; i++){
    for(var j=0; j<verticalObstacleMatrix[i].length; j++){
      positions.push({x: 265+135*j, y: 56.25+112.5*verticalObstacleMatrix[i][j], h: 112.5});
    }
  }
  // Add obstacles
  for(var i=0; i<positions.length; i++){
    var obstacle = new Obstacle(positions[i].x, positions[i].y, positions[i].w||20, positions[i].h||20);
    this.obstacles.push(obstacle);
    this.world.add(obstacle.body);
  }
};
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
    player.body.applyForce(Physics.vector(x, y).clamp(Physics.vector(-1, -1), Physics.vector(1, 1)).mult(player.acceleration*player.body.mass));
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
};

// Export class
module.exports = Game;
