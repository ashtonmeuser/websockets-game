var constants = require('../data/constants');

// Constructor
function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

// Class methods
Color.prototype.string = function() {
  return 'rgb('+this.r+','+this.g+','+this.b+')';
}

// Export class
module.exports = Color;
