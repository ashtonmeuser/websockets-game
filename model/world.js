var Player = require('./player');
var Integrator = require('./integrator');
var Obstacle = require('./obstacle');
var Projectile = require('./projectile');
var Physics = require('physicsjs');

// Constructor
function World(game) {
  this.game = game;
  this.world = Physics();
  this.extensions();
  this.behaviors();
  this.integrators();
  this.subscribers();
}

// Instance methods
World.prototype.extensions = function() {
  Player.extension();
  Projectile.extension();
  Integrator.extension();
  Obstacle.extension();
};
World.prototype.behaviors = function() {
  this.world.add([
    Physics.behavior('body-impulse-response', {
      check: 'collisions:desired'
    }),
    Physics.behavior('body-collision-detection'),
    Physics.behavior('sweep-prune'),
    Physics.behavior('edge-collision-detection', {
      aabb: Physics.aabb(0, 0, 800, 450),
      restitution: 0.6,
      cof: 0.2
    })
  ]);
};
World.prototype.integrators = function() {
  this.world.add(Physics.integrator('verlet-custom'));
};
World.prototype.subscribers = function() {
  this.world.on('collisions:detected', function(data){
    for(var i=0; i<data.collisions.length; i++){
      var collision = data.collisions[i];
      if(collision.bodyA.name === 'projectile' && collision.bodyB.name === 'player' || collision.bodyA.name === 'player' && collision.bodyB.name === 'projectile'){
        var player = (collision.bodyA.name === 'player') ? collision.bodyA : collision.bodyB;
        var projectile = (collision.bodyA.name === 'projectile') ? collision.bodyA : collision.bodyB;

        if(projectile.active){
          if(!projectile.newborn || projectile.owner.shooter !== player.owner)
            player.owner.hit(projectile.owner);
        }else if(player.owner.alive && player.owner.ammo<player.owner.maxAmmo){
          data.collisions.splice(i, 1); // Do not record collision
          if(player.state.pos.dist(projectile.state.pos) < player.radius)
            this.game.ammoPickup(player.owner, projectile.owner);
        }
      }
    }
    this.world.emit('collisions:desired', data);
  }.bind(this));
};
World.prototype.add = function(object) {
  if(object.body !== undefined){
    this.world.add(object.body);
  }
};
World.prototype.step = function(object) {
  this.world.step();
};

// Class methods

// Export class
module.exports = World;
