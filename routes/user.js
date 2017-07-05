var express     = require('express'),
    router      = express.Router(),
    crypto      = require('crypto'),
    loggedIn    = require(__dirname + "/../functions/loggedIn.js")
    mongoose    = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var userDB    = require(__dirname + "/../models/user.js");

router.patch('/', loggedIn.loggedIn(), (req, res)=>{
  userDB.findOneAndUpdate({}, {bio: req.body.newBio, instagram: req.body.instagram, mail: req.body.newMail}, (err)=>{
    if (err){console.log(err)}
    else {console.log("updated")}
  });
  res.redirect('back');
});

module.exports = router;
