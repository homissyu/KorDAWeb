'use strict';

class DateUtil{
    constructor(){
    }
    getFormatDate(dateStr){
        var date = new Date(Date.parse(dateStr));
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
        var ret = year + '.' + month + '.' + day + ' ' + hour + ':' + min;
        return  ret;
    }
}

export default DateUtil;