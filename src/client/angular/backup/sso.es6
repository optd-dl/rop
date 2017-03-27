/**
 * Created by robin on 12/1/15.
 */

let ssoApp = angular.module('SSOApp', [
    'ui.router', 'ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages',
]);

ssoApp.config($mdThemingProvider => {
    let customBlueMap = $mdThemingProvider.extendPalette('cyan', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff',
        '300': '00C8AB',
        '500': '00C5A3',
        '800':'00A589',
        'A100':'EEFCFF'
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

    $mdThemingProvider.theme('dracular', 'default')
        .primaryPalette('grey',{
            'default': '900',
            'hue-1': '50',
            'hue-2': '800',
            'hue-3': '900'
        }).accentPalette('customBlue');
});

ssoApp.config($mdIconProvider => {
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

ssoApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    ($stateProvider, $urlRouterProvider, $locationProvider) => {
        $stateProvider.
            state('index', {
                templateUrl: '/_view/sso/index',
                url: '/sso/home',
                controller: 'IndexCtrl'
            }).
            state('findpassword', {
                templateUrl: '/_view/sso/findpassword',
                url: '/sso/findpassword',
                controller: 'FindpasswordCtrl'
            }).
            state('resetpassword', {
                params: {
                    token: "shiqifeng2000@gmail.com",
                },
                templateUrl: '/_view/sso/resetpassword',
                url: '/sso/resetpassword?token',
                controller: 'ResetpasswordCtrl'
            }).
            state('register', {
                templateUrl: '/_view/sso/register',
                url: '/sso/register',
                controller: 'RegisterCtrl'
            }).
            state('activeuser', {
                params: {
                    code: "shiqifeng2000@gmail.com",
                },
                templateUrl: '/_view/sso/activeuser',
                url: '/sso/activeuser?code',
                controller: 'ActiveUserCtrl'
            }).
            state('update', {
                templateUrl: '/_view/sso/update',
                url: '/sso/update',
                controller: 'UpdateCtrl'
            }).
            state('updatepassword', {
                templateUrl: '/_view/sso/updatepassword',
                url: '/sso/updatepassword',
                controller: 'UpdatepasswordCtrl'
            })
        $urlRouterProvider.otherwise('/sso/home');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }]);

/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
 **/
ssoApp.controller('SSOCtrl', ['$rootScope', '$scope', '$state', '$location', '$window', '$cookies','$mdDialog',
    ($rootScope, $scope, $state, $location, $window, $cookies, $mdDialog) => {
        $rootScope.from = $location.search().from;
        $rootScope.loginMistakes = 0;
        $rootScope.removeLoading = () => {
            if(!$('.loading').hasClass("out")){
                $('.loading').addClass("start");
                setTimeout(() => {
                    $('.loading').addClass("out").one($.support.transition.end,function () {$(this).hide();$('.view-frame').addClass('reveal');})
                },ROPStyleConstant.loadingTime);
            }
        }

        $rootScope._lang = $cookies.get("_lang");

        $rootScope.locate = url => {
            $window.location.href = url;
        }
        $rootScope.locateAbs = url => {
            $window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/${url?url:''}`;
        }
        $rootScope.toWelcome = () => {
            //(window._env == "dev")?$scope.locate(''):$scope.locate(Constant.protocol+'://'+Constant.host+":"+Constant.port);
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}`);
        }
        $rootScope.go = (tab, param) => {
            $state.go(tab,param);
        }
        let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
        if (_session) {
            $rootScope.profile = _session;
        }

        $rootScope.confirmDialog = (ev, param) => {
            let confirm = $mdDialog.confirm()
                .parent(angular.element(ev.target).parent('.view-frame'))
                .title(param.title)
                .textContent(param.content)
                .clickOutsideToClose(true)
                .ariaLabel(param.ariaLabel)
                .targetEvent(ev)
                .ok(param.ok)
                .cancel(param.cancel);
            $mdDialog.show(confirm).then(param.success, param.cancel);
        }
        $rootScope.alertDialog = (ev, param) => {
            let confirm = $mdDialog.alert()
                .title(param.title)
                .textContent(param.content)
                .clickOutsideToClose(true)
                .ariaLabel(param.ariaLabel)
                .ok(param.ok);
            $mdDialog.show(confirm).then(param.success);
        }
        $rootScope.isAdmin = () => {return $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3'));}
        $rootScope.isSsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '2')};
        $rootScope.isIsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '1')};
    }]);

