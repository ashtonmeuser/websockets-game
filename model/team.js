// Constructor
function Team(name, color) {
  this.name = name;
  this.length = 0;
  this.nextName = 0;
  this.color = color;
}

// Instance methods
Team.prototype.addPlayer = function() {
  this.length ++;
  this.nextName ++;
}
Team.prototype.removePlayer = function() {
  this.length --;
}

// Class methods

// Export class
module.exports = Team;
