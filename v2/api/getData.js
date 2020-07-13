const request = require('request');
const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const async = require('async');

const logger = require('../utils/logger');

const goldPriceOption = { 
    method:'GET', 
    url:'http://www.koreagoldx.co.kr/include/lineup.asp',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const pegPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au';

const pesPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag';

const btcPriceOption = { 
    url:'https://api.bithumb.com/public/ticker/BTC',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const ethPriceOption = { 
    url:'https://api.bithumb.com/public/ticker/ETH',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const DaumFinanceOption = { 
    url: 'http://finance.daum.net/api/global/today/',
    method : 'GET /api/global/today/ HTTP/1.1',
    Host: 'finance.daum.net',
    Connection: 'keep-alive',
    Pragma: 'no-cache',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    Cookie: 'ssab=; _ga=GA1.2.3326601.1583510482; _dfs=OGh6cFFoeGgxRk1td3pkU2Vrb2VuVFRXRkdmeG9MWjl2d0dLRERBNVRkRkFKaGh0MXoxNUZCS0lhVDhENVdZUWNqaThZMTBTNjZ4Zm9kbUJpckN6cUE9PS0tWnJMSndKaDIzemd1R1ZBa3JRa3FkQT09--4f88590e9aca0799b9b67e1cfc573474056fdf1c; TIARA=s155R_LBqM5qFUgp6SfUE8AoaKx3VTEb.WcssqVr58Gqf4HLwJudEJQ.Q-1yKriVe8UQUhZzpaJ35jC.pAynDQ00; _gid=GA1.2.101062231.1583670889; _gat_gtag_UA_128578811_1=1'
};

const BOKAssetPriceOption = "http://ecos.bok.or.kr/EIndex.jsp";

const BizKhanOption = "http://biz.khan.co.kr/";

const KospiPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI";
const KosdaqPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSDAQ";

var goldBuy;
var goldSell;
var pegGram;
var pesGram;
var pegDon;
var pesDon;
var btc;
var eth;
var excRateUSD;
var excRateJPY;
var excRateCNY;
var investRate;
var kospi;
var kosdaq;
var dji;
var nasdaq;
var s_p500;
var wti;

async function getGoldPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getGoldPrice");
            request(
                goldPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    try {
                        // something bad happens here
                        var result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
                        goldBuy = Number.parseFloat(result.Xml.data[0].buy.price._text);
                        goldSell = Number.parseFloat(result.Xml.data[0].sell.price._text);
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // 금 소매 살 때
                    // console.log("금 소매 살 때:"+goldBuy);
                    // 금 소매 팔 때
                    // console.log("금 소매 팔 때:"+goldSell);
                    // res.render('index')
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getPegPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            JSDOM.fromURL(pegPriceOpton).then(dom => {
                // console.log(dom.window.document.children[0].children[0].childElementCount);
                if((dom.window.document.children[0].children[0].childElementCount) == 6){
                    // console.log(dom.window.status);
                    pegGram = dom.window.document.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("v1_gold1")[0].innerHTML.trim();
                    // console.log(pegGram.replace('<![CDATA[','').replace(']]>',''));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pegGram = pegGram.replace('<![CDATA[','').replace(']]>','');
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = parseInt(pegGram)*1.03;
                    pegDon = parseInt(pegGram)*3.75;
                }
            }).catch(function(err){
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getPesPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            JSDOM.fromURL(pesPriceOpton).then(dom => {
                if((dom.window.document.children[0].children[0].childElementCount) == 6){
                    // console.log(dom.window.document.children[0].children[0].childElementCount);
                    pesGram = dom.window.document.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("v1_gold1")[0].innerHTML.trim();
                    // console.log(pegGram.replace('<![CDATA[','').replace(']]>',''));
                    var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
                    pesGram = pesGram.replace('<![CDATA[','').replace(']]>','');
                    pesGram = pesGram.replace( regExp , ""); 
                    pesGram = parseInt(pesGram)*1.05;
                    pesDon = parseInt(pesGram)*3.75;
                }
            }).catch(function(err){
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getBTCPrice() {
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
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        btc = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getETHPrice() {
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
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        eth = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum eth 기준시세
                    // console.log("Bithum eth 기준시세:"+eth);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getBokAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(BOKAssetPriceOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("ESdaily")[0];
                investRate = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                investRate = Number.parseFloat(investRate.replace(',',''));

                excRateUSD = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[3].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                excRateUSD = Number.parseFloat(excRateUSD.replace(',',''));

                excRateJPY = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                excRateJPY = Number.parseFloat(excRateJPY.replace(',',''));

                excRateCNY = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                excRateCNY = Number.parseFloat(excRateCNY.replace(',',''));
                // nasdaq = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                // nasdaq = Number.parseFloat(nasdaq.replace(',',''));

                // dji = obj.getElementsByTagName("table")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                // dji = Number.parseFloat(dji.replace(',',''));

                wti = obj.getElementsByTagName("table")[1].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                wti = Number.parseFloat(wti.replace(',',''));

                dubai = obj.getElementsByTagName("table")[1].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML.trim();
                dubai = Number.parseFloat(dubai.replace(',',''));


                // investRate = Number.parseFloat(new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(investRate).trim());
                
            }).catch(function(err){
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getGlobalPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(BizKhanOption).then(dom => {
                var obj = dom.window.document.getElementById("stockDisplay");
                // console.log(obj.getElementsByTagName("li")[3].textContent.split(" ")[1]);
                nasdaq = obj.getElementsByTagName("li")[3].textContent.split(" ")[1];
                nasdaq = Number.parseFloat(nasdaq.replace(',',''));

                dji = obj.getElementsByTagName("li")[2].textContent.split(" ")[1];
                dji = Number.parseFloat(dji.replace(',',''));
                
                
            }).catch(function(err){
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getKospiPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                KospiPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        // console.log((result.result.areas[0].datas[0].nv)/100);
                        kospi = (result.result.areas[0].datas[0].nv)/100;
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getKosdaqPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                KosdaqPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        kosdaq = (result.result.areas[0].datas[0].nv)/100;
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}
var datum = {};
datum.getData = function (req, res){
    var ret = [];
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
        }, 
        function(arg, callback) {
            callback(null, getKospiPrice());
        }, // 11
        function(arg, callback) {
            callback(null, getETHPrice());
        }, // 12
        function(arg, callback) {
            callback(null, getGlobalPrice());
        }, // 13
        function(arg, callback) {
            callback(null, getKosdaqPrice());
        } // 14
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            var keys = ["pegDon","pesDon","goldBuy","goldSell","excRateUSD","investRate","kospi","kosdaq","btc","eth","dji","nasdaq","wti","pegGram","pesGram","s_p500", "excRateCNY", "excRateJPY"];
            var values = [pegDon, pesDon, goldBuy, goldSell, excRateUSD, investRate, kospi, kosdaq, btc, eth, dji, nasdaq, wti, pegGram, pesGram, s_p500, excRateCNY, excRateJPY];
            // console.log(values);
            var unit = ["원/돈","원/돈","원/돈","원/돈","원/달러","%","point","point", "원/btc", "원/eth", "point","point","$/배럴", "원/g", "원/g", "point", "원/위안", "원/엔"];
            for(var i=0; i<keys.length; i++){
                var data;
                // console.log("values[i]:"+values[i]);
                data = {
                    "label":keys[i], 
                    "thisValue":values[i],
                    "unit":unit[i], 
                    "lastValue":0
                }
                ret.push(data);
            }

            res.render('apiWraper', {ret:ret});
            
        }  // 7
    });
};

module.exports = datum.getData;
