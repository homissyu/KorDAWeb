const request = require('request');

var api_url = "https://www.bigkinds.or.kr/api/news/search.do";
var options = {
  method: 'POST',
  url: api_url,
  headers : {
    "Host": "www.bigkinds.or.kr",
    "Connection": "keep-alive",
    "Content-Length": "1400",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.2 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://www.bigkinds.or.kr",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://www.bigkinds.or.kr/v2/news/search.do",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
    "Cookie": "_ga=GA1.3.1926461380.1586357322; Bigkinds=DE4E34EBF87A2AEC4A9C90B6CFE15E8B; _gid=GA1.3.1902234368.1589941902; _gat=1"
  },
  json: true,
  body:{"indexName":"news","searchKey":"(금값 OR 투자 OR 증권 OR 자산)  AND  (경제)  NOT(비트코인암호화폐)","searchKeys":[{"orKeywords":["금값,투자,증권,자산"],"andKeywords":["경제"],"notKeywords":["비트코인,암호화폐"]}],"byLine":"","searchFilterType":"1","searchScopeType":"1","searchSortType":"date","sortMethod":"date","mainTodayPersonYn":"","startDate":"2020-02-20","endDate":"2020-05-20","newsIds":[],"categoryCodes":["001000000","001005000","001001000","001004000","001003000","001007000","001002000","001006000","002000000","002004000","002010000","002008000","002014000","002011000","002009000","002005000","002001000","002012000","002006000","002002000","002007000","002003000","002013000","005000000","005005000","005001000","005009000","005004000","005008000","005003000","005007000","005002000","005006000","008000000","008005000","008001000","008004000","008003000","008006000","008002000"],"providerCodes":["01100101","01100201","01100301","01100401","01100501","01100611","01100701","01100801","01100901","01101001","01101101","02100101","02100201","02100311","02100801","02100851","02100501","02100601","02100701","08100101","08100201","08200101","08100301","08100401","07101201","07100501"],"incidentCodes":[],"networkNodeType":"","topicOrigin":"","dateCodes":[],"editorialIs":false,"startNo":1,"resultNumber":10,"isTmUsable":false,"isNotTmUsable":false}
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
      console.error('error = ' + response.statusCode);
      console.error('error.body = ' + response.body);
    }
  });
  // console.log("retObj:"+retObj);
  return retObj;
};

module.exports = datum;
