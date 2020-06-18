const getConnection = require('./db');
var PriceDatum = require("./priceDatum.js");

var sql = "INSERT INTO PRICE_HISTORY (labelKey, labelStr, thisVal, gap, unit, visibilities) VALUES (?,?,?,?,?,?)";
async function insertData(value){
    // value = JSON.parse(JSON.stringify(value));
    // console.log("PROVIDER_CODE:"+value.PROVIDER_CODE)
    
    await getConnection((conn) => {
    // Use the connection
        conn.query( 
            sql, [value.keys, value.label, value.thisValue, value.gap, value.unit, value.visibilities], 
            function(error, result) {
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