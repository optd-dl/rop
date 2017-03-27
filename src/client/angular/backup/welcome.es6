/*(function(para) {
    var sdkUrl = para.sdkUrl,
        sdkName = para.name,
        win = this,
        doc = win.document,
        x = null,
        y = null;
    win['RXSTREAM201607'] = sdkName;
    win[sdkName] = win[sdkName] || {};
    if (!win[sdkName].lt) {
        x = doc.createElement('script'), y = doc.getElementsByTagName('script')[0];
        x.async = true;
        x.src = sdkUrl;
        y.parentNode.insertBefore(x, y);
        win[sdkName].lt = 1 * new Date();
        win[sdkName].para = para;
    }
})({
    sdkUrl: '/js/plugin/bas-data.1.0.0.js',
    serverUrl: 'http://monitor.ruixuesoft.com/monitor/services/monitor/send'
    name:'bas',
    topic_u: 'h5plus_user',
    topic_e: 'h5plus_event',
});*/

/* App Module */

let welcomeApp = angular.module('WelcomeApp', [
    'ui.router', 'ngCookies', 'ngMaterial', 'ngMessages', 'alAngularHero'
]);

welcomeApp.config($mdThemingProvider => {
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

welcomeApp.config($mdIconProvider => {
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

welcomeApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    ($stateProvider, $urlRouterProvider, $locationProvider) => {
        $stateProvider.
            state('index', {
                templateUrl: '/_view/welcome/index',
                url: '/welcome/home',
                controller: 'IndexCtrl',
                onExit: [() => {
                    window.swiper && (window.swiper.stopAutoplay())
                    //window.swiper && window.swiper.destroy();
                    //clearInterval(window._wwoInterval);
                    //$(".slider-banner-container .slider-banner").revpause();
                    /*$(".slider-banner-container .slider-banner").revkill();
                     $(".tp-bannertimer").detach();
                     $('.timer').detach();*/
                    angular.element(window).unbind("scroll");
                }]
            }).
            state('suppliers', {
                templateUrl: '/_view/welcome/suppliers',
                url: '/welcome/suppliers',
                controller: 'SuppliersCtrl',
                onExit: [() => {
                    $('#mason').empty();
                    //Waypoint.destroyAll();
                }]
            }).
            state('doc', {
                params: {
                    docId: null,
                },
                url: '/welcome/doc',
                templateUrl: '/_view/welcome/doc',
                controller: 'DocCtrl'
            })
            .state('doc.cat', {
                params: {
                    docChild: "doc.cat",
                },
                //url: '/welcome/doc-cat',
                templateUrl: '/_view/welcome/doc-cat',
                controller: 'DocCatCtrl'
            })
            .state('doc.details', {
                params: {
                    docChild: "doc.details",
                },
                //url: '/welcome/doc-details',
                templateUrl: '/_view/welcome/doc-details',
                controller: 'DocDetailCtrl'
            }).
            state('features', {
                url: '/welcome/features',
                templateUrl: '/_view/welcome/features',
                controller: 'FeaturesCtrl'
            }).
            state('info-detail', {
                url: '/welcome/info-detail',
                templateUrl: '/_view/welcome/info-detail',
                controller: 'InfoDetailCtrl'
            }).
            state('services', {
                url: '/welcome/services',
                templateUrl: '/_view/welcome/services',
                controller: 'ServicesCtrl',
                //url:"/welcome/services",
            }).
            state('search', {
                url: '/welcome/search',
                templateUrl: '/_view/welcome/search',
                controller: 'SearchCtrl'
            }).
            state('debugTool', {
                params: {
                    key: "",
                },
                url: '/welcome/debugTool',
                templateUrl: '/_view/welcome/debugTool',
                controller: 'DebugToolCtrl',
                onExit: [() => {
                    window.removeEventListener("message",window._messageListener);
                    delete window._messageListener;
                }]
            }).
            state('sdkTool', {
                url: '/welcome/sdkTool',
                templateUrl: '/_view/welcome/sdkTool',
                controller: 'SDKToolCtrl'
            }).
            state('API', {
                url: '/welcome/API',
                templateUrl: '/_view/welcome/API',
                controller: 'APICtrl'
            });
        $urlRouterProvider.otherwise('/welcome/home');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        $locationProvider.hashPrefix('!');
    }]);

welcomeApp.controller('WelcomeCtrl', ['$rootScope', '$scope', '$state', '$window', '$http', '$location', '$cookies','$mdDialog',
    ($rootScope, $scope, $state, $window, $http, $location, $cookies, $mdDialog) => {
        document.body.scrollTop = 0;
        $rootScope.removeLoading = () => {
            if(!$('.loading').hasClass("out")){
                $('.loading').addClass("start");
                setTimeout(() => {
                    $('.loading').addClass("out").one($.support.transition.end,function () {$('body').addClass('reveal');$(this).hide();})
                    $rootScope.initSwiper();
                },ROPStyleConstant.loadingTime);
            }
        }

        $rootScope.initIndex = () => {
            if ($location.search().search) {
                $rootScope.go("search");
                $rootScope.tab = 'search';
            } else if (typeof $location.search().debugTool != 'undefined') {
                $rootScope.go("debugTool",{key:$location.search().debugTool});
                $rootScope.tab = 'debugTool';
                //$rootScope.debugTool = $location.search().debugTool;
            } else if (typeof $location.search().sdkTool != 'undefined') {
                $rootScope.go("sdkTool");
                $rootScope.tab = 'sdkTool';
            } else if (typeof $location.search().doc != 'undefined') {
                $rootScope.go("doc", {docId: $location.search().doc});
                $rootScope.tab = 'doc';
            } else {

            }
        }

        $rootScope.go = (tab, param) => {
            if($rootScope.stateLock){
                return;
            }
            angular.element(window).unbind("scroll");
            ((getBrowserType() == 'Firefox')?$('body,html'):$('body')).animate({
                scrollTop: 0
            }, 300, () => {
                $state.go(tab, param);
            });
        }

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
        $rootScope.toApp = () => {
            $rootScope.locate("console");
        }

        $rootScope.toUser = () => {
            $rootScope.locate("user");
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
        $scope.postUrl = (url, params) => {
            let submitMe = document.createElement("form");
            submitMe.action = url;
            submitMe.method = "post";
            for (let key in params) {
                let field = document.createElement("input");
                field.type = "hidden";
                field.name = key;
                field.value = params[key];
                submitMe.appendChild(field);
            }
            submitMe.submit();
        }
        $scope.init = id => {
            let _session = $cookies.get("_session") ? JSON.parse($cookies.get("_session")) : '';
            if (_session && (id == _session.id)) {
                $rootScope.profile = _session;
                $rootScope.getSystemHints();
            } else {
                $cookies.remove("_session");
                $rootScope.profile = undefined;
            }
            $rootScope.removeLoading();
        }

        $rootScope.initSwiper = ()=>{
            let swiperOpt = {
                pagination: '.swiper-pagination',
                /*nextButton: '.swiper-button-next',
                 prevButton: '.swiper-button-prev',*/
                //direction: 'vertical',
                autoplay: 6000,
                speed: 800,
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30,
                //mousewheelControl: true,
                keyboardControl: true,
                effect: 'fade',
                preloadImages: false,
                // Enable lazy loading
                //lazyLoading: true,
                //simulateTouch:true,
                onLazyImageReady(swiper, slide, image) {},
                onProgress(swiper, progress) {}
            };
            document.body.scrollTop = 0;
            setTimeout(() => {
                $(".transitionEndBubbleStop").bind("transitionend", e => {
                    e.stopPropagation();
                })
                window.swiper = $('.swiper-container:visible').length?new Swiper('.swiper-container', swiperOpt):undefined;
            },300);
        }

        $scope.logout = () => {
            $http.post('/agent', {module: 'sso', partial: 'session', api: 'logout'}).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    $cookies.put("_session", null, {path: "/", domain: `.${Constant.host}`});
                    $cookies.remove("_session");
                    $rootScope.profile = undefined;
                }
            }, why => {
                // TODO 弹窗
                $rootScope.alert(why);
            });
        }

        $scope.docMenu = ($mdOpenMenu, ev) => {
            $rootScope.test = true;
            $mdOpenMenu(ev);
        };

        $rootScope._lang = $cookies.get("_lang");

        $rootScope.switchLang = locale => {
            if ($rootScope._lang != locale) {
                $cookies.put("_lang", locale, {domain: `.${Constant.host}`});
                $rootScope.locate("/");
            }
        }
        $rootScope.locator = (e, hash) => {
            e.preventDefault();
            e.stopPropagation();
            ((getBrowserType() == 'Firefox')?$('body,html'):$('body')).animate({
                scrollTop: $(hash).offset().top
            });
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
        $rootScope.isAdmin = () => {return $rootScope.profile && (($rootScope.profile.login_user_type == '0') || ($rootScope.profile.login_user_type == '3'));}
        $rootScope.isSsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '2')};
        $rootScope.isIsv = () => {return $rootScope.profile && ($rootScope.profile.login_user_type == '1')};
    }]);

