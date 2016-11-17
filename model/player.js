var Team = require('./team');
var Physics = require('physicsjs');

// Constructor
function Player(id, team, x, y) {
  this.id = id;
  this.team = team;
  this.team.addPlayer();
  this.name = this.team.nextName;
  this.ammo = 3;
  this.maxAmmo = 5;
  this.alive = true;
  this.body = Physics.body('player', {
    x: x,
    y: y,
    owner: this
  });
}

// Instance methods
Player.prototype.toState = function() {
  return {
    id: this.id,
    color: (this.alive) ? this.team.aliveColor.string() : this.team.deadColor.string(),
    name: this.name,
    type: this.body.type,
    radius: this.body.radius,
    position: this.body.state.pos.values()
  };
}
Player.prototype.delete = function() {
  this.team.removePlayer();
  this.body._world.remove(this.body);
}
Player.prototype.createBody = function() {
  this.team.removePlayer();
}

// Class methods
Player.extension = function() {
  Physics.body('player', 'circle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          radius: 20,
          restitution: 0.2,
          acceleration: 0.005,
          maxSpeed: 0.2,
          mass: 10
        });
        parent.init.call(this, options);
      }
    }
  });
}

// Export class
module.exports = Player;
