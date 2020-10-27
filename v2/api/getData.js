'use strict'

const cheerio = require("cheerio");
const request = require('request-promise');

const async = require('async');

const logger = require('../utils/logger');

const priceOption = { 
    url:'https://pennygold.kr/3m/price'
};

const goldPriceOption = {
    method:'POST', 
    url:'http://api.koreagoldx.co.kr/api/price/lineUp/list',
    headers: {
        'Host': 'api.koreagoldx.co.kr',
        'Connection': 'keep-alive',
        'ontent-Length': '34',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Mobile Safari/537.36 Edg/86.0.622.51',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'http://m.exgold.godomall.com',
        'Referer': 'http://m.exgold.godomall.com/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8'
    },
    body : {srchDt : 'TODAY',type : 'Au'},
    json: true
};

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

const BOKAssetPriceOption = {
    url:'https://ecos.bok.or.kr/EIndex.jsp',
    headers: {
        'Host': 'ecos.bok.or.kr',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4238.2 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'frame',
        'Referer': 'https://ecos.bok.or.kr/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
        'Cookie': 'WMONID=s5XRUvrbiiu; _ga=GA1.3.256423616.1593514878; JSESSIONID=h8sfYiRlCkckMG5rL8hxETQFYoJEOmHbTV9ICZ0aBLJLK5Usv2xA!-1008973829!-1104678362; _gid=GA1.3.65889480.1598254361'
    }
};

const BizKhanOption = "http://biz.khan.co.kr/";

let goldBuy;
let goldSell;
let pegGram;
let pesGram;
let pegDon;
let pesDon;
let btc;
let eth;
let excRateUSD;
let excRateJPY;
let excRateCNY;
let investRate;
let kospi;
let kosdaq;
let dji;
let nasdaq;
let s_p500;
let wti;

const regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 

async function getGoldPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                goldPriceOption, 
                function(error, response, body) { 
                    try {
                        const result = JSON.parse(JSON.stringify(body));
                        goldBuy = result.lineUpVal[0].spure;
                        goldSell = result.lineUpVal[0].ppure;
                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getBTCPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                btcPriceOption, 
                function(error, response, body) { 
                    try {
                        const result = JSON.parse(body);
                        btc = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getETHPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                ethPriceOption, 
                function(error, response, body) { 
                    try {
                        const result = JSON.parse(body);
                        eth = Number.parseFloat(result.data.closing_price);
                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getBokAssetPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            request(BOKAssetPriceOption).then(function (html) {

                const $ = cheerio.load(html);
                
                const $itemList = $('div.ESdaily');

                investRate = $itemList.children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(1).text().trim();
                investRate = Number.parseFloat(investRate.replace(',',''));

                excRateUSD = $itemList.children('table').eq(0).children('tbody').eq(0).children('tr').eq(3).children('td').eq(1).text().trim();
                excRateUSD = Number.parseFloat(excRateUSD.replace(',',''));

                excRateJPY = $itemList.children('table').eq(0).children('tbody').eq(0).children('tr').eq(5).children('td').eq(1).text().trim();
                excRateJPY = Number.parseFloat(excRateJPY.replace(',',''));

                excRateCNY = $itemList.children('table').eq(0).children('tbody').eq(0).children('tr').eq(4).children('td').eq(1).text().trim();;
                excRateCNY = Number.parseFloat(excRateCNY.replace(',',''));
            })
            
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getGlobalPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            request(BizKhanOption).then(function (html) {

                const $ = cheerio.load(html);
        
                const $itemList = $('ul#stockDisplay');
                
                nasdaq = $itemList.children().eq(3).text().split(" ")[1];
                nasdaq = Number.parseFloat(nasdaq.replace(',',''));
                
                dji = $itemList.children().eq(2).text().split(" ")[1];
                dji = Number.parseFloat(dji.replace(',',''));
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                priceOption, 
                function(error, response, body) { 
                    try {
                        // something bad happens here
                        const result = JSON.parse(body);
                        //excRateUSD
                        excRateUSD = result.exchangeRates[0].stdPrice; 
                        // console.log("excRateUSD2:"+excRateUSD2); 
                        //kospi&kosdaq
                        if(result.indexes.kr.length > 0){
                            kospi = result.indexes.kr[0].price;
                            kosdaq = result.indexes.kr[1].price;
                        }else{
                            kospi = 0;
                            kosdaq = 0;
                        }
                        
                        // //dji
                        // console.log("dji:"+result.indexes.us[1].price);
                        // //nasdaq
                        // console.log("nasdaq:"+result.indexes.us[0].price);
                        // //s_p500
                        // console.log("s_p500:"+result.indexes.us[2].price);
                        //wti
                        wti = result.indexes.oil[0].price;
                        // console.log("wti:"+wti2);
                        //pegGram
                        
                        pegGram = result.markets[0].krPrice;
                        pegGram = Math.round(parseInt(pegGram)*1008)/1000;
                        pegGram = Math.round(parseInt(pegGram)*103)/100;
                        // console.log("pegGram:"+pegGram2);
                        //pesGram
                        pesGram = result.markets[1].krPrice;
                        pesGram = Math.round(parseInt(pesGram)*1013)/1000;
                        pesGram = Math.round(parseInt(pesGram)*105)/100;
                        // console.log("pesGram:"+pesGram);
                        //pegDon
                        pegDon = Math.round(parseInt(pegGram)*375)/100;
                        // console.log("pegDon:"+pegDon);
                        //pesDon
                        pesDon = Math.round(parseInt(pesGram)*375)/100;
                        // console.log("pesDon:"+pesDon);
                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

let datum = {};
datum.getData = function (req, res){
    let ret = [];
    async.waterfall([
        function(callback) {
            callback(null, getGoldPrice());
        },
        function(arg, callback) {
            callback(null, getBTCPrice());
        },
        function(arg, callback) {
            callback(null, getBokAssetPrice());
        }, 
        function(arg, callback) {
            callback(null, getETHPrice());
        },
        function(arg, callback) {
            callback(null, getGlobalPrice());
        }, 
        function(arg, callback) {
            callback(null, getPrice());
        }
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            const keys = ["pegDon","pesDon","goldBuy","goldSell","excRateUSD","investRate","kospi","kosdaq","btc","eth","dji","nasdaq","wti","pegGram","pesGram","s_p500", "excRateCNY", "excRateJPY"];
            const values = [pegDon, pesDon, goldBuy, goldSell, excRateUSD, investRate, kospi, kosdaq, btc, eth, dji, nasdaq, wti, pegGram, pesGram, s_p500, excRateCNY, excRateJPY];
            // console.log(values);
            const unit = ["원/돈","원/돈","원/돈","원/돈","원/달러","%","point","point", "원/btc", "원/eth", "point","point","$/배럴", "원/g", "원/g", "point", "원/위안", "원/엔"];
            for(let i=0; i<keys.length; i++){
                let data;
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
            
        } 
    });
};

module.exports = datum.getData;
