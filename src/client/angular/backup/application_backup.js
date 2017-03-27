/**
 * Created by robin on 12/1/15.
 */

var applicationApp = angular.module('ApplicationApp', [
    'ui.router','ngAnimate','ngCookies'
]);

applicationApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',
    function ($stateProvider,$urlRouterProvider,$locationProvider) {
        $stateProvider.
            state('application', {
                templateUrl: '/application/applications',
                controller: 'ApplicationsCtrl'
            }).
            state('suppliers', {
                templateUrl: '/application/suppliers',
                controller: 'SuppliersCtrl'
            }).
            state('subusers', {
                templateUrl: '/application/subusers',
                controller: 'SubUsersCtrl'
            }).
            state('docs', {
                templateUrl: '/application/docs',
                controller: 'DocsCtrl'
            }).
            state('userinfos', {
                templateUrl: '/application/userinfos',
                controller: 'UserInfosCtrl'
            }).
            state('sdk', {
                templateUrl: '/application/sdk',
                controller: 'SdkCtrl'
            }).
            state('message', {
                templateUrl: '/application/message',
                controller: 'MessageCtrl'
            }).
            state('comment', {
                templateUrl: '/application/comment',
                controller: 'CommentCtrl'
            }).
            state('collect', {
                templateUrl: '/application/collect',
                controller: 'CollectCtrl'
            });
        $urlRouterProvider.otherwise('/application');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }]);

