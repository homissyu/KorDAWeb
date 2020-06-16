var kgexConfig = {};
  kgexConfig.getConfig = function (type){
    var connectionLimitCnt = 3;
    return commonConfig = {
        host     : 'test',
        user     : 'test',
        port     : 'test',
        database : 'test',
        password : 'test',
        connectionLimit : connectionLimitCnt
    };
  }
  module.exports = kgexConfig;