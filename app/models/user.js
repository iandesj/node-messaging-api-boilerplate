/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({});

/**
 * Statics
 */

UserSchema.static({});

/**
 * Register
 */

const User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };
