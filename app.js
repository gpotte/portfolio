var bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    express     = require('express'),
    app         = express();
var port        = process.env.PORT || 3030,
    getVar      = require(__dirname + "/functions/getVar.js");

mongoose.connect('mongodb://localhost/test');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");


var photoDB    = require(__dirname + "/models/photos.js");
var tagDB      = require(__dirname + "/models/tags.js");
//CREATE TAGS TO POPULATE DB
// tagDB.create({
//   name: "parties"
// });
//CREATE TAGS TO POPULATE DB

//CREATE PICS TO POPULATE DB
// photoDB.create({
//   src: "https://scontent.xx.fbcdn.net/v/t1.0-9/18010976_10208519727822595_8487734034774834229_n.jpg?oh=a021b9a23f1b4151f33764b8229170ac&oe=59A2119B",
//   title: "railway",
//   description: "feefeefefefeffe",
//   tags: ["urbex", "party"]
// });
//CREATE PICS TO POPULATE DB
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

//GET tags VARIABLE (FOREACH CATEGORIES)
var categories;
getVar.categories(function(res){categories = res});
//GET tags VARIABLE (FOREACH CATEGORIES)
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)
var gpotte;
getVar.gpotte(function(res){gpotte = res});
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)

app.get('/', (req, res) => {
  res.redirect('/home');
});

// render Each categories
app.get('/home', (req, res) => {
  photoDB.find({}, null, {sort: '-date'}, (err, images)=>{
    res.render("home", {title: 'Home', images: images, gpotte: gpotte, categories: categories});
  });
});

//render all 365 photos in pagination (15 by 15)
app.get('/365', (req, res)=>{
    res.render("365/365", {title: '365', gpotte: gpotte, categories: categories});
});

//render the portfolio
app.get('/portfolio', (req, res)=>{
    res.render("portfolio/portfolio", {title: 'portfolio', gpotte: gpotte, categories: categories});
});

//render form to upload photos and form to create tags
//need the authentification and ajax for the tag form
app.get('/upload', (req, res)=>{
  res.render("upload/upload", {title: 'upload', gpotte: gpotte, categories: categories});
});

app.post('/upload/photo', (req, res)=>{
  if (typeof req.body.tags !== 'object'){
    var tag = req.body.tags;
    photoDB.create({
      src: req.body.src,
      title: req.body.title,
      description: req.body.description,
      tags: tag
    }, (err, photo)=>{
      if (err){console.log(err)}
      else {
          tagDB.findOne({name: tag}, (err, result)=>{
            if (err){console.log(err)}
            else if (result){
              result.pics.push(photo);
              result.save();
            }
            else {
              tagDB.create({name: tag}, (err, result)=>{
                if (err){console.log(err)}
                else {
                  result.pics.push(photo);
                  result.save();
                }
              });
            }
          });
      }
    });
  }
  else {
    var tags = [];
    for (i = 0; i < req.body.tags.length; i++)
      tags.push(req.body.tags[i]);
    photoDB.create({
      src: req.body.src,
      title: req.body.title,
      description: req.body.description,
      tags: tags
    },
    (err, photo)=> {
      if (err){console.log(err)}
    else {
      tags.forEach((tag)=>{
        tagDB.findOne({name: tag}, (err, result)=>{
          if (err){console.log(err)}
          else if (result){
            result.pics.push(photo);
            result.save();
          }
          else {
            tagDB.create({name: tag}, (err, result)=>{
              if (err){console.log(err)}
              else {
                result.pics.push(photo);
                result.save();
              }
            });
          }
        });
      });
    }
  });
  }
  getVar.categories(function(res){categories = res});
  res.redirect('/');
});

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
