/**
 * socket.io middleware for authentication on connection to an event
 */
const config = require('../config');

let io;

module.exports = {
  init: server => {
    io = require('socket.io')(server);
    return io;
  },
  getio: () => {
    const ioIsNotInitiated = !io;
    if (ioIsNotInitiated) {
      throw new Error('must call .init(server) before you can call getio()');
    }
    return io;
  },
  authentication: (socket, next) => {
    const messageThreadEvent = socket.handshake.query.messageThreadEvent;

    if (config.firebase) {
      const firebaseAdmin = require('../lib/firebase').initializeFirebaseAdmin();
      const firebaseIdToken = socket.handshake.query.firebaseIdToken;

      if (firebaseIdToken && messageThreadEvent) {
        firebaseAdmin
          .auth()
          .verifyIdToken(firebaseIdToken)
          .then(decodedToken => {
            console.log('decodedToken', decodedToken);
            next();
          })
          .catch(error => {
            console.log(error);
            next(new Error('Authentication error'));
          });
      }
    } else if (messageThreadEvent) {
      next();
    } else {
      // add block to check if request came from another application
      next(new Error('Authentication error'));
    }
  },
  connection: socket => {
    console.log('Socket.io connection started...');
    const messageThreadEvent = socket.handshake.query.messageThreadEvent;
    socket.emit(`${messageThreadEvent}-connected`, { connected: true });
    socket.on(messageThreadEvent, function(data) {
      console.log(data);
    });
  }
};
