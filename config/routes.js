'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const threads = require('../app/controllers/threads');
const messages = require('../app/controllers/messages');

/**
 * Expose
 */

module.exports = function(app) {
  app.get('/', home.index);
  app.get('/api/threads', threads.index);
  app.post('/api/threads', threads.create);
  app.get('/api/threads/:threadId',threads.show);

  app.post('/api/messages', messages.create);
  app.get('/api/threads/:threadId/messages/:messageId', messages.show);
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
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
