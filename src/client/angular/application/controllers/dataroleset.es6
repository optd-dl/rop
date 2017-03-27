/**
 * Created by robin on 22/11/2016.
 */
define([], function () {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$http', '$mdDialog',
        ($rootScope, $scope, $q, $http, $mdDialog) => {
            $rootScope.tab = "dataroleset";

            $scope.columns = [{
                text: "开发者编码",
                name: "user_name",
            },{
                text: "开发者名称",
                name: "app_name"
            },{
                text: "配置数量",
                name: "appkey",
                style: {'width': "128px"}
            }];
            $scope.list = [];
            $scope.reset = ()=>{
                /*$scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                $scope.total = 10;*/
            };

            $scope.reset();
            $scope.injectorLoaded = true;
            window.test = $scope;
        }];
});
