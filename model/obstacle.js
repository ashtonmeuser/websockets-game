var Vector = require('./vector');
var constants = require('../data/constants');

// Constructor
function Obstacle(x, y, width, height, color) {
  this.position = new Vector(x, y);
  this.size = new Vector(width, height);
  this.color = constants.obstacleColor;
}

// Class methods
Obstacle.prototype.toState = function() {
  return {
    'color': this.color.string(),
    'position': this.position,
    'size': this.size
  };
}

// Export class
module.exports = Obstacle;
