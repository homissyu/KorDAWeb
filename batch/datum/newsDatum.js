const request = require('request');
const logger = require('../utils/logger');

// var DupChecker = new require('../utils/DupChecker');

var client_id = '3aVbezRKkHUsAHv7IQ9N';
var client_secret = 'KdT0HQTnWc';
var api_url = "https://openapi.naver.com/v1/search/news?display=100&query=%E9%87%91%EA%B1%B0%EB%9E%98%EC%86%8C+%7C+%EC%84%BC%EA%B3%A8%EB%93%9C+%7C+%EA%B8%88%EA%B1%B0%EB%9E%98+%7C+%EA%B8%88%ED%88%AC%EC%9E%90+%7C+%EA%B8%88%EC%8B%9C%EC%84%B8";
//   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
var options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
};

var retObj = new Array();
var retArr = new Array();
  
var datum = {};
datum.getData = function (req, res){
  var DupChecker = new require('../utils/DupChecker');
  DupChecker.init('SELECT TRIM(LINK) AS ID FROM NEWS_NAVER');

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      // res.end(body);
      // if(!DupChecker.isDup(retObj[i].link)){}
      retObj = (JSON.parse(body)).items;
      var j=0;
      
      for(var i=0;i<retObj.length;i++){
        // console.log(retObj[i].link);
        if(!DupChecker.isDup(retObj[i].link.trim())) {
          logger.info("DupChecker:"+false);
          retArr[j] = retObj[i];
          j++;
        }
      }
      // logger.info("81:"+JSON.stringify(retObj));
      logger.info("[ News ] Before dup check:"+retObj.length);
      logger.info("[ News ] After dup check:"+retArr.length);
      
    } else {
      logger.error("error="+response.statusCode);
      logger.error("error.body="+response.body);
    }
  });
  // console.log("retObj:"+retObj);
  // console.log("retArr.length="+retArr.length);
  return retArr;
};

module.exports = datum;