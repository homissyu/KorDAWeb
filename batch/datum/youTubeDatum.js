var Youtube = require('youtube-node');
var youTube = new Youtube();

const logger = require('../utils/logger');

var DupChecker = require('../utils/DupChecker');

var playListId = 'PLdCdURyEGavxp8mQw-0jJNfC0bkBNKUI2'; // 검색어 지정
var limit = 5;  // 검색 갯수
youTube.setKey('AIzaSyAQJHOZJSuvKRJpNBOAeeG3mZ6FB8IIbO0'); // API 키 입력

var retArr = new Array();    

var datum = {};

datum.getData = function (req, res){
    DupChecker.init("SELECT DISTINCT ID FROM YOUTUBE_LIST");
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
        }
        // console.log("retArr:"+retArr);
    });
    return retArr;
};

module.exports = datum;
