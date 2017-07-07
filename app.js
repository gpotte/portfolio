var methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    mongoose       = require("mongoose"),
    express        = require('express'),
    app            = express(),
    crypto         = require('crypto');

var port           = process.env.PORT || 3030,
    getVar         = require(__dirname + "/functions/getVar.js"),
    categories,
    cookie,
    gpotte;

getVar.gpotte(function(res){gpotte = res});

mongoose.connect('mongodb://localhost/test');
app.use(methodOverride('_method'))
app.use(cookieParser('your secret here'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

var photoDB    = require(__dirname + "/models/photos.js");
var tagDB      = require(__dirname + "/models/tags.js");
var gpotteDB   = require(__dirname + "/models/user.js");

//CREATE GPOTTE ENTRY TO POPULATE DB
// gpotteDB.create({
//   bio: "emplacement de la bio",
//   instagram: "https://www.instagram.com/cobblestuv/",
//   mail: "gilles.gpotte@gmail.com",
//  name: "gpotte",
//  password: crypto.createHash('md5').update("portfoliopassword").digest("hex")
// });
// gpotteDB.findOne({}, (err, res)=>{
//   console.log(res);
// });
// console.log(crypto.createHash('md5').update("portfoliopassword").digest("hex"));
//CREATE GPOTTE ENTRY TO POPULATE DB

app.get('/', (req, res) => {
  res.redirect('/home');
});

// render Each categories
app.get('/home', (req, res) => {
  getVar.user(req, function(res){cookie = res});
  getVar.gpotte(function(res){gpotte = res});
  getVar.categories(function(res){categories = res});
  photoDB.find().sort('-date').limit(15).exec((err, images)=>{
    console.log(cookie);
    res.render("home", {title: 'Home', images: images, gpotte: gpotte, categories: categories, user: cookie});
  });
});

app.get('/404', (req, res)=>{
    getVar.gpotte(function(res){gpotte = res});
    getVar.categories(function(res){categories = res});
    res.status(404);
    res.render("404", {title: '404', gpotte: gpotte, categories: categories});
});

app.get('/logout', (req, res)=>{
  res.clearCookie("user");
  res.redirect('/');
});

//EXPRESS ROUTER
var uploadRoute     = require('./routes/upload'),
    loginRoute      = require('./routes/login'),
    userRoute       = require('./routes/user'),
    categoriesRoute = require('./routes/categories');
//upload routes + delete (delete request) + edit;
app.use("/upload", uploadRoute);
//categories route + random photo + last photos
app.use("/categories", categoriesRoute);
//user routes (for edit)
app.use("/user", userRoute);
//login routes
app.use("/login", loginRoute);
//EXPRESS ROUTER

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
