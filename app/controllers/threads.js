const mongoose = require('mongoose');
const Thread = mongoose.model('Thread');

/*!
 * Module dependencies.
 */


exports.create = function(req, res) {
    const newThread = req.body;
    Thread.create(newThread)
        .then(thread => {
            res.send(thread);
        });
};

exports.getAll = function(req, res) {
    Thread.find({})
        .then(threads => {
            res.send(threads);
        });
};

exports.getOne = function(req, res) {
    const threadId = req.params.threadId;

    Thread.findById(mongoose.Types.ObjectId(threadId))
        .then(thread => {
            if (thread) {
                thread.messages.sort((a, b) => {
                    new Date(a.createdAt) > new Date(b.createdAt)
                });

                res.send(thread);
            }
            else res.status(404).send({message: 'Not Found'});
        });
};

exports.delete = function(req, res) {
    const threadId = req.params.threadId;

    Thread.deleteOne({ _id: mongoose.Types.ObjectId(threadId) })
        .then(thread => {
            res.send({message: "Thread removed"});
        });
};
