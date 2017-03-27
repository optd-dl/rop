/**
 * Created by zhangjj on 08/02/2017
 */
define([], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$http', '$timeout', '$mdDialog',
        ($rootScope, $scope, $q, $http, $timeout, $mdDialog) => {
            $rootScope.tab = "group";

            $scope.columns = [{
                text: "分类名称",
                name: "cat_name",
                style: {'text-align': "left"}
            },{
                text: "子分类名称",
                name: "group_name",
                style: {'text-align': "left"}
            },{
                text: "子分类简介",
                name: "group_title",
                style: {'text-align': "left"}
            },{
                text: "子分类描述",
                name: "group_desc",
                style: {'text-align': "left"}
            },{
                text: "状态",
                name: "group_status",
                style: {'text-align': "center",'width':"96px"}
            },{
                text: "添加时间",
                name: "create_time",
                style: {'text-align': "center",'width':"160px"}
            }];
            $scope.auditColumns = [{
                text: "子分类名称",
                name: "group_name",
                style: {'text-align': "left",'width':'auto','padding':'0 16px'}
            },{
                text: "添加人",
                name: "user_name",
                style: {'text-align': "left"}
            },{
                text: "状态",
                name: "is_apply",
                style: {'width': "96px"}
            }];
            $scope.audit_list = [];
            $scope.tobe_audit_list = [];
            $scope.auditNoSelection = true;
            $scope.tobeAuditMultiple = true;
            $scope.tobeAuditNoRowSelection = true;
            $scope.mode = 0;
            $scope.tableData = [];
            $scope.loading = true;
            $scope.cat_list = [{
                cat_id: '',
                cat_name: '全部分类'
            }];
            $scope.cat_apply_list = [];
            $scope.currentCat = $scope.cat_list[0];
            $scope.currentApplyCat = {};
            $scope.checkKeyword = "";
            $scope.uncheckKeyword = "";
            let initQ = $rootScope.ajax("cat_group_init").then(data=>{
                $scope.role_list = data.role_list;
                $scope.cat_list = $scope.cat_list.concat(data.cat_list);
                $scope.currentCat = $scope.cat_list[0];
                return data;
            });

            let initApplyQ = $rootScope.ajax("cat_group_apply_init").then(data=>{
                $scope.cat_apply_list = data.cat_list;
                if ($scope.cat_apply_list.length > 0){
                    $scope.currentApplyCat = $scope.cat_apply_list[0];
                };
                return data;
            });

            $q.all([initQ, initApplyQ]).finally(()=>{$scope.loading = false;});

            $scope.selectCat = (cat) => {
                $scope.currentCat = {
                    cat_id: cat.cat_id,
                    cat_name: cat.cat_name
                };
                $scope.research();
            }

            $scope.reset = ()=>{
                $scope.keyword = "";
                $scope.currentCat = $scope.cat_list[0];
                $scope.currentApplyCat = {};
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                $scope.total = 10;
                $scope.checked_list = [];
                $scope.unchecked_list = [];
            }

            $scope.searcher = (index, size) => {
                if($scope.refreshing){return;}
                $scope.refreshing = true;
                var previous = $scope.tableData && $scope.tableData._select ;
                return initQ.then(()=>{
                    return $rootScope.ajax("cat_group_list", {
                        pageindex: index ? index : $scope.pageIndex,
                        pagesize: size ? size : $scope.pageSize,
                        cat_id: $scope.currentCat.cat_id,
                        group_name: $scope.keyword
                    }, (data)=> {
                        if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                            $scope.tableData = data.data_list;
                            if($scope.tableData && $scope.tableData[0]){
                                if(previous){
                                    $scope.tableData._select = [].concat.apply([],$scope.tableData.map(r=>((previous.group_id == r.group_id)?[r]:[])))[0]
                                } else {
                                    $scope.tableData._select = $scope.tableData[0]
                                }
                            }
                            $scope.total = data.list_count;
                        } else {
                            $rootScope.alert(data.msg);
                            $scope.total = 0;
                        }
                    }, ()=> {
                        $scope.total = 0;
                    }).finally(()=>{
                        $scope.refreshing = false;
                    });
                });
            }

            $scope.research = ()=>{
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
            }

            $scope.canCreateCategory = ()=>$scope.role_list && ($scope.role_list.btnInsert == "1");
            $scope.canUpdateCategory = ()=>$scope.tableData._select && $scope.role_list && ($scope.role_list.btnUpdate == "1");
            $scope.canDeleteCategory = ()=>$scope.tableData._select && $scope.role_list && ($scope.role_list.btnDelete == "1");
            $scope.canManageCategory = ()=>$scope.role_list && ($scope.role_list.btnApply == "1");
            $scope.canOperateCategory = ()=>$scope.tableData._select;

            $scope.deleteCat = (group)=>{
                return $rootScope.confirm("请确认是否要删除子分类？", ()=>{
                    if($scope.refreshing){return;}
                    $scope.refreshing = true;
                    return $rootScope.ajax("cat_group_del", {group_id: group.group_id}, (data)=> {
                        $scope.research();
                        $rootScope.alert("删除成功");
                    }).finally(()=>{$scope.refreshing = false;});
                });
            }

            $scope.back = ()=>{
                $scope.mode = 0;
            }

            let getCheckedQ = ()=>$rootScope.ajax("cat_group_checked",{
                    cat_id: $scope.currentApplyCat.cat_id
                }).then(data=>{
                    $scope.check_list = data.data_list;
                    return data;
                }), getUncheckedQ = ()=>$rootScope.ajax("cat_group_unchecked",{
                    cat_id: $scope.currentApplyCat.cat_id
                }).then(data=>{
                    $scope.uncheck_list = data.data_list;
                    if($scope.uncheck_list && $scope.uncheck_list.length ){
                        for(let i = 0;i<$scope.uncheck_list.length;i++){
                            let r = $scope.uncheck_list[i];
                            // apply_status 0：未申请   1：申请中
                            r._locked = (r.apply_status == "1");
                        }
                    }
                    return data;
                }),checkQ, uncheckQ;

            $scope.manageCat = ()=>{
                if ($scope.refreshing) return;
                if (!Array.isArray($scope.cat_apply_list) || $scope.cat_apply_list.length == 0){
                    return $rootScope.alert("当前供应商没有已存在的API分类，请先申请分类");
                }
                $scope.refreshing = true;
                initApplyQ.then(()=>{
                    $scope.mode = 1;
                    checkQ = getCheckedQ().then(data=>{$scope.audit_list = $scope.check_list;return data;});
                    uncheckQ = getUncheckedQ().then(data=>{$scope.tobe_audit_list = $scope.uncheck_list;return data;});
                    $q.all([checkQ,uncheckQ]).finally(()=>{$scope.refreshing = false;})
                });
            }

            $scope.checkResearch = ()=>{
                return checkQ.then(()=>{
                    $scope.audit_list = [].concat.apply([],$scope.check_list.map(r=>((r.group_name.indexOf($scope.checkKeyword) != -1)?[r]:[])));
                    return $scope.audit_list
                });
            }

            $scope.uncheckResearch = ()=>{
                return uncheckQ.then(()=>{
                    $scope.tobe_audit_list = [].concat.apply([],$scope.uncheck_list.map(r=>((r.group_name.indexOf($scope.uncheckKeyword) != -1)?[r]:[])));
                    return $scope.tobe_audit_list
                });
            }

            $scope.selectApplyCat = (cat) => {
                $scope.currentApplyCat = {
                    cat_id: cat.cat_id,
                    cat_name: cat.cat_name
                };
                $scope.refreshing = true;
                checkQ = getCheckedQ().then(data=>{$scope.audit_list = $scope.check_list;return data;});
                uncheckQ = getUncheckedQ().then(data=>{$scope.tobe_audit_list = $scope.uncheck_list;return data;});
                $q.all([checkQ,uncheckQ]).finally(()=>{$scope.refreshing = false;})
            }

            $scope.applyCat = ()=>{
                let list = [].concat.apply([],$scope.tobe_audit_list.map(r=>(r._checked?[{group_id:r.group_id}]:[])));
                if(!list.length){$rootScope.alert("请选择一条子分类");return;};
                if($scope.refreshing){return}
                $scope.refreshing = true;
                return $rootScope.ajax("cat_group_apply",{group_list: list, cat_id: $scope.currentApplyCat.cat_id}).then(()=>{
                    checkQ = getCheckedQ().then(data=>{$scope.audit_list = $scope.check_list;return data;});
                    uncheckQ = getUncheckedQ().then(data=>{$scope.tobe_audit_list = $scope.uncheck_list;return data;});;
                    return $q.all([checkQ,uncheckQ])
                }).finally(()=>{$scope.refreshing = false});
            }


            let CatGroupController = (scope,cat_list,detail)=> {
                scope.cat_list = cat_list;
                scope.detail = detail;
                scope.chooseType = type=>(scope.detail.cat_type=type);
                if(cat_list && cat_list.length){
                    let originalType = [].concat.apply([],cat_list.map(r=>((r.cat_id == detail.cat_id)?[r]:[])))[0];
                    scope.chooseType(originalType || cat_list[0]);
                }

                scope.save = ()=>{
                    if(scope.refreshing){return;}
                    if (scope.catGroupForm.$invalid) {
                        scope.catGroupForm.$error.required && scope.catGroupForm.$error.required.forEach(r => {r.$setDirty(true);});
                        scope.catGroupForm.$error.validUnicodeLength && scope.catGroupForm.$error.validUnicodeLength.forEach(r => {r.$setDirty(true);});
                        scope.catGroupForm.$error.maxlength && scope.catGroupForm.$error.maxlength.forEach(r => {r.$setDirty(true);});
                        scope.error = "请检查输入是否正确";
                        return;
                    }
                    scope.refreshing = true;
                    return $http.post('/agent', {
                        module: "application",
                        partial: $rootScope.tab,
                        api: "cat_group_save",
                        param: {
                            cat_id: scope.detail.cat_type.cat_id,
                            group_name: scope.detail.group_name,
                            group_name_en: scope.detail.group_name_en,
                            group_title: scope.detail.group_title,
                            group_title_en: scope.detail.group_title_en,
                            group_desc: scope.detail.group_desc,
                            group_desc_en: scope.detail.group_desc_en,
                            group_id: scope.detail.group_id
                        }
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            scope.detail && scope.detail.cat_id?$scope.searcher($scope.pageIndex,$scope.pageSize):$scope.reset();
                            scope.close();
                            return;
                        } else {
                            scope.error = body.data.msg;
                            return $q.reject(body.data.msg);
                        }
                    }, why => {
                        scope.error = why;
                        return $q.reject(why);
                    }).finally(()=>{scope.refreshing = false;});
                }
                scope.close = () => {
                    return $mdDialog.hide();
                };
            };

            $scope.showCat = (ev,row)=>{
                if($scope.refreshing){return $q.reject();}
                $scope.refreshing = true;
                return $rootScope.ajax("save_group_init",{group_id:row?row.group_id:undefined}).then(data=>{
                    if (!data || !data.cat_list || !Array.isArray(data.cat_list) || data.cat_list.length == 0){
                        return $rootScope.alert("当前供应商没有已存在的API分类，请先添加分类");
                    }
                    $mdDialog.show({
                        controller: CatGroupController,
                        template:
                            `
                            <md-dialog aria-label="邮箱报警设置" class="form" aria-describedby="quick edit">
                                <md-toolbar>
                                    <div class="md-toolbar-tools">
                                        <md-icon md-svg-icon="navigation:ic_apps_24px"></md-icon>
                                        <h3><span ng-bind="detail.group_id?'修改子分类':'添加子分类'"></span></h3>
                                        <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">
                                            <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>
                                        </md-button>
                                    </div>
                                </md-toolbar>
                            
                                <md-dialog-content>
                                    <form class="md-dialog-content" name="catGroupForm" ng-submit="saveMail()" autocomplete="off">
                                        <div class="input-container">
                                            <label style="width: 108px;">分类类型</label>
                                            <md-menu class="md-dropdown cool" md-offset="1 50" >
                                                <md-button ng-click="$mdOpenMenu($event)" class="md-raised md-primary md-hue-1" md-theme="dracular" aria-label="data control" ng-disabled="detail.group_id">
                                                    <span ng-bind="detail.cat_type.cat_name"></span>
                                                    <md-icon class="" md-svg-icon="navigation:ic_arrow_drop_down_24px"></md-icon>
                                                </md-button>
                                                <md-menu-content class="md-dropdown-content cool" style="width: 264px">
                                                    <md-menu-item ng-repeat="cat in cat_list"><md-button ng-click="chooseType(cat)">{{cat.cat_name}}</md-button></md-menu-item>
                                                </md-menu-content>
                                            </md-menu> 
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类名称</label>
                                            <input type="text" name="group_name" placeholder="请填写子分类名称" ng-model="detail.group_name" required maxlength="200" unicode-length-validator/>
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类名称（英文）</label>
                                            <input type="text" name="group_name_en" placeholder="请填写子分类名称（英文）" ng-model="detail.group_name_en" required maxlength="200" unicode-length-validator/>
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类简介</label>
                                            <input type="text" name="group_title" placeholder="请填写子分类简介" ng-model="detail.group_title" required maxlength="200" unicode-length-validator/>
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类简介（英文）</label>
                                            <input type="text" name="group_title_en" placeholder="请填写子分类简介（英文）" ng-model="detail.group_title_en" required maxlength="200" unicode-length-validator/>
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类描述</label>
                                            <input type="text" name="group_desc" placeholder="请填写子分类描述" ng-model="detail.group_desc" required maxlength="1000" unicode-length-validator/>
                                        </div>
                                        <div class="input-container">
                                            <label style="width: 108px;">子分类描述（英文）</label>
                                            <input type="text" name="group_desc_en" placeholder="请填写子分类描述（英文）" ng-model="detail.group_desc_en" required maxlength="1000" unicode-length-validator/>
                                        </div>
                                       
                                    </form>
                                    <div class="app-loading" ng-if="refreshing">
                                        <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                                    </div>
                                </md-dialog-content>
                                
                                <md-dialog-actions layout="row">
                                    <div class="message" ng-if="error">
                                        <span ng-bind="error"></span>
                                    </div>
                                    <md-button ng-click="save()" type="submit">保存</md-button>
                                </md-dialog-actions>
                            </md-dialog>                          `,
                        parent: angular.element("body>section>md-content"),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {cat_list:data.cat_list,detail:data.group_data}
                    });
                }).finally(()=>{$scope.refreshing = false;});
            };


            $scope.reset();

            $scope.$watch(()=>{
                var el = angular.element("#cat-group-audit-main");
                return el && el[0] ?el.width():0;
            }, width=>{
                $scope.scrollerStyle = {'width':`${(width/2 - 8)}px`};
                $timeout(()=>{
                    var el = angular.element("#cat-group-audit-main");
                    el && el[0] && ($scope.scrollerStyle = {'width':`${(el.width()/2 - 8)}px`});
                },500);
            })

            $scope.injectorLoaded = true;
            window.test = $scope;
        }];
});
