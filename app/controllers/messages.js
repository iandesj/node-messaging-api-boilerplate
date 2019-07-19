const mongoose = require('mongoose');

const io = require('../../config/socketio').getio();

const Message = mongoose.model('Message');
const Thread = mongoose.model('Thread');

/*!
 * Module dependencies.
 */

exports.create = function(req, res) {
  const threadId = req.body.threadId;
  const message = new Message(req.body.message);
  Thread.findById(mongoose.Types.ObjectId(threadId))
    .then(thread => {
      if (thread) {
        thread.messages.push(message);
        return thread.save();
      } else {
        res.status(400).send({ message: 'Bad Request: Thread Not Found' });
      }
    })
    .then(thread => {
      if (thread) {
        io.emit(threadId, message);
        res.send({
          threadId: thread._id.toString(),
          messageId: message._id.toString()
        });
      }
    });
};

exports.getOne = function(req, res) {
  const threadId = req.params.threadId;
  const messageId = req.params.messageId;

  Thread.findById(mongoose.Types.ObjectId(threadId)).then(thread => {
    if (thread) {
      const threadMessage = thread.messages.id(
        mongoose.Types.ObjectId(messageId)
      );
      if (threadMessage) res.send(threadMessage);
      else res.status(404).send({ message: 'Not Found' });
    } else {
      res.status(400).send({ message: 'Bad Request: Thread Not Found' });
    }
  });
};

exports.update = function(req, res) {
  const threadId = req.params.threadId;
  const messageId = req.params.messageId;
  const message = req.body;

  Thread.findById(mongoose.Types.ObjectId(threadId))
    .then(thread => {
      if (thread) {
        const threadMessage = thread.messages.id(
          mongoose.Types.ObjectId(messageId)
        );

        if (threadMessage) {
          threadMessage.readBy = message.readBy;
          return thread.save();
        } else {
          res.status(404).send({ message: 'Not Found' });
        }
      } else {
        res.status(400).send({ message: 'Bad Request: Thread Not Found' });
      }
    })
    .then(thread => {
      if (thread) {
        thread.messages.sort((a, b) => {
          new Date(a.createdAt) > new Date(b.createdAt);
        });
        res.send(thread.messages);
      }
    });
};

exports.delete = function(req, res) {
  const threadId = req.params.threadId;
  const messageId = req.params.messageId;

  Thread.findById(mongoose.Types.ObjectId(threadId))
    .then(thread => {
      const threadMessage = thread.messages.id(
        mongoose.Types.ObjectId(messageId)
      );
      if (threadMessage) {
        threadMessage.remove();
        return thread.save();
      }
    })
    .then(() => {
      res.status(200).send();
    });
};
