/**
 * Created by robin on 12/1/15.
 */
//window._lastHttpRequest = new Date();
let consoleApp = angular.module('ConsoleApp', [
    'ui.router', 'ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages'
]);


consoleApp.config($mdThemingProvider => {
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

consoleApp.config($mdIconProvider => {
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
});

/*consoleApp.factory('HttpObserver', ()=>{
    var sessionInjector = {
        response: function(config) {
            window._lastHttpRequest = new Date();
            return config;
        }
    };
    return sessionInjector;
});*/
consoleApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider',
    ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {
        $stateProvider.
            state('index', {
                templateUrl: '/_view/console/index',
                controller: 'IndexCtrl',
                url: '/console/home',
            });
        $urlRouterProvider.otherwise('/console/home');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        //$httpProvider.interceptors.push('HttpObserver');
    }]);

consoleApp.controller('ConsoleCtrl', ['$rootScope', '$scope', '$state', '$location', '$window', '$http', '$cookies', '$mdDialog',
    ($rootScope, $scope, $state, $location, $window, $http, $cookies, $mdDialog) => {
        //$rootScope._timestamp = new Date().getTime();
        $rootScope.removeLoading = () => {
            if (!$('.loading').hasClass("out")) {
                $('.loading').addClass("start");
                setTimeout(() => {
                    $('.loading').addClass("out").one($.support.transition.end, function () {
                        $(this).hide();
                        $('body').addClass('reveal');
                    })
                }, ROPStyleConstant.loadingTime);
            }
        }
        $rootScope._entry = '0';

        $rootScope.switchFrame = (subentry, url, title) => {
            $rootScope._subentry = subentry;
            $rootScope._title = title;
            /*$('#mainFrame').attr("src", `/frame/${url}`);
            $('#mainFrame').parent().animate({ scrollTop: 0 });*/
            $('#mainFrameWrapper').animate({ scrollTop: 0 });
            $("#mainFrameWrapper")[0].innerHTML = `<iframe id="mainFrame" src=/frame/${url} scrolling="no" width="100%" style="min-height:800px;" noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" class=""></iframe>`;
            /*$http.post('/agent', {
                module: 'common',
                partial: 'common',
                api: 'tips'
            })*/
        }
        $rootScope.toggleEntry = (index) =>{
            (($rootScope._entry != index)?($rootScope._entry = index):($rootScope._entry = -1));
            setTimeout(()=> {
                $(".nano").nanoScroller();
            }, 500);
        }

        $rootScope.locate = url => {
            $window.location.href = url;
        }
        $rootScope.toPlatform = path => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}${path ? path : ""}`);
        }
        $rootScope.toWelcome = () => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}`);
        }
        $rootScope.logout = () => {
            /*$http.post('/agent', {module: 'sso', partial: 'session', api: 'logout'}).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $cookies.put("_session", null, {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                    $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                    $rootScope.profile = undefined;
                    $window.location.href = 'sso?from=console'
                } else {
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
            let self = this;*/
            return $http.post('/agent', {module: 'sso', partial: 'session', api: 'quit'}).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $cookies.put("_session", null, {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                    $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                    $window.location.href = 'sso?from=console'
                } else {
                    console.log(body.msg);
                }
            }, why => {console.log(body.msg);});
        }
        $rootScope.go = tab => {
            $state.go(tab);
        }
        $rootScope.isAdmin = () => {
            $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3')) ? true : false;
        }
        $rootScope.isSsv = () => {
            $rootScope.profile && ($rootScope.profile.login_user_type == '2') ? true : false;
        }
        $rootScope.alert = msg => {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('出错了')
                    .textContent(msg)
                    .ariaLabel(msg)
                    .ok('了解')
            );
        }
        $rootScope.checkSession = ()=>{
            let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
            (_session && !$rootScope.profile && (document.querySelector("meta[name=session]").content == _session.id)) && ($rootScope.profile = _session);
            if (!_session || !$rootScope.profile) {
                $rootScope.profile = undefined;
                $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                return false;
            }
            return true;
        }
        $rootScope.getSystemHints = () => {
           /*$http.post('/agent', {
                module: 'common',
                partial: 'common',
                api: 'tips'
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $rootScope.systemHints = body.data.data_list;
                    //($rootScope.originalSystemHints = body.data.data_list);
                } else {
                    console.log(body.data.msg);
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });*/
           var source = new EventSource('/sse/common/tips');
            source.onmessage = function(e) {
                /*if (window._lastHttpRequest && (window._lastHttpRequest.getTime() + Constant.exipration < new Date().getTime())) {
                    //$rootScope.locate('sso?from=console');
                    $rootScope.logout();
                    //console.log(window._lastHttpRequest);
                    return;
                }*/
                var body = JSON.parse(e.data);
                if(body._closeSSE){
                    source.close();
                    //$rootScope.locate('sso?from=console');
                    return;
                }
                if(body._skipSSE){
                    return;
                }
                if (((typeof body.is_success == 'boolean') && body.is_success) || ((typeof body.is_success == 'string') && (body.is_success == 'true'))) {
                    $rootScope.systemHints = body.data_list;
                    //($rootScope.originalSystemHints = body.data.data_list);
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
        $scope.init = () => {
            /*let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
            if (_session && (id == _session.id)) {
                $rootScope.profile = _session;
            } else {
                $rootScope.profile = undefined;
                $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                //console.log("请记得撤销调试模式")
                //$rootScope.locate('sso?from=console');
                $rootScope.logout();
            }*/
            if(!$rootScope.checkSession()){
                $rootScope.logout();
                return;
            }
            $rootScope.removeLoading();
            $rootScope.getSystemHints();
            setTimeout(()=> {
                $(".nano").nanoScroller();
                window.addEventListener("message", e => {
                    if (e.data == "expired") {
                        $rootScope.logout();
                    }
                })
            }, 800);

            $state.go("index");
        }
    }]);

