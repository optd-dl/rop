"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};define(["../../services"],function(cta){return["$rootScope","$scope","$q","$http","$mdDialog",function($rootScope,$scope,$q,$http,$mdDialog){$rootScope.tab="env_set";var initialSteps=($rootScope.ajax("init",{}).then(function(data){$scope.role_list=data.role_list,$scope.searcher=function(index,size){return $scope.refreshing=!0,$rootScope.ajax("list",{ename:$scope.ename,pageindex:void 0!==index?index:$scope.pageIndex,pagesize:void 0!==size?size:$scope.pageSize}).then(function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.tableData=data.data_list,$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)})["finally"](function(){$scope.refreshing=!1})},$scope.reset()}),[{name:"添加环境"},{name:"地址设置"}]),virtualRepeatProsessor=function(index){index!==-1?index<=$scope.updater.detail.api_list.length-5-1?$scope.topIndex=index:($scope.topIndex=index-6,$rootScope.nextTick(function(){$scope.topIndex=index})):$scope.topIndex=0};$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.reset=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10),$scope.mode=0,$scope.updater={},$scope.step=0,$scope.steps=initialSteps,$scope.topIndex=0},$scope.canInsert=function(){return!!$scope.role_list&&"1"==$scope.role_list.btnInsert},$scope.canUpdate=function(){return!!($scope.tableData&&$scope.tableData._select&&$scope.role_list)&&"1"==$scope.role_list.btnUpdate},$scope.canDelete=function(){return!!($scope.tableData&&$scope.tableData._select&&$scope.role_list)&&"1"==$scope.role_list.btnDelete},$scope["export"]=function(eid){return $scope.exporting?$q.reject():($scope.exporting=!0,$rootScope.ajax("export",{eid:eid}).then(function(data){if("Chrome"==$rootScope.browserType){var a=window.document.createElement("a");a.href=data.export_url,a.download=!0,a.click()}else window.open(data.export_url,"_blank")})["finally"](function(){$scope.exporting=!1}))},$scope.columns=[{text:"环境名称",name:"ename"},{text:"备注",name:"remark"},{text:"添加时间",name:"create_time",style:{"text-align":"center"}}],$scope.batch=!1,$scope.addMode=function(){return $scope.refreshing?$q.reject():($scope.refreshing=!0,$rootScope.ajax("detail",{}).then(function(data){$scope.updater.detail=data,$scope.updater.detail.selectedEnv=data&&data.environment_list?data.environment_list[0]:null,$scope.mode=1,0!=$scope.step&&($scope.step=0),$scope.steps=initialSteps})["finally"](function(){$scope.refreshing=!1}))},$scope.updateMode=function(eid){return $scope.refreshing?$q.reject():($scope.refreshing=!0,$rootScope.ajax("detail",{eid:eid}).then(function(data){$scope.updater.detail=data,$scope.updater.detail.selectedEnv=data&&data.environment_list?data.environment_list[0]:null,$scope.mode=1,0!=$scope.step&&($scope.step=0),$scope.steps=initialSteps})["finally"](function(){$scope.refreshing=!1}))},$scope.enterMode=function(mode,cb){$scope.mode=mode,cb&&cb.call()},$scope.exitMode=function(cb){$scope.mode=0,cb&&cb.call()},$scope["delete"]=function(eid){return $scope.refreshing?$q.reject():$rootScope.confirm("请确认是否要删除多环境？",function(){return $rootScope.ajax("del",{eid:eid}).then($scope.research)})},$scope.nextStep=function(){if($scope.updaterForm.$invalid)for(var pattern in $scope.updaterForm.$error)$scope.updaterForm.$error[pattern].forEach(function(r){r.$setDirty(!0)});else $scope.step<1&&$scope.step++},$scope.previousStep=function(){$scope.step>0&&$scope.step--},$scope.cancelStep=function(){$scope.updaterForm.$setPristine(),$scope.mode=0,$scope.step=0,$scope.updater={},$scope.keyword="",$scope.invalidURLInfo=void 0},$scope.selectEnv=function(env){$scope.updater.detail.selectedEnv=env},$scope.cloneEnv=function(env){return $scope.refreshing?$q.reject():($scope.refreshing=!0,void $rootScope.ajax("clone",{eid:$scope.updater.detail.selectedEnv.eid}).then(function(data){data.data_list&&data.data_list.forEach(function(r){$scope.updater.detail.api_list.forEach(function(row){row.api_id==r.api_id&&(row.api_url=r.api_url)})})})["finally"](function(){$scope.refreshing=!1}))},$scope.unifyEnv=function(env){return $scope.refreshing?$q.reject():void $scope.updater.detail.api_list.forEach(function(row){row.api_url=$scope.updater.detail.url})},$scope.saveEnv=function(){if($scope.refreshing)return $q.reject();if($scope.updater.keywordResultList=void 0,$scope.keyword="",$scope.updaterForm.$invalid){var i,_ret=function(){var index=0;for(i=$scope.updater.detail.api_list.length-1;i>=0;i--)$scope.updater.detail.api_list[i]._selected=0,!$scope.updaterForm.$error.required||$scope.updater.detail.api_list[i].api_url&&$scope.updater.detail.api_list[i].api_url!=$scope.updaterForm.$error.required[0].$modelValue?$scope.updaterForm.$error.url&&$scope.updater.detail.api_list[i].api_url===$scope.updaterForm.$error.url[0].$modelValue&&(index=i):index=i,index<=$scope.updater.detail.api_list.length-5-1?$scope.topIndex=index:$scope.topIndex=index-6;return $rootScope.nextTick(function(){$scope.topIndex=index,$scope.updaterForm.$error.required&&$scope.updaterForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$scope.updaterForm.$error.url&&$scope.updaterForm.$error.url.forEach(function(r){r.$setDirty(!0)})}),{v:void 0}}();if("object"===("undefined"==typeof _ret?"undefined":_typeof(_ret)))return _ret.v}var param={eid:$scope.updater.detail.eid||void 0,ename:$scope.updater.detail.ename||"",remark:$scope.updater.detail.remark||"",environment_url:$scope.updater.detail.api_list||[]};return $scope.refreshing=!0,$http.post("/agent",{module:"application",partial:$rootScope.tab,api:"save",param:param}).then(function(body){return"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.invalidURLInfo=void 0,$scope.exitMode(),$scope.searcher().then(function(){$rootScope.nextTick(function(){$scope.updaterForm.$setPristine(),$scope.step=0,$scope.updater={},$scope.topIndex=0})})):($scope.invalidURLInfo=body.data,$scope.topIndex=0,$scope.locateURL(),$q.reject())},$rootScope.alert)["finally"](function(){$scope.refreshing=!1})},$scope.locateURL=function(){var index=$scope.updater.detail&&$scope.updater.detail.api_list&&$scope.invalidURLInfo?[].concat.apply([],$scope.updater.detail.api_list.map(function(r,i){return r.api_url==$scope.invalidURLInfo.sub_msg?[i]:[]}))[0]:void 0;index!==-1?index<=$scope.updater.detail.api_list.length-5-1?$scope.topIndex=index:($scope.topIndex=index-6,$rootScope.nextTick(function(){$scope.topIndex=index})):($scope.invalidURLInfo=void 0,$scope.topIndex=0)},$scope.locate=function(){if(1==$scope.mode&&1==$scope.step){var candidateList=$scope.updater.detail&&$scope.updater.detail.api_list&&$scope.keyword?[].concat.apply([],$scope.updater.detail.api_list.map(function(r,i){return r._selected=0,r.api_url&&r.api_url.indexOf($scope.keyword)!=-1?(r._selected=2,[i]):r.api_name&&r.api_name.indexOf($scope.keyword)!=-1?(r._selected=1,[i]):[]})):$scope.updater.detail.api_list.map(function(r,i){return r._selected=0,[r]}),index=candidateList[0]||0;$scope.updater.keywordResultList=candidateList,virtualRepeatProsessor(index)}},$scope.locateNext=function(e){if(1==$scope.mode&&1==$scope.step){e.preventDefault(),e.stopPropagation();var index=0;if($scope.updater.keywordResultList){for(var i=0;i<$scope.updater.keywordResultList.length;i++){var myIndex=$scope.updater.keywordResultList[i];if(myIndex>$scope.topIndex){index=myIndex;break}i==$scope.updater.keywordResultList.length-1&&(index=$scope.updater.keywordResultList[0])}virtualRepeatProsessor(index)}}},$scope.injectorLoaded=!0,window.test=function(){return $scope}}]});