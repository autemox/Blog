var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    admin: Boolean,
    email: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);  // takes PLM package and adds functionality from it to our Schema (ex: register())

module.exports = mongoose.model("User", UserSchema);