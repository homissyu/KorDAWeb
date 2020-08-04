'use strict';
const logger = require('../utils/logger');
var DupChecker = {};
var uqRet = {};

DupChecker.init = function(sql){
    const getConnection = require('../config/db');
    getConnection((conn) => {
        conn.query(
            sql, function(err, rows) {
                uqRet = rows;
            }
        );
    });
    // logger.info("SQL:"+sql);
    // logger.info("cnt:"+uqRet.length); 
    // logger.info("result:"+JSON.stringify(uqRet));
};

DupChecker.isDup = function (id){
    // logger.info("uqRet.length:"+uqRet.length);
    // logger.info("id:"+id);
    if(uqRet.length > 0){
        for(var i=0;i<uqRet.length;i++){
            // logger.info("id:"+id+", uqRet["+i+"].ID:"+uqRet[i].ID);
            if(uqRet[i].ID == id){
                // logger.info("DupChecker isDup:"+true);
                return true;
            }
        }
    }else return false;
    // logger.info("result:"+Object.values(uqRet)[0]);
    // return (Object.values(uqRet)).includes(id);
};

DupChecker.log = function(){
    logger.info(uqRet);
};

module.exports = DupChecker;