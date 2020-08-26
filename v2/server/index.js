const getConnection = require('../config/db');
const asset = require('../datum/assetDatum.js');
let fbSql;
let ytSql;
const fbCnt = 8;
let fbRet = {};
const ytCnt = 4;
let ytRet = {};
let ret;
function getData(req, res){
  const assetRet= asset.getData();
  // console.log("fbRet.length:"+fbRet.length);
  // console.log("ytRet.length:"+ytRet.length);
  fbSql = "SELECT "+
            "id, FROM_UNIXTIME(unix_timestamp(`created_time`), '%Y/%m/%d %H:%i:%s') as 'created_time', message, permalink_url, picture "+
          "FROM "+
            "FB_LIST ORDER BY id DESC LIMIT "+fbCnt;
  ytSql = "SELECT "+
            "videoId, ID, channelId, title, description, channelTitle, playlistId, `position`, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl, REG_DATETIME "+
          "FROM "+ 
            "dbkorda.YOUTUBE_LIST "+
          "ORDER BY "+ 
            "dbkorda.YOUTUBE_LIST.`position` LIMIT "+ytCnt;
  getConnection((conn) => {
    conn.query(
      fbSql, function(err, rows) {
        fbRet = rows;
      }
    );
    conn.query(
      ytSql, function(err, rows) {
        ytRet = rows;
      }
    );
    // conn.release();
    // console.log("fbRet.length:"+fbRet.length);
    // console.log("ytRet.length:"+ytRet.length);
    ret = {goldBuy:0, goldSell:0, pegDon:0, pesDon:0, btc:0, excRate:0, investRate:0, kospi:0, kosdaq:0, dji:0, nasdaq:0, wti:0, fbNews:fbRet, pegGram:0, pesGram:0, dubai:0, eth:0, youTubes:ytRet, assetDatum:assetRet};
    // console.log("ret:"+JSON.stringify(ret));
    // var   maxAge =  60 * 60 * 24;
    res.set('Cache-Control', 'public, max-age=31557600');
    res.render('index', ret);
  });
}

module.exports = getData;