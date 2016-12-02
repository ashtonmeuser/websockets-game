var Team = require('./team');
var Projectile = require('./projectile');
var Random = require('./random');
var Physics = require('physicsjs');

// Constructor
function Player(id, avatar) {
  this.id = id;
  this.ammo = 3;
  this.maxAmmo = 5;
  this.acceleration = 0.005;
  this.alive = true;
  this.body = Physics.body('player', {
    owner: this
  });
  this.avatar = avatar;
}

// Instance methods
Player.prototype.toState = function() {
  return {
    id: this.id,
    ammo: this.ammo,
    color: (this.alive) ? this.team.aliveColor.string() : this.team.deadColor.string(),
    name: this.name,
    radius: this.body.radius,
    position: this.body.state.pos.values(),
    avatar: this.avatar
  };
};
Player.prototype.assignTeam = function(team) {
  this.team = team;
  this.team.addPlayer();
  this.name = this.team.nextName;
  this.body.state.pos.x = this.team.coordinates.x + Random.rangedRandomFloat(-40, 40);
  this.body.state.pos.y = this.team.coordinates.y + Random.rangedRandomFloat(-40, 40);
  this.body.sleep(false);
};
Player.prototype.delete = function() {
  if(this.team) this.team.removePlayer();
  if(this.body._world) this.body._world.remove(this.body);
};
Player.prototype.shootProjectile = function(x, y) {
  if(this.ammo>0 && this.alive){
    this.ammo--;
    var projectile = new Projectile(this);
    projectile.accelerate(x, y);
    return projectile;
  }
};
Player.prototype.accelerate = function(x, y) {
  if(this.alive){
    this.body.applyForce(Physics.vector(x, y).clamp(Physics.vector(-1, -1), Physics.vector(1, 1)).mult(this.acceleration*this.body.mass));
    this.body.sleep(false);
  }
};
Player.prototype.hit = function(projectile) {
  if(this.alive){
    this.alive = false;
    this.team.removePlayer();
  }
};
Player.prototype.ammoPickup = function(projectile) {
  this.ammo++;
  projectile.delete();
};

// Class methods
Player.extension = function() {
  Physics.body('player', 'circle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          radius: 20,
          restitution: 0.2,
          maxSpeed: 0.2,
          mass: 10
        });
        parent.init.call(this, options);
      }
    }
  });
};

// Export class
module.exports = Player;
