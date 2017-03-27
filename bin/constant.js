"use strict";

/**
 * Created by robin on 1/28/16.
 */

var _env = require("../key.json").env;

var clientRequires = {
    baseUrl: "/js/angular",
    waitSeconds: 20,
    paths: {
        jQuery: '../../vendor/jquery/dist/jquery.min',
        angular: '../../vendor/angular/angular.min',
        angularMaterial: '../../vendor/angular-material/angular-material.min',
        angularCookie: '../../vendor/angular-cookies/angular-cookies.min',
        angularAnimate: '../../vendor/angular-animate/angular-animate.min',
        angularUIRouter: '../../vendor/angular-ui-router/release/angular-ui-router.min',
        angularAria: '../../vendor/angular-aria/angular-aria.min',
        angularMessages: '../../vendor/angular-messages/angular-messages.min',
        angularDNDL: '../../vendor/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min',
        angularHero: '../../vendor/Angular-Hero/angular-hero-min',
        angularCalendar: './components/calendar',
        angularLoad: '../../vendor/oclazyload/dist/ocLazyLoad.require',

        bootstrap: '../../vendor/bootstrap/dist/js/bootstrap.min',
        clipboard: '../../vendor/clipboard/dist/clipboard.min',
        chartJs: '../../vendor/chart.js/dist/Chart.bundle.min',
        cta: '../../vendor/cta/dist/cta.min',
        swiper: '../../vendor/Swiper/dist/js/swiper.min',
        bloodhound: '../../vendor/typeahead.js/dist/bloodhound.min',
        typeahead: '../../vendor/typeahead.js/dist/typeahead.jquery',
        owl: '../../vendor/owlcarousel/owl-carousel/owl.carousel.min',
        holder: '../../vendor/holderjs/holder.min',
        tweenmax: '../../vendor/gsap/src/minified/TweenMax.min',
        treeview: '../plugin/collapse/js/jquery.treeview',
        packagetree: '../plugin/collapse/js/packageTree',
        string2json: '../plugin/collapse/js/string2json',
        snap: '../../vendor/Snap.svg/dist/snap.svg-min',

        common: '../common'
    },
    map: {
        '*': { 'jquery': 'jQuery' }
    },
    shim: {
        jQuery: {
            exports: '$'
        },
        angular: {
            deps: ['jQuery'],
            exports: 'angular'
        },
        angularMaterial: {
            deps: ['angular', 'angularAria', 'angularMessages', 'angularAnimate']
        },
        angularCookie: {
            deps: ['angular']
        },
        angularAnimate: {
            deps: ['angular']
        },
        angularUIRouter: {
            deps: ['angular']
        },
        angularAria: {
            deps: ['angular']
        },
        angularMessages: {
            deps: ['angular']
        },
        angularDNDL: {
            deps: ['angular']
        },
        angularCalendar: {
            deps: ['angular', 'angularMaterial']
        },
        angularHero: {
            deps: ['angular']
        },
        angularLoad: {
            deps: ['angular']
        },

        bootstrap: {
            deps: ['jQuery']
        },
        swiper: {
            deps: ['jQuery']
        },
        bloodhound: {
            deps: ['jQuery', 'typeahead']
        },
        typeahead: {
            deps: ['jQuery']
        },
        common: {
            deps: ['jQuery']
        }
    }
};

