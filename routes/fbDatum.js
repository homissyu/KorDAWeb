const async = require('async');
const rp = require('request-promise');
const removeItem = require('remove-array-items');

var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
var timeStampVal = Math.round(yesterday.getTime()/1000); 
// console.log("timeStampVal:"+timeStampVal)
const feedCnt = 99;

const fbFeedListOption = { 
    method:'GET', 
    url:'https://graph.facebook.com/v6.0/2819705001436386/feed?limit='+feedCnt+'&since='+timeStampVal+'&fields=permalink_url,picture,updated_time,created_time,message,status_type&access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD'
}

var retArr = new Array();
var objArr;

function custom_sort(a, b) {
    return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
}

function getFbFeedList() {
    rp(
        fbFeedListOption
    ).then(
        function (body) { 
            objArr = JSON.parse(body);
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
        throw err;
    })
}

var datum = {};
datum.getData = function (req, res){
    async.waterfall([
        function(callback) {
            callback(null, getFbFeedList());
        }
    ], function (err, result) {
        // res.writeHead(200, {'Cache-Control': 'public, max-age=31536000'});
        if(err){
            console.log('Error 발생');
            res.socket.destroy();
        }else {
            retArr.sort(custom_sort);
            for(var i=0;i<retArr.length;i++){
                if("wall_post"==JSON.parse(JSON.stringify(retArr[i])).status_type || !(JSON.parse(JSON.stringify(retArr[i])).hasOwnProperty("permalink_url"))){
                    // console.log(JSON.parse(JSON.stringify(retArr[i])));
                    removeItem(retArr,i,1);
                }
            }
            // console.log(JSON.stringify(retArr));
            // console.log(retArr.length);
            // res.render('index', {goldBuy:goldBuy, goldSell:goldSell, pegGram:pegGram, pesGram:pesGram, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq,fbNews:retArr.
        }  // 7
    });
    return retArr;
};

module.exports = datum;
