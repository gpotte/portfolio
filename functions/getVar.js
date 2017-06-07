//IMPORTINGS MONGOOSE MODELS
var gpotteDB    = require(__dirname + "/../models/user.js");
//IMPORTINGS MONGOOSE MODELS

module.exports = {
  //GET GPOTTE FROM USER TABLE
  gpotte: function gpotte(callback){
              gpotteDB.findOne((err, res)=>{
                if (err)
                  console.log(err);
                else
                  callback(res);
              });
            }
}
