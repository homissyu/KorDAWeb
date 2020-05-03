const request = require('request');

var api_url = "https://www.bigkinds.or.kr/api/news/search.do";
var options = {
  method: 'POST',
  url: api_url,
  headers : {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      "cookie": "_ga=GA1.3.1926461380.1586357322; _gid=GA1.3.1260399977.1586357322; Bigkinds=C309A77543372F849646706C6D0EE2E0",
      "referrer": "https://www.bigkinds.or.kr/v2/news/index.do",
      "referrerPolicy": "no-referrer-when-downgrade",
      "mode": "cors"
  },
  json: true,
  body:{"indexName":"news","searchKey":"(금값 OR 투자 OR 증권 OR 자산)  AND  (경제)  NOT(비트코인암호화폐)","searchKeys":[{"orKeywords":["금값,투자,증권,자산"],"andKeywords":["경제"],"notKeywords":["비트코인,암호화폐"]}],"byLine":"","searchFilterType":"1","searchScopeType":"1","searchSortType":"date","sortMethod":"date","mainTodayPersonYn":"","startDate":"","endDate":"","newsIds":[],"categoryCodes":["002000000","002004000","002010000","002008000","002014000","002011000","002009000","002005000","002001000","002012000","002006000","002002000","002007000","002003000","002013000"],"providerCodes":["01100101","01100201","01100301","01100401","01100501","01100611","01100701","01100801","01100901","01101001","01101101","02100101","02100201","02100311","02100801","02100851","02100501","02100601","02100701","08100101","08100201","08200101","08100301","08100401"],"incidentCodes":[],"networkNodeType":"","topicOrigin":"","dateCodes":[],"editorialIs":false,"startNo":1,"resultNumber":100,"isTmUsable":false,"isNotTmUsable":false}
};

var datum = {};
var retObj;
datum.getData = function (req, res){
  
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      // res.end(body);
      retObj = body.resultList;
      
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
  // console.log("retObj:"+retObj);
  return retObj;
};

module.exports = datum;
