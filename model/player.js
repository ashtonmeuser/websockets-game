var Team = require('./team');
var Physics = require('physicsjs');

// Constructor
function Player(id, team, x, y) {
  this.id = id;
  this.team = team;
  this.team.addPlayer();
  this.name = this.team.nextName;
  this.color = this.team.color;
  this.body = Physics.body('player', {
    x: x,
    y: y
  });
}

// Instance methods
Player.prototype.toState = function() {
  return {
    id: this.id,
    color: this.color.string(),
    name: this.name,
    type: this.body.type,
    radius: this.body.radius,
    position: {x: this.body.state.pos.x, y: this.body.state.pos.y}
  };
}
Player.prototype.delete = function() {
  this.team.removePlayer();
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
          restitution: 0.4,
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
