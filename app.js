var bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    express     = require('express'),
    app         = express();
var port        = process.env.PORT || 3030;

mongoose.connect('mongodb://localhost/test');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");


var photoDB    = require(__dirname + "/models/photos.js");

//CREATE PICS TO POPULATE DB
// photoDB.create({
//   src: "https://scontent.xx.fbcdn.net/v/t1.0-9/18010976_10208519727822595_8487734034774834229_n.jpg?oh=a021b9a23f1b4151f33764b8229170ac&oe=59A2119B",
//   title: "railway night",
//   description: "eefe"
// });
//CREATE PICS TO POPULATE DB

//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)
var gpotte;
getVar = require(__dirname + "/functions/getVar.js");
getVar.gpotte(function(res){gpotte = res});
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)

app.get('/', (req, res) => {
  res.redirect('/home');
});

// render Each categories
app.get('/home', (req, res) => {
  photoDB.find({}, (err, images)=>{
    res.render("home", {title: 'Home', images: images, gpotte: gpotte});
  });
});

//render all 365 photos in pagination (15 by 15)
app.get('/365', (req, res)=>{
    res.render("365/365", {title: '365', gpotte: gpotte});
});

//render the portfolio
app.get('/portfolio', (req, res)=>{
    res.render("portfolio/portfolio", {title: 'portfolio', gpotte: gpotte});
});

//render form to upload photos and form to create tags
//need the authentification and ajax for the tag form
app.get('/upload', (req, res)=>{
  res.render("upload/upload", {title: 'upload', gpotte: gpotte});
});

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
