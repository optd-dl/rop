
/* App Module */

let supplierApp = angular.module('SupplierApp', [
    'ngRoute','ui.router','ngAnimate','ngCookies','ngMaterial', 'ngMessages'
]);

supplierApp.config($mdThemingProvider => {
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
            'hue-1': '300',
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

supplierApp.config($mdIconProvider => {
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

supplierApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',
    ($stateProvider, $urlRouterProvider, $locationProvider) => {
        $stateProvider.
            state('index', {
                templateUrl: '/_view/supplier/index',
                url: '/supplier/home',
                controller: 'IndexCtrl',
            }).
            state('all-comment', {
                templateUrl: '/_view/supplier/all-comment',
                url: '/supplier/all-comment',
                controller: 'AllCommentCtrl'
            }).
            state('API', {
                params: {
                    param: null,
                    cat_id:""
                },
                templateUrl: '/_view/supplier/API',
                url: '/supplier/API',
                controller: 'APICtrl'
            }).
            /*state('API.Legacy', {
                templateUrl: '/_view/supplier/API',
                url: '/api/ApiMethod-:id.html',
                controller: 'APICtrl'
            }).*/
            state('API?:id', {
                params: {
                    param: null,
                    cat_id:""
                },
                templateUrl: '/_view/supplier/API',
                url: '/supplier/API',
                controller: 'APICtrl'
            }).
            state('function', {
                templateUrl: '/_view/supplier/function',
                url: '/supplier/function',
                controller: 'FunctionCtrl'
            }).
            state('info', {
                templateUrl: '/_view/supplier/info',
                url: '/supplier/info',
                controller: 'InfoCtrl'
            }).
            state('info-detail', {
                templateUrl: '/_view/supplier/info-detail',
                url: '/supplier/info-detail',
                controller: 'InfoDetailCtrl'
            });
        //$urlRouterProvider.when(/aspx/i, '/supplier/API');
        $urlRouterProvider.when(/\/api\/.+\.html/i, '/supplier/API');
        $urlRouterProvider.otherwise('/supplier/home');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }]);

supplierApp.controller('SupplierCtrl', ['$scope','$route','$http','$location','$rootScope','$window','$state','$cookies','$mdDialog','$mdMedia',
    (
        $scope,
        $route,
        $http,
        $location,
        $rootScope,
        $window,
        $state,
        $cookies,
        $mdDialog,
        $mdMedia) => {
        //  TODO 为了保持url清洁，这里采用的post穿参，不过为了调试方便也保留了get方式
        $rootScope.ssv_user_id = $location.search().ssv_user_id;
        $rootScope.loginMistakes = 0;
        $rootScope._timestamp = new Date().getTime();
        $scope.verifyCode = () => {
            let _captcha = $cookies.get("_captcha");
            if(_captcha){
                return ($scope.captchaCode == $cookies.get("_captcha"));
            } else {
                $scope.resetCaptcha();
                return;
            }
        }
        /*$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
        });

        $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
            console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
        });

        $rootScope.$on('$viewContentLoaded',function(event){
            console.log('$viewContentLoaded - fired after dom rendered',event);
        });

        $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
            console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        });*/

        let hideLoading = () => $http.post('/agent',{module:'supplier',partial:'index',api:'carousels',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            if(body.data.data_list && body.data.data_list.length){
                $rootScope.carousels = body.data.data_list;
            } else {
                $rootScope.carousels = [{"image_title":"<span style='color: white'>融数供应商</span>","image_desc":"<span style='color: gray'>融数供应商描述</span>","image_url":"/resource/supplier/mr1.jpg","image_link":""},{"image_title":"<span style='color: white'>融数供应商</span>","image_desc":"<span style='color: gray'>融数供应商描述</span>","image_url":"/resource/supplier/mr2.jpg","image_link":""}]
            }
            $('.loading').addClass("start");
            setTimeout(() => {
                $('.loading').addClass("out").one($.support.transition.end,function () {$(this).hide();$('body').addClass('reveal');});;
            },ROPStyleConstant.loadingTime);
        }, why => {
            $rootScope.alert(why);
        });

        $scope.getIntro = cb => $http.post('/agent',{module:'supplier',partial:'index',api:'ssv_intro',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            $rootScope.ssv_intro = body.data;
            cb && cb.call();
        }, why => {
            $rootScope.alert(why);
        })

        $rootScope.logout = () => {
            $http.post('/agent',{module:'sso',partial:'session',api:'logout'}).then(body => {
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.getIntro(() => {
                        $cookies.put("_session",null,{path:"/",domain:`.${Constant.host}`});
                        $cookies.remove("_session");
                        $rootScope.profile = undefined;
                    });
                } else {
                }
            }, why => {
                $rootScope.alert(why);
            });
        }

        function LoginController($scope, $mdDialog) {
            let captcha_img = "/captcha?l=50&_l=1";
            $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;

            $scope.resetCaptcha = () => {
                $scope.captchaCode = "";
                $scope.captcha_img = `${captcha_img}&time=${new Date().getTime()}`;
            }
            $scope.showCaptcha = ($rootScope.loginMistakes > 2);
            $scope.login = () => {
                if ($scope.loginForm.$invalid && ($rootScope.loginMistakes > 2)) {
                    $scope.loginForm.$error.required && $scope.loginForm.$error.required.forEach(r => {
                        r.$setDirty(true);
                    });
                    $('#loginPanel').parent().addClass('invalid');
                    setTimeout(() => {
                        $('#loginPanel').parent().removeClass('invalid');
                    }, 600)
                    $rootScope.loginMistakes++;
                    $scope.showCaptcha = ($rootScope.loginMistakes > 2);
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
                    login_system: OSName,
                    ssv_id:$rootScope.ssv_user_id?$rootScope.ssv_user_id:''
                };

                $http.post('/agent', {
                    module: 'sso',
                    partial: 'session',
                    api: 'login',
                    param: myParam
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $rootScope.profile = body.data;
                        $rootScope.getSystemHints();
                        $cookies.put("_session", JSON.stringify($rootScope.profile), {path: "/", domain: `.${Constant.host}`});
                        $('.login').css('pointerEvents','');
                        if(bassdk){
                            var sign = '';
                            try{
                                sign = JSON.parse(getCookie("_session")).sign;
                            } catch(e){

                            }
                            bassdk.userIdentify(sign,true);
                        }
                        $mdDialog.hide(1);
                    } else {
                        //$scope.password = '';
                        $rootScope.loginMistakes++;
                        $rootScope.profile = undefined;
                        $scope.showCaptcha = ($rootScope.loginMistakes > 2);
                        $('#loginPanel').parent().addClass('invalid');
                        setTimeout(() => {
                            $('#loginPanel').parent().removeClass('invalid');
                        }, 600)
                    }
                }, why => {
                    $rootScope.alert(why);
                });
            }

            $scope.toModule = $rootScope.toModule;
        }
        $rootScope.getSystemHints = () => {
            $http.post('/agent', {
                module: 'common',
                partial: 'common',
                api: 'tips'
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $rootScope.systemHints = body.data.data_list;
                    //($rootScope.originalSystemHints = body.data.data_list);
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                // TODO 弹窗
                $rootScope.alert(why);
            });
        }
        $rootScope.showAdvanced = ev => {
            $('.login').css('pointerEvents','auto');
            $mdDialog.show({
                controller: LoginController,
                templateUrl: '/_view/supplier/login',
                parent: angular.element('.login'),
                //targetEvent: ev,
                clickOutsideToClose:true,
                //fullscreen: true,
                onComplete: ()=>{
                    //$(document.body).css('maxHeight','300vh');
                }
                /*locals: {
                 items: $scope.items
                 }*/
            })
                .then(answer => {
                    //$scope.status = `You said the information was "${answer}".`;
                    console.log(1)
                }, () => {
                    $('.login').css('pointerEvents','');
                    //$(document.body).css('maxHeight','');
                });
        };

        $rootScope.favor = () => {
            $http.post('/agent',{module:'supplier',partial:'session',api:'favor',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
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

        $rootScope.request = () => {
            $http.post('/agent',{module:'supplier',partial:'session',api:'request',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
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
        $rootScope.locate = url => {
            $window.location.href = url;
        }
        $rootScope.toPlatform = path => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}${path?path:""}`);
        }
        $rootScope.toModule = module => {
            $scope.locate(`${Constant.protocol}://${Constant.host}:${Constant.port}/${module}`);
        }
        $scope.init = (id, partial, info, param) => {
            let _session = $cookies.get("_session")?JSON.parse($cookies.get("_session")):'';
            let _param;
            let _info;
            try {
                _param= JSON.parse(param);
            } catch(e){
                _param = undefined;
            }
            window._ssv = {};
            try {
                _info= JSON.parse(info);
                window._ssv = _info;
            } catch(e){
                _info = undefined;
            }

            if(_session && (id == _session.id)){
                $rootScope.profile = _session;
                $rootScope.getSystemHints();
            } else {
                $cookies.remove("_session");
                $rootScope.profile = undefined;
            }

            let initialize = () => {
                $scope.getIntro().then(() => hideLoading()).then(() => {
                    if(partial){
                        if(_param){
                            $state.go(partial,{param:_param,cat_id:_info.cat_id});
                        } else {
                            $state.go(partial);
                        }
                    } else {
                        //$state.go('index');
                    }
                });
            };

            if(_info){
                $rootScope.ssv_user_id = _info.ssv_id;
                initialize();
            } else {
                if(!$rootScope.ssv_user_id){
                    let ssv_user_id = sessionStorage.getItem("_ssv_user_id");
                    if(ssv_user_id){
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

        $rootScope.scrollToTop = cb => {
            if(getBrowserType() == "Firefox"){
                $('html').animate({ scrollTop: 0 },cb);
            } else {
                $('body').animate({ scrollTop: 0 },cb);
            }
        }

        let _lang = $cookies.get("_lang");
        $rootScope.alert = msg => {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title((_lang == "zh-cn")?'出错了':"Oops")
                    .textContent(msg)
                    .ariaLabel(msg)
                    .ok((_lang == "zh-cn")?'了解':"Got it")
            );
        }
        $rootScope.isAdmin = () => {
            $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3')) ? true:false;
        }
    }]);
supplierApp.controller('IndexCtrl', ['$rootScope','$scope','$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = 'index';
        //Revolution Slider
        if($rootScope.revslider){

        }

        $scope.scrollToContent = cb => {
            $('body').animate({ scrollTop: $(window).height()},cb);
        }
        $('a[href^="#"]','#partials').click(e => {
            e.preventDefault();
        });
        //$('.carousel','#partials').carousel();

        let devQ = $http.post('/agent',{module:'supplier',partial:'index',api:'success_developers',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            if(body.data.data_list && body.data.data_list.length){
                $scope.success_developers = body.data.data_list;
                setTimeout(() => {
                    Holder && Holder.run({images:document.querySelectorAll('img[src=""]')});
                })
            }
        }, why => {
            $rootScope.alert(why);
        });
        $http.post('/agent',{module:'supplier',partial:'index',api:'get_feature',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            if(body && body.data && body.data.user_desc){
                $scope.ssv_feature = body.data.user_desc;
            }
        }, why => {
            $rootScope.alert(why);
        });

        $scope.$on('$viewContentLoaded',
                event => {
                devQ.then(() => {
                    setTimeout(() => {
                        $("#owl-footer").owlCarousel({
                            items : 4, //10 items above 1000px browser width
                            autoPlay: 3000,
                            pagination: false,
                            navigation: false,
                            navigationText: false,
                            itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
                        });
                    })
                });
                setTimeout(() => {
                    $('.carousel').carousel({
                        interval: 6000
                    });
                }, 800)
            });
    }]);
supplierApp.controller('FunctionCtrl', ['$rootScope','$scope','$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = 'function';
        $('a[href^="#"]','#partials').click(e => {
            e.preventDefault();
        });

        $http.post('/agent',{module:'supplier',partial:'function',api:'get_feature',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            if(body && body.data && body.data.user_desc){
                $scope.ssv_feature = body.data.user_desc;
            }
        }, why => {
            $rootScope.alert(why);
        });
    }]);
supplierApp.controller('AllCommentCtrl', ['$rootScope','$scope','$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = 'allComment';
        $('a[href^="#"]','#partials').click(e => {
            e.preventDefault();
        });

        $scope.comments = [];

        $scope.searcher = () => {
            $scope.loading=true;
            $http.post('/agent',{module:'supplier',partial:'all-comment',api:'comments',param:{ssv_user_id: $rootScope.ssv_user_id}}).then(body => {
                let totalPages = (typeof body.data.page_count == 'number')?body.data.page_count:(new Number(body.data.page_count));
                if(body.data.data_list && body.data.data_list.length){
                    $.extend($scope.comments, body.data.data_list);
                }
                $scope.loading=false;
            }, why => {
                $scope.loading=false;
                $rootScope.alert(why);
            });
        };

        $scope.saveComment = () => {
            if ($scope.commentForm.$invalid) {
                $scope.commentForm.$error.required && $scope.commentForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                $('#flash').addClass('warn');
                setTimeout(() => {
                    $('#flash').removeClass('warn');
                    //$('#loginPanel').removeClass('invalid');
                    $scope.$apply();
                }, 1000)
                return;
            }
            if(!$rootScope.profile){
                $rootScope.showAdvanced();
                return;
            }
            $http.post('/agent',{module:'supplier',partial:'all-comment',api:'add',param: {comment_content:$scope.comment_content_area, ssv_user_id:$scope.ssv_user_id}}).then(body => {
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.commentForm.$setPristine();
                    $scope.comment_content_area = "";
                    $scope.searcher();
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
            });
        }

        $scope.isCurrentSsv = () => {
            if(!$rootScope.profile || !$rootScope.ssv_intro){
                return false;
            }
            return ($rootScope.profile.login_user_name == $rootScope.ssv_intro.user_name);
        }
        $scope.toggleReply = comment => {
            comment._toggleReply = (!comment._toggleReply);
        }
        $scope.replyComment = comment => {
            comment._toggleReply = (!comment._toggleReply);
            setTimeout(() => {
                $http.post('/agent',{module:'supplier',partial:'all-comment',api:'reply',param: {comment_id:comment.comment_id,comment_content:comment._comment_content, ssv_user_id:$scope.ssv_user_id}})
                    .then(body => {
                        if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                            delete comment._comment_content;
                            $scope.searcher();
                        } else {
                            $rootScope.alert(body.data.msg);
                        }
                    }, why => {
                        $rootScope.alert(why);
                    });
            },400);
        }
        $scope.isCreator = comment => {
            if(!$rootScope.profile || !comment){
                return false;
            }
            return ($rootScope.profile.login_user_name == comment.create_user);
        }
        $scope.deleteComment = (comment, comments) => {
            $http.post('/agent',{module:'supplier',partial:'all-comment',api:'delete',param: {comment_id:comment.comment_id}}).then(body => {
                if(((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))){
                    $scope.comment_content_area = "";
                    comments.splice(comments.indexOf(comment),1);
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
            });
        }

        $scope.checkID = () => {
            if(!$rootScope.profile){
                return false;
            }

            if($rootScope.profile.id == $scope.ssv_user_id){
                return true;
            }

            return true;
        }
        $scope.searcher();
    }]);
supplierApp.controller('APICtrl', ['$rootScope','$scope', '$http','$filter','$q','$cookies','$stateParams','$mdSidenav','$mdDialog',
    (
        $rootScope,
        $scope,
        $http,
        $filter,
        $q,
        $cookies,
        $stateParams,
        $mdSidenav,
        $mdDialog) => {
        let mode = $stateParams.param, modeCatId = $stateParams.cat_id;
        $rootScope.tab = 'API';
        $('a[href^="#"]','#partials').click(e => {
            e.preventDefault();
        });
        let _lang = $cookies.get("_lang");
        let beforeClipboardCopy = (_lang == "zh-cn")?"复制文档地址":"Copy document URL",
            afterClipboardCopy = (_lang == "zh-cn")?"已复制":"Copied",
            workaroundSupportClipboard = action => {
                let actionMsg = ` 来${action === 'cut' ? '剪切' : '拷贝'}`;
                let actionKey = (action === 'cut' ? 'X' : 'C');

                if(/iPhone|iPad/i.test(navigator.userAgent)) {
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
        $scope.nav = {entry:'api',subEntry:'',subDomains:[]},$scope.breadcrumbs = [],$scope.selectedEntry = 0,$scope.defaultDetails={api_name:"API名字"},$scope.apiDetails = $scope.defaultDetails,$scope.domainDetails = $scope.defaultDetails,$scope.cat = {cat_list:[],_selectedItem:0},
            $scope.clipboardHints = beforeClipboardCopy,$scope.makeDebugUrl = api => `${Constant.protocol}://${Constant.host}/ApiTool/index?sign=${api}`
        $scope.makeSDKUrl = api => `${Constant.protocol}://${Constant.host}/welcome/sdkTool`,$scope.simpleAPILevelDescription = () => {
            //$("#simpleAPILevelDescription").modal();
        };

        class DynamicItems {
            constructor(list) {
                this.list = list;
                this.PAGE_SIZE = 10;
                this.loadedPages = {};
                for(let i = 0; i < Math.ceil(this.list.length/this.PAGE_SIZE); i++){
                    this.loadedPages[i] = [];
                    this.loadedPages[i] = this.list.slice(i*this.PAGE_SIZE,(i+1)*this.PAGE_SIZE);
                }
            }

            getItemAtIndex(index) {
                let pageNumber = Math.floor(index / this.PAGE_SIZE);
                let page = this.loadedPages[pageNumber];
                if(page){
                    return page[index % this.PAGE_SIZE];
                } else {
                    return [];
                }

            }

            getLength() {
                return this.list.length;
            }
        }

        let catQ = () => $http.post('/agent',{module:'supplier',partial:'API',api:'get_ssv_cat',param:{ssv_user_id:$rootScope.ssv_user_id}}).then(body => {
            $scope.originalCat = {cat_list:body.data.cat_list,_selectedItem:0};
            if(body.data && body.data.cat_list && body.data.cat_list.length){
                $scope.cat = {cat_list:body.data.cat_list,_selectedItem:0};
                if($scope.cat.cat_list){
                    for(let j = 0; j < $scope.cat.cat_list.length; j++){
                        if($scope.cat.cat_list[j].group_list) {
                            $scope.cat.cat_list[j]._selectedItem = 0;
                            if($scope.apiCategoryId == $scope.cat.cat_list[j].cat_id){
                                $scope.cat._selectedItem = j;
                            }
                            for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                                //$scope.cat.cat_list[j].group_list[i].dynamicAPIItems = new DynamicItems($scope.cat.cat_list[j].group_list[i].api_list);
                                if($scope.cat.cat_list[j].group_list[i].api_list){
                                    for (let k = 0; k < $scope.cat.cat_list[j].group_list[i].api_list.length; k++) {
                                        if(mode && mode.apiMethod && (mode.apiMethod == $scope.cat.cat_list[j].group_list[i].api_list[k].api_id)){
                                            $scope.cat.cat_list[j]._selectedItem = i;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $scope.cat = {cat_list:body.data.cat_list,_selectedItem:0};
                $rootScope.alert("当前供应商没有任何API发布");
            }
        }, why => {
            $rootScope.alert(why);
        });
        let apiQ = () => $http.post('/agent',{module:'supplier',partial:'API',api:'api_list',param:{ssv_user_id:$rootScope.ssv_user_id,cat_id:$scope.apiCategoryId}}).then(body => {
            if(body.data && body.data.data_list && body.data.data_list.length){
                $scope.api_list = body.data.data_list;
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            $rootScope.alert(why);
        });
        let domainQ = () => $http.post('/agent',{module:'supplier',partial:'API',api:'api_domain',param:{ssv_user_id:$rootScope.ssv_user_id,cat_id:$scope.apiCategoryId}}).then(body => {
            if(body.data && body.data.data_list && body.data.data_list.length){
                $scope.api_domain = body.data.data_list;
                //$scope.$apply();
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            $rootScope.alert(why);
        });
        let ssvQ = param => $http.post('/agent',{module:'supplier',partial:'API',api:'get_ssv',param}).then(body => {
            if(body && body.data && body.data.ssv_user_id){
                $rootScope.ssv_user_id = body.data.ssv_user_id;
                $scope.apiCategoryId = body.data.cat_id;
                $scope.getIntro();
                //return $q.all([apiQ(),domainQ()]);
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            $rootScope.alert(why);
        });
        let domainDetailQ = (domain_id, cat) => {
            let cat_id = cat.cat_id;
            $scope.apiCategoryName = cat.cat_name;
            cat_id && ($scope.apiCategoryId = cat_id);
            return $http.post('/agent',{module:'supplier',partial:'API',api:'domain_detail',param:{domain_id}}).then(body => {
                if(body.data && body.data.data_list && body.data.data_list.length){
                    $scope.domainDetails = body.data.data_list[0];
                } else {
                    $scope.domainDetails = $scope.defaultDetails;
                }
                //cat_id && ($scope.breadcrumbs = [$scope.domainDetails]);
                ($scope.domainDetails.domain_desc) && ($scope.domainDetails.domain_desc_expanded = true);
                ($scope.domainDetails.property) && ($scope.domainDetails.property_expanded = true);

                let j = $scope.cat._selectedItem;
                for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                    $scope.cat.cat_list[j]._domain_index = 0;
                    if($scope.cat.cat_list[j].domain_list){
                        for (let k = 0; k < $scope.cat.cat_list[j].domain_list.length; k++) {
                            if($scope.cat.cat_list[j].domain_list[k].domain_id == $scope.domainDetails.domain_id){
                                $scope.cat.cat_list[j]._domain_index = k;
                                break;
                            }
                        }
                    }
                }

                $scope.loading = false;

                var type = 'anonymous';
                try{
                    type = JSON.parse(getCookie("_session")).login_user_type
                } catch(e){

                }
                bassdk.quick('setDefaultAttr');
                bassdk.track('visit', {
                    pageName:$scope.domainDetails.domain_name,
                    userType:type,
                    supplierName:$rootScope.ssv_intro.user_name,
                    pageType:"结构统计"
                });
                return body;
            }, why => {
                $rootScope.alert(why);
                $scope.loading = false;
            });
        };
        $scope.domainDetailQ = (domain_id, cat) => {
            if(!$scope.loading){
                $scope.loading = true;
                if($scope.apiCategoryId){
                    $rootScope.scrollToTop(() => {
                        domainDetailQ(domain_id,cat)
                    })
                    return;
                }
                let cat_id = cat.cat_id;
                $scope.apiCategoryName = cat.cat_name;
                cat_id && ($scope.apiCategoryId = cat_id);
                setTimeout(() => {
                    $rootScope.scrollToTop(() => {
                        domainDetailQ(domain_id,cat)
                    })
                },500)
            }
        }
        let apiDetailQ = (api_id, cat) => {
            let cat_id = cat.cat_id;
            $scope.apiCategoryName = cat.cat_name;
            cat_id && ($scope.apiCategoryId = cat_id);
            $rootScope.scrollToTop();
            return  $http.post('/agent',{module:'supplier',partial:'API',api:'api_detail',param:{api_id}}).then(body => {
                if(body.data && body.data.data_list && body.data.data_list.length){
                    $scope.apiDetails = body.data.data_list[0];
                } else {
                    $scope.apiDetails = $scope.defaultDetails;
                }
                $scope.breadcrumbs = [$scope.apiDetails];
                $scope.apiDetails.api_id = api_id;

                ($scope.apiDetails.api_desc) && ($scope.apiDetails.api_desc_expanded = true);
                ($scope.apiDetails.sysparam_expanded = false);
                ($scope.apiDetails.request_parameter_type) && ($scope.apiDetails.request_parameter_type_expanded = true);
                ($scope.apiDetails.request_parameter_example) && ($scope.apiDetails.request_parameter_example_expanded = true);
                ($scope.apiDetails.response_parameter_desc) && ($scope.apiDetails.response_parameter_desc_expanded = true);
                ($scope.apiDetails.response_parameter_example) && ($scope.apiDetails.response_parameter_example_expanded = true);
                ($scope.apiDetails.busparam && $scope.apiDetails.busparam.length) && ($scope.apiDetails.busparam_expanded = true);
                ($scope.apiDetails.result && $scope.apiDetails.result.length) && ($scope.apiDetails.result_expanded = true);

                $scope.apiDetails.return_example_xml && ($scope.apiDetails.return_example_xml_expanded = true);
                ($scope.apiDetails.error_example_xml_expanded = false);
                $scope.apiDetails.buserror && ($scope.apiDetails.buserror_expanded = true);
                ($scope.apiDetails.syserror_expanded = false);
                ($scope.apiDetails.debug_expanded = true);

                setTimeout(() => {
                    let return_example_xml = $filter("unescapeHtml")($scope.apiDetails.return_example_xml,'xml'), error_example_xml = $filter("unescapeHtml")($scope.apiDetails.error_example_xml,'xml'), return_example_json = $filter("unescapeHtml")($scope.apiDetails.return_example_json,'xml'), error_example_json = $filter("unescapeHtml")($scope.apiDetails.error_example_json,'xml');

                    packageTree(return_example_xml?return_example_xml:"");
                    packageTreeError(error_example_xml?error_example_xml:"");
                    Process(return_example_json?return_example_json:"{}");
                    ProcessError(error_example_json?error_example_json:"{}");
                });

                if(mode){
                    let j = $scope.cat._selectedItem;
                    for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                        $scope.cat.cat_list[j].group_list[i]._api_index = 0;
                        if($scope.cat.cat_list[j].group_list[i].api_list){
                            for (let k = 0; k < $scope.cat.cat_list[j].group_list[i].api_list.length; k++) {
                                if($scope.cat.cat_list[j].group_list[i].api_list[k].api_id == $scope.apiDetails.api_id){
                                    $scope.cat.cat_list[j].group_list[i]._api_index = k;
                                    break;
                                }
                            }
                        }
                    }
                }

                mode = undefined;
                $scope.loading = false;

                var type = 'anonymous';
                try{
                    type = JSON.parse(getCookie("_session")).login_user_type
                } catch(e){

                }
                bassdk.quick('setDefaultAttr');
                bassdk.track('visit', {
                    pageName:$scope.apiDetails.api_name,
                    userType:type,
                    supplierName:$rootScope.ssv_intro.user_name,
                    pageType:"API统计"
                });
            }, why => {
                $rootScope.alert(why);
                $scope.loading = false;
            });
        };

        $scope.apiDetailQ = (api_id, cat) => {
            if(!$scope.loading){
                $scope.loading = true;
                if($scope.apiCategoryId){
                    $rootScope.scrollToTop(() => {
                        apiDetailQ(api_id,cat)
                    })
                    return;
                }
                let cat_id = cat.cat_id;
                $scope.apiCategoryName = cat.cat_name;
                cat_id && ($scope.apiCategoryId = cat_id);
                setTimeout(() => {
                    $rootScope.scrollToTop(() => {
                        apiDetailQ(api_id,cat)
                    })
                },500)
            }
        }

        $scope.changeAPISearch = () => {
            $scope.cat = JSON.parse(JSON.stringify($scope.originalCat));
            if($scope.cat.cat_list){
                for(let j = 0; j < $scope.cat.cat_list.length; j++){
                    if($scope.cat.cat_list[j].group_list) {
                        for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                            if($scope.cat.cat_list[j].group_list[i].api_list){
                                var k = $scope.cat.cat_list[j].group_list[i].api_list.length ;
                                while (k--) {
                                    (($scope.cat.cat_list[j].group_list[i].api_list[k].api_name.indexOf($scope.apiSearch) == -1) && ($scope.cat.cat_list[j].group_list[i].api_list[k].api_title.indexOf($scope.apiSearch) == -1))&&($scope.cat.cat_list[j].group_list[i].api_list.splice(k,1));
                                }
                            }
                        }
                    }

                    if($scope.cat.cat_list[j].domain_list){
                        var k = $scope.cat.cat_list[j].domain_list.length ;
                        while (k--) {
                            (($scope.cat.cat_list[j].domain_list[k].domain_name.indexOf($scope.apiSearch) == -1) && ($scope.cat.cat_list[j].domain_list[k].domain_title.indexOf($scope.apiSearch) == -1))&&($scope.cat.cat_list[j].domain_list.splice(k,1));
                        }
                    }
                }
            }

        }
        $scope.resetView = () => {
            if($scope.selectedEntry){
                // TODO material design 的tab似乎没有对外的selection方法，只好模拟一下选择
                setTimeout(() => {
                    $(".md-expand.active md-tab-item").eq(0).click();
                });

                setTimeout(() => {
                    $scope.param = undefined;
                    $scope.breadcrumbs = [];
                    !$scope.cat.cat_list && catQ();
                    $scope.apiCategoryId = undefined;
                    $scope.apiCategoryName = undefined;
                },200);
            } else {
                $scope.param = undefined;
                $scope.breadcrumbs = [];
                !$scope.cat.cat_list && catQ();
                $scope.apiCategoryId = undefined;
                $scope.apiCategoryName = undefined;
            }

            //$(".md-expand.active md-tab-item").eq(0).click();

        }
        if(mode){
            $scope.apiCategoryId = modeCatId;
            /*setTimeout(() => {
                if(mode.apiMethod){
                    catQ().then(() => {
                        setTimeout(() => {
                            $(".md-expand.active md-tab-item").eq(0).click();
                        })
                        $scope.apiDetailQ(mode.apiMethod,$scope.cat);
                    });
                } else if (mode.domainMethod){
                    catQ().then(() => {
                        setTimeout(() => {
                            $(".md-expand.active md-tab-item").eq(1).click();
                        })
                        $scope.domainDetailQ(mode.domainMethod, $scope.cat);
                    });
                }
            },500)*/
            if(mode.apiMethod){
                catQ().then(() => {
                    setTimeout(() => {
                        $(".md-expand.active md-tab-item").eq(0).click();
                    })
                    $scope.apiDetailQ(mode.apiMethod,$scope.cat.cat_list[$scope.cat._selectedItem]);
                });
            } else if (mode.domainMethod){
                catQ().then(() => {
                    setTimeout(() => {
                        $(".md-expand.active md-tab-item").eq(1).click();
                    })
                    $scope.domainDetailQ(mode.domainMethod, $scope.cat.cat_list[$scope.cat._selectedItem]);
                });
            }
        } else {
            catQ();
            /*setTimeout(() => {
                catQ();
            },500);*/
        }


        $scope.selectCategory = cat_id => {
            $scope.selectedCatId = cat_id;
            apiQ();
            domainQ();
        }
        $scope.selectEntry = entry => {
            $scope.selectedEntry = entry;
            if($scope.loading){
                return;
            }
            if(!entry){
                $scope.breadcrumbs.splice(0);
                if($scope.apiDetails && $scope.apiDetails.api_id && ($scope.defaultDetails !== $scope.apiDetails)){
                    $scope.breadcrumbs.push($scope.apiDetails);
                }
            } else {
                let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];
                if((lastBreadcrumb && lastBreadcrumb.api_id  && ($scope.defaultDetails !== $scope.domainDetails)) || !lastBreadcrumb ){
                    $scope.breadcrumbs.push($scope.domainDetails)
                } else {
                    if($scope.domainDetails && $scope.domainDetails.domain_id){
                        if(($scope.domainDetails.domain_id != lastBreadcrumb.domain_id) && ($scope.defaultDetails !== $scope.domainDetails)){
                            $scope.breadcrumbs.push($scope.domainDetails);
                        }
                    }
                }
            }
        }
        $scope.toSubDomain = (id, details) => {
            if($scope.loading){
                return;
            }
            $scope.loading = true;
            if(!id){
                console.log(`toSubDomain: id = ${id};detail=${JSON.stringify(details)}`);
                return;
            }
            if(details){
                $rootScope.scrollToTop(() => {
                    $(".md-expand.active md-tab-item").eq(1).click();
                    setTimeout(() => {
                        domainDetailQ(id,$scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                            let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];
                            if(lastBreadcrumb && (lastBreadcrumb.domain_id && (lastBreadcrumb.domain_id != id) || lastBreadcrumb.api_id)){
                                $scope.breadcrumbs.push($scope.domainDetails);
                            }
                            $scope.loading = false;
                        });
                    },400)
                })
            } else {
                let id_list = $scope.breadcrumbs.map((r, i) => r.api_id?r.api_id:r.domain_id), subdomain_index = id_list.indexOf(id);
                $scope.breadcrumbs.splice(subdomain_index+1);
                let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];

                if(lastBreadcrumb.api_id){
                    //$scope.breadcrumbs = [];
                    $rootScope.scrollToTop(() => {
                        $(".md-expand.active md-tab-item").eq(0).click();
                        setTimeout(() => {
                            apiDetailQ(id,$scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                                $scope.loading = false;
                            });
                        },400)
                    })
                } else {
                    $rootScope.scrollToTop(() => {
                        $(".md-expand.active md-tab-item").eq(1).click();
                        setTimeout(() => {
                            domainDetailQ(id,$scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                                $scope.loading = false;
                            });
                        },400)
                    })
                }
            }
        }
        $scope.copyToClipboard = details => {
            let id = details.api_id?details.api_id:details.domain_id, method=details.api_id?"ApiMethod":"ApiDomain";
            return `${Constant.protocol}://${Constant.host}/api/${method}-${id}.html`;
        }
        $scope.levelHint = $event => {
            $event.preventDefault();
            $event.stopPropagation();
            let parentEl = angular.element(document.body);
            $mdDialog.show({
                /*parent: parentEl,*/
                targetEvent: $event,
                clickOutsideToClose:true,
                fullscreen: false,
                template:
                '<md-dialog aria-label="List dialog" class="level-description">' +
                '  <md-dialog-content style="padding: 32px;">'+
                '  <p><span style="font-size:12px;">开放平台API目前分为低级、中级、高级，根据API的等级不同，需要使用对应的调用方式。</span></p>        <p>             <md-button class="md-raised low-rank" aria-label="Settings">初级API</md-button>可以使用ACCESS_TOKEN模式和安全签名方式进行调用            </p>            <p>            <md-button class="md-raised medium-rank" aria-label="Settings">中级API</md-button>可以使用ACCESS_TOKEN模式和安全签名方式进行调用            </p>            <p>            <md-button class="md-raised high-rank" aria-label="Settings">高级API</md-button>只可以使用安全签名方式进行调用。            </p>             <br /> <p>            <span style="font-size:12px;">供应商在发布API时，目前系统会自动根据供应商安全等级分配API调用等级，后续版本将会开放供应商自行设置API调用等级。</span>            </p>            <p>            <span style="font-size:12px;">当API调用等级比较低时，供应商应处理好服务器的调用安全性，确保数据的安全。</span>            </p>            <p>            <span style="font-size:12px;">开发者在调用初级和中级API时，必须使用https方式进行调用，保证数据传输中的安全性。</span>            </p> <br />          <p>            具体调用方式请参照 </p><p><a href="http://open.rongcapital.cn/welcome/doc?doc=4D41D81C-CBB1-4567-8D15-ACC16EE025C8" target="_blank">Secret签名模式调用API </a></p><p><a href="http://open.rongcapital.cn/welcome/doc?doc=1109A17A-5873-420E-A590-C4CE6C5A2D59" target="_blank">ACCESS_TOKEN模式调用API</a></p><p><a href="http://open.rongcapital.cn/welcome/doc?doc=792E3864-2481-42B9-9CD2-4D4B83F3B294" target="_blank">前端调用模式说明</a></p>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-raised">' +
                '      关闭我' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                controller: DialogController
            });
            function DialogController($scope, $mdDialog) {
                $scope.closeDialog = () => {
                    $mdDialog.hide();
                }
            }
        }
        $scope.getScrollIndex = (list, type) => {
            if(type){
                return ($scope.apiDetails && $scope.apiDetails.api_id)?[].concat.apply([],list.map((r, i) => ($scope.apiDetails.api_id == r.api_id)?[i]:[]))[0]:0;
            } else {
                return ($scope.domainDetails && $scope.domainDetails.domain_id)?[].concat.apply([],list.map((r, i) => ($scope.domainDetails.domain_id == r.domain_id)?[i]:[]))[0]:0;
            }
        }
        $scope.$on('$viewContentLoaded',
                event => {
                let cliper = new Clipboard('.cliper');
                /*setTimeout(() => {
                    $('.cliper').tooltip({
                        placement: "right"
                    });
                });*/
                cliper.on('success', e => {
                    e.clearSelection();
                    $scope.clipboardHints = afterClipboardCopy;
                    /*$(e.trigger).attr('data-original-title', afterClipboardCopy)
                        .tooltip('show');*/
                    setTimeout(() => {
                        /*$(e.trigger).attr('data-original-title', beforeClipboardCopy);
                        $(document).find($(e.trigger).data()["bs.tooltip"].$tip).length && ($(e.trigger).tooltip("show"));*/
                        $scope.clipboardHints = beforeClipboardCopy;
                        $scope.$apply();
                    },3000);
                });

                cliper.on('error', e => {
                    /*$(e.trigger).attr('data-original-title', workaroundSupportClipboard(e.action))
                        .tooltip('show');*/
                    $scope.clipboardHints = workaroundSupportClipboard(e.action);
                    setTimeout(() => {
                        /*$(e.trigger).attr('data-original-title', beforeClipboardCopy);
                        $(document).find($(e.trigger).data()["bs.tooltip"].$tip).length && ($(e.trigger).tooltip("show"));*/
                        $scope.clipboardHints = beforeClipboardCopy;
                    },5000);
                });
            });
    }]);
supplierApp.controller('InfoCtrl', ['$rootScope','$scope','$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = 'info';
        $('a[href^="#"]','#partials').click(e => {
            e.preventDefault();
        });

        $scope.infos = [];
        let pageIndex = 1;
        let pageSize = 6;

        $scope.searcher = () => {
            $scope.loading=true;
            $http.post('/agent',{module:'supplier',partial:'info',api:'infos',param:{pageindex: pageIndex, pagesize: pageSize, ssv_user_id: $rootScope.ssv_user_id}}).then(body => {
                let totalPages = (typeof body.data.page_count == 'number')?body.data.page_count:(new Number(body.data.page_count));
                if(totalPages >= pageIndex){
                    if(body.data.data_list && body.data.data_list.length){
                        body.data.data_list.forEach((r, i) => {
                            $scope.infos.push(r);
                        });
                        pageIndex++;
                    } else {
                        $scope.loaded = true;
                    }
                } else {
                    $scope.loaded = true;
                }

                $scope.loading=false;
            }, why => {
                $scope.loading=false;
                $rootScope.alert(why);
            });
        };

        $scope.more = info => {
            //$scope.infoDetail = info;
        }

        $scope.searcher();
    }]);

supplierApp.filter('escapeHtml', () => {

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
supplierApp.filter('unescapeHtml', () => {

    let entityMap = {
        "&amp;":"&",
        "&lt;":"<",
        "&gt;": ">",
        '&quot;':'"',
        '&#39;':"'",
        '&#x2F;':"/"
    };
    return (str, type) => {
        if(!str){
            return;
        }
        let rawStr = String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, s => entityMap[s]);
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
supplierApp.filter('parseYear', () => (str, type) => {
    let year = str;
    try{
        year = new Date(str).getFullYear();
    }catch(e){
        console.log("warning, unable to parse the date string")
    }

    return year
});
supplierApp.filter('parseMonth', () => (str, type) => {
    let month = str;
    try{
        month = new Date(str).getMonth() + 1;
    }catch(e){
        console.log("warning, unable to parse the date string")
    }

    return month
})
supplierApp.filter('parseDate', () => (str, type) => {
    let date = str;
    try{
        date = new Date(str).getDate();
        (date < 10) && (date = `0${date}`);
    }catch(e){
        console.log("warning, unable to parse the date string")
    }

    return date
})
supplierApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);
supplierApp.directive('ropPagination', ['$parse', $parse => ({
    restrict: "A",

    scope:{
        index: "=index",
        size:"=size",
        total: "=total",
        searcher: "=searcher"
    },

    templateUrl: "/_template/pagination",

    link($scope, element, attrs) {
        $scope.myIndex = $scope.index;
        $scope.ceilingIndex = $scope.index + 4;

        $scope.$watch("total", () => {
            if($scope.total){
                $scope.pages = [];
                for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                    $scope.pages.push({index : i + 1})
                }
            }
        });
        $scope.$watch("size", () => {
            if($scope.size){
                $scope.pages = [];
                for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                    $scope.pages.push({index : i + 1})
                }
                $scope.index = 1;
                $scope.ceilingIndex = 5;
                $scope.myIndex = $scope.index;
                $scope.ceilingIndex = $scope.index + 4;
                $scope.searcher($scope.index,$scope.size);
            }
        });
        $scope.toFirst = () => {
            $scope.index = 1;
            $scope.ceilingIndex = 5;
            $scope.searcher($scope.index,$scope.size);
        };
        $scope.toLast = () => {
            $scope.index = $scope.pages.length;
            $scope.ceilingIndex = $scope.pages.length;
            $scope.searcher($scope.index,$scope.size);
        };
        $scope.searchPrevious = () => {
            if(($scope.ceilingIndex == $scope.index + 4) && ($scope.index>1)){
                $scope.ceilingIndex--;
            }
            if ($scope.index > 1) {
                --$scope.index;
                $scope.searcher($scope.index,$scope.size);
            }
        };

        $scope.searchNext = () => {
            if(($scope.ceilingIndex == $scope.index) && ($scope.index<$scope.pages.length)){
                $scope.ceilingIndex++;
            }
            if ($scope.index < $scope.pages.length) {
                ++$scope.index;
                $scope.searcher($scope.index,$scope.size);
            }
        };

        $scope.searchIndex = i => {
            $scope.index = i;
            $scope.searcher($scope.index,$scope.size);
        };

        $scope.toPage = myIndex => {
            $scope.ceilingIndex = Math.min(myIndex+4,$scope.pages.length);
            $scope.searchIndex(myIndex);
        }
    }
})]);

