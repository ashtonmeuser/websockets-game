var Vector = require('./vector');
var constants = require('../data/constants');

// Constructor
function Player(id) {
  this.id = id;
  this.radius = constants.playerRadius;
  this.position = new Vector();
  this.velocity = new Vector();
}

// Class methods
Player.prototype.toState = function() {
  return {
    'id': this.id,
    'radius': this.radius,
    'position': this.position
  };
}

// Export class
module.exports = Player;
