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
    const query = socket.handshake.query;
    const auth = query.auth
      ? query.auth
          .split(',')
          .map(param => {
            return param.split('=');
          })
          .reduce((acc, cv) => {
            return {
              ...acc,
              [cv[0]]: cv[1]
            };
          }, {})
      : {};

    // begin onsitebid specific block
    // if onsitebid config is present, this code block will execute
    if (config.onSiteBid && auth.email && auth.password) {
      const authenticateOnSiteBidUser = require('../lib/onsitebid')
        .authenticateOnSiteBidUser;

      authenticateOnSiteBidUser(auth.email, auth.password)
        .then(user => {
          console.info('On-site Bid User Authenticated...', user._id);
          // DO STUFF HERE
          next();
        })
        .catch(error => {
          console.error('error', error);
          next(new Error(error));
        });
    }

    // begin firebase specific block
    // if a firebase config is present, this code block will execute
    if (config.firebase && auth.firebaseIdToken) {
      const firebaseAdmin = require('../lib/firebase').initializeFirebaseAdmin();
      const firebaseIdToken = auth.firebaseIdToken;

      // stubbed out firebase verification block
      if (firebaseIdToken && query.messageThreadEvent) {
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
        // end firebase specific block
      } else if (query.messageThreadEvent) {
        // This block has NO auth, remove in production or any public facing environments
        next();
      } else {
        // add block to check if request came from another application
        next(new Error('Authentication error'));
      }
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