var constant = {
    pro: {
        env: _env,
        protocol: "http",
        domain: "open.rongcapital.cn",
        legacyDomain: "open.ruixuesoft.com:30002",
        port: 80,
        optionPort: 5000,
        logFile: __dirname + "/../logs/server.log",
        errorPath: "error",
        localePath: "locales",
        viewsPath: "views",
        staticPath: "public",
        sessionSecret: "shiqifeng2000@gmail.com",
        sessionMaxAge: 7200000,
        moduleList: ["application", "console", "sso", "supplier", "user", "welcome", "common"],
        templateList: ["pagination", "tree_view", "stepper", "datatable", "fixed_table", "logger"],
        ROPRequestType: 1,
        generateROPStandardRequest: function generateROPStandardRequest(type) {
            return type == 1 ? "?method=ruixue.rop.frontend.api.data.get&&format=json&&access_token=BCB8D371-EBF1-4549-A272-EAFE7F342DBF" : { "method": "ruixue.rop.api.data.get", "format": "json", "access_token": "BCB8D371-EBF1-4549-A272-EAFE7F342DBF" };
        },

        //clientSideScript: 'Constant={protocol:"http",host:"open.rongcapital.cn",port:80,legacyDomain:"http://open.ruixuesoft.com:30002",exipration:7200000};',
        clientSideScript: "Constant={protocol:\"http\",host:\"open.rongcapital.cn\",port:80,legacyDomain:\"http://open.ruixuesoft.com:30002\",exipration:7200000, requires:" + JSON.stringify(clientRequires) + "};",
        apiHost: "https://api.open.ruixuesoft.com:30005/ropapi",
        isRequestJson: true,
        requestHeader: { accept: '*', rejectUnauthorized: false, 'content-type': 'application/json; charset=utf-8' },
        simpleApiHost: 'http://115.159.67.217:30005/rop/rest',
        apiTimeout: 49000,
        couchbaseHost: "10.132.15.194:8091/pools",
        couchbaseBucket: "open.rongcapital.cn",
        couchbasePassword: "q1w2e3",
        useCluster: true,
        sessionStore: "couchbase"
    },
    test: {
        env: _env,
        protocol: "http",
        domain: "roprouter.ruixuesoft.com",
        legacyDomain: "ropiframe.cssrv.dataengine.com",
        port: 80,
        optionPort: 5000,
        logFile: __dirname + "/../logs/server.log",
        errorPath: "error",
        localePath: "locales",
        viewsPath: "views",
        staticPath: "public",
        sessionSecret: "shiqifeng2000@gmail.com",
        sessionMaxAge: 7200000,
        moduleList: ["application", "console", "sso", "supplier", "user", "welcome", "common"],
        templateList: ["pagination", "tree_view", "stepper", "datatable", "fixed_table", "logger"],
        ROPRequestType: 1,
        generateROPStandardRequest: function generateROPStandardRequest(type) {
            return type == 1 ? "?method=ruixue.rop.frontend.api.data.get&&format=json&&access_token=933C10E3-DC2B-4514-9F7A-27478D34B3C5" : { "method": "ruixue.rop.api.data.get", "format": "json", "access_token": "933C10E3-DC2B-4514-9F7A-27478D34B3C5" };
        },

        clientSideScript: "Constant={protocol:\"http\",host:\"roprouter.ruixuesoft.com\",port:80,legacyDomain:\"http://ropiframe.cssrv.dataengine.com\",exipration:7200000, requires:" + JSON.stringify(clientRequires) + "};",
        apiHost: "https://api.open.ruixuesoft.com:30005/ropapi",
        isRequestJson: true,
        requestHeader: { accept: '*', rejectUnauthorized: false, 'content-type': 'application/json; charset=utf-8' },
        simpleApiHost: 'http://115.159.67.217:30005/rop/rest',
        apiTimeout: 49000,
        couchbaseHost: "http://10.200.48.132:8091/pools",
        couchbaseBucket: "open.rongcapital.cn",
        couchbasePassword: "q1w2e3",
        useCluster: false,
        sessionStore: "couchbase"
    },
    dev: {
        env: _env,
        protocol: "http",
        domain: "roprouter.ruixuesoft.com",
        legacyDomain: "ropiframe.cssrv.dataengine.com",
        port: 5002,
        optionPort: 5003,
        logFile: __dirname + "/../logs/server.log",
        errorPath: "error",
        localePath: "locales",
        viewsPath: "views",
        staticPath: "public",
        sessionSecret: "shiqifeng2000@gmail.com",
        sessionMaxAge: 7200000,
        moduleList: ["application", "console", "sso", "supplier", "user", "welcome", "common"],
        templateList: ["pagination", "tree_view", "stepper", "datatable", "fixed_table", "logger"],
        ROPRequestType: 1,
        generateROPStandardRequest: function generateROPStandardRequest(type) {
            return type == 1 ? "?method=ruixue.rop.frontend.api.data.get&&format=json&&access_token=933C10E3-DC2B-4514-9F7A-27478D34B3C5" : { "method": "ruixue.rop.api.data.get", "format": "json", "access_token": "933C10E3-DC2B-4514-9F7A-27478D34B3C5" };
        },

        clientSideScript: "Constant={protocol:\"http\",host:\"roprouter.ruixuesoft.com\",port:5002,legacyDomain:\"http://ropiframe.cssrv.dataengine.com\",exipration:7200000, requires:" + JSON.stringify(clientRequires) + "};",
        apiHost: "https://api.open.ruixuesoft.com:30005/ropapi",
        isRequestJson: true,
        requestHeader: { accept: '*', rejectUnauthorized: false, 'content-type': 'application/json; charset=utf-8' },
        simpleApiHost: 'http://115.159.67.217:30005/rop/rest',
        apiTimeout: 49000,
        couchbaseHost: "http://10.200.48.132:8091/pools",
        couchbaseBucket: "open.rongcapital.cn",
        couchbasePassword: "q1w2e3",
        useCluster: false,
        sessionStore: "couchbase"
    },
    local: {
        env: _env,
        protocol: "http",
        domain: "localedit.io",
        legacyDomain: "ropiframe.cssrv.dataengine.com",
        port: 5000,
        optionPort: 5001,
        logFile: __dirname + "/../logs/server.log",
        errorPath: "error",
        localePath: "locales",
        viewsPath: "views",
        staticPath: "public",
        sessionSecret: "shiqifeng2000@gmail.com",
        sessionMaxAge: 7200000,
        moduleList: ["application", "console", "sso", "supplier", "user", "welcome", "common"],
        templateList: ["pagination", "tree_view", "stepper", "datatable", "fixed_table", "logger"],
        ROPRequestType: 1,
        generateROPStandardRequest: function generateROPStandardRequest(type) {
            return type == 1 ? "?method=ruixue.rop.frontend.api.data.get&&format=json&&access_token=933C10E3-DC2B-4514-9F7A-27478D34B3C5" : { "method": "ruixue.rop.api.data.get", "format": "json", "access_token": "933C10E3-DC2B-4514-9F7A-27478D34B3C5" };
        },

        clientSideScript: "Constant={protocol:\"http\",host:\"localedit.io\",port:5000,nosubdomain:true,legacyDomain:\"http://ropiframe.cssrv.dataengine.com\",exipration:7200000, requires:" + JSON.stringify(clientRequires) + "};",
        apiHost: "https://api.open.ruixuesoft.com:30005/ropapi",
        isRequestJson: true,
        requestHeader: { accept: '*', rejectUnauthorized: false, 'content-type': 'application/json; charset=utf-8' },
        simpleApiHost: 'http://115.159.67.217:30005/rop/rest',
        apiTimeout: 49000,
        couchbaseHost: "http://10.200.48.132:8091/pools",
        couchbaseBucket: "open.rongcapital.cn",
        couchbasePassword: "q1w2e3",
        useCluster: false,
        sessionStore: "couchbase"
    }
};

module.exports = constant[_env];