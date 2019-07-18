const mongoose = require('mongoose');

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
            thread.messages.push(message);
            return thread.save();
        })
        .then(thread => {
            res.send({
                threadId: thread._id.toString(),
                messageId: message._id.toString(),
            });
        })
};

exports.getOne = function(req, res) {
    const threadId = req.params.threadId;
    const messageId = req.params.messageId;

    Thread.findById(mongoose.Types.ObjectId(threadId))
        .then(thread => {
            const threadMessage = thread.messages.id(mongoose.Types.ObjectId(messageId));
            res.send(threadMessage);
        });
};

exports.update = function(req, res) {
    const threadId = req.params.threadId;
    const messageId = req.params.messageId;
    const message = req.body;

    Thread.findById(mongoose.Types.ObjectId(threadId))
        .then(thread => {
            const threadMessage = thread.messages.id(mongoose.Types.ObjectId(messageId));
            threadMessage.readBy = message.readBy;

            return thread.save();
        })
        .then(thread => {
            res.send(thread.messages);
        });
};
