
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
            connectionLimitCnt = 5;
            break;
    }

    return commonConfig = {
        host     : 'db.korda.im',
        user     : 'korda',
        port     : '3306',
        database : 'dbkorda',
        password : 'korda0326!',
        connectionLimit : connectionLimitCnt
    };
  }
  module.exports = config;