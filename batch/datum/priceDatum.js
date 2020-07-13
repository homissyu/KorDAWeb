const request = require('request');
const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const async = require('async');

const logger = require('../utils/logger');

const goldPriceOption = { 
    method:'GET', 
    url:'http://www.koreagoldx.co.kr/include/lineup.asp'
}

const pegPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au';

const pesPriceOpton = 'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Ag';

const lastPegPriceOpton = "http://www.exgold.co.kr/spot_price.htm?s_gubun=Au&s_unit=out&s_range=M";
const lastPesPriceOpton = "http://www.exgold.co.kr/spot_price.htm?s_gubun=Ag&s_unit=out&s_range=M";

const btcPriceOption = { 
    url:'https://api.bithumb.com/public/ticker/BTC'
}

const ethPriceOption = { 
    url:'https://api.bithumb.com/public/ticker/ETH'
}

const MKOption = "http://vip.mk.co.kr/newSt/rate";

const KospiPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI";
const KosdaqPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSDAQ";

var gold24Buy;
var gold24Sell;
var gold18Sell;
var gold14Sell;
var silverBuy;
var silverSell;

var gold24BuyLast;
var gold24SellLast;
var gold18SellLast;
var gold14SellLast;
var silverBuyLast;
var silverSellLast;

var gold24BuyGap;
var gold24SellGap;
var gold18SellGap;
var gold14SellGap;
var silverBuyGap;
var silverSellGap;

var pegGram;
var pesGram;
var pegDon;
var pesDon;

var pegGramLast;
var pesGramLast;
var pegDonLast;
var pesDonLast;

var pegGramGap;
var pesGramGap;
var pegDonGap;
var pesDonGap;

var btc;
var eth;

var btcLast;
var ethLast;

var btcGap;
var ethGap;

var excRateUSD;
var excRateJPY;
var excRateCNY;
var excRateEUR;
var interestRateCall;
var interestRateCD;
var interestRateUS;
var dji;
var nasdaq;
var wti;

var excRateUSDLast;
var excRateJPYLast;
var excRateCNYLast;
var excRateEURLast;
var interestRateCallLast;
var interestRateCDLast;
var interestRateUSLast;

var excRateUSDGap;
var excRateJPYGap;
var excRateCNYGap;
var excRateEURGap;
var interestRateCallGap;
var interestRateCDGap;
var interestRateUSGap;

var dji;
var nasdaq;
var wti;

var djiLast;
var nasdaqLast;
var wtiLast;

var djiGap;
var nasdaqGap;
var wtiGap;

var kospi;
var kosdaq;

var kospiLast;
var kosdaqLast;

var kospiGap
var kosdaqGap;

