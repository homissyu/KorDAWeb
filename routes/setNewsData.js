var mysql = require('mysql');
var newsDatum = require("./newsDatum.js");
var config = require("./config");
var pool = mysql.createPool(config.getConfig(0))
var sql = "INSERT INTO NEWS_NAVER (TITLE, LINK, CONTENT, PUB_DATE) VALUES (?,?,?,?)";

async function insertData(value){
    await pool.getConnection(function(err, connection) {
    // Use the connection
        connection.query( sql, [value.title.replace(/<(\/b|b)([^>]*)>/gi,""), value.link, value.description.replace(/<(\/b|b)([^>]*)>/gi,""), new Date(value.pubDate)], 
            function(error, result) {
                if(error) {
                    // console.log(error);
                    connection.rollback();
                }else {
                    connection.commit();
                }
                connection.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    // var tempJson = datum.getData();
    var tempJson = newsDatum.getData();
    // console.log(tempJson);
    try{
        if(tempJson[0].title != undefined){
            for(var i=0;i<tempJson.length;i++){
                // console.log(tempJson[i].title);
                insertData(tempJson[i]);
            }
        }else{
            console.log("No data found to insert on NEWS1"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;