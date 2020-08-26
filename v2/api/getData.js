'use strict'

const convert = require('xml-js');

const cheerio = require("cheerio");
const request = require('request-promise');

const async = require('async');

const logger = require('../utils/logger');

const goldPriceOption = { 
    method:'GET', 
    url:'http://www.koreagoldx.co.kr/include/lineup.asp',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'www.koreagoldx.co.kr',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
        'Cookie': 'ACEUACS=1580453742668741321; _ga=GA1.3.645744641.1594339639; ACEFCID=UID-5F07B14FC74F7EED1409808D; ASPSESSIONIDCATARBAD=ADBOMMABEBAMFKFCKMNMPFKD; ASPSESSIONIDACQARBAD=AJCCPKBBAFBELFOCMDCIEFJP'
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

const KospiPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI";
const KosdaqPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSDAQ";

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
            // console.log("getGoldPrice");
            request(
                goldPriceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    try {
                        // something bad happens here
                        const result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
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
            request(pegPriceOpton).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);

                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $item = $('result item v1_gold1');

                pegGram = $item.html();
               
                pegGram = pegGram.replace('<!--[CDATA[','').replace(']]-->','');
                pegGram = pegGram.replace( regExp , ""); 
                pegGram = Math.round(parseInt(pegGram)*1008)/1000;
                pegGram = Math.round(parseInt(pegGram)*103)/100;
                pegDon = Math.round(parseInt(pegGram)*375)/100;

            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getPesPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            request(pesPriceOpton).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
        
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $item = $('result item v1_gold1');
        
                pesGram = $item.html();
                
                pesGram = pesGram.replace('<!--[CDATA[','').replace(']]-->','');
                pesGram = pesGram.replace( regExp , ""); 
                pesGram = Math.round(parseInt(pesGram)*1013)/1000;
                pesGram = Math.round(parseInt(pesGram)*105)/100;
                pesDon = Math.round(parseInt(pesGram)*375)/100;
        
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
                        const result = JSON.parse(body);
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
                        const result = JSON.parse(body);
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
            request(BOKAssetPriceOption).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
                
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
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

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
        
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $itemList = $('ul#stockDisplay');
                
                nasdaq = $itemList.children().eq(3).text().split(" ")[1];
                nasdaq = Number.parseFloat(nasdaq.replace(',',''));
                
                dji = $itemList.children().eq(2).text().split(" ")[1];
                dji = Number.parseFloat(dji.replace(',',''));
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
                        const result = JSON.parse(body);
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
                        const result = JSON.parse(body);
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
let datum = {};
datum.getData = function (req, res){
    let ret = [];
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
            
        }  // 7
    });
};

module.exports = datum.getData;
