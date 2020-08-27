const cheerio = require("cheerio");
const request = require('request-promise');
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

const KospiPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSPI";
const KosdaqPriceOption = "https://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_INDEX:KOSDAQ";

let gold24Buy;
let gold24Sell;
let gold18Sell;
let gold14Sell;
let silverBuy;
let silverSell;

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

let djiGap;
let nasdaqGap;
let wtiGap;

let kospi;
let kosdaq;

let kospiGap
let kosdaqGap;

const regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 

let signVal = "▲";
                        

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
                        
                        gold24Buy = Number.parseFloat(result.Xml.data[0].buy.price._text);
                        gold24Sell = Number.parseFloat(result.Xml.data[0].sell.price._text);
                        gold18Sell = Number.parseFloat(result.Xml.data[1].sell.price._text);
                        gold14Sell = Number.parseFloat(result.Xml.data[2].sell.price._text);
                        silverBuy = Number.parseFloat(result.Xml.data[4].buy.price._text);
                        silverSell = Number.parseFloat(result.Xml.data[4].sell.price._text);

                        // gold24BuyLast = Number.parseFloat(result.Xml.data[0].buy.icon._attributes.num);
                        // gold24SellLast = Number.parseFloat(result.Xml.data[0].sell.icon._attributes.num);
                        // gold18SellLast = Number.parseFloat(result.Xml.data[1].buy.icon._attributes.num);
                        // gold14SellLast = Number.parseFloat(result.Xml.data[2].sell.icon._attributes.num);
                        // silverBuyLast = Number.parseFloat(result.Xml.data[4].buy.icon._attributes.num);
                        // silverSellLast = Number.parseFloat(result.Xml.data[4].sell.icon._attributes.num);

                        gold24BuyGap = Number.parseFloat(result.Xml.data[0].buy.icon._attributes.num);
                        if(result.Xml.data[0].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[0].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        gold24BuyGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyGap);
                        
                        gold24SellGap = Number.parseFloat(result.Xml.data[0].sell.icon._attributes.num);
                        if(result.Xml.data[0].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[0].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        gold24SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellGap);

                        gold18SellGap = Number.parseFloat(result.Xml.data[1].buy.icon._attributes.num);
                        if(result.Xml.data[1].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[1].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        gold18SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellGap);

                        gold14SellGap = Number.parseFloat(result.Xml.data[2].sell.icon._attributes.num);
                        if(result.Xml.data[2].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[2].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        gold14SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellGap);


                        silverBuyGap = Number.parseFloat(result.Xml.data[4].buy.icon._attributes.num);
                        if(result.Xml.data[4].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[4].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        silverBuyGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyGap);
                        
                        silverSellGap = Number.parseFloat(result.Xml.data[4].sell.icon._attributes.num);
                        if(result.Xml.data[4].buy.icon._text == "3") signVal = "▼";
                        else if(result.Xml.data[4].buy.icon._text == "2") signVal = "▲";
                        else signVal = "";
                        silverSellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellGap);


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
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
                if(pegGram != null){
                    pegGram = pegGram.replace('<!--[CDATA[','').replace(']]-->','');
                    pegGram = pegGram.replace( regExp , ""); 
                    pegGram = Math.round(parseInt(pegGram)*1008)/1000;
                    pegGram = Math.round(parseInt(pegGram)*103)/100;
                    pegDon = Math.round(parseInt(pegGram)*375)/100;
                }
        
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

async function getPesPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            // console.log("getPegPrice");
            request(pesPriceOpton).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
        
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $item = $('result item v1_gold1');
        
                pesGram = $item.html();
                if(pesGram != null){
                    pesGram = pesGram.replace('<!--[CDATA[','').replace(']]-->','');
                    pesGram = pesGram.replace( regExp , ""); 
                    pesGram = Math.round(parseInt(pesGram)*1013)/1000;
                    pesGram = Math.round(parseInt(pesGram)*105)/100;
                    pesDon = Math.round(parseInt(pesGram)*375)/100;
                }
        
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

async function getPegLastPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            request(lastPegPriceOpton).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
                
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $item = $('.text2_1');
                pegGramLast = $item.eq(3).children().eq(5).text().trim();
                pegGramLast = pegGramLast.replace( regExp , ""); 
                pegGramLast = Math.round(parseInt(pegGramLast)*1008)/1000;
                pegGramLast = Math.round(parseInt(pegGramLast)*103)/100;
                pegDonLast = Math.round(parseInt(pegGramLast)*375)/100;

                if(pegGram>pegGramLast) pegGramGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.round(Math.abs(pegGram-pegGramLast)*100)/100);
                else if(pegGram<pegGramLast) pegGramGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.round(Math.abs(pegGram-pegGramLast)*100)/100);
                else pegGramGap = "0.00";

                if(pegDon>pegDonLast) pegDonGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(pegDon-pegDonLast));
                else if(pegDon<pegDonLast) pegDonGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(pegDon-pegDonLast));
                else pegDonGap = "0.00";
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

