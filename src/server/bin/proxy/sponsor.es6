/**
 * Created by robin on 1/15/16.
 */
/**
 * Created by robin on 1/14/16.
 */
let express = require('express'), requester = require('request'), agent = require('../agent'), ropRouter = require('../router'), log4js = require('log4js'),constant = require("../constant"),i18n = require('../i18n');;
let router = express.Router(),skipper = (req, res, next) => {next();};

router.get('*',function (req, res, next) {
    const param = {user_domain: req.headers.host.replace(new RegExp(`(\\w)\\.${constant.domain}(:(${constant.port}|${constant.optionPort})){0,1}`),"$1",'i')};
    req.session.locale && (param.lang_flag = i18n.localeMap[req.session.locale]);
    agent.deliver(ropRouter.deliverOption('common', 'sponsor', 'getId', param))
        .then(rawBody => {
            if (rawBody.error_response) {
                agent.renderErrorHandler(res, rawBody.error_response.msg);
                return;
            }
            const body = (constant.ROPRequestType == 1)?rawBody:JSON.parse(rawBody.rop_api_data_get_response.result);
            if (((typeof body.is_success == 'boolean') && body.is_success) || ((typeof body.is_success == 'string') && (body.is_success == 'true'))) {
                //res.redirect('http://open.rongcapital.cn/supplier'+req.url+'?ssv_user_id='+body.ssv_user_id);
                res.render('pages/supplier/index',{_session_id: req.session.id,_info:JSON.stringify({ssv_id:body.ssv_user_id,ssv_name:body.ssv_user_name}),_injection: constant.clientSideScript},(error, html) => {
                    agent.renderErrorHandler(res, error, html)
                });
                //requester({url:'http://open.rongcapital.cn/supplier'+req.url+'?ssv_user_id='+body.ssv_user_id,headers:req.headers}).pipe(res,{end: true});
            } else {
                res.redirect(`${constant.protocol}://${constant.domain}:${constant.port}`);
            }
        })
        .done(() => {
            //response.render('pages/' + module + '/partials/' + partial);
        }, why => {
            agent.logger.info("Error in module Sponsor, while delivering router *");
            agent.logger.error(why);
            agent.renderErrorHandler(res, why);
        });
});

router.use(skipper);


let catRouter = express.Router();

catRouter.get('*',function (req, res, next) {
    const param = {cat_id: req.url.replace(new RegExp(`\/api\/ApiDetail-(.+)\.html`),"$1",'i')};
    req.session.locale && (param.lang_flag = i18n.localeMap[req.session.locale]);
    agent.deliver(ropRouter.deliverOption('common', 'sponsor', 'get_cat_ssv', param))
        .then(rawBody => {
            if (rawBody.error_response) {
                agent.renderErrorHandler(res, rawBody.error_response.msg);
                return;
            }
            const body = (constant.ROPRequestType == 1)?rawBody:JSON.parse(rawBody.rop_api_data_get_response.result);
            if (((typeof body.is_success == 'boolean') && body.is_success) || ((typeof body.is_success == 'string') && (body.is_success == 'true'))) {
                res.redirect(`${constant.protocol}://${body.user_domain}.${constant.domain}:${constant.port}/supplier/API`);
            } else {
                agent.wrongwayErrorHandler(res);
            }
        })
        .done(() => {
            //response.render('pages/' + module + '/partials/' + partial);
        }, why => {
            agent.logger.info("Error in module Sponsor, while delivering router *");
            agent.logger.error(why);
            agent.renderErrorHandler(res, why);
        });
});

catRouter.use(skipper);

module.exports.api = router;
module.exports.cat = catRouter;

