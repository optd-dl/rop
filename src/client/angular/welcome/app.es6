/**
 * Created by robin on 22/11/2016.
 */

define([
    'angular',
    'angularUIRouter',
    'angularMaterial',
    'angularCookie',
    'bootstrap',
    'common',

    './controllers',
    './services',
    '../directives',
    '../filters',
    '../services',
], angular =>{
    'use strict';
    let app = angular.module('welcome', ['ui.router','ngCookies', 'ngMaterial', 'welcome.controllers','welcome.services','rop.directives','rop.filters','rop.services']);

    app.config($mdThemingProvider => {
        let customBlueMap = $mdThemingProvider.extendPalette('cyan', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff',
            '100': '70e1d0',
            '300': '00C8AB',
            '500': '00C5A3',
            '800': '00A589',
            'A100': 'EEFCFF'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50',
                'hue-2': '800',
                'hue-3': 'A100'
            })
            .accentPalette('pink');

        let greyMap = $mdThemingProvider.extendPalette('grey', {
            'contrastDefaultColor': 'dark',
            'contrastDarkColors': ['50'],
            'contrastLightColors': ['300', '500', '800', 'A100'],
            '50': 'FFFFFF',
            '300': '35383B',
            '500': '2b2b2b',
            '800': '212121',
            'A100': '000000'
        });

        $mdThemingProvider.definePalette('amazingPaletteName', greyMap);
        $mdThemingProvider.theme('dracular').primaryPalette('amazingPaletteName', {
            'default': '500',
            'hue-1': '50',
            'hue-2': '300',
            'hue-3': '800'
        });
    })
    .config($mdIconProvider => {
        $mdIconProvider
            .iconSet('action', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24)
            .iconSet('alert', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg', 24)
            .iconSet('av', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-av.svg', 24)
            .iconSet('communication', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg', 24)
            .iconSet('content', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg', 24)
            .iconSet('device', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-device.svg', 24)
            .iconSet('editor', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg', 24)
            .iconSet('file', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg', 24)
            .iconSet('hardware', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
            .iconSet('image', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg', 24)
            .iconSet('maps', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg', 24)
            .iconSet('navigation', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
            .iconSet('notification', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg', 24)
            .iconSet('social', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg', 24)
            .iconSet('toggle', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg', 24)

            .defaultIconSet('/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24);
    })
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        ($stateProvider, $urlRouterProvider, $locationProvider) => {
            $stateProvider.
                state('index', {
                    templateUrl: '/_view/welcome/index',
                    url: '/welcome/home',
                    controller: 'IndexCtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    onExit: [() => {
                        window.swiper && (window.swiper.stopAutoplay())
                        angular.element(window).unbind("scroll");
                    }]
                }).
                state('suppliers', {
                    templateUrl: '/_view/welcome/suppliers',
                    url: '/welcome/suppliers',
                    controller: 'SuppliersCtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    onExit: [() => {
                        $('#mason').empty();
                        //Waypoint.destroyAll();
                    }]
                }).
                state('doc', {
                    abstract: true,
                    url: '/welcome/doc',
                    templateUrl: '/_view/welcome/doc',
                    controller: 'DocCtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                })
                .state('doc.cat', {
                    url: '',
                    templateUrl: '/_view/welcome/doc-cat',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'DocCatCtrl'
                })
                .state('doc.details', {
                    url: '/:id',
                    templateUrl: '/_view/welcome/doc-details',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'DocDetailCtrl'
                }).
                state('features', {
                    url: '/welcome/features',
                    templateUrl: '/_view/welcome/features',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'FeaturesCtrl'
                }).
                state('info-detail', {
                    url: '/welcome/info-detail',
                    templateUrl: '/_view/welcome/info-detail',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'InfoDetailCtrl'
                }).
                state('services', {
                    url: '/welcome/services',
                    templateUrl: '/_view/welcome/services',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'ServicesCtrl',
                    //url:"/welcome/services",
                }).
                state('search', {
                    url: '/welcome/search',
                    templateUrl: '/_view/welcome/search',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    controller: 'SearchCtrl'
                }).
                state('debugTool', {
                    params: {
                        key: "",
                    },
                    url: '/welcome/debugTool',
                    templateUrl: '/_view/welcome/debugTool',
                    controller: 'DebugToolCtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                    onExit: [() => {
                        window.removeEventListener("message",window._messageListener);
                        delete window._messageListener;
                    }]
                }).
                state('sdkTool', {
                    url: '/welcome/sdkTool',
                    templateUrl: '/_view/welcome/sdkTool',
                    controller: 'SDKToolCtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                }).
                state('API', {
                    url: '/welcome/API',
                    templateUrl: '/_view/welcome/API',
                    controller: 'APICtrl',
                    resolve: {_preLoading: ['$rootScope', function ($rootScope) {return $rootScope.preloadingPromise;}]},
                });
            $urlRouterProvider.otherwise('/welcome/home');
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            $locationProvider.hashPrefix('!');
        }]);

    app.run(['$rootScope', '$state', '$window', '$http', '$location', '$cookies', 'ScopeInitializer', ($rootScope, $state, $window, $http, $location, $cookies, ScopeInitializer) => {
        document.body.scrollTop = 0;
        angular.extend($rootScope, ScopeInitializer);
        $rootScope.logout = () => {return ScopeInitializer.logout(()=>{$rootScope.profile = undefined;})}

        /*$rootScope.initIndex = () => {
            if ($location.search().search) {
                $rootScope.go("search");
                $rootScope.tab = 'search';
            } else if (typeof $location.search().debugTool != 'undefined') {
                $rootScope.go("debugTool",{key:$location.search().debugTool});
                $rootScope.tab = 'debugTool';
                //$rootScope.debugTool = $location.search().debugTool;
            } else if (typeof $location.search().sdkTool != 'undefined') {
                $rootScope.go("sdkTool");
                $rootScope.tab = 'sdkTool';
            } else if (typeof $location.search().doc != 'undefined') {
                $rootScope.go("doc", {docId: $location.search().doc});
                $rootScope.tab = 'doc';
            } else {

            }
        }*/

        /*$rootScope.go = (tab, param) => {
            if($rootScope.stateLock){
                return;
            }
            angular.element(window).unbind("scroll");
            ((getBrowserType() == 'Firefox')?$('body,html'):$('body')).animate({
                scrollTop: 0
            }, 300, () => {
                $state.go(tab, param);
            });
        }*/
        let getSystemHints = () => {
            $http.post('/agent', {
                module: 'common',
                partial: 'common',
                api: 'tips'
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $rootScope.systemHints = body.data.data_list;
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, $rootScope.alert);
        }
       /* $rootScope.postUrl = (url, params) => {
            let submitMe = document.createElement("form");
            submitMe.action = url;
            submitMe.method = "post";
            for (let key in params) {
                let field = document.createElement("input");
                field.type = "hidden";
                field.name = key;
                field.value = params[key];
                submitMe.appendChild(field);
            }
            submitMe.submit();
        }*/

        $rootScope.switchLang = locale => {
            if ($rootScope._lang != locale) {
                $cookies.put("_lang", locale, {domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                $rootScope.locate("/");
            }
        }
        $rootScope.locator = (e, hash) => {
            e.preventDefault();
            e.stopPropagation();
            ((getBrowserType() == 'Firefox')?$('body,html'):$('body')).animate({scrollTop: $(hash).offset().top});
        }
        $rootScope.isAdmin = () => {return $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3'));}
        $rootScope.isSsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '2')};
        $rootScope.isIsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '1')};


        let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '',
            id = document.querySelector("meta[name=session]").content;
        if (_session && (id == _session.id)) {
            $rootScope.profile = _session;
            $rootScope.preloadingPromise.then(getSystemHints);
        } else {
            $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
            $rootScope.profile = undefined;
        }


    }]);


    return app;
});