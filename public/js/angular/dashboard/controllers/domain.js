"use strict";function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};define([],function(){return["$rootScope","$scope","$http","$stateParams","$location","$mdDialog","$q",function($rootScope,$scope,$http,$stateParams,$location,$mdDialog,$q){$rootScope.tab="domain",$scope.mode=0,$scope.enterMode=function(mode,cb){$scope.mode=mode,cb&&cb.call()},$scope.exitMode=function(cb){$scope.mode=0,cb&&cb.call()},$scope.toggleFilterPanel=function(e){$scope.showFilterPanel=!$scope.showFilterPanel,$scope.showBatchPanel=!1},$scope.panelSelection={};var initCat={cat_id:"",cat_name:"全部分类"},initGroup={group_id:"",group_name:""},initStatus={status_id:"",status_name:"全部状态"};$scope.reset=function(){$scope.panelSelection.panelCat={cat_id:"",cat_name:"全部分类"},$scope.panelSelection.panelCatGroup={group_id:"",group_name:""},$scope.panelSelection.panelStatus=initStatus,$scope.panelSelection.sorter={name:"",sort:"1"},$scope.columns=[{text:"结构名称",name:"domain_name",tooltip:!0,sort:"1"},{text:"结构标题",name:"domain_title",tooltip:!0},{text:"结构类型",name:"cat_name",style:{width:"128px","text-align":"center"}},{text:"状态",name:"status_name",style:{width:"96px","text-align":"center"}},{text:"是否上线",name:"online_flag",formatter:function(flag){return"1"==flag?"已上线":"未上线"},style:{width:"128px","text-align":"center"}},{text:"添加时间",name:"create_time",sort:"1",style:{width:"160px","text-align":"center"}}],$scope.keyword="",$scope.batch=!1,$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.reset(),$scope.chooseCat=function(cat,group){$scope.panelSelection.panelCat=cat?cat:{cat_id:"",cat_name:"全部分类"},$scope.panelSelection.panelCatGroup=group?group:initGroup,$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.chooseStatus=function(status){$scope.panelSelection.panelStatus=status?status:{status_id:"",status_name:"全部状态"},$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.searcher=function(index,size){if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("domain_list",{pageindex:index?index:$scope.pageIndex,pagesize:size?size:$scope.pageSize,domain_name:$scope.keyword,cat_id:$scope.panelSelection.panelCat.cat_id,group_id:$scope.panelSelection.panelCatGroup.group_id,status:$scope.panelSelection.panelStatus.status_id,sort_name:"create_time"==$scope.panelSelection.sorter.name?"rx_insertTime":$scope.panelSelection.sorter.name,sort_flag:$scope.panelSelection.sorter.sort},function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.tableData=data.data_list,$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)},function(){$scope.total=0})["finally"](function(){$scope.refreshing=!1})},$scope.tableData=[],$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)};$rootScope.ajax("init",function(data){$scope.originalPanel=JSON.parse(JSON.stringify(data)),$scope.panel=data});$scope.canVisistDomain=function(){return $scope.tableData&&$scope.tableData._select},$scope.canInsertDomain=function(){return $scope.panel&&"1"==$scope.panel.role_list.btnInsert},$scope.canUpdateDomain=function(domain){return!(!domain||$scope.panel&&"0"==$scope.panel.role_list.btnUpdate||"1"==domain.is_old)},$scope.canApplyPromoteDomain=function(domain){return!(!domain||$scope.panel&&"0"==$scope.panel.role_list.btnApply||"1"==domain.is_old)&&("2"==domain.status||"5"==domain.status)},$scope.canRecallDomain=function(domain){return!(!domain||$scope.panel&&"0"==$scope.panel.role_list.btnCancel||"0"==domain.cancel_flag||"1"==domain.is_old)&&("2"==domain.status||"4"==domain.status||"5"==domain.status)},$scope.canDeleteDomain=function(domain){return!(!domain||$scope.panel&&"0"==$scope.panel.role_list.btnDelete||"1"==domain.is_old)},$scope.deleteDomain=function($event,row){if(row.names&&row.names.length){var _ret=function(){var InuseController=function(scope,$mdDialog,apis){scope.apis=apis;var hasAPI=!1,hasDomain=!1;scope.apis&&scope.apis.length&&scope.apis.forEach(function(r){r&&r.name&&(r.name.indexOf(".")==-1?hasDomain=!0:hasAPI=!0)}),hasAPI?hasDomain?scope.hint="有如下API和其他结构正在使用该结构":scope.hint="有如下API正在使用该结构":hasDomain?scope.hint="有其他结构正在使用该结构":scope.hint="有如下对象正在使用该结构",scope.closeDialog=function(){$mdDialog.hide()}},showInuse=function(apis){$mdDialog.show({controller:InuseController,template:'<md-dialog aria-label="Mango (Fruit)" style="width: 512px">\n                                <md-dialog-content class="md-dialog-content">\n                                    <div class="md-dialog-content-body">\n                                        <p>操作失败</p>\n                                        <p ng-bind="hint"></p>\n                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>\n                                        <p>请取消关联后再删除</p>\n                                    </div>\n                                </md-dialog-content>\n                                <md-dialog-actions layout="row">\n                                  <md-button ng-click="closeDialog()">确定</md-button>\n                                </md-dialog-actions>\n                            </md-dialog>',targetEvent:$event,parent:angular.element(document.querySelector("body>section>md-content")),locals:{apis:row.names}})};return showInuse(row.names),{v:void 0}}();if("object"===("undefined"==typeof _ret?"undefined":_typeof(_ret)))return _ret.v}return $rootScope.confirm("请确认是否要删除结构？",function(){return $rootScope.ajax("domain_delete",{domain_id:row.domain_id},function(data){$scope.research()})})},$scope.applyDomain=function(row,status){return $rootScope.ajax("domain_apply",{domain_id:row.domain_id,apply_status:status},function(data){return $scope.searcher(),$rootScope.warn("操作成功",1),data})},$scope.cancelDomain=function(row){return $rootScope.ajax("domain_cancel",{domain_id:row.domain_id},function(data){$scope.searcher(),$rootScope.warn("撤销成功",1)})};var initialUpdaterDomain={domain_name:"",domain_rank:"0",domain_title:"",domain_title_en:"",domain_desc:"",domain_desc_en:"",property:[{},{},{},{},{}]},initialSteps=[{name:"基本信息"},{name:"属性信息"}],initDomainQ=void 0;$scope.updaterDomain=JSON.parse(JSON.stringify(initialUpdaterDomain)),$scope.camelCharcodes=[].concat(_toConsumableArray([].concat(_toConsumableArray(Array(26).keys())).map(function(r){return r+65}))),$scope.step=0,$scope.steps=initialSteps,$scope.updaterSelection={panelCat:initCat,panelCatGroup:initGroup},$scope.initDomain=function(row){return $rootScope.ajax("domain_init",{},function(data){return $scope.domainInit=data,$scope.domainInit&&$scope.domainInit.cat_list&&$scope.domainInit.cat_list[0]?(initCat=$scope.domainInit.cat_list[0],void($scope.domainInit.cat_list[0].group_list&&$scope.domainInit.cat_list[0].group_list[0]&&(initGroup=$scope.domainInit.cat_list[0].group_list[0]))):$q.reject("该账号暂无任何可操作的API分类，请完成审核流程并添加API分类")})},initDomainQ=$scope.initDomain(),$scope.addDomainMode=function(mode){initDomainQ&&initDomainQ.then(function(data){$scope.mode=mode,$scope.updaterSelection.panelCat=initCat,$scope.updaterSelection.panelCatGroup=initGroup,0!=$scope.step&&($scope.step=0),$scope.steps=initialSteps,$rootScope.ajax("domain_datatype",{cat_id:$scope.updaterSelection.panelCat.cat_id},function(data){$scope.propertyDataTypes=data.data_type_list})},function(e){$rootScope.alert(e)})},$scope.updateDomainMode=function($event,forView){if($scope.updaterDomain.domain_id="fake",!$scope.tableData._select||!$scope.tableData._select.domain_id)return void $rootScope.alert("用户没有选择一条结构");var updater=function(){return initDomainQ&&initDomainQ.then(function(data){return $scope.domainInit&&$scope.domainInit.cat_list?$rootScope.ajax("domain_info",{domain_id:$scope.tableData._select.domain_id},function(data){$scope.mode=1,$scope.steps=initialSteps,0!=$scope.step&&($scope.step=0),$scope.originalUpdaterDomain=JSON.parse(JSON.stringify(data.domain_info)),angular.extend($scope.updaterDomain,data.domain_info),forView&&($scope.updaterDomain._forView=forView),$scope.updaterSelection.panelCat=[].concat.apply([],$scope.domainInit.cat_list.map(function(r){return r.cat_id==$scope.updaterDomain.cat_id?[r]:[]}))[0],(!$scope.updaterSelection.panelCat||!$scope.updaterSelection.panelCat.cat_id)&&($scope.updaterSelection.panelCat=initCat),$rootScope.ajax("domain_datatype",{cat_id:$scope.updaterSelection.panelCat.cat_id},function(data){$scope.propertyDataTypes=data.data_type_list})}):void $rootScope.alert("结构没有分类信息")})},InuseController=function(scope,$mdDialog,apis){scope.apis=apis;var hasAPI=!1,hasDomain=!1;scope.apis&&scope.apis.length&&scope.apis.forEach(function(r){r&&r.name&&(r.name.indexOf(".")==-1?hasDomain=!0:hasAPI=!0)}),hasAPI?hasDomain?scope.hint="有如下API和其他结构正在使用该结构":scope.hint="有如下API正在使用该结构":hasDomain?scope.hint="有其他结构正在使用该结构":scope.hint="有如下对象正在使用该结构",scope.loadidng=!1,scope.confirmUpdate=function(){scope.loadidng=!0,$rootScope.ajax("domain_status_apply",{domain_id:$scope.tableData._select.domain_id},updater).then(function(){$scope.searcher()}).then(function(){scope.loadidng=!1,$mdDialog.hide()})},scope.closeDialog=function(){$scope.updaterDomain.domain_id="",$mdDialog.hide()}},showInuse=function(apis){$mdDialog.show({controller:InuseController,template:'<md-dialog aria-label="Mango (Fruit)" style="width: 512px">\n                                <md-dialog-content class="md-dialog-content">\n                                    <div class="md-dialog-content-body">\n                                        <md-progress-circular md-mode="indeterminate" ng-show="loadidng" class="md-primary" style="position:absolute;top: 16px;left: 16px;"></md-progress-circular>\n                                        <p ng-bind="hint"></p>\n                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>\n                                        <p>您确认要进行修改吗</p>\n                                    </div>\n                                </md-dialog-content>\n                                <md-dialog-actions layout="row">\n                                  <md-button ng-click="closeDialog()">取消</md-button>\n                                  <md-button ng-click="confirmUpdate()">确定</md-button>\n                                </md-dialog-actions>\n                            </md-dialog>',targetEvent:$event,parent:angular.element(document.querySelector("body>section>md-content")),locals:{apis:apis}})};return forView?void updater.call():($scope.tableData._select&&("0"==$scope.tableData._select.status&&$scope.tableData._select.names&&$scope.tableData._select.names.length?showInuse($scope.tableData._select.names):updater.call()),!1)},$scope.nextStep=function(){return $scope.updaterDomain._forView?void($scope.step<3&&$scope.step++):$scope.updaterDomainForm.$invalid?void($scope.updaterDomainForm.$error.required&&$scope.updaterDomainForm.$error.required.forEach(function(r){r.$setDirty(!0)})):void($scope.step<1&&$scope.step++)},$scope.previousStep=function(){$scope.step>0&&$scope.step--},$scope.cancelStep=function(){$scope.updaterDomain=JSON.parse(JSON.stringify(initialUpdaterDomain)),$scope.updaterDomainForm.$setPristine(),$scope.mode=0,$scope.step=0,$scope.updaterSelection={panelCat:initCat,panelCatGroup:initGroup}},$scope.chooseUpdaterCat=function(cat,group){$rootScope.confirm("修改结构类别会导致 [结构属性信息] 类型中含有结构属性的数据清空，确定修改结构类别吗",function(){$scope.updaterSelection.panelCat=cat?cat:initCat,$scope.updaterDomain.cat_id=$scope.updaterSelection.panelCat.cat_id,$scope.updaterSelection.panelCat.group_list&&$scope.updaterSelection.panelCat.group_list[0]&&($scope.updaterSelection.panelCatGroup=$scope.updaterSelection.panelCat.group_list[0]),$rootScope.ajax("domain_datatype",{cat_id:$scope.updaterSelection.panelCat.cat_id},function(data){$scope.propertyDataTypes=data.data_type_list})})},$scope.chooseUpdaterGroup=function(group){$scope.updaterSelection.panelCatGroup=group?group:initGroup,$scope.updaterDomain.group_id=$scope.updaterSelection.panelCatGroup.group_id},$scope.processPropertyDataType=function(data_type,property){var systemDataTypes=$scope.domainInit.data_type_list.map(function(r){return r.data_type});if(property._customized=systemDataTypes.indexOf(data_type)==-1,data_type!=property.pro_type&&(property.pro_type=data_type),property._customized){var pro_name=void 0;if("1"==property.is_list){pro_name=property.pro_type?property.pro_type.toLowerCase()+"s":"";var second_pro_name=property.pro_type?property.pro_type.toLowerCase():"";property.second_node!=second_pro_name&&(property.second_node=second_pro_name)}else pro_name=property.pro_type?property.pro_type.toLowerCase():"",""!=property.second_node&&(property.second_node="");property.pro_name!=pro_name&&(property.pro_name=pro_name),property.first_node!=pro_name&&(property.first_node=pro_name)}else property.is_list="0",property.first_node="",property.second_node=""},$scope.processListCheck=function(property){property._customized&&$rootScope.nextTick(function(){var pro_name=void 0;if("1"==property.is_list){pro_name=property.pro_type?property.pro_type.toLowerCase()+"s":"";var second_pro_name=property.pro_type?property.pro_type.toLowerCase():"";property.second_node!=second_pro_name&&(property.second_node=second_pro_name)}else pro_name=property.pro_type?property.pro_type.toLowerCase():"",""!=property.second_node&&(property.second_node="");property.pro_name!=pro_name&&(property.pro_name=pro_name),property.first_node!=pro_name&&(property.first_node=pro_name)})},$scope.saveDomain=function(){if(!$scope.updaterDomain)return void $scope.alert("没有初始化数据");if($scope.updaterDomainForm.$invalid)return void($scope.updaterDomainForm.$error.required&&$scope.updaterDomainForm.$error.required.forEach(function(r){r.$setDirty(!0)}));var domain=angular.extend({cat_id:$scope.updaterSelection.panelCat.cat_id,domain_property:[].concat.apply([],$scope.updaterDomain.property.map(function(r){return r.pro_name?[r]:[]}))},$scope.updaterDomain);return domain.property&&delete domain.property,domain.cat_id&&domain.domain_name&&domain.domain_title&&domain.domain_title_en&&domain.domain_desc&&domain.domain_desc_en&&domain.domain_rank?$rootScope.confirm("系统将保存结构设置，您确认要保存吗",function(){if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("domain_save",domain).then(function(data){$scope.refreshing=!1,$scope.resetOrder(),$scope.exitMode(),$scope.step=0,domain.domain_id?$scope.searcher():$scope.research(),$scope.updaterDomainForm.$setPristine(),$scope.updaterDomain=JSON.parse(JSON.stringify(initialUpdaterDomain))},function(why){$scope.refreshing=!1})}):void $scope.alert("基本信息不能为空")},$scope.orderSelection={},$scope.orderSelection.panelCat=initCat,$scope.orderSelection.panelCatGroup=initGroup,$scope.chooseOrderCat=function(cat,group){$scope.orderSelection.panelCat=cat?cat:{},$scope.orderSelection.panelCatGroup=group?group:{},$scope.sortList()},$scope.sortList=function(){return $rootScope.ajax("sort_list",{cat_id:$scope.orderSelection.panelCat.cat_id,group_id:$scope.orderSelection.panelCatGroup.group_id},function(data){$scope.originalSortData=JSON.parse(JSON.stringify(data)),$scope.sortData=data})},$scope.sortSave=function(){$scope.sortData&&$scope.sortData.data_list||$scope.alert("没有可选排序项");var domainIDs=$scope.sortData.data_list.map(function(r){return{domain_id:r.domain_id}});return $rootScope.ajax("sort_save",{domain_list:domainIDs},function(data){$scope.enterMode(0)})},$scope.resetOrder=function(){return initDomainQ&&initDomainQ.then(function(data){return $scope.orderSelection.panelCat=initCat,$scope.orderSelection.panelCatGroup=initGroup,$scope.sortList(),data})},$scope.resetOrder(),$scope.exitOrder=function(){$scope.mode=0,$scope.resetOrder()};var modeInfo=[{title:"结构列表",cancelFunction:$scope.reset},{title:"结构详情",cancelFunction:$scope.cancelStep},{title:"结构排序",cancelFunction:$scope.exitOrder}];$scope.getModeInfo=function(){return"number"==typeof $scope.mode?modeInfo[$scope.mode]:modeInfo[0]},$scope.appendRow=function(row,list){list.push(row?row:{})},$scope.removeRow=function(row,list){list.splice(list.indexOf(row),1)},window.test=function(){return console.log($scope),$scope},$scope.injectorLoaded=!0}]});