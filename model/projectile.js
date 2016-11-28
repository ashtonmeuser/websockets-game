var Color = require('./color');
var Physics = require('physicsjs');

// Constructor
function Projectile(player, x, y) {
  this.activeColor = new Color(200, 130, 0);
  this.deactiveColor = new Color(128, 128, 128);
  this.shooter = player;
  this.body = Physics.body('projectile', {
    x: x || player.body.state.pos.x,
    y: y || player.body.state.pos.y,
    owner: this
  });
  this.body.sleep(false);
}

// Instance methods
Projectile.prototype.accelerate = function(x, y) {
  this.body.accelerate(Physics.vector(x, y).vsub(this.body.state.pos).normalize().mult(1));
  this.body.sleep(false);
};
Projectile.prototype.delete = function() {
  this.body._world.remove(this.body);
};
Projectile.prototype.toState = function() {
  return {
    color: (this.body.active) ? this.activeColor.string() : this.deactiveColor.string(),
    radius: this.body.radius,
    position: this.body.state.pos.values()
  };
};

// Class methods
Projectile.extension = function() {
  Physics.body('projectile', 'circle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          radius: 10,
          restitution: 0.8,
          maxSpeed: 1.0,
          active: false,
          killSpeed: 0.3,
          newborn: true
        });
        parent.init.call(this, options);
      }
    }
  });
};

// Export class
module.exports = Projectile;
