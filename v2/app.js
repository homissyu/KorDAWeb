var express = require('express');
const asyncify = require('express-asyncify');
 
const app = asyncify(express());

var compression = require('compression');
app.use(compression());

var bodyParser = require('body-parser');
const request = require('request');

const logger = require('./utils/logger');

// var app = express();
var PORT= process.env.PORT || 3000;

// Publishing Version
const PUB_VER = "";

// https redirect

app.all('*', (req, res, next) => { 
    let userAgent = req.headers['User-Agent'] || req.userAgent; 
    let protocol = req.headers['x-forwarded-proto'] || req.protocol; 
    // console.log(`User-Agent:${userAgent}`);
    if (req.hostname == 'localhost' || protocol == 'https') { 
        next(); 
    } else { 
        let from = `${protocol}://${req.hostname}${req.url}`; 
        let to = `https://www.korda.im${req.url}`; // log and redirect 
        logger.info(`[${req.method}]: ${from} -> ${to}`); 
        res.redirect(to); 
    } 
});

//urlEncode
app.use(bodyParser.urlencoded({extended : true}));

//view
app.set('views', __dirname+PUB_VER+'/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+PUB_VER+"/public"));

//use cache-control
var   maxAge =  60 * 60 * 24;
app.all('/img/*',function(req,res,next){
    res.set('Cache-Control', 'public, max-age=31557600');
    next();
});

// //Page for News Tab
app.use("/news", require(__dirname+PUB_VER+"/server/news"));

// //use routes
// // app.use("/event", require(__dirname+"/routes/event"));
// app.use("/event_coupon", require(__dirname+PUB_VER+"/routes/event_coupon"));
// app.use("/event_ezwel", require(__dirname+PUB_VER+"/routes/event_ezwel"));
// // app.use("/event_mypet", require(__dirname+"/routes/event_mypet"));

//API for GNB
app.use("/getData", require(__dirname+PUB_VER+"/api/getData"));
// //API for Widget
app.use("/getData4App", require(__dirname+PUB_VER+"/api/getData4App"));
// //API for Dashboard
app.use("/getData4Dashboard", require(__dirname+PUB_VER+"/api/getData4Dashboard"));
// //API for Dashboard
app.use("/getAsset", require(__dirname+PUB_VER+"/api/getAsset"));

app.use("/dashBoard", require(__dirname+PUB_VER+"/server/dashBoard"));
app.use("/", require(__dirname+PUB_VER+"/server/index"));

//listen
app.listen(PORT, function(){
    //console.log('Example app listening on port', PORT);
    logger.info(`Listening on port ${PORT}...`);
});

app.use(function(err, req, res, next) { 
    logger.error(err);
    // handle error 
});
