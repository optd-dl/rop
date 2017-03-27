'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var router = require('./router'),
    request = require('request'),
    Q = require('q'),
    log4js = require('log4js'),
    constant = require('./constant'),
    agent = require('./agent');

log4js.configure({
    appenders: [{ type: 'console' }, { type: 'file', filename: constant.logFile, category: 'server' }]
});
var logger = log4js.getLogger('server');

// 由于平台升级，所有http请求都需要封装json
var deliver = function deliver(param) {
    var option = { url: param.url, json: constant.isRequestJson, headers: constant.requestHeader },
        deferred = Q.defer();
    param.body ? option.body = param.body : param.multiple ? option.formData = param.data : option.form = param.data;
    option.timeout = constant.apiTimeout;
    logger.info(option);
    request.post(option, function (err, httpResponse, body) {
        if (err) {
            agent.logger.info('Error in module Agent while delivering API #' + JSON.stringify(option));
            agent.logger.error(err);
            deferred.reject(err);
        }
        deferred.resolve(body);
    });

    return deferred.promise;
};

var massDeliver = function massDeliver(params) {
    var promiseArray = [],
        deferred = Q.defer(),
        makeTmplParam = function makeTmplParam(params, args) {
        var data = {};
        var i = 0;
        for (var name in params) {
            data[name] = args[i];
            i++;
        }
        return data;
    };
    for (var name in params) {
        promiseArray.push(deliver(params[name]));
    }

    Q.all(promiseArray).spread(function () {
        deferred.resolve(makeTmplParam(params, arguments));
    }).done(function () {
        //deferred.resolve({});
    }, function (reason) {
        deferred.reject({ error: true, reason: reason });
    });
    return deferred.promise;
};

var getHtml = function getHtml(param) {
    var option = { url: param.url, html: true },
        deferred = Q.defer();
    param.multiple ? option.formData = param.data : option.form = param.data;
    request.post(option, function (err, httpResponse, body) {
        deferred.resolve(body);
    });
    return deferred.promise;
};
var renderJSONErrorHandler = function renderJSONErrorHandler(response, error, html) {
    if (error) {
        logger.error(error);
        logger.info("接口调用失败");
        response.send({ success: false, msg: "接口调用失败", error: error.stack });
    } else {
        response.send(html);
    }
};
var renderErrorHandler = function renderErrorHandler(response, error, html) {
    if (error) {
        logger.error(error);
        logger.info("因为错误重定向到500页面");
        response.render(constant.errorPath + '/500', { error: error.stack || error });
    } else {
        response.send(html);
    }
};
var overallErrorHandler = function overallErrorHandler(response, error, html) {
    if (error) {
        logger.error(error);
        logger.error("因为错误重定向到500页面");
        response.render(constant.errorPath + '/500', {
            error: error.stack || error,
            domain: constant.protocol + '://' + constant.domain
        });
    } else {
        response.send(html);
    }
};
var wrongwayErrorHandler = function wrongwayErrorHandler(response) {
    logger.error("访问错误重定向到404页面");
    response.render(constant.errorPath + '/404', { domain: constant.protocol + '://' + constant.domain });
};

var randomRGBColor = function randomRGBColor() {
    return '#' + function co(lor) {
        return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && lor.length == 6 ? lor : co(lor);
    }('');
};
/*
 var randomLightColor = function () {
 var r = Math.round(Math.random() * 255), g = Math.round(Math.random() * 255), b = ((r + g) > 285) ? Math.round(Math.random() * (r + g - 285) + (540 - r - g)) : 255, rgb = [r.toString(16), g.toString(16), b.toString(16)], color = '#';
 do {
 var matrix = rgb[Math.round(Math.random() * (rgb.length - 1))];
 rgb.splice(rgb.indexOf(matrix), 1);
 color += matrix;
 } while (rgb.length);

 return color;
 }*/

var randomHSLColor = function randomHSLColor(s, _s, l, _l) {
    return 'hsl(' + Math.round(Math.random() * 360) + ',' + Math.round(_s && _s != "0" ? Math.random() * s : Math.random() * (100 - s) + s) + '%,' + Math.round(_l && _l != "0" ? Math.random() * l : Math.random() * (100 - l) + l) + '%)';
};

var randomString = function randomString(length) {
    var len = 6;
    if (length && typeof length == "number") {
        len = length;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};
exports.deliver = deliver;
exports.massDeliver = massDeliver;
exports.getHtml = getHtml;
exports.logger = logger;
exports.renderJSONErrorHandler = renderJSONErrorHandler;
exports.renderErrorHandler = renderErrorHandler;
exports.overallErrorHandler = overallErrorHandler;
exports.wrongwayErrorHandler = wrongwayErrorHandler;
exports.randomRGBColor = randomRGBColor;
exports.randomHSLColor = randomHSLColor;
exports.randomString = randomString;