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
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    var result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
                    goldBuy = result.Xml.data[0].buy.price._text;
                    goldBuy = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldBuy).trim();
                    goldSell = result.Xml.data[0].sell.price._text;
                    goldSell = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(goldSell).trim();
                    // 금 소매 살 때
                    // console.log("금 소매 살 때:"+goldBuy);
                    // 금 소매 팔 때
                    // console.log("금 소매 팔 때:"+goldSell);
                    // res.render('index')
                }
            )
        ).reject(new Error('fail')).catch(() => {});
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
                    console.log("_____________________________________"+body);
                    
                    // e금 기준시세
                    var doc = JSON.parse(convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4}));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pegGram = doc.result.item.v1_gold1._cdata;
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = parseInt(pegGram)*1.03;
                    pegDon = parseInt(pegGram)*3.75;
                    pegGram = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pegGram).trim();
                    pegDon = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pegDon).trim();
                    // console.log("e금 기준시세(g):"+pegGram);
                    
                    // console.log("e금 기준시세(돈):"+pegDon);
                }
            ).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
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
                    console.log("_____________________________________"+body);
                    
                    // e금 기준시세
                    var doc = JSON.parse(convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4}));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pesGram = doc.result.item.v1_gold1._cdata;
                    pesGram = pesGram.replace( regExp , ""); 
                    pesGram = parseInt(pesGram)*1.05;
                    pesDon = parseInt(pesGram)*3.75;
                    pesGram = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pesGram).trim();
                    pesDon = new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 0}).format(pesDon).trim();
                    // console.log("e은 기준시세(g):"+pesGram);
                    // console.log("e금 기준시세(돈):"+pesDon);
                }
            ).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
    });
}

function getBTCPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                btcPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    var result = JSON.parse(body);
                    // console.log(result);
                    btc = result.data.closing_price;
                    btc = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(btc).trim();
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getETHPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                ethPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    var result = JSON.parse(body);
                    // console.log(result);
                    eth = result.data.closing_price;
                    eth = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(eth).trim();
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getBokAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(BOKAssetPriceOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("ESdaily")[0];
                investRate = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                investRate = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(investRate).trim();

                dubai = obj.getElementsByTagName("table")[1].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                dubai = new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(dubai).trim();

            }).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
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
                kospi = kospi.split("<em")[0].trim();;
                
                kosdaq = obj[1].innerHTML.trim();
                kosdaq = kosdaq.split("</span>")[1];
                kosdaq = kosdaq.split("<em")[0].trim();;

                dji = obj[2].innerHTML.trim();
                dji = dji.split("</span>")[1];
                dji = dji.split("<em")[0].trim();;
                
                nasdaq = obj[3].innerHTML.trim();
                nasdaq = nasdaq.split("</span>")[1];
                nasdaq = nasdaq.split("<em")[0].trim();;
                
                excRate = obj[4].innerHTML.trim();
                excRate = excRate.split("</span>")[1];
                excRate = excRate.split("<em")[0].trim();;
            }).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
    })
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
            callback(null, getKhanAssetPrice());
        } // 6
    ], function (err, result) {
        if(err){
            console.log('Error 발생');
            throw err;
        }else {
            var ret = [];
            var keys = ["pegDon","pesDon","goldBuy","goldSell","excRate","investRate","kospi","kosdaq","dji","nasdaq","btc","dubai","eth","pegGram","pesGram"];
            var values = [pegDon, pesDon, goldBuy, goldSell, excRate, investRate, kospi, kosdaq, dji, nasdaq, btc, dubai, eth, pegGram, pesGram];
            var unit = ["원/돈","원/돈","원/돈","원/돈","원/$","%","point","point", "point","point", "원/btc","$/배럴", "원/eth","원/g","원/g"];
            for(var i=0; i<keys.length; i++){
                var data;
                data = {
                    "label":keys[i], 
                    "thisValue":values[i],
                    "unit":unit[i], 
                    "lastValue":""
                }
                ret.push(data);
            }

            res.render('getData', {ret:ret});
        }  // 7
    });
};

module.exports = sendData;
