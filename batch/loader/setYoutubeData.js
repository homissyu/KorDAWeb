const getConnection = require('../config/db');
var ytDatum = require("../datum/youTubeDatum.js");
const logger = require('../utils/logger');

var chkUqSql = "SELECT DISTINCT ID FROM YOUTUBE_LIST";
var sql = "INSERT INTO YOUTUBE_LIST (ID, videoId, channelId, title, description, channelTitle, playlistId, position, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
async function insertData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            sql, [value.ID, value.videoId, value.channelId, value.title, value.description, value.channelTitle, value.playlistId, value.position, value.videoPublishedAt, value.thumnailMediumUrl, value.thumnailMaxResUrl],
            function(error, rows) {
                if(error) {
                    logger.error(error);
                    conn.rollback();
                }else {
                    conn.commit();
                    // logger.info(result);
                }
            }
        );
    });
};

var db = {};
db.setData = function () {
    var tempJson = ytDatum.getData();
    var tempLength = tempJson.length;
    try{
        if(tempLength > 0){
            for(var i=0;i<tempLength;i++){
                insertData(tempJson[i]);
            }
        }else{
            logger.info("No data found to insert on YOUTUBE_LIST"); 
        }
    } catch (error){
        logger.error(error);
        // pool.releaseConnection();
    }
}

module.exports = db;