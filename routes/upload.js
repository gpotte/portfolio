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

//render form to upload photos and form to create tags
//need the authentification and ajax for the tag form
router.get('/', (req, res)=>{
  res.render("upload/upload", {title: 'upload', gpotte: gpotte, categories: categories});
});

router.post('/photo', (req, res)=>{
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
  res.redirect('/');
});

module.exports = router;
