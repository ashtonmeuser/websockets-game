var constants = require('../data/constants');

// Constructor
function Team(name, color) {
  this.name = name;
  this.length = 0;
  this.nextName = 0;
  this.color = color;
}

// Class methods
Team.prototype.addPlayer = function() {
  this.length ++;
  this.nextName ++;
}
Team.prototype.removePlayer = function() {
  this.length --;
}

// Export class
module.exports = Team;
