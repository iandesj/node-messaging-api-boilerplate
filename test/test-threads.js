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

test.onFinish(() => process.exit(0));

test = beforeEach(test, assert => {
  Thread.find({})
    .deleteMany()
    .then(() => assert.end());
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

test('Threads GET /api/threads', t => {
  request(app)
    .get('/api/threads')
    .expect(200)
    .expect(res => {
      t.equal(res.body.length, 0);
    })
    .end(t.end);
});

test('Threads POST /api/threads', t => {
  request(app)
    .post('/api/threads')
    .send({ organization: 'test_org' })
    .expect(200)
    .expect(res => {
      t.equal(res.body.organization, 'test_org');
    })
    .end(t.end);
});

test('Threads GET /api/threads/:threadId', t => {
  request(app)
    .post('/api/threads')
    .send({ organization: 'test_org' })
    .expect(200)
    .expect(res => {
      t.equal(res.body.organization, 'test_org');
    })
    .end((err, postRes) => {
      request(app)
        .get('/api/threads/' + postRes.body._id)
        .expect(200)
        .expect(getRes => {
          t.equal(getRes.body.organization, 'test_org');
          t.equal(getRes.body._id, postRes.body._id);
        })
        .end(t.end);
    });
});

test('Threads DELETE /api/threads/:threadId', t => {
  request(app)
    .post('/api/threads')
    .send({ organization: 'test_org' })
    .expect(200)
    .expect(res => {
      t.equal(res.body.organization, 'test_org');
    })
    .end((err, postRes) => {
      request(app)
        .delete('/api/threads/' + postRes.body._id)
        .expect(200)
        .end(() => {
          request(app)
            .get('/api/threads')
            .expect(200)
            .expect(res => {
              t.equal(res.body.length, 0);
            })
            .end(t.end);
        });
    });
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
