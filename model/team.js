var Color = require('./color');

// Constructor
function Team(name) {
  this.name = name;
  this.length = 0;
  this.nextName = 0;
  this.aliveColor = this.getColor(name).alive;
  this.deadColor = this.getColor(name).dead;
  this.coordinates = this.getCoordinates(name);
}

// Instance methods
Team.prototype.addPlayer = function() {
  this.length++;
  this.nextName++;
};
Team.prototype.removePlayer = function() {
  this.length--;
};
Team.prototype.getColor = function(name) {
  var colors = {
    red: {alive: new Color(220, 70, 110), dead: new Color(220, 160, 170)},
    blue: {alive: new Color(50, 180, 220), dead: new Color(140, 200, 220)},
    green: {alive: new Color(80, 210, 80), dead: new Color(170, 210, 170)},
    purple: {alive: new Color(170, 110, 200), dead: new Color(200, 170, 200)}
  };
  return colors[name];
};
Team.prototype.getCoordinates = function(name) {
  var coordinates = {
    red: {x: 60, y: 390},
    blue: {x: 740, y: 60},
    green: {x: 60, y: 60},
    purple: {x: 740, y: 390}
  };
  return coordinates[name];
};

// Class methods

// Export class
module.exports = Team;
