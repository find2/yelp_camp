var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

// NEW User - show form to create new user for the YelpCamp
router.get('/register', function(req, res){
    res.render("register", {page: 'register'})
})

// LOGIN User - show form to login user for the YelpCamp
router.get('/login', function(req, res){
    res.render("login", {page: 'login'})
})

// LOGOUT User - logout user from the YelpCamp
router.get('/logout', function(req, res){
    req.logout()
    req.flash("success", "You have loged out!")
    res.redirect('/campgrounds')
})

// CREATE User - create new user to db for the yelpcamp
router.post('/register', function(req, res){
    var username = new User({username: req.body.username})
    User.register(username, req.body.password, function(err, user){
        if(err) {
            // req.flash("error", err.message)
            console.log(err)
            return res.render('register', {error: err.message})
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, "+user.username)
            res.redirect('/campgrounds')
        })
    })
})

// LOGIN User - login user to db for the yelpcamp
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
    
})

module.exports = router