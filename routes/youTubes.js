const getConnection = require('./db');
var sql;
function getYoutubes(req, res){
    sql = 
        "SELECT "+
            "videoId, ID, channelId, title, description, channelTitle, playlistId, `position`, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl, REG_DATETIME "+
        "FROM "+ 
            "dbkorda.YOUTUBE_LIST "+
        "ORDER BY "+ 
            "dbkorda.YOUTUBE_LIST.`position`";
    getConnection((conn) => {
        conn.query(
            sql, function(err, rows) {
            // ret = rows;
            // for(var i=0 ; i<rows.length;i++){
            //   console.log("rows[i].TITLE :"+rows[i].TITLE);
            // }
            // And done with the connection.
                conn.release();
            // Don't use the connection here, it has been returned to the pool.
                res.render('youTubes', {ret:rows});
            }
        );
    });
};
module.exports = getYoutubes;