const request = require('request');

var client_id = '3aVbezRKkHUsAHv7IQ9N';
var client_secret = 'KdT0HQTnWc';
var api_url = "https://openapi.naver.com/v1/search/news?display=100&query=%EA%B2%BD%EC%A0%9C+%EA%B8%88+%EC%A6%9D%EA%B6%8C+%EC%9E%90%EC%82%B0+%ED%88%AC%EC%9E%90";
//   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
var options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
};

var datum = {};
var retObj;
datum.getData = function (req, res){
  
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      // res.end(body);
      retObj = (JSON.parse(body)).items;
      // console.log("retObj="+JSON.stringify(retObj))
    
    } else {
      console.log("error="+response.statusCode);
      console.log("error.body="+response.body);
    }
  });
  // console.log("retObj:"+retObj);
  return retObj;
}

module.exports = datum;

