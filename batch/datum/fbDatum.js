const async = require('async');
const rp = require('request-promise');
const removeItem = require('remove-array-items');
const logger = require('../utils/logger');

var DupChecker = require('../utils/DupChecker');

var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
// console.log(new Date().getDate()-1);
// console.log(new Date().setDate(new Date().getDate()-1));
// console.log(yesterday);
var timeStampVal = Math.round(yesterday.getTime()/1000); 
// console.log("timeStampVal:"+timeStampVal)
const feedCnt = 99;

const fbFeedListOption = { 
    method:'GET', 
    url:'https://graph.facebook.com/v6.0/2819705001436386/feed?limit='+feedCnt+'&since='+timeStampVal+'&fields=permalink_url,picture,updated_time,created_time,message,status_type&access_token=EAAEzBReT07oBACI0CKYjH5k7LqkN5JRgR9L2Kq3i8v7zvo3LCocacciWHVl3bfNOz5zd0MqDNAFPyZConsxEJmB6L2IfHNPrcAZA5TVnZADplEXJuKZCXgAPGXkcdGKU8ORSFqJOVHC0sSNONuxNqNc7K0jG7iKQqLaXUZBVDQlzRt2ZC2uU9d'
}

var retObj = new Array();
var retArr = new Array();

function custom_sort(a, b) {
    return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
}

function getFbFeedList() {
    rp(
        fbFeedListOption
    ).then(
        function (body) { 
            var objArr = JSON.parse(body);
            var i=0;
		    for(var subKey=0;subKey<objArr["data"].length;subKey++){
                if("message" in objArr["data"][subKey] ){
                    // console.log("message" in objArr["data"][subKey]);
                    retArr[i] = objArr.data[subKey];
                    i++;
                }
            }
            // console.log("fbFeed:"+retArr);
        }
    ).catch(function(err){
        // res.socket.destroy();
        logger.error(err);
        throw err;
    });
}

var datum = {};
datum.getData = function (req, res){
    DupChecker.init("SELECT DISTINCT ID FROM FB_LIST");
    async.waterfall([
        function(callback) {
            callback(null, getFbFeedList());
        }
    ], function (err, result) {
        // res.writeHead(200, {'Cache-Control': 'public, max-age=31536000'});
        if(err){
            logger.error(err);
            res.socket.destroy();
        }else {
            retArr.sort(custom_sort);
            for(var i=0;i<retArr.length;i++){
                if("wall_post"==JSON.parse(JSON.stringify(retArr[i])).status_type || !(JSON.parse(JSON.stringify(retArr[i])).hasOwnProperty("permalink_url"))){
                    // console.log(JSON.parse(JSON.stringify(retArr[i])));
                    removeItem(retArr,i,1);
                }
            }
            var j=0;
            for(var i=0;i<retArr.length;i++){
                // console.log(retObj[i].link);
                if(!DupChecker.isDup(retArr[i].id.trim())) {
                    retObj[j] = retArr[i];
                    j++;
                }
            };
            // logger.info(JSON.stringify(retObj));
            // logger.info(retObj.length);
            // res.render('index', {goldBuy:goldBuy, goldSell:goldSell, pegGram:pegGram, pesGram:pesGram, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq,fbNews:retArr.
        }  // 7
    });
    return retObj;
};

module.exports = datum;
