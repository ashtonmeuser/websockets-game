var Player = require('../model/player');
var Team = require('../model/team');
var Projectile = require('../model/projectile');
var Obstacle = require('../model/obstacle');
var Random = require('../model/random');
var World = require('../model/world');

// Constructor
function Game() {
  // Physics
  this.bounds = {x: 800, y: 450};
  this.world = new World(this);
  // Empty state
  this.queue = [];
  this.players = [];
  this.teams = [];
  this.obstacles = [];
  this.projectiles = [];
  this.phaseTime = {
    queue: 10000,
    play: 60000,
    results: 10000
  };
  // Setup game
  this.setPhase('queue');
}

// Instance methods
Game.prototype.setPhase = function(phase) {
  if(phase !== undefined){
    this.phase = phase;
    clearTimeout(this.phaseTime.timeout);
  }else{
    if(this.phase==='queue' && this.aliveTeams().length <= 1) return;
    this.phase = this.nextPhase(this.phase);
  }
  switch(this.phase) {
    case 'queue':
      this.reset();
      this.phaseTime.nextGame = new Date().getTime() + this.phaseTime.queue;
      break;
    case 'play':
      this.phaseTime.nextGame = new Date().getTime() + this.phaseTime.play + this.phaseTime.results + this.phaseTime.queue;
      break;
    case 'results':
      this.phaseTime.nextGame = new Date().getTime() + this.phaseTime.results + this.phaseTime.queue;
      break;
  }
  this.phaseTime.nextPhase = new Date().getTime() + this.phaseTime[this.phase];
  this.phaseTime.timeout = setTimeout(this.setPhase.bind(this), this.phaseTime[this.phase]);
};
Game.prototype.nextPhase = function(phase) {
  switch(phase) {
    case 'queue': return 'play';
    case 'play': return 'results';
    case 'results': return 'queue';
  }
};
Game.prototype.addPlayer = function(player) {
  if(this.teams.length < 1) return;
  var smallestTeam = this.teams.sort(function(a, b) {return (a.length > b.length) ? 1 : -1;})[0];
  player.assignTeam(smallestTeam);
  player.alive = true;
  this.players.push(player);
  this.world.add(player);

  if(this.phaseTime.nextGame<new Date().getTime() && this.aliveTeams().length>1){
    this.setPhase('play');
  }

};
Game.prototype.addId = function(id, avatar) {
  var player = new Player(id, avatar);

  if(this.phase === 'queue'){
    this.addPlayer(player);
  }else{
    this.queue.push(player);
  }
};
Game.prototype.removeId = function(id) {
  var player = this.getPlayer(id);
  if(player !== undefined){
    player.delete();
    var index = this.players.indexOf(player);
    if(index >= 0) this.players.splice(index, 1);
  }
  var player = this.getQueued(id); // DEBUG
  if(player !== undefined){
    player.delete();
    var index = this.queue.indexOf(player);
    if(index >= 0) this.queue.splice(index, 1);
  }
};
Game.prototype.ammoPickup = function(player, projectile) {
  player.ammoPickup(projectile);
  var index = this.projectiles.indexOf(projectile);
  if(index >= 0) this.projectiles.splice(index, 1);
};
Game.prototype.addAmmo = function(count) {
  for(var i=0; i<count; i++){
    this.addProjectile(Random.rangedRandomFloat(140, this.bounds.x-140), Random.rangedRandomFloat(140, this.bounds.y-140));
  }
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
Game.prototype.step = function() {
  this.checkEndgame();
  this.world.step();
};
Game.prototype.reset = function() {
  this.players.forEach(function(player) {
    this.queue.push(player);
    player.delete();
  }.bind(this));
  this.projectiles.forEach(function(projectile) {projectile.delete();});
  this.obstacles.forEach(function(obstacle) {obstacle.delete();});
  this.players.length = 0;
  this.teams.length = 0;
  this.projectiles.length = 0;
  this.obstacles.length = 0;
  this.addObstacles();
  this.addAmmo(10);
  this.addTeams(['red', 'blue', 'green', 'purple']);

  this.queue.forEach(function(player) {
    this.addPlayer(player);
  }.bind(this));
  this.queue.length = 0;
};
Game.prototype.state = function() {
  return {
    phase: this.phase,
    queue: this.queue.map(function(player) {return player.id;}),
    nextPhase: Math.ceil((this.phaseTime.nextPhase-new Date().getTime())/1000),
    nextGame: Math.ceil((this.phaseTime.nextGame-new Date().getTime())/1000),
    players: this.players.map(function(player) {return player.toState();}),
    obstacles: this.obstacles.map(function(obstacle) {return obstacle.toState();}),
    projectiles: this.projectiles.map(function(projectile) {return projectile.toState();})
  };
};
Game.prototype.checkEndgame = function() {
  if(this.phase !== 'play') return;
  var aliveTeams = this.aliveTeams();
  if(aliveTeams.length <= 1){
    console.log(aliveTeams[0].name+' team won'); // DEBUG
    this.setPhase('results');
  }
};
Game.prototype.aliveTeams = function() {
  return this.teams.filter(function(team) {
    return team.length > 0;
  });
};
Game.prototype.getPlayer = function(id) {
  var matches = this.players.filter(function(player) {
    return player.id == id;
  });
  if(matches.length > 0)
    return matches[0];
};
Game.prototype.getQueued = function(id) {
  var matches = this.queue.filter(function(player) {
    return player.id == id;
  });
  if(matches.length > 0)
    return matches[0];
};
Game.prototype.acceleratePlayer = function(id, x, y) {
  if(this.phase!=='play' && this.phase!=='results') return;
  var player = this.getPlayer(id);
  if(player !== undefined){
    player.accelerate(x, y);
  }
};
Game.prototype.addProjectile = function(x, y) {
  var projectile = new Projectile(null, x, y);
  this.world.add(projectile);
  this.projectiles.push(projectile);
};
Game.prototype.shootProjectile = function(id, x, y) {
  if(this.phase !== 'play') return;
  var player = this.getPlayer(id);
  if(player !== undefined){
    var projectile = player.shootProjectile(x, y);
    if(projectile !== undefined){
      this.world.add(projectile);
      this.projectiles.push(projectile);
    }
  }
};

// Export class
module.exports = Game;
