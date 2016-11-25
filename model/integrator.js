var Physics = require('physicsjs');

// Constructor
function Integrator() {}

// Instance methods

// Class methods
Integrator.extension = function() {
  Physics.integrator('verlet-custom', 'verlet', function(parent){
    return {
      init: function(options) {
        options.drag = 0.005;
        options.playerDrag = 0.1;
        parent.init.call(this, options);
      },
      integrateVelocities: function(bodies, dt) {
        parent.integrateVelocities.call(this, bodies, dt);
        for(var i=0; i<bodies.length; i++){
          var body = bodies[i];
          if(body.treatment !== 'static' && !body.sleep()){
            if(body.name === 'player'){
              body.state.angular.vel = 0;
              body.state.vel.mult(1-this.options.playerDrag/dt);
            }else if(body.name === 'projectile'){
              if(body.newborn && body.state.pos.dist(body.owner.shooter.body.state.pos)>body.owner.shooter.body.radius)
                body.newborn = false;
              body.active = (body.state.vel.norm()>body.killSpeed);
            }else{
              body.state.angular.vel *= 1-this.options.drag/dt;
            }
            if(body.maxSpeed && body.state.vel.norm() > body.maxSpeed)
              body.state.vel.normalize().mult(body.maxSpeed);
          }
        }
      }
    };
  });
};

// Export class
module.exports = Integrator;
