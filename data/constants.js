var Vector = require('../model/vector');
var Color = require('../model/color');

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
  'obstacleColor': new Color(128, 128, 128),
  // Teams
  'teamNames': ['red', 'blue'],
  'teamColors': [
    new Color(220, 70, 110),
    new Color(50, 180, 220)
  ],
  // Projectiles
  'projectileRadius': 10,
  'projectileRestitution': 0.6,
  'projectileFriction': 0.01,
  'projectileColor': new Color(200, 100, 100),
  'projectileSpeed': 20,
  // Misc.
  'minSpeed': 0.01
};

// Class methods

// Export class
module.exports = constants;