welcomeApp.controller('IndexCtrl', ['$rootScope', '$scope', '$http', '$q','$window',
    ($rootScope, $scope, $http, $q, $window) => {
        $rootScope.tab = "index";
        // 防止屏幕抖动
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });

        $scope.news = [];

        $scope.showMeTitle = e => {
            let flag = $(e.currentTarget).hasClass("animation");
            $(e.currentTarget).toggleClass("animation");
        }

        $scope.docMenu = $event => {
            $mdOpenMenu($event);
        }
        //$rootScope.initIndex();
        let lastScrollY = 0;
        window.scrollBinder = angular.element(".view-frame").bind("scroll", (e) => {
            //console.log(e)
            let scrollY = $(e.target).scrollTop(),height = $(e.target).height(),scrollHeight = e.target.scrollHeight;

            if(scrollY - lastScrollY > 10){
                if(scrollY < 200){
                    $rootScope._toolbarFeature = 0;
                } else if (scrollY + height > scrollHeight - 200){
                    $rootScope._toolbarFeature = 2;
                } else {
                    $rootScope._toolbarFeature = 1;
                }
            } else if(scrollY - lastScrollY < -10){
                if(scrollY < 200){
                    $rootScope._toolbarFeature = 0;
                } else if (scrollY + height > scrollHeight - 200){
                    $rootScope._toolbarFeature = 2;
                } else {
                    $rootScope._toolbarFeature = 2;
                }
            }
            lastScrollY = scrollY;
            /*if(scrollY < 200){
                $rootScope._toolbarFeature = 0;
            }
            lastScrollY = scrollY;
            if(($('body').css("top") == '0px')||($('body').css("top") == 'auto')){
                if((lastScrollY < scrollY) && (Math.abs(scrollY) > 200)){
                    if(Math.abs(document.body.scrollHeight - $window.screen.availHeight - scrollY) < 100){
                        $rootScope._toolbarFeature = 2;
                    } else {
                        $rootScope._toolbarFeature = 1;
                    }
                } else {
                    if((3*scrollY + 384) > $window.screen.availHeight){
                        $rootScope._toolbarFeature = 2;
                    } else {
                        $rootScope._toolbarFeature = 0;
                    }
                }
                lastScrollY = scrollY;
            }*/
            $scope.$apply();
        });
        let swiperOpt = {
            pagination: '.swiper-pagination',
            /*nextButton: '.swiper-button-next',
             prevButton: '.swiper-button-prev',*/
            //direction: 'vertical',
            autoplay: 6000,
            speed: 800,
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30,
            //mousewheelControl: true,
            keyboardControl: true,
            effect: 'fade',
            preloadImages: false,
            // Enable lazy loading
            //lazyLoading: true,
            //simulateTouch:true,
            onLazyImageReady(swiper, slide, image) {},
            onProgress(swiper, progress) {}
        };

        let getDevelopers = () => $http.post('/agent', {
            module: 'welcome',
            partial: 'index',
            api: 'suppliers',
        }).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                $scope.devs = body.data.data_list;
            } else {
                $rootScope.alert(body.msg)
            }
        }, why => {
            // TODO 弹窗
            $rootScope.alert(why);
        });

        //getSuppliers
        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 0;
                    !window.swiper && (window.swiper = new Swiper('.swiper-container', swiperOpt));
                    $scope.$apply();
                }, 800);
            });
    }]);
