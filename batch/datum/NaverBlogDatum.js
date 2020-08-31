const async = require('async');
const rp = require('request-promise');
const logger = require('../utils/logger');
const convert = require('xml-js');

// var DupChecker = new require('../utils/DupChecker');

const api_url = "https://rss.blog.naver.com/cengold.xml";

const options = {
    method:'GET', 
    url: api_url
};

function nativeType(value) {
  var nValue = Number(value);
  if (!isNaN(nValue)) {
    return nValue;
  }
  var bValue = value.toLowerCase();
  if (bValue === 'true') {
    return true;
  } else if (bValue === 'false') {
    return false;
  }
  return value;
}

var removeJsonTextAttribute = function(value, parentElement) {
  try {
    var keyNo = Object.keys(parentElement._parent).length;
    var keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = nativeType(value);
  } catch (e) {}
}

var xml_js_options = {
  compact: true,
  trim: true,
  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreAttributes: true,
  ignoreComment: true,
  ignoreCdata: false,
  ignoreDoctype: true,
  textFn: removeJsonTextAttribute
};

let retObj = new Array();
function getBlogList() {
  rp(
    options
  ).then(
      function (body) { 
        // retObj 
        retObj = JSON.parse(convert.xml2json(body, xml_js_options)).rss.channel.item;
        // logger.info("retObj:"+retObj.length);
        return retObj;
      }
  ).catch(function(err){
      logger.error(err);
      throw err;
  });
}

let datum = {};
datum.getData = function (req, res){
  let DupChecker = new require('../utils/DupChecker');
  DupChecker.init('SELECT DISTINCT TRIM(LINK) AS ID FROM BLOG_NAVER');
  let retArr = new Array();

  async.waterfall([
    function(callback) {
      callback(null, getBlogList());
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
  // logger.info("JSON.stringify(retArr):"+JSON.stringify(retArr));
  return retArr;
};

module.exports = datum;