var express     = require('express'),
    router      = express.Router(),
    getVar      = require(__dirname + "/../functions/getVar.js"),
    middleware  = require(__dirname + "/../functions/middleware.js")
    mongoose    = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var photoDB    = require(__dirname + "/../models/photos.js");
var tagDB      = require(__dirname + "/../models/tags.js");

//render form to upload photos and form to create tags
router.get('/', getVars(), middleware.loggedIn(), (req, res)=>{
  res.render("upload/index", {title: 'upload', gpotte: gpotte, categories: categories, user: cookie});
});

router.post('/', middleware.loggedIn(), (req, res)=>{
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

router.delete('/:id', middleware.loggedIn(), (req, res)=> {
  photoDB.findById(req.params.id, (err, result)=>{
    if (err){console.log(err)}
    else {
      result.tags.forEach((tag)=>{
        tagDB.findOne({name: tag}).populate("pics").exec((err, result)=>{
          console.log(result.pics.length);
          if (result.pics.length == 0)
          {
            tagDB.findOneAndRemove({name: tag}, (err)=>{if (err){console.log(err)}});
          }
        });
      });
    }
  });
  photoDB.findByIdAndRemove(req.params.id, (err)=>{
   if (err){console.log(err)}
   else{console.log("deleted")};
  });
  res.redirect('back');
});

router.patch('/:id', middleware.loggedIn(), (req, res)=>{
  photoDB.findByIdAndUpdate(req.params.id, {title: req.body.newTitle, description: req.body.newDescription}, (err)=>{
    if (err){console.log(err)}
    else {console.log("updated")}
  });
  res.redirect('back');
});

router.get('*', (req, res)=>{
  res.redirect('/404');
});

module.exports = router;

function getVars(){
  return function(req, res, next){
    getVar.user(req, function(res){cookie = res});
    getVar.gpotte(function(res){gpotte = res});
    getVar.categories(function(res){categories = res});
    next();
  }
};
