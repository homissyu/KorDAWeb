const request = require('request');
const fs = require('fs');
const logger = require('../utils/logger');
const jandiFile = 'jandi.json';

function send2Jandi(formData) { 
    var options = { 
        url: 'https://wh.jandi.com/connect-api/webhook/20798930/fc512d04cdd0fb76b59329ee54f76e06', 
        headers: { 
            "Content-type": "application/json", 
            "Accept": "application/vnd.tosslab.jandi-v2+json" 
        }, 
        form: formData 
    }; 
    request.post(options, function (err, response, body) { 
        if (err) { 
            console.error('err: ', err); 
            return body; 
        }
        return body; 
    }); 
}

function getFormatDate(date){
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    var hour = date.getHours();
    hour = hour >= 10 ? hour : '0' + hour;          //hour 두자리로 저장
    var min = date.getMinutes();
    min = min >= 10 ? min : '0' + min;          //min 두자리로 저장
    var sec = date.getSeconds();
    sec = sec >= 10 ? sec : '0' + sec;          //sec 두자리로 저장
    return  year + '년 ' + month + '월 ' + day + '일';
}
function getNow(){
    return getFormatDate(new Date());
}

function saveJandiFile(body) { 
    console.log(body);
    let sender,text,time;
    if(body.length != undefined && body.length >0) {
        sender = (body.data).split(":")[0];
        text = (body.data).split(":")[1];
        time = body.createdAt;
    }
    
    var obj = {
        data:[]
    };

    fs.exists(jandiFile, function(exists){
        if(exists){
            // console.log("yes file exists");
            fs.readFile(jandiFile, function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    obj.data.push({
                        sender: sender, 
                        text: text,
                        time: time
                    });
                    var json = JSON.stringify(obj); 
                    fs.writeFile(jandiFile, json, function(err, result) {
                        if(err) console.log('error', err);
                    });
                }
            });
        } else {
            // console.log("file not exists");
            time = getNow();
            obj.data.push({
                sender: "금방금방", 
                text: "<span>안녕하세요? 금방금방입니다. 무엇이 궁금하세요?</span>",
                time: time
            });
            var json = JSON.stringify(obj);
            fs.writeFile(jandiFile, json, function(err, result) {
                if(err) console.log('error', err);
            });
        }
    });
}

const JandiToken = '62950998b18dda6be9535469d7b7396a';

function getData(req, res){
    if(JandiToken != req.body.token) send2Jandi(req.body);
    // console.log(req.body.data);
    saveJandiFile(req.body);
    res.render('4Jandi', {ret:req.body});
}

module.exports = getData;