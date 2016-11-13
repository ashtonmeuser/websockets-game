// Constructor
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// Class methods
Vector.prototype.add = function(vector) {
  if(vector instanceof Vector) {
    this.x += vector.x;
    this.y += vector.y;
  } else {
    this.x += vector;
    this.y += vector;
  }
  return this;
};
Vector.prototype.subtract = function(vector) {
  if(vector instanceof Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  } else {
    this.x -= vector;
    this.y -= vector;
  }
  return this;
};
Vector.prototype.multiply = function(vector) {
  if(vector instanceof Vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  } else {
    this.x *= vector;
    this.y *= vector;
  }
  return this;
};
Vector.prototype.divide = function(vector) {
  if(vector instanceof Vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  } else {
    this.x /= vector;
    this.y /= vector;
  }
  return this;
};
Vector.prototype.upperLimit = function(vector) {
  if(vector instanceof Vector) {
    this.x = Math.min(this.x, vector.x);
    this.y = Math.min(this.y, vector.y);
  } else {
    this.x = Math.min(this.x, vector);
    this.y = Math.min(this.y, vector);
  }
  return this;
};
Vector.prototype.lowerLimit = function(vector) {
  if(vector instanceof Vector) {
    this.x = Math.max(this.x, vector.x);
    this.y = Math.max(this.y, vector.y);
  } else {
    this.x = Math.max(this.x, vector);
    this.y = Math.max(this.y, vector);
  }
  return this;
};
Vector.prototype.magnitude = function() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};
Vector.prototype.normal = function() {
  return this.divide(this.magnitude());
};
Vector.prototype.dot = function(vector) {
  return this.x * vector.x + this.y * vector.y;
};
Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
};

// Export class
module.exports = Vector;
