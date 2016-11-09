onload = function() {
  var canvas = document.getElementById('canvas');
  var socket = io();

  socket.on('state', function(state) {
    // console.log('update state');
  });

  // var game = new Game();

  (function animate(){ // Recursive animation call
    requestAnimationFrame(animate);
  })();
  date = Date.now();
  socket.emit('test', {});
  socket.on('test', function() {
    console.log('delay (2 way): ', Date.now()-date);
  })
};
