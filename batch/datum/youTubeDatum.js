var Youtube = require('youtube-node');
var youTube = new Youtube();

const logger = require('../utils/logger');


var playListId = 'PLdCdURyEGavxp8mQw-0jJNfC0bkBNKUI2'; // 검색어 지정
var limit = 5;  // 검색 갯수
youTube.setKey('AIzaSyAQJHOZJSuvKRJpNBOAeeG3mZ6FB8IIbO0'); // API 키 입력

var datum = {};

datum.getData = function (req, res){
    var DupChecker = new require('../utils/DupChecker');
    DupChecker.init('SELECT DISTINCT ID FROM YOUTUBE_LIST');
    var retArr = new Array();  
    youTube.getPlayListsItemsById(playListId, limit, (err, res) => {
        if (err) {
            logger.error(err);
        } else {    
            var objArr = JSON.parse(JSON.stringify(res.items));
            for(var i=0;i<objArr.length;i++){
                if(!DupChecker.isDup(objArr[i].id)){
                    var ret = new Object();
                    ret.ID = objArr[i].id;
                    ret.videoId = objArr[i].contentDetails.videoId;
                    ret.channelId = objArr[i].snippet.channelId;
                    ret.title = objArr[i].snippet.title;
                    ret.description = objArr[i].snippet.description;
                    ret.channelTitle = objArr[i].snippet.channelTitle;
                    ret.playlistId = objArr[i].snippet.playlistId;
                    ret.position = objArr[i].snippet.position; 
                    ret.videoPublishedAt = objArr[i].contentDetails.videoPublishedAt;
                    ret.thumnailMediumUrl = objArr[i].snippet.thumbnails.medium.url;
                    ret.thumnailMaxResUrl = objArr[i].snippet.thumbnails.maxres.url; 
                    retArr.push(ret);
                }
            }
            DupChecker = null;
            logger.info("[ Youtube ] Before dup check:"+objArr.length);
            logger.info("[ Youtube ] After dup check:"+retArr.length);
        }
        
        // logger.info("JSON.stringify(res.items):"+JSON.stringify(res.items):);
    });
    return retArr;
};

module.exports = datum;
