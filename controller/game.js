var Player = require('../model/player');
var Team = require('../model/team');
var Obstacle = require('../model/obstacle');
var Random = require('../model/random');
var World = require('../model/world');

// Constructor
function Game() {
  // Physics
  this.bounds = {x: 800, y: 450};
  this.world = new World(this);
  // Empty state
  this.players = [];
  this.teams = [];
  this.obstacles = [];
  this.projectiles = [];
  this.time = {
    queue: 15000,
    play: 120000,
    results: 15000
  };
  // Setup game
  this.setPhase();
  this.addObstacles();
  this.addTeams(['red', 'blue']);
}

// Instance methods
Game.prototype.setPhase = function() {
  if(this.phase === undefined){
    this.phase = 'queue';
  }else{
    switch(this.phase) {
      case 'queue':
        this.phase = 'play';
        break;
      case 'play':
        this.phase = 'results';
        break;
      case 'results':
        this.phase = 'queue';
        break;
    }
  }
  setTimeout(this.setPhase.bind(this), this.time[this.phase]);
}
Game.prototype.addPlayer = function(id) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  var player = new Player(id, smallestTeam);

  this.players.push(player);
  this.world.add(player);
};
Game.prototype.removePlayer = function(id) {
  var player = this.getPlayer(id);
  if(player !== undefined){
    player.delete();
    this.players.splice(this.players.indexOf(player), 1);
  }
};
Game.prototype.ammoPickup = function(player, projectile) {
  player.ammoPickup(projectile);
  this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
};
Game.prototype.addTeams = function(names) {
  for(var index=0; index<names.length; index++){
    this.teams.push(new Team(names[index]));
  }
};
Game.prototype.addObstacles = function() {
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

  // Push horizontal obstacle, prevent closing in a corner
  if(horizontalRow === 1 // Horizontal obstacle is vertically centered
    || verticalObstacleMatrix[horizontalRow?1:0][horizontalColumn*2] !== (horizontalRow?2:1) // Horizontally exterior vertical obstacle is vertically interior
    || verticalObstacleMatrix[horizontalRow?1:0][1] !== (horizontalRow?3:0)){ // Horizontally centered vertical obstacle is vertically exterior
    if(Random.randomBool()){
      positions.push({x: 332.5+135*horizontalColumn, y: 112.5*(horizontalRow+1), w: 155}); // Push horizontal obstacle position
    }
  }
  // Push vertical obstacle positions
  for(var i=0; i<verticalObstacleMatrix.length; i++){
    for(var j=0; j<verticalObstacleMatrix[i].length; j++){
      positions.push({x: 265+135*j, y: 56.25+112.5*verticalObstacleMatrix[i][j], h: 112.5});
    }
  }
  // Add obstacles
  positions.forEach(function(position) {
    var obstacle = new Obstacle(position.x, position.y, position.w||20, position.h||20);
    this.obstacles.push(obstacle);
    this.world.add(obstacle);
  }.bind(this));
};
Game.prototype.reset = function() {
  this.player.forEach(function(player) {this.removePlayer(player.id);}.bind(this));
};
Game.prototype.state = function(callback) {
  return {
    phase: this.phase,
    players: this.players.map(function(player) {return player.toState();}),
    obstacles: this.obstacles.map(function(obstacle) {return obstacle.toState();}),
    projectiles: this.projectiles.map(function(projectile) {return projectile.toState();})
  };
};
Game.prototype.getPlayer = function(id) {
  return this.players.filter(function(player) {
    return player.id == id;
  })[0];
};
Game.prototype.acceleratePlayer = function(id, x, y) {
  var player = this.getPlayer(id);
  if(player !== undefined){
    player.accelerate(x, y);
  }
};
Game.prototype.addProjectile = function(id, x, y) {
  var player = this.getPlayer(id);
  if(player !== undefined){
    var projectile = player.addProjectile(x, y);
    if(projectile !== undefined){
      this.world.add(projectile);
      this.projectiles.push(projectile);
    }
  }
};

// Export class
module.exports = Game;
