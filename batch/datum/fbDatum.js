const async = require('async');
const rp = require('request-promise');
const removeItem = require('remove-array-items');
const logger = require('../utils/logger');


let retArr = new Array();

function custom_sort(a, b) {
    return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
}

function generateFbOption(feedCnt, timeStampVal){
    let fbFeedListOption = { 
        method:'GET', 
        url:'https://graph.facebook.com/v6.0/2819705001436386/feed?limit='+feedCnt+'&since='+timeStampVal+'&fields=permalink_url,picture,updated_time,created_time,message,status_type&access_token=EAAEzBReT07oBACI0CKYjH5k7LqkN5JRgR9L2Kq3i8v7zvo3LCocacciWHVl3bfNOz5zd0MqDNAFPyZConsxEJmB6L2IfHNPrcAZA5TVnZADplEXJuKZCXgAPGXkcdGKU8ORSFqJOVHC0sSNONuxNqNc7K0jG7iKQqLaXUZBVDQlzRt2ZC2uU9d'
        // url:'https://graph.facebook.com/v6.0/2819705001436386/feed?limit='+feedCnt+'&fields=permalink_url,picture,updated_time,created_time,message,status_type&access_token=EAAEzBReT07oBACI0CKYjH5k7LqkN5JRgR9L2Kq3i8v7zvo3LCocacciWHVl3bfNOz5zd0MqDNAFPyZConsxEJmB6L2IfHNPrcAZA5TVnZADplEXJuKZCXgAPGXkcdGKU8ORSFqJOVHC0sSNONuxNqNc7K0jG7iKQqLaXUZBVDQlzRt2ZC2uU9d'
    };
    // logger.info("fbFeedListOption:"+fbFeedListOption);
    return fbFeedListOption;
}

function getFbFeedList(feedCnt, timeStampVal) {
    rp(
        generateFbOption(feedCnt, timeStampVal)
    ).then(
        function (body) { 
            let objArr = JSON.parse(body);
            // console.log("objArr:"+JSON.stringify(objArr));
            // console.log(JSON.stringify(fbFeedListOption))
            let i=0;
		    for(let subKey=0;subKey<objArr["data"].length;subKey++){
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

let datum = {};
datum.getData = function (needDupChk, feedCnt, timeVal){
    logger.info("flag:"+needDupChk);
    timeStampVal = timeVal;
    // logger.info("[ FB ] Before dup check:"+retArr.length);
    let retObj = new Array();
    let DupChecker = new require('../utils/DupChecker');
    DupChecker.init('SELECT DISTINCT TRIM(ID)`ID` FROM FB_LIST ORDER BY CREATED_TIME');
    let statusArr = ["added_photos", "added_video", "shared_story", "wall_post"];
    async.waterfall([
        function(callback) {
            logger.info("feedCnt:"+feedCnt);
            logger.info("timeVal:"+timeVal);
            callback(null, getFbFeedList(feedCnt, timeVal));
        }
    ], function (err, result) {
        // res.writeHead(200, {'Cache-Control': 'public, max-age=31536000'});
        if(err){
            logger.error(err);
            res.socket.destroy();
        }else {
            retArr.sort(custom_sort);
            // console.log(retArr.length);
                
            for(let i=0;i<retArr.length;i++){
                if(statusArr.indexOf(JSON.parse(JSON.stringify(retArr[i])).status_type) == -1|| 
                !(JSON.parse(JSON.stringify(retArr[i])).hasOwnProperty("permalink_url"))){
                    // console.log(JSON.parse(JSON.stringify(retArr[i])));
                    removeItem(retArr,i,1);
                }
            }
            // logger.info("72:"+JSON.stringify(retArr));
            
            let j=0;
            for(let i=0;i<retArr.length;i++){
                if(needDupChk){
                    if(!DupChecker.isDup(retArr[i].id.trim())) {
                        retObj[j] = retArr[i];
                        j++;
                        // logger.info("retArr["+i+"].id.trim():"+retArr[i].id.trim());
                    }
                }else{
                    retObj[j] = retArr[i];
                    j++;
                } 
            }
            DupChecker = null;
            // logger.info("85:"+JSON.stringify(retObj));
            if(needDupChk){
                logger.info("[ FB ] Before dup check:"+retArr.length);
                logger.info("[ FB ] After dup check:"+retObj.length);
            }
            // res.render('index', {goldBuy:goldBuy, goldSell:goldSell, pegGram:pegGram, pesGram:pesGram, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq,fbNews:retArr.
        }  // 7
    });
    return retObj;
};

module.exports = datum;
