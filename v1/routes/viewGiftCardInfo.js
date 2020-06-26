// var oracle = require('oracledb');

var config = require("./kgexConfig");
// var pool = oracle.getConnection(config.getConfig());
var sql;
// oracle.autoCommit = true;
function viewGiftCardInfo(req, res){
//   sql = "SELECT * FROM IF_VIEW_GC_SALESBACK_FEES WHERE SERIALNUMBER = ?";
//   pool.getConnection(function(err, connection) {
//     // Use the connection
//     connection.query( sql, function(err, rows) {
//       // ret = rows;
//       // for(var i=0 ; i<rows.length;i++){
//       //   console.log("rows[i].TITLE :"+rows[i].TITLE);
//       // }
//       // And done with the connection.
//       connection.release();
//       // Don't use the connection here, it has been returned to the pool.
//       var addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//       var ret = {lat:req.query.lat, lng:req.query.lng, id:req.query.id, ip:addr, rows:rows};
//       res.render('viewGiftCardInfo', ret);
//     });
//   });
};
module.exports = viewGiftCardInfo;