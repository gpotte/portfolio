var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');
var tagSchema = mongoose.Schema({
  name: String,
  pics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photos"
  }]
});

module.exports = mongoose.model("Tag", tagSchema);