var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 

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
                        
                        gold24Buy = Number.parseFloat(result.Xml.data[0].buy.price._text);
                        gold24Sell = Number.parseFloat(result.Xml.data[0].sell.price._text);
                        gold18Sell = Number.parseFloat(result.Xml.data[1].buy.price._text);
                        gold14Sell = Number.parseFloat(result.Xml.data[2].sell.price._text);
                        silverBuy = Number.parseFloat(result.Xml.data[4].buy.price._text);
                        silverSell = Number.parseFloat(result.Xml.data[4].sell.price._text);

                        gold24BuyGap = Number.parseFloat(result.Xml.data[0].buy.icon._attributes.num);
                        if(result.Xml.data[0].buy.icon._text == "3") gold24BuyGap = gold24BuyGap * -1;
                        
                        gold24SellGap = Number.parseFloat(result.Xml.data[0].sell.icon._attributes.num);
                        if(result.Xml.data[0].buy.icon._text == "3") gold24SellGap = gold24SellGap * -1;

                        gold18SellGap = Number.parseFloat(result.Xml.data[1].buy.icon._attributes.num);
                        if(result.Xml.data[1].buy.icon._text == "3") gold18SellGap = gold18SellGap * -1;

                        gold14SellGap = Number.parseFloat(result.Xml.data[2].sell.icon._attributes.num);
                        if(result.Xml.data[2].buy.icon._text == "3") gold14SellGap = gold14SellGap * -1;

                        silverBuyGap = Number.parseFloat(result.Xml.data[4].buy.icon._attributes.num);
                        if(result.Xml.data[4].buy.icon._text == "3") silverBuyGap = silverBuyGap * -1;
                        
                        silverSellGap = Number.parseFloat(result.Xml.data[4].sell.icon._attributes.num);
                        if(result.Xml.data[4].buy.icon._text == "3") silverSellGap = silverSellGap * -1;

                        gold24BuyLast = gold24Buy - gold24BuyGap;

                        gold24SellLast = gold24Sell - gold24SellGap;

                        gold18SellLast = gold18Sell - gold18SellGap;

                        gold14SellLast = gold14Sell - gold14SellGap;

                        silverBuyLast = silverBuy - silverBuyGap;
                        
                        silverSellLast = silverSell - silverSellGap;

                        
                        
                        // if(gold24BuyLast>0) gold24BuyLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyLast);
                        // else if(gold24BuyLast<0) gold24BuyLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyLast);
                        // else gold24BuyLast = "0.00";

                        // if(gold24SellLast>0) gold24SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellLast);
                        // else if(gold24SellLast<0) gold24SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellLast);
                        // else gold24SellLast = "0.00";

                        // if(gold18SellLast>0) gold18SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellLast);
                        // else if(gold18SellLast<0) gold18SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellLast);
                        // else gold18SellLast = "0.00";

                        // if(gold14SellLast>0) gold14SellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellLast);
                        // else if(gold14SellLast<0) gold14SellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellLast);
                        // else gold14SellLast = "0.00";

                        // if(silverBuyLast>0) silverBuyLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyLast);
                        // else if(silverBuyLast<0) silverBuyLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyLast);
                        // else silverBuyLast = "0.00";

                        // if(silverSellLast>0) silverSellLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellLast);
                        // else if(silverSellLast<0) silverSellLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellLast);
                        // else silverSellLast = "0.00";

                    } catch (err) {
                        logger.error(err); // decide what you want to do here
                        if(!response.socket.destroyed) response.socket.destroy();
                        throw err;
                    }
                    // 금 소매 살 때
                    // console.log("금 소매 살 때:"+goldBuy);
                    // 금 소매 팔 때
                    // console.log("금 소매 팔 때:"+goldSell);
                    // res.render('index')
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
                    pegGram = pegGram.replace('<![CDATA[','').replace(']]>','');
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = Math.round(parseInt(pegGram)*1008)/1000;
                    pegGram = Math.round(parseInt(pegGram)*103)/100;
                    pegDon = Math.round(parseInt(pegGram)*375)/100;
                    // console.log("1.pegGram:"+pegGram);
                }
            }).catch(function(err){
                // request.end();
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
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
                    pesGram = pesGram.replace('<![CDATA[','').replace(']]>','');
                    pesGram = pesGram.replace( regExp , ""); 
                    pesGram = Math.round(parseInt(pesGram)*1013)/1000;
                    pesGram = Math.round(parseInt(pesGram)*105)/100;
                    pesDon = Math.round(parseInt(pesGram)*375)/100;
                }
            }).catch(function(err){
                // request.end();
                logger.error(err);
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

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
                        var result = JSON.parse(body);
                        btc = Number.parseFloat(result.data.closing_price);
                        btcLast = Number.parseFloat(result.data.prev_closing_price);

                        // btcLast = Math.round((btc-btcLast)*100)/100;

                        btcGap = Math.round((btc-btcLast)*100)/100;
                        
                        // if(btc>btcLast) btcLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((btc-btcLast));
                        // else if(btc<btcLast) btcLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((btcLast-btc));
                        // else btcLast = "0.00";
                    } catch (err) {
                        logger.error(err);// decide what you want to do here
                        if(!response.socket.destroyed) response.socket.destroy();
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
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
                        ethLast = Number.parseFloat(result.data.prev_closing_price);

                        // ethLast = Math.round((eth-ethLast)*100)/100;

                        ethGap = Math.round((eth-ethLast)*100)/100;

                        // if(eth>ethLast) ethLast = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((eth-ethLast));
                        // else if(eth<ethLast) ethLast = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((ethLast-eth));
                        // else ethLast = "0.00";
                    } catch (err) {
                        logger.error(err); // decide what you want to do here
                        if(!response.socket.destroyed) response.socket.destroy();
                        throw err;
                    }
                    // Bithum eth 기준시세
                    // console.log("Bithum eth 기준시세:"+eth);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
}



