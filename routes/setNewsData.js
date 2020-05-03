var mysql = require('mysql');
var newsDatum = require("./newsDatum.js");

var pool = mysql.createPool({
    host     : 'db.korda.im',
    user     : 'korda',
    port     : '3306',
    database : 'dbkorda',
    password : 'korda0326!',
    connectionLimit : 20
})
var sql = "INSERT INTO NEWS1 (NEWS_ID, TITLE, PROVIDER, BYLINE, LINK, CONTENT, PUB_DATE) VALUES (?,?,?,?,?,?,?)";
var dateStr;
var splitLength;
var tempStr = "://"; //for 아시아경제
async function insertData(value){
    // value = JSON.parse(JSON.stringify(value));
    // console.log("PROVIDER_CODE:"+value.PROVIDER_CODE)
    
    if("02100501" == value.PROVIDER_CODE){ // for 파이낸셜뉴스
        dateStr = value.PROVIDER_NEWS_ID;
        splitLength = 4;
    }else{
        dateStr = (value.NEWS_ID.split(".")[1]);
        splitLength = 3
    }

    if("02100801" == value.PROVIDER_CODE){ // for 아시아경제
        console.log("02100801:"+value.PROVIDER_LINK_PAGE.indexOf(tempStr))
        var tempArr;
        if(0>value.PROVIDER_LINK_PAGE.indexOf(tempStr)){
            tempArr = value.PROVIDER_LINK_PAGE.split(":");
            value.PROVIDER_LINK_PAGE = tempArr[0]+tempStr+tempArr[1];
        }
    }

    // console.log("PROVIDER_CODE:"+value.PROVIDER_CODE+", dateStr:"+dateStr+", splitLength:"+splitLength);

    dateStr = dateStr.substring(0,dateStr.length-splitLength);
    var date = new Date(dateStr.replace(
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
        '$4:$5:$6 $2/$3/$1'
    ));
    
    // console.log("PROVIDER_CODE:"+value.PROVIDER_CODE+", dateStr:"+dateStr+", splitLength:"+splitLength+", date:"+date);

    // await pool.query(sql, [value.TITLE.replace(/(<([^>]+)>)/ig,""), value.PROVIDER, value.BYLINE.replace(";",""), value.PROVIDER_LINK_PAGE, value.CONTENT.replace(/(<([^>]+)>)/ig,""), date], function (error, result) {
    //     if(error) {
    //         console.log(error);
    //         // console.log("======================");
    //         // console.log("value.label:"+value.label);
    //         // console.log("value.thisVal:"+value.thisValue);
    //         // console.log("value.lastVal:"+value.elapsedVal);
    //         // console.log("======================");
    //     }else {
    //         // console.log("value.visibilities:"+value.visibilities);
    //         console.log("successfully insert");
    //     }
    // });

    await pool.getConnection(function(err, connection) {
    // Use the connection
        connection.query( sql, [value.NEWS_ID, value.TITLE.replace(/(<([^>]+)>)/ig,""), value.PROVIDER, value.BYLINE.replace(";",""), value.PROVIDER_LINK_PAGE, value.CONTENT.replace(/(<([^>]+)>)/ig,""), date], 
            function(error, result) {
                if(error) {
                    // console.log(error);
                    connection.rollback();
                    // console.log("======================");
                    // console.log("value.label:"+value.label);
                    // console.log("value.thisVal:"+value.thisValue);
                    // console.log("value.lastVal:"+value.elapsedVal);
                    // console.log("======================");
                }else {
                    connection.commit();
                    // console.log(result);
                }
                connection.release();
            }
        );
    });
};

var db = {};
db.setData = function () {
    // var tempJson = datum.getData();
    tempJson = newsDatum.getData();
    try{
        if(tempJson[0].TITLE != undefined){
            for(var i=0;i<tempJson.length;i++){
                // console.log(tempJson[i].NEWS_ID.split(".")[1]);
                insertData(tempJson[i]);
            }
        }else{
            console.log("No data found to insert"); 
        }
    } catch (error){
        // pool.releaseConnection();
    }
}

module.exports = db;