/**
 * Created by robin on 2/2/16.
 */

let express = require('express'),agent = require('../agent'), ropRouter = require('../router'), log4js = require('log4js'),constant = require("../constant");
let router = express.Router();

router.use((request, response, next) => {
    if(request.query){
        response.redirect(`${constant.protocol}://${constant.domain}:${constant.port}/welcome/debugTool?key=${request.query.sign?(request.query.sign):""}`);
    } else {
        next();
    }

});


module.exports = router;