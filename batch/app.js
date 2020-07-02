var cron = require('cron');
var CronJob = cron.CronJob;

var setNewsData = require("./loader/setNewsData.js");
var setFBData = require("./loader/setFbData.js");
var setYoutubeData = require("./loader/setYoutubeData.js");
// var _setNewsData = require("."+PUB_VER+"/batch/_setNewsData.js");

var job1 = new CronJob('*/60 * * * * *', function() {
    setNewsData.setData();
}, null, true);
var job2 = new CronJob('* */10 * * * *', function() {
    setFBData.setData();
}, null, true);
var job3 = new CronJob('* */30 * * * *', function() {
    setYoutubeData.setData();
}, null, true);
// var job4 = new CronJob('* */5 * * * *', function() {
//     _setNewsData.setData();
// }, null, true);

job1.start();
job2.start();
job3.start();
// job4.start();