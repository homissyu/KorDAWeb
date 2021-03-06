const async = require('async');
const rp = require('request-promise');
const logger = require('../utils/logger');

// var DupChecker = new require('../utils/DupChecker');

const count4Naver = 35; //1일 25,000건 검색 무료
const client_id = '3aVbezRKkHUsAHv7IQ9N';
const client_secret = 'KdT0HQTnWc';
let api_url = "https://openapi.naver.com/v1/search/news?display="+count4Naver+"&query=%E9%87%91%EA%B1%B0%EB%9E%98%EC%86%8C+%7C+%EC%84%BC%EA%B3%A8%EB%93%9C+%7C+%EA%B8%88%EA%B1%B0%EB%9E%98+%7C+%EA%B8%88%ED%88%AC%EC%9E%90+%7C+%EA%B8%88%EC%8B%9C%EC%84%B8";
//   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
const options = {
    method:'GET', 
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
};

let retObj = new Array();
function getNewsList() {
  rp(
    options
  ).then(
      function (body) { 
        retObj = (JSON.parse(body)).items;
        // return retObj;
        logger.info(retObj);
      }
  ).catch(function(err){
      logger.error(err);
      throw err;
  });
}

function setNegativeKeyword(){
  let NegativeKeyword = [
    '윈골드', '호반', '골드앤다이아'
  ];
  let ret = "";
  for(let i=0;i<NegativeKeyword.length;i++){
    ret += '+-' + encodeURIComponent(NegativeKeyword[i]);
  }
  api_url += ret;
}

let datum = {};
datum.getData = function (req, res){
  setNegativeKeyword();
  let DupChecker = new require('../utils/DupChecker');
  DupChecker.init('SELECT DISTINCT TRIM(LINK) AS ID FROM NEWS_NAVER');
  let retArr = new Array();

  async.waterfall([
    function(callback) {
      callback(null, getNewsList());
    }
  ], function (err, result) {
    if(err){
      logger.error(err);
      res.socket.destroy();
    }else {
      let j=0;
      logger.info("[ News ] Before dup check:"+retObj.length);
      for(let i=0;i<retObj.length;i++){
        // console.log(retObj[i].link);
        if(!DupChecker.isDup(retObj[i].link.trim())) {
          logger.info("DupChecker:"+false);
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