welcomeApp.controller('FeaturesCtrl', ['$rootScope', '$scope', '$http', '$state',
    ($rootScope, $scope, $http, $state) => {
        $rootScope.tab = "features";
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });

        $scope.$on('$viewContentLoaded',
                event => {
                $(window).trigger('scroll');

                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                }, 800);
                $rootScope.removeLoading();
            });
    }]);

welcomeApp.controller('APICtrl', ['$rootScope', '$scope', '$http', '$state',
    ($rootScope, $scope, $http, $state) => {
        $rootScope.tab = "API";
        /*$('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });*/

        let catQ = () => $http.post('/agent',{module:'welcome',partial:'API',api:'list'}).then(body => {
            $scope.originalCat = {cat_list:body.data.cat_list,_selectedItem:0};
            if(body.data && body.data.cat_list && body.data.cat_list.length){
                $scope.cat = {cat_list:body.data.cat_list,_selectedItem:0};
                if($scope.cat.cat_list){
                    for(let j = 0; j < $scope.cat.cat_list.length; j++){
                        if($scope.cat.cat_list[j].group_list) {
                            $scope.cat.cat_list[j]._selectedItem = 0;
                            /*if($scope.apiCategoryId == $scope.cat.cat_list[j].cat_id){
                                $scope.cat._selectedItem = j;
                            }*/
                            for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                                //$scope.cat.cat_list[j].group_list[i].dynamicAPIItems = new DynamicItems($scope.cat.cat_list[j].group_list[i].api_list);
                                if($scope.cat.cat_list[j].group_list[i].api_list){
                                    for (let k = 0; k < $scope.cat.cat_list[j].group_list[i].api_list.length; k++) {
                                        /*if(mode && mode.apiMethod && (mode.apiMethod == $scope.cat.cat_list[j].group_list[i].api_list[k].api_id)){
                                            $scope.cat.cat_list[j]._selectedItem = i;
                                        }*/
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
        $scope.changeAPISearch = () => {
            //$scope.cat = JSON.parse(JSON.stringify($scope.originalCat));
            var cat = JSON.parse(JSON.stringify($scope.originalCat));
            cat._selectedItem = $scope.cat._selectedItem;
            if(cat.cat_list){
                for(let j = 0; j < cat.cat_list.length; j++){
                    cat.cat_list[j]._selectedItem = $scope.cat.cat_list[j]._selectedItem;
                    if(cat.cat_list[j].group_list) {
                        for (let i = 0; i < cat.cat_list[j].group_list.length; i++) {
                            if(cat.cat_list[j].group_list[i].api_list){
                                var k = cat.cat_list[j].group_list[i].api_list.length ;
                                while (k--) {
                                    ((cat.cat_list[j].group_list[i].api_list[k].api_name.indexOf($scope.apiSearch) == -1) && (cat.cat_list[j].group_list[i].api_list[k].api_title.indexOf($scope.apiSearch) == -1))&&(cat.cat_list[j].group_list[i].api_list.splice(k,1));
                                }
                            }
                        }
                    }
                }
            }
            $scope.cat = cat;

        }
        catQ();
        $scope.apiMethod = (api) => {
            return `${Constant.protocol}://${Constant.host}/api/ApiMethod-${api.api_id}.html`;
        }
        $scope.$on('$viewContentLoaded',
                event => {
                $(window).trigger('scroll');

                /*setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                }, 800);*/
                    $rootScope._toolbarFeature = 2;
                $rootScope.removeLoading();
            });
    }]);

welcomeApp.controller('DebugToolCtrl', ['$rootScope', '$scope', '$http', '$stateParams','$location',
    ($rootScope, $scope, $http, $stateParams,$location) => {
        $rootScope.tab = "debugTool";
        let key = $stateParams.key?$stateParams.key:$location.search().key;
        $("#mainFrame").attr("src", `/frame/ApiTool/index${key?("?sign=" + key) : ""}`);
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });

        $scope.$on('$viewContentLoaded',
                event => {
                window._messageListener = event => {
                    if(event.origin == Constant.legacyDomain){
                        console.log(event.data)
                        $("iframe").height(event.data + 20);
                    }
                }
                window.addEventListener("message", window._messageListener);

                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                },800);
                $rootScope.removeLoading();
            });
    }]);

welcomeApp.controller('SDKToolCtrl', ['$rootScope', '$scope', '$http', '$stateParams',
    ($rootScope, $scope, $http, $stateParams) => {
        $rootScope.tab = "sdkTool";
        $scope.sdks = [
            {logo:"/resource/logo-dotnet.png",bg:'#33B5E5'},
            {logo:"/resource/logo-java.png",bg:'#AA66CC'},
            {logo:"/resource/logo-php.png",bg:'#00CC99'},
            {logo:"/resource/logo-js.png",bg:'#FFBB33'},
            {logo:"/resource/logo-android.png",bg:'#FF4444'}];
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });

        let sdkQ = $http.post('/agent', {
            module: 'welcome',
            partial: 'sdkTool',
            api: 'list',
            param: {sdk_type: 1}
        }).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                $scope.sdkcontent = [];
                for(let prop in body.data.sdk){
                    $scope.sdkcontent.push($.extend({_title:prop},body.data.sdk[prop]));
                }
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            // TODO 弹窗
            $rootScope.alert(why);
        });

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                },800);
                $rootScope.removeLoading();
            });
    }]);
