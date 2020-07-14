const mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    username: String,
    timestamp: Date,
    action: String,
    activity: String

});

module.exports = mongoose.model("logs", logSchema);

