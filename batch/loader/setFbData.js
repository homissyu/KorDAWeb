const getConnection = require('../config/db');
const logger = require('../utils/logger');
const fbDatum = require("../datum/fbDatum.js");
const sql = "INSERT INTO FB_LIST (ID, MESSAGE, PICTURE, PERMALINK_URL, CREATED_TIME, UPDATE_TIME, STATUS_TYPE) VALUES (?,?,?,?,?,?,?)";
async function insertData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            sql, [value.id, value.message, value.picture, value.permalink_url, value.created_time, value.updated_time, value.status_type], 
            function(error, result) {
                if(error) {
                    logger.error(error);
                    conn.rollback();
                }else {
                    conn.commit();
                    // logger.info(result);
                }
                // conn.release();
            }
        );
    });
};

let db = {};
db.setData = function () {
    let yesterday = new Date(new Date().setDate(new Date().getDate()-40));
    // console.log(new Date().getDate()-1);
    // console.log(new Date().setDate(new Date().getDate()-1));
    // console.log(yesterday);
    let timeStampVal = Math.round(yesterday.getTime()/1000); 
    logger.info("timeStampVal:"+timeStampVal);
    let feedCnt = 100;
    // logger.info("feedCnt:"+feedCnt);
    let tempJson = fbDatum.getData(true, feedCnt, timeStampVal);
    let tempLength = tempJson.length;
    try{
        if(tempLength > 0){
            for(let i=0;i<tempLength;i++){
                insertData(tempJson[i]);
                // logger.info("32:tempJson[i]:"+tempJson[i].id); 
            }
        }else{
            logger.info("No data found to insert on FB_LIST"); 
        }
    } catch (error){
        logger.error(error);
        // pool.releaseConnection();
    }
};

module.exports = db;