const request = require('request');

const logger = require('../utils/logger');

getData = function (req, res){
    console.log(req.body);
    res.render('apiWraper', {ret:req.body});
};

module.exports = getData;

