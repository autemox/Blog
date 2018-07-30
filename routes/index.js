var express= require("express");                                                // always require express
var router=express.Router({ mergeParams: true});                                // create our router, this will be passsed back to app.js
var passport=require("passport");                                               // require if passport is used for these routes
var middleware=require("../middleware");

var User=require("../models/user");
var Blog=require("../models/blog");

// ROUTES index
router.get("/", function(req, res) {                      
                                                                                // HOME
    res.render("index");
});

router.get("/register", function(req, res){
                                                                                // NEW USER FORM
   res.render("register");                               
});

router.post("/register", function(req, res){
                                                                                // CREATE USER ACTION
    console.log("attempting to create user");
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        admin: false
    }), req.body.password, function(err, user){
        if(err) {
           req.flash("danger", err.message); 
           res.redirect("/");
        }
        else passport.authenticate("local")(req, res, function() {
            req.flash("success", "You have been registered and logged in successfully."); 
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
                                                                                // LOGIN FORM
   res.render("login");                                 
});

router.get("/logout", function(req, res){
                                                                                // LOGOUT USER ACTION
   req.logout();      
   req.flash("info", "You have been logged out.");    
   res.redirect("/");
});

router.post("/login", passport.authenticate("local", { 
                                                                                // LOGIN ACTION
    successRedirect: "/login/success", 
    failureRedirect: "/login/failure" 
}), function(req, res) {
});
router.get("/login/success", function(req, res){
                                                                                // LOGIN / SUCCESS
   req.flash("success", "You have been successfully logged in.");    
   res.redirect("/");                                 
});
router.get("/login/failure", function(req, res){
                                                                                // LOGIN / FAILURE
   req.flash("danger", "You have provided incorrect username and/or password.  Please try again.");    
   res.redirect("/login");                                 
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