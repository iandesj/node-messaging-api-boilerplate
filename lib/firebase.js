/**
 * Firebase module for use to verify auth token id
 */

const firebaseAdmin = require('firebase-admin');
const config = require('../config');

module.exports = {
  initializeQuoteAppFirebaseAdmin: () => {
    const quoteAppFirebaseConfig = {
        credential: firebaseAdmin.credential.cert(config.firebase.serviceAccount),
        databaseURL: config.firebase.url,
    };

    return firebaseAdmin.initializeApp(quoteAppFirebaseConfig, 'quote');
  },
};
