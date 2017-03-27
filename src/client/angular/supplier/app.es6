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
], angular => {
    'use strict';

    let app = angular.module('supplier', ['ui.router', 'ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages', 'supplier.controllers', 'supplier.services', 'rop.directives', 'rop.filters', 'rop.services']);

    app.config($mdThemingProvider => {
        let customBlueMap = $mdThemingProvider.extendPalette('cyan', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff',
            '300': '00C8AB',
            '500': '00C5A3',
            '800': '00A589',
            'A100': 'EEFCFF'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '300',
                'hue-2': '800',
                'hue-3': 'A100'
            })
            .accentPalette('pink');

        $mdThemingProvider.theme('dracular', 'default')
            .primaryPalette('grey', {
                'default': '900',
                'hue-1': '50',
                'hue-2': '800',
                'hue-3': '900'
            }).accentPalette('customBlue');
    }).config($mdIconProvider => {
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
    }).config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        ($stateProvider, $urlRouterProvider, $locationProvider) => {
            $stateProvider.state('index', {
                templateUrl: '/_view/supplier/index',
                url: '/supplier/home',
                controller: 'IndexCtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('all-comment', {
                templateUrl: '/_view/supplier/all-comment',
                url: '/supplier/all-comment',
                controller: 'AllCommentCtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('API', {
                params: {
                    param: null,
                    cat_id: ""
                },
                templateUrl: '/_view/supplier/API',
                url: '/supplier/API',
                controller: 'APICtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('API?:id', {
                params: {
                    param: null,
                    cat_id: ""
                },
                templateUrl: '/_view/supplier/API',
                url: '/supplier/API',
                controller: 'APICtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('function', {
                templateUrl: '/_view/supplier/function',
                url: '/supplier/function',
                controller: 'FunctionCtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('info', {
                templateUrl: '/_view/supplier/info',
                url: '/supplier/info',
                controller: 'InfoCtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            }).state('info-detail', {
                templateUrl: '/_view/supplier/info-detail',
                url: '/supplier/info-detail',
                controller: 'InfoDetailCtrl',
                resolve: {
                    _preLoading: ['$rootScope', function ($rootScope) {
                        return $rootScope.preloadingPromise;
                    }]
                },
            });
            //$urlRouterProvider.when(/aspx/i, '/supplier/API');
            $urlRouterProvider.when(/\/api\/.+\.html/i, '/supplier/API');
            $urlRouterProvider.otherwise('/supplier/home');

            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');
        }]);

    app.run(['$rootScope', '$state', '$location', '$window', '$http', '$cookies', '$mdDialog', '$mdUtil', '$mdMedia', '$q', 'ScopeInitializer', ($rootScope, $state, $location, $window, $http, $cookies, $mdDialog, $mdUtil, $mdMedia, $q, ScopeInitializer) => {
        $rootScope.nav_menu = {};
        angular.extend($rootScope, ScopeInitializer);
        $rootScope.logout = () => {
            return ScopeInitializer.logout(() => {
                $rootScope.profile = undefined;
            })
        }

        $rootScope.ssv_user_id = $location.search().ssv_user_id;
        $rootScope.loginMistakes = 0;
        $rootScope._timestamp = new Date().getTime();

        let getCarousels = () => {
            return $http.post('/agent', {
                module: 'supplier',
                partial: 'index',
                api: 'carousels',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                if (body.data.data_list && body.data.data_list.length) {
                    $rootScope.carousels = body.data.data_list;
                } else {
                    $rootScope.carousels = [{
                        "image_title": "<span style='color: white'>融数供应商</span>",
                        "image_desc": "<span style='color: gray'>融数供应商描述</span>",
                        "image_url": "/resource/supplier/mr1.jpg",
                        "image_link": ""
                    }, {
                        "image_title": "<span style='color: white'>融数供应商</span>",
                        "image_desc": "<span style='color: gray'>融数供应商描述</span>",
                        "image_url": "/resource/supplier/mr2.jpg",
                        "image_link": ""
                    }]
                }
            }, why => {
                $rootScope.alert(why);
            })
        }, getIntro = cb => {
            return $http.post('/agent', {
                module: 'supplier',
                partial: 'index',
                api: 'ssv_intro',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                $rootScope.ssv_intro = body.data;
                cb && cb.call();
            }, why => {
                $rootScope.alert(why);
            })
        }, getSystemHints = () => {
            return $http.post('/agent', {
                module: 'common',
                partial: 'common',
                api: 'tips'
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $rootScope.systemHints = body.data.data_list;
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
            });
        }

        // 收藏，暂时注掉
        $rootScope.favor = () => {
            $http.post('/agent', {
                module: 'supplier',
                partial: 'session',
                api: 'favor',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    !$rootScope.ssv_intro && ($rootScope.ssv_intro = {});
                    $rootScope.ssv_intro.favo_status = "1";
                    //$('#favorSuccess').modal('show');
                } else {
                    $rootScope.alert(body.data);
                }
            }, why => {
                $rootScope.alert(why);
            });
        }

        // 申请，暂时注掉
        $rootScope.request = () => {
            $http.post('/agent', {
                module: 'supplier',
                partial: 'session',
                api: 'request',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    !$rootScope.ssv_intro && ($rootScope.ssv_intro = {});
                    $rootScope.ssv_intro.apply_status = "2";
                } else {
                    $rootScope.alert(body.data);
                }
            }, why => {
                $rootScope.alert(why);
            });
        }
        $rootScope.go = tab => {
            $rootScope.scrollToTop(() => {
                $state.go(tab);
            })
        }

        $rootScope.scrollToTop = cb => {
            if (ScopeInitializer.browserType == "Firefox") {
                angular.element('html').animate({scrollTop: 0}, cb);
            } else {
                angular.element('body').animate({scrollTop: 0}, cb);
            }
        }
        /*$rootScope.isAdmin = () => {$rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3')) ? true:false;}*/
        $rootScope.isAdmin = () => {
            return $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3'));
        }
        $rootScope.isSsv = () => {
            return $rootScope.profile && ($rootScope.profile.login_user_type == '2')
        };
        $rootScope.isIsv = () => {
            return $rootScope.profile && ($rootScope.profile.login_user_type == '1')
        };
        $rootScope.toConsole = () => {
            if ($rootScope.isSsv()) {
                $rootScope.toPlatform("application")
            } else if ($rootScope.isAdmin()) {
                $rootScope.toPlatform('console')
            } else if ($rootScope.isIsv) {
                $rootScope.toPlatform('console')
            }
        }


        $rootScope.init = (id, partial, info, param) => {
            let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '', _param, _info;
            try {
                _param = JSON.parse(param);
            } catch (e) {
                _param = undefined;
            }
            // 用于BI做数据分析用
            window._ssv = {};
            try {
                _info = JSON.parse(info);
                window._ssv = _info;
            } catch (e) {
                _info = undefined;
            }

            if (_session && (id == _session.id)) {
                $rootScope.profile = _session;
                //getSystemHints();
            } else {
                $cookies.remove("_session", {path: "/", domain: `${Constant.nosubdomain ? '' : '.'}${Constant.host}`});
                $rootScope.profile = undefined;
            }

            let initialize = () => {
                $rootScope.preloadingPromise.then(()=>{
                    if($rootScope.profile){
                        return $q.when(getCarousels(),getIntro(),getSystemHints());
                    } else {
                        return $q.when(getCarousels(),getIntro());
                    }
                }).then(()=>{
                    if (partial) {
                        if (_param) {
                            //$state.go(partial, {param: _param, cat_id: _info.cat_id});
                            $rootScope._param = _param;
                            $rootScope._cat_id = _info.cat_id;
                        } else {
                           // $rootScope.removeLoading();
                            //$state.go(partial);
                        }
                    } else {
                        //$rootScope.removeLoading();
                        //$state.go('index');
                    }
                });
                /*getIntro().then(() => hideLoading()).then(() => {
                    if (partial) {
                        if (_param) {
                            $state.go(partial, {param: _param, cat_id: _info.cat_id});
                        } else {
                            $state.go(partial);
                        }
                    } else {
                        //$state.go('index');
                    }
                });*/
            };

            if (_info) {
                $rootScope.ssv_user_id = _info.ssv_id;
                initialize();
            } else {
                if (!$rootScope.ssv_user_id) {
                    let ssv_user_id = sessionStorage.getItem("_ssv_user_id");
                    if (ssv_user_id) {
                        $rootScope.ssv_user_id = ssv_user_id;
                        initialize();
                    } else {
                        $window.location.href = '/';
                    }
                } else {
                    initialize();
                }
            }
        }
    }]);


    return app;
});
