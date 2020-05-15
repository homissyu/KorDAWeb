var kgexConfig = {};
  kgexConfig.getConfig = function (type){
    var connectionLimitCnt = 3;
    return commonConfig = {
        host     : 'database-1.clnz3ouiz0mf.ap-northeast-2.rds.amazonaws.com',
        user     : 'korda',
        port     : '1521',
        database : 'ORCL',
        password : 'KorDA0326!',
        connectionLimit : connectionLimitCnt
    };
  }
  module.exports = kgexConfig;