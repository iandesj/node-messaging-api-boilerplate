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
  createdAt: { type: Date, default: new Date() },
  readBy: { type: [String], default: [] }
});

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

mongoose.model('Message', MessageSchema);
mongoose.model('Thread', ThreadSchema);
