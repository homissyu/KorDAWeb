const async = require('async');
const Youtube = require('youtube-node');

const youTube = new Youtube();

const logger = require('../utils/logger');


const playListIdArr = ['PLdCdURyEGavxp8mQw-0jJNfC0bkBNKUI2','PLdCdURyEGavx9GxzS8tofor9mDgSAo9wi']; // 검색어 지정
// const playListId
const limit = 1000;  // 검색 갯수
youTube.setKey('AIzaSyAQJHOZJSuvKRJpNBOAeeG3mZ6FB8IIbO0'); // API 키 입력

let DupChecker;
function initDupChecker(){
    DupChecker = new require('../utils/DupChecker');
    DupChecker.init("SELECT DISTINCT ID FROM YOUTUBE_LIST");
}

function getYoutubeList(playListId){
    youTube.getPlayListsItemsById(playListId, limit, (err, res) => {
        if (err) {
            logger.error(err);
        } else { 
            
            let objArr = JSON.parse(JSON.stringify(res.items));
            for(let i=0;i<objArr.length;i++){
                if(!DupChecker.isDup(objArr[i].id)){
                    let ret = new Object();
                    ret.ID = objArr[i].id;
                    logger.info("objArr[i].id:"+objArr[i].id);
                    logger.info("DupChecker.isDup(objArr[i].id):"+DupChecker.isDup(objArr[i].id));
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
            logger.info("[ Youtube ] Before dup check:"+objArr.length);
            logger.info("[ Youtube ] After dup check:"+retArr.length);
            // DupChecker = null;
        }
    });
}

let datum = {};
let retArr = new Array();
datum.getData = function (req, res){
    let tempArr;
    async.waterfall([
        function(callback) {
            callback(null, initDupChecker());
        },
        function(arg, callback) {
            callback(null, getYoutubeList(playListIdArr[0]));
        }, // 1 
        function(arg, callback) {
            callback(null, getYoutubeList(playListIdArr[1]));
        }
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            logger.info("retArr.length:"+retArr.length);
        }
        tempArr = retArr;
        retArr = [];
    });
    return tempArr;
};

module.exports = datum;
