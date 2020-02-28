const request = require('request');
const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const xmldomParser = require("xmldom").DOMParser;

const goldPriceOption = { 
    method:'GET', 
    url:'http://www.koreagoldx.co.kr/include/lineup.asp'
}

const pegPriceOpton = { 
    method:'GET', 
    url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au'
}

const btcPriceOption = { 
    method:'GET', 
    url:'https://api.bithumb.com/public/ticker/BTC'
}

const ETCAssetPriceOption = "http://ecos.bok.or.kr/EIndex.jsp";

const fbFeedListOption = { 
    method:'GET', 
    url:'https://graph.facebook.com/v6.0/2819705001436386/feed?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD'
}
const feedCnt = 10;

var promises;

var retArr = new Array();
var objArr;

var goldBuy;
var goldSell;
var pegGram;
var pegDon;
var btc;
var excRate;
var investRate;
var kospi;
var kosdaq;

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
                    goldBuy = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldBuy);
                    goldSell = result.Xml.data[0].sell.price._text;
                    goldSell = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldSell);
                    // 금 소매 살 때
                    console.log("금 소매 살 때:"+goldBuy);
                    // 금 소매 팔 때
                    console.log("금 소매 팔 때:"+goldSell);
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
            request(
                pegPriceOpton, 
                function(error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    
                    // e금 기준시세
                    var doc = new xmldomParser().parseFromString(body,'text/xml');
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pegGram = doc.getElementsByTagName("v1_gold1")[0].lastChild.data;
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = parseInt(pegGram)*1.03;
                    pegDon = parseInt(pegGram)*3.75;
                    pegGram = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(pegGram);
                    pegDon = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(pegDon);
                    console.log("e금 기준시세(g):"+pegGram);
                    console.log("e금 기준시세(돈):"+pegDon);
                }
            )
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
                    btc = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(btc);
                    // Bithum btc 기준시세
                    console.log("Bithum btc 기준시세:"+btc);
                }
            )
        )
    })
}

function getEtcAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getEtcAssetPrice");
            JSDOM.fromURL(ETCAssetPriceOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("ESdaily")[0].getElementsByTagName("table")[0].getElementsByTagName("tr");
                investRate = obj[1].getElementsByTagName("a")[1].innerHTML.trim()+"%";
                // investRate = new Intl.NumberFormat('en-IN', { style: 'percent'}).format(investRate);
                console.log("원/달러 환율:"+excRate);
                excRate = obj[3].getElementsByTagName("a")[1].innerHTML.trim();
                excRate = "₩"+new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(excRate);
                console.log("국고채 3년만기:"+investRate);
                kospi = obj[6].getElementsByTagName("a")[1].innerHTML.trim();
                kospi = new Intl.NumberFormat('ko-KR', { style: 'decimal'}).format(kospi);
                console.log("KOSPI:"+kospi);
                kosdaq = obj[7].getElementsByTagName("a")[1].innerHTML.trim();
                kosdaq = new Intl.NumberFormat('ko-KR', { style: 'decimal'}).format(kosdaq);
                console.log("KOSDAQ:"+kosdaq);
            })   
        )
    })
}

function getFbFeedList() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                fbFeedListOption,
                function (error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    objArr = JSON.parse(body);
                    for(var subKey in objArr["data"]){
                        if(subKey<feedCnt){
                            promises.push(getFbFeed(objArr["data"][subKey]["id"], subKey));
                        }else{
                            break;
                        }
                    }
                    console.log("fbFeed:"+retArr);
                    console.log(promises.length);
                }
            )
        )
    })
}

function getFbFeed(feedId, id) { 
    // console.log(feedId);
    return new Promise(function(resolve, reject){
        resolve(
            request(
                {
                    method:'GET', 
                    uri:'https://graph.facebook.com/v6.0/'+feedId+'?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD&fields=permalink_url,picture,message,updated_time,created_time' 
                }, 
                function(error, response, body) { 
                    if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    retArr[id] = JSON.parse(body);
                }
            )
        )
    });
}

function getData(req, res){
    promises = [];

    console.log(promises.length); 
    promises.push(getGoldPrice());
    promises.push(getPegPrice());
    promises.push(getBTCPrice());
    promises.push(getEtcAssetPrice());
    promises.push(getFbFeedList());
    console.log(promises.length);

    Promise.all(promises).then(function(values){
        res.render('index', {goldBuy:goldBuy, goldSell:goldSell, pegGram:pegGram, pegDon:pegDon, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq, fbNews:retArr.sort(custom_sort) })
        // console.log("All done", values);
    }).catch((e) => {
        // Handle errors here
    });
};

module.exports = getData;