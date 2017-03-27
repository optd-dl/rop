'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var express = require('express'),
    agent = require('./agent'),
    router = require('./router'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    session = require('express-session'),
    upload = multer(),
    app = express(),

/*    sse = require('./sse'),*/
proxy_sponsor = require('./proxy/sponsor'),
    proxy_legacy = require('./proxy/legacy'),
    proxy_apitool = require('./proxy/apitool'),
    constant = require('./constant'),
    i18n = require('./i18n'),
    couchbase = require('./couchbase'),
    captcha = require('./etc/captcha'),
    etc = require('./etc/miscellaneous');

var secret = "7AE0800C-BBF9-44CD-A568-460E75C16DD4",
    viewDir = "pages",
    templateDir = "template";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.set('port', process.env.PORT || constant.port);
app.set('views', __dirname + '/../' + constant.viewsPath);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/../' + constant.staticPath));
app.use(bodyParser.json({ limit: '5mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('shiqifeng2000@gmail.com'));

app.use(couchbase.session);

app.use(i18n.updateLocale);
app.use(function (req, res, next) {
    if (!req || !res) {
        agent.logger.info("Http request or Http response not working, please verify the server network or server agents such as Nginx");
        agent.logger.error("Http communication Error");
        agent.overallErrorHandler(res, "Http communication Error");
        return;
    }
    if (!req.session) {
        agent.logger.info("Session not exist, please verify the couchbase connection and the code");
        agent.logger.error("Couchbase Error");
        agent.overallErrorHandler(res, "Couchbase Error");
        return;
    }
    req.url && agent.logger.info('Incoming request: ' + req.url);
    req.connection && req.connection.remoteAddress && agent.logger.info('Incoming request from: ' + req.connection.remoteAddress);
    req.method && agent.logger.info('Incoming request method: ' + req.method);
    req.body && agent.logger.info('Incoming request body: ' + JSON.stringify(req.body));
    req.referer && agent.logger.info('Incoming request referer: ' + req.referer);
    next();
});
app.use(captcha({ url: '/captcha', color: '#ff8500', background: 'rgba(0,0,0,0)', canvasWidth: 350 }));

// TODO 用于解决静态图片没有找到时，下行到业务路由规则的问题
app.get('(/\\w*)*.(png|jpeg|psd|ico|gif|jpg)', function (request, response) {
    agent.logger.warn('\u627E\u4E0D\u5230\u56FE\u7247' + request.url + ', \u5C06\u8FD4\u56DE404\u63D0\u793A\u56FE\u7247');
    response.status(404).sendFile("/resource/404-min.jpg", { root: __dirname + '/public' });
});

// TODO 用于解决静态文本（不包括html）没有找到时，下行到业务路由规则的问题
app.get('(/\\w*)*.((?!html)\\w)*', function (request, response) {
    agent.logger.warn('\u627E\u4E0D\u5230\u6587\u672C' + request.url + ', \u5C06\u8FD4\u56DE404\u63D0\u793A\u6587\u672C');
    response.status(404).send("没有找到文本");
});

// TODO 供应商域名的路由
app.use(function (req, res, next) {
    if (req && req.headers && req.headers.host && (!req.headers.referer || new RegExp(constant.protocol + '://' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}/').test(req.headers.referer)) && new RegExp('^\\w+\\.' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}$').test(req.headers.host) && !/^\/api\/.+\.html$/.test(req.url)) {
        return proxy_sponsor.api.apply(this, arguments);
    } else if (req && req.headers && req.headers.host && new RegExp('^' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}$').test(req.headers.host) && /^\/api\/ApiDetail-.+\.html$/.test(req.url)) {
        return proxy_sponsor.cat.apply(this, arguments);
    } else if (req && req.headers && req.headers.host && new RegExp('^\\w+\\.' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}$').test(req.headers.host) && /^\/api\/ApiList$/.test(req.url)) {
        res.redirect(constant.protocol + '://' + req.headers.host + '/supplier/API');
    } else if (req && req.headers && req.headers.host && new RegExp('^' + constant.domain + '(:(' + constant.port + '|' + constant.optionPort + ')){0,1}$').test(req.headers.host) && /^\/api\/ApiList$/.test(req.url)) {
        res.redirect(constant.protocol + '://' + req.headers.host + '/welcome/suppliers');
    } else {
        next();
    }
});

app.use('/api', proxy_legacy);
app.use('/ApiTool/index', proxy_apitool);

app.get('/frame/:path([\\/\\w]*)', function (request, response) {
    var path = request.params ? request.params.path : "";
    if (path == "ApiTool/index") {
        var sign = request.query && request.query.sign ? request.query.sign : '';
        response.redirect(constant.protocol + '://' + constant.legacyDomain + '/' + path + '?sign=' + sign);
    } else {
        if (!request.session.profile) {
            //response.redirect('/sso?from=console');
            response.render(viewDir + '/sso/domain_walker', { domain: constant.protocol + '://' + constant.domain }, function (error, html) {
                agent.renderErrorHandler(response, error, html);
            });
            return;
        }
        var timestamp = Math.ceil(Date.parse(new Date()) / 1000),
            rawSign = secret + (request.session.profile ? 'session_id' + request.session.profile.login_user_id + 'sub_session_id' + request.session.profile.login_sub_user_id : "") + 'timestamp' + timestamp + secret;
        response.redirect(constant.protocol + '://' + constant.legacyDomain + '/' + path + '?timestamp=' + timestamp + '&sign=' + rawSign.md5().toUpperCase() + (request.session.profile ? '&session_id=' + request.session.profile.login_user_id + '&sub_session_id=' + request.session.profile.login_sub_user_id : ""));
    }
});
// TODO 用于解决静态文本没有找到时，下行到业务路由规则的问题
app.get('(/\\w*)*.(\\w)+', function (request, response) {
    agent.logger.warn('\u627E\u4E0D\u5230\u6587\u672C' + request.url + ', \u5C06\u8FD4\u56DE404\u63D0\u793A\u6587\u672C');
    response.status(404).send("没有找到页面");
});

app.get('/_template/:path', function (request, response) {
    var path = request.params ? request.params.path : "";
    if (constant.templateList.indexOf(path) == -1) {
        agent.wrongwayErrorHandler(response);
        return;
    }
    response.render(templateDir + '/' + path, {
        _session_id: request.session.id,
        _injection: constant.clientSideScript
    }, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});

app.get('/', function (request, response) {
    //console.log(response.__('Hello'));
    response.render(viewDir + '/welcome/index', {
        _session_id: request.session.id,
        _injection: constant.clientSideScript
    }, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});

//let [clients,clientId] = [[],0];
app.get('/sse/:module/:api', function (request, response) {
    var _module = request.params ? request.params.module : "common",
        _api = request.params ? request.params.api : "";

    var param = {};
    for (var prop in request.query) {
        param[prop] = request.query[prop];
    };
    request.session.profile && (param.session_id = request.session.profile.login_user_id);
    request.session.locale && (param.lang_flag = i18n.localeMap[request.session.locale]);

    response.writeHead(200, {
        'Content-Type': 'text/event-stream', // <- Important headers
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    if (!request.session.profile) {
        response.write('data:' + JSON.stringify({ _closeSSE: 1 }) + '\nretry:3600000\n\n');
        return;
    }
    /*if(clients.indexOf(request.session.id) != -1){
        response.write(`data:${JSON.stringify({_skipSSE:1})}\nretry:3600000\n\n`);
        return;
    }*/
    var runner = function runner(once) {
        agent.deliver(router.deliverOption("sse", _module, _api, param)).then(function (rawBody) {
            if (rawBody.error_response) {
                agent.renderJSONErrorHandler(response, rawBody.error_response.msg);
                return;
            }
            var body = constant.ROPRequestType == 1 ? rawBody : JSON.parse(rawBody.rop_api_data_get_response.result);

            if (once) {
                body._closeSSE = 1;
                response.write('data:' + JSON.stringify(body || {}) + '\nretry:3600000\n\n');
            } else {
                request.session.sseInProcess = true;
                response.write('data:' + JSON.stringify(body || {}) + '\nretry:3600000\n\n');
            }
        }).done(function () {}, function (why) {
            agent.logger.info("Error in module Index, while delivering router /agent");
            agent.logger.error(why);
            response.write('data:' + JSON.stringify(body) + '\nclose:1\n\n');
        });
    };
    //delete request.cookies['connect.sid'];
    if (router.map.sse[_module][_api].inverval) {
        (function () {
            request.socket.setTimeout(6000000);
            runner();
            var interval = setInterval(function () {
                runner();
            }, router.map.sse[_module][_api].inverval),
                clear = function clear() {
                clearInterval(interval);
                //clients.splice(clients.indexOf(request.session.id))
            };
            //clients.push(request.session.id);
            request.on("close", clear); // <- Remove this client when he disconnects
        })();
    } else {
        runner(true);
    }
});

app.get('/:module', function (request, response) {
    var module = request.params.module ? request.params.module : 'welcome';
    if (constant.moduleList.indexOf(module) == -1) {
        agent.wrongwayErrorHandler(response);
        return;
    }
    response.render(viewDir + '/' + module + '/index', {
        _session_id: request.session.id,
        _injection: constant.clientSideScript
    }, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});
app.get('/:module/*', function (request, response, next) {
    var module = request.params.module ? request.params.module : 'welcome';
    if (module == '_view') {
        next();
        return;
    }
    if (constant.moduleList.indexOf(module) == -1) {
        agent.wrongwayErrorHandler(response);
        return;
    }
    response.render(viewDir + '/' + module + '/index', {
        _session_id: request.session.id,
        _injection: constant.clientSideScript
    }, function (error, html) {
        agent.renderErrorHandler(response, error, html);
    });
});

app.get('/_view/:module/:partial', function (request, response) {
    var module = request.params.module ? request.params.module : 'welcome',
        partial = request.params.partial ? request.params.partial : 'index';

    if (constant.moduleList.indexOf(module) == -1 || !router.map[module][partial]) {
        agent.wrongwayErrorHandler(response);
        return;
    }

    var initOptions = router.initDeliverOptions(module, partial);

    if (!initOptions || !Object.keys(initOptions).length) {
        response.render(viewDir + '/' + module + '/partials/' + partial, {}, function (error, html) {
            agent.renderErrorHandler(response, error, html);
        });
        return;
    }
    var param = {
        session_id: request.session.profile ? request.session.profile.login_user_id : "",
        sub_session_id: request.session.profile ? request.session.profile.login_sub_user_id : ""
    };
    request.session.locale && (param.lang_flag = i18n.localeMap[request.session.locale]);
    agent.massDeliver(router.initDeliverOptions(module, partial, param)).then(function (rawTmplParam) {
        var tmplParam = {};
        for (var key in rawTmplParam) {
            var dataResponse = rawTmplParam[key];
            if (dataResponse.error_response) {
                throw new Error(dataResponse.error_response.msg);
            } else {
                tmplParam[key] = constant.ROPRequestType == 1 ? dataResponse : JSON.parse(dataResponse.rop_api_data_get_response.result);
            }
        }
        response.render(viewDir + '/' + module + '/partials/' + partial, tmplParam, function (error, html) {
            agent.renderErrorHandler(response, error, html);
        });
    }).done(function () {}, function (why) {
        agent.logger.info("Error in module Index, while delivering router /:module/:partial");
        agent.logger.error(why);
        agent.renderErrorHandler(response, why);
    });
});

app.post('/agent', upload.array(), function (request, response) {
    //agent.logger.debug(request.body);
    if (request.body) {
        if (request.body.module == 'sso' && request.body.partial == 'session' && request.body.api == 'logout') {
            delete request.session.profile;
            response.send({ is_success: true });
            return;
        }
        if (request.body.module == 'sso' && request.body.partial == 'session' && request.body.api == 'quit') {
            delete request.session.profile;
            request.session.destroy();
            response.send({ is_success: true });
            return;
        }
        var param = {};
        for (var prop in request.body.param) {
            param[prop] = request.body.param[prop];
        }

        if (request.session.profile) {
            param.session_id = request.session.profile.login_user_id;
            param.sub_session_id = request.session.profile.login_sub_user_id || "";
        }
        request.session.locale && (param.lang_flag = i18n.localeMap[request.session.locale]);

        if (request.body.module == 'sso' && request.body.partial == 'session' && request.body.api == 'login') {
            var userAgent = request.headers["user-agent"],
                xForwardFor = request.headers['x-forwarded-for'];
            param.login_session_id = request.session.id;
            param.login_browser = etc.getBrowserType(userAgent);
            param.login_type = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ? 1 : 0;
            param.login_ip = xForwardFor ? xForwardFor : request.connection.remoteAddress;
            param.login_proxy_ip = !xForwardFor ? "" : request.connection.remoteAddress;
        }
        try {
            agent.deliver(router.deliverOption(request.body.module, request.body.partial, request.body.api, param)).then(function (rawBody) {
                //throw new Error("test")
                if (rawBody.error_response) {
                    agent.renderJSONErrorHandler(response, rawBody.error_response.msg);
                    return;
                }
                var body = constant.ROPRequestType == 1 ? rawBody : JSON.parse(rawBody.rop_api_data_get_response.result);

                if (request.body.module == 'sso' && request.body.partial == 'session' && request.body.api == 'login' && (typeof body.is_success == 'boolean' && body.is_success || typeof body.is_success == 'string' && body.is_success == 'true')) {
                    var temp = JSON.parse(JSON.stringify(body));
                    temp.id = request.session.id;
                    temp.sign = temp.login_user_id.md5();
                    delete temp.login_user_id;
                    request.session.profile = body;
                    response.send(temp);
                    return;
                } else {
                    if (!request.session.profile) {
                        body._expired = true;
                        //response.cookie("_session","",{domain:`.${constant.domain}`})
                    }
                    response.send(body);
                }
            }, function (error) {
                agent.logger.info("POST Error, while delivering router /agent");
                agent.logger.error(error);
                agent.renderJSONErrorHandler(response, error);
                //response.send(error);
            }).done(function () {}, function (why) {
                agent.logger.info("POST Error, while delivering router /agent");
                agent.logger.error(why);
                agent.renderJSONErrorHandler(response, why);
            });
        } catch (e) {
            agent.logger.info("POST Error, while delivering router /agent");
            agent.logger.error(e);
            agent.renderJSONErrorHandler(response, e);
        }
    }
});

app.use(function (err, req, res, next) {
    if (err) {
        agent.logger.info("Error in module Index, while delivering salvation");
        agent.logger.error(err);
        agent.overallErrorHandler(res, err);
    } else {
        agent.wrongwayErrorHandler(res);
    }
});

process.on('uncaughtException', function (err) {
    agent.logger.info("UncaughtException in module Index for process scope exception");
    agent.logger.error(err);
});

exports.app = app;