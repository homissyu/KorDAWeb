const getConnection = require('../config/db.js');
const logger = require('../utils/logger');
const fbDatum = require("../datum/fbDatum.js");
const sql = "UPDATE FB_LIST SET PICTURE = ? WHERE ID = ?";
async function updateData(value){
    // console.log(value);
    await getConnection((conn) => {
        conn.query(
            sql, [value.picture, value.id], 
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
    let yesterday = new Date(new Date().setDate(new Date().getDate()-365));
    // console.log(new Date().getDate()-1);
    // console.log(new Date().setDate(new Date().getDate()-1));
    // console.log(yesterday);
    let timeStampVal = Math.round(yesterday.getTime()/1000); 
    logger.info("timeStampVal:"+timeStampVal);
    let feedCnt = 100;
    // logger.info("feedCnt:"+feedCnt);
    let tempJson = fbDatum.getData(false, feedCnt, timeStampVal);
    // logger.info("tempJson:"+tempJson);
    let tempLength = tempJson.length;
    logger.info("tempJson.length:"+tempJson.length);
    try{
        if(tempLength > 0){
            for(let i=0;i<tempLength;i++){
                updateData(tempJson[i]);
                logger.info("updateData:tempJson["+i+"]:"+tempJson[i].id); 
            }
        }else{
            logger.info("No picture link found to update on FB_LIST"); 
        }
    } catch (error){
        logger.error(error);
        // pool.releaseConnection();
    }
};

module.exports = db;