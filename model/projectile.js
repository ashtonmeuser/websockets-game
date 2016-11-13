var Vector = require('./vector');
var constants = require('../data/constants');

// Constructor
function Projectile() {
  this.color = constants.projectileColor;
  this.radius = constants.projectileRadius;
  this.position = new Vector();
  this.velocity = new Vector();
}

// Class methods
Projectile.prototype.toState = function() {
  return {
    'color': this.color.string(),
    'radius': this.radius,
    'position': this.position
  };
}

// Export class
module.exports = Projectile;
