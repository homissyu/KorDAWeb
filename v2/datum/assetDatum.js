'use strict'

const request = require('request');
const async = require('async');

const logger = require('../utils/logger');

const assetOption = { 
    url:'https://pennygold.kr/v2/shared/assets/kordaAsset'
};

var imageUrl = "https://pennygold.kr/v2/shared/image/view/public/";

var type;
var point;
var egold;
var esilver;

async function getReview(){
    return new Promise(function(resolve, reject){
        resolve(
            request(
                assetOption, 
                function(error, response, body) { 
                    try {
                        // something bad happens here
                        var result = JSON.parse(body);
                        if(result.length == 2){
                            type = result[1].type;
                            point = Number.parseFloat(result[1].point);
                            egold = Number.parseFloat(result[1].egold);
                            esilver = Number.parseFloat(result[1].esilver);
                        }
                    } catch (err) {
                        // if(!response.socket.destroyed) response.socket.destroy();
                        logger.error(err);
                        throw err;
                    }
                }
            )
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed)response.socket.destroy();});
    });
}

var datum = {};
datum.getData = function (req, res){
    var ret = [];
    async.waterfall([
        function(callback) {
            callback(null, getReview());
        }
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            data = {
                "egold":egold, 
                "esilver":esilver,
                "point":point
            };
            // res.render('apiWraper', {ret:data});
            
        }  // 7
    });
    return data;
};

module.exports = datum;