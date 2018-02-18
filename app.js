var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOveeride = require('method-override'),
    flash = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/auth'),
    seedDB = require('./seeds')

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name: "Granite Hill", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
//     {name: "Mountain Goat's rest", image: "https://farm7.staticflickr.com/6191/6093778029_80248222df.jpg"},
//     {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name: "Granite Hill", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
//     {name: "Mountain Goat's rest", image: "https://farm7.staticflickr.com/6191/6093778029_80248222df.jpg"},
//     {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name: "Granite Hill", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
//     {name: "Mountain Goat's rest", image: "https://farm7.staticflickr.com/6191/6093778029_80248222df.jpg"}
// ]

//seedDB()
mongoose.connect(process.env.DATABASEURL)
// mongoose.connect("mongodb://find2:find2@ds239648.mlab.com:39648/yelp_camp")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname+"/public"))
app.use(methodOveeride('_method'))
app.use(flash())

app.set( 'port', ( process.env.PORT || 3000 ));
app.set("view engine", "ejs")

// PASSPORT configuration
app.use(require('express-session')({
    secret: 'This is the secret code',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

//ROUTER config
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)
app.use(authRoutes)

// Start Route
app.get('/', function(req, res){
    res.render("home")
})

app.get('*', function(req, res){
    res.send("404 Page Not Found!")
})

app.listen(app.get('port'), function(){
    console.log("YelpCamp Server Has Started! Port " + app.get('port'))
})