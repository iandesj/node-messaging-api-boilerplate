/**
 * socket.io middleware for authentication on connection to an event
 */
const firebaseAdmin = require('../lib/firebase').initializeFirebaseAdmin();

module.exports = {
  authentication: (socket, next) => {
    const firebaseIdToken = socket.handshake.query.firebaseIdToken;
    const messageThreadEvent = socket.handshake.query.messageThreadEvent;
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
