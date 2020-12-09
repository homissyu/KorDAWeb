'use strict'

const request = require('request');
// const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const async = require('async');

const logger = require('../utils/logger');

// const goldPriceOption = { 
//     method:'GET', 
//     url:'http://www.koreagoldx.co.kr/include/lineup.asp',
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Host': 'www.koreagoldx.co.kr',
//         'Connection': 'keep-alive',
//         'Pragma': 'no-cache',
//         'Cache-Control': 'no-cache',
//         'Upgrade-Insecure-Requests': '1',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//         'Accept-Encoding': 'gzip, deflate',
//         'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
//         'Cookie': 'ACEUACS=1580453742668741321; _ga=GA1.3.645744641.1594339639; ACEFCID=UID-5F07B14FC74F7EED1409808D; ASPSESSIONIDCATARBAD=ADBOMMABEBAMFKFCKMNMPFKD; ASPSESSIONIDACQARBAD=AJCCPKBBAFBELFOCMDCIEFJP'
//     }
// };

const goldPriceOptionNew = {
    method:'POST', 
    url:'http://apiserver.koreagoldx.co.kr/api/price/lineUp/list',
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

// const pegPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au';

// const pesPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag';

const lastPegPriceOpton = "http://www.exgold.co.kr/spot_price.htm?s_gubun=Au&s_unit=out&s_range=M";
const lastPesPriceOpton = "http://www.exgold.co.kr/spot_price.htm?s_gubun=Ag&s_unit=out&s_range=M";

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

const MKOption = "http://vip.mk.co.kr/newSt/rate";

// const KospiPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI";
// const KosdaqPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSDAQ";

let gold24Buy;
let gold24Sell;
let gold18Sell;
let gold14Sell;
let silverBuy;
let silverSell;

let gold24BuyLast;
let gold24SellLast;
let gold18SellLast;
let gold14SellLast;
let silverBuyLast;
let silverSellLast;

let gold24BuyGap;
let gold24SellGap;
let gold18SellGap;
let gold14SellGap;
let silverBuyGap;
let silverSellGap;

let pegGram;
let pesGram;
let pegDon;
let pesDon;

let pegGramLast;
let pesGramLast;
let pegDonLast;
let pesDonLast;

let pegGramGap;
let pesGramGap;
let pegDonGap;
let pesDonGap;

let btc;
let eth;

let btcLast;
let ethLast;

let btcGap;
let ethGap;

let excRateUSD;
let excRateJPY;
let excRateCNY;
let excRateEUR;
let interestRateCall;
let interestRateCD;
let interestRateUS;

let excRateUSDLast;
let excRateJPYLast;
let excRateCNYLast;
let excRateEURLast;
let interestRateCallLast;
let interestRateCDLast;
let interestRateUSLast;

let excRateUSDGap;
let excRateJPYGap;
let excRateCNYGap;
let excRateEURGap;
let interestRateCallGap;
let interestRateCDGap;
let interestRateUSGap;

let dji;
let nasdaq;
let wti;

let djiLast;
let nasdaqLast;
let wtiLast;

let djiGap;
let nasdaqGap;
let wtiGap;

let kospi;
let kosdaq;

let kospiLast;
let kosdaqLast;

let kospiGap
let kosdaqGap;

const regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 

// async function getGoldPrice() {
//     return new Promise(function(resolve, reject){
//         resolve(
//             // console.log("getGoldPrice");
//             request(
//                 goldPriceOption, 
//                 function(error, response, body) { 
//                     // if(error){throw error;} 
//                     // console.error('error', error);
//                     // console.log('statusCode:', response && response.statusCode); 
//                     try {
//                         // something bad happens here
//                         const result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
                        
//                         gold24Buy = Number.parseFloat(result.Xml.data[0].buy.price._text);
//                         gold24Sell = Number.parseFloat(result.Xml.data[0].sell.price._text);
//                         gold18Sell = Number.parseFloat(result.Xml.data[1].sell.price._text);
//                         gold14Sell = Number.parseFloat(result.Xml.data[2].sell.price._text);
//                         silverBuy = Number.parseFloat(result.Xml.data[4].buy.price._text);
//                         silverSell = Number.parseFloat(result.Xml.data[4].sell.price._text);

//                         gold24BuyGap = Number.parseFloat(result.Xml.data[0].buy.icon._attributes.num);
//                         if(result.Xml.data[0].buy.icon._text == "3") gold24BuyGap = gold24BuyGap * -1;
                        
//                         gold24SellGap = Number.parseFloat(result.Xml.data[0].sell.icon._attributes.num);
//                         if(result.Xml.data[0].buy.icon._text == "3") gold24SellGap = gold24SellGap * -1;

//                         gold18SellGap = Number.parseFloat(result.Xml.data[1].buy.icon._attributes.num);
//                         if(result.Xml.data[1].buy.icon._text == "3") gold18SellGap = gold18SellGap * -1;

//                         gold14SellGap = Number.parseFloat(result.Xml.data[2].sell.icon._attributes.num);
//                         if(result.Xml.data[2].buy.icon._text == "3") gold14SellGap = gold14SellGap * -1;

//                         silverBuyGap = Number.parseFloat(result.Xml.data[4].buy.icon._attributes.num);
//                         if(result.Xml.data[4].buy.icon._text == "3") silverBuyGap = silverBuyGap * -1;
                        
//                         silverSellGap = Number.parseFloat(result.Xml.data[4].sell.icon._attributes.num);
//                         if(result.Xml.data[4].buy.icon._text == "3") silverSellGap = silverSellGap * -1;

//                         gold24BuyLast = gold24Buy - gold24BuyGap;

//                         gold24SellLast = gold24Sell - gold24SellGap;

//                         gold18SellLast = gold18Sell - gold18SellGap;

//                         gold14SellLast = gold14Sell - gold14SellGap;

//                         silverBuyLast = silverBuy - silverBuyGap;
                        
//                         silverSellLast = silverSell - silverSellGap;

                        
                        
//                         // if(gold24BuyLast>0) gold24BuyLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyLast);
//                         // else if(gold24BuyLast<0) gold24BuyLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyLast);
//                         // else gold24BuyLast = "0.00";

//                         // if(gold24SellLast>0) gold24SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellLast);
//                         // else if(gold24SellLast<0) gold24SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellLast);
//                         // else gold24SellLast = "0.00";

//                         // if(gold18SellLast>0) gold18SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellLast);
//                         // else if(gold18SellLast<0) gold18SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellLast);
//                         // else gold18SellLast = "0.00";

//                         // if(gold14SellLast>0) gold14SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellLast);
//                         // else if(gold14SellLast<0) gold14SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellLast);
//                         // else gold14SellLast = "0.00";

//                         // if(silverBuyLast>0) silverBuyLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyLast);
//                         // else if(silverBuyLast<0) silverBuyLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyLast);
//                         // else silverBuyLast = "0.00";

//                         // if(silverSellLast>0) silverSellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellLast);
//                         // else if(silverSellLast<0) silverSellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellLast);
//                         // else silverSellLast = "0.00";

//                     } catch (err) {
//                         // if(!response.socket.destroyed) response.socket.destroy();
//                         logger.error(err); // decide what you want to do here
//                         throw err;
//                     }
//                     // 금 소매 살 때
//                     // console.log("금 소매 살 때:"+goldBuy);
//                     // 금 소매 팔 때
//                     // console.log("금 소매 팔 때:"+goldSell);
//                     // res.render('index')
//                 }
//             )
//         ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
//     });
// }

async function getGoldPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                goldPriceOptionNew, 
                function(error, response, body) { 
                    try {
                        // something bad happens here
                        const result = JSON.parse(JSON.stringify(body));
                        gold24Buy = result.lineUpVal[0].spure;
                        gold24Sell = result.lineUpVal[0].ppure;
                        gold18Sell = result.lineUpVal[0].p18k;
                        gold14Sell = result.lineUpVal[0].p14k;
                        silverBuy = result.lineUpVal[0].ssilver;
                        silverSell = result.lineUpVal[0].psilver;

                        gold24BuyGap = result.lineUpVal[0].turmPure;
                        if(result.lineUpVal[0].updownPure == "-") gold24BuyGap = gold24BuyGap * -1;
                        
                        gold24SellGap = result.lineUpVal[0].pturmPure;
                        if(result.lineUpVal[0].pupdownPure == "-") gold24SellGap = gold24SellGap * -1;

                        gold18SellGap = result.lineUpVal[0].pturm18k;
                        if(result.lineUpVal[0].pupdown18k == "-") gold18SellGap = gold18SellGap * -1;

                        gold14SellGap = result.lineUpVal[0].pturm14k;
                        if(result.lineUpVal[0].pupdown14k == "-") gold14SellGap = gold14SellGap * -1;

                        silverBuyGap = result.lineUpVal[0].turmSilver;
                        if(result.lineUpVal[0].updownSilver == "-") silverBuyGap = silverBuyGap * -1;
                        
                        silverSellGap = result.lineUpVal[0].pturmSilver;
                        if(result.lineUpVal[0].pupdownSilver == "-") silverSellGap = silverSellGap * -1;

                        gold24BuyLast = gold24Buy - gold24BuyGap;

                        gold24SellLast = gold24Sell - gold24SellGap;

                        gold18SellLast = gold18Sell - gold18SellGap;

                        gold14SellLast = gold14Sell - gold14SellGap;

                        silverBuyLast = silverBuy - silverBuyGap;
                        
                        silverSellLast = silverSell - silverSellGap;
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

const priceOption = { 
    url:'https://pennygold.kr/3m/price'
};
async function getPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBTCPrice");
            request(
                priceOption, 
                function(error, response, body) { 
                    // if(error){throw error;} 
                    // console.error('error', error);
                    // console.log('statusCode:', response && response.statusCode); 
                    // console.log(body);
                    try {
                        // something bad happens here
                        const result = JSON.parse(body);
                        //excRateUSD
                        // excRateUSD = result.exchangeRates[0].stdPrice; 
                        // console.log("excRateUSD2:"+excRateUSD2); 
                        
                        //kospi&kosdaq
                        if(result.indexes.kr.length > 0){
                            kospi = result.indexes.kr[0].price;
                            kospiGap = result.indexes.kr[0].fluc;
                            
                            kosdaq = result.indexes.kr[1].price;
                            kosdaqGap = result.indexes.kr[1].fluc;
                        }else{
                            kospi = 0;
                            kospiGap = 0;
                            kosdaq = 0;
                            kosdaqGap = 0;
                        }
                        
                        // //dji
                        // console.log("dji:"+result.indexes.us[1].price);
                        // //nasdaq
                        // console.log("nasdaq:"+result.indexes.us[0].price);
                        // //s_p500
                        // console.log("s_p500:"+result.indexes.us[2].price);
                        //wti
                        // wti = result.indexes.oil[0].price;
                        // wtiGap = result.indexes.oil[0].fluc;
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
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

// async function getPegPrice(){
//     return new Promise(function(resolve, reject){
//         resolve(
//             // console.log("getPegPrice");
//             JSDOM.fromURL(pegPriceOpton).then(dom => {
//                 // console.log(dom.window.document.children[0].children[0].childElementCount);
//                 if((dom.window.document.children[0].children[0].childElementCount) == 6){
//                     // console.log(dom.window.status);
//                     pegGram = dom.window.document.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("v1_gold1")[0].innerHTML.trim();
//                     // console.log(pegGram.replace('<![CDATA[','').replace(']]>',''));
//                     pegGram = pegGram.replace('<![CDATA[','').replace(']]>','');
//                     pegGram = pegGram.replace( regExp , ""); 
//                     pegGram = Math.round(parseInt(pegGram)*1008)/1000;
//                     pegGram = Math.round(parseInt(pegGram)*103)/100;
//                     pegDon = Math.round(parseInt(pegGram)*375)/100;
//                     // console.log("1.pegGram:"+pegGram);
//                 }
                
//             }).catch(function(err){
//                 // request.end();
//                 logger.error(err);
//                 throw err;
//             })
//         ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
//     });
// }

// async function getPesPrice(){
//     return new Promise(function(resolve, reject){
//         resolve(
//             // console.log("getPegPrice");
//             JSDOM.fromURL(pesPriceOpton).then(dom => {
//                 if((dom.window.document.children[0].children[0].childElementCount) == 6){
//                     // console.log(dom.window.document.children[0].children[0].childElementCount);
//                     pesGram = dom.window.document.getElementsByTagName("result")[0].getElementsByTagName("item")[0].getElementsByTagName("v1_gold1")[0].innerHTML.trim();
//                     // console.log(pegGram.replace('<![CDATA[','').replace(']]>',''));
//                     pesGram = pesGram.replace('<![CDATA[','').replace(']]>','');
//                     pesGram = pesGram.replace( regExp , ""); 
//                     pesGram = Math.round(parseInt(pesGram)*1013)/1000;
//                     pesGram = Math.round(parseInt(pesGram)*105)/100;
//                     pesDon = Math.round(parseInt(pesGram)*375)/100;
//                 }
                
//             }).catch(function(err){
//                 // request.end();
//                 logger.error(err);
//                 throw err;
//             })
//         ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
//     });
// }

async function getPegLastPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            JSDOM.fromURL(lastPegPriceOpton).then(dom => {
                // console.log(dom.window.document.children[0].children[0].childElementCount);
                pegGramLast = dom.window.document.getElementsByClassName("text2_1")[3].children[5].innerHTML.trim();
                pegGramLast = pegGramLast.replace( regExp , ""); 
                pegGramLast = Math.round(parseInt(pegGramLast)*1008)/1000;
                pegGramLast = Math.round(parseInt(pegGramLast)*103)/100;
                pegDonLast = Math.round(parseInt(pegGramLast)*375)/100;

                // pegGramLast= Math.round((pegGram-pegGramLast)*100)/100;
                // pegDonLast = Math.round((pegDon-pegDonLast)*100)/100;

                pegGramGap = Math.round((pegGram-pegGramLast)*100)/100;
                pegDonGap = Math.round((pegDon-pegDonLast)*100)/100;

                // if(pegGram>pegGramLast) pegGramLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round((pegGram-pegGramLast)*100)/100));
                // else if(pegGram<pegGramLast) pegGramLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round((pegGramLast-pegGram)*100)/100));
                // else pegGramLast = "0.00";

                // if(pegDon>pegDonLast) pegDonLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((pegDon-pegDonLast));
                // else if(pegDon<pegDonLast) pegDonLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((pegDon-pegDonLast));
                // else pegDonLast = "0.00";
                
            }).catch(function(err){
                // request.end();
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

async function getPesLastPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            JSDOM.fromURL(lastPesPriceOpton).then(dom => {
                // console.log(dom.window.document.children[0].children[0].childElementCount);
                pesGramLast = dom.window.document.getElementsByClassName("text2_1")[3].children[5].innerHTML.trim();
                pesGramLast = pesGramLast.replace( regExp , ""); 
                pesGramLast = Math.round(parseInt(pesGramLast)*1013)/1000;
                pesGramLast = Math.round(parseInt(pesGramLast)*105)/100;
                pesDonLast = Math.round(parseInt(pesGramLast)*375)/100;

                // pesGramLast= Math.round((pesGram-pesGramLast)*100)/100;
                // pesDonLast = Math.round((pesDon-pesDonLast)*100)/100;

                pesGramGap= Math.round((pesGram-pesGramLast)*100)/100;
                pesDonGap = Math.round((pesDon-pesDonLast)*100)/100;

                // if(pesGram>pesGramLast) pesGramLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round((pesGram-pesGramLast)*100)/100));
                // else if(pesGram<pesGramLast) pesGramLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round((pesGramLast-pesGram)*100)/100));
                // else pesDonLast = "0.00";

                // if(pesDon>pesDonLast) pesDonLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((pesDon-pesDonLast));
                // else if(pesDon<pesDonLast) pesDonLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((pesDonLast-pesDon));
                // else pesDonLast = "0.00";
                
            }).catch(function(err){
                // request.end();
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
                        btcLast = Number.parseFloat(result.data.prev_closing_price);

                        // btcLast = Math.round((btc-btcLast)*100)/100;

                        btcGap = Math.round((btc-btcLast)*100)/100;
                        
                        // if(btc>btcLast) btcLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((btc-btcLast));
                        // else if(btc<btcLast) btcLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((btcLast-btc));
                        // else btcLast = "0.00";
                        
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
                        ethLast = Number.parseFloat(result.data.prev_closing_price);

                        // ethLast = Math.round((eth-ethLast)*100)/100;

                        ethGap = Math.round((eth-ethLast)*100)/100;

                        // if(eth>ethLast) ethLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((eth-ethLast));
                        // else if(eth<ethLast) ethLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((ethLast-eth));
                        // else ethLast = "0.00";
                        
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err); // decide what you want to do here
                        throw err;
                    }
                    // Bithum eth 기준시세
                    // console.log("Bithum eth 기준시세:"+eth);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

async function getMKPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(MKOption).then(dom => {
                const obj = dom.window.document.getElementsByClassName("table_1");
                // console.log(obj[4].innerHTML);
                let manipulVal = 1;

                dji = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
                dji= Number.parseFloat(dji.replace(',',''));
                
                djiGap = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                if(djiGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                djiGap = Number.parseFloat(djiGap.substr(1).replace(',','')) * manipulVal; 
                djiLast = Math.round((dji - djiGap)*100)/100;
                
                nasdaq = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[1].innerHTML;
                nasdaq= Number.parseFloat(nasdaq.replace(',',''));

                nasdaqGap = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(nasdaqGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                nasdaqGap = Number.parseFloat(nasdaqGap.substr(1).replace(',','')) * manipulVal; 
                nasdaqLast = Math.round((nasdaq - nasdaqGap)*100)/100;
                // console.log("nasdaq:"+nasdaq);
                
                excRateUSD = obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                excRateUSD= Number.parseFloat(excRateUSD.replace(',',''));
                
                excRateUSDGap = obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(excRateUSDGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                excRateUSDGap = Number.parseFloat(excRateUSDGap.substr(1)) * manipulVal;
                excRateUSDLast = Math.round((excRateUSD - excRateUSDGap)*100)/100; 
                // console.log("excRateUSDLast:"+excRateUSDLast);

                excRateJPY = obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].innerHTML;
                excRateJPY= Number.parseFloat(excRateJPY.replace(',',''));

                excRateJPYGap = obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML.trim();
                if(excRateJPYGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                excRateJPYGap = Number.parseFloat(excRateJPYGap.substr(1)) * manipulVal; 
                excRateJPYLast = Math.round((excRateJPY - excRateJPYGap)*100)/100; 
                // console.log("excRateJPY:"+excRateJPY);

                excRateEUR = obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML;
                excRateEUR= Number.parseFloat(excRateEUR.replace(',',''));

                excRateEURGap = obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(excRateEURGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                excRateEURGap = Number.parseFloat(excRateEURGap.substr(1)) * manipulVal; 
                excRateEURLast = Math.round((excRateEUR - excRateEURGap)*100)/100; 
                // console.log("excRateEUR:"+excRateEUR);

                excRateCNY = obj[3].getElementsByTagName("tr")[3].getElementsByTagName("td")[1].innerHTML;
                excRateCNY= Number.parseFloat(excRateCNY.replace(',',''));

                excRateCNYGap = obj[3].getElementsByTagName("tr")[3].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(excRateCNYGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                excRateCNYGap = Number.parseFloat(excRateCNYGap.substr(1)) * manipulVal; 
                excRateCNYLast = Math.round((excRateCNY - excRateCNYGap)*100)/100; 
                // console.log("excRateCNY:"+excRateCNY);

                wti = obj[5].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                wti= Number.parseFloat(wti.replace(',',''));

                wtiGap = obj[5].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(wtiGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                wtiGap = Number.parseFloat(wtiGap.substr(1)) * manipulVal; 
                wtiLast = Math.round((wti - wtiGap)*100)/100; 
                // console.log("wti:"+wti);

                interestRateCall = obj[6].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                interestRateCall= Number.parseFloat(interestRateCall.replace(',',''));

                interestRateCallGap = obj[6].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(interestRateCallGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                interestRateCallGap = Number.parseFloat(interestRateCallGap.substr(1)) * manipulVal; 
                interestRateCallLast = Math.round((interestRateCall - interestRateCallGap)*100)/100; 
                // console.log("interestRateCall:"+interestRateCall);
                
                interestRateCD = obj[6].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].innerHTML;
                interestRateCD= Number.parseFloat(interestRateCD.replace(',',''));

                interestRateCDGap = obj[6].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(interestRateCDGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                interestRateCDGap = Number.parseFloat(interestRateCDGap.substr(1)) * manipulVal; 
                interestRateCDLast = Math.round((interestRateCD - interestRateCDGap)*100)/100; 
                // console.log("interestRateCD:"+interestRateCD);

                interestRateUS = obj[6].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
                interestRateUS= Number.parseFloat(interestRateUS.replace(',',''));

                interestRateUSGap = obj[6].getElementsByTagName("tr")[5].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(interestRateUSGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                interestRateUSGap = Number.parseFloat(interestRateUSGap.substr(1)) * manipulVal; 
                interestRateUSLast = Math.round((interestRateUS - interestRateUSGap)*100)/100; 
                // console.log("interestRateUS:"+interestRateUS);

            }).catch(function(err){
                // if(!response.socket.destroyed) response.socket.destroy();
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
}

// async function getKospiPrice() {
//     return new Promise(function(resolve, reject){
//         resolve(
//             // console.log("getBTCPrice");
//             request(
//                 KospiPriceOption, 
//                 function(error, response, body) { 
//                     // if(error){throw error;} 
//                     // console.error('error', error);
//                     // console.log('statusCode:', response && response.statusCode); 
//                     // console.log(body);
//                     try {
//                         // something bad happens here
//                         const result = JSON.parse(body);
//                         // console.log((result.result.areas[0].datas[0].nv)/100);
//                         kospi = (result.result.areas[0].datas[0].nv)/100;
//                         kospiGap = (result.result.areas[0].datas[0].cv)/100;
//                         kospiLast = Math.round((kospi-kospiGap)*100)/100
//                         // if(kospiLast>0) kospiLast = kospiLast);
//                         // else if(kospiLast<0) kospiLast = Math.abs(kospiLast);
//                         // else kospiLast = 0;

//                         // if(kospiLast>0) kospiLast = "▲"+ Math.abs(kospiLast);
//                         // else if(kospiLast<0) kospiLast = "▼" + Math.abs(kospiLast);
//                         // else kospiLast = "0.00";
//                     } catch (err) {
//                         // if(!response.socket.destroyed) response.socket.destroy();
//                         logger.error(err); // decide what you want to do here
//                         throw err;
//                     }
//                     // Bithum btc 기준시세
//                     // console.log("Bithum btc 기준시세:"+btc);
//                 }
//             )
//         ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
//     });
// }

// async function getKosdaqPrice() {
//     return new Promise(function(resolve, reject){
//         resolve(
//             // console.log("getBTCPrice");
//             request(
//                 KosdaqPriceOption, 
//                 function(error, response, body) { 
//                     // if(error){throw error;} 
//                     // console.error('error', error);
//                     // console.log('statusCode:', response && response.statusCode); 
//                     // console.log(body);
//                     try {
//                         // something bad happens here
//                         const result = JSON.parse(body);
//                         kosdaq = (result.result.areas[0].datas[0].nv)/100;
//                         kosdaqGap = (result.result.areas[0].datas[0].cv)/100;
//                         kosdaqLast = Math.round((kosdaq-kosdaqGap)*100)/100
//                         // if(kosdaqLast>0) kosdaqLast = Math.abs(kosdaqLast);
//                         // else if(kosdaqLast<0) kosdaqLast =  Math.abs(kosdaqLast);
//                         // else kosdaqLast = 0;

//                         // if(kosdaqLast>0) kosdaqLast = "▲"+ Math.abs(kosdaqLast);
//                         // else if(kosdaqLast<0) kosdaqLast = "▼" + Math.abs(kosdaqLast);
//                         // else kosdaqLast = "0.00";
//                     } catch (err) {
//                         // if(!response.socket.destroyed) response.socket.destroy();
//                         logger.error(err); // decide what you want to do here
//                         throw err;
//                     }
//                     // Bithum btc 기준시세
//                     // console.log("Bithum btc 기준시세:"+btc);
//                 }
//             )
//         ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
//     })
// }

let datum = {};
datum.getData = function (req, res){
    let ret = [];
    async.waterfall([
        function(callback) {
            callback(null, getGoldPrice());
        }, //0
        function(arg, callback) {
            callback(null, getPrice());
        },// 1 
        // function(arg,callback) {
        //     callback(null, getPegPrice());
        // }, // 2 
        // function(arg, callback) {
        //     callback(null, getPesPrice());
        // }, // 3
        function(arg, callback) {
            callback(null, getPegLastPrice());
        }, // 4
        function(arg, callback) {
            callback(null, getPesLastPrice());
        }, // 5
        function(arg, callback) {
            callback(null, getBTCPrice());
        }, // 6
        function(arg, callback) {
            callback(null, getMKPrice());
        }, // 7
        // function(arg, callback) {
        //     callback(null, getKospiPrice());
        // }, // 8
        function(arg, callback) {
            callback(null, getETHPrice());
        }, // 9
        // function(arg, callback) {
        //     callback(null, getKosdaqPrice());
        // } // 10
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            const keys = ["pegGram","pesGram","pegDon","pesDon","gold24Buy","gold24Sell","gold18Sell","gold14Sell","silverBuy","silverSell","interestRateCall","interestRateCD","interestRateUS","kospi","kosdaq","btc","eth","dji","nasdaq","wti","excRateUSD","excRateCNY", "excRateJPY", "excRateEUR"];
            const labels = ["e금(gram)","e은(gram)","e금(돈)","e은(돈)","금(24k) 살 때(VAT별도)","금(24k) 팔 때","금(18k) 팔 때","금(14k) 팔 때","은 살 때(VAT별도)","은 팔 때","콜금리","CD금리(91일)","미국국채(10년물)","코스피","코스닥","비트코인","이더리움","다우존스산업평균","나스닥","국제유가(WTI)","원/달러 환율","원/위안 환율", "원/엔 환율", "원/유로 환율"];
            const visibilities = [true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            const values = [pegGram, pesGram, pegDon, pesDon, gold24Buy, gold24Sell, gold18Sell, gold14Sell, silverBuy, silverSell, interestRateCall,interestRateCD, interestRateUS, kospi, kosdaq, btc, eth, dji, nasdaq, wti, excRateUSD, excRateCNY, excRateJPY, excRateEUR];
            // console.log(values);
            const unit = ["원/g", "원/g", "원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","%","%","%","point","point", "원/btc", "원/eth", "point","point","$/배럴", "원/달러", "원/위안", "원/100엔", "원/유로"];
            const lastVal = [pegGramLast, pesGramLast, pegDonLast, pesDonLast, gold24BuyLast, gold24SellLast, gold18SellLast, gold14SellLast, silverBuyLast, silverSellLast, interestRateCallLast,interestRateCDLast, interestRateUSLast, kospiLast, kosdaqLast, btcLast, ethLast, djiLast, nasdaqLast, wtiLast, excRateUSDLast, excRateCNYLast, excRateJPYLast, excRateEURLast];
            const gap = [pegGramGap, pesGramGap, pegDonGap, pesDonGap, gold24BuyGap, gold24SellGap, gold18SellGap, gold14SellGap, silverBuyGap, silverSellGap, interestRateCallGap,interestRateCDGap, interestRateUSGap, kospiGap, kosdaqGap, btcGap, ethGap, djiGap, nasdaqGap, wtiGap, excRateUSDGap, excRateCNYGap, excRateJPYGap, excRateEURGap];
            for(let i=0; i<keys.length; i++){
                let data;
                data = {
                    "id":keys[i], 
                    "thisValue":values[i],
                    "unit":unit[i],
                    "gap":gap[i],
                    "label":labels[i],
                    "visibilities":visibilities[i],
                    "lastValue":lastVal[i]
                }
                ret.push(data);
            }
            res.setHeader('Content-Type', 'application/json');
            res.render('apiWraper', {ret:ret});
            
        } 
    });
};

module.exports = datum.getData;
