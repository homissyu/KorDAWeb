const getConnection = require('../config/db');
var ytDatum = require("../datum/youTubeDatum.js");
const logger = require('../utils/logger');

var insertSQL = "INSERT INTO YOUTUBE_LIST (ID, videoId, channelId, title, description, channelTitle, playlistId, position, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
var truncateSQL = "TRUNCATE TABLE YOUTUBE_LIST";

async function truncateTable(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            truncateSQL,
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

async function insertData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            insertSQL, [value.ID, value.videoId, value.channelId, value.title, value.description, value.channelTitle, value.playlistId, value.position, value.videoPublishedAt, value.thumnailMediumUrl, value.thumnailMaxResUrl],
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
    logger.info("tempLength:"+tempLength);
    try{
        logger.info(JSON.stringify(tempJson));
        if(tempLength > 0){
            for(var i=0;i<tempLength;i++){
                if(i==0)truncateTable();
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