// Constructor
function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

// Instance methods
Color.prototype.string = function() {
  return 'rgb('+this.r+','+this.g+','+this.b+')';
}

// Class methods

// Export class
module.exports = Color;
