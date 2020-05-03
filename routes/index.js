var mysql = require('mysql');
var config = require("./config");
var pool = mysql.createPool(config.getConfig(2))
var sql;
var feCnt = 10;
var ret;
function getData(req, res){
  sql = "SELECT id, FROM_UNIXTIME(unix_timestamp(`created_time`), '%Y/%m/%d %H:%i:%s') as 'created_time', message, permalink_url, picture FROM FB_LIST ORDER BY id DESC LIMIT "+feCnt;
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query( sql, function(err, rows) {
      // ret = rows;
      // for(var i=0 ; i<rows.length;i++){
      //   console.log("rows[i].TITLE :"+rows[i].TITLE);
      // }
      // And done with the connection.
        connection.release();
      // Don't use the connection here, it has been returned to the pool.
        ret = {goldBuy:0, goldSell:0, pegDon:0, pesDon:0, btc:0, excRate:0, investRate:0, kospi:0, kosdaq:0, dji:0, nasdaq:0, wti:0, fbNews:rows, pegGram:0, pesGram:0, dubai:0, eth:0};
        
        res.render('index', ret);
    });
  });
};

module.exports = getData;
