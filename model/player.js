var Vector = require('./vector');
var Team = require('./team');
var constants = require('../data/constants');

// Constructor
function Player(id, team) {
  this.id = id;
  this.team = team;
  this.team.addPlayer();
  this.name = this.team.nextName;
  this.color = this.team.color;
  this.radius = constants.playerRadius;
  this.position = new Vector();
  this.velocity = new Vector();
}

// Class methods
Player.prototype.toState = function() {
  return {
    'id': this.id,
    'color': 'rgb('+this.color.r+','+this.color.g+','+this.color.b+')',
    'name': this.name,
    'radius': this.radius,
    'position': this.position
  };
}
Player.prototype.delete = function() {
  this.team.removePlayer();
}

// Export class
module.exports = Player;
