//IMPORTINGS MONGOOSE MODELS
var gpotteDB    = require(__dirname + "/../models/user.js");
var tagDB       = require(__dirname + "/../models/tags.js");
//IMPORTINGS MONGOOSE MODELS

module.exports = {
  //GET GPOTTE FROM USER TABLE
  gpotte:   function gpotte(callback){
                gpotteDB.findOne((err, res)=>{
                  if (err)
                    console.log(err);
                  else
                    callback(res);
                  });
            },
  categories: function gpotte(callback){
                tagDB.find((err, res)=>{
                  if (err)
                    console.log(err);
                  else
                    callback(res);
                });
            },
  user: function user(req, callback){
    var cookie = req.cookies;
    if (cookie)
      cookie = cookie.user;
    callback(cookie);
  }
}
