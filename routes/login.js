var express     = require('express'),
    router      = express.Router(),
    getVar      = require(__dirname + "/../functions/getVar.js"),
    crypto      = require('crypto'),
    mongoose    = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var userDB    = require(__dirname + "/../models/user.js");
var photoDB    = require(__dirname + "/../models/photos.js");
var tagDB      = require(__dirname + "/../models/tags.js");

var gpotte;
var categories;
getVar.gpotte(function(res){gpotte = res});
getVar.categories(function(res){categories = res});

router.get("/", (req, res)=>{
  res.render("login/index", {title: "login", gpotte: gpotte, categories: categories, user: null});
});

router.post("/", (req, res)=>{
  let options = { maxAge: 1000 * 60 * 15 };
  var login = req.body.login;
  var password = crypto.createHash('md5').update(req.body.password).digest("hex");
  userDB.findOne({name: login, password: password}, (err, user)=>{
    if (err){console.log(err)}
    else if (user){
      res.cookie('user', {name: 'gpotte'}, options)
      res.redirect('/');
    }
    else {
      res.redirect('back');
    }
  });
});

module.exports = router;
