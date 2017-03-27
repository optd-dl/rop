/**
 * Created by robin on 22/11/2016.
 */
define(['require', 'angular','swiper'], function (require, angular) {
    'use strict';

    let controllerModule = angular.module('welcome.controllers', []);
    controllerModule
        .controller('IndexCtrl', ['$rootScope', '$scope', '$http', '$q', '$window',
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

                //$rootScope.initIndex();
                let lastScrollY = 0;
                window.scrollBinder = $(".view-frame").bind("scroll", (e) => {
                    //console.log(e)
                    let scrollY = $(e.target).scrollTop(), height = $(e.target).height(), scrollHeight = e.target.scrollHeight;

                    if (scrollY - lastScrollY > 10) {
                        if (scrollY < 200) {
                            $rootScope._toolbarFeature = 0;
                        } else if (scrollY + height > scrollHeight - 200) {
                            $rootScope._toolbarFeature = 2;
                        } else {
                            $rootScope._toolbarFeature = 1;
                        }
                    } else if (scrollY - lastScrollY < -10) {
                        if (scrollY < 200) {
                            $rootScope._toolbarFeature = 0;
                        } else if (scrollY + height > scrollHeight - 200) {
                            $rootScope._toolbarFeature = 2;
                        } else {
                            $rootScope._toolbarFeature = 2;
                        }
                    }
                    lastScrollY = scrollY;
                    $scope.$apply();
                });

                let getDevelopers = () => $http.post('/agent', {
                    module: 'welcome',
                    partial: 'index',
                    api: 'suppliers',
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.devs = body.data.data_list;
                    } else {
                        $rootScope.alert(body.data.msg)
                    }
                }, why => {
                    // TODO 弹窗
                    $rootScope.alert(why);
                });

                let swiperOpt = {
                    pagination: '.swiper-pagination',
                    autoplay: 6000,
                    speed: 800,
                    slidesPerView: 1,
                    paginationClickable: true,
                    spaceBetween: 30,
                    keyboardControl: true,
                    effect: 'fade',
                    preloadImages: false,
                    onLazyImageReady(swiper, slide, image) {},
                    onProgress(swiper, progress) {}
                };
                document.body.scrollTop = 0;

                /*setTimeout(() => {
                    $rootScope.removeLoading();
                });*/
                $(".transitionEndBubbleStop").off("transitionend")
                $(".transitionEndBubbleStop").bind("transitionend", e => {
                    e.stopPropagation();
                })
                window.swiper = $('.swiper-container:visible').length?new Swiper('.swiper-container', swiperOpt):undefined;
                !window.swiper && (window.swiper = new Swiper('.swiper-container', swiperOpt));

                $rootScope._toolbarFeature = 0;
                $scope.$on('$viewContentLoaded',
                    event => {
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 0;
                        $rootScope.removeLoading();
                    });
            }])
        .controller('FeaturesCtrl', ['$rootScope', '$scope', '$http', '$state',
            ($rootScope, $scope, $http, $state) => {
                $rootScope.tab = "features";
                $('a[href^="#"]', '#partials').click(e => {
                    e.preventDefault();
                });

                $scope.$on('$viewContentLoaded',
                    event => {
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });
            }])
        .controller('APICtrl', ['$rootScope', '$scope', '$http', '$state',
            ($rootScope, $scope, $http, $state) => {
                $rootScope.tab = "API";
                /*$('a[href^="#"]', '#partials').click(e => {
                 e.preventDefault();
                 });*/

                let catQ = () => $http.post('/agent', {module: 'welcome', partial: 'API', api: 'list'}).then(body => {
                    $scope.originalCat = {cat_list: body.data.cat_list, _selectedItem: 0};
                    if (body.data && body.data.cat_list && body.data.cat_list.length) {
                        $scope.cat = {cat_list: body.data.cat_list, _selectedItem: 0};
                        if ($scope.cat.cat_list) {
                            for (let j = 0; j < $scope.cat.cat_list.length; j++) {
                                if ($scope.cat.cat_list[j].group_list) {
                                    $scope.cat.cat_list[j]._selectedItem = 0;
                                    /*if($scope.apiCategoryId == $scope.cat.cat_list[j].cat_id){
                                     $scope.cat._selectedItem = j;
                                     }*/
                                    for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                                        //$scope.cat.cat_list[j].group_list[i].dynamicAPIItems = new DynamicItems($scope.cat.cat_list[j].group_list[i].api_list);
                                        if ($scope.cat.cat_list[j].group_list[i].api_list) {
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
                        $scope.cat = {cat_list: body.data.cat_list, _selectedItem: 0};
                        $rootScope.alert("当前供应商没有任何API发布");
                    }
                }, why => {
                    $rootScope.alert(why);
                });
                $scope.changeAPISearch = () => {
                    //$scope.cat = JSON.parse(JSON.stringify($scope.originalCat));
                    var cat = JSON.parse(JSON.stringify($scope.originalCat));
                    cat._selectedItem = $scope.cat._selectedItem;
                    if (cat.cat_list) {
                        for (let j = 0; j < cat.cat_list.length; j++) {
                            cat.cat_list[j]._selectedItem = $scope.cat.cat_list[j]._selectedItem;
                            if (cat.cat_list[j].group_list) {
                                for (let i = 0; i < cat.cat_list[j].group_list.length; i++) {
                                    if (cat.cat_list[j].group_list[i].api_list) {
                                        var k = cat.cat_list[j].group_list[i].api_list.length;
                                        while (k--) {
                                            ((cat.cat_list[j].group_list[i].api_list[k].api_name.indexOf($scope.apiSearch) == -1) && (cat.cat_list[j].group_list[i].api_list[k].api_title.indexOf($scope.apiSearch) == -1)) && (cat.cat_list[j].group_list[i].api_list.splice(k, 1));
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
                    $rootScope._toolbarFeature = 2;
                    $rootScope.removeLoading();
                });
            }])
        .controller('DebugToolCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$location',
            ($rootScope, $scope, $http, $stateParams, $location) => {
                $rootScope.tab = "debugTool";
                let key = $stateParams.key ? $stateParams.key : $location.search().key;
                $("#mainFrame").attr("src", `/frame/ApiTool/index${key ? ("?sign=" + key) : ""}`);
                $('a[href^="#"]', '#partials').click(e => {
                    e.preventDefault();
                });

                $scope.$on('$viewContentLoaded',
                        event => {
                        window._messageListener = event => {
                            if (event.origin == Constant.legacyDomain) {
                                console.log(event.data)
                                $("iframe").height(event.data + 20);
                            }
                        }
                        window.addEventListener("message", window._messageListener);

                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });
            }])
        .controller('SDKToolCtrl', ['$rootScope', '$scope', '$http', '$stateParams',
            ($rootScope, $scope, $http, $stateParams) => {
                $rootScope.tab = "sdkTool";
                $scope.sdks = [
                    {logo: "/resource/logo-dotnet.png", bg: '#33B5E5'},
                    {logo: "/resource/logo-java.png", bg: '#AA66CC'},
                    {logo: "/resource/logo-php.png", bg: '#00CC99'},
                    {logo: "/resource/logo-js.png", bg: '#FFBB33'},
                    {logo: "/resource/logo-android.png", bg: '#FF4444'}];
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
                        for (let prop in body.data.sdk) {
                            $scope.sdkcontent.push($.extend({_title: prop}, body.data.sdk[prop]));
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
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });
            }])
        .controller('ServicesCtrl', ['$rootScope', '$scope', '$http', '$mdDialog', '$mdSidenav', '$window',
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
                    if ($scope.qaForm.$invalid) {
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
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });

            }])
        .controller('SuppliersCtrl', ['$rootScope', '$scope', '$http',
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
                                $rootScope.alert(body.data.msg)
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
                    let isOdd = index % 2;
                    return isOdd;
                }
                $scope.load();
                $scope.$on('$viewContentLoaded',
                    event => {
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });
            }])
        .controller('DocCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$location',
            ($rootScope, $scope, $http, $stateParams, $location) => {
                let docId = $stateParams.docId ? $stateParams.docId : $location.search().doc, isFromIndex = ($rootScope.tab == 'index');
                $rootScope.tab = "doc";

                let visitCounter = param => {return $rootScope.ajax("view_count",param);},
                    catQ = () =>{ return $rootScope.ajax("doc_cat",{}).then(body=>{$scope.rootTree = body;});},
                    detailQ = doc_id => {
                        return $rootScope.ajax("doc_detail",{doc_id}).then(data=>{
                            $scope.docId = doc_id;
                            $scope.docDetail = data;
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

                            visitCounter({doc_id, set_type: 0});
                            return true;
                        });
                    };

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
                                $rootScope.go("doc.details",{id:trueBranch.doc_id})
                            });
                        }

                    } else {
                        $scope.catId = trueBranch.cat_id;
                        detailQ(trueBranch.cat_list_level_3[0].doc_id).then(() => {
                            $rootScope.go("doc.details",{id:trueBranch.cat_list_level_3[0].doc_id})
                        });
                    }
                    //$scope.currentTrunk = trunk;
                    $scope.isPreview = false;
                    /*$scope.heroId = ('hero_'+($scope.currentTrunk.doc_id?$scope.currentTrunk.doc_id:$scope.currentTrunk.cat_id));
                    $scope.currentIndex = $scope.rootTree.cat_list_level_1.indexOf($scope.currentTrunk);*/
                }
                $scope.isOpen = branch => branch.cat_list_level_3 && ([].concat.apply([], branch.cat_list_level_3.map((r, i) => r.cat_id ? [r.cat.id] : [])).indexOf(docId) != -1);
                $scope.toggleOpen = branch => {branch._isOpen ? (branch._isOpen = false) : (branch._isOpen = true);};
                $scope.detailQ = detailQ;
                $scope.catQ = catQ;
                $scope.resetDoc = () => {
                    $scope.catId = "";
                    $scope.docId = "";
                    $scope.docDetail = null;
                    $scope.currentTrunk = null;
                    $scope.isPreview = undefined;
                    $rootScope.go("doc.cat");
                }
                !$scope.rootTree && $scope.catQ();
                /*let docId = $stateParams.docId ? $stateParams.docId : $location.search().doc, isFromIndex = ($rootScope.tab == 'index');
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

                        visitCounter({doc_id, set_type: 0});

                        var type = 'anonymous';
                        try {
                            type = JSON.parse(getCookie("_session")).login_user_type
                        } catch (e) {

                        }
                        bassdk.quick('setDefaultAttr');
                        bassdk.track('visit', {
                            pageName: $scope.docDetail.doc_name + '文档',
                            userType: type,
                            pageType: "文档统计"
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
                                $rootScope.go("doc.details",{id:trueBranch.doc_id})
                            });
                            $scope.currentTrunk = trunk;
                        }

                    } else {
                        $scope.catId = trueBranch.cat_id;
                        detailQ(trueBranch.cat_list_level_3[0].doc_id).then(() => {
                            //$rootScope.go("doc.details")
                            $rootScope.go("doc.details",{id:trueBranch.cat_list_level_3[0].doc_id})
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
                    if ($scope.childTab == 'detail') {
                        /!*setTimeout(() => {
                         $rootScope.go("doc.cat")
                         }, 500)*!/
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
                                $rootScope.go("doc.details",{id:docId})
                                //$rootScope.go("doc.details")
                            });
                        });
                    })
                } else {
                    catQ.then(() => {
                        if (isFromIndex) {
                            /!*setTimeout(() => {
                             $rootScope.go("doc.cat");
                             }, 500);*!/
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
                        }, 600);
                        $rootScope.removeLoading();
                    });*/

            }])
        .controller('DocCatCtrl', ['$rootScope', '$scope', '$timeout',
            ($rootScope, $scope, $timeout) => {
                $scope.resetDoc();
                //$scope.catQ();
                window.test = $scope;
                $scope.$on('$viewContentLoaded',event => {
                    $timeout(() => {$rootScope._toolbarFeature = 2;}, 600);
                    $rootScope.removeLoading();
                });

            }])
        .controller('DocDetailCtrl', ['$rootScope', '$scope', '$stateParams','$timeout','$location','$q',($rootScope, $scope,$stateParams,$timeout,$location,$q) =>{
            let docId = $stateParams.id, isPreview = $location.search().preview, processor = () => {
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

                if($scope.currentTrunk){
                    $scope.heroId = ('hero_'+($scope.currentTrunk.doc_id?$scope.currentTrunk.doc_id:$scope.currentTrunk.cat_id));
                    $scope.currentIndex = $scope.rootTree.cat_list_level_1.indexOf($scope.currentTrunk);
                }
                return true;
            }, mainDefer = $q.defer();
            //console.log($location.search());
            if($scope.rootTree){
                var flag = processor();
                flag && mainDefer.resolve();
            } else if(docId && ($scope.isPreview === undefined)){
                isPreview && ($scope.isPreview = true);
                $scope.catQ().then(()=>{return $scope.detailQ(docId)}).then(processor).then(flag=>{flag && mainDefer.resolve();});
            }

            //heroId = ('hero_'+($parent.currentTrunk.doc_id?$parent.currentTrunk.doc_id:$parent.currentTrunk.cat_id)); currentIndex = $parent.rootTree.cat_list_level_1.indexOf($parent.currentTrunk)
            $scope.docPrefix = `${Constant.protocol}://${Constant.host}/api/doc_detail.html?id=`;
            $scope.getDoc = doc_id => {return $scope.detailQ(doc_id);};
            require(['clipboard'], (Clipboard) =>{
                let _lang = $rootScope._lang,beforeClipboardCopy = (_lang == "zh-cn") ? "复制文档地址" : "Copy document URL",
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
                    let currentScrollTop = $('.view-frame.doc .sub-frame')[0].scrollTop;
                    $('.view-frame.doc .sub-frame').animate({
                        scrollTop: currentScrollTop + $(hash).offset().top - 64
                    });
                    /*((getBrowserType() == 'Firefox')?$('.view-frame.doc'):$('.view-frame.doc')).animate({
                     scrollTop: $(hash).offset().top - 64
                     });*/
                }

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
            });
            window.test = $scope;
            $scope.$on('$viewContentLoaded',
                event => {
                    $(window).trigger('scroll');
                    $rootScope._toolbarFeature = 2;
                    $rootScope.removeLoading();
                    mainDefer.promise.then(()=>{$('.view-frame.doc .sub-frame').scrollspy({target: '#menu', offset: 15});})
                });
        }])
        .controller('SearchCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {
                $rootScope.tab = "search";
                $scope.searchCategory = "all";
                $scope.hints = [];
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                let initial = true;
                $scope.searcher = (index, size) => {
                    if (initial) {
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

                        require(['bloodhound',"typeahead"], () =>{
                            let keyword = new Bloodhound({
                                datumTokenizer(str) {
                                    return str ? str.split("") : [];
                                },
                                queryTokenizer(str) {
                                    return str ? str.split("") : [];
                                },
                                sorter: function (itemA, itemB) {
                                    if (itemA.indexOf($scope.keyword) > itemB.indexOf($scope.keyword)) {
                                        return -1;
                                    } else if (itemA.indexOf($scope.keyword) < itemB.indexOf($scope.keyword)) {
                                        return 1;
                                    } else {
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
                        $(window).trigger('scroll');
                        $rootScope._toolbarFeature = 2;
                        $rootScope.removeLoading();
                    });
            }]);
});
