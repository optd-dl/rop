/*define(require => {
    'use strict';
    let angular = require('angular');
    return angular.module('application.services', [])
        .factory('HttpObserver', ['$cookies','$rootScope','$q',($cookies,$rootScope,$q)=> {
            var sessionInjector = {
                response: function (config) {
                    if(config.data._expired){
                        window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/sso?from=application`;
                        return $q.reject(config);
                    }
                    window._lastHttpRequest = new Date();
                    return config;
                }
            };
            return sessionInjector;
        }]);
        //.factory('JobsMetamodelService', require('job/services/metamodel'));

});*/

define(['angular','clipboard','angularMaterial','angularCookie','../services'], function (angular, Clipboard) {
    'use strict';
    return angular.module('application.services', ['ngMaterial','ngCookies','rop.services'])
        .factory('HttpObserver', ['$q','$window','$cookies',($q,$window,$cookies)=> {
            var sessionInjector = {
                response: function (config) {
                    if(config.data._expired){
                        $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                        window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/sso?from=application`;
                        // 不管是阿猫阿狗，只要页面刷新，所有发出去的ajax都会被挂起
                        return $q.defer().promise;
                    }
                    return config;
                }
            };
            return sessionInjector;
        }])
        .factory('LogProcessor', ['$http','$mdDialog','$cookies','ScopeInitializer',($http,$mdDialog, $cookies, ScopeInitializer)=>{
            let LogController = (scope, $mdDialog, $timeout, $mdUtil, recordkey)=> {
                let _lang = ScopeInitializer._lang, beforeClipboardCopy = (_lang == "zh-cn") ? "拷贝信息" : "Copy", afterClipboardCopy = (_lang == "zh-cn") ? "已复制" : "Copied",
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
                            ScopeInitializer.alert(body.data.msg);
                            scope.total = 0;
                        }
                    }, why => {
                        ScopeInitializer.alert(why);
                        scope.total = 0;
                    });
                }
                scope.closeLogger = () => {
                    $mdDialog.hide()
                };
                scope.reset();
            }

            return {
                showLog(ev, recordkey){
                    $mdDialog.show({
                        controller: LogController,
                        templateUrl: "/_template/logger",
                        targetEvent: ev,
                        parent: angular.element(document.querySelector('body>section>md-content')),
                        clickOutsideToClose: true,
                        locals: {recordkey: recordkey}
                    });
                }
            }
        }])
        .factory('MiscTool', ['$http','$mdDialog','$cookies',($http,$mdDialog, $cookies)=>{
            return {
                append(list,scrollerSelector){
                    list.push({});
                    if(scrollerSelector){
                        let $el = angular.element(scrollerSelector);
                        $el.animate({scrollTop:$el[0].scrollHeight});
                    }
                },
                splice(list,target){
                    list.splice(list.indexOf(target),1);
                }
            }
        }]);
});