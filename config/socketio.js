/**
 * socket.io middleware for authentication on connection to an event
 */

module.exports = {
  authentication: (socket, next) => {
    // TODO: DO AUTH STUFF
    next();
  },
  connection: (socket) => {
    console.log('Socket.io connection started...');
    socket.emit('test-emit-snd', { connected: true });
    socket.on('test-event-rcv', function (data) {
      console.log(data);
    });
  }
};
