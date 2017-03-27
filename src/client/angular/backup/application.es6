/**
 * Created by robin on 12/1/15.
 */
window._lastHttpRequest = new Date();
let applicationApp = angular.module('ApplicationApp', [
    'ui.router', 'ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages', 'dndLists', 'rop.module.datatable', 'rop.module.pagination', 'rop.module.stepper',
]);

applicationApp.requires.push('rop.module.calendar');

applicationApp.config($mdThemingProvider => {
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
});

applicationApp.config(($mdIconProvider, $mdDateLocaleProvider) => {
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
    /*$mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', ...];
     $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', ...];*/
    // Can change week display to start on Monday.
    // $mdDateLocaleProvider.firstDayOfWeek = 1;
    // Optional.
    /*$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];*/
    // Example uses moment.js to parse and format dates.
    /*$mdDateLocaleProvider.parseDate = function(dateString) {
     var m = moment(dateString, 'L', true);
     return m.isValid() ? m.toDate() : new Date(NaN);
     };*/
    /*$mdDateLocaleProvider.formatDate = function(date) {
     return moment(date).format('L');
     };*/
    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
        return date.getFullYear() + '年 ' + $mdDateLocaleProvider.months[date.getMonth()];
    };
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    /*$mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
     return '星期 ' + weekNumber;
     };*/
    $mdDateLocaleProvider.msgCalendar = '日历表';
    //$mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
});

applicationApp.factory('HttpObserver', ['$cookies','$rootScope','$q',($cookies,$rootScope,$q)=> {
    var sessionInjector = {
        response: function (config) {
            if(config.data._expired){
                //config.status = 401;
                //$rootScope.locateAbs('sso?from=application');
                window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/sso?from=application`;
                return $q.reject(config);
            }
            window._lastHttpRequest = new Date();
            return config;
        }
    };
    return sessionInjector;
}]);
applicationApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {
        $stateProvider.
            state('api', {
                templateUrl: '/_view/application/api',
                controller: 'APICtrl',
                url: '/ssv/ApiList',
            })
            .state('domain', {
                templateUrl: '/_view/application/domain',
                controller: 'DomainCtrl',
                url: '/ssv/ApiDomainList'
            })
            .state('app', {
                templateUrl: '/_view/application/app',
                controller: 'AppCtrl',
                url: '/ssv/AppList',
            })
            .state('isvApp', {
                templateUrl: '/_view/application/isv_app',
                controller: 'ISVAppCtrl',
                url: '/ssv/IsvAppList',
            })
            .state('env', {
                templateUrl: '/_view/application/env',
                controller: 'EnvironmentCtrl',
                url: '/ssv/EnvironmentList',
            })
            .state('flow', {
                templateUrl: '/_view/application/flow',
                controller: 'APIFlowCtrl',
                url: '/ssv/ApiFlowList',
            })
            .state('caution', {
                templateUrl: '/_view/application/caution',
                controller: 'APICautionCtrl',
                url: '/ssv/ApiCautionList',
            })
            .state('category', {
                templateUrl: '/_view/application/category',
                controller: 'CategoryCtrl',
                url: '/ssv/CategoryList',
            })
            .state('group', {
                templateUrl: '/_view/application/group',
                controller: 'CategoryGroupCtrl',
                url: '/ssv/ConCategoryGroupList',
            })
            .state('noapply', {
                templateUrl: '/_view/application/noapply',
                controller: 'NoApplyCtrl',
                url: '/ssv/NoApplyList',
            })
            .state('auth', {
                templateUrl: '/_view/application/auth',
                controller: 'AuthorityCtrl',
                url: '/ssv/SsvIsvUserList',
            })
            .state('mail', {
                templateUrl: '/_view/application/mail',
                controller: 'MailCtrl',
                url: '/ssv/UserMailList',
            })
            .state('ping', {
                templateUrl: '/_view/application/ping',
                controller: 'PingCtrl',
                url: '/ssv/ApiPingList',
            })
            .state('assistSandbox', {
                templateUrl: '/_view/application/assist_sandbox',
                controller: 'SandboxLogAssistCtrl',
                url: '/statistics/AppApiAssistSsvSandbox',
            })
            .state('assist', {
                templateUrl: '/_view/application/assist',
                controller: 'LogAssistCtrl',
                url: '/statistics/AppApiAssistSsv',
            })
            .state('analysisSandbox', {
                templateUrl: '/_view/application/analysis_sandbox',
                controller: 'SandboxLogAnalysisCtrl',
                url: '/statistics/LogAnalyzeSandbox',
            })
            .state('analysis', {
                templateUrl: '/_view/application/analysis',
                controller: 'LogAnalysisCtrl',
                url: '/statistics/LogAnalyze',
            })
            .state('download', {
                templateUrl: '/_view/application/download',
                controller: 'DownloadCtrl',
                url: '/ssv/DownloadList',
            })
            .state('doc', {
                templateUrl: '/_view/application/doc',
                controller: 'DocCtrl',
                url: '/ssv/SsvDocList',
            })
            .state('notice', {
                templateUrl: '/_view/application/notice',
                controller: 'NoticeCtrl',
                url: '/ssv/SsvNoticeList',
            })
            .state('tool', {
                templateUrl: '/_view/application/tool',
                controller: 'ToolDownloadCtrl',
                url: '/ssv/ToolDownload',
            })
            .state('sdk', {
                templateUrl: '/_view/application/sdk',
                controller: 'SDKCtrl',
                url: '/ssv/SdkDownload',
            })
            .state('func', {
                templateUrl: '/_view/application/func',
                controller: 'FunctionCtrl',
                url: '/ssv/Function',
            })
            .state('subuser', {
                templateUrl: '/_view/application/subuser',
                controller: 'SubUserCtrl',
                url: '/ssv/SubUserList',
            })
            .state('dataroleset', {
                templateUrl: '/_view/application/dataroleset',
                controller: 'DataRoleSetCtrl',
                url: '/ssv/DataRoleSet',
            })
            .state('frame', {
                params: {
                    error: "",
                },
                templateUrl: '/_view/application/frame',
                controller: 'FrameCtrl',
                url: '/frame',
            });
        $urlRouterProvider.otherwise('/frame');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $httpProvider.interceptors.push('HttpObserver');
    }]);

applicationApp.controller('ApplicationCtrl', ['$rootScope', '$scope', '$state', '$location', '$window', '$http', '$cookies', '$mdDialog', '$mdUtil', '$mdMedia', '$q',
    ($rootScope, $scope, $state, $location, $window, $http, $cookies, $mdDialog, $mdUtil, $mdMedia, $q) => {
        $rootScope.nav_menu = {};
        let navQ = $http.post('/agent', {module: 'application', partial: 'common', api: 'nav_menu'}).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                angular.extend($rootScope.nav_menu, body.data);
                //$rootScope.validateEntry();
                return body.Data;
            } else {
                // TODO 左边栏如果不能成功刷出，所有后台应用则无意义
                $cookies.put("_session", null, {path: "/", domain: `.${Constant.host}`});
                $cookies.remove("_session");
                $rootScope.profile = undefined;
                // TODO 注意注掉这里
                $window.location.href = 'sso?from=application';
            }
        }, why => {
            $rootScope.alert(why);
        }), _lang = $cookies.get("_lang");
        $rootScope.navQ = navQ;
        $rootScope.validateEntry = (reload)=>{
            navQ.then(()=>{
                if ($rootScope.nav_menu && $rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length) {
                    let unknownEntry = true;
                    for (let i = 0; i < $rootScope.nav_menu.func_list.length; i++) {
                        for (let j = 0; j < $rootScope.nav_menu.func_list[i].sub_func_list.length; j++) {
                            if ($rootScope.nav_menu.func_list[i].sub_func_list[j].sub_class_name == $location.path().replace("/", "")) {
                                $rootScope.toggleSubEntry($rootScope.nav_menu.func_list[i], j, reload);
                                unknownEntry = false;
                            }
                        }
                    }
                    if (($rootScope.nav_menu._entry === undefined) && unknownEntry) {
                        $rootScope.toggleEntry(-1);
                        $rootScope.go("frame",{error:"没有访问此页面的权限，请联系管理员，E011"});
                    }
                }
            });
        }
        //$rootScope._dirtyMenu = false;
        $rootScope.removeLoading = () => {
            if (!$('.loading').hasClass("out")) {
                $('.loading').addClass("start");
                setTimeout(() => {
                    $('.loading').addClass("out").one($.support.transition.end, function () {
                        $('body').addClass('reveal');
                        $(this).hide();
                    })
                }, ROPStyleConstant.loadingTime);
            }
        }
        $rootScope.minify = ()=> {
            return !$mdMedia('(min-width: 1400px)')
        };
        $rootScope.mini = false;
        $rootScope._lang = $cookies.get("_lang");
        $rootScope.toggleMini = ()=> {
            $rootScope.mini = !$rootScope.mini;
        }
        $rootScope.toggleEntry = (index)=> {
            $rootScope.nav_menu && ($rootScope.nav_menu._entry = (($rootScope.nav_menu._entry == index) ? -1 : index));
        }
        $rootScope.isEntryActive = (index)=> {
            return $rootScope.nav_menu && ($rootScope.nav_menu._entry == index);
        }
        $rootScope.toggleSubEntry = (func, index, reload)=> {
            let url = '';
            if ($rootScope.nav_menu) {
                let _entry = $rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length ? $rootScope.nav_menu.func_list.indexOf(func) : 0;
                ($rootScope.nav_menu._entry != _entry) && ($rootScope.nav_menu._entry = _entry);
                $rootScope.nav_menu._subEntry = $rootScope.nav_menu._entry + String(index);
                let subFunc = $rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list[$rootScope.nav_menu._entry].sub_func_list[index];
                subFunc && (url = "/" + subFunc.sub_class_name);
                if (url != $location.path()) {
                    $location.path(url)
                } else {
                    reload && $state.current.name && $rootScope.reload();
                }
            }
        }
        $rootScope.isSubEntryActive = (func, index)=> {
            return $rootScope.nav_menu && ($rootScope.nav_menu._subEntry == (($rootScope.nav_menu.func_list && $rootScope.nav_menu.func_list.length ? $rootScope.nav_menu.func_list.indexOf(func) : 0) + String(index)));
        }
        $rootScope.locate = url => {
            $window.location.href = url;
        }
        $rootScope.locateAbs = url => {
            $window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/${url ? url : ''}`;
        }
        $rootScope.openPopup = url => {
            $window.open(`${Constant.protocol}://${Constant.host}:${Constant.port}/${url ? url : ''}`, "_blank");
        }
        $rootScope.toPlatform = path => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}${path ? path : ""}`);
        }
        $rootScope.toWelcome = () => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}`);
        }
        $rootScope.go = (tab, params, option) => {
            $state.go(tab, params, option);
        }
        $rootScope.reload = ()=> {
            $state.reload();
        };
        $scope.logout = () => {
            $http.post('/agent', {module: 'sso', partial: 'session', api: 'logout'}).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $cookies.put("_session", null, {path: "/", domain: `.${Constant.host}`});
                    $cookies.remove("_session");
                    $rootScope.profile = undefined;
                    $rootScope.locateAbs('sso?from=application');
                } else {
                }
            }, why => {
                $rootScope.alert(why);
            });
        }
        $rootScope.isSsv = () => {
            return $rootScope.profile && ($rootScope.profile.login_user_type == '2')
        };
        $rootScope.alert = msg => {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body>section>md-content')))
                    .clickOutsideToClose(true)
                    /*.title((_lang == "zh-cn") ? '出错了' : "Oops")*/
                    .textContent(msg)
                    .ariaLabel(msg)
                    .ok((_lang == "zh-cn") ? '了解' : "Got it")
            );
        }
        $rootScope.confirm = (msg, accept, reject) => {
            var confirm = $mdDialog.confirm()
                /*.title('Would you like to delete your debt?')*/
                .parent(angular.element(document.querySelector('body>section>md-content')))
                .textContent(msg)
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                //.targetEvent(ev)
                .ok((_lang == "zh-cn") ? '确定' : "Yes")
                .cancel((_lang == "zh-cn") ? '取消' : "No")
            $mdDialog.show(confirm).then(function () {
                accept && accept.call();
            }, function () {
                reject && reject.call();
            });
        }
        $rootScope.ajax = (api, _param, _cb, _fail) => {
            if (!api) {
                return
            }
            let callback = undefined, param = undefined, fail = undefined;
            if (typeof _cb == "function") {
                param = _param, callback = _cb, fail = _fail
            }
            else if (typeof _param == "function") {
                callback = _param, fail = _cb;
            }
            return $http.post('/agent', {
                module: 'application',
                partial: $rootScope.tab,
                api: api,
                param: param
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    //callback && callback.call(null, body.data);
                    if(callback){
                        let q = callback.call(null, body.data);
                        if(q){return q;}
                    }
                    return body.data;
                } else {
                    $rootScope.alert(body.data.msg);
                    return $q.reject(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
                fail && fail.call();
                return false;
            });
        }
        $rootScope.getSystemHints = () => {
            var source = new EventSource('/sse/common/tips');
            source.onmessage = function (e) {
                if (window._lastHttpRequest && (window._lastHttpRequest.getTime() + Constant.exipration < new Date().getTime())) {
                    $rootScope.locate('sso?from=application');
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
                    console.log(body.msg);
                    source.close();
                }
                $rootScope.$apply();
            };
            window.addEventListener("beforeunload", function (event) {
                source.close()
            });
        }
        $rootScope.toggleHintPanel = (e) => {
            $rootScope._showHint = !$rootScope._showHint;
        };
        $rootScope.closeHintPanel = ()=> {
            $rootScope._showHint = false;
        }


        let LogController = (scope, $mdDialog, $timeout, $mdUtil, recordkey)=> {
            let _lang = $rootScope._lang, beforeClipboardCopy = (_lang == "zh-cn") ? "拷贝信息" : "Copy", afterClipboardCopy = (_lang == "zh-cn") ? "已复制" : "Copied",
                workaroundSupportClipboard = action => {
                    let actionMsg = ` 来${action === 'cut' ? '剪切' : '拷贝'}`, actionKey = (action === 'cut' ? 'X' : 'C');
                    if (/iPhone|iPad/i.test(navigator.userAgent)) {
                        actionMsg = '暂不支持iPhone和iPad :(';
                    }
                    else if (/Mac/i.test(navigator.userAgent)) {
                        actionMsg = `请按 ⌘-${actionKey}${actionMsg}`;
                    }
                    else {
                        actionMsg = `请按 Ctrl-${actionKey}${actionMsg}`;
                    }
                    return actionMsg;
                };
            scope.tableData = [];
            scope.research = () => {
                scope.pageIndex = 1;
                scope.pageSize = new Number(10);
            }
            scope.reset = e=> {
                scope.columns = [{
                    text: "操作时间",
                    name: "create_time",
                    style: {width: "144px", 'text-align': "left"}
                }, {text: "操作人", name: "create_user", style: {width: "144px", 'text-align': "center"}}, {
                    text: "动作",
                    name: "log_content",
                    tooltip:true,
                    style: {'text-align': "left"}
                }];
                scope.pageIndex = 1;
                scope.pageSize = new Number(10);
            }
            scope.searcher = (index, size) => {
                return $http.post('/agent', {
                    module: 'application',
                    partial: 'common',
                    api: 'logger',
                    param: {
                        pageindex: index ? index : scope.pageIndex,
                        pagesize: size ? size : scope.pageSize,
                        recordkey: recordkey
                    }
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        scope.tableData = body.data.data_list;
                        scope.total = body.data.list_count;
                        $mdUtil.nextTick(()=> {
                            let cliper = new Clipboard('.cliper');
                            cliper.on('success', e => {
                                e.clearSelection();
                                let trigger = e.trigger;
                                angular.element(trigger).find(".text")[0].innerHTML = afterClipboardCopy;
                                $timeout(() => {
                                    angular.element(trigger).find(".text")[0].innerHTML = beforeClipboardCopy;
                                }, 5000);
                            });
                            cliper.on('error', e => {
                                let trigger = e.trigger;
                                angular.element(trigger).find(".text")[0].innerHTML = workaroundSupportClipboard(e.action);
                                $timeout(() => {
                                    angular.element(trigger).find(".text")[0].innerHTML = beforeClipboardCopy;
                                }, 5000);
                            });
                        });
                    } else {
                        $rootScope.alert(body.data.msg);
                        scope.total = 0;
                    }
                }, why => {
                    $rootScope.alert(why);
                    scope.total = 0;
                });
            }
            scope.closeLogger = () => {
                $mdDialog.hide()
            };
            scope.reset();
        }
        $rootScope.showLog = (ev, recordkey) => {
            $mdDialog.show({
                controller: LogController,
                templateUrl: "/_template/logger",
                /*parent: angular.element(document.body),*/
                parent: angular.element(document.querySelector('body>section>md-content')),
                targetEvent: ev,
                clickOutsideToClose: true,
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                locals: {recordkey: recordkey}
            });
        };

        $rootScope.browserType = window.window.getBrowserType();
        $rootScope.checkSession = ()=>{
            let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
            (_session && (document.querySelector("meta[name=session]").content == _session.id)) && ($rootScope.profile = _session);
            if (!$rootScope.profile || !$rootScope.isSsv()) {
                $rootScope.profile = undefined;
                $cookies.remove("_session");
                // TODO 注意注掉这里

                return false;
            }
            return true;
        }

        $scope.init = () => {

            navQ.then(()=> {
                $rootScope.removeLoading();
                $rootScope.getSystemHints();
                if ($rootScope.profile.login_user_status == "0"){
                    $rootScope.go('frame',{error:"用户尚未审核，无法访问页面"});
                }
            });

            window.addEventListener("message", e => {
                if (e.data == "expired") {
                    $rootScope.locate('sso?from=application');
                }
            })
        }
        $rootScope.nextTick = (cb, digest, scope)=> {
            $mdUtil.nextTick(cb);
        }
        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            if(!$rootScope.checkSession()){
                // 注意顺序和位置
                $rootScope.locateAbs('sso?from=application');
                event.preventDefault();
                return false;
            } else if (($rootScope.profile.login_user_status == "0") && (toState != "frame")){
                //$rootScope.go('frame',{error:"用户尚未审核，无法访问页面"});
                event.preventDefault();
                return false;
            }
        });
        $rootScope.defer = ()=>{return $q.defer();};
        window.postTest = $http;
    }]);

