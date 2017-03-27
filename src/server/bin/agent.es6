let router = require('./router'), request = require('request'), Q = require('q'), log4js = require('log4js'), constant = require('./constant'),agent = require('./agent');

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: constant.logFile, category: 'server'}
    ]
});
let logger = log4js.getLogger('server');

// 由于平台升级，所有http请求都需要封装json
let deliver = param => {
    let option = {url: param.url, json: constant.isRequestJson,headers: constant.requestHeader},deferred = Q.defer();
    param.body? (option.body = param.body):(param.multiple ? (option.formData = param.data) : (option.form = param.data));
    option.timeout = constant.apiTimeout;
    logger.info(option);
    request.post(option, (err, httpResponse, body) => {
        if(err){
            agent.logger.info(`Error in module Agent while delivering API #${JSON.stringify(option)}`);
            agent.logger.error(err);
            deferred.reject(err);
        }
        deferred.resolve(body);
    });

    return deferred.promise
};


let massDeliver = params => {
    let promiseArray = [],
        deferred = Q.defer(),
        makeTmplParam = (params, args) => {
            let data = {};
            let i = 0;
            for (let name in params) {
                data[name] = args[i];
                i++;
            }
            return data;
        };
    for (let name in params) {
        promiseArray.push(deliver(params[name]));
    }

    Q.all(promiseArray).spread(function () {
        deferred.resolve(makeTmplParam(params, arguments));
    }).done(() => {
        //deferred.resolve({});
    }, reason => {
        deferred.reject({error: true, reason});
    })
    return deferred.promise;
};

let getHtml = param => {
    let option = {url: param.url, html: true}, deferred = Q.defer();
    param.multiple ? (option.formData = param.data) : (option.form = param.data);
    request.post(option, (err, httpResponse, body) => {
        deferred.resolve(body)
    });
    return deferred.promise
};
let renderJSONErrorHandler = (response, error, html) =>{
    if (error) {
        logger.error(error);
        logger.info("接口调用失败");
        response.send({success:false, msg:"接口调用失败",error: error.stack});
    } else {
        response.send(html);
    }
}
let renderErrorHandler = (response, error, html) => {
    if (error) {
        logger.error(error);
        logger.info("因为错误重定向到500页面");
        response.render(`${constant.errorPath}/500`, {error: error.stack || error});
    } else {
        response.send(html);
    }
};
let overallErrorHandler = (response, error, html) => {
    if (error) {
        logger.error(error);
        logger.error("因为错误重定向到500页面");
        response.render(`${constant.errorPath}/500`, {
            error: error.stack || error,
            domain: (`${constant.protocol}://${constant.domain}`)
        });
    } else {
        response.send(html);
    }
};
let wrongwayErrorHandler = response => {
    logger.error("访问错误重定向到404页面");
    response.render(`${constant.errorPath}/404`, {domain: (`${constant.protocol}://${constant.domain}`)});
};

let randomRGBColor = () => `#${(function co(lor) {
    return (lor +=
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)])
    && (lor.length == 6) ? lor : co(lor);
})('')}`;
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

let randomHSLColor = (s, _s, l, _l) => `hsl(${Math.round(Math.random()*360)},${Math.round((_s && (_s != "0"))?(Math.random()*s):(Math.random()*(100-s)+s))}%,${Math.round((_l && (_l != "0"))?(Math.random()*l):(Math.random()*(100-l)+l))}%)`;

let randomString = length => {
    let len = 6;
    if (length && (typeof length == "number")) {
        len = length;
    }
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};
export {deliver};
export {massDeliver};
export {getHtml};
export {logger};
export {renderJSONErrorHandler};
export {renderErrorHandler};
export {overallErrorHandler};
export {wrongwayErrorHandler};
export {randomRGBColor};
export {randomHSLColor};
export {randomString};


