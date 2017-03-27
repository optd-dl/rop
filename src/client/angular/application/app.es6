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

    'angularLoad',
    //'angularDNDL',

    './controllers',
    './services',
    '../directives',
    '../filters',
    '../services',
], angular =>{
    'use strict';
    let app = angular.module('application', ['ui.router','ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages', 'application.controllers','application.services','rop.directives','rop.filters','rop.services','oc.lazyLoad']);
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
    .config(($mdIconProvider, $mdDateLocaleProvider) => {
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

        $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        $mdDateLocaleProvider.shortDays = $mdDateLocaleProvider.days = ['日', '一', '二', '三', '四', '五', '六'];
        $mdDateLocaleProvider.monthHeaderFormatter = date => {return date.getFullYear() + '年 ' + $mdDateLocaleProvider.months[date.getMonth()];};
        $mdDateLocaleProvider.msgCalendar = '日历表';
    })
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {
        $stateProvider.
            state('api', {
                templateUrl: '/_view/application/api',
                controller: 'APICtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ApiList',
            })
            .state('domain', {
                templateUrl: '/_view/application/domain',
                controller: 'DomainCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ApiDomainList'
            })
            .state('app', {
                templateUrl: '/_view/application/app',
                controller: 'AppCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/AppList',
            })
            .state('isvApp', {
                templateUrl: '/_view/application/isv_app',
                controller: 'ISVAppCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/IsvAppList',
            })
            .state('envList', {
                templateUrl: '/_view/application/env_list',
                controller: 'EnvironmentCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/EnvironmentList',
            })
            .state('envApp', {
                templateUrl: '/_view/application/env_app',
                controller: 'EnvironmentAppCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/EnvironmentApp',
            })
            .state('envSet', {
                templateUrl: '/_view/application/env_set',
                controller: 'EnvironmentSetCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/EnvironmentSet',
            })
            .state('flow', {
                templateUrl: '/_view/application/flow',
                controller: 'APIFlowCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ApiFlowList',
            })
            .state('caution', {
                templateUrl: '/_view/application/caution',
                controller: 'APICautionCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ApiCautionList',
            })
            .state('category', {
                templateUrl: '/_view/application/category',
                controller: 'CategoryCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/CategoryList',
            })
            .state('group', {
                templateUrl: '/_view/application/group',
                controller: 'CategoryGroupCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ConCategoryGroupList',
            })
            .state('noapply', {
                templateUrl: '/_view/application/noapply',
                controller: 'NoApplyCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/NoApplyList',
            })
            .state('auth', {
                templateUrl: '/_view/application/auth',
                controller: 'AuthorityCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/SsvIsvUserList',
            })
            .state('mail', {
                templateUrl: '/_view/application/mail',
                controller: 'MailCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/UserMailList',
            })
            .state('ping', {
                templateUrl: '/_view/application/ping',
                controller: 'PingCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ApiPingList',
            })
            .state('assistSandbox', {
                templateUrl: '/_view/application/assist_sandbox',
                controller: 'SandboxLogAssistCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/statistics/AppApiAssistSsvSandbox',
            })
            .state('assist', {
                templateUrl: '/_view/application/assist',
                controller: 'LogAssistCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/statistics/AppApiAssistSsv',
            })
            .state('analysisSandbox', {
                templateUrl: '/_view/application/analysis_sandbox',
                controller: 'SandboxLogAnalysisCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/statistics/LogAnalyzeSandbox',
            })
            .state('analysis', {
                templateUrl: '/_view/application/analysis',
                controller: 'LogAnalysisCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/statistics/LogAnalyze',
            })
            .state('download', {
                templateUrl: '/_view/application/download',
                controller: 'DownloadCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/DownloadList',
            })
            .state('doc', {
                templateUrl: '/_view/application/doc',
                controller: 'DocCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/SsvDocList',
            })
            .state('notice', {
                templateUrl: '/_view/application/notice',
                controller: 'NoticeCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/SsvNoticeList',
            })
            .state('tool', {
                templateUrl: '/_view/application/tool',
                controller: 'ToolDownloadCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/ToolDownload',
            })
            .state('sdk', {
                templateUrl: '/_view/application/sdk',
                controller: 'SDKCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/SdkDownload',
            })
            .state('func', {
                templateUrl: '/_view/application/func',
                controller: 'FunctionCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/Function',
            })
            .state('subuser', {
                templateUrl: '/_view/application/subuser',
                controller: 'SubUserCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/SubUserList',
            })
            .state('dataroleset', {
                templateUrl: '/_view/application/dataroleset',
                controller: 'DataRoleSetCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
                url: '/ssv/DataRoleSet',
            })
            .state('frame', {
                params: {
                    src:""
                },
                templateUrl: '/_view/application/frame',
                controller: 'FrameCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
            })
            .state('error', {
                params: {
                    error: ""
                },
                templateUrl: '/_view/application/error',
                controller: 'ErrorCtrl',
                resolve: {_preLoading: ['$rootScope', ($rootScope)=>$rootScope.preloadingPromise]},
            });
        $urlRouterProvider.otherwise('/ssv/ApiList');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $httpProvider.interceptors.push('HttpObserver');
    }])

    app.run(['$rootScope', '$state', '$location', '$window', '$http', '$cookies', '$mdDialog', '$mdUtil', '$mdMedia', '$q','$timeout','ScopeInitializer','LogProcessor', ($rootScope, $state, $location, $window, $http, $cookies, $mdDialog, $mdUtil, $mdMedia, $q,$timeout,ScopeInitializer,LogProcessor) => {
        $rootScope.nav_menu = {};

        ScopeInitializer.contextSelector = 'body>section>md-content';
        angular.extend($rootScope, ScopeInitializer);
        $rootScope.logout = () => {return ScopeInitializer.logout(() => {ScopeInitializer.toPlatform('sso?from=application');})}
        $rootScope.minify = ()=> {return !$mdMedia('(min-width: 1400px)')};
        $rootScope.mini = false;
        $rootScope.toggleMini = ()=> {$rootScope.mini = !$rootScope.mini;}
        $rootScope.isSsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '2')};
        $rootScope.showLog = LogProcessor.showLog;
        let loadingQ = undefined;
        $rootScope.validateEntry = (reload)=>{
            var defer = $q.defer();
            //!loadingQ && (loadingQ = $rootScope.removeLoading());
            if(!$rootScope.checkSession()){$rootScope.quitSession("application");return defer.promise;}
            navQ.then(()=>{
                !loadingQ && (loadingQ = $rootScope.removeLoading());
                return loadingQ;
            }).then(()=>{
                if ($rootScope.nav_menu && $rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length) {
                    let unknownEntry = true, isOld = true;
                    for (let i = 0; i < $rootScope.nav_menu.func_list.length; i++) {
                        for (let j = 0; j < $rootScope.nav_menu.func_list[i].sub_func_list.length; j++) {
                            if ($rootScope.nav_menu.func_list[i].sub_func_list[j].sub_class_name == $location.path().replace("/", "")) {
                                $rootScope.toggleSubEntry($rootScope.nav_menu.func_list[i], j, reload);
                                unknownEntry = false;
                                isOld = ($rootScope.nav_menu.func_list[i].sub_func_list[j].func_flag != "1");
                            }
                        }
                    }
                    if (($rootScope.nav_menu._entry === undefined) && unknownEntry) {
                        $rootScope.toggleEntry(-1);
                        $rootScope.go("error",{error:"没有访问此页面的权限，请联系管理员，E011"});
                        defer.reject("没有访问此页面的权限");
                    } else if($rootScope.profile.login_user_status == "0"){
                        $rootScope.go('error',{error:"用户尚未审核，无法访问页面"});
                        defer.reject("没有访问此页面的权限");
                    } else {
                        defer.resolve(isOld);
                    }
                } else {
                    defer.reject("菜单初始化失败")
                }
            });
            return defer.promise;
        }
        $rootScope.toggleEntry = (index)=> {$rootScope.nav_menu && ($rootScope.nav_menu._entry = (($rootScope.nav_menu._entry == index) ? -1 : index));}
        $rootScope.isEntryActive = (index)=> {return $rootScope.nav_menu && ($rootScope.nav_menu._entry == index);}
        $rootScope.toggleSubEntry = (func, index, reload)=> {
            let url = '';
            if ($rootScope.nav_menu) {
                let _entry = $rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length ? $rootScope.nav_menu.func_list.indexOf(func) : 0;
                ($rootScope.nav_menu._entry != _entry) && ($rootScope.nav_menu._entry = _entry);
                $rootScope.nav_menu._subEntry = $rootScope.nav_menu._entry + String(index);
                $rootScope.nav_menu.entry = $rootScope.nav_menu.func_list?$rootScope.nav_menu.func_list[$rootScope.nav_menu._entry]:undefined;
                let subFunc = $rootScope.nav_menu.func_list && $rootScope.nav_menu.entry.sub_func_list[index];
                $rootScope.nav_menu.subEntry = subFunc;
                subFunc && (url = subFunc.sub_class_name.replace(/^([^\/])/,"/$1"));
                if (url != $location.path()) {
                    $location.path(url)
                } else {
                    reload && $state.current.name && $rootScope.reload();
                }
            }
        }
        $rootScope.isSubEntryActive = (func, index)=> {return $rootScope.nav_menu && ($rootScope.nav_menu._subEntry == (($rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length ? $rootScope.nav_menu.func_list.indexOf(func) : 0) + String(index)));}
        $rootScope.getSystemHints = () => {
            var source = new EventSource('/sse/common/tips');
            source.onmessage = (e) =>{
                if (window._lastHttpRequest && ((window._lastHttpRequest.getTime() + Constant.exipration) < new Date().getTime())) {
                    //$rootScope.locate('sso?from=application');
                    $rootScope.quitSession("application");
                    return;
                }
                var body = JSON.parse(e.data);
                if (body._closeSSE) {
                    source.close();
                    return;
                }
                if (body._skipSSE) {
                    return;
                }
                if (((typeof body.is_success == 'boolean') && body.is_success) || ((typeof body.is_success == 'string') && (body.is_success == 'true'))) {
                    $rootScope.systemHints = body.data_list;
                } else {
                    console.log(body.data.msg);
                    source.close();
                }
                $rootScope.$apply();
            };
            /*source.onerror = e=>{console.log(e);console.log(new Date())}
            source.onopen = e=>{console.log(e);console.log(new Date())}*/
            window.addEventListener("beforeunload", (event) => {
                source.close()
            });
        }
        $rootScope.toggleHintPanel = (e) => {
            $rootScope._showHint = !$rootScope._showHint;
        };
        $rootScope.closeHintPanel = ()=> {
            $rootScope._showHint = false;
        }
        $rootScope.checkSession = ()=>{
            let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
            (_session && !$rootScope.profile && (document.querySelector("meta[name=session]").content == _session.id)) && ($rootScope.profile = _session);
            if (!_session || !$rootScope.profile || !$rootScope.isSsv()) {
                $rootScope.profile = undefined;
                $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                return false;
            }
            return true;
        }

        $rootScope.$on('$stateChangeStart',(event, toState, toParams, fromState, fromParams) =>{
            $mdDialog.hide();
            /*if(!$rootScope.checkSession()){
                // 如果在此做session过期校验，可能会导致url反复变化的现象，故取消此处session校验，改用其他地方比如拦截器校验，或者推送校验等
                //$rootScope.toPlatform('sso?from=application');
                event.preventDefault();
                return false;
            }*/ /*else if (($rootScope.profile.login_user_status == "0") && (toState != "error")){
                $rootScope.go('error',{error:"用户尚未审核，无法访问页面"});
                event.preventDefault();
                return false;
            }*/
        });



        let navQ;
        $rootScope.preloadingPromise.then(()=>{
            navQ = $http.post('/agent', {module: 'application', partial: 'common', api: 'nav_menu'}).then(body => {
                if ((((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true')))&&(body.data.func_list && body.data.func_list.length)) {
                    angular.extend($rootScope.nav_menu, body.data);
                    return body.data;
                } else {
                    // TODO 左边栏如果不能成功刷出，所有后台应用则无意义
                    $rootScope.logout();
                    return $q.reject();
                }
            }, why => {
                $rootScope.alert(why);
                $rootScope.logout();
                return $q.reject();
            }).then(()=> {
                $rootScope.getSystemHints();
            });
        });

        window.addEventListener("message", e => {
            if (e.data == "expired") {
                //$rootScope.locate('sso?from=application');
                $rootScope.quitSession("application");
            }
        })
    }]);


    return app;
});
