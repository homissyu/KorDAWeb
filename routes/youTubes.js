var mysql = require('mysql');
var config = require("./config");
var pool = mysql.createPool(config.getConfig(3))
var sql;
function getYoutubes(req, res){
    sql = 
    "SELECT "+
        "videoId, ID, channelId, title, description, channelTitle, playlistId, `position`, videoPublishedAt, thumnailMediumUrl, thumnailMaxResUrl, REG_DATETIME "+
    "FROM "+ 
        "dbkorda.YOUTUBE_LIST "+
    "ORDER BY "+ 
        "dbkorda.YOUTUBE_LIST.`position`";
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( sql, function(err, rows) {
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
            res.render('youTubes', {ret:rows});
        });
    });
};
module.exports = getYoutubes;