var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    passWord: String,
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    }]
});

module.exports = mongoose.model("User", userSchema);
