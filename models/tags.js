var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var tagSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model("Tag", tagSchema);
