const getConnection = require('../config/db');

function getNews(req, res){
  let sql = "SELECT "+ 
              "A.TITLE, A.BYLINE, A.PROVIDER, A.LINK, A.CONTENT, A.PUB_DATE, A.REGDATE "+
            "FROM "+ 
              "(SELECT "+ 
                "TITLE, '' as BYLINE, '' as PROVIDER, LINK, CONTENT, PUB_DATE, REGDATE "+ 
              "FROM "+ 
                "NEWS_NAVER2 USE INDEX(IDX_PUBDATE) "+ 
              "ORDER BY "+ 
                "PUB_DATE DESC LIMIT 100) A "+ 
            "WHERE "+ 
              "A.CONTENT NOT Like '%윈골%' "+ 
            "AND "+ 
              "A.CONTENT NOT Like '%호반그룹%' "+ 
            "AND "+ 
              "A.CONTENT NOT Like '%골드앤다이아%' "+ 
            "AND "+ 
              "A.TITLE NOT Like '%호반그룹%' "+ 
            "ORDER BY "+ 
              "A.PUB_DATE DESC ";
  getConnection((conn) => {
    conn.query(
      sql, function(err, rows) {
        res.render('news', {ret:rows});
      }
    );
  });
}

module.exports = getNews;