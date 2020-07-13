'use strict';

const logger = require('./logger');

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
};

DupChecker.isDup = function (id){
    for(var i=0;i<uqRet.length;i++){
        if(uqRet[i].ID == id){
            return true;
        }
    }
    return false;
};

DupChecker.log = function(){
    logger.info(uqRet);
};

module.exports = DupChecker;