const getConnection = require('../config/db');
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
    let tempJson = fbDatum.getData(false);
    let tempLength = tempJson.length;
    try{
        if(tempLength > 0){
            for(let i=0;i<tempLength;i++){
                updateData(tempJson[i]);
                // logger.info("32:tempJson[i]:"+tempJson[i].id); 
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