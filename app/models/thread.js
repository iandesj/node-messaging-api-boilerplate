/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = require('./messages').MessageSchema;

/**
 * Thread schema
 */

const ThreadSchema = new Schema({
  messages: { type: [MessageSchema], default: [] },
  organization: { type: String, default: 'organization' },
  createdBy: { type: String, default: 'creator' },
  createdAt: { type: Date, default: new Date() },
  meta: { type: Object, default: {} }
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

ThreadSchema.method({});

/**
 * Statics
 */

ThreadSchema.static({});

/**
 * Register
 */

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = { Thread, ThreadSchema };