ssoApp.controller('IndexCtrl', ['$rootScope', '$scope', '$http', '$window', '$cookies',
    ($rootScope, $scope, $http, $window, $cookies) => {
        $rootScope.tab = "index";
        $scope.login_msg = '';
        let captcha_img = "/captcha?l=50&_l=1";
        $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
        $scope.clearMsg =() => {
            $scope.login_msg = '';
        }
        $scope.login = () => {
            if ($scope.loginForm.$invalid) {
                $scope.loginForm.$error.required && $scope.loginForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                $('#loginPanel').addClass('invalid');
                setTimeout(() => {
                    $('#loginPanel').removeClass('invalid');
                    $scope.login_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                    $scope.$apply();
                }, 600)
                $rootScope.loginMistakes++;
                return;
            }

            let OSName = "Unknown OS";
            if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
            if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
            if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
            if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

            let myParam = {
                user_account: $scope.user_account,
                password: $scope.password,
                login_system: OSName
            };

            $http.post('/agent', {
                module: 'sso',
                partial: 'session',
                api: 'login',
                param: myParam
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $rootScope.profile = body.data;
                    $cookies.put("_session", JSON.stringify($rootScope.profile), {path: "/", domain: `.${Constant.host}`});
                    // TODO 删掉我
                    //$cookies.put("_session", JSON.stringify($rootScope.profile));

                    if(bassdk){
                        var sign = '';
                        try{
                            sign = JSON.parse(getCookie("_session")).sign;
                        } catch(e){

                        }
                        bassdk.userIdentify(sign,true);
                    }
                    //?$rootScope.locateAbs($rootScope.from):$rootScope.locateAbs('');
                    if($rootScope.from){
                        if($rootScope.from == "application"){
                            if($rootScope.isSsv()){
                                $rootScope.locateAbs($rootScope.from)
                            } else if ($rootScope.isAdmin()){
                                $rootScope.locateAbs('console')
                            } else if ($rootScope.isIsv){
                                $rootScope.locateAbs('console')
                            }
                        } else if ($rootScope.from == "console"){
                            if($rootScope.isSsv()){
                                $rootScope.locateAbs("application")
                            } else if ($rootScope.isAdmin()){
                                $rootScope.locateAbs('console')
                            } else if ($rootScope.isIsv){
                                $rootScope.locateAbs('console')
                            }
                        }
                    } else {
                        $rootScope.locateAbs('')
                    }
                    //$window.location.href = $rootScope.from ? $rootScope.from : '';
                } else {
                    //$scope.password = '';
                    $rootScope.loginMistakes++;
                    $('#loginPanel').addClass('invalid');
                    setTimeout(() => {
                        $('#loginPanel').removeClass('invalid');
                        $scope.login_msg = body.data.msg;
                        $scope.$apply();
                    }, 600)
                }
            }, why => {
                $scope.login_msg = why;
            });
        }

        $scope.resetCaptcha = () => {
            $scope.captchaCode = "";
            $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
        }
        $scope.clearMsg =() => {
            $scope.login_msg = '';
        }
        $scope.verifyCode = () => {
            let _captcha = $cookies.get("_captcha");
            if (_captcha) {
                return $scope.captchaCode && ($scope.captchaCode.toLowerCase() == $cookies.get("_captcha").toLowerCase());
            } else {
                $scope.resetCaptcha();
                return;
            }
        }


        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $("#inputPassword").attr("type", "password").val("");
                    $rootScope.removeLoading();
                });
            });
    }]);

