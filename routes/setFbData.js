var mysql = require('mysql');
var fbDatum = require("./fbDatum.js");
var config = require("./config");
var pool = mysql.createPool(config.getConfig(1))
var sql = "INSERT INTO FB_LIST (ID, MESSAGE, PICTURE, PERMALINK_URL, CREATED_TIME, UPDATE_TIME, STATUS_TYPE) VALUES (?,?,?,?,?,?,?)";
async function insertData(value){
    console.log(value);
    await pool.getConnection(function(err, connection) {
    // Use the connection
        connection.query( sql, [value.id, value.message, value.picture, value.permalink_url, value.created_time, value.updated_time, value.status_type], 
            function(error, result) {
                if(error) {
                    console.log(error);
                    connection.rollback();
                    // console.log("======================");
                    // console.log("value.label:"+value.label);
                    // console.log("value.thisVal:"+value.thisValue);
                    // console.log("value.lastVal:"+value.elapsedVal);
                    // console.log("======================");
                }else {
                    connection.commit();
                    console.log(result);
                }
                connection.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    var tempJson = fbDatum.getData();
    var tempLength = tempJson.length;
    try{
        if(tempLength > 0){
            for(var i=0;i<tempLength;i++){
                insertData(tempJson[i]);
            }
        }else{
            console.log("No data found to insert"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;