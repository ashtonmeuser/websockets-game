var Vector = require('../model/vector');

// Constructor
const constants = {
  // Canvas
  'bounds': new Vector(800, 450),
  // Player
  'playerAcceleration': 0.75,
  'maxPlayerSpeed': 3,
  'playerFriction': 0.1,
  'playerRadius': 20,
  // Obstacles
  'obstacleCount': 2,
  'obstacleColor': 'grey',
  // Teams
  'teamNames': ['red', 'blue'],
  'teamColors': [
    {'r': 220, 'g': 70, 'b': 110},
    {'r': 50, 'g': 180, 'b': 220}
  ],
  // Misc.
  'minSpeed': 0.01
};

// Class methods

// Export class
module.exports = constants;
