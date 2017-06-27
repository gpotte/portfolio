var methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    mongoose       = require("mongoose"),
    express        = require('express'),
    app            = express();

var port           = process.env.PORT || 3030,
    getVar         = require(__dirname + "/functions/getVar.js"),
    categories,
    gpotte;

getVar.gpotte(function(res){gpotte = res});

mongoose.connect('mongodb://localhost/test');
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

var photoDB    = require(__dirname + "/models/photos.js");
var tagDB      = require(__dirname + "/models/tags.js");

//CREATE GPOTTE ENTRY TO POPULATE DB
// var gpotteDB   = require(__dirname + "/models/user.js");
// gpotteDB.findOne({}, (err, res)=>{
//   console.log(res);
// });
// gpotteDB.create({
//   bio: "emplacement de la bio",
//   instagram: "https://www.instagram.com/cobblestuv/",
//   mail: "gilles.gpotte@gmail.com"
// });
//CREATE GPOTTE ENTRY TO POPULATE DB

app.get('/', (req, res) => {
  res.redirect('/home');
});

// render Each categories
app.get('/home', (req, res) => {
  var cookie = req.cookies;
  if (cookie)
    cookie = cookie.user;
  getVar.gpotte(function(res){gpotte = res});
  getVar.categories(function(res){categories = res});
  photoDB.find().sort('-date').limit(15).exec((err, images)=>{
    res.render("home", {title: 'Home', images: images, gpotte: gpotte, categories: categories, user: cookie});
  });
});

app.get('/404', (req, res)=>{
    getVar.gpotte(function(res){gpotte = res});
    getVar.categories(function(res){categories = res});
    res.status(404);
    res.render("404", {title: '404', gpotte: gpotte, categories: categories});
});

//EXPRESS ROUTER
var uploadRoute     = require('./routes/upload'),
    // deleteRoute     = require('./routes/delete'),
    // editRoute     = require('./routes/edit'),
    categoriesRoute = require('./routes/categories');
//upload routes + delete (delete request) + edit;
app.use("/upload", uploadRoute);
//categories route + random photo + last photos
app.use("/categories", categoriesRoute);
//EXPRESS ROUTER

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
