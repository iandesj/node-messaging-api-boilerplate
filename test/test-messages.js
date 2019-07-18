'use strict';

/*
 * Module dependencies.
 */

var test = require('tape');
const before = test;
const after = test;

const request = require('supertest');
const { app } = require('../server');
const Thread = require('../app/models/thread').Thread;
const Message = require('../app/models/messages').Message;

const Fixtures = {};

// begin test hook configuration

test.onFinish(() => process.exit(0));

test = beforeEach(test, assert => {
  const testMessage = new Message({ content: 'Test Content' });
  const testThread = new Thread({
    organization: 'test_org',
    createdBy: 'test_creator',
    messages: [testMessage]
  });

  Thread.find({})
    .deleteMany()
    .then(() => {
      Thread.create(testThread)
        .then(thread => {
          console.log(thread);
          Fixtures.thread = thread;
        })
        .then(() => assert.end());
    });
});

test = afterEach(test, assert => {
  Thread.find({})
    .deleteMany()
    .then(() => assert.end());
});

before('Before all tests...', assert => {
  assert.end();
});

after('After all tests...', assert => {
  assert.end();
});

// end test hook configuration

test('Messages POST /api/messages', t => {
  request(app)
    .post('/api/messages')
    .send({
      threadId: Fixtures.thread._id.toString(),
      message: {
        content: 'Test Content'
      }
    })
    .expect(200)
    .expect(res => {
      t.equal(res.body.threadId, Fixtures.thread._id.toString());
      t.equal(true, !!res.body.messageId);
    })
    .end(t.end);
});

test('Messages POST /api/messages 400 Bad Request: Thread Not Found', t => {
  request(app)
    .post('/api/messages')
    .send({
      threadId: '54edb381a13ec9142b9bb353',
      message: {
        content: 'Test Content'
      }
    })
    .expect(400)
    .expect(res => {
      t.equal(res.body.message, 'Bad Request: Thread Not Found');
    })
    .end(t.end);
});

test('Messages GET /api/threads/:threadId/messages/:messageId', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    Fixtures.thread.messages[0]._id.toString();
  request(app)
    .get(url)
    .expect(200)
    .expect(res => {
      t.equal(res.body.message._id, Fixtures.thread.messages[0]._id.toString());
    })
    .end(t.end);
});

test('Messages GET /api/threads/:threadId/messages/:messageId 404 Not Found', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    '54edb381a13ec9142b9bb353';
  request(app)
    .get(url)
    .expect(404)
    .expect(res => {
      t.equal(res.body.message, 'Not Found');
    })
    .end(t.end);
});

test('Messages GET /api/threads/:threadId/messages/:messageId 400 Bad Request: Thread Not Found', t => {
  const url = '/api/threads/' + '54edb381a13ec9142b9bb353';
  '/messages/' + Fixtures.thread.messages[0]._id.toString();
  request(app)
    .get(url)
    .expect(400)
    .expect(res => {
      t.equal(res.body.message, 'Bad Request: Thread Not Found');
    })
    .end(t.end);
});

test('Messages PUT /api/threads/:threadId/messages/:messageId', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    Fixtures.thread.messages[0]._id.toString();
  request(app)
    .put(url)
    .send({
      threadId: Fixtures.thread._id.toString(),
      message: {
        readBy: ['test_user']
      }
    })
    .expect(200)
    .expect(res => {
      t.equal(
        JSON.stringify(res.body.messages[0].readBy),
        JSON.stringify(['test_user'])
      );
    })
    .end(t.end);
});

test('Messages PUT /api/threads/:threadId/messages/:messageId 400 Bad Request: Thread Not Found', t => {
  const url =
    '/api/threads/' +
    '54edb381a13ec9142b9bb353' +
    '/messages/' +
    Fixtures.thread.messages[0]._id.toString();
  request(app)
    .put(url)
    .send({
      threadId: Fixtures.thread._id.toString(),
      message: {
        readBy: ['test_user']
      }
    })
    .expect(400)
    .expect(res => {
      t.equal(res.body.message, 'Bad Request: Thread Not Found');
    })
    .end(t.end);
});

test('Messages PUT /api/threads/:threadId/messages/:messageId 404 Not Found', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    '54edb381a13ec9142b9bb353';
  request(app)
    .put(url)
    .send({
      threadId: Fixtures.thread._id.toString(),
      message: {
        readBy: ['test_user']
      }
    })
    .expect(404)
    .expect(res => {
      t.equal(res.body.message, 'Not Found');
    })
    .end(t.end);
});

test('Messages DELETE /api/threads/:threadId/messages/:messageId', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    Fixtures.thread.messages[0]._id.toString();
  request(app)
    .delete(url)
    .expect(200)
    .end(() => {
      request(app)
        .get(url)
        .expect(404)
        .end(t.end);
    });
});

test('Messages DELETE /api/threads/:threadId/messages/:messageId Message Does Not Exist And Succeeds', t => {
  const url =
    '/api/threads/' +
    Fixtures.thread._id.toString() +
    '/messages/' +
    '54edb381a13ec9142b9bb353';
  request(app)
    .delete(url)
    .expect(200)
    .end(t.end);
});

function beforeEach(test, handler) {
  return function tapish(name, listener) {
    test(name, function(assert) {
      var _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        listener(assert);
      };

      handler(assert);
    });
  };
}

function afterEach(test, handler) {
  return function tapish(name, listener) {
    test(name, function(assert) {
      var _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        handler(assert);
      };

      listener(assert);
    });
  };
}
