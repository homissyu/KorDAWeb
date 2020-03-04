const request = require('request');
const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const async = require('async');
const rp = require('request-promise');

const goldPriceOption = { 
    method:'GET', 
    url:'http://www.koreagoldx.co.kr/include/lineup.asp'
}

const pegPriceOpton = { 
    // method:'GET', 
    url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au'
}

const pesPriceOpton = { 
    // method:'GET', 
    url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag'
}

const btcPriceOption = { 
    // method:'GET', 
    url:'https://api.bithumb.com/public/ticker/BTC'
}

const ethPriceOption = { 
    // method:'GET', 
    url:'https://api.bithumb.com/public/ticker/ETH'
}

const BOKAssetPriceOption = "http://ecos.bok.or.kr/EIndex.jsp";

const KhanAssetPriceOption = "http://biz.khan.co.kr/";

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
var eth;
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

function getGoldPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getGoldPrice");
            request(
                goldPriceOption, 
                function(error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    var result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
                    goldBuy = result.Xml.data[0].buy.price._text;
                    goldBuy = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldBuy);
                    goldSell = result.Xml.data[0].sell.price._text;
                    goldSell = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldSell);
                    // 금 소매 살 때
                    // console.log("금 소매 살 때:"+goldBuy);
                    // 금 소매 팔 때
                    // console.log("금 소매 팔 때:"+goldSell);
                    // res.render('index')
                }
            )
        )
    });
}

function getPegPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            rp(
                pegPriceOpton
            ).then(function(body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    
                    // e금 기준시세
                    var doc = JSON.parse(convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4}));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pegGram = doc.result.item.v1_gold1._cdata;
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = parseInt(pegGram)*1.03;
                    pegDon = parseInt(pegGram)*3.75;
                    pegGram = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pegGram);
                    pegDon = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pegDon);
                    // console.log("e금 기준시세(g):"+pegGram);
                    
                    // console.log("e금 기준시세(돈):"+pegDon);
                }
            ).catch(function(err){
                throw err;
            })
        )
    })
}

function getPesPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            rp(
                pesPriceOpton
            ).then(function(body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    
                    // e금 기준시세
                    var doc = JSON.parse(convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4}));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pesGram = doc.result.item.v1_gold1._cdata;
                    pesGram = pesGram.replace( regExp , ""); 
                    pesGram = parseInt(pesGram)*1.05;
                    pesDon = parseInt(pesGram)*3.75;
                    pesGram = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pesGram);
                    pesDon = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pesDon);
                    // console.log("e은 기준시세(g):"+pesGram);
                    // console.log("e금 기준시세(돈):"+pesDon);
                }
            ).catch(function(err){
                throw err;
            })
        )
    });
}

function getBTCPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                btcPriceOption, 
                function(error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    var result = JSON.parse(body);
                    // console.log(result);
                    btc = result.data.closing_price;
                    btc = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(btc);
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        )
    })
}

function getETHPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                ethPriceOption, 
                function(error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    var result = JSON.parse(body);
                    // console.log(result);
                    eth = result.data.closing_price;
                    eth = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(eth);
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        )
    })
}

function getBokAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(BOKAssetPriceOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("ESdaily")[0];
                investRate = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                investRate = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(investRate);

                dubai = obj.getElementsByTagName("table")[1].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                dubai = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(dubai);

            })   
        )
    })
}

function getKhanAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getEtcAssetPrice");
            JSDOM.fromURL(KhanAssetPriceOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("economyBar")[0].getElementsByTagName("li");
                kospi = obj[0].innerHTML.trim();
                kospi = kospi.split("</span>")[1];
                kospi = kospi.split("<em")[0];
                
                kosdaq = obj[1].innerHTML.trim();
                kosdaq = kosdaq.split("</span>")[1];
                kosdaq = kosdaq.split("<em")[0];

                dji = obj[2].innerHTML.trim();
                dji = dji.split("</span>")[1];
                dji = dji.split("<em")[0];
                
                nasdaq = obj[3].innerHTML.trim();
                nasdaq = nasdaq.split("</span>")[1];
                nasdaq = nasdaq.split("<em")[0];
                
                excRate = obj[4].innerHTML.trim();
                excRate = excRate.split("</span>")[1];
                excRate = excRate.split("<em")[0];
            })   
        )
    })
}

async function getFbFeedList() {
    request(
        fbFeedListOption,
        await function (err,response, body) { 
            // if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            objArr = JSON.parse(body);
            for(var subKey in objArr["data"]){
                if(subKey<feedCnt){
                    getFbFeed(objArr["data"][subKey]["id"], subKey);
                }else{
                    break;
                }
            }
            // console.log("fbFeed:"+retArr);
        }
    )
}

async function getFbFeed(feedId, id) { 
    // console.log(feedId);
    request(
        {
            method:'GET', 
            uri:'https://graph.facebook.com/v6.0/'+feedId+'?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD&fields=permalink_url,picture,message,updated_time,created_time' 
        }, 
        await function(err,response, body) { 
            // if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            retArr[id] = JSON.parse(body);
        }
    )
}

function sendData(req, res){
    async.waterfall([
        function(callback) {
            callback(null, getGoldPrice());
        }, // 1 
        function(arg,callback) {
            callback(null, getPegPrice());
        }, // 2 
        function(arg, callback) {
            callback(null, getPesPrice());
        }, // 3
        function(arg, callback) {
            callback(null, getBTCPrice());
        }, // 4
        function(arg, callback) {
            callback(null, getBokAssetPrice());
        }, // 5
        function(arg, callback) {
            callback(null, getFbFeedList());
        }, // 6
        function(arg, callback) {
            callback(null, getKhanAssetPrice());
        }
    ], function (err, result) {
        if(err){
            console.log('Error 발생');
            throw err;
        }else {
            var ret = {
                goldBuy:goldBuy, 
                goldSell:goldSell, 
                
                // pegGram:pegGram, 
                // pesGram:pesGram, 
                
                pegDon:pegDon, 
                pesDon:pesDon, 
                
                excRate:excRate, 
                investRate:investRate, 
                
                kospi:kospi, 
                kosdaq:kosdaq, 
                
                dji:dji, 
                nasdaq:nasdaq, 
                
                btc:btc, 
                dubai:dubai
            };
            res.render('getData', {ret:ret});
        }  // 7
    });
};

module.exports = sendData;