async function getMKPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getBokAssetPrice");
            JSDOM.fromURL(MKOption).then(dom => {
                var obj = dom.window.document.getElementsByClassName("table_1");
                // console.log(obj[4].innerHTML);
                var manipulVal = 1;

                dji = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
                dji= Number.parseFloat(dji.replace(',',''));

                djiGap = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                if(djiGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                djiGap = Number.parseFloat(djiGap.substr(1)) * manipulVal; 
                djiLast = Math.round((dji - djiGap)*100)/100;
                // console.log("dji:"+dji);

                nasdaq = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[1].innerHTML;
                nasdaq= Number.parseFloat(nasdaq.replace(',',''));

                nasdaqGap = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                if(nasdaqGap.startsWith("▼")) manipulVal = -1;
                else manipulVal = 1;
                // if("t_12_blue" == obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].className) manipulVal = -1;
                nasdaqGap = Number.parseFloat(nasdaqGap.substr(1)) * manipulVal; 
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
                logger.error(err);
                if(!response.socket.destroyed) response.socket.destroy();
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
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
                        kospiGap = (result.result.areas[0].datas[0].cv)/100;
                        kospiLast = Math.round((kospi-kospiGap)*100)/100
                        // if(kospiLast>0) kospiLast = kospiLast);
                        // else if(kospiLast<0) kospiLast = Math.abs(kospiLast);
                        // else kospiLast = 0;

                        // if(kospiLast>0) kospiLast = "▲"+ Math.abs(kospiLast);
                        // else if(kospiLast<0) kospiLast = "▼" + Math.abs(kospiLast);
                        // else kospiLast = "0.00";
                    } catch (err) {
                        logger.error(err); // decide what you want to do here
                        if(!response.socket.destroyed) response.socket.destroy();
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
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
                        kosdaqGap = (result.result.areas[0].datas[0].cv)/100;
                        kosdaqLast = Math.round((kosdaq-kosdaqGap)*100)/100
                        // if(kosdaqLast>0) kosdaqLast = Math.abs(kosdaqLast);
                        // else if(kosdaqLast<0) kosdaqLast =  Math.abs(kosdaqLast);
                        // else kosdaqLast = 0;

                        // if(kosdaqLast>0) kosdaqLast = "▲"+ Math.abs(kosdaqLast);
                        // else if(kosdaqLast<0) kosdaqLast = "▼" + Math.abs(kosdaqLast);
                        // else kosdaqLast = "0.00";
                    } catch (err) {
                        logger.error(err);
                        if(!response.socket.destroyed) response.socket.destroy();
                        throw err;
                    }
                    // Bithum btc 기준시세
                    // console.log("Bithum btc 기준시세:"+btc);
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    })
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
        function(arg, callback) {
            callback(null, getKospiPrice());
        }, // 8
        function(arg, callback) {
            callback(null, getETHPrice());
        }, // 9
        function(arg, callback) {
            callback(null, getKosdaqPrice());
        } // 10
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            var keys = ["pegGram","pesGram", "pegDon","pesDon","gold24Buy","gold24Sell","gold18Sell","gold14Sell","silverBuy","silverSell","interestRateCall","interestRateCD","interestRateUS","kospi","kosdaq","btc","eth","dji","nasdaq","wti","excRateUSD","excRateCNY", "excRateJPY", "excRateEUR"];
            var labels = ["e금(gram)","e은(gram)", "e금(돈)","e은(돈)","금(24k) 살 때","금(24k) 팔 때","금(18k) 팔 때","금(14k) 팔 때","은 살 때","은 팔 때","콜금리","CD금리(91일)","미국국채(10년물)","코스피","코스닥","비트코인","이더리움","다우존스산업평균","나스닥","국제유가(WTI)","원/달러 환율","원/위안 환율", "원/엔 환율", "원/유로 환율"];
            var visibilities = [true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            var values = [pegGram, pesGram, pegDon, pesDon, gold24Buy, gold24Sell, gold18Sell, gold14Sell, silverBuy, silverSell, interestRateCall,interestRateCD, interestRateUS, kospi, kosdaq, btc, eth, dji, nasdaq, wti, excRateUSD, excRateCNY, excRateJPY, excRateEUR];
            // console.log(values);
            var unit = ["원/g", "원/g", "원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","%","%","%","point","point", "원/btc", "원/eth", "point","point","$/배럴", "원/달러", "원/위안", "원/100엔", "원/유로"];
            var lastVal = [pegGramLast, pesGramLast, pegDonLast, pesDonLast, gold24BuyLast, gold24SellLast, gold18SellLast, gold14SellLast, silverBuyLast, silverSellLast, interestRateCallLast,interestRateCDLast, interestRateUSLast, kospiLast, kosdaqLast, btcLast, ethLast, djiLast, nasdaqLast, wtiLast, excRateUSDLast, excRateCNYLast, excRateJPYLast, excRateEURLast];
            var gap = [pegGramGap, pesGramGap, pegDonGap, pesDonGap, gold24BuyGap, gold24SellGap, gold18SellGap, gold14SellGap, silverBuyGap, silverSellGap, interestRateCallGap,interestRateCDGap, interestRateUSGap, kospiGap, kosdaqGap, btcGap, ethGap, djiGap, nasdaqGap, wtiGap, excRateUSDGap, excRateCNYGap, excRateJPYGap, excRateEURGap];
            for(var i=0; i<keys.length; i++){
                var data;
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
            // res.setHeader('Content-Type', 'application/json');
            // res.render('getData', {ret:ret});
            
        }  // 7
    });
    return ret;
};

module.exports = datum;
