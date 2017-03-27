/**
 * Created by robin on 22/11/2016.
 */
define(['require', 'angular'], function (require, angular) {
    'use strict';

    let controllerModule = angular.module('sso.controllers', []);
    controllerModule
        .controller('IndexCtrl', ['$rootScope', '$scope', '$http', '$window', '$cookies','$timeout',
            ($rootScope, $scope, $http, $window, $cookies, $timeout) => {
                $rootScope.tab = "index";
                $scope.login_msg = '';
                let captcha_img = "/captcha?l=50&_l=1", rememberMistakes = ()=>{
                    $rootScope.loginMistakes++;
                    if($rootScope.loginMistakes > 2){
                        let today = new Date();
                        $cookies.put("_showCaptcha", true, {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`,expires: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)})
                    }
                }, forgetMistakes = ()=>{
                    $cookies.put("_showCaptcha", "", {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                    $cookies.remove("_showCaptcha",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                };
                $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
                $scope.clearMsg = () => {
                    $scope.login_msg = '';
                }
                $scope.login = () => {
                    if($scope.refreshing){return;}
                    if ($scope.loginForm.$invalid) {
                        $scope.loginForm.$error.required && $scope.loginForm.$error.required.forEach(r => {
                            r.$setDirty(true);
                        });
                        $('#loginPanel').addClass('invalid');
                        $timeout(() => {
                            $('#loginPanel').removeClass('invalid');
                            $scope.login_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
                        }, 600)
                        rememberMistakes.call();
                        return;
                    }

                    let OSName = "Unknown OS";
                    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
                    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
                    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
                    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

                    let myParam = {
                        user_account: $scope.user_account?$scope.user_account.trim():'',
                        password: $scope.password?$scope.password.trim():'',
                        login_system: OSName
                    };

                    $scope.refreshing = true;
                    $http.post('/agent', {
                        module: 'sso',
                        partial: 'session',
                        api: 'login',
                        param: myParam
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $rootScope.profile = body.data;
                            $cookies.put("_session", JSON.stringify($rootScope.profile), {path: "/",domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                            forgetMistakes.call();

                            if (bassdk) {
                                var sign = '';
                                try {
                                    sign = JSON.parse(getCookie("_session")).sign;
                                } catch (e) {

                                }
                                bassdk.userIdentify(sign, true);
                            }

                            //?$rootScope.toPlatform($rootScope.from):$rootScope.toPlatform('');
                            if ($rootScope.from) {
                                if ($rootScope.from == "application") {
                                    if ($rootScope.isSsv()) {
                                        $rootScope.toPlatform($rootScope.from)
                                    } else if ($rootScope.isAdmin()) {
                                        $rootScope.toPlatform('console')
                                    } else if ($rootScope.isIsv) {
                                        $rootScope.toPlatform('console')
                                    }
                                } else if ($rootScope.from == "console") {
                                    if ($rootScope.isSsv()) {
                                        $rootScope.toPlatform("application")
                                    } else if ($rootScope.isAdmin()) {
                                        $rootScope.toPlatform('console')
                                    } else if ($rootScope.isIsv) {
                                        $rootScope.toPlatform('console')
                                    }
                                }
                            } else {
                                $rootScope.toPlatform('')
                            }
                        } else {
                            rememberMistakes.call();
                            $('#loginPanel').addClass('invalid');
                            $timeout(() => {
                                $('#loginPanel').removeClass('invalid');
                                $scope.login_msg = body.data.msg;
                            }, 600)
                        }
                    }, why => {
                        $scope.login_msg = why;
                    }).finally(()=>{
                        $timeout(() => {
                            $scope.refreshing = false;
                        })
                    });
                }

                $scope.resetCaptcha = () => {
                    $scope.captchaCode = "";
                    $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
                }
                $scope.clearMsg = () => {
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
            }])
        .controller('RegisterCtrl', ['$rootScope', '$scope', '$http',
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
                $scope.clearMsg = type => {
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
                                $scope.ssv_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
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
                                $scope.ssv_msg = ($rootScope._lang == "zh-cn") ? "注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户" : "Success, please proceed to your mailbox and active your account";
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
                                $scope.dev_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
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
                                $scope.dev_msg = ($rootScope._lang == "zh-cn") ? "注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户" : "Success, please proceed to your mailbox and active your account";
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
            }])
        .controller('UpdateCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {

                if (!$rootScope.profile) {
                    $rootScope.alertDialog(null, {
                        title: ($rootScope._lang == "zh-cn") ? "跳转失败" : "Failed",
                        content: ($rootScope._lang == "zh-cn") ? "用户没有登录，无法取得个人信息" : "No signed in yet",
                        ariaLabel: ($rootScope._lang == "zh-cn") ? "跳转失败" : "Failed",
                        ok: "Ok"
                    })
                    $rootScope.go('index');
                }

                $rootScope.tab = "update";
                $scope.update_msg = '';
                $scope.clearMsg = type => {
                    $scope.update_msg = '';
                }
                $scope.init = () => {
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
                                $scope.update_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
                                $scope.$apply();
                            }, 600)
                            return;
                        }
                        $http.post('/agent', {
                            module: 'sso',
                            partial: 'update',
                            api: 'saveuser',
                            param: $.extend({user_type: $rootScope.profile.login_user_type}, $scope.ssv)
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
                                $scope.update_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
                                $scope.$apply();
                            }, 600)
                            return;
                        }
                        $http.post('/agent', {
                            module: 'sso',
                            partial: 'update',
                            api: 'saveuser',
                            param: $.extend({user_type: $rootScope.profile.login_user_type}, $scope.developer)
                        }).then(body => {
                            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                                $scope.developer._success = true;
                                $scope.update_msg = ($rootScope._lang == "zh-cn") ? "修改成功" : "DONE";
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
            }])
        .controller('UpdatepasswordCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {
                $rootScope.tab = "updatepassword";
                $scope.update_msg = '';
                $scope.clearMsg = type => {
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
                            $scope.update_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
                            $scope.$apply();
                        }, 600)
                        return;
                    }
                    $http.post('/agent', {
                        module: 'sso',
                        partial: 'updatepassword',
                        api: 'updatepassword',
                        param: $.extend({user_type: $rootScope.profile.login_user_type}, $scope.user)
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $scope.user._success = true;
                            $scope.update_msg = ($rootScope._lang == "zh-cn") ? "修改成功" : "DONE";
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
            }])
        .controller('FindpasswordCtrl', ['$rootScope', '$scope', '$http', "$mdDialog",
            ($rootScope, $scope, $http, $mdDialog) => {
                $rootScope.tab = "findpassword";
                $scope.reset_msg = '';
                let captcha_img = "/captcha?l=50&_l=1";
                $scope.captcha_img = captcha_img;

                $scope.clearMsg = () => {
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
                            $scope.reset_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
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
                            $scope.reset_msg = ($rootScope._lang == "zh-cn") ? "邮件发送成功, 请打开注册邮箱激活新密码" : "Please open your mailbox and active the new password";
                        } else {
                            console.log(body.data.msg);
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
            }])
        .controller('ResetpasswordCtrl', ['$rootScope', '$scope', '$http', '$stateParams','$interval',
            ($rootScope, $scope, $http, $stateParams,$interval) => {
                $rootScope.tab = "resetpassword";
                $scope.param = {};
                $scope.param._remaining = 5;
                $scope.reset_msg = '';

                let stop;
                $scope.clearMsg = () => {
                    $scope.reset_msg = '';
                }
                $scope.resetpassword = ev => {
                    if($scope.refreshing){return};
                    if ($scope.resetForm.$invalid) {
                        $scope.resetForm.$error.required && $scope.resetForm.$error.required.forEach(r => {
                            r.$setDirty(true);
                        });
                        $('#resetPanel').addClass('invalid');
                        setTimeout(() => {
                            $('#resetPanel').removeClass('invalid');
                            $scope.reset_msg = ($rootScope._lang == "zh-cn") ? "请检查输入项是否正确" : "Please verify the inputs";
                            $scope.$apply();
                        }, 600)
                        $scope.param._remaining--;
                        return;
                    }
                    $scope.refreshing = true;
                    $http.post('/agent', {
                        module: 'sso',
                        partial: 'resetpassword',
                        api: 'resetpassword',
                        param: {reset_code: $stateParams.token, new_password: $scope.param.new_password}
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $scope.param._success = true;
                            $scope.reset_msg = ($rootScope._lang == "zh-cn") ? "密码重置成功" : "Password reset!";
                            $scope.refreshing = false;
                            $scope.secondsRemaining = 5;
                            stop = $interval(()=>{
                                if($scope.secondsRemaining == 0){
                                    $rootScope.go('index');
                                } else {
                                    $scope.secondsRemaining--;
                                }
                            },1000);

                        } else {
                            $scope.param._error = true;
                            $scope.reset_msg = body.data.msg;
                            $scope.refreshing = false;
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
                $scope.$on('$destroy', () =>{
                    $interval.cancel(stop);
                });
            }])
        .controller('ActiveUserCtrl', ['$rootScope', '$scope', '$http', '$window', '$state', '$stateParams',
            ($rootScope, $scope, $http, $window, $state, $stateParams) => {
                $rootScope.tab = "activeUser";
                $scope.secondsRemaining = 5;
                $scope.msg = ($rootScope._lang == "zh-cn") ? "处理中......" : "Processing...";
                $http.post('/agent', {
                    module: 'sso',
                    partial: 'activeuser',
                    api: 'list',
                    param: {active_key: $stateParams.code}
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        //$state.go("index");
                        $scope.msg = ($rootScope._lang == "zh-cn") ? "账号激活成功" : "Account actived";
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
                        $scope.msg = ($rootScope._lang == "zh-cn") ? "账号激活失败，原因如下" : "Active failed";
                        $scope.error = body.data.msg;
                        //$scope.back = "返回";
                        console.log(body.data.msg);
                    }
                }, why => {
                    $scope.msg = ($rootScope._lang == "zh-cn") ? "账号激活失败，原因如下" : "Active failed";
                    $scope.error = why;
                });

                $scope.$on('$viewContentLoaded',
                    event => {
                        $rootScope.removeLoading();
                    });
            }]);
});
