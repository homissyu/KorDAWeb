const cheerio = require("cheerio");
const request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const async = require('async');

const logger = require('../utils/logger');

const priceOption = { 
    url:'https://pennygold.kr/3m/price'
};

const goldPriceOption = {
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
            request(
                goldPriceOption, 
                function(error, response, body) { 
                    try {
                        const result = JSON.parse(JSON.stringify(body));
                        gold24Buy = result.lineUpVal[0].spure;
                        gold24Sell = result.lineUpVal[0].ppure;
                        gold18Sell = result.lineUpVal[0].p18k;
                        gold14Sell = result.lineUpVal[0].p14k;
                        silverBuy = result.lineUpVal[0].ssilver;
                        silverSell = result.lineUpVal[0].psilver;

                        gold24BuyGap = result.lineUpVal[0].turmPure;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(gold24BuyGap > 0) signVal = "▲";
                        else signVal = "";
                        gold24BuyGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24BuyGap);
                        
                        gold24SellGap = result.lineUpVal[0].pturmPure;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(gold24SellGap > 0) signVal = "▲";
                        else signVal = "";
                        gold24SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold24SellGap);
                        
                        gold18SellGap = result.lineUpVal[0].pturm18k;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(gold18SellGap > 0) signVal = "▲";
                        else signVal = "";
                        gold18SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold18SellGap);

                        gold14SellGap = result.lineUpVal[0].pturm14k;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(gold14SellGap > 0) signVal = "▲";
                        else signVal = "";
                        gold14SellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(gold14SellGap);

                        silverBuyGap = result.lineUpVal[0].turmSilver;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(silverBuyGap > 0) signVal = "▲";
                        else signVal = "";
                        silverBuyGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverBuyGap);
                        
                        silverSellGap = result.lineUpVal[0].pturmSilver;
                        if(result.lineUpVal[0].updownPure == "-") signVal = "▼";
                        else if(silverSellGap > 0) signVal = "▲";
                        else signVal = "";
                        silverSellGap = signVal+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(silverSellGap);

                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

async function getPrice() {
    return new Promise(function(resolve, reject){
        resolve(
            request(
                priceOption, 
                function(error, response, body) { 
                    try {
                        // something bad happens here
                        const result = JSON.parse(body);
                        
                        //kospi & kosdaq
                        if(result.indexes.kr.length > 0){
                            kospi = result.indexes.kr[0].price;
                            kospiGap = result.indexes.kr[0].fluc;
                            // console.log("kospi:"+kospi2);
                            if(kospiGap>0) kospiGap = "▲"+ Math.abs(kospiGap);
                            else if(kospiGap<0) kospiGap = "▼" + Math.abs(kospiGap);
                            else kospiGap = "0.00";

                            kosdaq = result.indexes.kr[1].price;
                            kosdaqGap = result.indexes.kr[1].fluc;
                            // console.log("kosdaq:"+kosdaq2);
                            if(kosdaqGap>0) kosdaqGap = "▲"+ Math.abs(kosdaqGap);
                            else if(kosdaqGap<0) kosdaqGap = "▼" + Math.abs(kosdaqGap);
                            else kosdaqGap = "0.00";
                        }else{
                            kospi = 0;
                            kospiGap = 0;
                            kosdaq = 0;
                            kosdaqGap = 0;
                        }
                        
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

async function getPegLastPrice(){
    return new Promise(function(resolve, reject){
        resolve(
            request(lastPegPriceOpton).then(function (html) {

                const $ = cheerio.load(html);
                
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

                const $ = cheerio.load(html);
                
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
                    try {
                        const result = JSON.parse(body);
                        btc = Number.parseFloat(result.data.closing_price);
                        btcLast = Number.parseFloat(result.data.prev_closing_price);

                        if(btc>btcLast) btcGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(btc-btcLast));
                        else if(btc<btcLast) btcGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(btc-btcLast));
                        else btcGap = "0.00";
                    } catch (err) {
                        logger.error(err);
                        throw err;
                    }
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
                    try {
                        const result = JSON.parse(body);
                        eth = Number.parseFloat(result.data.closing_price);
                        ethLast = Number.parseFloat(result.data.prev_closing_price);

                        if(eth>ethLast) ethGap = "▲"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(eth-ethLast));
                        else if(eth<ethLast) ethGap = "▼"+new Intl.NumberFormat('ko-KR', { style: 'decimal', maximumFractionDigits: 2}).format(Math.abs(eth-ethLast));
                        else ethGap = "0.00";
                    } catch (err) {
                        logger.error(err); 
                        throw err;
                    }
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
                //  console.log("excRateJPY:"+excRateJPY);
                excRateJPYGap = obj[3].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].getElementsByTagName("span")[0].innerHTML;
                
                excRateEUR = obj[3].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML;
                excRateEUR= Number.parseFloat(excRateEUR.replace(',',''));
                //  console.log("excRateEUR:"+excRateEUR);
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
                throw err;
            })
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
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
            callback(null, getPrice());
        },
        function(arg, callback) {
            callback(null, getPegLastPrice());
        },
        function(arg, callback) {
            callback(null, getPesLastPrice());
        },
        function(arg, callback) {
            callback(null, getBTCPrice());
        },
        function(arg, callback) {
            callback(null, getMKPrice());
        },
        function(arg, callback) {
            callback(null, getETHPrice());
        },
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
        }
    });
};

module.exports = datum.getData;
