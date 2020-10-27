const cron = require('cron');
const CronJob = cron.CronJob;

const logger = require('./utils/logger');

const setNewsData = require("./loader/setNewsData.js");
const setBlogData = require("./loader/setBlogData.js");
const setFBData = require("./loader/setFbData.js");
const setYoutubeData = require("./loader/setYoutubeData.js");
const updFbPicLink = require("./loader/updFbPicLink.js");

const job1 = new CronJob('* */7 * * * *', function() {
    setNewsData.setData();
}, null, true);
const job2 = new CronJob('* */11 * * * *', function() {
    setFBData.setData();
}, null, true);
const job3 = new CronJob('* */59 * * * *', function() { //59분
    setYoutubeData.setData();
}, null, true);
const job4 = new CronJob('* */13 * * * *', function() {
    setBlogData.setData();
}, null, true);
const job5 = new CronJob('00 17 00 * * *', function() {
    updFbPicLink.setData();
}, null, true);

job1.start();
job2.start();
job3.start();
job4.start();
job5.start();