"use strict";define([],function(cta){return["$rootScope","$scope","$q","$http","$timeout","$mdDialog",function($rootScope,$scope,$q,$http,$timeout,$mdDialog){$rootScope.tab="category",$scope.columns=[{text:"分类名称",name:"cat_name",style:{"text-align":"left"}},{text:"分类简介",name:"cat_title",style:{"text-align":"left"}},{text:"分类描述",name:"cat_desc",style:{"text-align":"left"}},{text:"状态",name:"cat_status",style:{"text-align":"center",width:"96px"}},{text:"添加时间",name:"create_time",style:{"text-align":"center",width:"160px"}}],$scope.auditColumns=[{text:"分类名称",name:"cat_name",style:{"text-align":"left",width:"auto",padding:"0 16px"}},{text:"添加人",name:"user_name",style:{"text-align":"left"}},{text:"状态",name:"is_apply",style:{width:"96px"}}],$scope.audit_list=[],$scope.tobe_audit_list=[],$scope.auditNoSelection=!0,$scope.tobeAuditMultiple=!0,$scope.tobeAuditNoRowSelection=!0,$scope.mode=0,$scope.tableData=[],$scope.loading=!0,$scope.checkKeyword="",$scope.uncheckKeyword="";var initQ=$rootScope.ajax("cat_init").then(function(data){return $scope.role_list=data.role_list,data})["finally"](function(){$scope.loading=!1});$scope.reset=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10),$scope.total=10,$scope.checked_list=[],$scope.unchecked_list=[],$scope.keyword=""},$scope.searcher=function(index,size){if(!$scope.refreshing){$scope.refreshing=!0;var previous=$scope.tableData&&$scope.tableData._select;return initQ.then(function(){return $rootScope.ajax("cat_list",{pageindex:index?index:$scope.pageIndex,pagesize:size?size:$scope.pageSize,cat_name:$scope.keyword},function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.tableData=data.data_list,$scope.tableData&&$scope.tableData[0]&&(previous?$scope.tableData._select=[].concat.apply([],$scope.tableData.map(function(r){return previous.cat_id==r.cat_id?[r]:[]}))[0]:$scope.tableData._select=$scope.tableData[0]),$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)},function(){$scope.total=0})["finally"](function(){$scope.refreshing=!1})})}},$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.canCreateCategory=function(){return $scope.role_list&&"1"==$scope.role_list.btnInsert},$scope.canUpdateCategory=function(){return $scope.tableData._select&&$scope.role_list&&"1"==$scope.role_list.btnUpdate},$scope.canDeleteCategory=function(){return $scope.tableData._select&&$scope.role_list&&"1"==$scope.role_list.btnDelete},$scope.canManageCategory=function(){return $scope.role_list&&"1"==$scope.role_list.btnApply},$scope.canOperateCategory=function(){return $scope.tableData._select},$scope.deleteCat=function(cat){return $rootScope.confirm("请确认是否要删除分类？",function(){if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("cat_del",{cat_id:cat.cat_id},function(data){$scope.research(),$rootScope.alert("删除成功")})["finally"](function(){$scope.refreshing=!1})})};var CatController=function(scope,type_list,detail){if(scope.type_list=type_list,scope.detail=detail,scope.chooseType=function(type){return scope.detail.cat_type=type},type_list&&type_list.length){var originalType=[].concat.apply([],type_list.map(function(r){return r.type_id==detail.cat_type_id?[r]:[]}))[0];scope.chooseType(originalType||type_list[0])}scope.save=function(){if(!scope.refreshing)return scope.catForm.$invalid?(scope.catForm.$error.validUnicodeLength?(scope.catForm.$error.validUnicodeLength.forEach(function(r){r.$setDirty(!0)}),scope.error="请检查输入是否超长"):scope.catForm.$error.required?(scope.catForm.$error.required.forEach(function(r){r.$setDirty(!0)}),scope.error="请检查必填项"):scope.catForm.$error.required&&(scope.catForm.$error.maxlength&&scope.catForm.$error.maxlength.forEach(function(r){r.$setDirty(!0)}),scope.error="请检查输入是否超长"),void(scope.error="请检查输入是否正确")):(scope.refreshing=!0,$http.post("/agent",{module:"application",partial:$rootScope.tab,api:"cat_save",param:{cat_type_id:scope.detail.cat_type.type_id,cat_name:scope.detail.cat_name,cat_name_en:scope.detail.cat_name_en,cat_title:scope.detail.cat_title,cat_title_en:scope.detail.cat_title_en,cat_desc:scope.detail.cat_desc,cat_desc_en:scope.detail.cat_desc_en,cat_id:scope.detail.cat_id}}).then(function(body){return"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?(scope.detail&&scope.detail.cat_id?$scope.searcher($scope.pageIndex,$scope.pageSize):$scope.reset(),void scope.close()):(scope.error=body.data.msg,$q.reject(body.data.msg))},function(why){return scope.error=why,$q.reject(why)})["finally"](function(){scope.refreshing=!1}))},scope.close=function(){return $mdDialog.hide()}};$scope.showCat=function(ev,row){return $scope.refreshing?$q.reject():($scope.refreshing=!0,$rootScope.ajax("save_init",{cat_id:row?row.cat_id:void 0}).then(function(data){$mdDialog.show({controller:CatController,template:'\n                            <md-dialog aria-label="邮箱报警设置" class="form" aria-describedby="quick edit">\n                                <md-toolbar>\n                                    <div class="md-toolbar-tools">\n                                        <md-icon md-svg-icon="navigation:ic_apps_24px"></md-icon>\n                                        <h3><span ng-bind="detail.cat_id?\'修改分类\':\'添加分类\'"></span></h3>\n                                        <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">\n                                            <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>\n                                        </md-button>\n                                    </div>\n                                </md-toolbar>\n                            \n                                <md-dialog-content>\n                                    <form class="md-dialog-content" name="catForm" ng-submit="saveMail()" autocomplete="off">\n                                        <div class="input-container">\n                                            <label>分类类型</label>\n                                            <md-menu class="md-dropdown cool" md-offset="1 50" >\n                                                <md-button ng-click="$mdOpenMenu($event)" class="md-raised md-primary md-hue-1" md-theme="dracular" aria-label="data control">\n                                                    <span ng-bind="detail.cat_type.type_name"></span>\n                                                    <md-icon class="" md-svg-icon="navigation:ic_arrow_drop_down_24px"></md-icon>\n                                                </md-button>\n                                                <md-menu-content class="md-dropdown-content cool" style="width: 264px">\n                                                    <md-menu-item ng-repeat="item in type_list"><md-button ng-click="chooseType(item)">{{item.type_name}}</md-button></md-menu-item>\n                                                </md-menu-content>\n                                            </md-menu> \n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类名称</label>\n                                            <input type="text" name="cat_name" placeholder="请填写分类名称" ng-model="detail.cat_name" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类名称（英文）</label>\n                                            <input type="text" name="cat_name_en" placeholder="请填写分类名称（英文）" ng-model="detail.cat_name_en" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类简介</label>\n                                            <input type="text" name="cat_title" placeholder="请填写分类简介" ng-model="detail.cat_title" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类简介（英文）</label>\n                                            <input type="text" name="cat_title_en" placeholder="请填写分类简介（英文）" ng-model="detail.cat_title_en" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类描述</label>\n                                            <input type="text" name="cat_desc" placeholder="请填写分类描述" ng-model="detail.cat_desc" required maxlength="1000" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label>分类描述（英文）</label>\n                                            <input type="text" name="cat_desc_en" placeholder="请填写分类描述（英文）" ng-model="detail.cat_desc_en" required maxlength="1000" unicode-length-validator/>\n                                        </div>\n                                       \n                                    </form>\n                                    <div class="app-loading" ng-if="refreshing">\n                                        <md-progress-circular md-mode="indeterminate"></md-progress-circular>\n                                    </div>\n                                </md-dialog-content>\n                                \n                                <md-dialog-actions layout="row">\n                                    <div class="message" ng-if="error">\n                                        <span ng-bind="error"></span>\n                                    </div>\n                                    <md-button ng-click="save()" type="submit">保存</md-button>\n                                </md-dialog-actions>\n                            </md-dialog>                          ',parent:angular.element("body>section>md-content"),targetEvent:ev,clickOutsideToClose:!0,locals:{type_list:data.type_list,detail:data.cat_data}})})["finally"](function(){$scope.refreshing=!1}))};var getCheckedQ=function(){return $rootScope.ajax("cat_checked").then(function(data){return $scope.check_list=data.data_list,data})},getUncheckedQ=function(){return $rootScope.ajax("cat_unchecked").then(function(data){if($scope.uncheck_list=data.data_list,$scope.uncheck_list&&$scope.uncheck_list.length)for(var i=0;i<$scope.uncheck_list.length;i++){var r=$scope.uncheck_list[i];r._locked="1"==r.apply_status}return data})},checkQ=void 0,uncheckQ=void 0;$scope.back=function(){$scope.mode=0},$scope.manageCat=function(){if(!$scope.refreshing)return $scope.mode=1,$scope.refreshing=!0,checkQ=getCheckedQ().then(function(data){return $scope.audit_list=$scope.check_list,data}),uncheckQ=getUncheckedQ().then(function(data){return $scope.tobe_audit_list=$scope.uncheck_list,data}),$q.all([checkQ,uncheckQ]).then(function(){$scope.refreshing=!1})},$scope.applyCat=function(){var list=[].concat.apply([],$scope.tobe_audit_list.map(function(r){return r._checked?[{cat_id:r.cat_id}]:[]}));if(!list.length)return void $rootScope.alert("请选择一条分类");if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("cat_apply",{cat_list:list}).then(function(){return checkQ=getCheckedQ().then(function(data){return $scope.audit_list=$scope.check_list,data}),uncheckQ=getUncheckedQ().then(function(data){return $scope.tobe_audit_list=$scope.uncheck_list,data}),$q.all([checkQ,uncheckQ])})["finally"](function(){$scope.refreshing=!1})},$scope.checkResearch=function(){return checkQ.then(function(){return $scope.audit_list=[].concat.apply([],$scope.check_list.map(function(r){return r.cat_name.indexOf($scope.checkKeyword)!=-1?[r]:[]})),$scope.audit_list})},$scope.uncheckResearch=function(){return uncheckQ.then(function(){return $scope.tobe_audit_list=[].concat.apply([],$scope.uncheck_list.map(function(r){return r.cat_name.indexOf($scope.uncheckKeyword)!=-1?[r]:[]})),$scope.tobe_audit_list})},$scope.reset(),$scope.$watch(function(){var el=angular.element("#cat-audit-main");return el&&el[0]?el.width():0},function(width){$scope.scrollerStyle={width:width/2-8+"px"},$timeout(function(){var el=angular.element("#cat-audit-main");el&&el[0]&&($scope.scrollerStyle={width:el.width()/2-8+"px"})},500)}),$scope.injectorLoaded=!0,window.test=$scope}]});