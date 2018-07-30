// Blog-Style Template app.js
// note: replace My Application, My App, and myapp with the name of your application

// database configuration
var databaseConfig= {
    
    address: "mongodb://localhost/myapp"
}
// passport configuration
var passportConfig={ 
    secret: "Secret Phrase For Encoding & Decoding Sessions", 
    resave: false, 
    saveUninitialized: false
};

// require packages
var express = require("express"),
    app = express(),
    bodyParser=require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride=require("method-override"),
    flash=require("connect-flash"),
    expressSanitizer=require("express-sanitizer"),
    expressSession=require("express-session")(passportConfig);

// require models
var Blog = require("./models/blog");
var User = require("./models/user");

// require routes
var blogRoutes = require("./routes/blog"),
    indexRoutes = require("./routes/index");

// establish databases connection
mongoose.connect(databaseConfig.address);

// use / establish package in express
app.use(bodyParser.urlencoded ({extended: true}));   // helps parse posted data
app.use(express.static("public"));                   // allows us to serve style sheets
app.use(methodOverride("_method"));                  // allows for the use of PUT and DELETE by fixing methods using ?_method=put
app.use(flash());                                    // allows for messages to be sent through future route
app.set("view engine", "ejs");                       // assumes .ejs files
app.use(expressSession);                             // initialize express session
app.use(passport.initialize());                      // initialize passport
app.use(passport.session());                         // initialize our session
passport.use(new LocalStrategy(User.authenticate()));// loc strat using passportLocalMongoose plugin within User model
passport.serializeUser(User.serializeUser());        // have passport process user serialization
passport.deserializeUser(User.deserializeUser());    // have passport process user deserialization
app.use(expressSanitizer());                         // allows submission of basic html but blocks scripting

// pass global variables through all routes
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success=req.flash("success");
   res.locals.danger=req.flash("danger");
   res.locals.warning=req.flash("warning");
   res.locals.info=req.flash("info");
   next();
});

// attach routes
app.use("/blog", blogRoutes);
app.use("/", indexRoutes);

// server initiation
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Started.");
})