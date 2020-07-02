const getConnection = require('../config/db');
var fbDatum = require("../datum/fbDatum.js");

var sql = "INSERT INTO FB_LIST (ID, MESSAGE, PICTURE, PERMALINK_URL, CREATED_TIME, UPDATE_TIME, STATUS_TYPE) VALUES (?,?,?,?,?,?,?)";
async function insertData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            sql, [value.id, value.message, value.picture, value.permalink_url, value.created_time, value.updated_time, value.status_type], 
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
    var tempJson = fbDatum.getData();
    var tempLength = tempJson.length;
    try{
        if(tempLength > 0){
            for(var i=0;i<tempLength;i++){
                insertData(tempJson[i]);
            }
        }else{
            console.log("No data found to insert on FB_LIST"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;