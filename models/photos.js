var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var photoSchema = mongoose.Schema({
  src: String,
  title: String,
  description: String,
  tags: [String]
});

module.exports = mongoose.model("Photos", photoSchema);
