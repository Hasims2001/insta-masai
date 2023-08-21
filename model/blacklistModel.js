const mongoose = require("mongoose");


const blacklistSchema = mongoose.Schema({
    token: String
})

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { blacklistModel }