applicationApp.controller('APICtrl', ['$rootScope', '$scope', '$http', '$element', '$mdDialog', '$q',
    ($rootScope, $scope, $http, $element, $mdDialog, $q) => {
        // TODO 石奇峰邀请您来维护以下代码，以下代码分为4大部分，api列表操作部，api修改部，api排序部，免审核部， 3个页内弹窗，缓存，日志，下载， 1个页外弹窗，预览
        $rootScope.tab = "api";
        $rootScope.validateEntry();

        $scope.mode = 0;
        $scope.enterMode = (mode, cb)=> {
            $scope.mode = mode;
            cb && cb.call();
        }
        $scope.exitMode = (cb)=> {
            $scope.mode = 0;
            cb && cb.call();
        }


        //TODO 有接口后根据接口做一下变动
        $scope.toggleFilterPanel = (e)=> {
            $scope.showFilterPanel = !$scope.showFilterPanel;
            $scope.showBatchPanel = false;
        }

        $scope.toggleBatchPanel = (e)=> {
            $scope.showBatchPanel = !$scope.showBatchPanel;
            $scope.showFilterPanel = false;
        }
        $scope.$watch("batch",()=>{
            if($scope.batch) {$scope.showFilterPanel = true}
            //else{$scope.showFilterPanel = false;}
        })
        $scope.orders = [
            {name: "ruixue.external.items.get", cat: "商品API", des: "1.获取商品数据 注：不填写查询参数时默认为查询所有的商品信息。"},
            {name: "ruixue.external.items.get", cat: "商品API", des: "2.获取商品数据 注：不填写查询参数时默认为查询所有的商品信息。"},
            {name: "ruixue.external.items.get", cat: "商品API", des: "3.获取商品数据 注：不填写查询参数时默认为查询所有的商品信息。"},
        ];

        let ExportController = (scope, $mdDialog)=> {
            scope.test_url = "0";
            scope.online_url = "0";
            let exportFile = ()=> {
                scope.exporting = true;
                return $rootScope.ajax("api_export", {
                    keyword: $scope.keyword,
                    cat_id: $scope.panelSelection.panelCat.cat_id,
                    group_id: $scope.panelSelection.panelCatGroup.group_id,
                    status: $scope.panelSelection.panelStatus.status_id,
                    sort_name: $scope.panelSelection.sorter.name,
                    sort_flag: $scope.panelSelection.sorter.sort,
                    test_url: scope.test_url,
                    online_url: scope.online_url
                }, (data)=> {
                    if($rootScope.browserType == "Chrome"){
                        // TODO 因为没有放入document里，所以这里可以不用detach
                        let a = window.document.createElement("a");
                        a.href = data.export_url;
                        a.download = true;
                        a.click();
                    } else {
                        window.open(data.export_url,"_blank");
                    }
                    scope.exporting = false;
                    return data;
                });
            }
            scope.triggerExport = () => {
                if (scope.exporting) {
                    return
                }
                exportFile().then(data=> {
                    if (data) {
                        $mdDialog.hide();
                    }
                });
            };
            scope.closeExport = () => {
                $mdDialog.hide()
            };
        }
        $scope.showExport = (ev) => {
            $mdDialog.show({
                controller: ExportController,
                template: `<md-dialog aria-label="Mango (Fruit)" style="width: 256px">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-body">
                                        <md-checkbox ng-model="test_url" aria-label="Checkbox 1" class="md-primary" ng-true-value="'1'" ng-false-value="'0'" >测试URL</md-checkbox>
                                        <md-checkbox ng-model="online_url" aria-label="Checkbox 2" class="md-primary" ng-true-value="'1'" ng-false-value="'0'" >正式URL</md-checkbox>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="closeExport()">
                                    取消
                                  </md-button>
                                  <md-button ng-click="triggerExport()">
                                   导出
                                  </md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                /*parent: angular.element(document.body),*/
                parent: angular.element(document.querySelector('body>section>md-content')),
                targetEvent: ev,
                clickOutsideToClose: true,
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };

        // 主页面的功能数据
        $scope.panelSelection = {};
        let initCat = {cat_id: "", cat_name: "全部分类"}, initGroup = {
            group_id: "",
            group_name: ""
        }, initStatus = {status_id: "", status_name: "全部状态"};
        $scope.reset = ()=> {
            $scope.panelSelection.panelCat = {cat_id: "", cat_name: "全部分类"};
            $scope.panelSelection.panelCatGroup = {group_id: "",group_name: ""};
            $scope.panelSelection.panelStatus = initStatus;
            $scope.panelSelection.sorter = {name: "", sort: "1"};
            $scope.columns = [{text: "API名称", name: "api_name", tooltip: true, sort: "1",linker:{create:row=>{return `${Constant.protocol}://${Constant.host}:${Constant.port}/api/ApiPreview-${row.api_id}.html`}, target:"_blank"}}, {
                text: "API标题",
                name: "api_title",
                tooltip: true,
                sort: "1"
            }, {text: "API类型", name: "cat_id", style: {width: "128px", 'text-align': "center"}}, {
                text: "状态",
                name: "status_name",
                style: {width: "96px", 'text-align': "center"}
            }, {text: "停用状态", name: "use_yn", style: {width: "88px", 'text-align': "center"}}, {
                text: "添加时间",
                name: "create_time",
                sort: "1",
                style: {width: "160px", 'text-align': "center"}
            }];
            $scope.keyword = "";
            $scope.batch = false;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        $scope.reset();
        $scope.chooseCat = (cat, group)=> {
            $scope.panelSelection.panelCat = cat ? cat : {cat_id: "", cat_name: "全部分类"};
            $scope.panelSelection.panelCatGroup = group ? group : initGroup;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        $scope.chooseStatus = (status)=> {
            $scope.panelSelection.panelStatus = status ? status : {status_id: "", status_name: "全部状态"};;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        //$scope.pageSize = 10;
        $scope.searcher = (index, size) => {
            $scope.refreshing = true;
            /*return $http.post('/agent', {
                module: 'application', partial: 'api', api: 'api_list',
                param: {
                    pageindex: index ? index : $scope.pageIndex,
                    pagesize: size ? size : $scope.pageSize,
                    keyword: $scope.keyword,
                    cat_id: $scope.panelSelection.panelCat.cat_id,
                    group_id: $scope.panelSelection.panelCatGroup.group_id,
                    status: $scope.panelSelection.panelStatus.status_id,
                    sort_name: $scope.panelSelection.sorter.name,
                    sort_flag: $scope.panelSelection.sorter.sort,
                }
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.tableData = body.data.data_list;
                    $scope.total = body.data.list_count;
                } else {
                    $rootScope.alert(body.data.msg);
                    $scope.total = 0;
                }
                $scope.refreshing = false;
            }, why => {
                $rootScope.alert(why);
                $scope.total = 0;
                $scope.refreshing = false;
            });*/
            return $rootScope.ajax("api_list", {
                pageindex: index ? index : $scope.pageIndex,
                pagesize: size ? size : $scope.pageSize,
                keyword: $scope.keyword,
                cat_id: $scope.panelSelection.panelCat.cat_id,
                group_id: $scope.panelSelection.panelCatGroup.group_id,
                status: $scope.panelSelection.panelStatus.status_id,
                sort_name: ($scope.panelSelection.sorter.name == "create_time")?"rx_insertTime":$scope.panelSelection.sorter.name,
                sort_flag: $scope.panelSelection.sorter.sort,
            }, (data)=> {
                if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                    $scope.tableData = data.data_list;
                    $scope.total = data.list_count;
                } else {
                    $rootScope.alert(data.msg);
                    $scope.total = 0;
                }
            }, ()=> {
                $scope.total = 0;
            }).finally(()=>{
                $scope.refreshing = false;
            });
        }
        $scope.tableData = [];
        $scope.research = () => {
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
        }
        let mainQ = $rootScope.ajax("init", (data)=> {
            $scope.originalPanel = JSON.parse(JSON.stringify(data));
            $scope.panel = data;
        });
        $scope.canVisistAPI = ()=> {
            return $scope.tableData && $scope.tableData._select
        };
        /*$scope.canPreviewAPI = ()=> {
            return !$scope.batch && $scope.tableData && $scope.tableData._select
        };*/
        $scope.canInsertAPI = ()=> {
            return $scope.panel && ($scope.panel.role_list.btnInsert == "1")
        };
        $scope.canInsertFrontAPI = ()=> {
            return $scope.panel && ($scope.panel.role_list.btnFrontInsert == "1")
        };
        $scope.canVisitCacheAPI = ()=> {
            return $scope.panel && ($scope.panel.role_list.btnCache == "1") && $scope.tableData && $scope.tableData._select;
        };
        $scope.canApplyAuditAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnApplyApi == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "0") && (r.status != "101") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canDeleteAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnDelete == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "0") && (r.status != "1") && (r.status != "2") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canUpdateAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnUpdate == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "0") && (r.status != "1") && (r.status != "2") && (r.status != "3") && (r.status != "6") && (r.status != "101") && (r.status != "103") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canApplyPromoteAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnApplyApi == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "2") && (r.status != "6") && (r.status != "103") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canApplyUpdateAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnApplyApi == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "4") || (r.is_old != "0")) && (result = false);
                // 105 拒绝修改状态已被废弃，((r.status != "4") && (r.status != "105") && (r.is_old != "0")) && (result = false);
            });
            return result;
        }
        $scope.canRecallAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnCancel == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "6") && (r.status != "106") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canRestoreAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnScrap == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "107") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.canDumpAPI = (array)=> {
            if (!array || !array.length || !array[0] || ($scope.panel && ($scope.panel.role_list.btnScrap == "0"))) {
                return false
            }
            let result = true;
            array.forEach((r, i)=> {
                ((r.status != "4") || (r.is_old != "0")) && (result = false)
            });
            return result;
        }
        $scope.checkedRows = ()=> {
            let data = $scope.tableData;
            if (!data || !data.length || !data[0]) {
                return []
            }
            let filtered = [].concat.apply([], data.map((r, i)=> {
                return (r._checked) ? [r] : []
            }));
            return filtered;
        }
        $scope.deleteAPI = (row) => {
            return $rootScope.ajax("delete_api", {api_id: row.api_id}, (data)=> {
                $scope.research();
                $rootScope.alert("删除成功");
            });
        }
        $scope.applyAPI = (row, status) => {
            if(status == "5"){
                return $rootScope.confirm(`数据为<${row.status_name}>状态，确定要申请修改吗？`, ()=> {
                    return $rootScope.ajax("apply_api", {api_id: row.api_id, status: status}, (data)=> {
                        //$scope.research();
                        $scope.searcher();
                        $rootScope.alert("申请成功");
                        return data;
                    });
                });
            } else {
                return $rootScope.ajax("apply_api", {api_id: row.api_id, status: status}, (data)=> {
                    $scope.searcher();
                    $rootScope.alert("申请成功");
                    return data;
                });
            }
        }
        $scope.recallAPI = (row) => {
            return $rootScope.ajax("cancel_api", {api_id: row.api_id}, (data)=> {
                $scope.searcher();
                $rootScope.alert("撤销成功");
            });
        }
        $scope.restoreAPI = (row) => {
            return $rootScope.ajax("recover_api", {api_id: row.api_id}, (data)=> {
                $scope.searcher();
                $rootScope.alert("恢复成功");
            });
        }
        $scope.dumpAPI = (row)=> {
            return $rootScope.ajax("dump_api", {api_id: row.api_id}, (data)=> {
                $scope.searcher();
                $rootScope.alert("废弃成功");
            });
        }
        $scope.batchSaveAPI = (apply_type)=> {
            let rows = $scope.checkedRows(),status = rows.map((r, i)=> {return r.status_name}),
                uniqueStatus = [ ...new Set(status)], statusString = uniqueStatus.join("/"),
                operationString = (apply_type == '2')?"批量上线":((apply_type == '3')?"批量申请修改":((apply_type == '4')?"批量撤销":"批量操作"));
            return $rootScope.confirm(`数据为<${statusString}>状态,您确定要进行<${operationString}>吗？`, ()=> {
                let apiIDs = rows.map((r, i)=> {return {api_id: r.api_id}});
                return $rootScope.ajax("batch_save", {apply_type: apply_type, api_list: apiIDs}, (data)=> {
                    $scope.research();
                    $rootScope.alert(`${operationString}成功`);
                });
            });
        }
        /*$scope.previewAPI = ()=> {
            $rootScope.openPopup(`api/ApiPreview-${$scope.tableData._select.api_id}.html`, "_blank")
        }*/


        // 模式1，修改，添加API的功能数据
        let initialUpdaterAPI = {
            api_name: "",
            api_rank: "0",
            timeout: "30",
            is_noserver: "0",
            api_title:"",
            api_title_en:"",
            api_desc:"",
            api_desc_en:"",
            return_example_xml:"",
            return_example_json:"",
            test_url:"",
            online_url:"",
            busparam: [{is_must:"0"}, {is_must:"0"}, {is_must:"0"}, {is_must:"0"}, {is_must:"0"}],
            buserror: [{}, {}, {}, {}, {}],
            result: [{}, {}, {}, {}, {}]
        }, initialSteps = [{name: "基本信息"}, {name: "请求参数"}, {name: "返回结果"}, {name: "错误代码"}], initialClientSteps = [{name: "基本信息"}, {name: "错误代码"}], initAPIQ;
        $scope.lowerCharcodes = [190,...[...Array(26).keys()].map(r=>{return r + 65})];
        $scope.updaterAPI = JSON.parse(JSON.stringify(initialUpdaterAPI));
        $scope.step = 0;
        $scope.steps = initialSteps;
        //$scope.step1 = 0;
        //$scope.steps1 = [{name:"基本信息"},{name:"错误代码"}];
        $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
        $scope.step1Tab = 0;
        $scope.selectStep1Tab = (value)=>{
            $scope.step1Tab = value;
        }
        $scope.initAPI = (row) => {
            return $rootScope.ajax("api_init", {}, (data)=> {
                $scope.apiInit = data;
                $scope.apiInit && $scope.apiInit.environment.length && $scope.apiInit.environment.forEach(r=>{!r.url && (r.url = "")});
                initialUpdaterAPI.environment_url = $scope.apiInit.environment;
                $scope.updaterAPI.environment_url = JSON.parse(JSON.stringify($scope.apiInit.environment));
                if ($scope.apiInit && $scope.apiInit.cat_list && $scope.apiInit.cat_list[0]) {
                    initCat = $scope.apiInit.cat_list[0];
                    if ($scope.apiInit.cat_list[0].group_list && $scope.apiInit.cat_list[0].group_list[0]) {
                        initGroup = $scope.apiInit.cat_list[0].group_list[0];
                    }
                } else {
                    return $q.reject("该账号暂无任何可操作的API分类，请完成审核流程并添加API分类")
                }
            });
        };
        initAPIQ = $scope.initAPI();
        $scope.addAPIMode = (mode) => {
            $scope.step1Tab = 0;
            initAPIQ && initAPIQ.then(data=> {
                $scope.mode = mode;
                //$scope.updaterAPI = initialUpdaterAPI;
                $scope.updaterSelection.panelCat = initCat;
                $scope.updaterSelection.panelCatGroup = initGroup;
                ($scope.step != 0) && ($scope.step = 0);
                if (mode == 1) {
                    $scope.steps = initialSteps;
                    $scope.updaterAPI.call_flag = "0";
                } else {
                    $scope.steps = initialClientSteps;
                    $scope.updaterAPI.call_flag = "1";
                }
                $rootScope.ajax("api_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                    $scope.resultDataTypes = data.data_type_list
                });
            },e=>{$rootScope.alert(e)});
        }
        $scope.updateAPIMode = (forView) => {
            $scope.step1Tab = 0;
            $scope.updaterAPI.api_id = "fake";
            return initAPIQ && initAPIQ.then(data=> {
                if (!$scope.apiInit || !$scope.apiInit.cat_list) {
                    $rootScope.alert("API没有分类信息");
                    return;
                }
                return $rootScope.ajax("api_info", {api_id: $scope.tableData._select.api_id}, (data)=> {
                    if (data.api_info.call_flag == "0") {
                        $scope.mode = 1;
                        $scope.steps = initialSteps;
                    } else {
                        $scope.mode = 4;
                        $scope.steps = initialClientSteps;
                    }
                    ($scope.step != 0) && ($scope.step = 0);
                    $scope.originalUpdaterAPI = JSON.parse(JSON.stringify(data.api_info));
                    angular.extend($scope.updaterAPI,data.api_info);
                    forView && ($scope.updaterAPI._forView = forView);
                    $scope.updaterSelection.panelCat = [].concat.apply([], $scope.apiInit.cat_list.map(r=> {
                        return (r.cat_id == $scope.updaterAPI.cat_id) ? [r] : []
                    }))[0];
                    !$scope.updaterSelection.panelCat && ($scope.updaterSelection.panelCat = initCat);
                    if ($scope.updaterSelection.panelCat.group_list && $scope.updaterSelection.panelCat.group_list[0]) {
                        $scope.updaterSelection.panelCatGroup = [].concat.apply([], $scope.updaterSelection.panelCat.group_list.map(r=> {
                            return (r.group_id == $scope.updaterAPI.group_id) ? [r] : []
                        }))[0];
                    }
                    (!$scope.updaterSelection.panelCatGroup || !$scope.updaterSelection.panelCatGroup.group_id) && ($scope.updaterSelection.panelCatGroup = initGroup);
                    $rootScope.ajax("api_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                        $scope.resultDataTypes = data.data_type_list
                    });
                })
            });
        };
        //$scope.toggleMdCheck = (obj, prop)=>{obj[prop] = (obj[prop] === undefined)?undefined:((obj[prop] == "0")?"1":"0");}
        $scope.nextStep = ()=> {
            if ($scope.updaterAPI._forView) {($scope.step < 3) && $scope.step++;return;}
            if ($scope.mode == 1) {
                // 需求，只有用户点过一次下一步按钮后再显示错误
                !$scope.nextKeyPressed && ($scope.nextKeyPressed = true);
                if ($scope.updaterAPIForm.$invalid) {
                    for(let pattern in $scope.updaterAPIForm.$error){
                        $scope.updaterAPIForm.$error[pattern].forEach(r => {r.$setDirty(true);});
                    }
                    return;
                }
                ($scope.step < 3) && $scope.step++;
            } else if ($scope.mode == 4) {
                !$scope.frontEndNextKeyPressed && ($scope.frontEndNextKeyPressed = true);
                if ($scope.updaterFrontEndAPIForm.$invalid) {
                    //$scope.updaterFrontEndAPIForm.$error.required && $scope.updaterFrontEndAPIForm.$error.required.forEach(r => {r.$setDirty(true);});
                    for(let pattern in $scope.updaterFrontEndAPIForm.$error){
                        $scope.updaterFrontEndAPIForm.$error[pattern].forEach(r => {r.$setDirty(true);});
                    }
                    return;
                }
                ($scope.step < 3) && $scope.step++;
            }
        }
        $scope.previousStep = ()=> {($scope.step > 0) && $scope.step--;}
        $scope.cancelStep = ()=> {
            $scope.updaterAPI = JSON.parse(JSON.stringify(initialUpdaterAPI));
            if ($scope.mode == 1) {
                $scope.updaterAPIForm.$setPristine();
            } else if ($scope.mode == 4) {
                $scope.updaterFrontEndAPIForm.$setPristine();
            }
            $scope.mode = 0;
            $scope.step = 0;
            $scope.step1Tab = 0;
            $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
        }
        $scope.chooseUpdaterCat = (cat, group)=> {
            $rootScope.confirm("修改API类别会导致 [结构属性信息] 类型中含有结构属性的数据清空，确定修改API类别吗", ()=> {
                $scope.updaterSelection.panelCat = cat ? cat : initCat;
                $scope.updaterAPI.cat_id = $scope.updaterSelection.panelCat.cat_id;
                if ($scope.updaterSelection.panelCat.group_list && $scope.updaterSelection.panelCat.group_list[0]) {
                    $scope.updaterSelection.panelCatGroup = $scope.updaterSelection.panelCat.group_list[0];
                }
                $rootScope.ajax("api_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                    $scope.resultDataTypes = data.data_type_list
                });
            });
        }
        $scope.chooseUpdaterGroup = (group)=> {
            $scope.updaterSelection.panelCatGroup = group ? group : initGroup;
            $scope.updaterAPI.group_id = $scope.updaterSelection.panelCatGroup.group_id;
        }
        $scope.processResultDataType = (data_type, result)=> {
            let systemDataTypes = $scope.apiInit.data_type_list.map(r=> {
                return r.data_type
            });
            result._customized = (systemDataTypes.indexOf(data_type) == -1);
            (data_type != result.param_type) && (result.param_type = data_type);
            if (result._customized) {
                let param_name;
                if (result.is_list == "1") {
                    param_name = result.param_type ? `${result.param_type.toLowerCase()}s` : "";
                    let second_param_name = result.param_type ? result.param_type.toLowerCase() : "";
                    (result.second_node != second_param_name) && (result.second_node = second_param_name);
                } else {
                    param_name = result.param_type ? result.param_type.toLowerCase() : "";
                    (result.second_node != "") && (result.second_node = "");
                }
                (result.param_name != param_name) && (result.param_name = param_name);
                (result.first_node != param_name) && (result.first_node = param_name);
            } else {
                result.is_list = "0";
                result.first_node = "";
                result.second_node = "";
            }
        }
        $scope.processListCheck = (result)=> {
            if (!result._customized) {
                return;
            }
            $rootScope.nextTick(()=> {
                let param_name;
                if (result.is_list == "1") {
                    param_name = result.param_type ? `${result.param_type.toLowerCase()}s` : "";
                    let second_param_name = result.param_type ? result.param_type.toLowerCase() : "";
                    (result.second_node != second_param_name) && (result.second_node = second_param_name);
                } else {
                    param_name = result.param_type ? result.param_type.toLowerCase() : "";
                    (result.second_node != "") && (result.second_node = "");
                }
                (result.param_name != param_name) && (result.param_name = param_name);
                (result.first_node != param_name) && (result.first_node = param_name);
            });
        }
        $scope.saveAPI = ()=> {
            if (!$scope.updaterAPI) {
                $scope.alert("没有初始化数据");
                return;
            }
            if ($scope.mode == 1) {
                if ($scope.updaterAPIForm.$invalid) {$scope.updaterAPIForm.$error.required && $scope.updaterAPIForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
            } else if ($scope.mode == 4) {
                if ($scope.updaterFrontEndAPIForm.$invalid) {$scope.updaterFrontEndAPIForm.$error.required && $scope.updaterFrontEndAPIForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
            }
            let api = {
                cat_id: $scope.updaterSelection.panelCat.cat_id,
                group_id: $scope.updaterSelection.panelCatGroup.group_id,
                api_id: $scope.updaterAPI.api_id,
                call_flag: $scope.updaterAPI.call_flag,
                api_name: $scope.updaterAPI.api_name,
                api_title: $scope.updaterAPI.api_title,
                api_title_en: $scope.updaterAPI.api_title_en,
                api_desc: $scope.updaterAPI.api_desc,
                api_desc_en: $scope.updaterAPI.api_desc_en,
                return_example_xml: $scope.updaterAPI.return_example_xml,
                return_example_json: $scope.updaterAPI.return_example_json,
                test_url: $scope.updaterAPI.test_url,
                online_url: $scope.updaterAPI.online_url,
                timeout: $scope.updaterAPI.timeout,
                api_rank: $scope.updaterAPI.api_rank,
                is_noserver: $scope.updaterAPI.is_noserver,
                business_param: [].concat.apply([],$scope.updaterAPI.busparam.map(r=>{return r.param_name?[r]:[]})),
                return_result: [].concat.apply([],$scope.updaterAPI.result.map(r=>{return r.param_name?[r]:[]})),
                business_error: [].concat.apply([],$scope.updaterAPI.buserror.map(r=>{return r.error_code?[r]:[]})),
                environment_url:!$scope.updaterAPI.api_id?$scope.updaterAPI.environment_url:undefined
            };
            if (!api.call_flag || !api.cat_id || !api.api_title || !api.api_title_en || !api.api_desc || !api.api_desc_en || !api.return_example_xml || !api.return_example_json || !api.test_url || !api.online_url || !api.timeout || !api.api_rank || !api.is_noserver || (api.environment_url && api.environment_url.length ? ![].concat.apply([], api.environment_url.map(r=> {
                    return r.url ? [r] : []
                })).length : 0)) {
                $scope.alert("基本信息不能为空");
                return;
            }
            if (api.call_flag && (api.call_flag == "0") && (!api.return_result || !api.return_result.length)) {
                $scope.alert("全栈模式必须有返回结果");
                return;
            }
            return $rootScope.confirm("系统将保存API设置，您确认要保存吗？", ()=> {
                return $rootScope.ajax("api_save", api, (data)=> {
                    //$scope.reset();
                    /*$rootScope.nextTick(()=>{

                    });*/
                    //$scope.pageIndex = 1;
                    $scope.searcher().then(()=>{
                        $rootScope.nextTick(()=>{
                            if ($scope.mode == 1) {
                                $scope.updaterAPIForm.$setPristine();
                            } else if ($scope.mode == 4) {
                                $scope.updaterFrontEndAPIForm.$setPristine();
                            }
                            $scope.exitMode();
                            $scope.step = 0;
                            $scope.updaterAPI = JSON.parse(JSON.stringify(initialUpdaterAPI));
                        });
                    });
                });
            });
        }
        $scope.checkBasicError = ()=>{
            if($scope.mode == 1){
                return ($scope.updaterAPIForm.api_name.$invalid || $scope.updaterAPIForm.timeout.$invalid || $scope.updaterAPIForm.api_title.$invalid || $scope.updaterAPIForm.api_title_en.$invalid || $scope.updaterAPIForm.api_desc.$invalid || $scope.updaterAPIForm.api_desc_en.$invalid || $scope.updaterAPIForm.return_example_xml.$invalid || $scope.updaterAPIForm.return_example_json.$invalid || $scope.updaterAPIForm.test_url.$invalid || $scope.updaterAPIForm.online_url.$invalid);
            } else if($scope.mode == 4){
                return ($scope.updaterFrontEndAPIForm.api_name.$invalid || $scope.updaterFrontEndAPIForm.timeout.$invalid || $scope.updaterFrontEndAPIForm.api_title.$invalid || $scope.updaterFrontEndAPIForm.api_title_en.$invalid || $scope.updaterFrontEndAPIForm.api_desc.$invalid || $scope.updaterFrontEndAPIForm.api_desc_en.$invalid || $scope.updaterFrontEndAPIForm.return_example_xml.$invalid || $scope.updaterFrontEndAPIForm.return_example_json.$invalid || $scope.updaterFrontEndAPIForm.test_url.$invalid || $scope.updaterFrontEndAPIForm.online_url.$invalid);
            }
            return false;
        }
        $scope.checkEnvironmentError = ()=>{
            if($scope.mode == 1){
                let envs = [];
                if($scope.updaterAPI && $scope.updaterAPI.environment_url && $scope.updaterAPI.environment_url.length){
                    envs = [].concat.apply([],$scope.updaterAPI.environment_url.map((r,i)=>{return $scope.updaterAPIForm[`envurl${i}`].$invalid?[r]:[]}));
                }
                return (envs.length > 0);
            } else if($scope.mode == 4){
                let envs = [];
                if($scope.updaterAPI && $scope.updaterAPI.environment_url && $scope.updaterAPI.environment_url.length){
                    envs = [].concat.apply([],$scope.updaterAPI.environment_url.map((r,i)=>{return $scope.updaterFrontEndAPIForm[`envurl${i}`].$invalid?[r]:[]}));
                }
                return (envs.length > 0);
            }
            return false;
        }

        // 模式2，API排序的功能数据
        $scope.orderSelection = {};
        $scope.orderSelection.panelCat = initCat;
        $scope.orderSelection.panelCatGroup = initGroup;
        $scope.chooseOrderCat = (cat, group)=> {
            $scope.orderSelection.panelCat = cat ? cat : {};
            $scope.orderSelection.panelCatGroup = group ? group : {};
            $scope.sortList();
        }
        $scope.sortList = ()=> {
            return $rootScope.ajax("sort_list", {
                cat_id: $scope.orderSelection.panelCat.cat_id,
                group_id: $scope.orderSelection.panelCatGroup.group_id
            }, (data)=> {
                $scope.originalSortData = JSON.parse(JSON.stringify(data));
                $scope.sortData = data;
            });
        }
        // TODO 业务逻辑需要，批量操作的api_id需要做成@连接的一个字符串
        $scope.sortSave = ()=> {
            if (!$scope.sortData || !$scope.sortData.api_list) {
                $scope.alert("没有可选排序项");
            }
            let apiIDs = $scope.sortData.api_list.map((r)=> {
                return {api_id: r.api_id}
            });
            return $rootScope.ajax("sort_save", {api_list: apiIDs}, (data)=> {
                $scope.searcher().then(()=>{
                    $rootScope.nextTick(()=>{
                        $scope.exitMode();
                    });
                });
            });
        }
        $scope.resetOrder = ()=>{
            return initAPIQ&&initAPIQ.then((data)=> {
                $scope.orderSelection.panelCat = initCat;
                $scope.orderSelection.panelCatGroup = initGroup;
                if($scope.orderSelection.panelCat && $scope.orderSelection.panelCat.cat_id){
                    $scope.sortList();
                }
                return data;
            });
        }
        $scope.resetOrder();
        $scope.exitOrder = ()=>{
            $scope.mode = 0;
            $scope.resetOrder();
        }


        // 模式3，API免审核的功能数据
        $scope.auditFreeSelection = {};
        $scope.auditFreeSelection.panelCat = initCat;
        $scope.auditFreeSelection.panelCatGroup = initGroup;
        $scope.noAuditTableData = [];
        let auditFreeListQ = $rootScope.defer().promise;
        $scope.noAuditResearch = () => {
            $scope.noAuditPageIndex = 1;
            $scope.noAuditPageSize = new Number(10);
        }
        $scope.auditFreeListAPI = ()=> {
            return $rootScope.ajax("noaudit_list", {
                cat_id: $scope.auditFreeSelection.panelCat.cat_id,
                group_id: $scope.auditFreeSelection.panelCatGroup.group_id
            }, (data)=> {
                return data;
            });
        }
        $scope.chooseAuditFreeCat = (cat, group)=> {
            $scope.auditFreeSelection.panelCat = cat ? cat : {cat_id: "", cat_name: "全部分类"};
            if(auditFreeListQ.$$state.status == 0){
                auditFreeListQ = $scope.auditFreeListAPI().then((data)=> {
                    if (data) {
                        $scope.noAuditData = data.data_list.map(r=> {
                            r._checked = (r.apply_flag == "1");
                            return r
                        });
                        $scope.noAuditTotal = data.data_list.length;
                        return data.data_list;
                    }
                    return data;
                });
                auditFreeListQ.then($scope.noAuditResearch);
                return;
            }
            $scope.auditFreeListAPI().then((data)=> {
                if (data) {
                    $scope.noAuditData = data.data_list.map(r=> {
                        r._checked = (r.apply_flag == "1");
                        return r
                    });
                    $scope.noAuditTotal = data.data_list.length;
                    $scope.noAuditResearch();
                }
                return data;
            })
        }

        $scope.resetAuditFree = ()=> {
            $scope.noAuditColumns = [{text: "API名称", name: "api_name", tooltip: true}, {
                text: "API分类",
                name: "cat_name"
            }, {text: "API描述", name: "api_title"}];
            $scope.noAuditBatch = true;
            $scope.auditFreeSelection.panelCat = {cat_id: "", cat_name: "全部分类"};
            //$scope.auditFreeSelection.panelCatGroup = initGroup;
            $scope.noAuditPageIndex = 1;
            $scope.chooseAuditFreeCat();
            //$scope.searcher();
        }
        $scope.resetAuditFree();
        $scope.exitAuditFree = ()=>{
            $scope.mode = 0;
            $scope.resetAuditFree();
        }
        $scope.auditSearcher = (index, size) => {
            return auditFreeListQ.then(data=> {
                if (!data) {
                    return false
                }
                let list = [].concat.apply([], $scope.noAuditData.map((r, i)=> {
                    r._checked = (r.apply_flag == "1");
                    return ((i >= (index - 1) * size) && (i < index * size)) ? [r] : []
                }));
                $scope.noAuditTableData = list;
            });
        }
        $scope.auditFreeSaveAPI = ()=> {
            let apiIDs = [].concat.apply([], $scope.noAuditData.map(r=> {
                return r._checked ? [{api_id: r.api_id}] : []
            }));
            return $rootScope.ajax("noaudit_save", {api_list: apiIDs}, (data)=> {
                auditFreeListQ = $scope.auditFreeListAPI().then((data)=> {
                    if (data) {
                        $scope.noAuditData = data.data_list.map(r=> {
                            r._checked = (r.apply_flag == "1");
                            return r
                        });
                        $scope.noAuditTotal = data.data_list.length;
                        return data.data_list;
                    }
                    return data;
                });
                $scope.exitMode();
            });
        }


        // TODO cache
        $scope.cacheInitAPI = ()=> {
            return $rootScope.ajax("cache_init", {api_id: $scope.tableData._select.api_id}, (data)=> {
                return data;
            })
        }
        $scope.showCache = function (ev) {
            if (!$scope.tableData._select || !$scope.tableData._select.api_id) {
                $rootScope.alert("没有选中一条数据");
                return;
            }
            let getStatus = status=> {
                return (status == "0") ? "关闭" : ((status == "1") ? "已开启" : ((status == "2") ? "申请开启" : ((status == "3") ? "拒绝开启" : ((status == "") ? "无" : "未知"))))
            };
            $scope.cacheInitAPI().then(data=> {
                let CacheController = (scope, $mdDialog)=> {
                    scope.cache_time = data.cache_time?data.cache_time:"0";
                    scope.cache_status = data.cache_status;
                    scope.cache_status_text = getStatus(data.cache_status);
                    scope.cache_time_online = data.cache_time_online?data.cache_time_online:"0";
                    scope.cache_status_online = data.cache_status_online;
                    scope.cache_status_online_text = getStatus(data.cache_status_online);
                    scope.cancel = function () {
                        $mdDialog.hide();
                    };
                    scope.apply = (cache_type, cache_status)=> {
                        if(scope.cacheLoading){
                            return;
                        }
                        scope.cacheLoading = true;
                        return $rootScope.ajax("cache_apply", {
                            cache_type: cache_type,
                            cache_status: cache_status,
                            api_id: $scope.tableData._select.api_id
                        }, (data)=> {
                            return $scope.cacheInitAPI().then(data=> {
                                scope.cache_time = data.cache_time?data.cache_time:"0";
                                scope.cache_status = data.cache_status;
                                scope.cache_status_text = getStatus(data.cache_status);
                                scope.cache_time_online = data.cache_time_online?data.cache_time_online:"0";
                                scope.cache_status_online = data.cache_status_online;
                                scope.cache_status_online_text = getStatus(data.cache_status_online);
                                return data;
                            });
                        }).finally(()=>{
                            scope.cacheLoading = false;
                        });
                    }
                    scope.save = ()=> {
                        if(scope.cacheLoading || scope.cacheForm.$invalid){
                            return;
                        }
                        scope.cacheLoading = true;
                        return $rootScope.ajax("cache_save", {
                            api_id: $scope.tableData._select.api_id,
                            cache_time: scope.cache_time,
                            cache_time_online: scope.cache_time_online
                        }, (data)=> {
                            $mdDialog.hide();
                        }).finally(()=>{
                            scope.cacheLoading = false;
                        });
                    }
                };
                $mdDialog.show({
                    controller: CacheController,
                    template: `<md-dialog aria-label="Mango" class="cache-dialog">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-head">
                                        <h4>设置缓存</h4>
                                        <md-progress-circular md-mode="indeterminate" ng-show="cacheLoading" class="md-primary"></md-progress-circular>
                                    </div>
                                    <div class="md-dialog-content-body">
                                        <form name="cacheForm" autocomplete="off">
                                            <table class="md-datatable">
                                                <thead>
                                                    <tr>
                                                        <th colspan="2">沙箱环境</th>
                                                        <th colspan="2">生产环境</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>缓存状态</td>
                                                        <td>
                                                            <div class="cache-row">
                                                                <span ng-bind="cache_status_text"></span>
                                                                <md-button ng-if="(cache_status == '0') || (cache_status == '3')" ng-click="apply('0','2')" class="md-raised text line" aria-label="data control" ng-disabled="cacheLoading" ><span>启动</span></md-button>
                                                                <md-button ng-if="cache_status == '1'" ng-click="apply('0','0')" class="md-raised text line" aria-label="data control" ng-disabled="cacheLoading" ><span>关闭</span></md-button>
                                                            </div>
                                                        </td>
                                                        <td>缓存状态</td>
                                                        <td>
                                                            <div class="cache-row">
                                                                <span ng-bind="cache_status_online_text"></span>
                                                                <md-button ng-if="(cache_status_online == '0') || (cache_status_online == '3')" ng-click="apply('1','2')" class="md-raised text line" aria-label="data control" ng-disabled="cacheLoading" ><span>启动</span></md-button>
                                                                <md-button ng-if="cache_status_online == '1'" ng-click="apply('1','0')" class="md-raised text line" aria-label="data control" ng-disabled="cacheLoading" ><span>关闭</span></md-button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>缓存时间</td>
                                                        <td><div class="cache-row"><input type="text" id="sandbox_cache" name="sandbox_cache" ng-model="cache_time" pattern="^([1-9]\\d{0,5}|0)$" ng-disabled="!cache_status" required/><label for="sandbox_cache">分钟</label></div></td>
                                                        <td>缓存时间</td>
                                                        <td><div class="cache-row"><input type="text" id="production_cache" name="production_cache" ng-model="cache_time_online" pattern="^([1-9]\\d{0,5}|0)$" ng-disabled="!cache_status_online" required/><label for="production_cache">分钟</label></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="cancel()">
                                    取消
                                  </md-button>
                                  <md-button ng-click="save()" ng-disabled="cacheLoading">
                                    保存
                                  </md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                    /*parent: angular.element(document.body),*/
                    targetEvent: ev,
                    clickOutsideToClose: true
                    //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                }).then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
            });
        };


        let modeInfo = [
            {title:"API列表", cancelFunction: $scope.reset, desc:"您可以使用API列表模块管理供应商API，更改API状态，为API添加缓存功能等"},
            {title:"API详情", cancelFunction: $scope.cancelStep, desc:"您可以使用API详情模块添加和修改供应商API"},
            {title:"API排序", cancelFunction: $scope.exitOrder, desc:"您可以使用API排序模块对API进行排序"},
            {title:"API免审核", cancelFunction: $scope.exitAuditFree, desc:"您可以使用API免审核模块管理免审核型API"},
            {title:"API详情(前端)", cancelFunction: $scope.cancelStep, desc:"您可以使用API详情模块添加和修改供应商API"},
        ];
        $scope.getModeInfo = ()=>{
            if(typeof $scope.mode == "number"){
                return modeInfo[$scope.mode]
            } else{
                return modeInfo[0]
            }
        }

        $scope.appendRow = (row, list) => {
            list.push(row ? row : {})
        };
        $scope.removeRow = (row, list) => {
            list.splice(list.indexOf(row), 1);
        };
        window.test = ()=> {
            console.log($scope);
            return $scope;
        }
        $scope.$on('$viewContentLoaded',
                event => {

            });
    }]);
applicationApp.controller('FrameCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $http, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "frame";
        $scope.message = $stateParams.error;
        $scope.$on('$viewContentLoaded', event => {
            //$('#mainFrameWrapper').animate({scrollTop: 0});
            //$("#mainFrameWrapper")[0].innerHTML = `<iframe id="mainFrame" src=/frame/${url} scrolling="no" width="100%" style="min-height:800px;" noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" class=""></iframe>`;
        });
    }]);
applicationApp.controller('DomainCtrl', ['$rootScope', '$scope', '$http','$stateParams', '$location', '$mdDialog', '$q',
    ($rootScope, $scope, $http, $stateParams, $location, $mdDialog, $q) => {
        $rootScope.tab = "domain";
        $rootScope.validateEntry();

        // TODO 石奇峰邀请您来维护以下代码，以下代码分为4大部分，domain列表操作部，domain修改部，domain排序部, 1个页内弹窗,日志
        $scope.mode = 0;
        $scope.enterMode = (mode, cb)=> {
            $scope.mode = mode;
            cb && cb.call();
        }
        $scope.exitMode = (cb)=> {
            $scope.mode = 0;
            cb && cb.call();
        }
        $scope.toggleFilterPanel = (e)=> {
            $scope.showFilterPanel = !$scope.showFilterPanel;
            $scope.showBatchPanel = false;
        }

        // 主页面的功能数据
        $scope.panelSelection = {};
        let initCat = {cat_id: "", cat_name: "全部分类"}, initGroup = {
            group_id: "",
            group_name: ""
        }, initStatus = {status_id: "", status_name: "全部状态"};
        $scope.reset = ()=> {
            $scope.panelSelection.panelCat = {cat_id: "", cat_name: "全部分类"};
            $scope.panelSelection.panelCatGroup = {group_id: "",group_name: ""};
            $scope.panelSelection.panelStatus = initStatus;
            $scope.panelSelection.sorter = {name: "", sort: "1"};
            $scope.columns = [{text: "结构名称", name: "domain_name", tooltip: true, sort: "1"}, {
                text: "结构标题",
                name: "domain_title",
                tooltip: true
            }, {text: "结构类型", name: "cat_name", style: {width: "128px", 'text-align': "center"}}, {
                text: "状态",
                name: "status_name",
                style: {width: "96px", 'text-align': "center"}
            }, {
                text: "是否上线",
                name: "online_flag",
                formatter: flag=>{return (flag == "1")?"已上线":"未上线"},
                style: {width: "128px", 'text-align': "center"}
            }, {
                text: "添加时间",
                name: "create_time",
                sort: "1",
                style: {width: "160px", 'text-align': "center"}
            }];
            $scope.keyword = "";
            $scope.batch = false;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        $scope.reset();
        $scope.chooseCat = (cat, group)=> {
            $scope.panelSelection.panelCat = cat ? cat : {cat_id: "", cat_name: "全部分类"};
            $scope.panelSelection.panelCatGroup = group ? group : initGroup;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        $scope.chooseStatus = (status)=> {
            $scope.panelSelection.panelStatus = status ? status : {status_id: "", status_name: "全部状态"};;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
            //$scope.searcher();
        }
        //$scope.pageSize = 10;
        $scope.searcher = (index, size) => {
            $scope.refreshing = true;
            return $rootScope.ajax("domain_list", {
                pageindex: index ? index : $scope.pageIndex,
                pagesize: size ? size : $scope.pageSize,
                domain_name: $scope.keyword,
                cat_id: $scope.panelSelection.panelCat.cat_id,
                group_id: $scope.panelSelection.panelCatGroup.group_id,
                status: $scope.panelSelection.panelStatus.status_id,
                sort_name: ($scope.panelSelection.sorter.name == "create_time")?"rx_insertTime":$scope.panelSelection.sorter.name,
                sort_flag: $scope.panelSelection.sorter.sort,
            }, (data)=> {
                if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                    $scope.tableData = data.data_list;
                    $scope.total = data.list_count;
                } else {
                    $rootScope.alert(data.msg);
                    $scope.total = 0;
                }
            }, ()=>{
                $scope.total = 0;
            }).finally(()=>{
                $scope.refreshing = false;
            });
        }
        $scope.tableData = [];
        $scope.research = () => {
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
        }
        let mainQ = $rootScope.ajax("init", (data)=> {
            $scope.originalPanel = JSON.parse(JSON.stringify(data));
            $scope.panel = data;
        });
        $scope.canVisistDomain = ()=> {
            return $scope.tableData && $scope.tableData._select
        };
        $scope.canInsertDomain = ()=> {
            return $scope.panel && ($scope.panel.role_list.btnInsert == "1")
        };
        $scope.canUpdateDomain = (domain)=> {
            if (!domain || ($scope.panel && ($scope.panel.role_list.btnUpdate == "0")) || (domain.is_old == "1")) {
                return false
            }
            // 流程已变化，任何状态下都可修改
            return true;
            //return ((domain.status == "0") || (domain.status == "2") || (domain.status == "3"));
        }
        $scope.canApplyPromoteDomain = (domain)=> {
            if (!domain || ($scope.panel && ($scope.panel.role_list.btnApplyApi == "0")) || (domain.is_old == "1")) {
                return false
            }
            // 由于申请修改状态已被废弃，故撤销申请修改下申请上线的操作
            return ((domain.status == "2") || (domain.status == "5"));
            //return ((domain.status == "1") || (domain.status == "5"));
        }
        $scope.canRecallDomain = (domain)=> {
            if (!domain || ($scope.panel && ($scope.panel.role_list.btnCancel == "0")) || (domain.cancel_flag == "0") || (domain.is_old == "1")) {
                return false
            }
            return ((domain.status == "2") || (domain.status == "4") || (domain.status == "5"));
        }
        $scope.canDeleteDomain = (domain)=> {
            if (!domain || ($scope.panel && ($scope.panel.role_list.btnDelete == "0")) || (domain.is_old == "1")) {
                return false
            }
            return true;
        }
        $scope.deleteDomain = ($event,row) => {
            if(row.names && row.names.length) {
                let InuseController = (scope, $mdDialog, apis)=> {
                    scope.apis = apis;
                    let hasAPI = false, hasDomain = false;
                    scope.apis && scope.apis.length && scope.apis.forEach(r=>{r&&r.name&&((r.name.indexOf(".") == -1)?(hasDomain=true):(hasAPI=true))});
                    if(hasAPI){
                        if(hasDomain){
                            scope.hint = "有如下API和其他结构正在使用该结构";
                        } else {
                            scope.hint = "有如下API正在使用该结构";
                        }
                    } else if(hasDomain){
                        scope.hint = "有其他结构正在使用该结构";
                    } else {
                        scope.hint = "有如下对象正在使用该结构";
                    }
                    scope.closeDialog = () => {$mdDialog.hide()};
                },  showInuse = (apis) => {
                    $mdDialog.show({
                        controller: InuseController,
                        template: `<md-dialog aria-label="Mango (Fruit)" style="width: 512px">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-body">
                                        <p>操作失败</p>
                                        <p ng-bind="hint"></p>
                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>
                                        <p>请取消关联后再删除</p>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="closeDialog()">确定</md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                        targetEvent: $event,
                        /*parent: angular.element(document.body),*/
                        parent: angular.element(document.querySelector('body>section>md-content')),
                        //clickOutsideToClose: true,
                        locals: {apis: row.names}
                    });
                };
                showInuse(row.names);
                return ;
            }
            return $rootScope.ajax("domain_delete", {domain_id: row.domain_id}, (data)=> {
                $scope.research();
            });
        }
        $scope.applyDomain = (row,status) => {
            // 该接口只有0 申请修改， 1 申请上线 2种
            return $rootScope.ajax("domain_apply", {domain_id: row.domain_id,apply_status: status}, (data)=> {
                $scope.searcher();
                $rootScope.alert("操作成功");
                return data;
            });
        }
        $scope.cancelDomain = (row) => {
            return $rootScope.ajax("domain_cancel", {domain_id: row.domain_id}, (data)=> {
                $scope.searcher();
                $rootScope.alert("撤销成功");
            });
        }
        /*$scope.dumpDomain = ()=> {
            return $rootScope.ajax("domain_dump", {api_id: row.domain_id}, (data)=> {
                $scope.research();
                $rootScope.alert("废弃成功");
            });
        }*/


        // 模式1，修改，添加domain的功能数据
        let initialUpdaterDomain = {
            domain_name: "",
            domain_rank:"0",
            domain_title:"",
            domain_title_en:"",
            domain_desc:"",
            domain_desc_en:"",
            property: [{}, {}, {}, {}, {}]
        }, initialSteps = [{name: "基本信息"}, {name: "属性信息"}], initialClientSteps = [{name: "基本信息"}, {name: "错误代码"}],initDomainQ;
        $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
        $scope.camelCharcodes = [...[...Array(26).keys()].map(r=>{return r + 65})];
        $scope.step = 0;
        $scope.steps = initialSteps;
        $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
        $scope.initDomain = (row) => {
            return $rootScope.ajax("domain_init", {}, (data)=> {
                $scope.domainInit = data;
                if ($scope.domainInit && $scope.domainInit.cat_list && $scope.domainInit.cat_list[0]) {
                    initCat = $scope.domainInit.cat_list[0];
                    if ($scope.domainInit.cat_list[0].group_list && $scope.domainInit.cat_list[0].group_list[0]) {
                        initGroup = $scope.domainInit.cat_list[0].group_list[0];
                    }
                } else {
                    return $q.reject("该账号暂无任何可操作的API分类，请完成审核流程并添加API分类")
                }
            });
        };
        initDomainQ = $scope.initDomain();
        $scope.addDomainMode = (mode) => {
            initDomainQ && initDomainQ.then(data=> {
                $scope.mode = mode;
                $scope.updaterSelection.panelCat = initCat;
                $scope.updaterSelection.panelCatGroup = initGroup;
                ($scope.step != 0) && ($scope.step = 0);
                $scope.steps = initialSteps;
                $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                    $scope.propertyDataTypes = data.data_type_list
                });
            },e=>{$rootScope.alert(e)});
        }
        $scope.updateDomainMode = ($event,forView) => {
            $scope.updaterDomain.domain_id = "fake";
            if (!$scope.tableData._select || !$scope.tableData._select.domain_id) {
                $rootScope.alert("用户没有选择一条结构");
                return;
            }
            let updater = ()=>{
                return initDomainQ && initDomainQ.then(data=> {
                    if (!$scope.domainInit || !$scope.domainInit.cat_list) {
                        $rootScope.alert("结构没有分类信息");
                        return;
                    }
                    return $rootScope.ajax("domain_info", {domain_id: $scope.tableData._select.domain_id}, (data)=> {
                        $scope.mode = 1;
                        $scope.steps = initialSteps;
                        ($scope.step != 0) && ($scope.step = 0);
                        $scope.originalUpdaterDomain = JSON.parse(JSON.stringify(data.domain_info));
                        angular.extend($scope.updaterDomain,data.domain_info);
                        forView && ($scope.updaterDomain._forView = forView);
                        $scope.updaterSelection.panelCat = [].concat.apply([], $scope.domainInit.cat_list.map(r=> {
                            return (r.cat_id == $scope.updaterDomain.cat_id) ? [r] : []
                        }))[0];
                        (!$scope.updaterSelection.panelCat || !$scope.updaterSelection.panelCat.cat_id) && ($scope.updaterSelection.panelCat = initCat);
                        $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                            $scope.propertyDataTypes = data.data_type_list
                        });
                    })
                });
            },  InuseController = (scope, $mdDialog, apis)=> {
                scope.apis = apis;
                let hasAPI = false, hasDomain = false;
                scope.apis && scope.apis.length && scope.apis.forEach(r=>{r&&r.name&&((r.name.indexOf(".") == -1)?(hasDomain=true):(hasAPI=true))});
                if(hasAPI){
                    if(hasDomain){
                        scope.hint = "有如下API和其他结构正在使用该结构";
                    } else {
                        scope.hint = "有如下API正在使用该结构";
                    }
                } else if(hasDomain){
                    scope.hint = "有其他结构正在使用该结构";
                } else {
                    scope.hint = "有如下对象正在使用该结构";
                }
                scope.loadidng = false;
                scope.confirmUpdate = () => {
                    scope.loadidng = true;
                    // 后台更新和详情获取可以同时进行
                    $rootScope.ajax("domain_status_apply", {domain_id: $scope.tableData._select.domain_id}, updater).then(()=>{$scope.searcher();}).then(()=>{
                        scope.loadidng = false;
                        $mdDialog.hide();
                    });
                };
                scope.closeDialog = () => {
                    $scope.updaterDomain.domain_id = "";
                    $mdDialog.hide()
                };
            },  showInuse = (apis) => {
                $mdDialog.show({
                    controller: InuseController,
                    template: `<md-dialog aria-label="Mango (Fruit)" style="width: 512px">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-body">
                                        <md-progress-circular md-mode="indeterminate" ng-show="loadidng" class="md-primary" style="position:absolute;top: 16px;left: 16px;"></md-progress-circular>
                                        <p ng-bind="hint"></p>
                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>
                                        <p>您确认要进行修改吗</p>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="closeDialog()">取消</md-button>
                                  <md-button ng-click="confirmUpdate()">确定</md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                    targetEvent: $event,
                    /*parent: angular.element(document.body),*/
                    parent: angular.element(document.querySelector('body>section>md-content')),
                    //clickOutsideToClose: true,
                    locals: {apis: apis}
                });
            };

            if(forView){
                updater.call();
                return;
            }
            if($scope.tableData._select){
                if($scope.tableData._select.status == "0"){
                    if($scope.tableData._select.names && $scope.tableData._select.names.length){
                        showInuse($scope.tableData._select.names);
                    } else {
                        updater.call();
                    }
                } else {
                    updater.call();
                }/*else if ($scope.tableData._select.status == "2"){
                    updater.call();
                } else if ($scope.tableData._select.status == "3"){
                    showInuse($scope.tableData._select.names);
                }*/
            }
            return false;

        };
        //$scope.toggleMdCheck = (obj, prop)=>{obj[prop] = (obj[prop] === undefined)?undefined:((obj[prop] == "0")?"1":"0");}
        $scope.nextStep = ()=> {
            if ($scope.updaterDomain._forView) {($scope.step < 3) && $scope.step++;return;}
            if ($scope.updaterDomainForm.$invalid) {$scope.updaterDomainForm.$error.required && $scope.updaterDomainForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
            ($scope.step < 1) && $scope.step++;
        }
        $scope.previousStep = ()=> {($scope.step > 0) && $scope.step--;}
        $scope.cancelStep = ()=> {
            $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
            $scope.updaterDomainForm.$setPristine();
            $scope.mode = 0;
            $scope.step = 0;
            $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
        }
        $scope.chooseUpdaterCat = (cat, group)=> {
            $rootScope.confirm("修改结构类别会导致 [结构属性信息] 类型中含有结构属性的数据清空，确定修改结构类别吗", ()=> {
                $scope.updaterSelection.panelCat = cat ? cat : initCat;
                $scope.updaterDomain.cat_id = $scope.updaterSelection.panelCat.cat_id;
                if ($scope.updaterSelection.panelCat.group_list && $scope.updaterSelection.panelCat.group_list[0]) {
                    $scope.updaterSelection.panelCatGroup = $scope.updaterSelection.panelCat.group_list[0];
                }
                $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                    $scope.propertyDataTypes = data.data_type_list
                });
            });
        }
        $scope.chooseUpdaterGroup = (group)=> {
            $scope.updaterSelection.panelCatGroup = group ? group : initGroup;
            $scope.updaterDomain.group_id = $scope.updaterSelection.panelCatGroup.group_id;
        }
        $scope.processPropertyDataType = (data_type, property)=> {
            let systemDataTypes = $scope.domainInit.data_type_list.map(r=> {
                return r.data_type
            });
            property._customized = (systemDataTypes.indexOf(data_type) == -1);
            (data_type != property.pro_type) && (property.pro_type = data_type);
            if (property._customized) {
                let pro_name;
                if (property.is_list == "1") {
                    pro_name = property.pro_type ? `${property.pro_type.toLowerCase()}s` : "";
                    let second_pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                    (property.second_node != second_pro_name) && (property.second_node = second_pro_name);
                } else {
                    pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                    (property.second_node != "") && (property.second_node = "");
                }
                (property.pro_name != pro_name) && (property.pro_name = pro_name);
                (property.first_node != pro_name) && (property.first_node = pro_name);
            } else {
                property.is_list = "0";
                property.first_node = "";
                property.second_node = "";
            }
        }
        $scope.processListCheck = (property)=> {
            if (!property._customized) {
                return;
            }
            $rootScope.nextTick(()=> {
                let pro_name;
                if (property.is_list == "1") {
                    pro_name = property.pro_type ? `${property.pro_type.toLowerCase()}s` : "";
                    let second_pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                    (property.second_node != second_pro_name) && (property.second_node = second_pro_name);
                } else {
                    pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                    (property.second_node != "") && (property.second_node = "");
                }
                (property.pro_name != pro_name) && (property.pro_name = pro_name);
                (property.first_node != pro_name) && (property.first_node = pro_name);
            });
        }
        $scope.saveDomain = ()=> {
            if (!$scope.updaterDomain) {
                $scope.alert("没有初始化数据");
                return;
            }
            if ($scope.updaterDomainForm.$invalid) {$scope.updaterDomainForm.$error.required && $scope.updaterDomainForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
            let domain = angular.extend({cat_id: $scope.updaterSelection.panelCat.cat_id,domain_property: [].concat.apply([],$scope.updaterDomain.property.map(r=>{return r.pro_name?[r]:[]}))},$scope.updaterDomain);
            domain.property && (delete domain.property);
            if (!domain.cat_id || !domain.domain_name || !domain.domain_title || !domain.domain_title_en || !domain.domain_desc || !domain.domain_desc_en || !domain.domain_rank) {
                $scope.alert("基本信息不能为空");
                return;
            }
            return $rootScope.confirm("系统将保存结构设置，您确认要保存吗", ()=> {
                return $rootScope.ajax("domain_save", domain, (data)=> {
                    //$scope.research();
                    $scope.searcher();
                    $rootScope.nextTick(()=>{
                        $scope.exitMode();
                        $scope.step = 0;
                        $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
                        $scope.updaterDomainForm.$setPristine();
                    });
                });
            });
        }

        // 模式2，API排序的功能数据
        $scope.orderSelection = {};
        $scope.orderSelection.panelCat = initCat;
        $scope.orderSelection.panelCatGroup = initGroup;
        $scope.chooseOrderCat = (cat, group)=> {
            $scope.orderSelection.panelCat = cat ? cat : {};
            $scope.orderSelection.panelCatGroup = group ? group : {};
            $scope.sortList();
        }
        $scope.sortList = ()=> {
            return $rootScope.ajax("sort_list", {
                cat_id: $scope.orderSelection.panelCat.cat_id,
                group_id: $scope.orderSelection.panelCatGroup.group_id
            }, (data)=> {
                $scope.originalSortData = JSON.parse(JSON.stringify(data));
                $scope.sortData = data;
            });
        }
        // TODO 业务逻辑需要，批量操作的api_id需要做成@连接的一个字符串
        $scope.sortSave = ()=> {
            if (!$scope.sortData || !$scope.sortData.data_list) {
                $scope.alert("没有可选排序项");
            }
            let domainIDs = $scope.sortData.data_list.map((r)=> {
                return {domain_id: r.domain_id}
            });
            return $rootScope.ajax("sort_save", {domain_list: domainIDs}, (data)=> {
                $scope.enterMode(0);
            });
        }
        $scope.resetOrder = ()=>{
            return initDomainQ&&initDomainQ.then((data)=> {
                    $scope.orderSelection.panelCat = initCat;
                    $scope.orderSelection.panelCatGroup = initGroup;
                    $scope.sortList();
                    return data;
                });
        }
        $scope.resetOrder();
        $scope.exitOrder = ()=>{
            $scope.mode = 0;
            $scope.resetOrder();
        }

        let modeInfo = [
            {title:"结构列表", cancelFunction: $scope.reset},
            {title:"结构详情", cancelFunction: $scope.cancelStep},
            {title:"结构排序", cancelFunction: $scope.exitOrder},
        ];
        $scope.getModeInfo = ()=>{
            if(typeof $scope.mode == "number"){
                return modeInfo[$scope.mode]
            } else{
                return modeInfo[0]
            }
        }

        $scope.appendRow = (row, list) => {
            list.push(row ? row : {})
        };
        $scope.removeRow = (row, list) => {
            list.splice(list.indexOf(row), 1);
        };
        window.test = ()=> {
            console.log($scope);
            return $scope;
        }
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('AppCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "app";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('ISVAppCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "isvApp";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('EnvironmentCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "env";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('APIFlowCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "flow";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('APICautionCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "caution";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('CategoryCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "category";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('CategoryGroupCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "group";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('NoApplyCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "noapply";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('AuthorityCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "auth";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('MailCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "mail";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('PingCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "ping";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('SandboxLogAssistCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "assist_sandbox";
        $rootScope.validateEntry();

        let modeArray = [{id:1,tab:0},{id:2,tab:0},{id:3,tab:0}], barChartConfig = {
            type: 'bar',
            data: {
                labels: ["114.132.134.13", "114.132.134.14", "114.132.134.15", "114.132.134.16", "114.132.134.17", "114.132.134.18", "114.132.134.19","114.132.134.20","114.132.134.21","114.132.134.22"],
                datasets: [
                    {
                        label: "调用次数",
                        backgroundColor: ['rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)','rgba(0,197,163,0.4)'],
                        hoverBackgroundColor: ['#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3','#00C5A3'],
                        //borderColor: [1,1,1,1,1,1,1,1,1,1],
                        //borderColor:["#009178","#009178","#009178","#009178","#009178","#009178","#009178","#009178","#009178","#009178"],
                        data: [650, 590, 800, 810, 560, 550, 400,330, 900,660],
                    },
                    {
                        label: "成功次数",
                        backgroundColor: ['rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)','rgba(0,145,120,0.4)'],
                        hoverBackgroundColor: ['#009178','#009178','#009178','#009178','#009178','#009178','#009178','#009178','#009178','#009178'],
                        data: [350, 490, 600, 510, 260, 350, 200,100,700,600],
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                //responsiveAnimationDuration: 400,
                legend: {
                    display:false
                },
                title: {
                    display: true,
                    text: '调用数',
                    fontSize: 14
                },
                elements: {
                    rectangle: {
                        borderWidth: 1.5,
                        borderColor: '#009178',
                        borderSkipped: 'bottom'
                    }
                },
                hover:{
                    mode:"single",
                    animationDuration:400
                },
                animation:{
                    duration:400,
                    easing:"easeOutQuart",
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            maxTicksLimit: 5
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                            //stepSize: 50
                        },
                        //barPercentage:0.99,
                        gridLines:{
                            //drawOnChartArea:false,
                        }
                    }]
                }
            }
        }, lineChartConfig = {
            type: 'line',
            data: {
                labels: ["7:00","8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00","15:00","16:00","17:00"],
                datasets: [{
                    label: "实时调用量",
                    data: [5,10,12,10,20,15,50,30,40,35,50],
                    borderWidth: 2,
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    fill: true,
                    lineTension: 0.1,
                    pointRadius: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    pointHoverRadius: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                    pointBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointBorderWidth: 1,

                    pointBackgroundColor: "#009178",
                    pointHitRadius: 3.5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                showLines: true,
                title: {
                    display: true,
                    text: '实时调用量',
                    fontColor:"#fff"
                },
                legend: {
                    display:false
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {}
                },
                hover: {
                    mode: 'single'
                },
                /*chartArea: {
                    backgroundColor: '#009178'
                },*/
                scales: {
                    xAxes: [{
                        id: 'x-axis-0',
                        gridLines: {
                            display: true,
                            lineWidth: 1,
                            color: "rgba(255,255,255,0.3)",
                            zeroLineWidth: 0,
                            zeroLineColor:"rgba(255,255,255,0)",
                        },
                        ticks: {
                            fontColor: "#fff",
                            //beginAtZero: true,
                        }
                    }],
                    yAxes: [{
                        id: 'y-axis-0',
                        display:true,
                        ticks: {
                            //beginAtZero:true,
                            maxTicksLimit: 5,
                            beginAtZero:true,
                            fontColor: "#fff",
                        },
                        gridLines:{
                            //color: "rgba(255,255,255,0.2)"
                            display: true,
                            lineWidth: 1,
                            color: "rgba(255,255,255,0.3)",
                            zeroLineWidth: 0,
                            zeroLineColor:"rgba(255,255,255,0)",
                        }
                    }]
                }
            }
        };
        $scope.selectMode = (mode)=>{
            $scope.mode = modeArray[mode - 1];
            $scope.listAPI();
        }
        $scope.listAPI = () => {
            return $rootScope.ajax("api_list", {
                search_type:$scope.mode.id,
                search_begin: $scope.mindate.Format("yyyy-MM-dd"),
                search_end: $scope.maxdate.Format("yyyy-MM-dd"),
                api_name : $scope.api_name,
                user_id: $scope.user_id,
                app_id: $scope.app_id
            }, (data)=> {
                $scope.log_list = data.log_list;
                $scope.log_summary = {callcount:0,successcount:0,failcount:0,sysfailcount:0,averagetime:0,avgroptime:0,avgsuppliertime:0,f_success_num:0,f_faild_num:0,f_num:0,a_success_num:0,a_faild_num:0,a_num:0,b_success_num:0,b_faild_num:0,b_num:0,c_success_num:0,c_faild_num:0,c_num:0,d_success_num:0,d_faild_num:0,d_num:0,e_success_num:0,e_faild_num:0,e_num:0};
                $scope.log_list.forEach(r=>{
                    $scope.log_summary.callcount        += Number.parseInt(r.callcount);
                    $scope.log_summary.successcount     += Number.parseInt(r.successcount);
                    $scope.log_summary.failcount        += Number.parseInt(r.failcount);
                    $scope.log_summary.sysfailcount     += Number.parseInt(r.sysfailcount);
                    $scope.log_summary.averagetime      += Number.parseFloat(r.averagetime)/$scope.log_list.length;
                    $scope.log_summary.avgroptime       += Number.parseFloat(r.avgroptime)/$scope.log_list.length;
                    $scope.log_summary.avgsuppliertime  += Number.parseFloat(r.avgsuppliertime)/$scope.log_list.length;
                    $scope.log_summary.f_success_num    += Number.parseInt(r.f_success_num);
                    $scope.log_summary.f_faild_num      += Number.parseInt(r.f_faild_num);
                    $scope.log_summary.f_num            += Number.parseInt(r.f_num);
                    $scope.log_summary.a_success_num    += Number.parseInt(r.a_success_num);
                    $scope.log_summary.a_faild_num      += Number.parseInt(r.a_faild_num);
                    $scope.log_summary.a_num            += Number.parseInt(r.a_num);
                    $scope.log_summary.b_success_num    += Number.parseInt(r.b_success_num);
                    $scope.log_summary.b_faild_num      += Number.parseInt(r.b_faild_num);
                    $scope.log_summary.b_num            += Number.parseInt(r.b_num);
                    $scope.log_summary.c_success_num    += Number.parseInt(r.c_success_num);
                    $scope.log_summary.c_faild_num      += Number.parseInt(r.c_faild_num);
                    $scope.log_summary.c_num            += Number.parseInt(r.c_num);
                    $scope.log_summary.d_success_num    += Number.parseInt(r.d_success_num);
                    $scope.log_summary.d_faild_num      += Number.parseInt(r.d_faild_num);
                    $scope.log_summary.d_num            += Number.parseInt(r.d_num);
                    $scope.log_summary.e_success_num    += Number.parseInt(r.e_success_num);
                    $scope.log_summary.e_faild_num      += Number.parseInt(r.e_faild_num);
                    $scope.log_summary.e_num            += Number.parseInt(r.e_num);
                });
                $scope.log_summary.successrate      = (100*$scope.log_summary.successcount/$scope.log_summary.callcount).toFixed(4);
                // failrate是 路由拦截率占总数比，而不是总失败率
                $scope.log_summary.failrate         = (100*$scope.log_summary.sysfailcount/$scope.log_summary.callcount).toFixed(4);
                $scope.log_summary.sysfailrate      = (100*$scope.log_summary.sysfailcount/$scope.log_summary.failcount).toFixed(4);

                $scope.log_summary.averagetime      = $scope.log_summary.averagetime.toFixed(4);
                $scope.log_summary.avgroptime       = $scope.log_summary.avgroptime.toFixed(4);
                $scope.log_summary.avgsuppliertime  = $scope.log_summary.avgsuppliertime.toFixed(4);
            });
        }
        $scope.showAPI = () => {
            return $rootScope.ajax("api_list", {
                search_type:$scope.mode.id,
                search_begin: $scope.mindate.Format("yyyy-MM-dd"),
                search_end: $scope.maxdate.Format("yyyy-MM-dd"),
                api_name : $scope.mode.log.content,
                user_id: $scope.user_id,
                app_id: $scope.app_id
            }, (data)=> {
                if(data && data.log_list && data.log_list.length){
                    $scope.mode.log = data.log_list[0];
                }
            });
        }
        $scope.reset = ()=> {
            $scope.now = new Date();
            $scope.mindate = new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate() - 1);
            $scope.maxdate = new Date();
            $scope.mode = modeArray[0];
            $scope.user_type = 0;
            $scope.api_name = "";
            $scope.user_id = "";
            $scope.app_id = "";

            $scope.listAPI();
        };


        $scope.enterDetail = log=>{
            $scope.mode.log = log;
            //$scope.mode.tab = 0;
            $scope.mode.showingDetail = true;
            $rootScope.nextTick(()=>{
                $scope.barChart && $scope.barChart.destroy();
                $scope.lineChart && $scope.lineChart.destroy();
                $scope.lineChart1 && $scope.lineChart1.destroy();

                var ctx = angular.element(".hero-canvas canvas")[0].getContext("2d");
                $scope.barChart = new Chart(ctx, barChartConfig);
                var ctx1 = angular.element(".line-canvas canvas")[0].getContext("2d");
                $scope.lineChart = new Chart(ctx1, lineChartConfig);
                var ctx2 = angular.element(".line-canvas canvas")[1].getContext("2d");
                $scope.lineChart1 = new Chart(ctx2, lineChartConfig);
            });
        }
        $scope.toggleMagnify = ()=>{
            if(!$scope.mode.cta){
                $scope.mode.cta = true;
                $rootScope.nextTick(()=>{
                    var myCta = window.cta(angular.element(".visible-content .line-canvas canvas")[0], angular.element(".visible-content .line-canvas canvas")[1],()=>{
                        angular.element(".shifter.floating").addClass('show');
                    }), catWrapper = ()=>{
                        angular.element(".shifter.floating").removeClass('show');
                        myCta.call();
                    };
                    $scope.mode.cta = catWrapper;
                });
            } else {
                $scope.mode.cta.call();
                $rootScope.nextTick(()=>{
                    $scope.mode.cta = null;
                });
            }

        }
        $scope.exitDetail = mode=>{
            $scope.barChart && $scope.barChart.destroy();
            $scope.lineChart && $scope.lineChart.destroy();
            $scope.lineChart1 && $scope.lineChart1.destroy();

            $scope.mode.showingDetail = false;
            $scope.mode.cta = null;
            $scope.mode.log = null;
            $scope.mode = modeArray[0];
            /*$rootScope.nextTick(()=>{
            });*/
        }
        $scope.reset();
        $scope.expandRow = log=>{
            log._expand_status = 2;
            $scope.mode.expanding = true;
        }
        $scope.collapseRow = log=>{
            log._expand_status = null;
            $scope.mode.expanding = false;
        }
        window.test = ()=>{return $scope};
        $scope.$on('$viewContentLoaded', event => {

        });
        $scope.$on("$destroy", event => {
            $scope.barChart && $scope.barChart.destroy();
            $scope.lineChart && $scope.lineChart.destroy();
            $scope.lineChart1 && $scope.lineChart1.destroy();
        });
    }]);
applicationApp.controller('LogAssistCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "assist";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('SandboxLogAnalysisCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "analysis_sandbox";
        $rootScope.validateEntry();

        let pageTotal = 999999;
        $scope.reset = ()=> {
            //$scope.keyword = "";
            $scope.keywordArray=[""];
            $scope.nextRowkey = "";
            $scope.pageIndex = 1;
            $scope.pageIndexClone = 1;
            $scope.pageSize = new Number(10);
            $scope.pageTotal = 999999;
            $scope.infinite = true;
            $scope.hasNext = true;
            $scope.searchdate = new Date();
            $scope.endtime = $scope.searchdate.Format("HH:mm:ss");
            $scope.begintime = new Date(new Date().setHours(Math.max($scope.searchdate.getHours() - 1, 0))).Format("HH:mm:ss");
            // 只能是60天之内的搜索
            $scope.mindate = new Date($scope.searchdate.getFullYear(), $scope.searchdate.getMonth(), $scope.searchdate.getDate() - 60);
            $scope.maxdate = new Date();

            $scope.hasNext = true;
        }
        $scope.searcher = (index, size) => {
            let rowkey = index?((index > $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone]:((index < $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone - 2]:$scope.keywordArray[$scope.pageIndexClone - 1])):$scope.keywordArray[$scope.pageIndexClone - 1],
                pageindex = index ? index : $scope.pageIndex;
            if($scope.refreshing || (pageTotal < pageindex)){
                $rootScope.nextTick(()=>{($scope.pageIndex!= $scope.pageIndexClone) && ($scope.pageIndex = $scope.pageIndexClone);});
                return;
            }
            $scope.refreshing = true;
            return $rootScope.ajax("list", {
                pageindex: pageindex,
                keyword: $scope.keyword,
                searchdate: $scope.searchdate.Format("yyyy-MM-dd"),
                begintime: $scope.begintime,
                endtime: $scope.endtime,
                rowkey: rowkey
            }, (data)=> {
                if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true')) || data.log_list) {
                    $scope.tableData = data.log_list;
                    if(data.rowkey){
                        if((pageindex >= $scope.pageIndexClone) && (data.rowkey > $scope.nextRowkey)){
                            $scope.keywordArray.push(data.rowkey);
                        } else if ((pageindex <= $scope.pageIndexClone)  && (data.rowkey < $scope.nextRowkey)){
                            $scope.keywordArray && ($scope.keywordArray.length > 2)?$scope.keywordArray.splice(pageindex):$scope.keywordArray.splice(1);
                        }
                    }
                    if(data.has_next != "1"){
                        pageTotal = pageindex;
                        $scope.hasNext = false;
                    } else {
                        $scope.hasNext = true;
                    }
                    $scope.pageIndexClone = pageindex;
                } else {
                    $rootScope.alert(data.msg);
                }
            }, ()=>{}).finally(()=>{
                $scope.refreshing = false;
            });
        }
        $scope.tableData = [];
        $scope.research = () => {
            $scope.pageIndex = 1;
            $scope.hasNext = true;
            pageTotal = 999999;
            $scope.pageSize = new Number(10);
        }
        $scope.reset();
        $scope.infiniteEnd = index=>{
            return !$scope.hasNext
        }

        $scope.expandRow = row=>{
            $scope.tableData && $scope.tableData.length && $scope.tableData.forEach(r=>{(r !== row) && (r._expand = false);});
            row._expand = !row._expand;
        }

        let ParamController = (scope, $mdDialog, data)=> {
            scope.data = data;
            scope.makeTag = row=>{return `<${row.param_name}>${row.param_value}</${row.param_name}>`;}
            scope.closeDialog = () => {$mdDialog.hide()};
        }
        $scope.showParamDialog = ($event,rawData) => {
            // 由于原始数据是被转义过的，所以为了转义功能，使用假div对数据进行清洗
            let data = [];
            try{
                data = JSON.parse(angular.element(`<div>${rawData}</div>`)[0].innerHTML.replace(/'/g,'"'));
            }catch(e){
                $rootScope.alert("数据解析出现问题，请联系开发者");
                return;
            }
            $mdDialog.show({
                controller: ParamController,
                template: `<md-dialog aria-label="Mango (Fruit)">
                                <md-dialog-content class="md-dialog-content param-viewer">
                                    <div class="md-dialog-content-body">
                                        <table class="md-datatable" cellspacing="0">
                                            <tbody>
                                                <tr><td colspan="3"><span>&lt;</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr ng-repeat="row in data"><td></td><td></td><td><span>&lt;</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span><span class="content" ng-bind="row.param_value"></span><span>&lt;/</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;/</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr><td colspan="3"><span>&lt;/</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </md-dialog-content>
                            </md-dialog>`,
                /*parent: angular.element(document.body),*/
                targetEvent: $event,
                parent: angular.element(document.querySelector('body>section>md-content')),
                clickOutsideToClose: true,
                locals: {data: data}
            });
        };
        window.test = ()=>{
            return $scope;
        }

        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('LogAnalysisCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "analysis";

        $rootScope.validateEntry();

        let pageTotal = 999999;
        $scope.reset = ()=> {
            //$scope.keyword = "";
            $scope.keywordArray=[""];
            $scope.nextRowkey = "";
            $scope.pageIndex = 1;
            $scope.pageIndexClone = 1;
            $scope.pageSize = new Number(10);
            $scope.pageTotal = 999999;
            $scope.infinite = true;
            $scope.hasNext = true;
            $scope.searchdate = new Date();
            $scope.endtime = $scope.searchdate.Format("HH:mm:ss");
            $scope.begintime = new Date(new Date().setHours(Math.max($scope.searchdate.getHours() - 1, 0))).Format("HH:mm:ss");
            // 只能是60天之内的搜索
            $scope.mindate = new Date($scope.searchdate.getFullYear(), $scope.searchdate.getMonth(), $scope.searchdate.getDate() - 60);
            $scope.maxdate = new Date();

            $scope.hasNext = true;
        }
        $scope.searcher = (index, size) => {
            let rowkey = index?((index > $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone]:((index < $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone - 2]:$scope.keywordArray[$scope.pageIndexClone - 1])):$scope.keywordArray[$scope.pageIndexClone - 1],
                pageindex = index ? index : $scope.pageIndex;
            if($scope.refreshing || (pageTotal < pageindex)){
                $rootScope.nextTick(()=>{($scope.pageIndex!= $scope.pageIndexClone) && ($scope.pageIndex = $scope.pageIndexClone);});
                return;
            }
            $scope.refreshing = true;
            return $rootScope.ajax("list", {
                pageindex: pageindex,
                keyword: $scope.keyword,
                searchdate: $scope.searchdate.Format("yyyy-MM-dd"),
                begintime: $scope.begintime,
                endtime: $scope.endtime,
                rowkey: rowkey
            }, (data)=> {
                if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true')) || data.log_list) {
                    $scope.tableData = data.log_list;
                    if(data.rowkey){
                        if((pageindex >= $scope.pageIndexClone) && (data.rowkey > $scope.nextRowkey)){
                            $scope.keywordArray.push(data.rowkey);
                        } else if ((pageindex <= $scope.pageIndexClone)  && (data.rowkey < $scope.nextRowkey)){
                            $scope.keywordArray && ($scope.keywordArray.length > 2)?$scope.keywordArray.splice(pageindex):$scope.keywordArray.splice(1);
                        }
                    }
                    if(data.has_next != "1"){
                        pageTotal = pageindex;
                        $scope.hasNext = false;
                    } else {
                        $scope.hasNext = true;
                    }
                    $scope.pageIndexClone = pageindex;
                } else {
                    $rootScope.alert(data.msg);
                }
            }, ()=>{}).finally(()=>{
                $scope.refreshing = false;
            });
        }
        $scope.tableData = [];
        $scope.research = () => {
            $scope.pageIndex = 1;
            $scope.hasNext = true;
            pageTotal = 999999;
            $scope.pageSize = new Number(10);
        }
        $scope.reset();
        $scope.infiniteEnd = index=>{
            return !$scope.hasNext
        }


        $scope.expandRow = row=>{
            $scope.tableData && $scope.tableData.length && $scope.tableData.forEach(r=>{(r !== row) && (r._expand = false);});
            row._expand = !row._expand;
        }

        let ParamController = (scope, $mdDialog, data)=> {
            scope.data = data;
            scope.makeTag = row=>{return `<${row.param_name}>${row.param_value}</${row.param_name}>`;}
            scope.closeDialog = () => {$mdDialog.hide()};
        }
        $scope.showParamDialog = ($event,rawData) => {
            // 由于原始数据是被转义过的，所以为了转义功能，使用假div对数据进行清洗
            let data = [];
            try{
                data = JSON.parse(angular.element(`<div>${rawData}</div>`)[0].innerHTML.replace(/'/g,'"'));
            }catch(e){
                $rootScope.alert("数据解析出现问题，请联系开发者");
                return;
            }
            $mdDialog.show({
                controller: ParamController,
                template: `<md-dialog aria-label="Mango (Fruit)">
                                <md-dialog-content class="md-dialog-content param-viewer">
                                    <div class="md-dialog-content-body">
                                        <table class="md-datatable" cellspacing="0">
                                            <tbody>
                                                <tr><td colspan="3"><span>&lt;</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr ng-repeat="row in data"><td></td><td></td><td><span>&lt;</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span><span class="content" ng-bind="row.param_value"></span><span>&lt;/</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;/</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr><td colspan="3"><span>&lt;/</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </md-dialog-content>
                            </md-dialog>`,
                /*parent: angular.element(document.body),*/
                targetEvent: $event,
                parent: angular.element(document.querySelector('body>section>md-content')),
                clickOutsideToClose: true,
                locals: {data: data}
            });
        };
        window.test = ()=>{
            return $scope;
        }
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('DownloadCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "download";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('DocCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "doc";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('NoticeCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "notice";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('ToolDownloadCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "tool";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('SDKCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "sdk";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('FunctionCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "func";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('SubUserCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "subuser";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);
applicationApp.controller('DataRoleSetCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
    ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
        $rootScope.tab = "dataroleset";
        $scope.$on('$viewContentLoaded', event => {
        });
    }]);

applicationApp.filter('escapeHtml', () => {

    let entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return str => String(str).replace(/[&<>"'\/]/g, s => entityMap[s])
});
applicationApp.filter('unescapeHtml', () => {

    let entityMap = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': "/"
    };
    return (str, type) => {
        if (!str) {
            return;
        }
        let rawStr = String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, s => entityMap[s]);
        if (str && (str != 'undefined')) {
            if (type == 'json') {
                return JSON.stringify(JSON.parse(rawStr), null, 2);
            } else if (type == 'xml') {
                return formatXml(rawStr);
            }
        }

        return rawStr
    }
});

applicationApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);

applicationApp.directive('ropTreeView', ['$compile', $compile => ({
    restrict: "AE",

    scope: {
        data: '=data',
        field: '=field',
        option: '=option'
    },

    replace: true,
    templateUrl: "/js/angular/template/tree_view.html",

    link($scope, element, attrs) {
        let collapsed = [], checked = [];
        // 不想影响原数据
        try {
            $scope.data = JSON.parse(attrs.data);
        } catch (e) {
            $scope.data = $scope.$parent[attrs.data];
        }

        let recur = (item, runner) => {
                if (item[$scope.field.children] && (item[$scope.field.children].length)) {
                    item[$scope.field.children].forEach(subItem => {
                        runner(subItem, item);
                        recur(subItem, runner);
                    });
                }
            },
            recur_counter = (item, checked) => {
                let allUnchecked = true;
                item[$scope.field.children] && item[$scope.field.children].forEach(brother => {
                    if (checked) {
                        (!brother[$scope.field.checked]) && (allUnchecked = false);
                    } else {
                        (brother[$scope.field.checked]) && (allUnchecked = false);
                    }
                });
                if (allUnchecked) {
                    item[$scope.field.checked] = checked;
                    item._parent && recur_counter(item._parent, checked);
                }
            };

        let watcher = () => {
            !$scope.option && ($scope.option = {});
            if ($scope.field) {
                !$scope.field.id && ($scope.field.id = "_id");
                !$scope.field.label && ($scope.field.id = "_label");
                !$scope.field.children && ($scope.field.children = "_children");
                !$scope.field.checked && ($scope.field.checked = "_checked");
                !$scope.field.collapsed && ($scope.field.collapsed = "_collapsed");
                /*!$scope.field.selected && ($scope.field.selected = "_selected");*/
            }
            if ($scope.data) {
                $scope.data.forEach(item => {
                    if (item[$scope.field.children] && item[$scope.field.children].length) {
                        $scope.option.collapseAll ? (item[$scope.field.collapsed] = true) : (item[$scope.field.collapsed] = false);
                    }
                    recur(item, (node, parent) => {
                        node._parent = parent;
                        if (node[$scope.field.children] && node[$scope.field.children].length) {
                            $scope.option.collapseAll ? (node[$scope.field.collapsed] = true) : (node[$scope.field.collapsed] = false);
                        }
                    })
                });
            }
        };

        $scope.$watch("data", () => {
            watcher();
        });

        $scope.$parent.RopTreeView = {};
        $scope.$parent.RopTreeView.getChecked = () => {
            let list = [];
            if ($scope.data) {
                $scope.data.forEach(item => {
                    if (item[$scope.field.checked]) {
                        list.push(item);
                    }
                    recur(item, node => {
                        if (node[$scope.field.checked]) {
                            list.push(node);
                        }
                    })
                });
            }
            return list;
        }
        $scope.toggleChecked = item => {
            item[$scope.field.checked] = !item[$scope.field.checked];
            recur(item, node => {
                node[$scope.field.checked] = item[$scope.field.checked];
            });

            if (!item[$scope.field.checked]) {
                item._parent && recur_counter(item._parent, false);
            } else {
                if (item._parent) {
                    item._parent[$scope.field.checked] = item[$scope.field.checked];
                    if (item._parent._parent) {
                        item._parent._parent[$scope.field.checked] = item[$scope.field.checked];
                    }
                }
            }

        }

        $scope.toggleCollapse = item => {
            item[$scope.field.collapsed] = !item[$scope.field.collapsed];
        }
    }
})]);

applicationApp.directive('strboolean', ()=> {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (value) {
                return (value === undefined) ? undefined : (value ? "1" : "0");
            });
            ngModel.$parsers.push(function (value) {
                return (value === undefined) ? undefined : (value ? "1" : "0");
            });
        }
    }
});
applicationApp.directive('charRestriction', ['$mdUtil', ($mdUtil)=> {
    return {
        restrict: 'A',
        scope:{
            charcodes: "=charcodes",
        },
        link: function (scope, element, attrs) {
            /*let globalPattern = new RegExp(`${attrs.regexRestriction}`),originalValue = "";
            if(attrs.keypattern){
                let keyPattern = new RegExp(`${attrs.keypattern}`);
                angular.element(element).on("keypress keydown", function (e) {
                    originalValue = this.value;
                    let selectionStart = originalValue.substring(0,this.selectionStart),selectionEnd = originalValue.substring(this.selectionEnd,originalValue.length);
                    if((e.key != "ArrowLeft") && (e.key != "ArrowRight") && (e.key != "Shift") && (e.key != "Control") && (e.key != "Alt") && (e.key != "Meta") && (e.key != "Backspace")&&(e.key != "Forward")&&(e.key != "Delete")){
                        if(!keyPattern.test(e.key)){
                            e.preventDefault();
                            return false
                        }
                        return true;
                    }
                });
            }*/
            if(scope.charcodes && scope.charcodes.length){
                angular.element(element).on("keydown", function (e) {
                    //let selectionStart = originalValue.substring(0,this.selectionStart),selectionEnd = originalValue.substring(this.selectionEnd,originalValue.length);
                   if((e.key != "ArrowLeft") && (e.key != "ArrowRight") && (e.key != "Shift") && (e.key != "Control") && (e.key != "Alt") && (e.key != "Meta") && (e.key != "Backspace")&&(e.key != "Forward")&&(e.key != "Delete")){
                        if(scope.charcodes.indexOf(e.keyCode) < 0){
                            e.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            }
          /* angular.element(element).on("input", function (e) {
               let value = angular.element(element).val();
               console.log(value);
               if(!globalPattern.test(originalValue)){
                   if(originalValue){
                       let code = originalValue.charCodeAt(0);
                       originalValue = String.fromCharCode(++code);
                   } else {
                       originalValue = String.fromCharCode(32);
                   }
               }
               /!*if(value.indexOf('\'') > 0){
                   e.preventDefault();
                   angular.element(element).val(originalValue).trigger('input');
                   return false;
               }*!/
               if (!globalPattern.test(value)) {
                   angular.element(element).val(originalValue).trigger('input');
               }
            });*/
           /* angular.element(element).on("paste", function (e) {
                originalValue = this.value;
                $mdUtil.nextTick(()=> {
                    let value = angular.element(element).val();
                    if (!globalPattern.test(value)) {
                        angular.element(element).val(originalValue).trigger('input');
                    }
                });
            });*/
        }
    }
}]);
applicationApp.directive('xmlValidator', () => ({
    require: "ngModel",
    link(scope, element, attributes, ngModel) {
        ngModel.$validators.xmlValidator = modelValue => {
            var xml, tmp;
            try {
                if ( window.DOMParser ) {
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( modelValue , "text/xml" );
                } else {
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( modelValue );
                }
            } catch( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                return false
            }
            return true;
        };
    }
}));
applicationApp.directive('jsonValidator', () => ({
    require: "ngModel",
    link(scope, element, attributes, ngModel) {
        ngModel.$validators.jsonValidator = modelValue => {
            let result = true;
            try {
                JSON.parse(modelValue);
            } catch (e) {
                result = false;
            }
            return result;
        };
    }
}));
/*window.onresize = ()=>{
 $(".view-frame").css("transform",`scale(${(($(window).height() - 48) / 935)})`)
 }*/