welcomeApp.controller('ServicesCtrl', ['$rootScope', '$scope','$http','$mdDialog','$mdSidenav','$window',
    ($rootScope, $scope, $http, $mdDialog, $mdSidenav, $window) => {
        $rootScope.tab = "services";
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });

        let q1 = $http.post('/agent', {
            module: 'welcome',
            partial: 'services',
            api: 'notice',
            param: {}
        }).then(body => {
            if (body.data.data_list && body.data.data_list.length) {
                $scope.notice_list = body.data.data_list;
            }
        }, why => {
            //$scope.details = why.data
            // TODO 弹窗
            $rootScope.alert(why);
        });

        let q2 = $http.post('/agent', {
            module: 'welcome',
            partial: 'services',
            api: 'faq',
            param: {}
        }).then(body => {
            if (body.data.data_list && body.data.data_list.length) {
                $scope.faqs = body.data.data_list;
            }
        }, why => {
            //$scope.details = why.data
            // TODO 弹窗
            $rootScope.alert(why);
        });

        $scope.toggleSidenav = () => $mdSidenav('right').toggle();
        $scope.askQuestion = e => {
            if($scope.qaForm.$invalid){
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('提示')
                        .textContent("请核对提交表单是否正确")
                        .ariaLabel('提交失败')
                        .ok('好的')
                        .targetEvent(e)
                );
                $scope.qaForm.$error.required && $scope.qaForm.$error.required.forEach(r => {
                    r.$setDirty(true);
                });
                return;
            }
            e.preventDefault();
            return $http.post('/agent', {
                module: 'welcome',
                partial: 'services',
                api: 'askQuestion',
                param: $scope.question
            }).then(body => {
                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                    //$scope.notice_list = body.data.data_list;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .title('提交成功')
                            .textContent('我们收到了您的问题，会尽快回答，请次日登录帮助中心查看我们的回复.')
                            .ariaLabel('提交成功')
                            .ok('好的')
                            .targetEvent(e)
                    );
                    $mdSidenav('right').close();
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .title('提交失败')
                            .textContent(body.data.msg)
                            .ariaLabel('提交失败')
                            .ok('好的')
                            .targetEvent(e)
                    );
                }
            }, why => {
                //$scope.details = why.data
                // TODO 弹窗
                $rootScope.alert(why);
            });
        }

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                }, 800);
                $rootScope.removeLoading();
            });

    }]);
