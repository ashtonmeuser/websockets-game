

// Constructor
function GameView(game, canvas, page) {
  this.game = game;
  this.canvas = canvas;
  this.page = page;
  this.gameTransparency = 0.1;
  this.context = this.canvas.getContext('2d');
  this.scale = 1;
  // this.allAvatarAvailable = Array.apply(null, Array(constants.avatar.length)).map(Number.prototype.valueOf,1);
  this.allAvatarAvailable = [];
  for(var i=0; i<constants.avatar.length; i++) this.allAvatarAvailable.push(1);
  this.avatarAvailable = this.allAvatarAvailable.slice();
}

// Class methods
GameView.prototype.update = function() {

  var position = {x: 0, y:0};
  if(!this.bounds) return;
  this.clear();
  this.drawPlayers();
  this.drawProjectiles();
  this.drawObstacles();
  switch(this.game.state.phase) {
    case 'join':
//      this.drawTextScreen(0.6);
//      this.drawLabel({x:this.bounds.x/2, y:200}, 'Select character and click join', 'black');
        // Backfill
          this.context.fillStyle = 'rgba('+256+','+256+','+256+','+.6+')';
          this.context.fillRect(0,0,800,450);
          this.context.fillStyle = 'rgba('+100+','+200+','+250+','+.6+')';
          this.context.fillRect(0,0,800,450);

          // Text, Avatars and Buttons
          for (var i = 0; i < constants.button.length; i++){
            this.drawImage(constants.button[i], {x: this.bounds.x/2+constants.buttonPos[i].x-constants.buttonSize[i].w/2, y: this.bounds.y/2+constants.buttonPos[i].y-constants.buttonSize[i].h/2}, constants.buttonSize[i], false);
          }
          for (var i = 0; i < constants.textJoin.length; i++){
            this.drawLabel(constants.textJoinPos[i], constants.textJoin[i], constants.textJoinColor[i], '', constants.textJoinSize[i])
          }
          this.drawAvatars(this.avatarSelection);
      break;
    case 'queue':
      this.drawTextScreen(0.6);
      var message = (this.game.state.nextGame < 0) ? 'Waiting for players' : 'Game starts in '+this.game.state.nextGame+'s';
      this.drawLabel({x:0, y:-50}, 'Queue', 'black');
      this.drawLabel({x:0, y:50}, message, 'black');
      break;
    case 'play':
      this.drawHud(0.5, this.game.state.ammo, this.game.state.nextPhase);
      break;
    case 'results':
      this.drawTextScreen(0.6);
      this.drawLabel({x:0, y:-50}, 'Results', 'black');
      this.drawLabel({x:0, y:50}, 'Game starts in '+this.game.state.nextGame+'s', 'black');
      break;
  }
};
GameView.prototype.clear = function() {
  this.context.clearRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawPlayers = function() {
  this.game.state.players.forEach(function(player) {
    this.context.fillStyle = player.color;
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.drawAvatar(player.position, player.avatar);
  }.bind(this));
};
GameView.prototype.drawProjectiles = function() {
  this.game.state.projectiles.forEach(function(projectile) {
    this.context.fillStyle = projectile.color;
    this.context.beginPath();
    this.context.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }.bind(this));
};
GameView.prototype.drawHud = function(alpha, ammo, timeout) {
  this.context.fillStyle = 'rgba(200, 130, 0, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 20, 10, 0, 2 * Math.PI);
  this.context.closePath();
  this.context.fill();
  this.context.fillStyle = 'rgba(128, 128, 128, '+alpha+')';
  this.context.beginPath();
  this.context.arc(20, 45, 10, 0, 2 * Math.PI);
  this.context.closePath();
  this.context.fill();
  this.context.strokeStyle = 'rgba(255, 255, 255, '+alpha+')';
  this.context.lineWidth = 3;
  this.context.beginPath();
  this.context.moveTo(20, 35);
  this.context.lineTo(20, 45);
  this.context.lineTo(27.01, 52.07);
  this.context.stroke();
  this.context.closePath();
  this.drawLabel({x:-365, y:-205}, ammo, 'rgba(0, 0, 0, '+alpha+')', 'left', 20);
  this.drawLabel({x:-365, y:-180}, timeout, 'rgba(0, 0, 0, '+alpha+')', 'left', 20);
};
GameView.prototype.drawTextScreen = function(alpha) {
  this.context.fillStyle = 'rgba(255, 255, 255, '+alpha+')';
  this.context.fillRect(0, 0, this.bounds.x, this.bounds.y);
};
GameView.prototype.drawObstacles = function() {
  this.game.state.obstacles.forEach(function(obstacle) {
    this.context.fillStyle = obstacle.color;
    this.context.fillRect(obstacle.position.x-obstacle.size.x/2, obstacle.position.y-obstacle.size.y/2, obstacle.size.x, obstacle.size.y);
  }.bind(this));
};
GameView.prototype.drawAvatar = function(position, avatar) {
  var shift = constants.avatarSize.h/2;
  var pos = {x: 0, y: 0};
  pos.x = position.x - shift;
  pos.y = position.y - shift;
  this.drawImage(constants.avatar[avatar], pos, constants.avatarSize, true);
}
GameView.prototype.pageChangeGame = function(){
  this.page = 'Game';
}
GameView.prototype.drawImage = function(source, position, size, round){

  var imgObject = new Image();

  imgObject.src = '/images/'+source;
  // if (round){
  //   this.context.save();
  //   this.context.beginPath();
  //   this.context.arc(position.x+size.w/2, position.y+size.h/2, size.h/2, 0, 2*Math.PI, false);
  //   this.context.closePath();
  //   this.context.clip();
  //   this.context.drawImage(imgObject, position.x, position.y, size.w, size.h);
  //   this.context.restore();
  // } else{
    this.context.drawImage(imgObject, position.x, position.y, size.w, size.h);
  // }
}
GameView.prototype.drawLabel = function(position, text, color, align, size) {
  this.context.fillStyle = color || 'white';
  this.context.textAlign = align || 'center';
  this.context.textBaseline = 'middle';
  this.context.font = 'bold '+(size || 25)+'px Arial';
  this.context.fillText(text, this.bounds.x/2 + position.x, this.bounds.y/2 + position.y);
}
GameView.prototype.avatarSelect = function(selection){
  this.avatarSelection = selection;
}
GameView.prototype.drawAvatars = function(selectedIndex){
  var rows = Math.ceil(constants.avatar.length/constants.avatarColumns);
  for (var i = 0; i<constants.avatar.length; i++){
    if(constants.avatar[i] === undefined) continue;
    var position = {x: this.bounds.x/2+constants.avatarPos.x+(i%constants.avatarColumns-constants.avatarColumns/2)*constants.avatarSpacing, y:this.bounds.y/2+constants.avatarPos.y+Math.floor(i/constants.avatarColumns)*constants.avatarSpacing}
    if(this.avatarSelection===i){
        this.context.fillStyle = 'rgba('+256+','+256+','+256+','+1+')';
        this.context.beginPath();
        this.context.arc(position.x+constants.avatarSize.w/2, position.y+constants.avatarSize.h/2, constants.avatarSize.h/2 + 4, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }
    this.drawImage(constants.avatar[i], position, constants.avatarSize, true);
    if (!this.avatarAvailable[i]){
      this.context.globalAlpha = 0.8;
      this.drawImage('notAvailable.png', position, constants.avatarSize, true);
      this.context.globalAlpha = 1;
    }
  }
}

GameView.prototype.populateAvatars = function(){
  this.avatarAvailable.length = 0;
  for(var i=0; i<constants.avatar.length; i++) this.avatarAvailable.push(1);
  this.game.state.players.forEach(function(player) {
    this.avatarAvailable[player.avatar] = 0;
  }.bind(this));
  if (this.avatarAvailable[this.avatarSelection] == 0){
    this.avatarSelection = undefined;
  }
}
