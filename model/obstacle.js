var Color = require('./color');
var Physics = require('physicsjs');

// Constructor
function Obstacle(x, y) {
  this.color = new Color(128, 128, 128);
  this.body = Physics.body('obstacle-rectangle', {
    x: x,
    y: y
  });
}

// Instance methods
Obstacle.prototype.toState = function() {
  return {
    'color': this.color.string(),
    'position': {x: this.body.state.pos.x, y: this.body.state.pos.y},
    'size': {x: this.body.width, y: this.body.height}
  };
}

// Class methods
Obstacle.extension = function() {
  Physics.body('obstacle-rectangle', 'rectangle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          treatment: 'static',
          width: 200,
          height: 30,
          restitution: 0.6,
          restitution: 0.6,
          cof: 0.2
        });
        parent.init.call(this, options);
      }
    }
  });
}

// Export class
module.exports = Obstacle;
