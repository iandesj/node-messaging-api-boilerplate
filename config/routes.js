'use strict';

/**
 * Module dependencies.
 */

const threads = require('../app/controllers/threads');
const messages = require('../app/controllers/messages');

/**
 * Expose
 */

module.exports = function(app) {
  app.get('/api/threads', threads.getAll);
  app.post('/api/threads', threads.create);
  app.get('/api/threads/:threadId',threads.getOne);

  app.post('/api/messages', messages.create);
  app.get('/api/threads/:threadId/messages/:messageId', messages.getOne);
  app.put('/api/threads/:threadId/messages/:messageId', messages.update);
  app.delete('/api/threads/:threadId/messages/:messageId', messages.delete);
  /**
   * Error handling
   */

  app.use(function(err, req, res, next) {
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500);
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404);
  });
};