consoleApp.controller('IndexCtrl', ['$rootScope', '$scope', '$http', '$mdSidenav', '$compile', '$element',
    ($rootScope, $scope, $http, $mdSidenav, $compile, $element) => {
        $rootScope.tab = "index";
        $scope.toggleSidenav = () => {
            $mdSidenav('right').toggle();
        };
        $scope.fetchSysMsg = () => {
            $http.post('/agent', {module: 'console', partial: 'consoles', api: 'secret-reset'}).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.systemHints = body.data.appsecret;
                } else {
                    console.log(body.data.msg)
                }
            }, why => {
                $rootScope.alert(why);
            });
        }
        $scope.hasHint = () => {
            return $scope.systemHints && ($scope.systemHints.length);
        }

        $scope.pageindex = 1, $scope.items = [], $scope.unappApiCheckedList = [], $scope.appApiCheckedList = [], $scope.appApiList = [], $scope.unappApiList = [];
        $scope.secretReset = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'secret-reset',
                param: {app_id: $scope.appDetails.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails.appsecret = body.data.appsecret;
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.testSecretReset = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'test-secret-reset',
                param: {app_id: $scope.appDetails.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails.test_appsecret = body.data.test_appsecret;
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.tokenReset = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'token-reset',
                param: {app_id: $scope.appDetails.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails.access_token = body.data.access_token;
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.testTokenReset = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'test-token-reset',
                param: {app_id: $scope.appDetails.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails.test_access_token = body.data.test_access_token;
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.viewApp = app => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'details',
                param: {app_id: app.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails = body.data;
                    !$scope.appDetails.app_id && ($scope.appDetails.app_id = app.app_id);
                    $.extend(app, $scope.appDetails);
                    $('#app_info').modal();
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.viewEdit = app => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'details',
                param: {app_id: app.app_id}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.appDetails = body.data;
                    !$scope.appDetails.app_id && ($scope.appDetails.app_id = app.app_id);
                    $.extend(app, $scope.appDetails);
                    $('#app_update').modal();
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }

        $scope.viewApi = app => {
            $scope.appSelected = app;
            $scope.apiSearcher($scope.apiPageIndex, $scope.apiPageSize, () => {
                $('#api_list').modal();
            })
        }
        $scope.viewUnApi = e => {
            let $btn = $(e.currentTarget).button('loading');
            $scope.unapiSearcher($scope.unapiPageIndex, $scope.unapiPageSize, () => {
                $('#unapi_list').modal();
                $btn.button('reset');
            })
        }
        $scope.viewCreate = () => {
            $scope.appDetails = {};
            $('#app_create').modal();
        }

        $scope.load = () => {
        }

        $scope.editApp = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'edit',
                param: {
                    app_id: $scope.appDetails.app_id,
                    app_name: $scope.appDetails.app_name,
                    remark: $scope.appDetails.remark,
                    user_type: $scope.profile.login_user_type
                }
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    let app = [].concat.apply([], $scope.items.map((item, i) => (item.app_id == body.data.app_id) ? [item] : []));
                    app && $.extend(app, body.data);
                } else {
                    console.log(body.msg)
                }
                $("#app_update").modal('hide');
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }


        $scope.$on('$viewContentLoaded',
                event => {
                $scope.load();
                setTimeout(() => {
                    //$("#menu>li:first-child>a").click();
                    //$("#menu>li:first-child>ul>li:first-child>a").click();
                    $('.md-sidenav-left .md-expand:first-child md-list md-list-item:first-child button').click();
                })
            });

        $scope.apiPageIndex = 1;
        $scope.apiPageSize = 5;
        $scope.apiRefresh = cb => {
            $scope.apiPageIndex = 1;
            $scope.apiPageSize = 5;
            $scope.apiSearcher(null, null, cb);
        };
        $scope.apiSearcher = (index, size, cb) => {
            if ($scope.appSelected) {
                $http.post('/agent', {
                    module: 'console',
                    partial: 'consoles',
                    api: 'api',
                    param: $.extend({
                        app_id: $scope.appSelected.app_id,
                        pageindex: index ? index : $scope.apiPageIndex,
                        pagesize: size ? size : $scope.apiPageSize
                    }, $scope.apiSearchParam)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.appApiList = body.data.app_api_list;
                        $scope.apiTotal = Number.parseInt(body.data.list_count);
                        $scope.appApiCheckedList.splice(0, $scope.appApiCheckedList.length);
                        cb && cb.call();
                    } else {
                        console.log(body.msg)
                    }
                }, why => {
                    // TODO 弹窗
                    console.log(why);
                    cb && cb.call();
                });
            }
        };
        $scope.toggleAllApi = () => {
            if ($scope.appApiCheckedList.length && ($scope.appApiCheckedList.length == $scope.appApiList.length)) {
                $scope.appApiCheckedList.splice(0, $scope.appApiCheckedList.length);
            } else {
                $scope.appApiList.forEach(api => {
                    ($scope.appApiCheckedList.indexOf(api) == -1) && $scope.appApiCheckedList.push(api);
                });
            }
        };
        $scope.toggleApi = api => {
            if ($scope.appApiCheckedList.indexOf(api) == -1) {
                $scope.appApiCheckedList.push(api);
            } else {
                $scope.appApiCheckedList.splice($scope.appApiCheckedList.indexOf(api), 1);
            }
        };
        $scope.deleteApi = () => {
            //$scope.appApiCheckedList;
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'delete-api',
                param: {
                    app_id: $scope.appSelected.app_id,
                    api_id: $scope.appApiCheckedList.map(item => item.api_id).join("@")
                }
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.apiRefresh();
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.allApiChecked = () => [].concat.apply([], $scope.appApiList.map(item => ($scope.appApiCheckedList.indexOf(item) == -1) ? [item] : [])).length == 0

        $scope.unapiPageIndex = 1;
        $scope.unapiPageSize = 5;
        $scope.unapiRefresh = cb => {
            $scope.unapiPageIndex = 1;
            $scope.unapiPageSize = 5;
            $scope.unapiSearcher(null, null, cb);
        };
        $scope.unapiSearcher = (index, size, cb) => {
            if ($scope.appSelected) {
                $http.post('/agent', {
                    module: 'console',
                    partial: 'consoles',
                    api: 'unapi',
                    param: $.extend({
                        app_id: $scope.appSelected.app_id,
                        pageindex: index ? index : $scope.unapiPageIndex,
                        pagesize: size ? size : $scope.unapiPageSize
                    }, $scope.apiSearchParam)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.unappApiList = body.data.app_api_list;
                        $scope.unapiTotal = Number.parseInt(body.data.list_count);
                        $scope.unappApiCheckedList.splice(0, $scope.unappApiCheckedList.length);
                        cb && cb.call();
                    } else {
                        console.log(body.msg)
                    }
                }, why => {
                    // TODO 弹窗
                    console.log(why);
                    cb && cb.call();
                });
            }
        };
        $scope.toggleAllUnApi = () => {
            if ($scope.unappApiCheckedList.length && ($scope.unappApiCheckedList.length == $scope.unappApiList.length)) {
                $scope.unappApiCheckedList.splice(0, $scope.unappApiCheckedList.length);
            } else {
                $scope.unappApiList.forEach(api => {
                    ($scope.unappApiCheckedList.indexOf(api) == -1) && $scope.unappApiCheckedList.push(api);
                });
            }
        };

        $scope.toggleUnApi = api => {
            if ($scope.unappApiCheckedList.indexOf(api) == -1) {
                $scope.unappApiCheckedList.push(api);
            } else {
                $scope.unappApiCheckedList.splice($scope.unappApiCheckedList.indexOf(api), 1);
            }
        };
        $scope.addUnApi = () => {
            $http.post('/agent', {
                module: 'console',
                partial: 'consoles',
                api: 'add-api',
                param: {
                    app_id: $scope.appSelected.app_id,
                    api_id: $scope.unappApiCheckedList.map(item => item.api_id).join("@")
                }
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.apiRefresh(() => {
                        $('#unapi_list').modal("hide");
                    })
                } else {
                    console.log(body.msg)
                }
            }, why => {
                // TODO 弹窗
                console.log(why);
            });
        }
        $scope.allUnApiChecked = () => [].concat.apply([], $scope.unappApiList.map(item => ($scope.unappApiCheckedList.indexOf(item) == -1) ? [item] : [])).length == 0

        $scope.$on('$viewContentLoaded',
                event => {

                /*setInterval(()=>{
                    $rootScope.getSystemHints();
                },60000);*/
        });
    }]);


