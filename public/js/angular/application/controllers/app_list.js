"use strict";define(["../../services"],function(cta){return["$rootScope","$scope","$q","$http","$mdDialog",function($rootScope,$scope,$q,$http,$mdDialog){$rootScope.tab="app",$scope.appInfo={},$scope.refreshing0=!1,$scope.refreshing1=!1,$scope.refreshing2=!1,$scope.refreshing3=!1,$scope.initRefreshing=!0;var initFun=function(){return $rootScope.ajax("app_get",{}).then(function(data){return"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"===data.is_success?($scope.appInfo=data,data):$q.reject()})["finally"](function(){$scope.initRefreshing=!1})},initFunQ=initFun();$scope.reset=function(type){var str="App Secret";return"2"!=type&&"3"!=type||(str="Access Token"),$rootScope.confirm("确定要重置"+str+"吗？",function(){initFunQ&&initFunQ.then(function(data){if("string"==typeof type&&data.app_id){switch(type){case"0":$scope.refreshing0=!0;break;case"1":$scope.refreshing1=!0;break;case"2":$scope.refreshing2=!0;break;case"3":$scope.refreshing3=!0}return $rootScope.ajax("app_reset",{app_id:$scope.appInfo.app_id,reset_type:type})["finally"](function(){switch(type){case"0":$scope.refreshing0=!1;break;case"1":$scope.refreshing1=!1;break;case"2":$scope.refreshing2=!1;break;case"3":$scope.refreshing3=!1}return initFun()})}return $q.reject()})})},$scope.injectorLoaded=!0,window.test=$scope}]});