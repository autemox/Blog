var express= require("express");                                                // always require express
var router=express.Router({ mergeParams: true});                                // create our router, this will be passsed back to app.js
var passport=require("passport");                                               // require if passport is used for these routes
var middleware=require("../middleware");
const util = require('util');

var Blog=require("../models/blog");

// ROUTES blogs
router.get("/", function(req, res){              
                                                                                // BLOG LIST
    console.log("test");
    Blog.find({}, function(err, blogs){
        if(err) {
           req.flash("danger", err.message); 
           res.render("blog/index");
        }
        else {
            // display a list of several blogs
            res.render("blog/index", { blogs: blogs, page: "list" });
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {               
                                                                                // NEW BLOG FORM
    res.render("blog/new");
});

router.post("/", middleware.isLoggedIn, function(req, res) {                  
                                                                                // CREATE BLOG ACTION
    console.log("attempting to create blog: "+util.inspect(req.body.blog, {depth: null}));
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){ 
        if(err) {
           req.flash("danger", err.message); 
           res.redirect("/");
        }
        else {
           req.flash("success", "Successfully created a new blog page."); 
           res.redirect("/blog");
        }
    });
});
router.get("/:id/edit", middleware.isLoggedIn, function(req,res){                                
                                                                                // EDIT BLOG FORM
    Blog.findById(req.params.id, function(err, blog){
        if(err) {
           req.flash("danger", err.message); 
           res.redirect("/");
        }
        else {
            res.render("blog/edit", {blog: blog });
        }
    });
});

router.post("/:id", middleware.isLoggedIn, function(req, res) {                               
                                                                                // EDIT BLOG ACTION
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err) {
            req.flash("danger", err.message); 
            res.redirect("/"+req.params.id+"/edit");
        }
        else {
            req.flash("success", "You have sucessfully modified a blog page."); 
            res.redirect("/"+req.params.id);
        }
    });
});

router.get("/:id/delete", middleware.isLoggedIn, function(req, res) {                                 
                                                                                // DELETE BLOG ACTION
    console.log("attempting to delete: "+req.params.id);
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
        if(err) {
            req.flash("danger", err.message); 
            res.redirect("/"+req.params.id+"/");
        }
        else {
           req.flash("warning", "You have successfully deleted a blog page."); 
           res.redirect("/");
        }
    });
});

router.get("/:url", function(req,res){                                
                                                                                // SHOW BLOG PAGE
    Blog.find({ url: req.params.url }, function(err, blogs) {                   // by url
       if(err || blogs.length==0)           
       {
            Blog.find( { _id: req.params.url }, function(err, blogs) {          // by id
                if(err) {
                    req.flash("danger", err.message); 
                    res.redirect("/blog");
                }
                else {
                    // found by ID
                    res.render("blog/index", { blogs: blogs, page: "show" });
                }
            });
       }
       else {
           // found by URL
           res.render("blog/index", { blogs: blogs, page: "show" });
       }
    });
});

module.exports=router;