ssoApp.controller('RegisterCtrl', ['$rootScope', '$scope', '$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = "register";
        $scope.ssv_msg = '';
        $scope.dev_msg = '';
        $scope.chooseType = type => {
            $scope.userType = type;
        }
        window.test = type => {
            $scope.userType = type;
            $scope.$apply()
        }
        $scope.clearMsg =type => {
            if (type == 2) {
                $scope.ssv_msg = '';
            } else {
                $scope.dev_msg = '';
            }
        }
        $scope.register = ev => {
            let type = $scope.userType;
            if (type == 2) {
                if ($scope.ssvForm.$invalid) {
                    $scope.ssvForm.$error.required && $scope.ssvForm.$error.required.forEach(r => {
                        r.$setDirty(true);
                    });
                    $('#ssvRegisterPanel').addClass('invalid');
                    setTimeout(() => {
                        $('#ssvRegisterPanel').removeClass('invalid');
                        $scope.ssv_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                        $scope.$apply();
                    }, 600)
                    return;
                }
                $http.post('/agent', {
                    module: 'sso',
                    partial: 'register',
                    api: 'regist',
                    param: $.extend({user_type: type}, $scope.ssv)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.ssv._success = true;
                        $scope.ssv_msg = ($rootScope._lang == "zh-cn")?"注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户":"Success, please proceed to your mailbox and active your account";
                    } else {
                        console.log(body.data.msg);
                        $scope.ssv_msg = body.data.msg;
                    }

                }, why => {
                    $scope.ssv_msg = why;
                });
            }
            else {
                if ($scope.devForm.$invalid) {
                    $scope.devForm.$error.required && $scope.devForm.$error.required.forEach(r => {
                        r.$setDirty(true);
                    });
                    $('#devRegisterPanel').addClass('invalid');
                    setTimeout(() => {
                        $('#devRegisterPanel').removeClass('invalid');
                        $scope.dev_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                        $scope.$apply();
                    }, 600)
                    return;
                }
                $http.post('/agent', {
                    module: 'sso',
                    partial: 'register',
                    api: 'regist',
                    param: $.extend({user_type: type}, $scope.developer)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.developer._success = true;
                        $scope.dev_msg = ($rootScope._lang == "zh-cn")?"注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户":"Success, please proceed to your mailbox and active your account";
                    } else {
                        console.log(body.data.msg);
                        $scope.dev_msg = body.data.msg;
                    }

                }, why => {
                    $scope.dev_msg = why;
                });
            }
        }

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $("input.password").attr("type", "password").val("");
                });
                $rootScope.removeLoading();
            });
    }]);

ssoApp.controller('UpdateCtrl', ['$rootScope', '$scope', '$http',
    ($rootScope, $scope, $http) => {

        if(!$rootScope.profile) {
            $rootScope.alertDialog(null,{
                title:($rootScope._lang == "zh-cn")?"跳转失败":"Failed",
                content:($rootScope._lang == "zh-cn")?"用户没有登录，无法取得个人信息":"No signed in yet",
                ariaLabel:($rootScope._lang == "zh-cn")?"跳转失败":"Failed",
                ok:"Ok"
            })
            $rootScope.go('index');
        }

        $rootScope.tab = "update";
        $scope.update_msg = '';
        $scope.clearMsg =type => {
            $scope.update_msg = '';
        }
        $scope.init =() => {
            $http.post('/agent', {
                module: 'sso',
                partial: 'update',
                api: 'getuser'
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.initialData = JSON.parse(JSON.stringify(body.data));
                    if ($rootScope.profile.login_user_type != '2') {
                        $scope.developer = body.data;
                    } else {
                        $scope.ssv = body.data;
                    }
                } else {
                    console.log(body.data.msg);
                    $scope.update_msg = body.data.msg;
                }

            }, why => {
                $scope.update_msg = why;
            });
        }
        $scope.reset = () => {
            if ($scope.developer) {
                $scope.developer = $scope.initialData;
            } else {
                $scope.ssv = $scope.initialData;
            }
        }
        $scope.update = ev => {
            if ($scope.ssv) {
                if ($scope.ssvForm.$invalid) {
                    $scope.ssvForm.$error.required && $scope.ssvForm.$error.required.forEach(r => {
                        r.$setDirty(true);
                    });
                    $('#ssvRegisterPanel').addClass('invalid');
                    setTimeout(() => {
                        $('#ssvRegisterPanel').removeClass('invalid');
                        $scope.update_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                        $scope.$apply();
                    }, 600)
                    return;
                }
                $http.post('/agent', {
                    module: 'sso',
                    partial: 'update',
                    api: 'saveuser',
                    param: $.extend({user_type:$rootScope.profile.login_user_type},$scope.ssv)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.ssv._success = true;
                        $scope.update_msg = "修改成功";
                    } else {
                        console.log(body.data.msg);
                        $scope.update_msg = body.data.msg;
                    }

                }, why => {
                    $scope.update_msg = why;
                });
            }
            else {
                if ($scope.devForm.$invalid) {
                    $scope.devForm.$error.required && $scope.devForm.$error.required.forEach(r => {
                        r.$setDirty(true);
                    });
                    $('#devRegisterPanel').addClass('invalid');
                    setTimeout(() => {
                        $('#devRegisterPanel').removeClass('invalid');
                        $scope.update_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                        $scope.$apply();
                    }, 600)
                    return;
                }
                $http.post('/agent', {
                    module: 'sso',
                    partial: 'update',
                    api: 'saveuser',
                    param: $.extend({user_type:$rootScope.profile.login_user_type},$scope.developer)
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.developer._success = true;
                        $scope.update_msg = ($rootScope._lang == "zh-cn")?"修改成功":"DONE";
                    } else {
                        console.log(body.data.msg);
                        $scope.update_msg = body.data.msg;
                    }

                }, why => {
                    $scope.update_msg = why;
                });
            }
        }

        $scope.init();

        $scope.$on('$viewContentLoaded',
                event => {
                $rootScope.removeLoading();
            });
    }]);

