
  var config = {};
  config.getConfig = function (type){
    var connectionLimitCnt
    switch(type){
        case 0://setNewsData.js
            connectionLimitCnt = 20;
            break;
        case 1://setFbData.js
            connectionLimitCnt = 4;
            break;
        case 2://index.js
            connectionLimitCnt = 3;
            break;
        case 3://news.js
            connectionLimitCnt = 3;
            break;
        default:
            connectionLimitCnt = 3;
            break;
    }

    return commonConfig = {
        host     : 'test.test.test',
        user     : 'test',
        port     : '3306',
        database : 'test',
        password : 'test',
        connectionLimit : connectionLimitCnt
    };
  }
  module.exports = config;