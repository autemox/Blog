var User = require("../models/user");

var middlewareObj = {};

function checkSuccess(req, res, err)
{
    if(err)
    {
           req.flash("danger", err.message); 
           res.redirect("/");
           return false;
    }
    else return true;
}

middlewareObj.isLoggedIn=function(req, res, next) {           
                                                        // REDIRECTS TO LOGIN FORM IF NOT LOGGED IN
    if(req.isAuthenticated()) return next();     
    else
    {
        req.flash("danger", "You must first be logged in to do that.");    
        res.redirect("/login");         
    }
}

middlewareObj.isAdministrator=function(req, res, next) {           
                                                        // REJECTS USER IF NOT ADMINISTRATOR
    if(req.isAuthenticated()) 
    {
        if(req.user.admin) return next();
        else
        {
            req.flash("warning", "You do not have permission to do that.");    
            res.redirect("back");     
        } 
    }
    else
    {
        req.flash("danger", "You must first be logged in to do that.");    
        res.redirect("/login");         
    }
}

module.exports=middlewareObj;