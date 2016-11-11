// Constructor
function Game() {
  this.updateState({
    'players': [],
    'obstacles': []
  })
};

// Class methods
Game.prototype.updateState = function(state) {
  this.state = state;
}
