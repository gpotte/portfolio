var bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    express     = require('express'),
    app         = express();

var port        = process.env.PORT || 3030,
    getVar      = require(__dirname + "/functions/getVar.js"),
    categories,
    gpotte;

getVar.gpotte(function(res){gpotte = res});

mongoose.connect('mongodb://localhost/test');
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
  getVar.gpotte(function(res){gpotte = res});
  getVar.categories(function(res){categories = res});
  photoDB.find({}, null, {sort: '-date'}, (err, images)=>{
    res.render("home", {title: 'Home', images: images, gpotte: gpotte, categories: categories});
  });
});

//render all 365 photos in pagination (15 by 15)
app.get('/365', (req, res)=>{
    getVar.categories(function(res){categories = res});
    res.render("365/index", {title: '365', gpotte: gpotte, categories: categories});
});

//render the portfolio
app.get('/portfolio', (req, res)=>{
    getVar.categories(function(res){categories = res});
    res.render("portfolio/index", {title: 'portfolio', gpotte: gpotte, categories: categories});
});

//EXPRESS ROUTER
var uploadRoute     = require('./routes/upload'),
    categoriesRoute = require('./routes/categories');
//upload routes
app.use("/upload", uploadRoute);
//categories route + random photo + last photos
app.use("/categories", categoriesRoute);
//EXPRESS ROUTER

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
