define(['angular', 'snap', 'common', 'jQuery', 'angularMaterial', 'angularCookie', 'angularUIRouter','angularLoad' ], (angular, Snap) => {
    'use strict';
    angular.module('rop.services', ['ngMaterial', 'ngMessages','ngCookies', 'ui.router','oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', ($ocLazyLoadProvider) =>{
            $ocLazyLoadProvider.config({
                jsLoader: requirejs,
                debug: false
            });
        }])
        .factory('ScopeInitializer', ['$rootScope', '$q', '$mdMedia', '$cookies', '$window', '$state', '$http', '$mdDialog', '$mdUtil', '$timeout',($rootScope, $q, $mdMedia, $cookies, $window, $state, $http, $mdDialog, $mdUtil, $timeout) => {
            let obj = {},
                _lang = $cookies.get("_lang"),
                alertDialog = (msg) => {
                    return $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(obj.contextSelector ? document.querySelector(obj.contextSelector) : document.body))
                            .clickOutsideToClose(true)
                            .textContent(msg)
                            .ariaLabel(msg)
                            .ok((_lang == "zh-cn") ? '了解' : "Got it")
                    );
                },
                confirmDialog = (msg, accept, reject) => {
                    let confirm = $mdDialog.confirm()
                        .parent(angular.element(obj.contextSelector ? document.querySelector(obj.contextSelector) : document.body))
                        .textContent(msg)
                        .ariaLabel('确认框')
                        .clickOutsideToClose(true)
                        .ok((_lang == "zh-cn") ? '确定' : "Yes")
                        .cancel((_lang == "zh-cn") ? '取消' : "No")
                    return $mdDialog.show(confirm).then(() => {
                        if (accept && (typeof accept == "function")) {
                            return accept.call();
                        }
                    }, () => {
                        if (reject && (typeof reject == "function")) {
                            return reject.call();
                        }
                    });
                },
                toPlatform = path => {
                    $window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/${path ? path.replace(/^\/(.*)/, "$1") : ""}`;
                },
                getSystemHints = () => {
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
                    }, why => {
                        $rootScope.alert(why);
                    });
                },
                LoginController = ($scope, $mdDialog) =>{
                    $scope.login_msg = '';
                    $scope.loginMistakes = $cookies.get("_showCaptcha")?3:0;
                    let captcha_img = "/captcha?l=50&_l=1", rememberMistakes = ()=>{
                        $scope.loginMistakes++;
                        if($scope.loginMistakes > 2){
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

                        $http.post('/agent', {
                            module: 'sso',
                            partial: 'session',
                            api: 'login',
                            param: myParam
                        }).then(body => {
                            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                                $rootScope.profile = body.data;
                                $cookies.put("_session", JSON.stringify(body.data), {path: "/",domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                                forgetMistakes.call();
                                getSystemHints.call();
                                $mdDialog.hide();
                                $('.login').css('pointerEvents','');
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
                    $scope.close = ()=>{
                        $mdDialog.hide();
                        $('.login').css('pointerEvents','');
                    }
                    $scope.toPlatform = $rootScope.toPlatform;
                },
                // 以100为单位，画100次
                loadingTriangles = [
                    [{x: 5.26166667,y: 26.99955},{x: 9.46644444,y:34.20105},{x: 13.6788148,y:26.99955}],
                    [{x: 10.5233333,y: 34.7985},{x: 18.9344074,y:34.7985},{x: 14.7281111,y:27.597}],
                    [{x: 15.7795333,y: 26.99955},{x: 19.9903852,y:34.20105},{x: 24.195163,y:26.99955}],
                    [{x: 21.0384667,y: 34.7985},{x: 29.4556148,y:34.7985},{x: 25.2523556,y:27.597}],
                    [{x: 26.3001333,y: 26.99955},{x: 30.5064296,y:34.20105},{x: 34.7172815,y:26.99955}],
                    [{x: 31.5618,y: 18.00045},{x: 35.7680963,y:25.20195},{x: 39.9789481,y:18.00045}],
                    [{x: 31.5618,y: 16.79895},{x: 39.9789481,y:16.79895},{x: 35.7680963,y:9.59745}],
                    [{x: 30.507037,y: 16.2015},{x: 34.7178889,y:9},{x: 26.3007407,y:9}],
                    [{x: 34.7178889,y: 7.7985},{x: 30.507037,y:0.597},{x: 26.3007407,y:7.7985}],
                    [{x: 21.0384667,y: -0.00045},{x: 25.2523556,y:7.20105},{x: 29.4556148,y:-0.00045}],
                    [{x: 10.5233333,y: -0.00045},{x: 14.7281111,y:7.20105},{x: 18.9344074,y:-0.00045}],
                    [{x: 9.46644444,y: 0.597},{x: 5.26166667,y:7.7985},{x: 13.6788148,y:7.7985}],
                    [{x: 13.6788148,y: 9},{x: 5.26166667,y:9},{x: 9.46644444,y:16.2015}],
                    [{x: 0,y: 16.79895},{x: 8.41714815,y:16.79895},{x: 4.2062963,y:9.59745}],
                    [{x: 0,y: 18.00045},{x: 4.2062963,y:25.20195},{x: 8.41714815,y:18.00045}],
                    [{x: 19.9897778,y: 7.2015},{x: 11.0107778,y:22.5675},{x: 28.9687778,y:22.5675}]
                ],circleList = document.querySelectorAll(".loading svg.triangle circle"), pathList = document.querySelectorAll(".loading svg.triangle path"),preloadingDefer = $q.defer(), loadingDefer = $q.defer();
            Snap.animate(0, 300, function(val){
                for(var i=0; i<pathList.length; i++){
                    var r = pathList[i];
                    if(val <= 100){
                        angular.element(r).attr({
                            d: `M${loadingTriangles[i][0].x},${loadingTriangles[i][0].y} L${loadingTriangles[i][0].x + (loadingTriangles[i][1].x - loadingTriangles[i][0].x)*(Math.min(val,100))/100},${loadingTriangles[i][0].y + (loadingTriangles[i][1].y - loadingTriangles[i][0].y)*(Math.min(val,100)/100)}`
                        });
                    } else if (val <= 200){
                        angular.element(r).attr({
                            d: `M${loadingTriangles[i][0].x},${loadingTriangles[i][0].y} L${loadingTriangles[i][1].x},${loadingTriangles[i][1].y} L${loadingTriangles[i][1].x + (loadingTriangles[i][2].x - loadingTriangles[i][1].x)*(val-100)/100},${loadingTriangles[i][1].y + (loadingTriangles[i][2].y - loadingTriangles[i][1].y)*((val-100)/100)}`
                        });
                    } else if (val < 300){
                        angular.element(r).attr({
                            d: `M${loadingTriangles[i][0].x},${loadingTriangles[i][0].y} L${loadingTriangles[i][1].x},${loadingTriangles[i][1].y} L${loadingTriangles[i][2].x},${loadingTriangles[i][2].y} L${loadingTriangles[i][2].x + (loadingTriangles[i][0].x - loadingTriangles[i][2].x)*(val-200)/100},${loadingTriangles[i][2].y + (loadingTriangles[i][0].y - loadingTriangles[i][2].y)*((val-200)/100)}`
                        });
                    } else if (val == 300){
                        angular.element(r).attr({
                            d: `M${loadingTriangles[i][0].x},${loadingTriangles[i][0].y} L${loadingTriangles[i][1].x},${loadingTriangles[i][1].y} L${loadingTriangles[i][2].x},${loadingTriangles[i][2].y} L${loadingTriangles[i][0].x},${loadingTriangles[i][0].y}Z`
                        });
                    }
                }
            }, ROPStyleConstant.preLoadingTime, ()=>{
                preloadingDefer.resolve();
            });
            angular.element($window).bind("unload", ()=>{
                document.querySelector('.loading').style.display = "";
                //$('.loading').removeClass("out")
                $('.loading').fadeIn();
            });
            return angular.extend(obj, {
                removeLoading (){
                    if (!angular.element('.loading').hasClass("out")) {
                        $('.loading').addClass("start");
                        preloadingDefer.promise.then(()=>{
                            Snap.animate(0, 100, function(val){
                                for(var i=0; i<pathList.length; i++){
                                    var r = pathList[i];
                                    if(i+1<pathList.length){
                                        angular.element(r).css({fill:`rgba(0,197,163,${val/100})`})
                                    } else {
                                        angular.element(r).css({fill:`rgba(255,255,255,${val/100})`})
                                    }
                                }
                            }, ROPStyleConstant.loadingTime, ()=>{
                                loadingDefer.resolve();
                                $('.loading').fadeOut(300,()=>{$('.loading').addClass("out");})
                                /*$('.loading').addClass("out").one($.support.transition.end, () => {
                                    document.querySelector('.loading').style.display = "none";
                                })*/
                            });
                        });
                        return loadingDefer.promise;
                    }
                },
                preloadingPromise:preloadingDefer.promise,
                loadingPromise:loadingDefer.promise,
                minify(){
                    return !$mdMedia('(min-width: 1400px)')
                },
                _lang: _lang,
                locate(url){
                    $window.location.href = url;
                },
                openPopup(path){
                    $window.open(`${Constant.protocol}://${Constant.host}:${Constant.port}/${path ? path : ''}`, "_blank");
                },
                toPlatform: toPlatform,
                go(tab, params, option){
                    $state.go(tab, params, option);
                },
                reload(){
                    $state.reload();
                },
                logout(success, fail){
                    let self = this;
                    return $http.post('/agent', {module: 'sso', partial: 'session', api: 'logout'}).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $cookies.put("_session", null, {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                            $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                            //$rootScope.profile = undefined;
                            if (success && (typeof success == "function")) {
                                let result = success.call();
                                if (result && result.then && (typeof result.then == "function")) {
                                    return result.then();
                                } else {
                                    return $q.when();
                                }
                            }
                        } else {
                            if (fail && (typeof fail == "function")) {
                                let result = fail.call(body.msg);
                                if (result && result.then && (typeof result.then == "function")) {
                                    return result.then();
                                } else {
                                    return $q.reject();
                                }
                            }
                        }
                        //toHome.call();
                        return $q.reject();
                    }, why => {
                        self.alert(why);
                        return $q.reject();
                    });
                },
                quitSession(from){
                    let self = this;
                    return $http.post('/agent', {module: 'sso', partial: 'session', api: 'quit'}).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $cookies.put("_session", null, {path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                            $cookies.remove("_session",{path: "/", domain: `${Constant.nosubdomain?'':'.'}${Constant.host}`});
                            toPlatform(`sso${from?('?from='+from):''}`);
                        } else {
                            self.alert(body.msg);
                        }
                    }, why => {self.alert(why);});
                },
                alert: alertDialog,
                confirm: confirmDialog,
                ajax(api, _param, _cb, _fail){
                    if (!api) {
                        return
                    }
                    let callback = undefined, param = _param, fail = undefined, self = this;
                    if (typeof _cb == "function") {
                        param = _param, callback = _cb, fail = _fail
                    }
                    else if (typeof _param == "function") {
                        callback = _param, fail = _cb;
                    }
                    !self._module && (self._module = document.querySelector("meta[name=module]").content);
                    return $http.post('/agent', {
                        module: self._module,
                        partial: $rootScope.tab,
                        api: api,
                        param: param
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            if (callback && (typeof callback == "function")) {
                                let q = callback.call(null, body.data);
                                if (q) {
                                    return q;
                                }
                            }
                            return body.data;
                        } else {
                            self.alert(body.data.msg);
                            return $q.reject(body.data.msg);
                        }
                    }, why => {
                        self.alert(why);
                        (fail && (typeof fail == "function")) && fail.call();
                        return $q.reject(why);
                    });
                },
                browserType: window.getBrowserType(),
                OSName: window.getOSName(),
                nextTick() {
                    $mdUtil.nextTick.apply(null, arguments);
                },
                defer() {
                    return $q.defer();
                },
                apiRedirect(api){
                    return `${Constant.legacyDomain}/api/redirect?api_name=${api}`
                },
                showLogin(ev){
                    $('.login').css('pointerEvents','auto');
                    return $mdDialog.show({
                        controller: LoginController,
                        templateUrl: '/_view/common/login',
                        parent: angular.element('.login'),
                        clickOutsideToClose: false,
                        targetEvent: ev,
                        openFrom: ev.target,
                    }).then(answer => {}, () => {$('.login').css('pointerEvents','');});
                },
                snap: Snap
            })
        }])
        .factory('ROPDateUtil', function () {
            let getFirstDateOfMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth(), 1);
                },
                getMonthsInSeason = (date) => {
                    var months = [], monthIndex = date.getMonth();
                    if ((monthIndex >= 0 ) && (monthIndex <= 2 )) {
                        months = [0, 1, 2];
                    } else if ((monthIndex >= 3 ) && (monthIndex <= 5 )) {
                        months = [3, 4, 5];
                    } else if ((monthIndex >= 6 ) && (monthIndex <= 8 )) {
                        months = [6, 7, 8];
                    } else if ((monthIndex >= 9 ) && (monthIndex <= 11 )) {
                        months = [9, 10, 11];
                    }
                    return months;
                },
                getNumberOfDaysInMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                },
                getDateInNextMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
                },
                getDateInPreviousMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
                },
                isSameMonthAndYear = (d1, d2) => {
                    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
                },
                isSameDay = (d1, d2) => {
                    return d1.getDate() == d2.getDate() && isSameMonthAndYear(d1, d2);
                },
                isInNextMonth = (startDate, endDate) => {
                    var nextMonth = getDateInNextMonth(startDate);
                    return isSameMonthAndYear(nextMonth, endDate);
                },
                isInPreviousMonth = (startDate, endDate) => {
                    var previousMonth = getDateInPreviousMonth(startDate);
                    return isSameMonthAndYear(endDate, previousMonth);
                },
                getDateMidpoint = (d1, d2) => {
                    return createDateAtMidnight((d1.getTime() + d2.getTime()) / 2);
                },
                getWeekOfMonth = (date) => {
                    var firstDayOfMonth = getFirstDateOfMonth(date);
                    return Math.floor((firstDayOfMonth.getDay() + date.getDate() - 1) / 7);
                },
                incrementDays = (date, numberOfDays) => {
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + numberOfDays);
                },
                incrementMonths = (date, numberOfMonths) => {
                    var dateInTargetMonth = new Date(date.getFullYear(), date.getMonth() + numberOfMonths, 1);
                    var numberOfDaysInMonth = getNumberOfDaysInMonth(dateInTargetMonth);
                    if (numberOfDaysInMonth < date.getDate()) {
                        dateInTargetMonth.setDate(numberOfDaysInMonth);
                    } else {
                        dateInTargetMonth.setDate(date.getDate());
                    }

                    return dateInTargetMonth;
                },
                getMonthDistance = (start, end) => {
                    return (12 * (end.getFullYear() - start.getFullYear())) + (end.getMonth() - start.getMonth());
                },
                getLastDateOfMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth(), getNumberOfDaysInMonth(date));
                },
                isValidDate = (date) => {
                    return date != null && date.getTime && !isNaN(date.getTime());
                },
                setDateTimeToMidnight = (date) => {
                    if (isValidDate(date)) {
                        date.setHours(0, 0, 0, 0);
                    }
                },
                createDateAtMidnight = (opt_value) => {
                    var date;
                    if (angular.isUndefined(opt_value)) {
                        date = new Date();
                    } else {
                        date = new Date(opt_value);
                    }
                    setDateTimeToMidnight(date);
                    return date;
                },
                isDateWithinRange = (date, minDate, maxDate) => {
                    var dateAtMidnight = createDateAtMidnight(date);
                    var minDateAtMidnight = isValidDate(minDate) ? createDateAtMidnight(minDate) : null;
                    var maxDateAtMidnight = isValidDate(maxDate) ? createDateAtMidnight(maxDate) : null;
                    return (!minDateAtMidnight || minDateAtMidnight <= dateAtMidnight) &&
                        (!maxDateAtMidnight || maxDateAtMidnight >= dateAtMidnight);
                },
                isMinTimeBeforeMaxTime = (minTime, maxTime, token) => {
                    if (!token || (typeof token != "string")) {
                        return null
                    }
                    ;
                    var minTimeArray = minTime.split(token).map(r => {
                        return Number.parseInt(r)
                    }), maxTimeArray = maxTime.split(token).map(r => {
                        return Number.parseInt(r)
                    });
                    if ((minTimeArray.length < 3) || (maxTimeArray.length < 3)) {
                        return null
                    }
                    ;
                    var minTimestamp = minTimeArray[2] + minTimeArray[1] * 60 + minTimeArray[0] * 60 * 60, maxTimestamp = maxTimeArray[2] + maxTimeArray[1] * 60 + maxTimeArray[0] * 60 * 60;
                    return (minTimestamp <= maxTimestamp);
                },
                isTimeWithinRange = (time, minTime, maxTime, token) => {
                    if (!token || (typeof token != "string")) {
                        return null
                    }
                    ;
                    var timeArray = time.split(token).map(r => {
                        return Number.parseInt(r)
                    }), minTimeArray = minTime.split(token).map(r => {
                        return Number.parseInt(r)
                    }), maxTimeArray = maxTime.split(token).map(r => {
                        return Number.parseInt(r)
                    });
                    if ((minTimeArray.length < 3) || (maxTimeArray.length < 3) || (timeArray.length < 3)) {
                        return null
                    }
                    ;
                    var timestamp = timeArray[2] + timeArray[1] * 60 + timeArray[0] * 60 * 60,
                        minTimestamp = minTimeArray[2] + minTimeArray[1] * 60 + minTimeArray[0] * 60 * 60, maxTimestamp = maxTimeArray[2] + maxTimeArray[1] * 60 + maxTimeArray[0] * 60 * 60;
                    return (timestamp <= maxTimestamp) && (minTimestamp <= timestamp);
                },
                isValidTime = (time, token) => {
                    return new RegExp("^([0-1]?[0-9]|2[0-3])" + token + "([0-5]?[0-9])" + token + "([0-5]?[0-9])$").test(time)
                },
                freeFormatDate = (date, fmt) =>{ //author: meizz
                    let o = {
                        "M+": date.getMonth() + 1, //月份
                        "d+": date.getDate(), //日
                        "H+": date.getHours(), //小时
                        "m+": date.getMinutes(), //分
                        "s+": date.getSeconds(), //秒
                        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                        "S": date.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
                    for (let k in o)
                        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
                    return fmt;
                };

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
                isDateWithinRange: isDateWithinRange,
                isMinTimeBeforeMaxTime: isMinTimeBeforeMaxTime,
                isValidTime: isValidTime,
                isTimeWithinRange: isTimeWithinRange,
                getMonthsInSeason: getMonthsInSeason,
                freeFormatDate: freeFormatDate
            };
        })
        /**
         * Module Loader
         * 用于动态加载那些比较大的组件，插件，集成了requirejs，默认会把被require文件的所有module加载进来
         * 如果有的组件dom在module加载前已被编译过，则需要指定selector重新编译
         * 传入scope，用于指定组件所在的环境
         * file: String 或者 Array
         * selector: String
         * scope: obj
         * thanks to ocLazyLoad
         * */
        .factory('ModuleLoader', ['$q', '$ocLazyLoad', '$compile', 'ScopeInitializer',($q,$ocLazyLoad,$compile,ScopeInitializer)=>{
            return {
                _loader: $ocLazyLoad,
                reload(file,selector,scope){
                    var defer = $q.defer();
                    $ocLazyLoad.load(file).then(()=>{
                        selector &&(typeof selector == "string") && ($compile(angular.element(selector))(scope));
                        defer.resolve();
                    },()=>{
                        ScopeInitializer.alert("组件初始化失败");
                        defer.reject();
                    })
                    return defer.promise;
                }
            }
        }]);
});
