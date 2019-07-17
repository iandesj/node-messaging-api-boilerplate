const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const Thread = mongoose.model('Thread');

/*!
 * Module dependencies.
 */

exports.create = function(req, res) {
    const threadId = req.body.threadId;
    const message = new Message(req.body.message);
    Thread.findById(mongoose.Types.ObjectId(threadId), (err, thread) => {
        thread.messages.push(message);
        Thread.updateOne({ _id: mongoose.Types.ObjectId(threadId) },
            { messages: thread.messages }, (err, mongoRes) => {
                if (mongoRes.nModified) {
                    res.send({
                        threadId: thread._id.toString(),
                        messageId: message._id.toString(),
                    });
                } else {
                    res.send({"message": "Message Not Added to Thread."});
                }
            });
    });
};

exports.show = function(req, res) {
    const threadId = req.params.threadId;
    const messageId = req.params.messageId;

    Thread.findById(mongoose.Types.ObjectId(threadId), (err, thread) => {
        const threadMessage = thread.messages.id(mongoose.Types.ObjectId(messageId));
        if (threadMessage) {
            res.send(threadMessage);
        } else {
            res.send({"message": "Could not find message"});
        }
    });
};