applicationApp.controller('ApplicationCtrl', ['$rootScope','$scope','$state', '$location','$window','$http','$cookies',
    function($rootScope, $scope, $state,$location,$window,$http,$cookies) {
        setTimeout(function(){
            $('.loading').addClass('out');
        },1500)
        $rootScope.$menu = $(".rop-l-menu").metisMenu();

        $http.post('/agent',{module:'common',partial:'api',api:'categories',param:{}}).then(function(body){
            if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                $rootScope.apiCategories = body.data.data_list;
            } else {
                console.log(body.msg)
            }
        }, function(why){
            // TODO 弹窗
            console.log(why);
        });

        $rootScope.locate = function(url){
            $window.location.href = url;
        }
        $rootScope.toWelcome = function(){
            //(window._env == "dev")?$scope.locate(''):$scope.locate(Constant.protocol+'://'+Constant.host+":"+Constant.port);
            $scope.locate(Constant.protocol+'://'+Constant.host+":"+Constant.port);
        }
        $scope.logout = function(){
            $http.post('/agent',{module:'sso',partial:'session',api:'logout'}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    //localStorage.setItem("_session", null);
                    //$cookies.put("_session",null,{path:"/",domain:".open.rongcapital.cn"});
                    //(window._env == 'dev')?(localStorage.setItem("_session", null)):($cookies.put("_session",null,{path:"/",domain:"."+Constant.host}));
                    $cookies.put("_session",null,{path:"/",domain:"."+Constant.host});
                    $rootScope.profile = undefined;
                    $window.location.href = 'sso?from=application'
                } else {

                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $rootScope.go = function(tab){
            $state.go(tab);
        }

        $scope.init = function(id){
            //(window._env == 'dev')?(localStorage.setItem("_session", null)):($cookies.put("_session",null,{path:"/",domain:".open.rongcapital.cn"}));
            //var _session = (window._env == 'dev')?(localStorage.getItem("_session")?(JSON.parse(localStorage.getItem("_session"))):""):($cookies.get("_session")?JSON.parse($cookies.get("_session")):'');
            var _session = $cookies.get("_session")?JSON.parse($cookies.get("_session")):'';
            if(_session && (id == _session.id)){
                $rootScope.profile = _session;
            } else {
                $rootScope.profile = undefined;
                $window.location.href = 'sso?from=application'
            }

            $state.go("application");
            /*if(($rootScope.profile.login_user_type == "0") || ($rootScope.profile.login_user_type == "2") || ($rootScope.profile.login_user_type == "3")){
                $rootScope.locate("/console");
            } else {
                $state.go("application");
            }*/
        }
    }]);

applicationApp.controller('ApplicationsCtrl', ['$rootScope','$scope','$http','$window','$compile','$element',
    function($rootScope,$scope,$http,$window,$compile,$element) {
        $rootScope.tab = "application";
        // 防止屏幕抖动
        //var brickTemplate = '<div class="thumbnail card item" id="{{app_id}}"><div class="overlay-container" style="background:white"><img style="width: 100%; display: block; height: 190px;" src="/resource/application/icon0{{index}}.png"><a href="javascript:" class="overlay-link medium"><i class="fa fa-info cross up" ng-click="viewApp(\'{{app_id}}\')" title="应用信息"></i><i class="fa fa-times cross down" title="删除" ng-click="deleteApp(\'{{app_id}}\')"></i><i class="fa fa-navicon cross left" title="API信息" ng-click="viewAppAPI(\'{{app_id}}\')"></i><i class="fa fa-pencil cross right" title="修改" ng-click="viewEdit(\'{{app_id}}\')"></i></a></div><div class="caption"><h4 class="align-center">{{app_name}}</h4><div class="separator"></div>        <p class="text">AppKey: {{appkey}}<br />审核状态: {{status}}</p><p class="small text-muted"><i class="fa fa-calendar pr-10" ></i>{{rx_insertTime}}</p></div></div>';
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];

        $scope.secretReset = function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'secret-reset',param:{app_id: $scope.appDetails.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails.appsecret = body.data.appsecret;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.testSecretReset = function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'test-secret-reset',param:{app_id: $scope.appDetails.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails.test_appsecret = body.data.test_appsecret;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.tokenReset = function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'token-reset',param:{app_id: $scope.appDetails.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails.access_token = body.data.access_token;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.testTokenReset = function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'test-token-reset',param:{app_id: $scope.appDetails.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails.test_access_token = body.data.test_access_token;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.viewApp= function(app){
            $http.post('/agent',{module:'application',partial:'applications',api:'details',param:{app_id: app.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails = body.data;
                    !$scope.appDetails.app_id&&($scope.appDetails.app_id = app.app_id);
                    $.extend(app,$scope.appDetails);
                    $('#app_info').modal();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.viewEdit= function(app){
            $http.post('/agent',{module:'application',partial:'applications',api:'details',param:{app_id: app.app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails = body.data;
                    !$scope.appDetails.app_id&&($scope.appDetails.app_id = app.app_id);
                    $.extend(app,$scope.appDetails);
                    $('#app_update').modal();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.viewApi= function(app){
            $scope.appSelected = app;
            $scope.apiSearcher($scope.apiPageIndex, $scope.apiPageSize,function(){
                $('#api_list').modal();
            })
        }
        $scope.viewUnApi= function(e){
            var $btn = $(e.currentTarget).button('loading')
            $scope.unapiSearcher($scope.unapiPageIndex, $scope.unapiPageSize,function(){
                $('#unapi_list').modal();
                $btn.button('reset');
            })
        }
        $scope.viewCreate= function(){
            $scope.appDetails = {};
            $('#app_create').modal();
        }

        $scope.load = function(){
            if(!$scope.lock){
                $scope.lock = true;
                $http.post('/agent',{module:'application',partial:'applications',api:'list',param:{pageindex: $scope.pageindex++}}).then(function(body){
                    if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                        /*var list = body.data.app_list,appElements = '';
                        $scope.$mason.one( 'layoutComplete', function(){
                            setTimeout(function(){
                                var more = $scope.$mason.find(".item.more");
                                var items = $scope.$mason.data().masonry.items;
                                var _more = items[items.length - list.length - 1]
                                items.splice(items.length - list.length - 1, 1);
                                items.push(_more);
                                $scope.$mason.masonry("layout");
                                $scope.lock = false;
                            },100);
                        } );

                        list.forEach(function(data,i){
                            // 考虑到添加时会有分页问题
                            if($scope.appIdList && $scope.appIdList.length && ($scope.appIdList.indexOf(data.app_id) != -1)){
                                return;
                            }
                            appElements+=brickTemplate.replace(new RegExp("{{index}}",'g'),i+1).replace(new RegExp("{{app_id}}",'g'),data.app_id).replace(new RegExp("{{app_name}}",'g'),data.app_name).replace(new RegExp("{{appkey}}",'g'),data.appkey).replace(new RegExp("{{rx_insertTime}}",'g'),data.rx_insertTime).replace(new RegExp("{{status}}",'g'),data.status);
                        });
                        var $items = $(appElements);
                        $scope.$mason.append($items).masonry('appended', $items);
                        $compile($items.contents())($scope);
                        $scope.appIdList = list.map(function(item){return item.app_id});*/
                        var elementSelector = [];
                        body.data.app_list.forEach(function(app){
                            if(![].concat.apply([],$scope.items.map(function(item){return (item.app_id == app.app_id)?[item]:[]})).length){
                                $scope.items.push(app);
                                elementSelector.push("#"+app.app_id);
                            }
                        });
                        //$scope.items = body.data.app_list;
                        setTimeout(function(){
                            $scope.$mason.masonry('addItems',$scope.$mason.find(elementSelector.join(",")));
                            var more = $scope.$mason.find(".item.more");
                            var items = $scope.$mason.data().masonry.items;
                            var _more = items[items.length - elementSelector.length - 1]
                            items.splice(items.length - elementSelector.length - 1, 1);
                            items.push(_more);
                            $scope.$mason.masonry("layout");
                        });
                    } else {
                        console.log(body.msg)
                    }
                    $scope.lock = false;
                }, function(why){
                    // TODO 弹窗
                    console.log(why);
                    $scope.lock = false;
                });
            }
        }

        $scope.editApp= function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'edit',param:{app_id: $scope.appDetails.app_id,app_name: $scope.appDetails.app_name,remark:$scope.appDetails.remark,user_type:$scope.profile.login_user_type }}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                   var app = [].concat.apply([],$scope.items.map(function(item,i){return (item.app_id == body.data.app_id)?[item]:[]}));
                    app && $.extend(app,body.data);
                } else {
                    console.log(body.msg)
                }
                $("#app_update").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.createApp= function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'create',param:{app_name: $scope.appDetails.app_name,remark:$scope.appDetails.remark, user_type:$scope.profile.login_user_type }}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.items.push(body.data);
                    setTimeout(function(){
                        $scope.$mason.masonry('prepended',$scope.$mason.find("#"+body.data.app_id));
                    });
                } else {
                    console.log(body.msg)
                }
                $("#app_create").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.deleteApp= function(app_id){
            $http.post('/agent',{module:'application',partial:'applications',api:'del',param:{app_id: app_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    var cursors = [].concat.apply([],$scope.items.map(function(item,i){return (item.app_id == app_id)?[i]:[]})),$item = $scope.$mason.find("#"+body.data.app_id);
                    $scope.items.splice(cursors,cursors.length);
                    $scope.$mason.masonry('remove',$item);
                    setTimeout(function(){
                        $scope.$mason.masonry('layout');
                    },400);
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.$on('$viewContentLoaded',
            function(event){
                $scope.$mason = $('#mason');
                $scope.$mason.masonry({
                    columnWidth: 241,
                    gutter: 15,
                    stamp: '.stamp'
                });

                $scope.load();
            });

        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            if($scope.appSelected){
                $http.post('/agent',{module:'application',partial:'applications',api:'api',param: $.extend({app_id:$scope.appSelected.app_id, pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                    if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                        $scope.appApiList = body.data.app_api_list;
                        $scope.apiTotal = Number.parseInt(body.data.list_count);
                        $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
                        cb && cb.call();
                    } else {
                        console.log(body.msg)
                    }
                }, function(why){
                    // TODO 弹窗
                    console.log(why);
                    cb && cb.call();
                });
            }
        };
        $scope.toggleAllApi = function(){
            if($scope.appApiCheckedList.length && ($scope.appApiCheckedList.length == $scope.appApiList.length)){
                $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
            } else {
                $scope.appApiList.forEach(function(api){
                    ($scope.appApiCheckedList.indexOf(api) == -1) && $scope.appApiCheckedList.push(api);
                });
            }
        };
        $scope.toggleApi = function(api){
            if($scope.appApiCheckedList.indexOf(api) == -1){
                $scope.appApiCheckedList.push(api);
            } else {
                $scope.appApiCheckedList.splice($scope.appApiCheckedList.indexOf(api),1);
            }
        };
        $scope.deleteApi = function(){
            //$scope.appApiCheckedList;
            $http.post('/agent',{module:'application',partial:'applications',api:'delete-api',param: {app_id:$scope.appSelected.app_id, api_id:$scope.appApiCheckedList.map(function(item){return item.api_id}).join("@")}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.allApiChecked = function(){
            return ([].concat.apply([], $scope.appApiList.map(function(item){return ($scope.appApiCheckedList.indexOf(item) == -1)?[item]:[]})).length == 0);
        }

        $scope.unapiPageIndex = 1;
        $scope.unapiPageSize = 5;
        $scope.unapiRefresh = function(cb){
            $scope.unapiPageIndex = 1;
            $scope.unapiPageSize = 5;
            $scope.unapiSearcher(null,null,cb);
        };
        $scope.unapiSearcher = function(index,size,cb){
            if($scope.appSelected){
                $http.post('/agent',{module:'application',partial:'applications',api:'unapi',param: $.extend({app_id:$scope.appSelected.app_id, pageindex: index?index:$scope.unapiPageIndex, pagesize: size?size:$scope.unapiPageSize},$scope.apiSearchParam)}).then(function(body){
                    if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                        $scope.unappApiList = body.data.app_api_list;
                        $scope.unapiTotal = Number.parseInt(body.data.list_count);
                        $scope.unappApiCheckedList.splice(0,$scope.unappApiCheckedList.length);
                        cb && cb.call();
                    } else {
                        console.log(body.msg)
                    }
                }, function(why){
                    // TODO 弹窗
                    console.log(why);
                    cb && cb.call();
                });
            }
        };
        $scope.toggleAllUnApi = function(){
            if($scope.unappApiCheckedList.length && ($scope.unappApiCheckedList.length == $scope.unappApiList.length)){
                $scope.unappApiCheckedList.splice(0,$scope.unappApiCheckedList.length);
            } else {
                $scope.unappApiList.forEach(function(api){
                    ($scope.unappApiCheckedList.indexOf(api) == -1) && $scope.unappApiCheckedList.push(api);
                });
            }
        };

        $scope.toggleUnApi = function(api){
            if($scope.unappApiCheckedList.indexOf(api) == -1){
                $scope.unappApiCheckedList.push(api);
            } else {
                $scope.unappApiCheckedList.splice($scope.unappApiCheckedList.indexOf(api),1);
            }
        };
        $scope.addUnApi = function(){
            $http.post('/agent',{module:'application',partial:'applications',api:'add-api',param: {app_id:$scope.appSelected.app_id, api_id:$scope.unappApiCheckedList.map(function(item){return item.api_id}).join("@")}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh(function(){
                        $('#unapi_list').modal("hide");
                    })
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
            //$scope.unappApiCheckedList;
            //$scope.apiRefresh
        }
        $scope.allUnApiChecked = function(){
            return ([].concat.apply([], $scope.unappApiList.map(function(item){return ($scope.unappApiCheckedList.indexOf(item) == -1)?[item]:[]})).length == 0);
        }
    }]);

applicationApp.controller('SuppliersCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "suppliers";
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];
        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'suppliers',api:'list',param: $.extend({ pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appApiList = body.data.user_app_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };
        $scope.toggleAllApi = function(){
            if($scope.appApiCheckedList.length && ($scope.appApiCheckedList.length == $scope.appApiList.length)){
                $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
            } else {
                $scope.appApiList.forEach(function(api){
                    ($scope.appApiCheckedList.indexOf(api) == -1) && $scope.appApiCheckedList.push(api);
                });
            }
        };
        $scope.toggleApi = function(api){
            if($scope.appApiCheckedList.indexOf(api) == -1){
                $scope.appApiCheckedList.push(api);
            } else {
                $scope.appApiCheckedList.splice($scope.appApiCheckedList.indexOf(api),1);
            }
        };
        $scope.deleteApp = function(){

            $http.post('/agent',{module:'application',partial:'suppliers',api:'del',param: {id:$scope.appApiCheckedList.map(function(item){return item.id}).join("@")}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.allApiChecked = function(){
            return ([].concat.apply([], $scope.appApiList.map(function(item){return ($scope.appApiCheckedList.indexOf(item) == -1)?[item]:[]})).length == 0);
        }
    }]);

applicationApp.controller('DocsCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "docs";
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];

        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.doctype = 1;

        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'docs',api:'list',param: $.extend({  doc_type: $scope.doctype,pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appApiList = body.data.data_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };

        $scope.viewEdit= function(app){
            $http.post('/agent',{module:'application',partial:'docs',api:'details',param:{doc_id: app.doc_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails = body.data;
                    $.extend(app,$scope.appDetails);
                    $('#doc_update').modal();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

    }]);

applicationApp.controller('MessageCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "message";
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];

        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.doctype = 1;

        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'message',api:'list',param: $.extend({pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appApiList = body.data.data_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };

        $scope.viewEdit= function(message_id,title,content){
            $http.post('/agent',{module:'application',partial:'message',api:'sign',param:{message_id: message_id}}).then(function(body){
                $scope.title = title;
                $scope.content = content;
                $('#doc_update').modal();
                $scope.apiRefresh();
            });
        }

        $scope.toggleAllApi = function(){
            if($scope.appApiCheckedList.length && ($scope.appApiCheckedList.length == $scope.appApiList.length)){
                $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
            } else {
                $scope.appApiList.forEach(function(api){
                    ($scope.appApiCheckedList.indexOf(api) == -1) && $scope.appApiCheckedList.push(api);
                });
            }
        };
        $scope.toggleApi = function(api){
            if($scope.appApiCheckedList.indexOf(api) == -1){
                $scope.appApiCheckedList.push(api);
            } else {
                $scope.appApiCheckedList.splice($scope.appApiCheckedList.indexOf(api),1);
            }
        };
        $scope.deleteApp = function(api){
            $http.post('/agent',{module:'application',partial:'message',api:'del',param: {message_id:api.message_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.allApiChecked = function(){
            return ([].concat.apply([], $scope.appApiList.map(function(item){return ($scope.appApiCheckedList.indexOf(item) == -1)?[item]:[]})).length == 0);
        }
    }]);

applicationApp.controller('CollectCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "collect";
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];

        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;

        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'collect',api:'list',param: $.extend({pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appApiList = body.data.user_app_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };

        $scope.deleteApp = function(api){
            $http.post('/agent',{module:'application',partial:'collect',api:'del',param:{favo_id:api.favo_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
    }]);

applicationApp.controller('CommentCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "comment";
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.appApiList = [], $scope.unappApiList = [];
        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.apiPageIndex2 = 1;
        $scope.apiPageSize2 = 5;
        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);

            $scope.apiPageIndex2 = 1;
            $scope.apiPageSize2 = 5;
            $scope.apiSearcher2(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'comment',api:'list1',param: $.extend({pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appApiList = body.data.data_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };
        $scope.apiSearcher2 = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'comment',api:'list2',param: $.extend({pageindex: index?index:$scope.apiPageIndex2, pagesize: size?size:$scope.apiPageSize2},$scope.apiSearchParam)}).then(function(body2){
                if(((typeof body2.data.is_success == 'boolean') && body2.data.is_success) || ((typeof body2.data.is_success == 'string') && (body2.data.is_success == 'true'))){
                    $scope.appApiList2 = body2.data.data_list;
                    $scope.apiTotal2 = Number.parseInt(body2.data.list_count);
                    cb && cb.call();
                } else {
                    console.log(body2.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });
        };
        $scope.deleteApp = function(api){
            $http.post('/agent',{module:'application',partial:'comment',api:'del',param:{comment_id:api.comment_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }
    }]);

applicationApp.controller('SdkCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "sdk";
        $scope.docList = [];
        $scope.sdk_type = 2;

        $scope.apiRefresh = function(cb){
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'sdk',api:'list',param: $.extend({sdk_type: $scope.sdk_type},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.docList = body.data.sdk;
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                //console.log(why);
                cb && cb.call();
            });

        };

    }]);

applicationApp.controller('SubUsersCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {
        $rootScope.tab = "subusers";

        $scope.flag = '0';
        $scope.pageindex = 1,$scope.items = [],$scope.unappApiCheckedList = [],$scope.appApiCheckedList = [],$scope.subUserList = [];
        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.apiRefresh = function(cb){
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null,null,cb);
        };
        $scope.apiSearcher = function(index,size,cb){

            $http.post('/agent',{module:'application',partial:'subusers',api:'list',param: $.extend({pageindex: index?index:$scope.apiPageIndex, pagesize: size?size:$scope.apiPageSize},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.subUserList = body.data.data_list;
                    $scope.apiTotal = Number.parseInt(body.data.list_count);
                    $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
                    cb && cb.call();
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
                cb && cb.call();
            });

        };

        $scope.insertApi= function(){
            $scope.appDetails = {};
            $('#sub_user_create').modal();
        };

        $scope.createSubUser= function(){
            $http.post('/agent',{module:'application',partial:'subusers',api:'create',param:{user_account: $scope.appDetails.user_account,password:$scope.appDetails.password,user_name: $scope.appDetails.user_name,company:$scope.appDetails.company,department: $scope.appDetails.department,tel:$scope.appDetails.tel,mobile: $scope.appDetails.mobile,email:$scope.appDetails.email,qq: $scope.appDetails.qq,remark:$scope.appDetails.remark }}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.data.msg);
                }
                $("#sub_user_create").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.toggleAllApi = function(){
            if($scope.appApiCheckedList.length && ($scope.appApiCheckedList.length == $scope.subUserList.length)){
                $scope.appApiCheckedList.splice(0,$scope.appApiCheckedList.length);
            } else {
                $scope.subUserList.forEach(function(api){
                    ($scope.appApiCheckedList.indexOf(api) == -1) && $scope.appApiCheckedList.push(api);
                });
            }
        };
        $scope.toggleApi = function(api){
            if($scope.appApiCheckedList.indexOf(api) == -1){
                $scope.appApiCheckedList.push(api);
            } else {
                $scope.appApiCheckedList.splice($scope.appApiCheckedList.indexOf(api),1);
            }
        };

        $scope.allApiChecked = function(){
            return ([].concat.apply([], $scope.subUserList.map(function(item){return ($scope.appApiCheckedList.indexOf(item) == -1)?[item]:[]})).length == 0);
        }

        $scope.deleteApi = function(){
            $http.post('/agent',{module:'application',partial:'subusers',api:'del',param: {sub_user_id:$scope.appApiCheckedList.map(function(item){return item.sub_user_id}).join("@")}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiRefresh();
                } else {
                    console.log(body.data.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.getApi= function(sub_user_id){
            $http.post('/agent',{module:'application',partial:'subusers',api:'getedit',param:{sub_user_id: sub_user_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails = body.data;
                    !$scope.appDetails.sub_user_id&&($scope.appDetails.sub_user_id = sub_user_id);
                    $.extend($scope.appDetails);
                    $('#sub_user_update').modal();
                    $scope.show_reset_pswd = false;
                    $scope.flag = '0';
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        };

        $scope.editApi= function(){
            $http.post('/agent',{module:'application',partial:'subusers',api:'edit',param:{sub_user_id: $scope.appDetails.sub_user_id,user_account: $scope.appDetails.user_account,password:$scope.appDetails.password,user_name: $scope.appDetails.user_name,company:$scope.appDetails.company,department: $scope.appDetails.department,tel:$scope.appDetails.tel,mobile: $scope.appDetails.mobile,email:$scope.appDetails.email,qq: $scope.appDetails.qq,remark:$scope.appDetails.remark,flag:$scope.flag }}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    var app = [].concat.apply([],$scope.items.map(function(item,i){return (item.sub_user_id == body.data.sub_user_id)?[item]:[]}));
                    app && $.extend(app,body.data);
                    $scope.apiRefresh();
                } else {
                    console.log(body.data.msg);
                }
                $("#sub_user_update").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.resetPassword= function() {
            $scope.appDetails.password = "";
            $scope.show_reset_pswd = true;
            $scope.flag = '1';
        }

        $scope.roleApi= function(sub_user_id){
            $scope.sub_user_id = sub_user_id;
            $('#sub_user_role_set').modal();

            $http.post('/agent',{module:'application',partial:'subusers',api:'getrole',param:{sub_user_id: sub_user_id}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.testData = body.data.func_list;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        };

        $scope.saveSubUserRole = function(){
            $http.post('/agent',{module:'application',partial:'subusers',api:'saverole',param: {sub_user_id:$scope.sub_user_id, func_id:test.RopTreeView.getChecked().map(function(item){return item.func_id}).join('@')}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $('#sub_user_role_set').modal("hide");
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.testField = {id:"func_id",label:"func_name",children:"func_list",checked:"selected_id"};
        $scope.testOption = {collapseAll: true};

    }]);

applicationApp.controller('UserInfosCtrl', ['$rootScope','$scope','$http','$window',
    function($rootScope,$scope,$http,$window) {

        $rootScope.tab = "userinfos";

        $scope.apiSearcher = function(index,size,cb){
            $http.post('/agent',{module:'application',partial:'userinfos',api:'list',param: $.extend({},$scope.apiSearchParam)}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.appDetails = body.data;
                } else {
                    console.log(body.msg)
                }
            }, function(why){
                // TODO 弹窗
                //console.log(why);
                cb && cb.call();
            });

        };

        $scope.updateinfo= function(){
            $http.post('/agent',{module:'application',partial:'userinfos',api:'updateinfo',param:{user_name: $scope.appDetails.user_name,company:$scope.appDetails.company,department: $scope.appDetails.department,tel:$scope.appDetails.tel,mobile: $scope.appDetails.mobile,email:$scope.appDetails.email,qq: $scope.appDetails.qq,user_intro:$scope.appDetails.user_intro }}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.apiSearcher();
                    console.log('保存成功');
                } else {
                    console.log(body.data.msg);
                }
                $("#sub_user_update").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        };

        $scope.updatePsd= function(){
            $('#password_update').modal();
        };

        $scope.savePsd= function(){
            if($scope.userPsd == undefined){
                console.log('请输入密码');
                return;
            }
            $http.post('/agent',{module:'application',partial:'userinfos',api:'editpsd',param:{old_password: $scope.userPsd.old_password,new_password: $scope.userPsd.new_password,confirm_password:$scope.userPsd.confirm_password}}).then(function(body){
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $("#password_update").modal('hide');
                } else {
                    console.log(body.data.msg);
                }
                $("#sub_user_update").modal('hide');
            }, function(why){
                // TODO 弹窗
                console.log(why);
            });
        }

    }]);

applicationApp.filter('escapeHtml', function () {

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return function(str) {
        return String(str).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
});
applicationApp.filter('unescapeHtml', function () {

    var entityMap = {
        "&amp;":"&",
        "&lt;":"<",
        "&gt;": ">",
        '&quot;':'"',
        '&#39;':"'",
        '&#x2F;':"/"
    };
    return function(str,type) {
        if(!str){
            return;
        }
        var rawStr = String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, function (s) {
            return entityMap[s];
        });
        if(str && (str != 'undefined')){
            if(type == 'json'){
                return JSON.stringify(JSON.parse(rawStr), null, 2);
            } else if (type == 'xml'){
                return formatXml(rawStr);
            }
        }

        return rawStr
    }
});

applicationApp.filter('trusthtml', ['$sce', function ($sce) {
    return function(t) {
        return $sce.trustAsHtml(t)
    }
}]);

/*
applicationApp.directive('masonCard', function ($compile) {
    return {
        restrict: "A",
        scope:{
            options: "=options",
            list: "=list"
        },
        templateUrl: "/js/angular/template/mason-cards.html",
        link: function($scope, element, attrs){
            element.masonry($scope.options);

            /!*$scope.append = function(data){
                var $items = $('<div class="thumbnail card item"><div class="overlay-container"><img style="width: 100%; display: block; height: 190px;" src="/resource/logo_5.jpg"><a href="javascript:" class="overlay-link"><i class="fa fa-expand"></i></a></div><div class="caption"><h4 class="align-center">白玩供应商</h4><div class="separator"></div>        <p class="text"> 这里是填充物...</p><p class="small text-muted"><i class="fa fa-calendar pr-10" ></i>2015-03-23</p></div></div>');
                element.prepend($items).masonry('prepended', $items );
            }*!/

            $scope.$watch("list", function() {
                element.masonry('appended', $items );
            });
        }
    }
});*/

applicationApp.directive('ropPagination', ['$parse', function ($parse) {
    return {
        restrict: "A",
        scope:{
            index: "=index",
            size:"=size",
            total: "=total",
            searcher: "=searcher"
        },
        templateUrl: "/_template/pagination",
        link: function($scope, element, attrs){
            $scope.myIndex = $scope.index;
            $scope.ceilingIndex = $scope.index + 4;

            // TODO 为了防止初始化2次特注掉以下代码，注掉后操作页scope则不能控制分页组件，反之是分页控件控制scope的数据，如果需要可以恢复
            /*$scope.$watch("index", function() {
             $scope.searcher($scope.index,$scope.size);
             });*/

            $scope.$watch("total", function() {
                $scope.pages = [];
                for (var i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                    $scope.pages.push({index : i + 1})
                }
            });
            $scope.$watch("size", function() {
                $scope.pages = [];
                for (var i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                    $scope.pages.push({index : i + 1})
                }
                $scope.index = 1;
                $scope.ceilingIndex = 5;
                $scope.searcher($scope.index,$scope.size);
            });
            $scope.toFirst = function() {
                $scope.index = 1;
                $scope.ceilingIndex = 5;
                $scope.searcher($scope.index,$scope.size);
            };
            $scope.toLast = function() {
                $scope.index = $scope.pages.length;
                $scope.ceilingIndex = $scope.pages.length;
                $scope.searcher($scope.index,$scope.size);
            };
            $scope.searchPrevious = function() {
                if(($scope.ceilingIndex == $scope.index + 4) && ($scope.index>1)){
                    $scope.ceilingIndex--;
                }
                if ($scope.index > 1) {
                    --$scope.index;
                    $scope.searcher($scope.index,$scope.size);
                }
            };

            $scope.searchNext = function() {
                if(($scope.ceilingIndex == $scope.index) && ($scope.index<$scope.pages.length)){
                    $scope.ceilingIndex++;
                }
                if ($scope.index < $scope.pages.length) {
                    ++$scope.index;
                    $scope.searcher($scope.index,$scope.size);
                }
            };

            $scope.searchIndex = function(i) {
                $scope.index = i;
                $scope.searcher($scope.index,$scope.size);
            };

            $scope.toPage = function(myIndex){
                $scope.ceilingIndex = Math.min(Number.parseInt(myIndex)+4,$scope.pages.length);
                $scope.searchIndex(myIndex);
            }
        }
    }
}]);


applicationApp.directive('ropTreeView', ['$compile', function ($compile) {
    return {
        restrict: "AE",
        scope: {
            data: '=data',
            field: '=field',
            option: '=option'
        },
        replace: true,
        templateUrl: "/js/angular/template/tree_view.html",
        link: function($scope, element, attrs){
            var collapsed = [], checked = [];
            // 不想影响原数据
            try{
                $scope.data = JSON.parse(attrs.data);
            }catch(e){
                $scope.data = $scope.$parent[attrs.data];
            }

            var recur = function(item, runner){
                if(item[$scope.field.children] && (item[$scope.field.children].length)){
                    item[$scope.field.children].forEach(function(subItem){
                        runner(subItem, item);
                        recur(subItem, runner);
                    });
                }
            },recur_counter = function(item,checked){
                var allUnchecked = true;
                item[$scope.field.children] && item[$scope.field.children].forEach(function(brother){
                    if(checked){
                        (!brother[$scope.field.checked]) && (allUnchecked = false);
                    } else {
                        (brother[$scope.field.checked]) && (allUnchecked = false);
                    }
                });
                if(allUnchecked){
                    item[$scope.field.checked] = checked;
                    item._parent && recur_counter(item._parent,checked);
                }
            }

            var watcher = function(){
                !$scope.option && ($scope.option = {});
                if($scope.field){
                    !$scope.field.id && ($scope.field.id = "_id");
                    !$scope.field.label && ($scope.field.id = "_label");
                    !$scope.field.children && ($scope.field.children = "_children");
                    !$scope.field.checked && ($scope.field.checked = "_checked");
                    !$scope.field.collapsed && ($scope.field.collapsed = "_collapsed");
                    /*!$scope.field.selected && ($scope.field.selected = "_selected");*/
                }
                if($scope.data){
                    $scope.data.forEach(function(item){
                        if(item[$scope.field.children] && item[$scope.field.children].length){
                            $scope.option.collapseAll ? (item[$scope.field.collapsed] = true):(item[$scope.field.collapsed] = false);
                        }
                        recur(item, function(node, parent){
                            node._parent = parent;
                            if(node[$scope.field.children] && node[$scope.field.children].length){
                                $scope.option.collapseAll ? (node[$scope.field.collapsed] = true):(node[$scope.field.collapsed] = false);
                            }
                        })
                    });
                }
            }

            $scope.$watch("data", function() {
                watcher();
            });

            window.test = $scope.$parent;
            $scope.$parent.RopTreeView = {};
            $scope.$parent.RopTreeView.getChecked = function(){
                var list = [];
                if($scope.data){
                    $scope.data.forEach(function(item){
                        if(item[$scope.field.checked]){
                            list.push(item);
                        }
                        recur(item, function(node){
                            if(node[$scope.field.checked]){
                                list.push(node);
                            }
                        })
                    });
                }
                return list;
            }
            $scope.toggleChecked = function(item){
                item[$scope.field.checked] = !item[$scope.field.checked];
                recur(item, function(node){
                    node[$scope.field.checked] = item[$scope.field.checked];
                });

                if(!item[$scope.field.checked]){
                    item._parent && recur_counter(item._parent,false);
                } else {
                    if(item._parent){
                        item._parent[$scope.field.checked] = item[$scope.field.checked];
                        if(item._parent._parent){
                            item._parent._parent[$scope.field.checked] = item[$scope.field.checked];
                        }
                    }
                }

            }

            $scope.toggleCollapse = function(item){
                item[$scope.field.collapsed] = !item[$scope.field.collapsed];
            }
        }
    }
}]);
// TODO 2
(function (window, angular, applicationApp) {
    "use strict";
    (function (applicationApp) {
        'use strict';
        applicationApp.directive('mdSpinnerCalendar', calendarDirective);
        var TBODY_HEIGHT = 160;

        /**
         * Height of a calendar month with a single row. This is needed to calculate the offset for
         * rendering an extra month in virtual-repeat that only contains one row.
         */
        var TBODY_SINGLE_ROW_HEIGHT = 24;

        function calendarDirective() {
            return {
                template: '<div aria-hidden="true" class="md-calendar-time-header"><span ng-bind="hh"></span><input ng-model="mm" type="text"/></div>' +
                '<div class="md-calendar-wrapper"><div class="md-calendar">' +
                '<md-slider md-discrete ng-model="hh" step="1" min="0" max="24" aria-label="rating" class="md-primary"> </md-slider>' +
                '<md-slider md-discrete ng-model="mm" step="1" min="0" max="60" aria-label="rating" class="md-warn"> </md-slider>' +
                '<md-slider md-discrete ng-model="ss" step="1" min="0" max="60" aria-label="rating" class="md-accent"> </md-slider>' +
                '</div></div>',
                scope: {
                    time: '=time',
                },
                require: ['ngModel', 'mdSpinnerCalendar'],
                controller: CalendarCtrl,
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attrs, controllers) {
                    var ngModelCtrl = controllers[0];
                    var mdCalendarCtrl = controllers[1];
                    mdCalendarCtrl.configureNgModel(ngModelCtrl);
                }
            };
        }

        /** Class applied to the selected date cell/. */
        var SELECTED_DATE_CLASS = 'md-calendar-selected-date';

        /** Class applied to the focused date cell/. */
        var FOCUSED_DATE_CLASS = 'md-focus';

        /** Next identifier for calendar instance. */
        var nextUniqueId = 0;

        /** The first renderable date in the virtual-scrolling calendar (for all instances). */
        var firstRenderableDate = null;

        /**
         * Controller for the mdCalendar component.
         * ngInject @constructor
         */
        function CalendarCtrl($element, $attrs, $scope, $animate, $q, $mdConstant,
                              $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil) {
            $mdTheming($element);
            /**
             * Dummy array-like object for virtual-repeat to iterate over. The length is the total
             * number of months that can be viewed. This is shorter than ideal because of (potential)
             * Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1181658.
             */
            this.items = {length: 2000};
            this.spinnerIndex = 0;
            if (this.maxDate && this.minDate) {
                // Limit the number of months if min and max dates are set.
                var numMonths = $$mdDateUtil.getMonthDistance(this.minDate, this.maxDate) + 1;
                numMonths = Math.max(numMonths, 1);
                // Add an additional month as the final dummy month for rendering purposes.
                numMonths += 1;
                this.items.length = numMonths;
            }

            /** @final {!angular.$animate} */
            this.$animate = $animate;

            /** @final {!angular.$q} */
            this.$q = $q;

            /** @final */
            this.$mdInkRipple = $mdInkRipple;

            /** @final */
            this.$mdUtil = $mdUtil;

            /** @final */
            this.keyCode = $mdConstant.KEY_CODE;

            /** @final */
            this.dateUtil = $$mdDateUtil;

            /** @final */
            this.dateLocale = $mdDateLocale;

            /** @final {!angular.JQLite} */
            this.$element = $element;

            /** @final {!angular.Scope} */
            this.$scope = $scope;

            /** @final {HTMLElement} */
            this.calendarElement = $element[0].querySelector('.md-calendar');

            /** @final {HTMLElement} */
            this.calendarScroller = $element[0].querySelector('.md-virtual-repeat-scroller');

            /** @final {Date} */
            this.today = this.dateUtil.createDateAtMidnight();

            /** @type {Date} */
            this.firstRenderableDate = this.dateUtil.incrementMonths(this.today, -this.items.length / 2);

            if (this.minDate && this.minDate > this.firstRenderableDate) {
                this.firstRenderableDate = this.minDate;
            } else if (this.maxDate) {
                // Calculate the difference between the start date and max date.
                // Subtract 1 because it's an inclusive difference and 1 for the final dummy month.
                //
                var monthDifference = this.items.length - 2;
                this.firstRenderableDate = this.dateUtil.incrementMonths(this.maxDate, -(this.items.length - 2));
            }


            /** @final {number} Unique ID for this calendar instance. */
            this.id = nextUniqueId++;

            /** @type {!angular.NgModelController} */
            this.ngModelCtrl = null;

            /**
             * The selected date. Keep track of this separately from the ng-model value so that we
             * can know, when the ng-model value changes, what the previous value was before it's updated
             * in the component's UI.
             *
             * @type {Date}
             */
            this.selectedDate = null;

            /**
             * The date that is currently focused or showing in the calendar. This will initially be set
             * to the ng-model value if set, otherwise to today. It will be updated as the user navigates
             * to other months. The cell corresponding to the displayDate does not necesarily always have
             * focus in the document (such as for cases when the user is scrolling the calendar).
             * @type {Date}
             */
            this.displayDate = null;

            /**
             * The date that has or should have focus.
             * @type {Date}
             */
            this.focusDate = null;

            /** @type {boolean} */
            this.isInitialized = false;

            /** @type {boolean} */
            this.isMonthTransitionInProgress = false;

            // Unless the user specifies so, the calendar should not be a tab stop.
            // This is necessary because ngAria might add a tabindex to anything with an ng-model
            // (based on whether or not the user has turned that particular feature on/off).
            if (!$attrs['tabindex']) {
                $element.attr('tabindex', '-1');
            }

            var self = this;

            /**
             * Handles a click event on a date cell.
             * Created here so that every cell can use the same function instance.
             * @this {HTMLTableCellElement} The cell that was clicked.
             */
            this.cellClickHandler = function () {
                var cellElement = this;
                if (this.hasAttribute('data-timestamp')) {
                    $scope.$apply(function () {
                        var timestamp = Number(cellElement.getAttribute('data-timestamp'));
                        self.setNgModelValue(self.dateUtil.createDateAtMidnight(timestamp));
                    });
                }
            };

            this.attachCalendarEventListeners();
        }

        CalendarCtrl.$inject = ["$element", "$attrs", "$scope", "$animate", "$q", "$mdConstant", "$mdTheming", "$$mdDateUtil", "$mdDateLocale", "$mdInkRipple", "$mdUtil"];

        CalendarCtrl.prototype.getTime = function () {
            return `${this.$scope.hh} : ${this.$scope.mm} : ${this.$scope.ss}`;
        }
        CalendarCtrl.prototype.lastYear = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.spinnerIndex -= 12;
        }
        CalendarCtrl.prototype.nextYear = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.spinnerIndex += 12;
        }
        /*** Initialization ***/

        /**
         * Sets up the controller's reference to ngModelController.
         * @param {!angular.NgModelController} ngModelCtrl
         */
        CalendarCtrl.prototype.configureNgModel = function (ngModelCtrl) {
            this.ngModelCtrl = ngModelCtrl;

            var self = this;
            ngModelCtrl.$render = function () {
                self.changeSelectedDate(self.ngModelCtrl.$viewValue);
            };
        };

        /**
         * Initialize the calendar by building the months that are initially visible.
         * Initialization should occur after the ngModel value is known.
         */
        CalendarCtrl.prototype.buildInitialCalendarDisplay = function () {
            this.buildWeekHeader();
            this.hideVerticalScrollbar();

            this.displayDate = this.selectedDate || this.today;
            this.isInitialized = true;
        };

        /**
         * Hides the vertical scrollbar on the calendar scroller by setting the width on the
         * calendar scroller and the `overflow: hidden` wrapper around the scroller, and then setting
         * a padding-right on the scroller equal to the width of the browser's scrollbar.
         *
         * This will cause a reflow.
         */
        CalendarCtrl.prototype.hideVerticalScrollbar = function () {
            /*var element = this.$element[0];

             var scrollMask = element.querySelector('.md-calendar-scroll-mask');
             var scroller = this.calendarScroller;

             var headerWidth = element.querySelector('.md-calendar-day-header').clientWidth;
             var scrollbarWidth = scroller.offsetWidth - scroller.clientWidth;

             scrollMask.style.width = headerWidth + 'px';
             scroller.style.width = (headerWidth + scrollbarWidth) + 'px';
             scroller.style.paddingRight = scrollbarWidth + 'px';*/
        };


        /** Attach event listeners for the calendar. */
        CalendarCtrl.prototype.attachCalendarEventListeners = function () {
            // Keyboard interaction.
            this.$element.on('keydown', angular.bind(this, this.handleKeyEvent));
        };

        /*** User input handling ***/

        /**
         * Handles a key event in the calendar with the appropriate action. The action will either
         * be to select the focused date or to navigate to focus a new date.
         * @param {KeyboardEvent} event
         */
        CalendarCtrl.prototype.handleKeyEvent = function (event) {
            var self = this;
            this.$scope.$apply(function () {
                // Capture escape and emit back up so that a wrapping component
                // (such as a date-picker) can decide to close.
                if (event.which == self.keyCode.ESCAPE || event.which == self.keyCode.TAB) {
                    self.$scope.$emit('md-calendar-close');

                    if (event.which == self.keyCode.TAB) {
                        event.preventDefault();
                    }

                    return;
                }

                // Remaining key events fall into two categories: selection and navigation.
                // Start by checking if this is a selection event.
                if (event.which === self.keyCode.ENTER) {
                    self.setNgModelValue(self.displayDate);
                    event.preventDefault();
                    return;
                }

                // Selection isn't occuring, so the key event is either navigation or nothing.
                var date = self.getFocusDateFromKeyEvent(event);
                if (date) {
                    date = self.boundDateByMinAndMax(date);
                    event.preventDefault();
                    event.stopPropagation();

                    // Since this is a keyboard interaction, actually give the newly focused date keyboard
                    // focus after the been brought into view.
                    self.changeDisplayDate(date).then(function () {
                        self.focus(date);
                    });
                }
            });
        };

        /**
         * Gets the date to focus as the result of a key event.
         * @param {KeyboardEvent} event
         * @returns {Date} Date to navigate to, or null if the key does not match a calendar shortcut.
         */
        CalendarCtrl.prototype.getFocusDateFromKeyEvent = function (event) {
            var dateUtil = this.dateUtil;
            var keyCode = this.keyCode;

            switch (event.which) {
                case keyCode.RIGHT_ARROW:
                    return dateUtil.incrementDays(this.displayDate, 1);
                case keyCode.LEFT_ARROW:
                    return dateUtil.incrementDays(this.displayDate, -1);
                case keyCode.DOWN_ARROW:
                    return event.metaKey ?
                        dateUtil.incrementMonths(this.displayDate, 1) :
                        dateUtil.incrementDays(this.displayDate, 7);
                case keyCode.UP_ARROW:
                    return event.metaKey ?
                        dateUtil.incrementMonths(this.displayDate, -1) :
                        dateUtil.incrementDays(this.displayDate, -7);
                case keyCode.PAGE_DOWN:
                    return dateUtil.incrementMonths(this.displayDate, 1);
                case keyCode.PAGE_UP:
                    return dateUtil.incrementMonths(this.displayDate, -1);
                case keyCode.HOME:
                    return dateUtil.getFirstDateOfMonth(this.displayDate);
                case keyCode.END:
                    return dateUtil.getLastDateOfMonth(this.displayDate);
                default:
                    return null;
            }
        };

        /**
         * Gets the "index" of the currently selected date as it would be in the virtual-repeat.
         * @returns {number}
         */
        CalendarCtrl.prototype.getSelectedMonthIndex = function () {
            return this.dateUtil.getMonthDistance(this.firstRenderableDate,
                this.selectedDate || this.today);
        };

        /**
         * Scrolls to the month of the given date.
         * @param {Date} date
         */
        CalendarCtrl.prototype.scrollToMonth = function (date) {
            if (!this.dateUtil.isValidDate(date)) {
                return;
            }

            var monthDistance = this.dateUtil.getMonthDistance(this.firstRenderableDate, date);
            this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;
        };

        /**
         * Sets the ng-model value for the calendar and emits a change event.
         * @param {Date} date
         */
        CalendarCtrl.prototype.setNgModelValue = function (date) {
            this.$scope.$emit('md-calendar-change', date);
            this.ngModelCtrl.$setViewValue(date);
            this.ngModelCtrl.$render();
        };

        /**
         * Focus the cell corresponding to the given date.
         * @param {Date=} opt_date
         */
        CalendarCtrl.prototype.focus = function (opt_date) {
            /*var date = opt_date || this.selectedDate || this.today;

             var previousFocus = this.calendarElement.querySelector('.md-focus');
             if (previousFocus) {
             previousFocus.classList.remove(FOCUSED_DATE_CLASS);
             }

             var cellId = this.getDateId(date);
             var cell = document.getElementById(cellId);
             if (cell) {
             cell.classList.add(FOCUSED_DATE_CLASS);
             cell.focus();
             } else {
             this.focusDate = date;
             }*/
        };

        /**
         * If a date exceeds minDate or maxDate, returns date matching minDate or maxDate, respectively.
         * Otherwise, returns the date.
         * @param {Date} date
         * @return {Date}
         */
        CalendarCtrl.prototype.boundDateByMinAndMax = function (date) {
            var boundDate = date;
            if (this.minDate && date < this.minDate) {
                boundDate = new Date(this.minDate.getTime());
            }
            if (this.maxDate && date > this.maxDate) {
                boundDate = new Date(this.maxDate.getTime());
            }
            return boundDate;
        };

        /*** Updating the displayed / selected date ***/

        /**
         * Change the selected date in the calendar (ngModel value has already been changed).
         * @param {Date} date
         */
        CalendarCtrl.prototype.changeSelectedDate = function (date) {
            var self = this;
            var previousSelectedDate = this.selectedDate;
            this.selectedDate = date;
            this.changeDisplayDate(date).then(function () {

                // Remove the selected class from the previously selected date, if any.
                if (previousSelectedDate) {
                    var prevDateCell =
                        document.getElementById(self.getDateId(previousSelectedDate));
                    if (prevDateCell) {
                        prevDateCell.classList.remove(SELECTED_DATE_CLASS);
                        prevDateCell.setAttribute('aria-selected', 'false');
                    }
                }

                // Apply the select class to the new selected date if it is set.
                if (date) {
                    var dateCell = document.getElementById(self.getDateId(date));
                    if (dateCell) {
                        dateCell.classList.add(SELECTED_DATE_CLASS);
                        dateCell.setAttribute('aria-selected', 'true');
                    }
                }
            });
        };


        /**
         * Change the date that is being shown in the calendar. If the given date is in a different
         * month, the displayed month will be transitioned.
         * @param {Date} date
         */
        CalendarCtrl.prototype.changeDisplayDate = function (date) {
            // Initialization is deferred until this function is called because we want to reflect
            // the starting value of ngModel.
            if (!this.isInitialized) {
                this.buildInitialCalendarDisplay();
                return this.$q.when();
            }

            // If trying to show an invalid date or a transition is in progress, do nothing.
            if (!this.dateUtil.isValidDate(date) || this.isMonthTransitionInProgress) {
                return this.$q.when();
            }

            this.isMonthTransitionInProgress = true;
            var animationPromise = this.animateDateChange(date);

            this.displayDate = date;

            var self = this;
            animationPromise.then(function () {
                self.isMonthTransitionInProgress = false;
            });

            return animationPromise;
        };

        /**
         * Animates the transition from the calendar's current month to the given month.
         * @param {Date} date
         * @returns {angular.$q.Promise} The animation promise.
         */
        CalendarCtrl.prototype.animateDateChange = function (date) {
            this.scrollToMonth(date);
            return this.$q.when();
        };

        /*** Constructing the calendar table ***/

        /**
         * Builds and appends a day-of-the-week header to the calendar.
         * This should only need to be called once during initialization.
         */
        CalendarCtrl.prototype.buildWeekHeader = function () {
            /*var firstDayOfWeek = this.dateLocale.firstDayOfWeek;
             var shortDays = this.dateLocale.shortDays;

             var row = document.createElement('tr');
             for (var i = 0; i < 7; i++) {
             var th = document.createElement('th');
             th.textContent = shortDays[(i + firstDayOfWeek) % 7];
             row.appendChild(th);
             }

             this.$element.find('thead').append(row);*/
        };

        /**
         * Gets an identifier for a date unique to the calendar instance for internal
         * purposes. Not to be displayed.
         * @param {Date} date
         * @returns {string}
         */
        CalendarCtrl.prototype.getDateId = function (date) {
            return [
                'md',
                this.id,
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ].join('-');
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';


        applicationApp.directive('mdSpinnerCalendarMonth', mdCalendarMonthDirective);


        /**
         * Private directive consumed by md-calendar. Having this directive lets the calender use
         * md-virtual-repeat and also cleanly separates the month DOM construction functions from
         * the rest of the calendar controller logic.
         */
        function mdCalendarMonthDirective() {
            return {
                require: ['^^mdSpinnerCalendar', 'mdSpinnerCalendarMonth'],
                scope: {offset: '=mdMonthOffset'},
                controller: CalendarMonthCtrl,
                controllerAs: 'mdMonthCtrl',
                bindToController: true,
                link: function (scope, element, attrs, controllers) {
                    var calendarCtrl = controllers[0];
                    var monthCtrl = controllers[1];

                    monthCtrl.calendarCtrl = calendarCtrl;
                    monthCtrl.generateContent();

                    // The virtual-repeat re-uses the same DOM elements, so there are only a limited number
                    // of repeated items that are linked, and then those elements have their bindings updataed.
                    // Since the months are not generated by bindings, we simply regenerate the entire thing
                    // when the binding (offset) changes.
                    scope.$watch(function () {
                        return monthCtrl.offset;
                    }, function (offset, oldOffset) {
                        if (offset != oldOffset) {
                            monthCtrl.generateContent();
                        }
                    });
                }
            };
        }

        /** Class applied to the cell for today. */
        var TODAY_CLASS = 'md-calendar-date-today';

        /** Class applied to the selected date cell/. */
        var SELECTED_DATE_CLASS = 'md-calendar-selected-date';

        /** Class applied to the focused date cell/. */
        var FOCUSED_DATE_CLASS = 'md-focus';

        /**
         * Controller for a single calendar month.
         * ngInject @constructor
         */
        function CalendarMonthCtrl($element, $$mdDateUtil, $mdDateLocale) {
            this.dateUtil = $$mdDateUtil;
            this.dateLocale = $mdDateLocale;
            this.$element = $element;
            this.calendarCtrl = null;

            /**
             * Number of months from the start of the month "items" that the currently rendered month
             * occurs. Set via angular data binding.
             * @type {number}
             */
            this.offset;

            /**
             * Date cell to focus after appending the month to the document.
             * @type {HTMLElement}
             */
            this.focusAfterAppend = null;
        }

        CalendarMonthCtrl.$inject = ["$element", "$$mdDateUtil", "$mdDateLocale"];

        /** Generate and append the content for this month to the directive element. */
        CalendarMonthCtrl.prototype.generateContent = function () {
            var calendarCtrl = this.calendarCtrl;
            var date = this.dateUtil.incrementMonths(calendarCtrl.firstRenderableDate, this.offset);

            this.$element.empty();
            this.$element.append(this.buildCalendarForMonth(date));

            if (this.focusAfterAppend) {
                this.focusAfterAppend.classList.add(FOCUSED_DATE_CLASS);
                this.focusAfterAppend.focus();
                this.focusAfterAppend = null;
            }
        };

        /**
         * Creates a single cell to contain a date in the calendar with all appropriate
         * attributes and classes added. If a date is given, the cell content will be set
         * based on the date.
         * @param {Date=} opt_date
         * @returns {HTMLElement}
         */
        CalendarMonthCtrl.prototype.buildDateCell = function (opt_date) {
            var calendarCtrl = this.calendarCtrl;

            // TODO(jelbourn): cloneNode is likely a faster way of doing this.
            var cell = document.createElement('td');
            cell.tabIndex = -1;
            cell.classList.add('md-calendar-date');
            cell.setAttribute('role', 'gridcell');

            if (opt_date) {
                cell.setAttribute('tabindex', '-1');
                cell.setAttribute('aria-label', this.dateLocale.longDateFormatter(opt_date));
                cell.id = calendarCtrl.getDateId(opt_date);

                // Use `data-timestamp` attribute because IE10 does not support the `dataset` property.
                cell.setAttribute('data-timestamp', opt_date.getTime());

                // TODO(jelourn): Doing these comparisons for class addition during generation might be slow.
                // It may be better to finish the construction and then query the node and add the class.
                if (this.dateUtil.isSameDay(opt_date, calendarCtrl.today)) {
                    cell.classList.add(TODAY_CLASS);
                }

                if (this.dateUtil.isValidDate(calendarCtrl.selectedDate) &&
                    this.dateUtil.isSameDay(opt_date, calendarCtrl.selectedDate)) {
                    cell.classList.add(SELECTED_DATE_CLASS);
                    cell.setAttribute('aria-selected', 'true');
                }

                var cellText = this.dateLocale.dates[opt_date.getDate()];

                if (this.isDateEnabled(opt_date)) {
                    // Add a indicator for select, hover, and focus states.
                    var selectionIndicator = document.createElement('span');
                    cell.appendChild(selectionIndicator);
                    selectionIndicator.classList.add('md-calendar-date-selection-indicator');
                    selectionIndicator.textContent = cellText;

                    cell.addEventListener('click', calendarCtrl.cellClickHandler);

                    if (calendarCtrl.focusDate && this.dateUtil.isSameDay(opt_date, calendarCtrl.focusDate)) {
                        this.focusAfterAppend = cell;
                    }
                } else {
                    cell.classList.add('md-calendar-date-disabled');
                    cell.textContent = cellText;
                }
            }

            return cell;
        };

        /**
         * Check whether date is in range and enabled
         * @param {Date=} opt_date
         * @return {boolean} Whether the date is enabled.
         */
        CalendarMonthCtrl.prototype.isDateEnabled = function (opt_date) {
            return this.dateUtil.isDateWithinRange(opt_date,
                    this.calendarCtrl.minDate, this.calendarCtrl.maxDate) &&
                (!angular.isFunction(this.calendarCtrl.dateFilter)
                || this.calendarCtrl.dateFilter(opt_date));
        }

        /**
         * Builds a `tr` element for the calendar grid.
         * @param rowNumber The week number within the month.
         * @returns {HTMLElement}
         */
        CalendarMonthCtrl.prototype.buildDateRow = function (rowNumber) {
            var row = document.createElement('tr');
            row.setAttribute('role', 'row');

            // Because of an NVDA bug (with Firefox), the row needs an aria-label in order
            // to prevent the entire row being read aloud when the user moves between rows.
            // See http://community.nvda-project.org/ticket/4643.
            row.setAttribute('aria-label', this.dateLocale.weekNumberFormatter(rowNumber));

            return row;
        };

        /**
         * Builds the <tbody> content for the given date's month.
         * @param {Date=} opt_dateInMonth
         * @returns {DocumentFragment} A document fragment containing the <tr> elements.
         */
        CalendarMonthCtrl.prototype.buildCalendarForMonth = function (opt_dateInMonth) {
            var date = this.dateUtil.isValidDate(opt_dateInMonth) ? opt_dateInMonth : new Date();

            var firstDayOfMonth = this.dateUtil.getFirstDateOfMonth(date);
            var firstDayOfTheWeek = this.getLocaleDay_(firstDayOfMonth);
            var numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(date);

            // Store rows for the month in a document fragment so that we can append them all at once.
            var monthBody = document.createDocumentFragment();

            var rowNumber = 1;
            var row = this.buildDateRow(rowNumber);
            monthBody.appendChild(row);

            // If this is the final month in the list of items, only the first week should render,
            // so we should return immediately after the first row is complete and has been
            // attached to the body.
            var isFinalMonth = this.offset === this.calendarCtrl.items.length - 1;

            // Add a label for the month. If the month starts on a Sun/Mon/Tues, the month label
            // goes on a row above the first of the month. Otherwise, the month label takes up the first
            // two cells of the first row.
            var blankCellOffset = 0;
            var monthLabelCell = document.createElement('td');
            monthLabelCell.classList.add('md-calendar-month-label');
            // If the entire month is after the max date, render the label as a disabled state.
            if (this.calendarCtrl.maxDate && firstDayOfMonth > this.calendarCtrl.maxDate) {
                monthLabelCell.classList.add('md-calendar-month-label-disabled');
            }
            monthLabelCell.textContent = this.dateLocale.monthHeaderFormatter(date);
            if (firstDayOfTheWeek <= 2) {
                monthLabelCell.setAttribute('colspan', '7');

                var monthLabelRow = this.buildDateRow();
                monthLabelRow.appendChild(monthLabelCell);
                monthBody.insertBefore(monthLabelRow, row);

                if (isFinalMonth) {
                    return monthBody;
                }
            } else {
                blankCellOffset = 2;
                monthLabelCell.setAttribute('colspan', '2');
                row.appendChild(monthLabelCell);
            }

            // Add a blank cell for each day of the week that occurs before the first of the month.
            // For example, if the first day of the month is a Tuesday, add blank cells for Sun and Mon.
            // The blankCellOffset is needed in cases where the first N cells are used by the month label.
            for (var i = blankCellOffset; i < firstDayOfTheWeek; i++) {
                row.appendChild(this.buildDateCell());
            }

            // Add a cell for each day of the month, keeping track of the day of the week so that
            // we know when to start a new row.
            var dayOfWeek = firstDayOfTheWeek;
            var iterationDate = firstDayOfMonth;
            for (var d = 1; d <= numberOfDaysInMonth; d++) {
                // If we've reached the end of the week, start a new row.
                if (dayOfWeek === 7) {
                    // We've finished the first row, so we're done if this is the final month.
                    if (isFinalMonth) {
                        return monthBody;
                    }
                    dayOfWeek = 0;
                    rowNumber++;
                    row = this.buildDateRow(rowNumber);
                    monthBody.appendChild(row);
                }

                iterationDate.setDate(d);
                var cell = this.buildDateCell(iterationDate);
                row.appendChild(cell);

                dayOfWeek++;
            }

            // Ensure that the last row of the month has 7 cells.
            while (row.childNodes.length < 7) {
                row.appendChild(this.buildDateCell());
            }

            // Ensure that all months have 6 rows. This is necessary for now because the virtual-repeat
            // requires that all items have exactly the same height.
            while (monthBody.childNodes.length < 6) {
                var whitespaceRow = this.buildDateRow();
                for (var i = 0; i < 7; i++) {
                    whitespaceRow.appendChild(this.buildDateCell());
                }
                monthBody.appendChild(whitespaceRow);
            }

            return monthBody;
        };

        /**
         * Gets the day-of-the-week index for a date for the current locale.
         * @private
         * @param {Date} date
         * @returns {number} The column index of the date in the calendar.
         */
        CalendarMonthCtrl.prototype.getLocaleDay_ = function (date) {
            return (date.getDay() + (7 - this.dateLocale.firstDayOfWeek)) % 7
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        /**
         * @ngdoc service
         * @name $mdDateLocaleProvider
         * @module material.components.datepicker
         *
         * @description
         * The `$mdDateLocaleProvider` is the provider that creates the `$mdDateLocale` service.
         * This provider that allows the user to specify messages, formatters, and parsers for date
         * internationalization. The `$mdDateLocale` service itself is consumed by Angular Material
         * components that deal with dates.
         *
         * @property {(Array<string>)=} months Array of month names (in order).
         * @property {(Array<string>)=} shortMonths Array of abbreviated month names.
         * @property {(Array<string>)=} days Array of the days of the week (in order).
         * @property {(Array<string>)=} shortDays Array of abbreviated dayes of the week.
         * @property {(Array<string>)=} dates Array of dates of the month. Only necessary for locales
         *     using a numeral system other than [1, 2, 3...].
         * @property {(Array<string>)=} firstDayOfWeek The first day of the week. Sunday = 0, Monday = 1,
         *    etc.
         * @property {(function(string): Date)=} parseDate Function to parse a date object from a string.
         * @property {(function(Date): string)=} formatDate Function to format a date object to a string.
         * @property {(function(Date): string)=} monthHeaderFormatter Function that returns the label for
         *     a month given a date.
         * @property {(function(number): string)=} weekNumberFormatter Function that returns a label for
         *     a week given the week number.
         * @property {(string)=} msgCalendar Translation of the label "Calendar" for the current locale.
         * @property {(string)=} msgOpenCalendar Translation of the button label "Open calendar" for the
         *     current locale.
         *
         * @usage
         * <hljs lang="js">
         *   myAppModule.config(function($mdDateLocaleProvider) {
   *
   *     // Example of a French localization.
   *     $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', ...];
   *     $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', ...];
   *     $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', ...];
   *     $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', ...];
   *
   *     // Can change week display to start on Monday.
   *     $mdDateLocaleProvider.firstDayOfWeek = 1;
   *
   *     // Optional.
   *     $mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];
   *
   *     // Example uses moment.js to parse and format dates.
   *     $mdDateLocaleProvider.parseDate = function(dateString) {
   *       var m = moment(dateString, 'L', true);
   *       return m.isValid() ? m.toDate() : new Date(NaN);
   *     };
   *
   *     $mdDateLocaleProvider.formatDate = function(date) {
   *       return moment(date).format('L');
   *     };
   *
   *     $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
   *       return myShortMonths[date.getMonth()] + ' ' + date.getFullYear();
   *     };
   *
   *     // In addition to date display, date components also need localized messages
   *     // for aria-labels for screen-reader users.
   *
   *     $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
   *       return 'Semaine ' + weekNumber;
   *     };
   *
   *     $mdDateLocaleProvider.msgCalendar = 'Calendrier';
   *     $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
   *
   * });
         * </hljs>
         *
         */

        applicationApp.config(["$provide", function ($provide) {
            // TODO(jelbourn): Assert provided values are correctly formatted. Need assertions.

            /** @constructor */
            function DateLocaleProvider() {
                /** Array of full month names. E.g., ['January', 'Febuary', ...] */
                this.months = null;

                /** Array of abbreviated month names. E.g., ['Jan', 'Feb', ...] */
                this.shortMonths = null;

                /** Array of full day of the week names. E.g., ['Monday', 'Tuesday', ...] */
                this.days = null;

                /** Array of abbreviated dat of the week names. E.g., ['M', 'T', ...] */
                this.shortDays = null;

                /** Array of dates of a month (1 - 31). Characters might be different in some locales. */
                this.dates = null;

                /** Index of the first day of the week. 0 = Sunday, 1 = Monday, etc. */
                this.firstDayOfWeek = 0;

                /**
                 * Function that converts the date portion of a Date to a string.
                 * @type {(function(Date): string)}
                 */
                this.formatDate = null;

                /**
                 * Function that converts a date string to a Date object (the date portion)
                 * @type {function(string): Date}
                 */
                this.parseDate = null;

                /**
                 * Function that formats a Date into a month header string.
                 * @type {function(Date): string}
                 */
                this.monthHeaderFormatter = null;

                /**
                 * Function that formats a week number into a label for the week.
                 * @type {function(number): string}
                 */
                this.weekNumberFormatter = null;

                /**
                 * Function that formats a date into a long aria-label that is read
                 * when the focused date changes.
                 * @type {function(Date): string}
                 */
                this.longDateFormatter = null;

                /**
                 * ARIA label for the calendar "dialog" used in the datepicker.
                 * @type {string}
                 */
                this.msgCalendar = '';

                /**
                 * ARIA label for the datepicker's "Open calendar" buttons.
                 * @type {string}
                 */
                this.msgOpenCalendar = '';
            }

            /**
             * Factory function that returns an instance of the dateLocale service.
             * ngInject
             * @param $locale
             * @returns {DateLocale}
             */
            DateLocaleProvider.prototype.$get = function ($locale) {
                /**
                 * Default date-to-string formatting function.
                 * @param {!Date} date
                 * @returns {string}
                 */
                function defaultFormatDate(date) {
                    if (!date) {
                        return '';
                    }

                    // All of the dates created through ng-material *should* be set to midnight.
                    // If we encounter a date where the localeTime shows at 11pm instead of midnight,
                    // we have run into an issue with DST where we need to increment the hour by one:
                    // var d = new Date(1992, 9, 8, 0, 0, 0);
                    // d.toLocaleString(); // == "10/7/1992, 11:00:00 PM"
                    var localeTime = date.toLocaleTimeString();
                    var formatDate = date;
                    if (date.getHours() == 0 &&
                        (localeTime.indexOf('11:') !== -1 || localeTime.indexOf('23:') !== -1)) {
                        formatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0);
                    }

                    return [formatDate.getFullYear(), service.months[formatDate.getMonth()], service.dates[formatDate.getDate()]].join("-");
                    //return formatDate.toLocaleDateString();
                }

                /**
                 * Default string-to-date parsing function.
                 * @param {string} dateString
                 * @returns {!Date}
                 */
                function defaultParseDate(dateString) {
                    return new Date(dateString);
                }

                /**
                 * Default function to determine whether a string makes sense to be
                 * parsed to a Date object.
                 *
                 * This is very permissive and is just a basic sanity check to ensure that
                 * things like single integers aren't able to be parsed into dates.
                 * @param {string} dateString
                 * @returns {boolean}
                 */
                function defaultIsDateComplete(dateString) {
                    dateString = dateString.trim();

                    // Looks for three chunks of content (either numbers or text) separated
                    // by delimiters.
                    var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ \.,]+|[\/\-])){2}([a-zA-Z]{3,}|[0-9]{1,4})$/;
                    return re.test(dateString);
                }

                /**
                 * Default date-to-string formatter to get a month header.
                 * @param {!Date} date
                 * @returns {string}
                 */
                function defaultMonthHeaderFormatter(date) {
                    return service.shortMonths[date.getMonth()]/* + ' ' + date.getFullYear()*/;
                }

                /**
                 * Default week number formatter.
                 * @param number
                 * @returns {string}
                 */
                function defaultWeekNumberFormatter(number) {
                    return 'Week ' + number;
                }

                /**
                 * Default formatter for date cell aria-labels.
                 * @param {!Date} date
                 * @returns {string}
                 */
                function defaultLongDateFormatter(date) {
                    // Example: 'Thursday June 18 2015'
                    return [
                        service.days[date.getDay()],
                        service.months[date.getMonth()],
                        service.dates[date.getDate()],
                        date.getFullYear()
                    ].join(' ');
                }

                // The default "short" day strings are the first character of each day,
                // e.g., "Monday" => "M".
                var defaultShortDays = ['日', '一', '二', '三', '四', '五', '六'];
                /*$locale.DATETIME_FORMATS.DAY.map(function (day) {
                 return day[0];
                 });*/

                // The default dates are simply the numbers 1 through 31.
                var defaultDates = Array(32);
                for (var i = 1; i <= 31; i++) {
                    defaultDates[i] = i;
                }

                // Default ARIA messages are in English (US).
                var defaultMsgCalendar = 'Calendar';
                var defaultMsgOpenCalendar = 'Open calendar';

                var service = {
                    /*$mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

                     $mdDateLocaleProvider.shortDays = $mdDateLocaleProvider.days = ['日', '一', '二', '三', '四', '五', '六'];*/
                    months: this.months || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                    shortMonths: this.shortMonths || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    days: this.days || $locale.DATETIME_FORMATS.DAY,
                    shortDays: this.shortDays || defaultShortDays,
                    dates: this.dates || defaultDates,
                    firstDayOfWeek: this.firstDayOfWeek || 0,
                    formatDate: this.formatDate || defaultFormatDate,
                    parseDate: this.parseDate || defaultParseDate,
                    isDateComplete: this.isDateComplete || defaultIsDateComplete,
                    monthHeaderFormatter: this.monthHeaderFormatter || defaultMonthHeaderFormatter,
                    weekNumberFormatter: this.weekNumberFormatter || defaultWeekNumberFormatter,
                    longDateFormatter: this.longDateFormatter || defaultLongDateFormatter,
                    msgCalendar: this.msgCalendar || defaultMsgCalendar,
                    msgOpenCalendar: this.msgOpenCalendar || defaultMsgOpenCalendar
                };

                return service;
            };
            DateLocaleProvider.prototype.$get.$inject = ["$locale"];

            $provide.provider('$mdDateLocale', new DateLocaleProvider());
        }]);
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        // POST RELEASE
        // TODO(jelbourn): Demo that uses moment.js
        // TODO(jelbourn): make sure this plays well with validation and ngMessages.
        // TODO(jelbourn): calendar pane doesn't open up outside of visible viewport.
        // TODO(jelbourn): forward more attributes to the internal input (required, autofocus, etc.)
        // TODO(jelbourn): something better for mobile (calendar panel takes up entire screen?)
        // TODO(jelbourn): input behavior (masking? auto-complete?)
        // TODO(jelbourn): UTC mode
        // TODO(jelbourn): RTL


        applicationApp.directive('mdSpinnerDatepicker', datePickerDirective);

        /**
         * @ngdoc directive
         * @name mdDatepicker
         * @module material.components.datepicker
         *
         * @param {Date} ng-model The component's model. Expects a JavaScript Date object.
         * @param {expression=} ng-change Expression evaluated when the model value changes.
         * @param {Date=} md-min-date Expression representing a min date (inclusive).
         * @param {Date=} md-max-date Expression representing a max date (inclusive).
         * @param {(function(Date): boolean)=} md-date-filter Function expecting a date and returning a boolean whether it can be selected or not.
         * @param {String=} md-placeholder The date input placeholder value.
         * @param {boolean=} ng-disabled Whether the datepicker is disabled.
         * @param {boolean=} ng-required Whether a value is required for the datepicker.
         *
         * @description
         * `<md-datepicker>` is a component used to select a single date.
         * For information on how to configure internationalization for the date picker,
         * see `$mdDateLocaleProvider`.
         *
         * This component supports [ngMessages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages).
         * Supported attributes are:
         * * `required`: whether a required date is not set.
         * * `mindate`: whether the selected date is before the minimum allowed date.
         * * `maxdate`: whether the selected date is after the maximum allowed date.
         *
         * @usage
         * <hljs lang="html">
         *   <md-datepicker ng-model="birthday"></md-datepicker>
         * </hljs>
         *
         */
        function datePickerDirective() {
            return {
                template: // Buttons are not in the tab order because users can open the calendar via keyboard
                // interaction on the text input, and multiple tab stops for one component (picker)
                // may be confusing.
                '<md-button class="md-datepicker-button md-icon-button" type="button" ' +
                'tabindex="-1" aria-hidden="true" ' +
                'ng-click="ctrl.openCalendarPane($event)">' +
                '<md-icon class="md-datepicker-calendar-icon md-primary" md-svg-icon="md-calendar"></md-icon>' +
                '</md-button>' +
                '<div class="md-datepicker-input-container" ' +
                'ng-class="{\'md-datepicker-focused\': ctrl.isFocused}">' +
                '<input class="md-datepicker-input" aria-haspopup="true" ' +
                'ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)">' +
                    /*'<md-button type="button" md-no-ink ' +
                     'class="md-datepicker-triangle-button md-icon-button" ' +
                     'ng-click="ctrl.openCalendarPane($event)" ' +
                     'aria-label="{{::ctrl.dateLocale.msgOpenCalendar}}">' +
                     '<div class="md-datepicker-expand-triangle"></div>' +
                     '</md-button>' +*/
                '</div>' +

                    // This pane will be detached from here and re-attached to the document body.
                '<div class="md-datepicker-calendar-pane md-whiteframe-z1">' +
                '<div class="md-datepicker-input-mask">' +
                '<div class="md-datepicker-input-mask-opaque"></div>' +
                '</div>' +
                '<div class="md-datepicker-calendar">' +
                '<md-timer-picker class="md-whiteframe-1dp" current="360"/>' +
                '</div>' +
                '</div>',
                require: ['ngModel', 'mdSpinnerDatepicker', '?^mdInputContainer'],
                scope: {
                    minDate: '=mdMinDate',
                    maxDate: '=mdMaxDate',
                    placeholder: '@mdPlaceholder',
                    dateFilter: '=mdDateFilter'
                },
                controller: DatePickerCtrl,
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attr, controllers) {
                    var ngModelCtrl = controllers[0];
                    var mdDatePickerCtrl = controllers[1];

                    var mdInputContainer = controllers[2];
                    if (mdInputContainer) {
                        throw Error('md-datepicker should not be placed inside md-input-container.');
                    }

                    mdDatePickerCtrl.configureNgModel(ngModelCtrl);
                }
            };
        }

        /** Additional offset for the input's `size` attribute, which is updated based on its content. */
        var EXTRA_INPUT_SIZE = 3;

        /** Class applied to the container if the date is invalid. */
        var INVALID_CLASS = 'md-datepicker-invalid';

        /** Default time in ms to debounce input event by. */
        var DEFAULT_DEBOUNCE_INTERVAL = 500;

        /**
         * Height of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-height is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_HEIGHT = 368;

        /**
         * Width of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-width is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_WIDTH = 360;

        /**
         * Controller for md-datepicker.
         *
         * ngInject @constructor
         */
        function DatePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window,
                                $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
            /** @final */
            this.$compile = $compile;

            /** @final */
            this.$timeout = $timeout;

            /** @final */
            this.$window = $window;

            /** @final */
            this.dateLocale = $mdDateLocale;

            /** @final */
            this.dateUtil = $$mdDateUtil;

            /** @final */
            this.$mdConstant = $mdConstant;

            /* @final */
            this.$mdUtil = $mdUtil;

            /** @final */
            this.$$rAF = $$rAF;

            /**
             * The root document element. This is used for attaching a top-level click handler to
             * close the calendar panel when a click outside said panel occurs. We use `documentElement`
             * instead of body because, when scrolling is disabled, some browsers consider the body element
             * to be completely off the screen and propagate events directly to the html element.
             * @type {!angular.JQLite}
             */
            this.documentElement = angular.element(document.documentElement);

            /** @type {!angular.NgModelController} */
            this.ngModelCtrl = null;

            /** @type {HTMLInputElement} */
            this.inputElement = $element[0].querySelector('input');

            /** @final {!angular.JQLite} */
            this.ngInputElement = angular.element(this.inputElement);

            /** @type {HTMLElement} */
            this.inputContainer = $element[0].querySelector('.md-datepicker-input-container');

            /** @type {HTMLElement} Floating calendar pane. */
            this.calendarPane = $element[0].querySelector('.md-datepicker-calendar-pane');

            /** @type {HTMLElement} Calendar icon button. */
            this.calendarButton = $element[0].querySelector('.md-datepicker-button');

            /**
             * Element covering everything but the input in the top of the floating calendar pane.
             * @type {HTMLElement}
             */
            this.inputMask = $element[0].querySelector('.md-datepicker-input-mask-opaque');

            /** @final {!angular.JQLite} */
            this.$element = $element;

            /** @final {!angular.Attributes} */
            this.$attrs = $attrs;

            /** @final {!angular.Scope} */
            this.$scope = $scope;

            /** @type {Date} */
            this.date = null;

            /** @type {boolean} */
            this.isFocused = false;

            /** @type {boolean} */
            this.isDisabled;
            this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));

            /** @type {boolean} Whether the date-picker's calendar pane is open. */
            this.isCalendarOpen = false;

            /**
             * Element from which the calendar pane was opened. Keep track of this so that we can return
             * focus to it when the pane is closed.
             * @type {HTMLElement}
             */
            this.calendarPaneOpenedFrom = null;

            this.calendarPane.id = 'md-date-pane' + $mdUtil.nextUid();

            $mdTheming($element);

            /** Pre-bound click handler is saved so that the event listener can be removed. */
            this.bodyClickHandler = angular.bind(this, this.handleBodyClick);

            /** Pre-bound resize handler so that the event listener can be removed. */
            this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeCalendarPane), 100);

            // Unless the user specifies so, the datepicker should not be a tab stop.
            // This is necessary because ngAria might add a tabindex to anything with an ng-model
            // (based on whether or not the user has turned that particular feature on/off).
            if (!$attrs['tabindex']) {
                $element.attr('tabindex', '-1');
            }

            this.installPropertyInterceptors();
            this.attachChangeListeners();
            this.attachInteractionListeners();

            var self = this;
            $scope.$on('$destroy', function () {
                self.detachCalendarPane();
            });
        }

        DatePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];

        /**
         * Sets up the controller's reference to ngModelController.
         * @param {!angular.NgModelController} ngModelCtrl
         */
        DatePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
            this.ngModelCtrl = ngModelCtrl;

            var self = this;
            ngModelCtrl.$render = function () {
                var value = self.ngModelCtrl.$viewValue;

                if (value && !(value instanceof Date)) {
                    throw Error('The ng-model for md-datepicker must be a Date instance. ' +
                    'Currently the model is a: ' + (typeof value));
                }

                self.date = value;
                self.inputElement.value = self.dateLocale.formatDate(value);
                self.resizeInputElement();
                self.updateErrorState();
            };
        };

        /**
         * Attach event listeners for both the text input and the md-calendar.
         * Events are used instead of ng-model so that updates don't infinitely update the other
         * on a change. This should also be more performant than using a $watch.
         */
        DatePickerCtrl.prototype.attachChangeListeners = function () {
            var self = this;

            self.$scope.$on('md-calendar-change', function (event, date) {
                self.ngModelCtrl.$setViewValue(date);
                self.date = date;
                self.inputElement.value = self.dateLocale.formatDate(date);
                self.closeCalendarPane();
                self.resizeInputElement();
                self.updateErrorState();
            });

            self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
            // TODO(chenmike): Add ability for users to specify this interval.
            self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
                DEFAULT_DEBOUNCE_INTERVAL, self));
        };

        /** Attach event listeners for user interaction. */
        DatePickerCtrl.prototype.attachInteractionListeners = function () {
            var self = this;
            var $scope = this.$scope;
            var keyCodes = this.$mdConstant.KEY_CODE;

            // Add event listener through angular so that we can triggerHandler in unit tests.
            self.ngInputElement.on('keydown', function (event) {
                if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                    self.openCalendarPane(event);
                    $scope.$digest();
                }
            });

            $scope.$on('md-calendar-close', function () {
                self.closeCalendarPane();
            });
        };

        /**
         * Capture properties set to the date-picker and imperitively handle internal changes.
         * This is done to avoid setting up additional $watches.
         */
        DatePickerCtrl.prototype.installPropertyInterceptors = function () {
            var self = this;

            if (this.$attrs['ngDisabled']) {
                // The expression is to be evaluated against the directive element's scope and not
                // the directive's isolate scope.
                var scope = this.$scope.$parent;

                if (scope) {
                    scope.$watch(this.$attrs['ngDisabled'], function (isDisabled) {
                        self.setDisabled(isDisabled);
                    });
                }
            }

            Object.defineProperty(this, 'placeholder', {
                get: function () {
                    return self.inputElement.placeholder;
                },
                set: function (value) {
                    self.inputElement.placeholder = value || '';
                }
            });
        };

        /**
         * Sets whether the date-picker is disabled.
         * @param {boolean} isDisabled
         */
        DatePickerCtrl.prototype.setDisabled = function (isDisabled) {
            this.isDisabled = isDisabled;
            this.inputElement.disabled = isDisabled;
            this.calendarButton.disabled = isDisabled;
        };

        /**
         * Sets the spinner ngModel.$error flags to be consumed by ngMessages. Flags are:
         *   - mindate: whether the selected date is before the minimum date.
         *   - maxdate: whether the selected flag is after the maximum date.
         *   - filtered: whether the selected date is allowed by the spinner filtering function.
         *   - valid: whether the entered text input is a valid date
         *
         * The 'required' flag is handled automatically by ngModel.
         *
         * @param {Date=} opt_date Date to check. If not given, defaults to the datepicker's model value.
         */
        DatePickerCtrl.prototype.updateErrorState = function (opt_date) {
            var date = opt_date || this.date;

            // Clear any existing errors to get rid of anything that's no longer relevant.
            this.clearErrorState();

            if (this.dateUtil.isValidDate(date)) {
                // Force all dates to midnight in order to ignore the time portion.
                date = this.dateUtil.createDateAtMidnight(date);

                if (this.dateUtil.isValidDate(this.minDate)) {
                    var minDate = this.dateUtil.createDateAtMidnight(this.minDate);
                    this.ngModelCtrl.$setValidity('mindate', date >= minDate);
                }

                if (this.dateUtil.isValidDate(this.maxDate)) {
                    var maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
                    this.ngModelCtrl.$setValidity('maxdate', date <= maxDate);
                }

                if (angular.isFunction(this.dateFilter)) {
                    this.ngModelCtrl.$setValidity('filtered', this.dateFilter(date));
                }
            } else {
                // The date is seen as "not a valid date" if there is *something* set
                // (i.e.., not null or undefined), but that something isn't a valid date.
                this.ngModelCtrl.$setValidity('valid', date == null);
            }

            // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
            // because it doesn't conform to the DOMTokenList spec.
            // See https://github.com/ariya/phantomjs/issues/12782.
            if (!this.ngModelCtrl.$valid) {
                this.inputContainer.classList.add(INVALID_CLASS);
            }
        };

        /** Clears any error flags set by `updateErrorState`. */
        DatePickerCtrl.prototype.clearErrorState = function () {
            this.inputContainer.classList.remove(INVALID_CLASS);
            ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function (field) {
                this.ngModelCtrl.$setValidity(field, true);
            }, this);
        };

        /** Resizes the input element based on the size of its content. */
        DatePickerCtrl.prototype.resizeInputElement = function () {
            this.inputElement.size = this.inputElement.value.length + EXTRA_INPUT_SIZE;
        };

        /**
         * Sets the model value if the user input is a valid date.
         * Adds an invalid class to the input element if not.
         */
        DatePickerCtrl.prototype.handleInputEvent = function () {
            var inputString = this.inputElement.value;
            var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
            this.dateUtil.setDateTimeToMidnight(parsedDate);

            // An input string is valid if it is either empty (representing no date)
            // or if it parses to a valid date that the user is allowed to select.
            var isValidInput = inputString == '' || (
                this.dateUtil.isValidDate(parsedDate) &&
                this.dateLocale.isDateComplete(inputString) &&
                this.isDateEnabled(parsedDate)
                );

            // The datepicker's model is only updated when there is a valid input.
            if (isValidInput) {
                this.ngModelCtrl.$setViewValue(parsedDate);
                this.date = parsedDate;
            }

            this.updateErrorState(parsedDate);
        };

        /**
         * Check whether date is in range and enabled
         * @param {Date=} opt_date
         * @return {boolean} Whether the date is enabled.
         */
        DatePickerCtrl.prototype.isDateEnabled = function (opt_date) {
            return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
                (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
        };

        /** Position and attach the floating calendar to the document. */
        DatePickerCtrl.prototype.attachCalendarPane = function () {
            var calendarPane = this.calendarPane;
            calendarPane.style.transform = '';
            this.$element.addClass('md-datepicker-open');

            var elementRect = this.inputContainer.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();

            // Check to see if the calendar pane would go off the screen. If so, adjust position
            // accordingly to keep it within the viewport.
            var paneTop = elementRect.top - bodyRect.top + 40;
            var paneLeft = elementRect.left - bodyRect.left - 40;

            // If ng-material has disabled body scrolling (for example, if a dialog is open),
            // then it's possible that the already-scrolled body has a negative top/left. In this case,
            // we want to treat the "real" top as (0 - bodyRect.top). In a normal scrolling situation,
            // though, the top of the viewport should just be the body's scroll position.
            var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
                -bodyRect.top :
                document.body.scrollTop;

            var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
                -bodyRect.left :
                document.body.scrollLeft;

            var viewportBottom = viewportTop + this.$window.innerHeight;
            var viewportRight = viewportLeft + this.$window.innerWidth;

            // If the right edge of the pane would be off the screen and shifting it left by the
            // difference would not go past the left edge of the screen. If the calendar pane is too
            // big to fit on the screen at all, move it to the left of the screen and scale the entire
            // element down to fit.
            if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
                if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                    paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
                } else {
                    paneLeft = viewportLeft;
                    var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                    calendarPane.style.transform = 'scale(' + scale + ')';
                }

                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            // If the bottom edge of the pane would be off the screen and shifting it up by the
            // difference would not go past the top edge of the screen.
            if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
                viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
                paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            calendarPane.style.left = paneLeft + 'px';
            calendarPane.style.top = paneTop + 'px';
            document.body.appendChild(calendarPane);

            // The top of the calendar pane is a transparent box that shows the text input underneath.
            // Since the pane is floating, though, the page underneath the pane *adjacent* to the input is
            // also shown unless we cover it up. The inputMask does this by filling up the remaining space
            // based on the width of the input.
            this.inputMask.style.left = elementRect.width + 'px';

            // Add CSS class after one frame to trigger open animation.
            this.$$rAF(function () {
                calendarPane.classList.add('md-pane-open');
            });
        };

        /** Detach the floating calendar pane from the document. */
        DatePickerCtrl.prototype.detachCalendarPane = function () {
            this.$element.removeClass('md-datepicker-open');
            this.calendarPane.classList.remove('md-pane-open');
            this.calendarPane.classList.remove('md-datepicker-pos-adjusted');

            if (this.isCalendarOpen) {
                this.$mdUtil.enableScrolling();
            }

            if (this.calendarPane.parentNode) {
                // Use native DOM removal because we do not want any of the angular state of this element
                // to be disposed.
                this.calendarPane.parentNode.removeChild(this.calendarPane);
            }
        };

        /**
         * Open the floating calendar pane.
         * @param {Event} event
         */
        DatePickerCtrl.prototype.openCalendarPane = function (event) {
            if (!this.isCalendarOpen && !this.isDisabled) {
                this.isCalendarOpen = true;
                this.calendarPaneOpenedFrom = event.target;

                // Because the calendar pane is attached directly to the body, it is possible that the
                // rest of the component (input, etc) is in a different scrolling container, such as
                // an md-content. This means that, if the container is scrolled, the pane would remain
                // stationary. To remedy this, we disable scrolling while the calendar pane is open, which
                // also matches the native behavior for things like `<select>` on Mac and Windows.
                this.$mdUtil.disableScrollAround(this.calendarPane);

                this.attachCalendarPane();
                this.focusCalendar();

                // Attach click listener inside of a timeout because, if this open call was triggered by a
                // click, we don't want it to be immediately propogated up to the body and handled.
                var self = this;
                this.$mdUtil.nextTick(function () {
                    // Use 'touchstart` in addition to click in order to work on iOS Safari, where click
                    // events aren't propogated under most circumstances.
                    // See http://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
                    self.documentElement.on('click touchstart', self.bodyClickHandler);
                }, false);

                window.addEventListener('resize', this.windowResizeHandler);
            }
        };

        /** Close the floating calendar pane. */
        DatePickerCtrl.prototype.closeCalendarPane = function () {
            if (this.isCalendarOpen) {
                this.detachCalendarPane();
                this.isCalendarOpen = false;
                this.calendarPaneOpenedFrom.focus();
                this.calendarPaneOpenedFrom = null;

                this.ngModelCtrl.$setTouched();

                this.documentElement.off('click touchstart', this.bodyClickHandler);
                window.removeEventListener('resize', this.windowResizeHandler);
            }
        };

        /** Gets the controller instance for the calendar in the floating pane. */
        DatePickerCtrl.prototype.getCalendarCtrl = function () {
            return angular.element(this.calendarPane.querySelector('md-spinner-calendar')).controller('mdSpinnerCalendar');
        };

        /** Focus the calendar in the floating pane. */
        DatePickerCtrl.prototype.focusCalendar = function () {
            // Use a timeout in order to allow the calendar to be rendered, as it is gated behind an ng-if.
            var self = this;
            this.$mdUtil.nextTick(function () {
                self.getCalendarCtrl().focus();
            }, false);
        };

        /**
         * Sets whether the input is currently focused.
         * @param {boolean} isFocused
         */
        DatePickerCtrl.prototype.setFocused = function (isFocused) {
            if (!isFocused) {
                this.ngModelCtrl.$setTouched();
            }
            this.isFocused = isFocused;
        };

        /**
         * Handles a click on the document body when the floating calendar pane is open.
         * Closes the floating calendar pane if the click is not inside of it.
         * @param {MouseEvent} event
         */
        DatePickerCtrl.prototype.handleBodyClick = function (event) {
            if (this.isCalendarOpen) {
                // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
                var isInCalendar = this.$mdUtil.getClosest(event.target, 'md-spinner-calendar');
                if (!isInCalendar) {
                    this.closeCalendarPane();
                }

                this.$scope.$digest();
            }
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        /**
         * Utility for performing date calculations to facilitate operation of the calendar and
         * datepicker.
         */
        applicationApp.factory('$$mdDateUtil', function () {
            return {
                getFirstDateOfMonth: getFirstDateOfMonth,
                getNumberOfDaysInMonth: getNumberOfDaysInMonth,
                getDateInNextMonth: getDateInNextMonth,
                getDateInPreviousMonth: getDateInPreviousMonth,
                isInNextMonth: isInNextMonth,
                isInPreviousMonth: isInPreviousMonth,
                getDateMidpoint: getDateMidpoint,
                isSameMonthAndYear: isSameMonthAndYear,
                getWeekOfMonth: getWeekOfMonth,
                incrementDays: incrementDays,
                incrementMonths: incrementMonths,
                getLastDateOfMonth: getLastDateOfMonth,
                isSameDay: isSameDay,
                getMonthDistance: getMonthDistance,
                isValidDate: isValidDate,
                setDateTimeToMidnight: setDateTimeToMidnight,
                createDateAtMidnight: createDateAtMidnight,
                isDateWithinRange: isDateWithinRange
            };

            /**
             * Gets the first day of the month for the given date's month.
             * @param {Date} date
             * @returns {Date}
             */
            function getFirstDateOfMonth(date) {
                return new Date(date.getFullYear(), date.getMonth(), 1);
            }

            /**
             * Gets the number of days in the month for the given date's month.
             * @param date
             * @returns {number}
             */
            function getNumberOfDaysInMonth(date) {
                return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            }

            /**
             * Get an arbitrary date in the month after the given date's month.
             * @param date
             * @returns {Date}
             */
            function getDateInNextMonth(date) {
                return new Date(date.getFullYear(), date.getMonth() + 1, 1);
            }

            /**
             * Get an arbitrary date in the month before the given date's month.
             * @param date
             * @returns {Date}
             */
            function getDateInPreviousMonth(date) {
                return new Date(date.getFullYear(), date.getMonth() - 1, 1);
            }

            /**
             * Gets whether two dates have the same month and year.
             * @param {Date} d1
             * @param {Date} d2
             * @returns {boolean}
             */
            function isSameMonthAndYear(d1, d2) {
                return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
            }

            /**
             * Gets whether two dates are the same day (not not necesarily the same time).
             * @param {Date} d1
             * @param {Date} d2
             * @returns {boolean}
             */
            function isSameDay(d1, d2) {
                return d1.getDate() == d2.getDate() && isSameMonthAndYear(d1, d2);
            }

            /**
             * Gets whether a date is in the month immediately after some date.
             * @param {Date} startDate The date from which to compare.
             * @param {Date} endDate The date to check.
             * @returns {boolean}
             */
            function isInNextMonth(startDate, endDate) {
                var nextMonth = getDateInNextMonth(startDate);
                return isSameMonthAndYear(nextMonth, endDate);
            }

            /**
             * Gets whether a date is in the month immediately before some date.
             * @param {Date} startDate The date from which to compare.
             * @param {Date} endDate The date to check.
             * @returns {boolean}
             */
            function isInPreviousMonth(startDate, endDate) {
                var previousMonth = getDateInPreviousMonth(startDate);
                return isSameMonthAndYear(endDate, previousMonth);
            }

            /**
             * Gets the midpoint between two dates.
             * @param {Date} d1
             * @param {Date} d2
             * @returns {Date}
             */
            function getDateMidpoint(d1, d2) {
                return createDateAtMidnight((d1.getTime() + d2.getTime()) / 2);
            }

            /**
             * Gets the week of the month that a given date occurs in.
             * @param {Date} date
             * @returns {number} Index of the week of the month (zero-based).
             */
            function getWeekOfMonth(date) {
                var firstDayOfMonth = getFirstDateOfMonth(date);
                return Math.floor((firstDayOfMonth.getDay() + date.getDate() - 1) / 7);
            }

            /**
             * Gets a new date incremented by the given number of days. Number of days can be negative.
             * @param {Date} date
             * @param {number} numberOfDays
             * @returns {Date}
             */
            function incrementDays(date, numberOfDays) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() + numberOfDays);
            }

            /**
             * Gets a new date incremented by the given number of months. Number of months can be negative.
             * If the date of the given month does not match the target month, the date will be set to the
             * last day of the month.
             * @param {Date} date
             * @param {number} numberOfMonths
             * @returns {Date}
             */
            function incrementMonths(date, numberOfMonths) {
                // If the same date in the target month does not actually exist, the Date object will
                // automatically advance *another* month by the number of missing days.
                // For example, if you try to go from Jan. 30 to Feb. 30, you'll end up on March 2.
                // So, we check if the month overflowed and go to the last day of the target month instead.
                var dateInTargetMonth = new Date(date.getFullYear(), date.getMonth() + numberOfMonths, 1);
                var numberOfDaysInMonth = getNumberOfDaysInMonth(dateInTargetMonth);
                if (numberOfDaysInMonth < date.getDate()) {
                    dateInTargetMonth.setDate(numberOfDaysInMonth);
                } else {
                    dateInTargetMonth.setDate(date.getDate());
                }

                return dateInTargetMonth;
            }

            /**
             * Get the integer distance between two months. This *only* considers the month and year
             * portion of the Date instances.
             *
             * @param {Date} start
             * @param {Date} end
             * @returns {number} Number of months between `start` and `end`. If `end` is before `start`
             *     chronologically, this number will be negative.
             */
            function getMonthDistance(start, end) {
                return (12 * (end.getFullYear() - start.getFullYear())) + (end.getMonth() - start.getMonth());
            }

            /**
             * Gets the last day of the month for the given date.
             * @param {Date} date
             * @returns {Date}
             */
            function getLastDateOfMonth(date) {
                return new Date(date.getFullYear(), date.getMonth(), getNumberOfDaysInMonth(date));
            }

            /**
             * Checks whether a date is valid.
             * @param {Date} date
             * @return {boolean} Whether the date is a valid Date.
             */
            function isValidDate(date) {
                return date != null && date.getTime && !isNaN(date.getTime());
            }

            /**
             * Sets a date's time to midnight.
             * @param {Date} date
             */
            function setDateTimeToMidnight(date) {
                if (isValidDate(date)) {
                    date.setHours(0, 0, 0, 0);
                }
            }

            /**
             * Creates a date with the time set to midnight.
             * Drop-in replacement for two forms of the Date constructor:
             * 1. No argument for Date representing now.
             * 2. Single-argument value representing number of seconds since Unix Epoch
             * or a Date object.
             * @param {number|Date=} opt_value
             * @return {Date} New date with time set to midnight.
             */
            function createDateAtMidnight(opt_value) {
                var date;
                if (angular.isUndefined(opt_value)) {
                    date = new Date();
                } else {
                    date = new Date(opt_value);
                }
                setDateTimeToMidnight(date);
                return date;
            }

            /**
             * Checks if a date is within a min and max range, ignoring the time component.
             * If minDate or maxDate are not dates, they are ignored.
             * @param {Date} date
             * @param {Date} minDate
             * @param {Date} maxDate
             */
            function isDateWithinRange(date, minDate, maxDate) {
                var dateAtMidnight = createDateAtMidnight(date);
                var minDateAtMidnight = isValidDate(minDate) ? createDateAtMidnight(minDate) : null;
                var maxDateAtMidnight = isValidDate(maxDate) ? createDateAtMidnight(maxDate) : null;
                return (!minDateAtMidnight || minDateAtMidnight <= dateAtMidnight) &&
                    (!maxDateAtMidnight || maxDateAtMidnight >= dateAtMidnight);
            }
        });
    })(applicationApp);


})(window, window.angular, applicationApp);