var express = require('express');
const asyncify = require('express-asyncify');
 
const app = asyncify(express());

var compression = require('compression');
app.use(compression());

var bodyParser = require('body-parser'); 
var cron = require('cron');

// var app = express();
var PORT= process.env.PORT || 3000;

// https redirect

app.all('*', (req, res, next) => { 
    let protocol = req.headers['x-forwarded-proto'] || req.protocol; 
    if (req.hostname == 'localhost' || protocol == 'https') { 
        next(); 
    } else { 
        let from = `${protocol}://${req.hostname}${req.url}`; 
        let to = `https://${req.hostname}${req.url}`; // log and redirect 
        console.log(`[${req.method}]: ${from} -> ${to}`); res.redirect(to); 
    } 
});

// app.use(cacheControl({
//     maxAge: 5
// }));

//urlEncode
app.use(bodyParser.urlencoded({extended : true}));

//view
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');""
app.use(express.static(__dirname+"/public"));

//use cache-control
var   maxAge =  60 * 60 * 24;
app.all('/img/*',function(req,res,next){
    res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
    next();
});

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

//QR reader 4 KGE
app.use("/chkValidGiftCard", require(__dirname+"/routes/chkValidGiftCard"));
app.use("/viewGiftCardInfo", require(__dirname+"/routes/viewGiftCardInfo"));
// app.use("/chkValidGiftCard2", require(__dirname+"/routes/chkValidGiftCard2"));
// app.use("/chkValidGiftCard3", require(__dirname+"/routes/chkValidGiftCard3"));

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
