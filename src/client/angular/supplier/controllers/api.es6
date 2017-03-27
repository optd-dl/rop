/**
 * Created by robin on 22/11/2016.
 */
define(['clipboard', 'treeview', 'packagetree', 'string2json', '../../services'], function (Clipboard) {
    'use strict';
    return ['$rootScope', '$scope', '$http', '$filter', '$q', '$cookies', '$stateParams', '$mdSidenav', '$mdDialog', '$timeout',
        ($rootScope,
         $scope,
         $http,
         $filter,
         $q,
         $cookies,
         $stateParams,
         $mdSidenav,
         $mdDialog,
         $timeout) => {
            let mode = $rootScope._param, modeCatId = $rootScope._cat_id;
            $rootScope.tab = 'API';
            $('a[href^="#"]', '#partials').click(e => {
                e.preventDefault();
            });
            let _lang = $cookies.get("_lang");
            let beforeClipboardCopy = (_lang == "zh-cn") ? "复制文档地址" : "Copy document URL",
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
            $scope.nav = {
                entry: 'api',
                subEntry: '',
                subDomains: []
            }, $scope.breadcrumbs = [], $scope.selectedEntry = 0, $scope.defaultDetails = {api_name: "API名字"}, $scope.apiDetails = $scope.defaultDetails, $scope.domainDetails = $scope.defaultDetails, $scope.cat = {
                cat_list: [],
                _selectedItem: 0
            },
                $scope.clipboardHints = beforeClipboardCopy, $scope.makeDebugUrl = api => `${Constant.protocol}://${Constant.host}/ApiTool/index?sign=${api}`
            $scope.makeSDKUrl = api => `${Constant.protocol}://${Constant.host}/welcome/sdkTool`, $scope.simpleAPILevelDescription = () => {
                //$("#simpleAPILevelDescription").modal();
            };
            class DynamicItems {
                constructor(list) {
                    this.list = list;
                    this.PAGE_SIZE = 10;
                    this.loadedPages = {};
                    for (let i = 0; i < Math.ceil(this.list.length / this.PAGE_SIZE); i++) {
                        this.loadedPages[i] = [];
                        this.loadedPages[i] = this.list.slice(i * this.PAGE_SIZE, (i + 1) * this.PAGE_SIZE);
                    }
                }

                getItemAtIndex(index) {
                    let pageNumber = Math.floor(index / this.PAGE_SIZE);
                    let page = this.loadedPages[pageNumber];
                    if (page) {
                        return page[index % this.PAGE_SIZE];
                    } else {
                        return [];
                    }

                }

                getLength() {
                    return this.list.length;
                }
            }

            let catQ = () => $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'get_ssv_cat',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                $scope.originalCat = {cat_list: body.data.cat_list, _selectedItem: 0};
                if (body.data && body.data.cat_list && body.data.cat_list.length) {
                    $scope.cat = {cat_list: body.data.cat_list, _selectedItem: 0};
                    if ($scope.cat.cat_list) {
                        for (let j = 0; j < $scope.cat.cat_list.length; j++) {
                            if ($scope.cat.cat_list[j].group_list) {
                                $scope.cat.cat_list[j]._selectedItem = 0;
                                if ($scope.apiCategoryId == $scope.cat.cat_list[j].cat_id) {
                                    $scope.cat._selectedItem = j;
                                }
                                for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                                    //$scope.cat.cat_list[j].group_list[i].dynamicAPIItems = new DynamicItems($scope.cat.cat_list[j].group_list[i].api_list);
                                    if ($scope.cat.cat_list[j].group_list[i].api_list) {
                                        for (let k = 0; k < $scope.cat.cat_list[j].group_list[i].api_list.length; k++) {
                                            if (mode && mode.apiMethod && (mode.apiMethod == $scope.cat.cat_list[j].group_list[i].api_list[k].api_id)) {
                                                $scope.cat.cat_list[j]._selectedItem = i;
                                            }
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
            let apiQ = () => $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'api_list',
                param: {ssv_user_id: $rootScope.ssv_user_id, cat_id: $scope.apiCategoryId}
            }).then(body => {
                if (body.data && body.data.data_list && body.data.data_list.length) {
                    $scope.api_list = body.data.data_list;
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
            });
            let domainQ = () => $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'api_domain',
                param: {ssv_user_id: $rootScope.ssv_user_id, cat_id: $scope.apiCategoryId}
            }).then(body => {
                if (body.data && body.data.data_list && body.data.data_list.length) {
                    $scope.api_domain = body.data.data_list;
                    //$scope.$apply();
                } else {
                    $rootScope.alert(body.data.msg);
                }
            }, why => {
                $rootScope.alert(why);
            });
            let ssvQ = param => $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'get_ssv',
                param
            }).then(body => {
                if (body && body.data && body.data.ssv_user_id) {
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
                return $http.post('/agent', {
                    module: 'supplier',
                    partial: 'API',
                    api: 'domain_detail',
                    param: {domain_id}
                }).then(body => {
                    if (body.data && body.data.data_list && body.data.data_list.length) {
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
                        if ($scope.cat.cat_list[j].domain_list) {
                            for (let k = 0; k < $scope.cat.cat_list[j].domain_list.length; k++) {
                                if ($scope.cat.cat_list[j].domain_list[k].domain_id == $scope.domainDetails.domain_id) {
                                    $scope.cat.cat_list[j]._domain_index = k;
                                    break;
                                }
                            }
                        }
                    }

                    $scope.loading = false;

                    var type = 'anonymous';
                    try {
                        type = JSON.parse(getCookie("_session")).login_user_type
                    } catch (e) {

                    }
                    bassdk.quick('setDefaultAttr');
                    bassdk.track('visit', {
                        pageName: $scope.domainDetails.domain_name,
                        userType: type,
                        supplierName: $rootScope.ssv_intro.user_name,
                        pageType: "结构统计"
                    });
                    return body;
                }, why => {
                    $rootScope.alert(why);
                    $scope.loading = false;
                });
            };
            $scope.domainDetailQ = (domain_id, cat) => {
                if (!$scope.loading) {
                    $scope.loading = true;
                    if ($scope.apiCategoryId) {
                        $rootScope.scrollToTop(() => {
                            domainDetailQ(domain_id, cat)
                        })
                        return;
                    }
                    let cat_id = cat.cat_id;
                    $scope.apiCategoryName = cat.cat_name;
                    cat_id && ($scope.apiCategoryId = cat_id);
                    setTimeout(() => {
                        $rootScope.scrollToTop(() => {
                            domainDetailQ(domain_id, cat)
                        })
                    }, 500)
                }
            }
            let apiDetailQ = (api_id, cat) => {
                let cat_id = cat.cat_id;
                $scope.apiCategoryName = cat.cat_name;
                cat_id && ($scope.apiCategoryId = cat_id);
                $rootScope.scrollToTop();
                return $http.post('/agent', {
                    module: 'supplier',
                    partial: 'API',
                    api: 'api_detail',
                    param: {api_id}
                }).then(body => {
                    if (body.data && body.data.data_list && body.data.data_list.length) {
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
                        let return_example_xml = $filter("unescapeHtml")($scope.apiDetails.return_example_xml, 'xml'), error_example_xml = $filter("unescapeHtml")($scope.apiDetails.error_example_xml, 'xml'), return_example_json = $filter("unescapeHtml")($scope.apiDetails.return_example_json, 'xml'), error_example_json = $filter("unescapeHtml")($scope.apiDetails.error_example_json, 'xml');

                        packageTree(return_example_xml ? return_example_xml : "");
                        packageTreeError(error_example_xml ? error_example_xml : "");
                        Process(return_example_json ? return_example_json : "{}");
                        ProcessError(error_example_json ? error_example_json : "{}");
                    });

                    if (mode) {
                        let j = $scope.cat._selectedItem;
                        for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                            $scope.cat.cat_list[j].group_list[i]._api_index = 0;
                            if ($scope.cat.cat_list[j].group_list[i].api_list) {
                                for (let k = 0; k < $scope.cat.cat_list[j].group_list[i].api_list.length; k++) {
                                    if ($scope.cat.cat_list[j].group_list[i].api_list[k].api_id == $scope.apiDetails.api_id) {
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
                    try {
                        type = JSON.parse(getCookie("_session")).login_user_type
                    } catch (e) {

                    }
                    bassdk.quick('setDefaultAttr');
                    bassdk.track('visit', {
                        pageName: $scope.apiDetails.api_name,
                        userType: type,
                        supplierName: $rootScope.ssv_intro.user_name,
                        pageType: "API统计"
                    });
                }, why => {
                    $rootScope.alert(why);
                    $scope.loading = false;
                });
            };

            $scope.apiDetailQ = (api_id, cat) => {
                if (!$scope.loading) {
                    $scope.loading = true;
                    if ($scope.apiCategoryId) {
                        $rootScope.scrollToTop(() => {
                            apiDetailQ(api_id, cat)
                        })
                        return;
                    }
                    let cat_id = cat.cat_id;
                    $scope.apiCategoryName = cat.cat_name;
                    cat_id && ($scope.apiCategoryId = cat_id);
                    setTimeout(() => {
                        $rootScope.scrollToTop(() => {
                            apiDetailQ(api_id, cat)
                        })
                    }, 500)
                }
            }

            $scope.changeAPISearch = () => {
                $scope.cat = JSON.parse(JSON.stringify($scope.originalCat));
                if ($scope.cat.cat_list) {
                    for (let j = 0; j < $scope.cat.cat_list.length; j++) {
                        if ($scope.cat.cat_list[j].group_list) {
                            for (let i = 0; i < $scope.cat.cat_list[j].group_list.length; i++) {
                                if ($scope.cat.cat_list[j].group_list[i].api_list) {
                                    var k = $scope.cat.cat_list[j].group_list[i].api_list.length;
                                    while (k--) {
                                        (($scope.cat.cat_list[j].group_list[i].api_list[k].api_name.indexOf($scope.apiSearch) == -1) && ($scope.cat.cat_list[j].group_list[i].api_list[k].api_title.indexOf($scope.apiSearch) == -1)) && ($scope.cat.cat_list[j].group_list[i].api_list.splice(k, 1));
                                    }
                                }
                            }
                        }

                        if ($scope.cat.cat_list[j].domain_list) {
                            var k = $scope.cat.cat_list[j].domain_list.length;
                            while (k--) {
                                (($scope.cat.cat_list[j].domain_list[k].domain_name.indexOf($scope.apiSearch) == -1) && ($scope.cat.cat_list[j].domain_list[k].domain_title.indexOf($scope.apiSearch) == -1)) && ($scope.cat.cat_list[j].domain_list.splice(k, 1));
                            }
                        }
                    }
                }

            }
            $scope.resetView = () => {
                if ($scope.selectedEntry) {
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
                    }, 200);
                } else {
                    $scope.param = undefined;
                    $scope.breadcrumbs = [];
                    !$scope.cat.cat_list && catQ();
                    $scope.apiCategoryId = undefined;
                    $scope.apiCategoryName = undefined;
                }

                //$(".md-expand.active md-tab-item").eq(0).click();

            }
            if (mode) {
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
                if (mode.apiMethod) {
                    catQ().then(() => {
                        setTimeout(() => {
                            $(".md-expand.active md-tab-item").eq(0).click();
                        })
                        $scope.apiDetailQ(mode.apiMethod, $scope.cat.cat_list[$scope.cat._selectedItem]);
                    });
                } else if (mode.domainMethod) {
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
                if ($scope.loading) {
                    return;
                }
                if (!entry) {
                    $scope.breadcrumbs.splice(0);
                    if ($scope.apiDetails && $scope.apiDetails.api_id && ($scope.defaultDetails !== $scope.apiDetails)) {
                        $scope.breadcrumbs.push($scope.apiDetails);
                    }
                } else {
                    let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];
                    if ((lastBreadcrumb && lastBreadcrumb.api_id && ($scope.defaultDetails !== $scope.domainDetails)) || !lastBreadcrumb) {
                        $scope.breadcrumbs.push($scope.domainDetails)
                    } else {
                        if ($scope.domainDetails && $scope.domainDetails.domain_id) {
                            if (($scope.domainDetails.domain_id != lastBreadcrumb.domain_id) && ($scope.defaultDetails !== $scope.domainDetails)) {
                                $scope.breadcrumbs.push($scope.domainDetails);
                            }
                        }
                    }
                }
            }
            $scope.toSubDomain = (id, details) => {
                if ($scope.loading) {
                    return;
                }
                $scope.loading = true;
                if (!id) {
                    console.log(`toSubDomain: id = ${id};detail=${JSON.stringify(details)}`);
                    return;
                }
                if (details) {
                    $rootScope.scrollToTop(() => {
                        $(".md-expand.active md-tab-item").eq(1).click();
                        setTimeout(() => {
                            domainDetailQ(id, $scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                                let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];
                                if (lastBreadcrumb && (lastBreadcrumb.domain_id && (lastBreadcrumb.domain_id != id) || lastBreadcrumb.api_id)) {
                                    $scope.breadcrumbs.push($scope.domainDetails);
                                }
                                $scope.loading = false;
                            });
                        }, 400)
                    })
                } else {
                    let id_list = $scope.breadcrumbs.map((r, i) => r.api_id ? r.api_id : r.domain_id), subdomain_index = id_list.indexOf(id);
                    $scope.breadcrumbs.splice(subdomain_index + 1);
                    let lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];

                    if (lastBreadcrumb.api_id) {
                        //$scope.breadcrumbs = [];
                        $rootScope.scrollToTop(() => {
                            $(".md-expand.active md-tab-item").eq(0).click();
                            setTimeout(() => {
                                apiDetailQ(id, $scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                                    $scope.loading = false;
                                });
                            }, 400)
                        })
                    } else {
                        $rootScope.scrollToTop(() => {
                            $(".md-expand.active md-tab-item").eq(1).click();
                            setTimeout(() => {
                                domainDetailQ(id, $scope.cat.cat_list[$scope.cat._selectedItem]).then(() => {
                                    $scope.loading = false;
                                });
                            }, 400)
                        })
                    }
                }
            }
            $scope.copyToClipboard = details => {
                let id = details.api_id ? details.api_id : details.domain_id, method = details.api_id ? "ApiMethod" : "ApiDomain";
                return `${Constant.protocol}://${Constant.host}/api/${method}-${id}.html`;
            }
            $scope.levelHint = $event => {
                $event.preventDefault();
                $event.stopPropagation();
                let parentEl = angular.element(document.body);
                $mdDialog.show({
                    /*parent: parentEl,*/
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    template: `
                    <md-dialog aria-label="List dialog" class="level-description">
                        <md-dialog-content style="padding: 32px;">
                            <p><span style="font-size:12px;">开放平台API目前分为低级、中级、高级，根据API的等级不同，需要使用对应的调用方式。</span></p>        
                            <p><md-button class="md-raised low-rank" aria-label="Settings">初级API</md-button>可以使用ACCESS_TOKEN模式和安全签名方式进行调用</p>
                            <p><md-button class="md-raised medium-rank" aria-label="Settings">中级API</md-button>可以使用ACCESS_TOKEN模式和安全签名方式进行调用</p>
                            <p><md-button class="md-raised high-rank" aria-label="Settings">高级API</md-button>只可以使用安全签名方式进行调用。</p>
                            <br /> 
                            <p><span style="font-size:12px;">供应商在发布API时，目前系统会自动根据供应商安全等级分配API调用等级，后续版本将会开放供应商自行设置API调用等级。</span></p>
                            <p><span style="font-size:12px;">当API调用等级比较低时，供应商应处理好服务器的调用安全性，确保数据的安全。</span></p>
                            <p><span style="font-size:12px;">开发者在调用初级和中级API时，必须使用https方式进行调用，保证数据传输中的安全性。</span></p>
                            <br />
                            <p>具体调用方式请参照</p>
                            <p><a href="http://open.rongcapital.cn/welcome/doc/4D41D81C-CBB1-4567-8D15-ACC16EE025C8" target="_blank">Secret签名模式调用API </a></p>
                            <p><a href="http://open.rongcapital.cn/welcome/doc/1109A17A-5873-420E-A590-C4CE6C5A2D59" target="_blank">ACCESS_TOKEN模式调用API</a></p>
                            <p><a href="http://open.rongcapital.cn/welcome/doc/792E3864-2481-42B9-9CD2-4D4B83F3B294" target="_blank">前端调用模式说明</a></p>
                        </md-dialog-content>
                        <md-dialog-actions>
                            <md-button ng-click="closeDialog()" class="md-raised">关闭我</md-button>
                        </md-dialog-actions>
                    </md-dialog>`,
                    controller: DialogController
                });
                function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = () => {
                        $mdDialog.hide();
                    }
                }
            }
            $scope.getScrollIndex = (list, type) => {
                if (type) {
                    return ($scope.apiDetails && $scope.apiDetails.api_id) ? [].concat.apply([], list.map((r, i) => ($scope.apiDetails.api_id == r.api_id) ? [i] : []))[0] : 0;
                } else {
                    return ($scope.domainDetails && $scope.domainDetails.domain_id) ? [].concat.apply([], list.map((r, i) => ($scope.domainDetails.domain_id == r.domain_id) ? [i] : []))[0] : 0;
                }
            };


            let cliper = new Clipboard('.cliper');
            cliper.on('success', e => {
                e.clearSelection();
                $scope.clipboardHints = afterClipboardCopy;
                $timeout(() => {
                    $scope.clipboardHints = beforeClipboardCopy;
                }, 3000);
            });

            cliper.on('error', e => {
                $scope.clipboardHints = workaroundSupportClipboard(e.action);
                $timeout(() => {
                    $scope.clipboardHints = beforeClipboardCopy;
                }, 5000);
            });

            $scope.injectorLoaded = true;
            $rootScope.removeLoading();
        }];
});
