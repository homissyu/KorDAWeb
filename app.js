var express = require('express');
const asyncify = require('express-asyncify');
 
const app = asyncify(express());

var bodyParser = require('body-parser'); 
var cron = require('cron');

// var app = express();
var PORT= process.env.PORT || 3000;

//urlEncode
app.use(bodyParser.urlencoded({extended : true}));

//view
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');""
app.use(express.static(__dirname+"/public"));

//Page for News Tab
app.use("/news", require(__dirname+"/routes/news"));

//use routes
// app.use("/event", require(__dirname+"/routes/event"));
app.use("/event_coupon", require(__dirname+"/routes/event_coupon"));
app.use("/event_ezwel", require(__dirname+"/routes/event_ezwel"));
// app.use("/event_mypet", require(__dirname+"/routes/event_mypet"));

//API for GNB
app.use("/getData", require(__dirname+"/routes/getData"));
//API for Widget
app.use("/getData4App", require(__dirname+"/routes/getData4App"));
//API for Dashboard
app.use("/getData4Dashboard", require(__dirname+"/routes/getData4Dashboard"));

app.use("/dashBoard", require(__dirname+"/routes/dashBoard"));
app.use("/", require(__dirname+"/routes/index"));

//listen
app.listen(PORT, function(){
    console.log('Example app listening on port', PORT);
});

app.use(function(err, req, res, next) { 
    console.log(err);
    // handle error 
});

var CronJob = require('cron').CronJob;
var setNewsData = require("./routes/setNewsData.js");
var setFBData = require("./routes/setFbData.js")
var job1 = new CronJob('*/60 * * * * *', function() {
    setNewsData.setData();
}, null, true);
var job2 = new CronJob('* */5 * * * *', function() {
    setFBData.setData();
}, null, true);
job1.start();
job2.start();
