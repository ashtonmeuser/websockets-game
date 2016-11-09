// Constructor
function Game() {
  this.updateState({
    'players': []
  })
};

// Class methods
Game.prototype.updateState = function(state) {
  this.state = state;
}
