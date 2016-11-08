onload = function() {
  var canvas = document.getElementById('canvas');
  var socket = io();

  socket.on('state', function(state){
    // console.log('update state');
  });

  (function animate(){ // Recursive animation call
    requestAnimationFrame(animate);
  })();
};
