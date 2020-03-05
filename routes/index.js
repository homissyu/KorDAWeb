module.exports = function getData(req, res){
    var ret = {goldBuy:0, goldSell:0, pegGram:0, pesGram:0, pegDon:0, pesDon:0, btc:0, excRate:0, investRate:0, kospi:0, kosdaq:0, dji:0, nasdaq:0, dubai:0, fbNews:0};
    res.render('index', ret);
};;