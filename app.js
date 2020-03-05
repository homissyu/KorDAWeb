var express = require('express');
var bodyParser = require('body-parser'); 

var app = express();
var PORT= process.env.PORT || 3000;


//urlEncode
app.use(bodyParser.urlencoded({extended : true}));

//view
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');""
app.use(express.static(__dirname+"/public"));

//use routes
app.use("/api", require(__dirname+"/routes/getData"));
app.use("/dashboard", require(__dirname+"/routes/dashBoard"));
app.use("/", require(__dirname+"/routes/index"));

//listen
app.listen(PORT, function(){
    console.log('Example app listening on port', PORT);
});
