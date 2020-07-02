const getConnection = require('../config/db');
var ytDatum = require("../datum/youTubeDatum.js");

var sql = "INSERT INTO YOUTUBE_LIST (ID, videoId, channelId, title, description, channelTitle, playlistId, position, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
async function insertData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            sql, [value.ID, value.videoId, value.channelId, value.title, value.description, value.channelTitle, value.playlistId, value.position, value.videoPublishedAt, value.thumnailMediumUrl, value.thumnailMaxResUrl],
            function(error, rows) {
                if(error) {
                    // console.log(error);
                    conn.rollback();
                }else {
                    conn.commit();
                    // console.log(result);
                }
                conn.release();
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
            console.log("No data found to insert on YOUTUBE_LIST"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;