ssoApp.controller('UpdatepasswordCtrl', ['$rootScope', '$scope', '$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = "updatepassword";
        $scope.update_msg = '';
        $scope.clearMsg =type => {
            $scope.update_msg = '';
        }
        $scope.update = ev => {
            if ($scope.userForm.$invalid) {
                $scope.userForm.$error.required && $scope.userForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                $('#userPanel').addClass('invalid');
                setTimeout(() => {
                    $('#userPanel').removeClass('invalid');
                    $scope.update_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                    $scope.$apply();
                }, 600)
                return;
            }
            $http.post('/agent', {
                module: 'sso',
                partial: 'updatepassword',
                api: 'updatepassword',
                param: $.extend({user_type:$rootScope.profile.login_user_type},$scope.user)
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.user._success = true;
                    $scope.update_msg = ($rootScope._lang == "zh-cn")?"修改成功":"DONE";
                } else {
                    console.log(body.data.msg);
                    $scope.update_msg = body.data.msg;
                }

            }, why => {
                $scope.update_msg = why;
            });
        }

        $scope.$on('$viewContentLoaded',
                event => {
                $rootScope.removeLoading();
            });
    }]);

ssoApp.controller('FindpasswordCtrl', ['$rootScope', '$scope', '$http', "$mdDialog",
    ($rootScope, $scope, $http, $mdDialog) => {
        $rootScope.tab = "findpassword";
        $scope.reset_msg = '';
        let captcha_img = "/captcha?l=50&_l=1";
        $scope.captcha_img = captcha_img;

        $scope.clearMsg =() => {
            $scope.reset_msg = '';
        }

        $scope.resetmail = ev => {
            if ($scope.findForm.$invalid) {
                $scope.findForm.$error.required && $scope.findForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                $('#findpasswordPanel').addClass('invalid');
                setTimeout(() => {
                    $('#findpasswordPanel').removeClass('invalid');
                    $scope.reset_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                    $scope.$apply();
                }, 600)
                return;
            }

            $http.post('/agent', {
                module: 'sso',
                partial: 'findpassword',
                api: 'findpassword',
                param: $scope.param
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.param._success = true;
                    $scope.reset_msg = ($rootScope._lang == "zh-cn")?"邮件发送成功, 请打开注册邮箱激活新密码":"Please open your mailbox and active the new password";
                } else {
                    console.log(body.msg);
                    $scope.reset_msg = body.data.msg;
                }

            }, why => {
                $scope.reset_msg = why;
            });
        }
        $scope.resetCaptcha = () => {
            $scope.captcha = "";
            $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
        }
        $scope.verifyCode = () => {
            let _captcha = $cookies.get("_captcha");
            if (_captcha) {
                return $scope.captchaCode && ($scope.captcha.toLowerCase() == $cookies.get("_captcha").toLowerCase());
            } else {
                $scope.resetCaptcha();
                return;
            }
        }

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope.removeLoading();
                });
            });
    }]);

