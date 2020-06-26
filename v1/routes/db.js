var mysql = require('mysql');
var config = require("./config");

let pool = mysql.createPool(config.getConfig(99));

function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if(!err) {
      callback(conn);
    }
  });
}

module.exports = getConnection;