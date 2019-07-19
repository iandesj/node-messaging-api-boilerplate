const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config');

let connection;
let OnSiteBidUser;
module.exports = {
  initializeOnSiteBidConnection: () => {
    const mongoUrl = config.onSiteBid.mongoUrl;
    connection = mongoose.createConnection(mongoUrl, { useNewUrlParser: true });

    OnSiteBidUser = connection.model(
      'users',
      new mongoose.Schema({
        _id: String,
        createdAt: Date,
        services: {
          password: {
            bcrypt: String
          }
        },
        emails: [
          {
            address: String,
            verified: Boolean
          }
        ],
        profile: {
          firstName: String,
          lastName: String,
          organization: String
        },
        roles: [
          {
            _id: String,
            partition: String,
            assigned: Boolean
          }
        ]
      })
    );
  },
  authenticateOnSiteBidUser: async (email, password) => {
    if (email && password) {
      let onsiteBidUser = await OnSiteBidUser.findOne({
        'emails.address': email
      });
      const userServices =
        onsiteBidUser && onsiteBidUser.services ? onsiteBidUser.services : null;
      const passwordFromDb =
        userServices && userServices.password && userServices.password.bcrypt
          ? userServices.password.bcrypt
          : null;

      if (passwordFromDb) {
        const hashedPasswordFromRequest = crypto
          .createHash('sha256')
          .update(password)
          .digest('hex');
        const requestPasswordMatchesDbPassword = await bcrypt.compare(
          hashedPasswordFromRequest,
          passwordFromDb
        );

        if (requestPasswordMatchesDbPassword) {
          return onsiteBidUser;
        }
      }
    }

    throw new Error(
      'Authentication Error: Could not authenticate On-site Bid user'
    );
  }
};