ssoApp.controller('ResetpasswordCtrl', ['$rootScope', '$scope', '$http', '$stateParams',
    ($rootScope, $scope, $http, $stateParams) => {
        $rootScope.tab = "resetpassword";
        $scope.param = {};
        $scope.param._remaining = 5;
        $scope.reset_msg = '';

        $scope.clearMsg =() => {
            $scope.reset_msg = '';
        }
        $scope.resetpassword = ev => {
            if ($scope.resetForm.$invalid) {
                $scope.resetForm.$error.required && $scope.resetForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                $('#resetPanel').addClass('invalid');
                setTimeout(() => {
                    $('#resetPanel').removeClass('invalid');
                    $scope.reset_msg = ($rootScope._lang == "zh-cn")?"请检查输入项是否正确":"Please verify the inputs";
                    $scope.$apply();
                }, 600)
                $scope.param._remaining--;
                return;
            }
            $http.post('/agent', {
                module: 'sso',
                partial: 'resetpassword',
                api: 'resetpassword',
                param: {reset_code: $stateParams.token, new_password: $scope.param.new_password}
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $scope.param._success = true;
                    $scope.reset_msg = ($rootScope._lang == "zh-cn")?"密码重置成功":"Password reset!";
                } else {
                    $scope.param._error = true;
                    $scope.reset_msg = body.data.msg;
                    console.log(body.data.msg)
                }
            }, why => {
                $scope.reset_msg = why;
            });
        }

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope.removeLoading();
                });
            });
    }]);

ssoApp.controller('ActiveUserCtrl', ['$rootScope', '$scope', '$http', '$window', '$state','$stateParams',
    ($rootScope, $scope, $http, $window, $state, $stateParams) => {
        $rootScope.tab = "activeUser";
        $scope.secondsRemaining = 5;
        $scope.msg = ($rootScope._lang == "zh-cn")?"处理中......":"Processing...";
        $http.post('/agent', {
            module: 'sso',
            partial: 'activeuser',
            api: 'list',
            param: {active_key: $stateParams.code}
        }).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                //$state.go("index");
                $scope.msg =($rootScope._lang == "zh-cn")?"账号激活成功":"Account actived";
                let mark = setInterval(() => {
                    if (!$scope.secondsRemaining) {
                        clearInterval(mark);
                        $scope.go('index');
                    } else {
                        $scope.secondsRemaining--;
                        $scope.$apply();
                    }
                }, 1000);
            } else {
                $scope.msg = ($rootScope._lang == "zh-cn")?"账号激活失败，原因如下":"Active failed";
                $scope.error = body.data.msg;
                //$scope.back = "返回";
                console.log(body.data.msg);
            }
        }, why => {
            $scope.msg = ($rootScope._lang == "zh-cn")?"账号激活失败，原因如下":"Active failed";
            $scope.error = why;
            cb && cb.call();
        });

        $scope.$on('$viewContentLoaded',
                event => {
                $rootScope.removeLoading();
            });
    }]);

ssoApp.filter('escapeHtml', () => {

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
ssoApp.filter('unescapeHtml', () => {

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

ssoApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);
ssoApp.directive('compareTo', () => ({
    require: "ngModel",

    scope: {
        otherModelValue: "=compareTo"
    },

    link(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = modelValue => modelValue == scope.otherModelValue;

        scope.$watch("otherModelValue", () => {
            ngModel.$validate();
        });
    }
}));
ssoApp.directive('captchaValidator', ['$cookies', $cookies => ({
    restrict: "A",
    require: "ngModel",

    scope: {
        captchaValue: "=captchaValidator"
    },

    link(scope, element, attributes, ngModel) {

        ngModel.$validators.validCaptcha = modelValue => (modelValue ? modelValue.toLowerCase() : "") == ($cookies.get("_captcha") ? $cookies.get("_captcha").toLowerCase() : '');

        scope.$watch("captchaValue", () => {
            ngModel.$validate();
        });
    }
})]);

ssoApp.directive('ropPagination', ['$parse', $parse => ({
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

