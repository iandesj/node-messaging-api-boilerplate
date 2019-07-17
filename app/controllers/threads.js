const mongoose = require('mongoose');
const Thread = mongoose.model('Thread');

/*!
 * Module dependencies.
 */


exports.create = function(req, res) {
    const thread = req.body;
    Thread.create(thread, (err, thread) => {
        res.send(thread);
    });
};

exports.index = function(req, res) {
    Thread.find({}, (err, threads) => {
        res.send(threads);
    });
};

exports.show = function(req, res) {
    const threadId = req.params.threadId;

    Thread.findById(mongoose.Types.ObjectId(threadId), (err, thread) => {
        if (err) {
            res.send({"message": "Could not find thread"});
        } else {
            res.send(thread);
        }
    });
}
