var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var userSchema = mongoose.Schema({
  bio: String,
  instagram: String,
  mail: String,
  name: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);
