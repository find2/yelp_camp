var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    geocoder = require('geocoder')

// INDEX - Show All campgrounds from db
router.get('/', function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: campgrounds, page: 'campgrounds'})
        }
    })
    // res.render("campgrounds", {campgrounds: campgrounds})
})

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campgground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err || !campground) {
            req.flash('error', 'Campground not found')
            res.redirect('back')
        } else {
            res.render("campgrounds/show", {campground: campground})
        }
    })
})

// CREATE - Create new campground to db
// router.post('/', middleware.isLoggedIn, function(req,res){
//     // var name = req.body.name
//     // var image = req.body.image
//     // var description = req.body.description
//     // var newCampground = {name: name, image: image}
//     // campgrounds.push(newCampground)
//     // Campground.create({
//     //     name: name, 
//     //     image: image,
//     //     description: description
//     // }, function(err, campground){
//     //     if(err){
//     //         console.log(err)
//     //     } else {
//     //         res.redirect("/campgrounds")
//     //     }
//     // })
//     Campground.create(req.body.campground, function(err, campground){
//         if(err){
//             console.log(err)
//         } else {
//             res.redirect("/campgrounds")
//         }
//     })
// })

// CREATE - Create new campground to db
router.post('/', middleware.isLoggedIn, function(req,res){
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat
        var lng = data.results[0].geometry.location.lng
        var location = data.results[0].formatted_address
        var newCampground = {name: name, price: price, image:image, description: desc, location: location, lat: lat, lng: lng, author: author}
        Campground.create(newCampground, function(err, campground){
            if(err){
                console.log(err)
                req.flash("error", "Something went wrong! Check your database!")
                res.redirect("back")
            } else {
                req.flash("success", "Added new Campground '"+name+"'")
                res.redirect("/campgrounds")
            }
        })
    })
})

// EDIT - show form to edit specific campground
router.get('/:id/edit', middleware.isOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        res.render('campgrounds/edit', {campground: campground})
    })
})

// UPDATE - update data in database
router.put('/:id', middleware.isOwner, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, cost: req.body.campground.price, location: location, lat: lat, lng: lng}
        Campground.findByIdAndUpdate(req.params.id, newData, function(err, campground){
            if(err){
                req.flash("error", "Cannot update Campground!")
                res.redirect('/campgrounds')
            } else {
                req.flash("success", "Campground has been updated!")
                res.redirect('/campgrounds/'+campground._id)
            }
        })
    })
    // Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
    //     if(err){
    //         req.flash("error", "Cannot update Campground!")
    //         res.redirect('/campgrounds')
    //     } else {
    //         req.flash("success", "Campground has been updated!")
    //         res.redirect('/campgrounds/'+campground._id)
    //     }
    // })
})

// DELETE - delete specific campground from db
router.delete('/:id', middleware.isOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Cannot delete Campground!")
            res.redirect('/campgrounds')
        } else {
            req.flash("success", "Campground has been deleted!")
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router