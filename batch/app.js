const cron = require('cron');
const CronJob = cron.CronJob;

const logger = require('./utils/logger');

const setNewsData = require("./loader/setNewsData.js");
const setFBData = require("./loader/setFbData.js");
const setYoutubeData = require("./loader/setYoutubeData.js");
// var _setNewsData = require("."+PUB_VER+"/batch/_setNewsData.js");

const job1 = new CronJob('*/10 * * * * *', function() {
    setNewsData.setData();
}, null, true);
const job2 = new CronJob('* */10 * * * *', function() {
    setFBData.setData();
}, null, true);
const job3 = new CronJob('* */60 * * * *', function() {
    setYoutubeData.setData();
}, null, true);
// var job4 = new CronJob('* */5 * * * *', function() {
//     _setNewsData.setData();
// }, null, true);

job1.start();
job2.start();
job3.start();
// job4.start();