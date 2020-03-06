const async = require('async');
const rp = require('request-promise');
const removeItem = require('remove-array-items');

const fbFeedListOption = { 
    method:'GET', 
    url:'https://graph.facebook.com/v6.0/2819705001436386/feed?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD'
}
const feedCnt = 8;

var retArr = new Array();
var objArr;

var goldBuy;
var goldSell;
var pegGram;
var pesGram;
var pegDon;
var pesDon;
var btc;
var excRate;
var investRate;
var kospi;
var kosdaq;
var dji;
var nasdaq;
var dubai;

function custom_sort(a, b) {
    return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
}

async function getFbFeedList() {
    rp(
        fbFeedListOption
    ).then(
        await function (body) { 
            // if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            objArr = JSON.parse(body);
           // for(var subKey in objArr["data"]){
		    for(var subKey=0;subKey<objArr["data"].length;subKey++){
                getFbFeed(objArr["data"][subKey]["id"], subKey);
                
            }
            // console.log("fbFeed:"+retArr);
        }
    ).catch(function(err){
        throw err;
    })
}

async function getFbFeed(feedId, id) { 
    // console.log(feedId);
    rp(
        {
            // method:'GET', 
            uri:'https://graph.facebook.com/v6.0/'+feedId+'?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD&fields=permalink_url,picture,message,updated_time,created_time, status_type' 
        }
    ).then(
        await function(body) { 
            // if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            retArr[id] = JSON.parse(body);
        }
    ).catch(function(err){
        throw err;
    })
}

function getData(req, res){
    async.waterfall([
        function(callback) {
            callback(null, getFbFeedList());
        }
    ], function (err, result) {
        if(err){
            console.log('Error 발생');
        }else {
		retArr.sort(custom_sort);
            for(var i=0;i<retArr.length;i++){
                if(i == feedCnt){
                    removeItem(retArr,i,retArr.length-feedCnt);	
                    break;
                }else{
                    if(retArr[i].status_type=="wall_post"){
                        removeItem(retArr,i,1);
                    }
                }
            }
            // res.render('index', {goldBuy:goldBuy, goldSell:goldSell, pegGram:pegGram, pesGram:pesGram, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq,fbNews:retArr.
            var ret = {goldBuy:0, goldSell:0, pegDon:0, pesDon:0, btc:0, excRate:0, investRate:0, kospi:0, kosdaq:0, dji:0, nasdaq:0, wti:0, fbNews:retArr, pegGram:0, pesGram:0, dubai:0};
            res.render('index', ret);
        }  // 7
    });
};

module.exports = getData;
