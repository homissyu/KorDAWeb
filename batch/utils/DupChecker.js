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
    for(var i=0;i<uqRet.length;i++){
        if(uqRet[i].ID == id){
            // logger.info("id:"+id+", uqRet["+i+"].ID:"+uqRet[i].ID);
            return true;
        }
    }
    return false;
};

DupChecker.log = function(){
    logger.info(uqRet);
};

module.exports = DupChecker;