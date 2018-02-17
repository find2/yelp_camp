var express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

// NEW Comment - show form to create new comment for one campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

// CREATE Comment - create new comment to db for one campground
router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            req.flash("error", "Something went wrong! Please check the database!")
            res.redirect("back")
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                    req.flash("error", "Something went wrong! Please check the database!")
                    res.redirect("back")
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment._id)
                    campground.save()
                    req.flash("success", "Added new Comment to '"+campground.name+"'")
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

// EDIT Comment - show edit form for edit specific comment
router.get('/:comment_id/edit', middleware.isCommentOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found!")
            return res.redirect('back')
        }
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment) {
                req.flash("error", "Comment not found!")
                res.redirect('back')
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: comment})
            }
        })
    })
})

// UPDATE comment - Update comment in the db for specific comment
router.put('/:comment_id', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err) {
            req.flash("error", "Cannot update Comment")
            res.redirect('back')
        } else {
            req.flash("success", "Comment has been updated!")
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

// DELETE Comment - Delete comment in the db for specific campground
router.delete('/:comment_id', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            req.flash("error", "Cannot delete Comment")
            res.redirect('back')
        } else {
            req.flash("success", "Campground has been deleted!")
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

module.exports = router