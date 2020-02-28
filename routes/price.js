const express = require("express");
const request = require('request');
const convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const xmldomParser = require("xmldom").DOMParser;

function getPrice(req, res){
     var goldBuy;
     var goldSell;
     var peg;
     var btc;
     var excRate;
     var investRate;
     var kospi;
     var kosdaq;

    request(
        { 
            method:'GET', 
            url:'http://www.koreagoldx.co.kr/include/lineup.asp'
        }, 
        function(error, response, body) { 
            if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            var result = JSON.parse(convert.xml2json(body, {compact: true, ignoreDeclaration: true, spaces: 4}));
            goldBuy = result.Xml.data[0].buy.price._text;
            goldSell = result.Xml.data[0].sell.price._text
            // 금 소매 살 때
            // console.log("금 소매 살 때:"+goldBuy);
            // 금 소매 팔 때
            // console.log("금 소매 팔 때:"+goldSell);
            // res.render('index')
        }
    );
    request(
        { 
            method:'GET', 
            url:'http://www.exgold.co.kr/chart/subjson.php?s_gubun=Au'
        }, 
        function(error, response, body) { 
            if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            
            // e금 기준시세
            var doc = new xmldomParser().parseFromString(body,'text/xml');
            var regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
            peg = doc.getElementsByTagName("v1_gold1")[0].lastChild.data;
            peg = peg.replace( regExp , ""); 
            peg = parseInt(peg)*1.03;
            // console.log("e금 기준시세:"+peg);
        }
    );
    request(
        { 
            method:'GET', 
            url:'https://api.bithumb.com/public/ticker/BTC'
        }, 
        function(error, response, body) { 
            if(error){throw error;} 
            // console.error('error', error);
            // console.log('statusCode:', response && response.statusCode); 
            // console.log(body);
            var result = JSON.parse(body);
            // console.log(result);
            btc = result.data.closing_price;
            // Bithum btc 기준시세
            // console.log("Bithum btc 기준시세:"+btc);
            // res.render('index')
        }
    );

    JSDOM.fromURL("http://ecos.bok.or.kr/EIndex.jsp").then(dom => {
        var obj = dom.window.document.getElementsByClassName("ESdaily")[0].getElementsByTagName("table")[0].getElementsByTagName("tr");
        investRate = obj[1].getElementsByTagName("a")[1].innerHTML.trim();
        // console.log("원/달러 환율:"+excRate);
        excRate = obj[3].getElementsByTagName("a")[1].innerHTML.trim();
        // console.log("국고채 3년만기:"+investRate);
        kospi = obj[6].getElementsByTagName("a")[1].innerHTML.trim();
        // console.log("KOSPI:"+kospi);
        kosdaq = obj[7].getElementsByTagName("a")[1].innerHTML.trim();
        // console.log("KOSDAQ:"+kosdaq);
    });

    // res.render('index');
    setTimeout(function(){res.render('price', {goldBuy:goldBuy, goldSell:goldSell, peg:peg, btc:btc, excRate:excRate, investRate:investRate, kospi:kospi, kosdaq:kosdaq })}, 500);
    
}

module.exports = getPrice;