welcomeApp.controller('SuppliersCtrl', ['$rootScope', '$scope', '$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = "suppliers";
        $scope.items = [], $scope.ssvs = [], $scope.pageindex = 1;
        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });
        $scope.load = () => {
            if (!$scope.lock) {
                $scope.lock = true;
                $http.post('/agent', {
                    module: 'welcome',
                    partial: 'suppliers',
                    api: 'suppliers',
                    /*param: {pageindex: $scope.pageindex++}*/
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        let elementSelector = [];
                        $scope.items = body.data.data_list;
                    } else {
                        $rootScope.alert(body.msg)
                    }
                    $scope.lock = false;
                }, why => {
                    // TODO 弹窗
                    $rootScope.alert(why);
                    $scope.lock = false;
                });
            }
        }
        $scope.toSsv = ssv => {
            $scope.locate(`${Constant.protocol}://${ssv.user_domain}.${Constant.host}:${Constant.port}`);
        }

        $scope.isOdd = index => {
            let isOdd = index%2;
            return isOdd;
        }
        $scope.load();
        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                }, 800);
                $rootScope.removeLoading();
            });
    }]);

welcomeApp.controller('DocCtrl', ['$rootScope', '$scope', '$http', '$stateParams','$location',
    ($rootScope, $scope, $http, $stateParams, $location) => {
        let docId = $stateParams.docId?$stateParams.docId:$location.search().doc, isFromIndex = ($rootScope.tab == 'index');
        $rootScope.tab = "doc";
        let catQ = $http.post('/agent', {module: 'welcome', partial: 'doc', api: 'doc_cat'}).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                $scope.rootTree = body.data;
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            // TODO 弹窗
            $rootScope.alert(why);
        });
        let visitCounter = param => $http.post('/agent', {
            module: 'welcome',
            partial: 'doc-details',
            api: 'view_count',
            param
        });
        let detailQ = doc_id => $http.post('/agent', {
            module: 'welcome',
            partial: 'doc',
            api: 'doc_detail',
            param: {doc_id}
        }).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                $scope.docId = doc_id;
                $scope.docDetail = body.data;
                let flag = true;
                $scope.rootTree.cat_list_level_1.every((trunk, i) => {
                    if (flag) {
                        trunk.cat_list_level_2 && trunk.cat_list_level_2.length && trunk.cat_list_level_2.every((branch, i) => {
                            delete branch._isOpen;
                            if (branch.cat_list_level_3 && branch.cat_list_level_3.length) {
                                branch.cat_list_level_3.every((leaf, i) => {
                                    if (leaf.doc_id == doc_id) {
                                        branch._isOpen = true;
                                        flag = false;
                                    }
                                    return true;
                                });
                            } else {
                                if (branch.doc_id == doc_id) {
                                    branch._isOpen = true;
                                    flag = false;
                                }
                            }

                            return true;
                        });
                        return true;
                    }
                    return false;
                });

                visitCounter({doc_id,set_type:0});

                var type = 'anonymous';
                try{
                    type = JSON.parse(getCookie("_session")).login_user_type
                } catch(e){

                }
                bassdk.quick('setDefaultAttr');
                bassdk.track('visit', {
                    pageName:$scope.docDetail.doc_name+'文档',
                    userType:type,
                    pageType:"文档统计"
                });
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            // TODO 弹窗
            $rootScope.alert(why);
        });

        $scope.deleteme = () => false
        $scope.checkoutDoc = (trunk, branch, ev) => {
            ev.stopPropagation();
            let trueBranch = branch;
            if (!trueBranch) {
                trueBranch = trunk.cat_list_level_2[0];
            }

            if (trueBranch.doc_id) {
                $scope.docId = trueBranch.doc_id;
                let detailThen = detailQ(trueBranch.doc_id);
                if (!$scope.currentTrunk) {
                    detailThen.then(() => {
                        $rootScope.go("doc.details")
                    });
                    $scope.currentTrunk = trunk;
                }

            } else {
                $scope.catId = trueBranch.cat_id;
                detailQ(trueBranch.cat_list_level_3[0].doc_id).then(() => {
                    $rootScope.go("doc.details")
                    //$state.go('doc.details');
                });
                $scope.currentTrunk = trunk;
            }
        }

        $scope.isOpen = branch => branch.cat_list_level_3 && ([].concat.apply([], branch.cat_list_level_3.map((r, i) => r.cat_id ? [r.cat.id] : [])).indexOf(docId) != -1)

        $scope.toggleOpen = branch => {
            branch._isOpen ? (branch._isOpen = false) : (branch._isOpen = true);
        }

        $scope.getDoc = doc_id => {
            detailQ(doc_id);
        }

        $scope.resetDoc = () => {
            $scope.catId = "";
            $scope.docId = "";
            $scope.docDetail = null;
            $scope.currentTrunk = null;
            $scope.isPreview = false;
            if($scope.childTab == 'detail'){
                /*setTimeout(() => {
                    $rootScope.go("doc.cat")
                }, 500)*/
                $rootScope.go("doc.cat")
            }
        }

        if (docId) {
            $scope.isPreview = true;
            setTimeout(() => {
                catQ.then(() => {
                    //$scope.docId = docId;
                    let detailThen = detailQ(docId);
                    $scope.rootTree.cat_list_level_1.every((trunk, i) => {
                        if (!$scope.currentTrunk) {
                            trunk.cat_list_level_2 && trunk.cat_list_level_2.length && trunk.cat_list_level_2.every((branch, i) => {
                                if (branch.doc_id) {
                                    if (branch.doc_id == docId) {
                                        $scope.currentTrunk = trunk;
                                        return false;
                                    }
                                } else {
                                    branch.cat_list_level_3 && branch.cat_list_level_3.length && branch.cat_list_level_3.every((leaf, i) => {
                                        if (leaf.doc_id == docId) {
                                            $scope.currentTrunk = trunk;
                                            return false;
                                        }
                                        return true;
                                    });
                                }
                                return true;
                            });
                            return true;
                        }
                        return false;
                    });
                    console.log($scope.currentTrunk);
                    detailThen.then(() => {
                        $rootScope.go("doc.details")
                        //$rootScope.go("doc.details")
                    });
                });
            })
        } else {
            catQ.then(() => {
                if(isFromIndex) {
                    /*setTimeout(() => {
                        $rootScope.go("doc.cat");
                    }, 500);*/
                    $rootScope.go("doc.cat");
                } else {
                    $rootScope.go("doc.cat");
                }
            });

        }

        $scope.virtualRepeat = {scrollIndex: 0};
        $scope.locateScrollIndex = i => {
            $scope.virtualRepeat.scrollIndex = i;
        }
        $scope.docPrefix = `${Constant.protocol}://${Constant.host}/api/doc_detail.html?id=`;

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                },600);
                $rootScope.removeLoading();
            });

    }]);
