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

// const pegPriceOpton = { 
//     // method:'GET', 
//     url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au'
// }

const pegPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au';

// const pesPriceOpton = { 
//     // method:'GET', 
//     url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag'
// }

const pesPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag';

const btcPriceOption = { 
    // method:'GET', 
    url:'https://api.bithumb.com/public/ticker/BTC'
}

const ethPriceOption = { 
    // method:'GET', 
    url:'https://api.bithumb.com/public/ticker/ETH'
}

const BOKAssetPriceOption = "http://ecos.bok.or.kr/EIndex.jsp";
const ComoditiesPriceOption = "https://kr.investing.com/commodities/real-time-futures";
const CurrencyPriceOption = "https://kr.investing.com/currencies/single-currency-crosses";
const MajorIndicesOption = "https://kr.investing.com/indices/major-indices";
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
var excRate;
var investRate;
var kospi;
var kosdaq;
var dji;
var nasdaq;
var s_p500;
// var dubai;
var wti;

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
                    try {
                        // something bad happens here
                        var result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
                        goldBuy = Number.parseFloat(result.Xml.data[0].buy.price._text);
                        goldSell = Number.parseFloat(result.Xml.data[0].sell.price._text);
                    } catch (err) {
                        console.error(err) // decide what you want to do here
                        throw err;
                    }
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
                throw err;
            })
            // rp(
            //     pegPriceOpton
            // ).then(function(body) { 
            //         // if(error){throw error;} 
            //         // console.error('error', error);
            //         // console.log('statusCode:', response && response.statusCode); 
            //         // console.log("_____________________________________"+body);
                    
            //         // e금 기준시세
            //         try {
            //             // something bad happens here
            //             var doc = JSON.parse(
            //                 convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4})
            //             );
            //             var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
            //             pegGram = doc.result.item.v1_gold1._cdata;
            //             pegGram = pegGram.replace( regExp , ""); 
            //             pegGram = parseInt(pegGram)*1.03;
            //             pegDon = parseInt(pegGram)*3.75;
            //         } catch (err) {
            //             console.log("_____________________________________"+body);
            //             console.error(err) // decide what you want to do here
            //             throw err;
            //         }
            //         // console.log("e금 기준시세(g):"+pegGram);
            //         // console.log("e금 기준시세(돈):"+pegDon);
            //     }
            // ).catch(function(err){
            //     throw err;
            // })
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getPesPrice(){
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
                    pesGram = parseInt(pesGram)*1.03;
                    pesDon = parseInt(pesGram)*3.75;
                }
            }).catch(function(err){
                throw err;
            })

            // rp(
            //     pesPriceOpton
            // ).then(function(body) { 
            //         // if(error){throw error;} 
            //         // console.error('error', error);
            //         // console.log('statusCode:', response && response.statusCode); 
            //         // console.log("_____________________________________"+body);
                    
            //         // e금 기준시세
            //         try {
            //             // something bad happens here
            //             var doc = JSON.parse(convert.xml2json(body,{compact: true, ignoreDeclaration: true, spaces: 4}));
            //             var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
            //             pesGram = doc.result.item.v1_gold1._cdata;
            //             pesGram = pesGram.replace( regExp , ""); 
            //             pesGram = parseInt(pesGram)*1.05;
            //             pesDon = parseInt(pesGram)*3.75;
            //         } catch (err) {
            //             console.error(err) // decide what you want to do here
            //             throw err;
            //         }
            //         // console.log("e은 기준시세(g):"+pesGram);
            //         // console.log("e금 기준시세(돈):"+pesDon);
            //     }
            // ).catch(function(err){
            //     throw err;
            // })
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
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        btc = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        console.error(err) // decide what you want to do here
                        throw err;
                    }
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
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        eth = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        console.error(err) // decide what you want to do here
                        throw err;
                    }
                    // Bithum eth 기준시세
                    // console.log("Bithum eth 기준시세:"+eth);
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
                investRate = Number.parseFloat(investRate.replace(',',''));
                // investRate = Number.parseFloat(new Intl.NumberFormat('en-IN', { style: 'decimal'}).format(investRate).trim());

            }).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getComoditiesPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(ComoditiesPriceOption).then(dom => {
                wti = dom.window.document.getElementsByClassName("pid-8849-last")[0].innerHTML.trim();
                wti = Number.parseFloat(wti.replace(',',''));
            }).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getKospiPrice() {
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
                        console.error(err) // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getKosdaqPrice() {
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
                        console.error(err) // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getMajorIndices(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getEtcAssetPrice");
            JSDOM.fromURL(MajorIndicesOption).then(dom => {
                dji = dom.window.document.getElementsByClassName("pid-169-last")[0].innerHTML.trim();
                dji = Number.parseFloat(dji.replace(',',''));
                
                nasdaq = dom.window.document.getElementsByClassName("pid-14958-last")[0].innerHTML.trim();
                nasdaq = Number.parseFloat(nasdaq.replace(',',''));

                s_p500 = dom.window.document.getElementsByClassName("pid-166-last")[0].innerHTML.trim();
                s_p500 = Number.parseFloat(s_p500.replace(',',''));
            }).catch(function(err){
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {});
    })
}

function getCurrencyPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getEtcAssetPrice");
            JSDOM.fromURL(CurrencyPriceOption).then(dom => {
                excRate = dom.window.document.getElementsByClassName("pid-650-bid")[0].innerHTML.trim();
                excRate = Number.parseFloat(excRate.replace(',',''));
                // excRate = Number.parseFloat(excRate.split("<em")[0].trim());
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
            callback(null, getCurrencyPrice());
        }, // 6
        function(arg, callback) {
            callback(null, getMajorIndices());
        }, // 7
        function(arg, callback) {
            callback(null, getComoditiesPrice());
        }, // 8
        function(arg, callback) {
            callback(null, getKospiPrice());
        }, // 9
        function(arg, callback) {
            callback(null, getKosdaqPrice());
        } // 10
    ], function (err, result) {
        if(err){
            console.log('Error 발생');
            throw err;
        }else {
            var ret = [];
            var keys = ["pegDon","pesDon","goldBuy","goldSell","excRate","investRate","kospi","kosdaq","dji","nasdaq","btc","wti","pegGram","pesGram","s_p500"];
            var values = [pegDon, pesDon, goldBuy, goldSell, excRate, investRate, kospi, kosdaq, dji, nasdaq, btc, wti, pegGram, pesGram, s_p500];
            // console.log(values);
            var unit = ["원/돈","원/돈","원/돈","원/돈","원/$","%","point","point", "point","point", "원/btc","$/배럴", "원/g", "원/g", "point"];
            for(var i=0; i<keys.length; i++){
                var data;
                data = {
                    "label":keys[i], 
                    "thisValue":values[i],
                    "unit":unit[i], 
                    "lastValue":0
                }
                ret.push(data);
            }

            res.render('getData', {ret:ret});
        }  // 7
    });
};

module.exports = sendData;