consoleApp.filter('escapeHtml', () => {

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
consoleApp.filter('unescapeHtml', () => {

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

consoleApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);

consoleApp.directive('ropPagination', ['$parse', $parse => ({
    restrict: "A",

    scope: {
        index: "=index",
        size: "=size",
        total: "=total",
        searcher: "=searcher"
    },

    templateUrl: "/_template/pagination",

    link($scope, element, attrs) {
        $scope.myIndex = $scope.index;
        $scope.ceilingIndex = $scope.index + 4;

        // TODO 为了防止初始化2次特注掉以下代码，注掉后操作页scope则不能控制分页组件，反之是分页控件控制scope的数据，如果需要可以恢复
        $scope.$watch("total", () => {
            $scope.pages = [];
            for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                $scope.pages.push({index: i + 1})
            }
        });
        $scope.$watch("size", () => {
            $scope.pages = [];
            for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                $scope.pages.push({index: i + 1})
            }
            $scope.index = 1;
            $scope.ceilingIndex = 5;
            $scope.searcher($scope.index, $scope.size);
        });
        $scope.toFirst = () => {
            $scope.index = 1;
            $scope.ceilingIndex = 5;
            $scope.searcher($scope.index, $scope.size);
        };
        $scope.toLast = () => {
            $scope.index = $scope.pages.length;
            $scope.ceilingIndex = $scope.pages.length;
            $scope.searcher($scope.index, $scope.size);
        };
        $scope.searchPrevious = () => {
            if (($scope.ceilingIndex == $scope.index + 4) && ($scope.index > 1)) {
                $scope.ceilingIndex--;
            }
            if ($scope.index > 1) {
                --$scope.index;
                $scope.searcher($scope.index, $scope.size);
            }
        };

        $scope.searchNext = () => {
            if (($scope.ceilingIndex == $scope.index) && ($scope.index < $scope.pages.length)) {
                $scope.ceilingIndex++;
            }
            if ($scope.index < $scope.pages.length) {
                ++$scope.index;
                $scope.searcher($scope.index, $scope.size);
            }
        };

        $scope.searchIndex = i => {
            $scope.index = i;
            $scope.searcher($scope.index, $scope.size);
        };

        $scope.toPage = myIndex => {
            $scope.ceilingIndex = Math.min(Number.parseInt(myIndex) + 4, $scope.pages.length);
            $scope.searchIndex(myIndex);
        }
    }
})]);


consoleApp.directive('ropTreeView', ['$compile', $compile => ({
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

        window.test = $scope.$parent;
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




