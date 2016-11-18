var expect = require('chai').expect;
var Game = require('../controller/game');
var Player = require('../model/player');
var Obstacle = require('../model/obstacle');

describe('game', function(){
  it('should be initialized', function(){
    expect(new Game()).to.exist;
  });

  it('should add players', function(){
    var game = new Game();
    game.addTeams(1);
    game.addPlayer('123');

    expect(game.players['123']).to.exist;
  });

  it('should remove player', function(){
    var game = new Game();
    game.addTeams(1);
    game.addPlayer('123');
    game.removePlayer('123');

    expect(game.players['123']).to.not.exist;
  });

  it('should reset game', function(){
    var game = new Game();
    game.addTeams(1);
    game.addPlayer('123');
    game.reset();

    expect(game.players).to.be.empty;
  });

  it('should loop over players', function(){
    var game = new Game();
    game.addTeams(1);
    game.addPlayer('123');
    game.addPlayer('456');

    var count = 0;
    game.forEachPlayer(function(player){
      count++;
    });

    expect(count).to.equal(2);
  });

  it('should return state', function(){
    var game = new Game();
    game.addPlayer('123');

    expect(game.state().players[0]).to.have.all.keys(['id', 'name', 'color', 'position', 'radius', 'type']);
    expect(game.state().obstacles.length).to.eql(game.obstacles.length);
    expect(game.state().projectiles.length).to.eql(game.projectiles.length);
  });

  it('should tick', function(){
    var game = new Game();

    expect(game.tick).to.exist; // TODO: Write actual test when tick() has functionality
  });
});
