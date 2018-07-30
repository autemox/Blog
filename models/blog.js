var mongoose = require("mongoose");

var blogSchema=new mongoose.Schema({
    title: String,
    url: String,
    image: String,
    body: {type: String, default: "This page has not yet been created."},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", blogSchema);
