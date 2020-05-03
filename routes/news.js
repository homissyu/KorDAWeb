var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'db.korda.im',
    user     : 'korda',
    port     : '3306',
    database : 'dbkorda',
    password : 'korda0326!',
    connectionLimit : 5
})
var sql;
function getNews(req, res){
  sql = "SELECT A.TITLE, A.BYLINE, A.PROVIDER, A.LINK, A.CONTENT, A.PUB_DATE, A.REGDATE FROM (SELECT TITLE, BYLINE, PROVIDER, LINK, CONTENT, PUB_DATE, REGDATE FROM NEWS1 ORDER BY IDX DESC, PUB_DATE DESC LIMIT 100) A ORDER BY A.PUB_DATE DESC";
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query( sql, function(err, rows) {
      // ret = rows;
      // for(var i=0 ; i<rows.length;i++){
      //   console.log("rows[i].TITLE :"+rows[i].TITLE);
      // }
      // And done with the connection.
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
      res.render('news', {ret:rows});
    });
  });
};
module.exports = getNews;