const request = require('request');
const async = require('async');

const logger = require('../utils/logger');

const assetOption = { 
    url:'https://pennygold.kr/v2/shared/assets/kordaAsset'
}

//[{"type":"STOCK","point":"1229630","egold":"3095.8069","esilver":"172697.18"},{"type":"TRADE","point":"144600164","egold":"16605.5442","esilver":"728091.46"}]

var type;
var point;
var egold;
var esilver;

async function getAsset(){
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
            callback(null, getAsset());
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
