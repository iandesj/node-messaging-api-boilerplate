/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Thread schema
 */

const MessageSchema = new Schema({
  content: { type: String, default: '' },
  createdBy: { type: String, default: 'creator' },
  createdAt: { type: Date, default: Date.now },
  readBy: { type: [String], default: [] }
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

MessageSchema.method({});

/**
 * Statics
 */

MessageSchema.static({});

/**
 * Register
 */

const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message, MessageSchema  };
