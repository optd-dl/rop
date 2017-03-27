'use strict';

var Canvas = require('canvas'),
    agent = require('./agent'),
    constant = require('./constant');

module.exports = function (params) {
    if (typeof params == 'string') params = { url: params };
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';
    !params.canvasWidth && (params.canvasWidth = 250);
    !params.canvasHeight && (params.canvasHeight = 150);
    return function (req, res, next) {
        if (req.url != params.url && !new RegExp(params.url + '([?](\\w+=\\w+)?(&\\w+=\\w+)*){0,1}$').test(req.url)) return next();
        var canvas = new Canvas(params.canvasWidth, params.canvasHeight);
        var ctx = canvas.getContext('2d');
        ctx.antialias = 'gray';
        ctx.fillStyle = params.background;
        ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight);
        ctx.fillStyle = params.color;
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#ff8500";
        ctx.font = '80px sans';

        for (var i = 0; i < 2; i++) {
            ctx.moveTo(20, Math.random() * params.canvasHeight);
            ctx.bezierCurveTo(params.canvasWidth * 0.3, Math.random() * params.canvasHeight, params.canvasWidth * 0.6, Math.random() * params.canvasHeight, params.canvasWidth * 0.9, Math.random() * params.canvasHeight);
            ctx.stroke();
        }

        var text = agent.randomString(6);

        for (i = 0; i < text.length; i++) {
            ctx.fillStyle = agent.randomHSLColor(req.query.s ? new Number(req.query.s) : 100, req.query._s, req.query.l ? new Number(req.query.l) : 100, req.query._l);
            ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, (params.canvasWidth - 70) / 6 * i + 20, params.canvasHeight - 50);
            ctx.fillText(text.charAt(i), 0, 0);
        }

        //	    ctx.setTransform(1, 0, 0, 1, 0, 0);
        //	    ctx.font = '25px sans';
        //	    ctx.fillStyle = "rgb(255,255,255)";
        //	    ctx.fillText(text, 70, 145);

        canvas.toBuffer(function (err, buf) {
            if (req.session) req.session.captcha = text;
            res.cookie("_captcha", text, { domain: '.' + constant.domain, expires: new Date(Date.now() + 300000) });
            res.end(buf);
        });
    };
};