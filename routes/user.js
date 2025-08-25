const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");


//signup - GET route
router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
})

//Signup - POST
router.post("/signup", wrapasync(async(req, res) => {
    try{
    let {username, email, password} = req.body;
    let newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to wanderlust!");
    res.redirect("/listings");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//Login - GET
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

//Login - POST
router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), async(req, res) => {
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect("/listings");
});

module.exports = router;