welcomeApp.controller('DocCatCtrl', ['$rootScope', '$scope',
    ($rootScope, $scope) => {

        $scope.$parent.resetDoc();
        $scope.$parent.childTab = 'cat';
        $scope.$on('$viewContentLoaded',
                event => {
                $rootScope.removeLoading();
            });

    }]);


welcomeApp.controller('DocDetailCtrl', ['$rootScope', '$scope',
    ($rootScope, $scope) => {
        $scope.$parent.childTab = 'detail';
        let _lang = $rootScope._lang;
        let beforeClipboardCopy = (_lang == "zh-cn") ? "复制到剪切板" : "Copy to Clipboard",
            afterClipboardCopy = (_lang == "zh-cn") ? "已复制" : "Copied",
            workaroundSupportClipboard = action => {
                let actionMsg = ` 来${action === 'cut' ? '剪切' : '拷贝'}`;
                let actionKey = (action === 'cut' ? 'X' : 'C');

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
        $scope.clipboardHints = beforeClipboardCopy;
        $scope.locator = (e, hash) => {
            e.preventDefault();
            e.stopPropagation();
            let currentScrollTop = $('.view-frame.doc')[0].scrollTop;
            $('.view-frame.doc').animate({
                scrollTop: currentScrollTop + $(hash).offset().top - 64
            });
            /*((getBrowserType() == 'Firefox')?$('.view-frame.doc'):$('.view-frame.doc')).animate({
                scrollTop: $(hash).offset().top - 64
            });*/
        }
        $scope.$on('$viewContentLoaded',
                event => {
                let cliper = new Clipboard('.cliper');
                cliper.on('success', e => {
                    e.clearSelection();
                    $scope.clipboardHints = afterClipboardCopy;
                    $scope.tooltipFlag = true;
                    $scope.$apply();
                    setTimeout(() => {
                        $scope.tooltipFlag = false;
                        $scope.clipboardHints = beforeClipboardCopy;
                        $scope.$apply();
                    }, 5000);
                });

                cliper.on('error', e => {
                    $scope.clipboardHints = workaroundSupportClipboard(e.action);
                    $scope.$apply();
                    setTimeout(() => {
                        $scope.clipboardHints = beforeClipboardCopy;
                        $scope.$apply();
                    }, 5000);
                });

                $('.view-frame.doc').scrollspy({target: '#menu', offset: 15});
                $rootScope.removeLoading();
            });

    }]);

welcomeApp.controller('SearchCtrl', ['$rootScope', '$scope', '$http',
    ($rootScope, $scope, $http) => {
        $rootScope.tab = "search";
        $scope.searchCategory = "all";
        $scope.hints = [];
        $scope.pageIndex = 1;
        $scope.pageSize = new Number(10);
        let initial = true;
        $scope.searcher = (index, size) => {
            if(initial){
                initial = false;
                return;
            }
            $http.post('/agent', {
                module: 'welcome',
                partial: 'search',
                api: 'search',
                param: {
                    pageindex: index ? index : $scope.pageIndex,
                    pagesize: size ? size : $scope.pageSize,
                    searchflg: $scope.searchCategory,
                    keyword: $('#bloodhound').val()
                }
            }).then(body => {
                $scope.response = body.data.response;
                if (body.data.response && body.data.response.docs && body.data.response.docs.length) {
                    if ($scope.searchCategory == "all") {
                        $scope.total = body.data.response.numFound;
                    } else if ($scope.searchCategory == "api") {
                        $scope.total = body.data.response.numFoundApi;
                    } else if ($scope.searchCategory == "doc") {
                        $scope.total = body.data.response.numFoundDoc;
                    } else if ($scope.searchCategory == "sdk") {
                        $scope.total = body.data.response.numFoundSdk;
                    } else if ($scope.searchCategory == "tool") {
                        $scope.total = body.data.response.numFoundTool;
                    } else if ($scope.searchCategory == "other") {
                        $scope.total = body.data.response.numFoundOther;
                    } else {
                        $scope.total = 0;
                    }
                } else {
                    $scope.total = 0;
                }
                setTimeout(() => {
                    $(window).trigger('scroll');
                }, 100);
            }, why => {
                // TODO 弹窗
                $rootScope.alert(why);
                $scope.total = 0;
            });
        }

        $http.post('/agent', {module: 'welcome', partial: 'search', api: 'hints'}).then(body => {
            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                $scope.rawHints = body.data.hint_list

                let keyword = new Bloodhound({
                    datumTokenizer(str) {
                        return str ? str.split("") : [];
                    },
                    queryTokenizer(str) {
                        return str ? str.split("") : [];
                    },
                    sorter : function(itemA, itemB) {
                        if (itemA.indexOf($scope.keyword) > itemB.indexOf($scope.keyword)) {
                            return -1;
                        } else if (itemA.indexOf($scope.keyword) < itemB.indexOf($scope.keyword)) {
                            return 1;
                        } else{
                            return 0;
                        }
                    },
                    // `states` is an array of state names defined in "The Basics"
                    local: $scope.rawHints.map(r => r.title)
                });

                $('.typeahead').typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        name: 'keyword',
                        source: keyword,
                        limit: 10
                    }).on('typeahead:selected', (event, selection) => {
                        $scope.research($scope.searchCategory);
                        $scope.$apply();
                    });
            } else {
                $rootScope.alert(body.data.msg);
            }
        }, why => {
            // TODO 弹窗
            $rootScope.alert(why);
        });

        $scope.research = (cat, key) => {
            //(typeof key != 'undefined') && ($scope.keyword = key);
            $scope.hints = [];
            $scope.searchCategory = cat;
            $scope.pageIndex = 1;
            $scope.pageSize = new Number(10);
        }

        $scope.$on('$viewContentLoaded',
                event => {
                setTimeout(() => {
                    $rootScope._toolbarFeature = 2;
                    $scope.$apply();
                }, 800);
                $rootScope.removeLoading();
            });
    }]);

welcomeApp.filter('ellipsis', ['$filter', $filter => function () {
    let result = $filter('limitTo').apply(this, arguments);
    return `${result}......`;
}]);

welcomeApp.filter('escapeHtml', () => {

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

welcomeApp.filter('unescapeHtml', () => {

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

welcomeApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);

