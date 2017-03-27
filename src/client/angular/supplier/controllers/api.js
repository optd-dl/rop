'use strict';

/**
 * Created by robin on 22/11/2016.
 */
define(['clipboard', 'treeview', 'packagetree', 'string2json', '../../services'], function (Clipboard) {
    'use strict';

    return ['$rootScope', '$scope', '$http', '$filter', '$q', '$cookies', '$stateParams', '$mdSidenav', '$mdDialog', '$timeout', '$state', function ($rootScope, $scope, $http, $filter, $q, $cookies, $stateParams, $mdSidenav, $mdDialog, $timeout, $state) {
        var api_id = $stateParams.id,
            cat_id = $stateParams.cat_id,
            cat_name = $stateParams.cat_name,
            token = $q.defer(),
            $parent = $scope.$parent,
            cliperParam = {};
        $timeout(function () {
            $scope.apiDetailQ(api_id, window.ssv_info && window.ssv_info.cat_id).then(function () {
                $scope.copyToClipboard = function (details) {
                    var id = details.api_id ? details.api_id : details.domain_id,
                        method = details.api_id ? "ApiMethod" : "ApiDomain";
                    return Constant.protocol + '://' + Constant.host + '/api/' + method + '-' + id + '.html';
                };
            });
            delete window.ssv_info.cat_id;
            delete window.ssv_info.cat_name;
        }, 100);

        $scope.initClipboard(cliperParam);

        var cliper = new Clipboard('.cliper');
        cliper.on('success', function (e) {
            e.clearSelection();
            $scope.clipboardHints = cliperParam.afterClipboardCopy;
            $scope.copying = true;
            $timeout(function () {
                $scope.clipboardHints = cliperParam.beforeClipboardCopy;
                $scope.copying = false;
            }, 3000);
        });

        cliper.on('error', function (e) {
            $scope.clipboardHints = cliperParam.workaroundSupportClipboard(e.action);
            $scope.copying = true;
            $timeout(function () {
                $scope.clipboardHints = cliperParam.beforeClipboardCopy;
                $scope.copying = false;
            }, 5000);
        });

        window.test1 = $scope;
        $scope.$on('$destroy', function () {
            cliper && cliper.destroy();
            if ($state.current.name != "document.api" && $state.current.name != "document.domain") {
                $scope.reset();
            }
        });
    }];
});

//# sourceMappingURL=api.js.map