/**
 * Created by robin on 1/14/16.
 */
let express = require('express'),requester = require('request'),constant = require("../constant");
let router = express.Router();

router.use(function timeLog(req, res, next) {
    next();
    console.log('Using frame router: ', Date.now());
});

let managePost = (request, response) => {
    let path = request.params ? request.params.path : "";
    let param = {}, headers = {};
    for(let prop in request.body){param[prop]=request.body[prop]};
    for(let key in request.headers){headers[key]=request.headers[key]};
    headers.origin = `${constant.protocol}://${constant.legacyDomain}`;//http://115.159.67.217:30005";
    headers.host=constant.legacyDomain;//"115.159.67.217:30005";
    headers.referer = headers.referer.replace(/(?![http:\/\/])[^\/]+\/frame/,headers.host);
    requester.post({url:headers.origin + (path?('/'+path):''),form:param,headers}).pipe(response,{end: true});/*, function (err, httpResponse, body) {
     response.end(body)
     });*/
};

let manageGet = (request, response) => {
    let path = request.params ? request.params.path : "";
    let headers = {};
    for(let key in request.headers){headers[key]=request.headers[key]};
    headers.origin = `${constant.protocol}://${constant.legacyDomain}`;//http://115.159.67.217:30005";
    headers.host=constant.legacyDomain;//"115.159.67.217:30005";
    requester({url:headers.origin + (path?('/'+path):'') + ((!request._isSubstitue && request.session.profile)?('?session_id='+request.session.profile.login_user_id):""),headers:request.headers}).pipe(response,{end: true});
};
router.get('/:path([\\/\\w]*)', (request, response) => {
    manageGet(request,response);
});
router.post('/:path([\\/\\w]*)', (request, response) => {
    managePost(request,response);
});
router.get('/', (request, response) => {
    manageGet(request,response);
});
router.post('/', (request, response) => {
    managePost(request,response);
});

module.exports = router;

