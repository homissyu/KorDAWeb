var mysql = require('mysql');
var ytDatum = require("./youTubeDatum.js");
var config = require("./config");
var pool = mysql.createPool(config.getConfig(1))
var sql = "INSERT INTO YOUTUBE_LIST (ID, videoId, channelId, title, description, channelTitle, playlistId, position, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
async function insertData(value){
    // console.log(value);
    await pool.getConnection(function(err, connection) {
    // Use the connection
        connection.query( sql, [value.ID, value.videoId, value.channelId, value.title, value.description, value.channelTitle, value.playlistId, value.position, value.videoPublishedAt, value.thumnailMediumUrl, value.thumnailMaxResUrl], 
            function(error, result) {
                if(error) {
                    // console.log(error);
                    connection.rollback();
                    // console.log("======================");
                    // console.log("value.label:"+value.label);
                    // console.log("value.thisVal:"+value.thisValue);
                    // console.log("value.lastVal:"+value.elapsedVal);
                    // console.log("======================");
                }else {
                    connection.commit();
                    // console.log(result);
                }
                connection.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    var tempJson = ytDatum.getData();
    // console.log("tempJson:"+tempJson);
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