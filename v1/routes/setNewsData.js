const getConnection = require('./db');
var newsDatum = require("./newsDatum.js");

var sql = "INSERT INTO NEWS_NAVER (TITLE, LINK, CONTENT, PUB_DATE) VALUES (?,?,?,?)";
async function insertData(value){
    await getConnection((conn) => {
    // Use the connection
        conn.query(
            sql, [value.title.replace(/<(\/b|b)([^>]*)>/gi,""), value.link, value.description.replace(/<(\/b|b)([^>]*)>/gi,""), new Date(value.pubDate)], 
            function(error, result) {
                if(error) {
                    // console.log(error);
                    conn.rollback();
                }else {
                    conn.commit();
                }
                conn.release();
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