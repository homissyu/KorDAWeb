var mysql = require('mysql');
var PriceDatum = require("./priceDatum.js");
var config = require("./config");
var pool = mysql.createPool(config.getConfig(4))
var sql = "INSERT INTO PRICE_HISTORY (labelKey, labelStr, thisVal, gap, unit, visibilities) VALUES (?,?,?,?,?,?)";
async function insertData(value){
    // value = JSON.parse(JSON.stringify(value));
    // console.log("PROVIDER_CODE:"+value.PROVIDER_CODE)
    
    await pool.getConnection(function(err, connection) {
    // Use the connection
        connection.query( sql, [value.keys, value.label, value.thisValue, value.gap, value.unit, value.visibilities], 
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
                    // console.log(result);
                }
                connection.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    // var tempJson = datum.getData();
    tempJson = PriceDatum.getData();
    try{
        if(tempJson[0].TITLE != undefined){
            for(var i=0;i<tempJson.length;i++){
                // console.log(tempJson[i].NEWS_ID.split(".")[1]);
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