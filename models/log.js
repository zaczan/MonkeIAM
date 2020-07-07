const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: String,
    timestamp: {type: Date, default: Date.now()},
    action: String,
    activity: String

});

module.exports = mongoose.model("logs", logSchema);

