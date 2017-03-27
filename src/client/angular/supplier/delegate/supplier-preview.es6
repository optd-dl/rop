/* App Module */

let supplierApp = angular.module('SupplierApp', [
    'ngRoute', 'ui.router', 'ngAnimate', 'ngCookies', 'ngMaterial', 'ngMessages'
]);

supplierApp.config($mdThemingProvider => {
    let customBlueMap = $mdThemingProvider.extendPalette('indigo', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': undefined,
        'contrastLightColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50',
            'hue-3': 'A400'
        })
        .accentPalette('pink');

    $mdThemingProvider.theme('dracular', 'default')
        .primaryPalette('grey', {
            'default': '500',
            'hue-2': '800',
            'hue-3': '900'
        }).accentPalette('deep-orange');
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

supplierApp.controller('SupplierCtrl', ['$scope', '$route', '$http', '$location', '$rootScope', '$window', '$state', '$cookies', '$mdDialog', '$filter', '$q',
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
        $filter,
        $q) => {
        $scope.go = tab => {
            //$(".slider-banner-container .slider-banner").revpause();
            $rootScope.scrollToTop(() => {
                $state.go(tab);
            })
        }
        $rootScope.locate = url => {
            $window.location.href = url;
        }
        $rootScope.toPlatform = path => {
            $scope.locate(`${Constant.protocol}://${Constant.host}${path ? path : ""}`);
        }

        $rootScope.scrollToTop = cb => {
            if (getBrowserType() == "Firefox") {
                $('html').animate({scrollTop: 0}, cb);
            } else {
                $('body').animate({scrollTop: 0}, cb);
            }
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

        $rootScope.removeLoading = () => {
            if (!angular.element('.loading').hasClass("out")) {
                $('.loading').fadeOut(0,()=>{$('.loading').addClass("out");})
            }
        }

        $('a[href^="#"]', '#partials').click(e => {
            e.preventDefault();
        });
        let _lang = $cookies.get("_lang");
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
        $scope.breadcrumbs = [], $scope.selectedEntry = 0, $scope.defaultDetails = {api_name: "API名字"}, $scope.apiDetails = $scope.defaultDetails, $scope.domainDetails = $scope.defaultDetails,
            $scope.clipboardHints = beforeClipboardCopy, $scope.makeDebugUrl = api => `${Constant.protocol}://${Constant.host}/ApiTool/index?sign=${api}`,
            $scope.makeSDKUrl = api => `${Constant.protocol}://${Constant.host}/welcome/sdkTool`;

        let catQ = () => $http.post('/agent', {
            module: 'supplier',
            partial: 'API',
            api: 'get_ssv_cat',
            param: {ssv_user_id: $rootScope.ssv_user_id}
        }).then(body => {
            if (body.data && body.data.cat_list && body.data.cat_list.length) {
                $scope.cat_list = body.data.cat_list;
            } else {
                $rootScope.alert(body.data.msg);
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
        let domainDetailQ = (domain_id, cat_id) => {
            cat_id && ($scope.apiCategoryId = cat_id);
            $scope.apiDetails = $scope.defaultDetails;
            return $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'domain_detail_preview',
                param: {domain_id}
            }).then(body => {
                if (body.data && body.data.data_list && body.data.data_list.length) {
                    $scope.domainDetails = body.data.data_list[0];
                } else {
                    $scope.domainDetails = $scope.defaultDetails;
                }
                cat_id && ($scope.breadcrumbs = [$scope.domainDetails]);
                ($scope.domainDetails.domain_desc) && ($scope.domainDetails.domain_desc_expanded = true);
                ($scope.domainDetails.property) && ($scope.domainDetails.property_expanded = true);
                $scope.loading = false;
                return body;
            }, why => {
                $rootScope.alert(why);
                $scope.loading = false;
            });
        };
        $scope.domainDetailQ = (domain_id, cat_id) => {
            if (!$scope.loading) {
                $scope.loading = true;
                cat_id && ($scope.apiCategoryId = cat_id);
                $rootScope.scrollToTop(() => {
                    domainDetailQ(domain_id, cat_id)
                })
            }
        }
        let apiDetailQ = (api_id, cat_id) => {
            cat_id && ($scope.apiCategoryId = cat_id);
            $scope.domainDetails = $scope.defaultDetails;
            $rootScope.scrollToTop();
            return $http.post('/agent', {
                module: 'supplier',
                partial: 'API',
                api: 'api_detail_preview',
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

                // TODO 因为xml插件有判断是否隐藏操作，而
                setTimeout(() => {
                    let return_example_xml = $filter("unescapeHtml")($scope.apiDetails.return_example_xml, 'xml'), error_example_xml = $filter("unescapeHtml")($scope.apiDetails.error_example_xml, 'xml'), return_example_json = $filter("unescapeHtml")($scope.apiDetails.return_example_json, 'xml'), error_example_json = $filter("unescapeHtml")($scope.apiDetails.error_example_json, 'xml');

                    packageTree(return_example_xml ? return_example_xml : "");
                    packageTreeError(error_example_xml ? error_example_xml : "");
                    Process(return_example_json ? return_example_json : "{}");
                    ProcessError(error_example_json ? error_example_json : "{}");
                },400);

                $scope.loading = false;
            }, why => {
                $rootScope.alert(why);
                $scope.loading = false;
            });
        };

        $scope.apiDetailQ = (api_id, cat_id) => {
            if (!$scope.loading) {
                cat_id && ($scope.apiCategoryId = cat_id);
                $scope.loading = true;
                $rootScope.scrollToTop(() => {
                    apiDetailQ(api_id, cat_id)
                })
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
                    !$scope.cat_list && catQ();
                    $scope.apiCategoryId = undefined;
                }, 200);
            } else {
                $scope.param = undefined;
                $scope.breadcrumbs = [];
                !$scope.cat_list && catQ();
                $scope.apiCategoryId = undefined;
            }
        }

        $scope.init = (info, param) => {
            let _param, _info;
            try {
                _param= JSON.parse(param);
            } catch(e){
                _param = undefined;
            }
            try {
                _info= JSON.parse(info);
            } catch(e){
                _info = undefined;
            }

            if(_info || _param){
                $rootScope.ssv_user_id = _info.ssv_id;
                $scope.apiCategoryId= _info.cat_id;
                $scope.param = _param;
            } else {
                $rootScope.toPlatform();
            }

            if ($scope.param.apiPreview){
                setTimeout(() => {
                    $(".md-expand.active md-tab-item").eq(1).click();
                })
                $scope.apiDetailQ($scope.param.apiPreview, $scope.apiCategoryId);
            } else if($scope.param.domainPreview){
                setTimeout(() => {
                    $(".md-expand.active md-tab-item").eq(1).click();
                })
                $scope.domainDetailQ($scope.param.domainPreview, $scope.apiCategoryId);
            } else {
                $rootScope.toPlatform();
            }
        }


        $scope.selectCategory = cat_id => {
            $scope.selectedCatId = cat_id;
            apiQ();
            domainQ();
        }
        $scope.selectEntry = entry => {
            $scope.selectedEntry = entry;
        }
        $scope.toSubDomain = (id, details) => {
            if (!id) {
                console.log(`toSubDomain: id = ${id};detail=${JSON.stringify(details)}`);
                return;
            }
            if (details) {
                var lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];
                $rootScope.scrollToTop(() => {
                    if (lastBreadcrumb && (lastBreadcrumb.api_id ? (lastBreadcrumb.api_id != id) : (lastBreadcrumb.domain_id != id))) {
                        //$scope.breadcrumbs.push(details);
                        domainDetailQ(id).then(() => {
                            $scope.breadcrumbs.push($scope.domainDetails);
                        }, why => {
                            $rootScope.alert(why);
                        }).then(() => {
                            setTimeout(() => {
                                $(".md-expand.active md-tab-item").eq(1).click();
                            }, 400)
                        });
                    }
                })
            } else {
                let id_list = $scope.breadcrumbs.map((r, i) => r.api_id ? r.api_id : r.domain_id), subdomain_index = id_list.indexOf(id);
                $scope.breadcrumbs.splice(subdomain_index + 1);
                var lastBreadcrumb = $scope.breadcrumbs[$scope.breadcrumbs.length - 1];

                if (lastBreadcrumb.api_id) {
                    $rootScope.scrollToTop(() => {
                        apiDetailQ(id).then(() => {
                            setTimeout(() => {
                                $(".md-expand.active md-tab-item").eq(0).click();
                            }, 400)
                        });
                    })
                } else {
                    $rootScope.scrollToTop(() => {
                        domainDetailQ(id).then(() => {
                            setTimeout(() => {
                                $(".md-expand.active md-tab-item").eq(1).click();
                            }, 400)
                        });
                    })
                }
            }
        }
        $scope.copyToClipboard = details => {
            let id = details.api_id ? details.api_id : details.domain_id, method = details.api_id ? "ApiPreview" : "ApiDomainPreview";
            return `${Constant.protocol}://${Constant.host}/api/${method}-${id}.html`;
        }

        setTimeout(() => {
            let cliper = new Clipboard('.cliper');
            setTimeout(() => {
                $('.cliper').tooltip({
                    placement: "right"
                });
            });
            cliper.on('success', e => {
                e.clearSelection();
                $(e.trigger).attr('data-original-title', afterClipboardCopy)
                    .tooltip('show');
                setTimeout(() => {
                    $(e.trigger).attr('data-original-title', beforeClipboardCopy);
                    $(document).find($(e.trigger).data()["bs.tooltip"].$tip).length && ($(e.trigger).tooltip("show"));
                }, 3000);
            });

            cliper.on('error', e => {
                $(e.trigger).attr('data-original-title', workaroundSupportClipboard(e.action))
                    .tooltip('show');
                setTimeout(() => {
                    $(e.trigger).attr('data-original-title', beforeClipboardCopy);
                    $(document).find($(e.trigger).data()["bs.tooltip"].$tip).length && ($(e.trigger).tooltip("show"));
                }, 5000);
            });

            //$rootScope.removeLoading();
        },1500);
        $rootScope.removeLoading();
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
supplierApp.filter('parseYear', () => (str, type) => {
    let year = str;
    try {
        year = new Date(str).getFullYear();
    } catch (e) {
        console.log("warning, unable to parse the date string")
    }

    return year
});
supplierApp.filter('parseMonth', () => (str, type) => {
    let month = str;
    try {
        month = new Date(str).getMonth() + 1;
    } catch (e) {
        console.log("warning, unable to parse the date string")
    }

    return month
})
supplierApp.filter('parseDate', () => (str, type) => {
    let date = str;
    try {
        date = new Date(str).getDate();
        (date < 10) && (date = `0${date}`);
    } catch (e) {
        console.log("warning, unable to parse the date string")
    }

    return date
})

supplierApp.filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)]);
