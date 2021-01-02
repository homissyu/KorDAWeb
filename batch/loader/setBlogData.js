const getConnection = require('../config/db.js');
const blogDatum = require("../datum/NaverBlogDatum.js");
const logger = require('../utils/logger');

const sql = "INSERT INTO BLOG_NAVER (TITLE, LINK, CONTENT, PUB_DATE) VALUES (?,?,?,?)";
async function insertData(value){
    await getConnection((conn) => {
    // Use the connection
        conn.query(
            sql, [value.title._cdata.replace(/<(\/b|b)([^>]*)>/gi,""), value.link, value.description._cdata.replace(/<(\/b|b)([^>]*)>/gi,""), new Date(value.pubDate)], 
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

let db = {};
db.setData = function () {
    // var tempJson = datum.getData();
    let tempJson = blogDatum.getData();
    // logger.info("tempJson:"+JSON.stringify(tempJson));
    try{
        if(tempJson.length >0 && tempJson[0].title != undefined){
            for(let i=0;i<tempJson.length;i++){
                // logger.info(tempJson[i].link);
                insertData(tempJson[i]);
            }
        }else{
            logger.info("No data found to insert on BLOG_NAVER"); 
        }
    } catch (error){
        logger.error(error);
        // pool.releaseConnection();
    }
}


module.exports = db;