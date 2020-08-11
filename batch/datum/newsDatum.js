const async = require('async');
const rp = require('request-promise');
const logger = require('../utils/logger');

// var DupChecker = new require('../utils/DupChecker');

var client_id = '3aVbezRKkHUsAHv7IQ9N';
var client_secret = 'KdT0HQTnWc';
var api_url = "https://openapi.naver.com/v1/search/news?display=100&query=%E9%87%91%EA%B1%B0%EB%9E%98%EC%86%8C+%7C+%EC%84%BC%EA%B3%A8%EB%93%9C+%7C+%EA%B8%88%EA%B1%B0%EB%9E%98+%7C+%EA%B8%88%ED%88%AC%EC%9E%90+%7C+%EA%B8%88%EC%8B%9C%EC%84%B8";
//   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
var options = {
    method:'GET', 
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
};

var retObj = new Array();
function getNewsList() {
  rp(
    options
  ).then(
      function (body) { 
        retObj = (JSON.parse(body)).items;
        return retObj;
      }
  ).catch(function(err){
      logger.error(err);
      throw err;
  });
}

var datum = {};
datum.getData = function (req, res){
  var DupChecker = new require('../utils/DupChecker');
  DupChecker.init('SELECT DISTINCT TRIM(LINK) AS ID FROM NEWS_NAVER');
  var retArr = new Array();

  async.waterfall([
    function(callback) {
      callback(null, getNewsList());
    }
  ], function (err, result) {
    if(err){
      logger.error(err);
      res.socket.destroy();
    }else {
      var j=0;
      logger.info("[ News ] Before dup check:"+retObj.length);
      for(var i=0;i<retObj.length;i++){
        // console.log(retObj[i].link);
        if(!DupChecker.isDup(retObj[i].link.trim())) {
          // logger.info("DupChecker:"+false);
          retArr[j] = retObj[i];
          j++;
        }
      }
      DupChecker = null;
      logger.info("[ News ] After dup check:"+retArr.length);
    }
  });
  return retArr;
};

module.exports = datum;