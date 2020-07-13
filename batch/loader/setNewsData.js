const getConnection = require('../config/db');
var newsDatum = require("../datum/newsDatum.js");
const logger = require('../utils/logger');

var sql = "INSERT INTO NEWS_NAVER (TITLE, LINK, CONTENT, PUB_DATE) VALUES (?,?,?,?)";
async function insertData(value){
    await getConnection((conn) => {
    // Use the connection
        conn.query(
            sql, [value.title.replace(/<(\/b|b)([^>]*)>/gi,""), value.link, value.description.replace(/<(\/b|b)([^>]*)>/gi,""), new Date(value.pubDate)], 
            function(error, result) {
                if(error) {
                    logger.error(error);
                    conn.rollback();
                }else {
                    conn.commit();
                }
                // conn.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    // var tempJson = datum.getData();
    var tempJson = newsDatum.getData();
    // logger.info("tempJson[0]:"+JSON.stringify(tempJson)[0].title);
    try{
        if(tempJson[0].title != undefined){
            for(var i=0;i<tempJson.length;i++){
                // logger.info(tempJson[i].link);
                insertData(tempJson[i]);
            }
        }else{
            logger.info("No data found to insert on NEWS1"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;