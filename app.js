var bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    express     = require('express'),
    app         = express();
var port        = process.env.PORT || 3030;

mongoose.connect('mongodb://localhost/test');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");



var test = [{
  src: "https://scontent.xx.fbcdn.net/v/t1.0-9/18767867_10208837246920374_5270384912038845893_n.jpg?oh=f553c8919a045fdc1c3ba8c0f795b52e&oe=599C51F6",
  title: "U N D E R",
  id:1
  },{
  src:"https://c1.staticflickr.com/5/4223/34810498871_ec2c669992_k.jpg",
  id:2,
  title: "Tension"
  },{
  src:"https://scontent.xx.fbcdn.net/v/t1.0-9/18010976_10208519727822595_8487734034774834229_n.jpg?oh=a021b9a23f1b4151f33764b8229170ac&oe=59A2119B",
  id:3,
  title: "Railway"
}];

//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)
var gpotte;
getVar = require(__dirname + "/functions/getVar.js");
getVar.gpotte(function(res){gpotte = res});
//GET GPOTTE VARIABLE (CONTAINING A LOT OF INFO)

app.get('/', (req, res) => {
  res.redirect('/home');
});

// render Each categories
app.get('/home', (req, res) => {
    res.render("home", {title: 'Home', images: test, gpotte: gpotte});
});

//render all 365 photos in pagination (15 by 15)
app.get('/365', (req, res)=>{
    res.render("365/365", {title: '365', gpotte: gpotte});
});

//render the portfolio
app.get('/portfolio', (req, res)=>{
    res.render("portfolio/portfolio", {title: 'portfolio', gpotte: gpotte});
});

app.listen(port, ()=>{
  console.log("server running on port %d", port);
});
