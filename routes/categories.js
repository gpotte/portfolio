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
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)

//render one random pic
router.get('/random', (req, res)=>{
  getVar.categories(function(res){categories = res});
  // Get the count of all photos
  photoDB.count().exec((err, count)=>{
    // Get a random entry
    var random = Math.floor(Math.random() * count)
    photoDB.findOne().skip(random).exec((err, result)=>{
      if (err){console.log(err)}
      else if (result)
        res.render("categorie/random", {title: "random photo", gpotte: gpotte, categories: categories, image: result});
      else
        res.redirect('/');
    });
  });
});
//render one random pic

//Render pages with all pics from a categorie
router.get('/:tag', (req, res)=>{
  getVar.categories(function(res){categories = res});
  var tag = req.params.tag;
  tagDB.findOne({name: tag}).populate("pics").exec((err, result)=>{
    if (err){console.log(err)}
    else if (result && (result.pics.length > 0))
    {
      var content = result.toObject();
      content.pics.sort(function(m1, m2){ return m2.date - m1.date});
      res.render("categorie/index", {title: tag, gpotte: gpotte, categories: categories, content: content});
    }
    else
      res.redirect('/404');
  });
});
//Render pages with all pics from a categorie

router.get('*', (req, res)=>{
  res.redirect('/404');
});

module.exports = router;
