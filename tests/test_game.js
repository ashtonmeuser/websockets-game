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
    game.addPlayer('123');

    expect(game.players[0].id).to.eql('123');
  });

  it('should remove player', function(){
    var game = new Game();
    game.addPlayer('123');
    game.removeId('123');

    expect(game.players.length).to.eql(0);
  });

  it('should reset game', function(){
    var game = new Game();
    game.addPlayer('123');
    game.addPlayer('456');
    game.players[0].hit();

    expect(game.aliveTeams().length).to.eql(1);

    game.reset();

    expect(game.aliveTeams().length).to.eql(2);
  });

  it('should loop over players', function(){
    var game = new Game();
    game.addPlayer('123');
    game.addPlayer('456');

    var count = 0;
    game.players.forEach(function(player){
      count++;
    });

    expect(count).to.equal(2);
  });

  it('should return state', function(){
    var game = new Game();
    game.addPlayer('123');

    expect(game.state().players[0]).to.have.all.keys(['id', 'name', 'color', 'position', 'radius', 'ammo']);
    expect(game.state().obstacles.length).to.eql(game.obstacles.length);
    expect(game.state().projectiles.length).to.eql(game.projectiles.length);
  });
});
