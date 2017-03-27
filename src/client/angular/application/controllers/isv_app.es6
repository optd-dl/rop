/**
 * Created by robin on 22/11/2016.
 */
define(['../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$http', '$mdDialog',
        ($rootScope, $scope, $q, $http, $mdDialog) => {
            $rootScope.tab = "isv_app";

            let getUserList = ()=>{
                return $rootScope.ajax("list_init").then(data=>{
                    $scope.user_list = data.data_list;
                });
            }, userListQ = getUserList();

            $scope.columns = [{
                text: "开发者名称",
                name: "user_name",
                style: {'text-align': "left"}
            },{
                text: "应用名称",
                name: "app_name",
                selector: (row)=>{$scope.viewApp(row)},
                style: {'text-align': "left"}
            },{
                text: "APPKey",
                name: "appkey",
                style: {'text-align': "left"}
            },{
                text: "添加时间",
                name: "create_time",
                style: {'text-align': "center",'width':"160px"}
            }];

            $scope.chooseUser = user=>userListQ.then(()=>{
                $scope.userChoosen = user;
                $scope.research();
            });
            $scope.searcher = (index, size) => {
                if($scope.refreshing){return;}
                $scope.refreshing = true;
                return $rootScope.ajax("list_get", {
                    pageindex: index ? index : $scope.pageIndex,
                    pagesize: size ? size : $scope.pageSize,
                    app_key: $scope.keyword,
                    search_status:$scope.search_status,
                    isv_user_id:$scope.userChoosen?$scope.userChoosen.user_id:""
                }, (data)=> {
                    if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                        $scope.tableData = data.data_list;
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
            }
            $scope.toggleTODO = ()=>{
                if($scope.search_status == "0"){
                    $scope.search_status = "1";
                } else {
                    $scope.search_status = "0";
                }
                $scope.research();
            }
            $scope.viewApp = (app)=>{
                if($scope.refreshing){return;}
                $scope.refreshing = true;
                return $rootScope.ajax("api_init", {
                    app_id: app?app.app_id:""
                }).then(data=>{
                    $scope.appSelected = angular.extend({},data,app);
                    if($scope.search_status == "1"){
                        var firstItem = [].concat.apply([],$scope.appSelected.status_list.map(r=>(r.status_id == "0")?[r]:[]))[0];
                        $scope.appSelected.statusChoosen = firstItem;
                    }
                    $scope.appSelected.sorter = {name:"",sort:"1"};
                    $scope.refreshing = false;
                    $scope.apiReset();
                },()=>{
                    $scope.refreshing = false;
                });
            }
            $scope.research = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
            }
            $scope.reset = ()=>{
                $scope.multiple = false;
                $scope.appSelected = undefined;
                $scope.search_status = "0";
                $scope.userChoosen = undefined;
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                $scope.tableData = [];
                $scope.keyword = "";
            }

            $scope.reset();


            $scope.chooseCat = cat => {
                if($scope.refreshing){return;}
                $scope.appSelected.catChoosen = cat;
                $scope.apiResearch();
            }
            $scope.chooseStatus = status => {
                if($scope.refreshing){return;}
                $scope.appSelected.statusChoosen = status;
                $scope.apiResearch();
            }
            $scope.apiColumns = [
                {text: "API名称", name: "api_name", tooltip: true, sort: "1",linker:{create:row=>{return `${Constant.protocol}://${Constant.host}:${Constant.port}/api/ApiPreview-${row.api_id}.html`}, target:"_blank"}},
                {text: "状态",name: "status_name",style: {'text-align': "center",'width':"96px"}},
                {text: "描述",name: "api_title",style: {'text-align': "left"}}];
            $scope.apiReset = ()=>{
                if($scope.appSelected){
                    $scope.apiPageIndex = 1;
                    $scope.apiPageSize = new Number(10);
                    $scope.apiTableData = [];
                    $scope.apiMultiple = true;
                }
            }
            /*$scope.canAPIProcess = ()=>{
                var unauditList = [].concat.apply([],$scope.apiTableData.map(r=>(r._checked && (r.status_id == "0"))?[r]:[])),
                    auditList = [].concat.apply([],$scope.apiTableData.map(r=>(r._checked && (r.status_id == "1"))?[r]:[]));
                unauditList
               默认全部都为复选
               1. 当用户选择多条都是已审核状态的api时，操作栏置灰，不能操作
               2. 当用户选择单条已审核状态的api时，操作栏只有 "解除审核" 操作
               3. 当用户选择多条都是未审核状态的api时，操作栏只有 "审核" 操作
               4. 当用户选择单条未审核状态的api时，操作栏有 "审核"，"删除" 操作
               5. 当用户选择多条既有未审核状态又有已审核状态的api时，操作栏置灰，不能操作
            }*/
            $scope.canAPIAudit = ()=>{
                var checkedList = [].concat.apply([],$scope.apiTableData.map(r=>(r._checked && (r.status_id == "0"))?[r]:[]));
                return checkedList.length && (checkedList.length == [].concat.apply([],$scope.apiTableData.map(r=>r._checked?[r]:[])).length);
            }
            $scope.canAPICancel = ()=>{
                var checkedList = [].concat.apply([],$scope.apiTableData.map(r=>(r._checked && (r.status_id == "1"))?[r]:[]));
                return checkedList[0] && ([].concat.apply([],$scope.apiTableData.map(r=>r._checked?[r]:[])).length == 1);
            }
            $scope.canAPIDelete = ()=>{
                var checkedList = [].concat.apply([],$scope.apiTableData.map(r=>(r._checked && (r.status_id == "0"))?[r]:[]));
                return checkedList[0] && ([].concat.apply([],$scope.apiTableData.map(r=>r._checked?[r]:[])).length == 1);
            }
            $scope.auditAPI = (ev)=>{
                if($scope.refreshing){return;}
                $rootScope.confirm("确定要审核选中的API吗？", ()=> {
                    $scope.refreshing = true;
                    /*return $rootScope.ajax("api_audit", {
                        app_id: $scope.appSelected ? $scope.appSelected.app_id:"",
                        api_list:[].concat.apply([],$scope.apiTableData.map(r=>r._checked?[{api_id:r.api_id}]:[]))
                    }).then(()=>{
                        $scope.refreshing = false;
                        $scope.apiSearcher();
                    },()=>{
                        $scope.refreshing = false;
                    });*/
                    return $http.post('/agent', {
                        module: "application",
                        partial: $rootScope.tab,
                        api: "api_audit",
                        param: {
                            app_id: $scope.appSelected ? $scope.appSelected.app_id:"",
                            api_list:[].concat.apply([],$scope.apiTableData.map(r=>r._checked?[{api_id:r.api_id}]:[]))
                        }
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $scope.refreshing = false;
                            $scope.apiSearcher();
                        } else {
                            $scope.refreshing = false;
                            if(body.data.sub_msg){
                                showUAT(ev, body.data.sub_msg.uat_list)
                            }
                        }
                    }, why => {
                        $scope.refreshing = false;
                        $rootScope.alert(why);
                    });
                });
            }
            $scope.cancelAPI = ()=>{
                if($scope.refreshing){return;}
                $rootScope.confirm("确定要解除审核该API吗？", ()=> {
                    $scope.refreshing = true;
                    return $rootScope.ajax("api_cancel", {
                        app_id: $scope.appSelected ? $scope.appSelected.app_id:"",
                        api_id: [].concat.apply([],$scope.apiTableData.map(r=>r._checked?[r.api_id]:[]))[0]
                    }).then(()=>{
                        $scope.refreshing = false;
                        $scope.apiSearcher();
                    },()=>{
                        $scope.refreshing = false;
                    });
                });
            }
            $scope.deleteAPI = ()=>{
                if($scope.refreshing){return;}
                $rootScope.confirm("确定要删除选中的API吗？", ()=> {
                    $scope.refreshing = true;
                    return $rootScope.ajax("api_delete", {
                        app_id: $scope.appSelected ? $scope.appSelected.app_id:"",
                        api_id: [].concat.apply([],$scope.apiTableData.map(r=>r._checked?[r.api_id]:[]))[0]
                    }).then($scope.apiResearch).finally(()=>{
                        $scope.refreshing = false;
                    });
                });
            }
            $scope.apiSearcher = (index, size) => {
                if($scope.refreshing){return;}
                $scope.refreshing = true;
                return $rootScope.ajax("api_get", {
                    pageindex: index ? index : $scope.apiPageIndex,
                    pagesize: size ? size : $scope.apiPageSize,
                    app_id: $scope.appSelected?$scope.appSelected.app_id:"",
                    cat_id:$scope.appSelected.catChoosen?$scope.appSelected.catChoosen.cat_id:"",
                    status:$scope.appSelected.statusChoosen?$scope.appSelected.statusChoosen.status_id:"",
                    sort_name:$scope.appSelected.sorter.name,
                    sort_flag:$scope.appSelected.sorter.sort
                }, (data)=> {
                    if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                        $scope.apiTableData = data.data_list;
                        $scope.apiTotal = data.list_count;
                    } else {
                        $rootScope.alert(data.msg);
                        $scope.apiTotal = 0;
                    }
                }, ()=> {
                    $scope.apiTotal = 0;
                }).finally(()=>{
                    $scope.refreshing = false;
                });
            }
            $scope.apiResearch = () => {
                $scope.apiPageIndex = 1;
                $scope.apiPageSize = new Number(10);
            }
            $scope.exit=()=>{
                // 由于ngif 特性，应用列表画面会刷新
                $scope.appSelected = undefined;
            };

            let UATController = (scope, uat_list)=> {
                scope.uat_list = uat_list;
                scope.columns = [{
                    text: "环境名称",
                    name: "ename",
                    style: {'text-align': "center",'width':'320px'}
                }];
                scope.send = () => {
                    if(scope.refreshing){return;}
                    if(!scope.uat_list._select || !scope.uat_list._select.eid){scope.error="请选择环境";return;}
                    scope.refreshing = true;
                    return $http.post('/agent', {
                        module: "application",
                        partial: $rootScope.tab,
                        api: "api_audit",
                        param: {
                            app_id: $scope.appSelected ? $scope.appSelected.app_id:"",
                            api_list:[].concat.apply([],$scope.apiTableData.map(r=>r._checked?[{api_id:r.api_id}]:[])),
                            eid: scope.uat_list._select.eid
                        }
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            return scope.close();
                        } else {
                            scope.error = body.data.msg;
                            return $q.reject(body.data.msg);
                        }
                    }, why => {
                        scope.error = why;
                        return $q.reject(why);
                    }).then(()=>{$scope.apiSearcher();}).finally(()=>{scope.refreshing = false;});
                }
                scope.close = () => {
                    return $mdDialog.hide()
                };
            }, showUAT = (ev, uat_list)=>{
                return $mdDialog.show({
                    controller: UATController,
                    template: `
                                <md-dialog aria-label="API审核" class="reminder" aria-describedby="API审核">
                                    <md-toolbar>
                                        <div class="md-toolbar-tools">
                                            <h3><span>API审核</span></h3>
                                            <md-icon class="" md-svg-icon="action:ic_info_24px">
                                                <md-tooltip md-direction="down">初次审核API时，应指定API的使用环境</md-tooltip>
                                            </md-icon>
                                            <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">
                                                <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>
                                            </md-button>
                                        </div>
                                    </md-toolbar>
                                
                                    <md-dialog-content>
                                        <div class="md-dialog-content" >
                                            <div class="table-wrapper">
                                                <rop-fixed-table cols="columns" data="uat_list"/>
                                                 <div class="app-loading" ng-if="refreshing">
                                                    <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                                                </div>
                                            </div>
                                        </div>
                                    </md-dialog-content>
                                    
                                    <md-dialog-actions layout="row">
                                        <div class="message" ng-if="error">
                                            <span ng-bind="error"></span>
                                        </div>
                                      <md-button ng-click="send()">确定</md-button>
                                    </md-dialog-actions>
                                </md-dialog>
                            `,
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    parent: angular.element(document.querySelector('body>section>md-content')),
                    locals: {uat_list: uat_list}
                });
            }

            $scope.injectorLoaded = true;
            window.test = $scope;
            window.test1 = showUAT;
        }];
});