async function getPesLastPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            request(lastPesPriceOpton).then(function (html) {

                // Cheerio 오브젝트 생성
                const $ = cheerio.load(html);
                
                // 셀렉터 캐시로 Cheerio 오브젝트 생성
                const $item = $('.text2_1');
                pesGramLast = $item.eq(3).children().eq(5).text().trim();
                pesGramLast = pesGramLast.replace( regExp , ""); 
                pesGramLast = Math.round(parseInt(pesGramLast)*1013)/1000;
                pesGramLast = Math.round(parseInt(pesGramLast)*105)/100;
                pesDonLast = Math.round(parseInt(pesGramLast)*375)/100;

                if(pesGram>pesGramLast) pesGramGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round(Math.abs(pesGram-pesGramLast)*100)/100));
                else if(pesGram<pesGramLast) pesGramGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format((Math.round(Math.abs(pesGram-pesGramLast)*100)/100));
                else pesGramGap = "0.00";

                if(pesDon>pesDonLast) pesDonGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(pesDon-pesDonLast));
                else if(pesDon<pesDonLast) pesDonGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(pesDon-pesDonLast));
                else pesDonGap = "0.00";
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

                        if(btc>btcLast) btcGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(btc-btcLast));
                        else if(btc<btcLast) btcGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(btc-btcLast));
                        else btcGap = "0.00";
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

                        if(eth>ethLast) ethGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(eth-ethLast));
                        else if(eth<ethLast) ethGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(eth-ethLast));
                        else ethGap = "0.00";
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
                // console.log(obj.innerHTML);

                dji = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
                dji= Number.parseFloat(dji.replace(',',''));

                djiGap = obj[2].getElementsByTagName("tr")[5].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("dji:"+dji);

                nasdaq = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[1].innerHTML;
                nasdaq= Number.parseFloat(nasdaq.replace(',',''));

                nasdaqGap = obj[2].getElementsByTagName("tr")[6].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("nasdaq:"+nasdaq);
                
                excRateUSD = obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                excRateUSD= Number.parseFloat(excRateUSD.replace(',',''));

                excRateUSDGap = obj[3].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("excRateUSD:"+excRateUSD);

                excRateJPY = obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].innerHTML;
                excRateJPY= Number.parseFloat(excRateJPY.replace(',',''));

                excRateJPYGap = obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                
                excRateEUR = obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML;
                excRateEUR= Number.parseFloat(excRateEUR.replace(',',''));

                excRateEURGap = obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                
                excRateCNY = obj[3].getElementsByTagName("tr")[3].getElementsByTagName("td")[1].innerHTML;
                excRateCNY= Number.parseFloat(excRateCNY.replace(',',''));

                excRateCNYGap = obj[3].getElementsByTagName("tr")[3].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("excRateCNY:"+excRateCNY);

                wti = obj[5].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                wti= Number.parseFloat(wti.replace(',',''));

                wtiGap = obj[5].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("wti:"+wti);

                interestRateCall = obj[6].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML;
                interestRateCall= Number.parseFloat(interestRateCall.replace(',',''));

                interestRateCallGap = obj[6].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("interestRateCall:"+interestRateCall);
                
                interestRateCD = obj[6].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].innerHTML;
                interestRateCD= Number.parseFloat(interestRateCD.replace(',',''));

                interestRateCDGap = obj[6].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("interestRateCD:"+interestRateCD);

                interestRateUS = obj[6].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
                interestRateUS= Number.parseFloat(interestRateUS.replace(',',''));

                interestRateUSGap = obj[6].getElementsByTagName("tr")[5].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                // console.log("interestRateUS:"+interestRateUS);

                
            }).catch(function(err){
                logger.error(err);
                // if(!response.socket.destroyed) response.socket.destroy();
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
                        kospiGap = (result.result.areas[0].datas[0].cv)/100;
                        if(kospiGap>0) kospiGap = "▲"+ Math.abs(kospiGap);
                        else if(kospiGap<0) kospiGap = "▼" + Math.abs(kospiGap);
                        else kospiGap = "0.00";
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
                        kosdaqGap = (result.result.areas[0].datas[0].cv)/100;
                        if(kosdaqGap>0) kosdaqGap = "▲"+ Math.abs(kosdaqGap);
                        else if(kosdaqGap<0) kosdaqGap = "▼" + Math.abs(kosdaqGap);
                        else kosdaqGap = "0.00";
                    } catch (err) {
                        if(!response.socket.destroyed) response.socket.destroy();
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
            const keys = ["pegGram","pesGram", "pegDon","pesDon","pegGram","pesGram", "gold24Buy","gold24Sell","gold18Sell","gold14Sell","silverBuy","silverSell","interestRateCall","interestRateCD","interestRateUS","kospi","kosdaq","btc","eth","dji","nasdaq","wti","excRateUSD","excRateCNY", "excRateJPY", "excRateEUR"];
            const values = [pegGram, pesGram, pegDon, pesDon, gold24Buy, gold24Sell, gold18Sell, gold14Sell, silverBuy, silverSell, interestRateCall,interestRateCD, interestRateUS, kospi, kosdaq, btc, eth, dji, nasdaq, wti, excRateUSD, excRateCNY, excRateJPY, excRateEUR];
            // console.log(values);
            const unit = ["원/g", "원/g", "원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","원/돈","%","%","%","point","point", "원/btc", "원/eth", "point","point","$/배럴", "원/달러", "원/위안", "원/100엔", "원/유로"];
            const gap = [pegGramGap, pesGramGap, pegDonGap, pesDonGap, gold24BuyGap, gold24SellGap, gold18SellGap, gold14SellGap, silverBuyGap, silverSellGap, interestRateCallGap,interestRateCDGap, interestRateUSGap, kospiGap, kosdaqGap, btcGap, ethGap, djiGap, nasdaqGap, wtiGap, excRateUSDGap, excRateCNYGap, excRateJPYGap, excRateEURGap];
            
            for(let i=0; i<keys.length; i++){
                let data;
                data = {
                    "label":keys[i], 
                    "thisValue":values[i],
                    "unit":unit[i],
                    "gap":gap[i]
                }
                ret.push(data); 
            }
            res.setHeader('Content-Type', 'application/json');
            res.render('apiWraper', {ret:ret});
            
        }  // 7
    });
};

module.exports = datum.getData;
