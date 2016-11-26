var Color = require('./color');
var Physics = require('physicsjs');

// Constructor
function Obstacle(x, y, width, height) {
  this.color = new Color(128, 128, 128);
  this.body = Physics.body('obstacle', {
    x: x,
    y: y,
    width: width,
    height: height,
    owner: this
  });
}

// Instance methods
Obstacle.prototype.toState = function() {
  return {
    color: this.color.string(),
    position: this.body.state.pos.values(),
    size: {x: this.body.width, y: this.body.height}
  };
};
Obstacle.prototype.delete = function() {
  this.body._world.remove(this.body);
};

// Class methods
Obstacle.extension = function() {
  Physics.body('obstacle', 'rectangle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          treatment: 'static',
          restitution: 0.6,
          cof: 0.2
        });
        parent.init.call(this, options);
      }
    }
  });
};

// Export class
module.exports = Obstacle;
