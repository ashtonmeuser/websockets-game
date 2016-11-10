var Vector = require('../model/vector');

// Constructor
const constants = {
  'bounds': new Vector(800, 450),
  'playerAcceleration': 0.75,
  'maxPlayerSpeed': 4,
  'playerFriction': 0.1,
  'minSpeed': 0.01,
  'playerRadius': 20
};

// Class methods

// Export class
module.exports = constants;
