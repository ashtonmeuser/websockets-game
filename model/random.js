// Constructor
function Random() {}

// Instance methods

// Class methods
Random.randomBool = function() {
  return Math.random() > 0.5;
};
Random.rangedRandomFloat = function(min, max) {
  return (Math.random()*(max-min)+min)|0;
};
Random.rangedRandomInt = function(min, max) {
  return Math.floor(Math.random()*(max+1-min)+min)|0;
};

// Export class
module.exports = Random;
