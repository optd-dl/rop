"use strict";define(["../../services"],function(cta){return["$rootScope","$scope","$q","$location","$mdDialog",function($rootScope,$scope,$q,$location,$mdDialog){$rootScope.tab="envApp",$scope.pageIndex=1,$scope.pageSize=new Number(10),$scope.multi=!1,$scope.searcher=function(index,size){$scope.refreshing=!0,$scope.tableData=[{},{}],$scope.total=200,$scope.refreshing=!1},$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.confirm=function(e){e.preventDefault(),e.stopPropagation(),$scope.multi?$rootScope.confirm("停用多环境，将会使所有开发者应用的调用环境全部停用，是否停用多环境？",function(){$scope.multi=!1}):$rootScope.confirm("开启多环境，多环境功能将在10分钟后生效，是否开启多环境？",function(){$scope.multi=!0})},$scope.injectorLoaded=!0,window.test=function(){return $scope}}]});