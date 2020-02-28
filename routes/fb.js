const express = require("express");
const request = require('request');

var retArr = new Array();
var ret;   
var objArr;

function getIdArr(req, res) { 
    request(
        { 
            method:'GET', 
            url:'https://graph.facebook.com/v6.0/2819705001436386/feed?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD'
        }, 
        function(error, response, body) { 
            if(error){throw error;}   
            var i = 0;
            objArr = JSON.parse(body);
            var tempId = new Array();
            for(var subKey in objArr["data"]){
                if(subKey<5){
                    tempId[subKey] = objArr["data"][subKey]["id"];
                    request(
                        {
                            method:'GET', 
                            uri:'https://graph.facebook.com/v6.0/'+tempId[subKey]+'?access_token=EAAkWsUhEDOUBAACZCgvRIsAk1xObIjGv1N5k8uetplXTJh8kWIEYj65u2YkgQb8RaxGxn1y8Pk1h1oMbfDBTZAFGVf3vHuKCWdIaYsZBA51vD5sxIJNR27cXcfh8DxFBMiPdgh1lsZCtNfz7NbCjMBQIZCPF0eD2Syz40lxRqM1ReX2XmQftSOK3W2Cj9u2EZD&fields=permalink_url,picture,message,updated_time' 
                        }, 
                        function(error, response, body) { 
                            if(error){throw error;} 
                            retArr[i] = JSON.parse(body);
                            i++;
                        }
                    );
                }else{
                    break;
                }
            }
            setTimeout(function(){res.render('fb', {fbNews:retArr.sort(custom_sort)})}, 500);
        }
    );
};

function custom_sort(a, b) {
    return new Date(b.updated_time).getTime() - new Date(a.updated_time).getTime();
}

module.exports = getIdArr;