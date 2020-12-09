const getConnection = require('../config/db');

function getNews(req, res){
  let sql = "SELECT A.TITLE, A.BYLINE, A.PROVIDER, A.LINK, A.CONTENT, A.PUB_DATE, A.REGDATE FROM (SELECT TITLE, '' as BYLINE, '' as PROVIDER, LINK, CONTENT, PUB_DATE, REGDATE FROM NEWS_NAVER2 USE INDEX(IDX_PUBDATE) ORDER BY PUB_DATE DESC LIMIT 100) A ORDER BY A.PUB_DATE DESC";
  getConnection((conn) => {
    conn.query(
      sql, function(err, rows) {
        // ret = rows;
        // for(var i=0 ; i<rows.length;i++){
        //   console.log("rows[i].TITLE :"+rows[i].TITLE);
        // }
        // And done with the connection.
        // conn.release();
        // Don't use the connection here, it has been returned to the pool.
        res.render('news', {ret:rows});
      }
    );
  });
}

module.exports = getNews;