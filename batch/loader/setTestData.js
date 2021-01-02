const testDatum = require("../datum/NaverBlogDatum4Kgex.js");
const logger = require('../utils/logger');

let db = {};
db.setData = function () {
    logger.info(testDatum.getData());
}


module.exports = db;