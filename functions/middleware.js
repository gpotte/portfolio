var getVar = require("./getVar.js");
var exports = module.exports = {};

exports.loggedIn = function(){
  return function(req, res, next){
  getVar.user(req, (result)=>{
    if (result && result.name === "gpotte") {
     next();
    }
   else
     res.redirect("/login");
   });
  }
}
