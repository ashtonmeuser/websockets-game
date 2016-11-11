var Vector = require('./vector');
var constants = require('../data/constants');

// Constructor
function StaticRectangle(x, y, width, height, color) {
  this.position = new Vector(x, y);
  this.size = new Vector(width, height);
  this.color = color || constants.obstacleColor;
}

// Class methods
StaticRectangle.prototype.toState = function() {
  return {
    'color': this.color,
    'position': this.position,
    'size': this.size
  };
}

// Export class
module.exports = StaticRectangle;
