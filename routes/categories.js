var express = require('express'),
    router  = express.Router(),
    getVar      = require(__dirname + "/../functions/getVar.js"),
    mongoose    = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var photoDB    = require(__dirname + "/../models/photos.js");
var tagDB      = require(__dirname + "/../models/tags.js");

//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)
var gpotte;
var categories;
getVar.gpotte(function(res){gpotte = res});
getVar.categories(function(res){categories = res});
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)

//render one random pic
router.get('/random', (req, res)=>{
  // Get the count of all photos
  photoDB.count().exec((err, count)=>{
    // Get a random entry
    var random = Math.floor(Math.random() * count)
    photoDB.findOne().skip(random).exec((err, result)=>{
      if (err){console.log(err)}
      else
        res.render("categorie/random", {title: "random photo", gpotte: gpotte, categories: categories, image: result});
    });
  });
});
//render one random pic

//Render pages with all pics from a categorie
router.get('/:tag', (req, res)=>{
  var tag = req.params.tag;
  tagDB.findOne({name: tag}).populate("pics").exec((err, result)=>{
    if (err){console.log(err)}
    else if (result)
      res.render("categorie/index", {title: tag, gpotte: gpotte, categories: categories, content: result});
    else
      res.redirect('/404');
  });
});
//Render pages with all pics from a categorie


module.exports = router;
