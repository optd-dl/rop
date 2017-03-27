"use strict";define([],function(cta){return["$rootScope","$scope","$q","$http","$timeout","$mdDialog",function($rootScope,$scope,$q,$http,$timeout,$mdDialog){$rootScope.tab="group",$scope.columns=[{text:"分类名称",name:"cat_name",style:{"text-align":"left"}},{text:"子分类名称",name:"group_name",style:{"text-align":"left"}},{text:"子分类简介",name:"group_title",style:{"text-align":"left"}},{text:"子分类描述",name:"group_desc",style:{"text-align":"left"}},{text:"状态",name:"group_status",style:{"text-align":"center",width:"96px"}},{text:"添加时间",name:"create_time",style:{"text-align":"center",width:"160px"}}],$scope.auditColumns=[{text:"子分类名称",name:"group_name",style:{"text-align":"left",width:"auto",padding:"0 16px"}},{text:"添加人",name:"user_name",style:{"text-align":"left"}},{text:"状态",name:"is_apply",style:{width:"96px"}}],$scope.audit_list=[],$scope.tobe_audit_list=[],$scope.auditNoSelection=!0,$scope.tobeAuditMultiple=!0,$scope.tobeAuditNoRowSelection=!0,$scope.mode=0,$scope.tableData=[],$scope.loading=!0,$scope.cat_list=[{cat_id:"",cat_name:"全部分类"}],$scope.cat_apply_list=[],$scope.currentCat=$scope.cat_list[0],$scope.currentApplyCat={},$scope.checkKeyword="",$scope.uncheckKeyword="";var initQ=$rootScope.ajax("cat_group_init").then(function(data){return $scope.role_list=data.role_list,$scope.cat_list=$scope.cat_list.concat(data.cat_list),$scope.currentCat=$scope.cat_list[0],data}),initApplyQ=$rootScope.ajax("cat_group_apply_init").then(function(data){return $scope.cat_apply_list=data.cat_list,$scope.cat_apply_list.length>0&&($scope.currentApplyCat=$scope.cat_apply_list[0]),data});$q.all([initQ,initApplyQ])["finally"](function(){$scope.loading=!1}),$scope.selectCat=function(cat){$scope.currentCat={cat_id:cat.cat_id,cat_name:cat.cat_name},$scope.research()},$scope.reset=function(){$scope.keyword="",$scope.currentCat=$scope.cat_list[0],$scope.currentApplyCat={},$scope.pageIndex=1,$scope.pageSize=new Number(10),$scope.total=10,$scope.checked_list=[],$scope.unchecked_list=[]},$scope.searcher=function(index,size){if(!$scope.refreshing){$scope.refreshing=!0;var previous=$scope.tableData&&$scope.tableData._select;return initQ.then(function(){return $rootScope.ajax("cat_group_list",{pageindex:index?index:$scope.pageIndex,pagesize:size?size:$scope.pageSize,cat_id:$scope.currentCat.cat_id,group_name:$scope.keyword},function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.tableData=data.data_list,$scope.tableData&&$scope.tableData[0]&&(previous?$scope.tableData._select=[].concat.apply([],$scope.tableData.map(function(r){return previous.group_id==r.group_id?[r]:[]}))[0]:$scope.tableData._select=$scope.tableData[0]),$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)},function(){$scope.total=0})["finally"](function(){$scope.refreshing=!1})})}},$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.canCreateCategory=function(){return $scope.role_list&&"1"==$scope.role_list.btnInsert},$scope.canUpdateCategory=function(){return $scope.tableData._select&&$scope.role_list&&"1"==$scope.role_list.btnUpdate},$scope.canDeleteCategory=function(){return $scope.tableData._select&&$scope.role_list&&"1"==$scope.role_list.btnDelete},$scope.canManageCategory=function(){return $scope.role_list&&"1"==$scope.role_list.btnApply},$scope.canOperateCategory=function(){return $scope.tableData._select},$scope.deleteCat=function(group){return $rootScope.confirm("请确认是否要删除子分类？",function(){if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("cat_group_del",{group_id:group.group_id},function(data){$scope.research(),$rootScope.alert("删除成功")})["finally"](function(){$scope.refreshing=!1})})},$scope.back=function(){$scope.mode=0};var getCheckedQ=function(){return $rootScope.ajax("cat_group_checked",{cat_id:$scope.currentApplyCat.cat_id}).then(function(data){return $scope.check_list=data.data_list,data})},getUncheckedQ=function(){return $rootScope.ajax("cat_group_unchecked",{cat_id:$scope.currentApplyCat.cat_id}).then(function(data){if($scope.uncheck_list=data.data_list,$scope.uncheck_list&&$scope.uncheck_list.length)for(var i=0;i<$scope.uncheck_list.length;i++){var r=$scope.uncheck_list[i];r._locked="1"==r.apply_status}return data})},checkQ=void 0,uncheckQ=void 0;$scope.manageCat=function(){if(!$scope.refreshing){if(!Array.isArray($scope.cat_apply_list)||0==$scope.cat_apply_list.length)return $rootScope.alert("当前供应商没有已存在的API分类，请先申请分类");$scope.refreshing=!0,initApplyQ.then(function(){$scope.mode=1,checkQ=getCheckedQ().then(function(data){return $scope.audit_list=$scope.check_list,data}),uncheckQ=getUncheckedQ().then(function(data){return $scope.tobe_audit_list=$scope.uncheck_list,data}),$q.all([checkQ,uncheckQ])["finally"](function(){$scope.refreshing=!1})})}},$scope.checkResearch=function(){return checkQ.then(function(){return $scope.audit_list=[].concat.apply([],$scope.check_list.map(function(r){return r.group_name.indexOf($scope.checkKeyword)!=-1?[r]:[]})),$scope.audit_list})},$scope.uncheckResearch=function(){return uncheckQ.then(function(){return $scope.tobe_audit_list=[].concat.apply([],$scope.uncheck_list.map(function(r){return r.group_name.indexOf($scope.uncheckKeyword)!=-1?[r]:[]})),$scope.tobe_audit_list})},$scope.selectApplyCat=function(cat){$scope.currentApplyCat={cat_id:cat.cat_id,cat_name:cat.cat_name},$scope.refreshing=!0,checkQ=getCheckedQ().then(function(data){return $scope.audit_list=$scope.check_list,data}),uncheckQ=getUncheckedQ().then(function(data){return $scope.tobe_audit_list=$scope.uncheck_list,data}),$q.all([checkQ,uncheckQ])["finally"](function(){$scope.refreshing=!1})},$scope.applyCat=function(){var list=[].concat.apply([],$scope.tobe_audit_list.map(function(r){return r._checked?[{group_id:r.group_id}]:[]}));if(!list.length)return void $rootScope.alert("请选择一条子分类");if(!$scope.refreshing)return $scope.refreshing=!0,$rootScope.ajax("cat_group_apply",{group_list:list,cat_id:$scope.currentApplyCat.cat_id}).then(function(){return checkQ=getCheckedQ().then(function(data){return $scope.audit_list=$scope.check_list,data}),uncheckQ=getUncheckedQ().then(function(data){return $scope.tobe_audit_list=$scope.uncheck_list,data}),$q.all([checkQ,uncheckQ])})["finally"](function(){$scope.refreshing=!1})};var CatGroupController=function(scope,cat_list,detail){if(scope.cat_list=cat_list,scope.detail=detail,scope.chooseType=function(type){return scope.detail.cat_type=type},cat_list&&cat_list.length){var originalType=[].concat.apply([],cat_list.map(function(r){return r.cat_id==detail.cat_id?[r]:[]}))[0];scope.chooseType(originalType||cat_list[0])}scope.save=function(){if(!scope.refreshing)return scope.catGroupForm.$invalid?(scope.catGroupForm.$error.required&&scope.catGroupForm.$error.required.forEach(function(r){r.$setDirty(!0)}),scope.catGroupForm.$error.validUnicodeLength&&scope.catGroupForm.$error.validUnicodeLength.forEach(function(r){r.$setDirty(!0)}),scope.catGroupForm.$error.maxlength&&scope.catGroupForm.$error.maxlength.forEach(function(r){r.$setDirty(!0)}),void(scope.error="请检查输入是否正确")):(scope.refreshing=!0,$http.post("/agent",{module:"application",partial:$rootScope.tab,api:"cat_group_save",param:{cat_id:scope.detail.cat_type.cat_id,group_name:scope.detail.group_name,group_name_en:scope.detail.group_name_en,group_title:scope.detail.group_title,group_title_en:scope.detail.group_title_en,group_desc:scope.detail.group_desc,group_desc_en:scope.detail.group_desc_en,group_id:scope.detail.group_id}}).then(function(body){return"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?(scope.detail&&scope.detail.cat_id?$scope.searcher($scope.pageIndex,$scope.pageSize):$scope.reset(),void scope.close()):(scope.error=body.data.msg,$q.reject(body.data.msg))},function(why){return scope.error=why,$q.reject(why)})["finally"](function(){scope.refreshing=!1}))},scope.close=function(){return $mdDialog.hide()}};$scope.showCat=function(ev,row){return $scope.refreshing?$q.reject():($scope.refreshing=!0,$rootScope.ajax("save_group_init",{group_id:row?row.group_id:void 0}).then(function(data){return data&&data.cat_list&&Array.isArray(data.cat_list)&&0!=data.cat_list.length?void $mdDialog.show({controller:CatGroupController,template:'\n                            <md-dialog aria-label="邮箱报警设置" class="form" aria-describedby="quick edit">\n                                <md-toolbar>\n                                    <div class="md-toolbar-tools">\n                                        <md-icon md-svg-icon="navigation:ic_apps_24px"></md-icon>\n                                        <h3><span ng-bind="detail.group_id?\'修改子分类\':\'添加子分类\'"></span></h3>\n                                        <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">\n                                            <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>\n                                        </md-button>\n                                    </div>\n                                </md-toolbar>\n                            \n                                <md-dialog-content>\n                                    <form class="md-dialog-content" name="catGroupForm" ng-submit="saveMail()" autocomplete="off">\n                                        <div class="input-container">\n                                            <label style="width: 108px;">分类类型</label>\n                                            <md-menu class="md-dropdown cool" md-offset="1 50" >\n                                                <md-button ng-click="$mdOpenMenu($event)" class="md-raised md-primary md-hue-1" md-theme="dracular" aria-label="data control" ng-disabled="detail.group_id">\n                                                    <span ng-bind="detail.cat_type.cat_name"></span>\n                                                    <md-icon class="" md-svg-icon="navigation:ic_arrow_drop_down_24px"></md-icon>\n                                                </md-button>\n                                                <md-menu-content class="md-dropdown-content cool" style="width: 264px">\n                                                    <md-menu-item ng-repeat="cat in cat_list"><md-button ng-click="chooseType(cat)">{{cat.cat_name}}</md-button></md-menu-item>\n                                                </md-menu-content>\n                                            </md-menu> \n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类名称</label>\n                                            <input type="text" name="group_name" placeholder="请填写子分类名称" ng-model="detail.group_name" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类名称（英文）</label>\n                                            <input type="text" name="group_name_en" placeholder="请填写子分类名称（英文）" ng-model="detail.group_name_en" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类简介</label>\n                                            <input type="text" name="group_title" placeholder="请填写子分类简介" ng-model="detail.group_title" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类简介（英文）</label>\n                                            <input type="text" name="group_title_en" placeholder="请填写子分类简介（英文）" ng-model="detail.group_title_en" required maxlength="200" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类描述</label>\n                                            <input type="text" name="group_desc" placeholder="请填写子分类描述" ng-model="detail.group_desc" required maxlength="1000" unicode-length-validator/>\n                                        </div>\n                                        <div class="input-container">\n                                            <label style="width: 108px;">子分类描述（英文）</label>\n                                            <input type="text" name="group_desc_en" placeholder="请填写子分类描述（英文）" ng-model="detail.group_desc_en" required maxlength="1000" unicode-length-validator/>\n                                        </div>\n                                       \n                                    </form>\n                                    <div class="app-loading" ng-if="refreshing">\n                                        <md-progress-circular md-mode="indeterminate"></md-progress-circular>\n                                    </div>\n                                </md-dialog-content>\n                                \n                                <md-dialog-actions layout="row">\n                                    <div class="message" ng-if="error">\n                                        <span ng-bind="error"></span>\n                                    </div>\n                                    <md-button ng-click="save()" type="submit">保存</md-button>\n                                </md-dialog-actions>\n                            </md-dialog>                          ',parent:angular.element("body>section>md-content"),targetEvent:ev,clickOutsideToClose:!0,locals:{cat_list:data.cat_list,detail:data.group_data}}):$rootScope.alert("当前供应商没有已存在的API分类，请先添加分类")})["finally"](function(){$scope.refreshing=!1}))},$scope.reset(),$scope.$watch(function(){var el=angular.element("#cat-group-audit-main");return el&&el[0]?el.width():0},function(width){$scope.scrollerStyle={width:width/2-8+"px"},$timeout(function(){var el=angular.element("#cat-group-audit-main");el&&el[0]&&($scope.scrollerStyle={width:el.width()/2-8+"px"})},500)}),$scope.injectorLoaded=!0,window.test=$scope}]});