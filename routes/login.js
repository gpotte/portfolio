var express     = require('express'),
    router      = express.Router(),
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
  res.render("login/index", {title: "login", gpotte: gpotte, categories: categories, user: cookie});
});

module.exports = router;
