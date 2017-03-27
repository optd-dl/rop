/**
 * Created by robin on 22/11/2016.
 */
define([], function () {
    'use strict';
    return ['$rootScope', '$scope', '$http','$stateParams', '$location', '$mdDialog', '$q',
        ($rootScope, $scope, $http, $stateParams, $location, $mdDialog, $q) => {
            $rootScope.tab = "domain";

            // TODO 石奇峰邀请您来维护以下代码，以下代码分为4大部分，domain列表操作部，domain修改部，domain排序部, 1个页内弹窗,日志
            $scope.mode = 0;
            $scope.enterMode = (mode, cb)=> {
                $scope.mode = mode;
                cb && cb.call();
            }
            $scope.exitMode = (cb)=> {
                $scope.mode = 0;
                cb && cb.call();
            }
            $scope.toggleFilterPanel = (e)=> {
                $scope.showFilterPanel = !$scope.showFilterPanel;
                $scope.showBatchPanel = false;
            }

            // 主页面的功能数据
            $scope.panelSelection = {};
            let initCat = {cat_id: "", cat_name: "全部分类"}, initGroup = {
                group_id: "",
                group_name: ""
            }, initStatus = {status_id: "", status_name: "全部状态"};
            $scope.reset = ()=> {
                $scope.panelSelection.panelCat = {cat_id: "", cat_name: "全部分类"};
                $scope.panelSelection.panelCatGroup = {group_id: "",group_name: ""};
                $scope.panelSelection.panelStatus = initStatus;
                $scope.panelSelection.sorter = {name: "", sort: "1"};
                $scope.columns = [{text: "结构名称", name: "domain_name", tooltip: true, sort: "1"}, {
                    text: "结构标题",
                    name: "domain_title",
                    tooltip: true
                }, {text: "结构类型", name: "cat_name", style: {width: "128px", 'text-align': "center"}}, {
                    text: "状态",
                    name: "status_name",
                    style: {width: "96px", 'text-align': "center"}
                }, {
                    text: "是否上线",
                    name: "online_flag",
                    formatter: flag=>{return (flag == "1")?"已上线":"未上线"},
                    style: {width: "128px", 'text-align': "center"}
                }, {
                    text: "添加时间",
                    name: "create_time",
                    sort: "1",
                    style: {width: "160px", 'text-align': "center"}
                }];
                $scope.keyword = "";
                $scope.batch = false;
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                //$scope.searcher();
            }
            $scope.reset();
            $scope.chooseCat = (cat, group)=> {
                $scope.panelSelection.panelCat = cat ? cat : {cat_id: "", cat_name: "全部分类"};
                $scope.panelSelection.panelCatGroup = group ? group : initGroup;
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                //$scope.searcher();
            }
            $scope.chooseStatus = (status)=> {
                $scope.panelSelection.panelStatus = status ? status : {status_id: "", status_name: "全部状态"};;
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                //$scope.searcher();
            }
            //$scope.pageSize = 10;
            $scope.searcher = (index, size) => {
                if($scope.refreshing){return};
                $scope.refreshing = true;
                return $rootScope.ajax("domain_list", {
                    pageindex: index ? index : $scope.pageIndex,
                    pagesize: size ? size : $scope.pageSize,
                    domain_name: $scope.keyword,
                    cat_id: $scope.panelSelection.panelCat.cat_id,
                    group_id: $scope.panelSelection.panelCatGroup.group_id,
                    status: $scope.panelSelection.panelStatus.status_id,
                    sort_name: ($scope.panelSelection.sorter.name == "create_time")?"rx_insertTime":$scope.panelSelection.sorter.name,
                    sort_flag: $scope.panelSelection.sorter.sort,
                }, (data)=> {
                    if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                        $scope.tableData = data.data_list;
                        $scope.total = data.list_count;
                    } else {
                        $rootScope.alert(data.msg);
                        $scope.total = 0;
                    }
                }, ()=>{
                    $scope.total = 0;
                }).finally(()=>{
                    $scope.refreshing = false;
                });
            }
            $scope.tableData = [];
            $scope.research = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
            }
            let mainQ = $rootScope.ajax("init", (data)=> {
                $scope.originalPanel = JSON.parse(JSON.stringify(data));
                $scope.panel = data;
            });
            $scope.canVisistDomain = ()=> {
                return $scope.tableData && $scope.tableData._select
            };
            $scope.canInsertDomain = ()=> {
                return $scope.panel && ($scope.panel.role_list.btnInsert == "1")
            };
            $scope.canUpdateDomain = (domain)=> {
                if (!domain || ($scope.panel && ($scope.panel.role_list.btnUpdate == "0")) || (domain.is_old == "1")) {
                    return false
                }
                // 流程已变化，任何状态下都可修改
                return true;
                //return ((domain.status == "0") || (domain.status == "2") || (domain.status == "3"));
            }
            $scope.canApplyPromoteDomain = (domain)=> {
                if (!domain || ($scope.panel && ($scope.panel.role_list.btnApply == "0")) || (domain.is_old == "1")) {
                    return false
                }
                // 由于申请修改状态已被废弃，故撤销申请修改下申请上线的操作
                return ((domain.status == "2") || (domain.status == "5"));
                //return ((domain.status == "1") || (domain.status == "5"));
            }
            $scope.canRecallDomain = (domain)=> {
                if (!domain || ($scope.panel && ($scope.panel.role_list.btnCancel == "0")) || (domain.cancel_flag == "0") || (domain.is_old == "1")) {
                    return false
                }
                return ((domain.status == "2") || (domain.status == "4") || (domain.status == "5"));
            }
            $scope.canDeleteDomain = (domain)=> {
                if (!domain || ($scope.panel && ($scope.panel.role_list.btnDelete == "0")) || (domain.is_old == "1")) {
                    return false
                }
                return true;
            }
            $scope.deleteDomain = ($event,row) => {
                if(row.names && row.names.length) {
                    let InuseController = (scope, $mdDialog, apis)=> {
                        scope.apis = apis;
                        let hasAPI = false, hasDomain = false;
                        scope.apis && scope.apis.length && scope.apis.forEach(r=>{r&&r.name&&((r.name.indexOf(".") == -1)?(hasDomain=true):(hasAPI=true))});
                        if(hasAPI){
                            if(hasDomain){
                                scope.hint = "有如下API和其他结构正在使用该结构";
                            } else {
                                scope.hint = "有如下API正在使用该结构";
                            }
                        } else if(hasDomain){
                            scope.hint = "有其他结构正在使用该结构";
                        } else {
                            scope.hint = "有如下对象正在使用该结构";
                        }
                        scope.closeDialog = () => {$mdDialog.hide()};
                    },  showInuse = (apis) => {
                        $mdDialog.show({
                            controller: InuseController,
                            template: `<md-dialog aria-label="Mango (Fruit)" style="width: 512px">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-body">
                                        <p>操作失败</p>
                                        <p ng-bind="hint"></p>
                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>
                                        <p>请取消关联后再删除</p>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="closeDialog()">确定</md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                            targetEvent: $event,
                            /*parent: angular.element(document.body),*/
                            parent: angular.element(document.querySelector('body>section>md-content')),
                            //clickOutsideToClose: true,
                            locals: {apis: row.names}
                        });
                    };
                    showInuse(row.names);
                    return ;
                }
                return $rootScope.confirm("请确认是否要删除结构？", ()=>{
                    return $rootScope.ajax("domain_delete", {domain_id: row.domain_id}, (data)=> {
                        $scope.research();
                    });
                });
            }
            $scope.applyDomain = (row,status) => {
                // 该接口只有0 申请修改， 1 申请上线 2种
                return $rootScope.ajax("domain_apply", {domain_id: row.domain_id,apply_status: status}, (data)=> {
                    $scope.searcher();
                    $rootScope.alert("操作成功");
                    return data;
                });
            }
            $scope.cancelDomain = (row) => {
                return $rootScope.ajax("domain_cancel", {domain_id: row.domain_id}, (data)=> {
                    $scope.searcher();
                    $rootScope.alert("撤销成功");
                });
            }
            /*$scope.dumpDomain = ()=> {
             return $rootScope.ajax("domain_dump", {api_id: row.domain_id}, (data)=> {
             $scope.research();
             $rootScope.alert("废弃成功");
             });
             }*/


            // 模式1，修改，添加domain的功能数据
            let initialUpdaterDomain = {
                domain_name: "",
                domain_rank:"0",
                domain_title:"",
                domain_title_en:"",
                domain_desc:"",
                domain_desc_en:"",
                property: [{}, {}, {}, {}, {}]
            }, initialSteps = [{name: "基本信息"}, {name: "属性信息"}], initialClientSteps = [{name: "基本信息"}, {name: "错误代码"}],initDomainQ;
            $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
            $scope.camelCharcodes = [...[...Array(26).keys()].map(r=>{return r + 65})];
            $scope.step = 0;
            $scope.steps = initialSteps;
            $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
            $scope.initDomain = (row) => {
                return $rootScope.ajax("domain_init", {}, (data)=> {
                    $scope.domainInit = data;
                    if ($scope.domainInit && $scope.domainInit.cat_list && $scope.domainInit.cat_list[0]) {
                        initCat = $scope.domainInit.cat_list[0];
                        if ($scope.domainInit.cat_list[0].group_list && $scope.domainInit.cat_list[0].group_list[0]) {
                            initGroup = $scope.domainInit.cat_list[0].group_list[0];
                        }
                    } else {
                        return $q.reject("该账号暂无任何可操作的API分类，请完成审核流程并添加API分类")
                    }
                });
            };
            initDomainQ = $scope.initDomain();
            $scope.addDomainMode = (mode) => {
                initDomainQ && initDomainQ.then(data=> {
                    $scope.mode = mode;
                    $scope.updaterSelection.panelCat = initCat;
                    $scope.updaterSelection.panelCatGroup = initGroup;
                    ($scope.step != 0) && ($scope.step = 0);
                    $scope.steps = initialSteps;
                    $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                        $scope.propertyDataTypes = data.data_type_list
                    });
                },e=>{$rootScope.alert(e)});
            }
            $scope.updateDomainMode = ($event,forView) => {
                $scope.updaterDomain.domain_id = "fake";
                if (!$scope.tableData._select || !$scope.tableData._select.domain_id) {
                    $rootScope.alert("用户没有选择一条结构");
                    return;
                }
                let updater = ()=>{
                    return initDomainQ && initDomainQ.then(data=> {
                            if (!$scope.domainInit || !$scope.domainInit.cat_list) {
                                $rootScope.alert("结构没有分类信息");
                                return;
                            }
                            return $rootScope.ajax("domain_info", {domain_id: $scope.tableData._select.domain_id}, (data)=> {
                                $scope.mode = 1;
                                $scope.steps = initialSteps;
                                ($scope.step != 0) && ($scope.step = 0);
                                $scope.originalUpdaterDomain = JSON.parse(JSON.stringify(data.domain_info));
                                angular.extend($scope.updaterDomain,data.domain_info);
                                forView && ($scope.updaterDomain._forView = forView);
                                $scope.updaterSelection.panelCat = [].concat.apply([], $scope.domainInit.cat_list.map(r=> {
                                    return (r.cat_id == $scope.updaterDomain.cat_id) ? [r] : []
                                }))[0];
                                (!$scope.updaterSelection.panelCat || !$scope.updaterSelection.panelCat.cat_id) && ($scope.updaterSelection.panelCat = initCat);
                                $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                                    $scope.propertyDataTypes = data.data_type_list
                                });
                            })
                        });
                },  InuseController = (scope, $mdDialog, apis)=> {
                    scope.apis = apis;
                    let hasAPI = false, hasDomain = false;
                    scope.apis && scope.apis.length && scope.apis.forEach(r=>{r&&r.name&&((r.name.indexOf(".") == -1)?(hasDomain=true):(hasAPI=true))});
                    if(hasAPI){
                        if(hasDomain){
                            scope.hint = "有如下API和其他结构正在使用该结构";
                        } else {
                            scope.hint = "有如下API正在使用该结构";
                        }
                    } else if(hasDomain){
                        scope.hint = "有其他结构正在使用该结构";
                    } else {
                        scope.hint = "有如下对象正在使用该结构";
                    }
                    scope.loadidng = false;
                    scope.confirmUpdate = () => {
                        scope.loadidng = true;
                        // 后台更新和详情获取可以同时进行
                        $rootScope.ajax("domain_status_apply", {domain_id: $scope.tableData._select.domain_id}, updater).then(()=>{$scope.searcher();}).then(()=>{
                            scope.loadidng = false;
                            $mdDialog.hide();
                        });
                    };
                    scope.closeDialog = () => {
                        $scope.updaterDomain.domain_id = "";
                        $mdDialog.hide()
                    };
                },  showInuse = (apis) => {
                    $mdDialog.show({
                        controller: InuseController,
                        template: `<md-dialog aria-label="Mango (Fruit)" style="width: 512px">
                                <md-dialog-content class="md-dialog-content">
                                    <div class="md-dialog-content-body">
                                        <md-progress-circular md-mode="indeterminate" ng-show="loadidng" class="md-primary" style="position:absolute;top: 16px;left: 16px;"></md-progress-circular>
                                        <p ng-bind="hint"></p>
                                        <p ng-repeat="api in apis" ng-bind="api.name"></p>
                                        <p>您确认要进行修改吗</p>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row">
                                  <md-button ng-click="closeDialog()">取消</md-button>
                                  <md-button ng-click="confirmUpdate()">确定</md-button>
                                </md-dialog-actions>
                            </md-dialog>`,
                        targetEvent: $event,
                        /*parent: angular.element(document.body),*/
                        parent: angular.element(document.querySelector('body>section>md-content')),
                        //clickOutsideToClose: true,
                        locals: {apis: apis}
                    });
                };

                if(forView){
                    updater.call();
                    return;
                }
                if($scope.tableData._select){
                    if($scope.tableData._select.status == "0"){
                        if($scope.tableData._select.names && $scope.tableData._select.names.length){
                            showInuse($scope.tableData._select.names);
                        } else {
                            updater.call();
                        }
                    } else {
                        updater.call();
                    }/*else if ($scope.tableData._select.status == "2"){
                     updater.call();
                     } else if ($scope.tableData._select.status == "3"){
                     showInuse($scope.tableData._select.names);
                     }*/
                }
                return false;

            };
            //$scope.toggleMdCheck = (obj, prop)=>{obj[prop] = (obj[prop] === undefined)?undefined:((obj[prop] == "0")?"1":"0");}
            $scope.nextStep = ()=> {
                if ($scope.updaterDomain._forView) {($scope.step < 3) && $scope.step++;return;}
                if ($scope.updaterDomainForm.$invalid) {$scope.updaterDomainForm.$error.required && $scope.updaterDomainForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
                ($scope.step < 1) && $scope.step++;
            }
            $scope.previousStep = ()=> {($scope.step > 0) && $scope.step--;}
            $scope.cancelStep = ()=> {
                $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
                $scope.updaterDomainForm.$setPristine();
                $scope.mode = 0;
                $scope.step = 0;
                $scope.updaterSelection = {panelCat: initCat, panelCatGroup: initGroup};
            }
            $scope.chooseUpdaterCat = (cat, group)=> {
                $rootScope.confirm("修改结构类别会导致 [结构属性信息] 类型中含有结构属性的数据清空，确定修改结构类别吗", ()=> {
                    $scope.updaterSelection.panelCat = cat ? cat : initCat;
                    $scope.updaterDomain.cat_id = $scope.updaterSelection.panelCat.cat_id;
                    if ($scope.updaterSelection.panelCat.group_list && $scope.updaterSelection.panelCat.group_list[0]) {
                        $scope.updaterSelection.panelCatGroup = $scope.updaterSelection.panelCat.group_list[0];
                    }
                    $rootScope.ajax("domain_datatype", {cat_id: $scope.updaterSelection.panelCat.cat_id}, (data)=> {
                        $scope.propertyDataTypes = data.data_type_list
                    });
                });
            }
            $scope.chooseUpdaterGroup = (group)=> {
                $scope.updaterSelection.panelCatGroup = group ? group : initGroup;
                $scope.updaterDomain.group_id = $scope.updaterSelection.panelCatGroup.group_id;
            }
            $scope.processPropertyDataType = (data_type, property)=> {
                let systemDataTypes = $scope.domainInit.data_type_list.map(r=> {
                    return r.data_type
                });
                property._customized = (systemDataTypes.indexOf(data_type) == -1);
                (data_type != property.pro_type) && (property.pro_type = data_type);
                if (property._customized) {
                    let pro_name;
                    if (property.is_list == "1") {
                        pro_name = property.pro_type ? `${property.pro_type.toLowerCase()}s` : "";
                        let second_pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                        (property.second_node != second_pro_name) && (property.second_node = second_pro_name);
                    } else {
                        pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                        (property.second_node != "") && (property.second_node = "");
                    }
                    (property.pro_name != pro_name) && (property.pro_name = pro_name);
                    (property.first_node != pro_name) && (property.first_node = pro_name);
                } else {
                    property.is_list = "0";
                    property.first_node = "";
                    property.second_node = "";
                }
            }
            $scope.processListCheck = (property)=> {
                if (!property._customized) {
                    return;
                }
                $rootScope.nextTick(()=> {
                    let pro_name;
                    if (property.is_list == "1") {
                        pro_name = property.pro_type ? `${property.pro_type.toLowerCase()}s` : "";
                        let second_pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                        (property.second_node != second_pro_name) && (property.second_node = second_pro_name);
                    } else {
                        pro_name = property.pro_type ? property.pro_type.toLowerCase() : "";
                        (property.second_node != "") && (property.second_node = "");
                    }
                    (property.pro_name != pro_name) && (property.pro_name = pro_name);
                    (property.first_node != pro_name) && (property.first_node = pro_name);
                });
            }
            $scope.saveDomain = ()=> {
                if (!$scope.updaterDomain) {
                    $scope.alert("没有初始化数据");
                    return;
                }
                if ($scope.updaterDomainForm.$invalid) {$scope.updaterDomainForm.$error.required && $scope.updaterDomainForm.$error.required.forEach(r => {r.$setDirty(true);});return;}
                let domain = angular.extend({cat_id: $scope.updaterSelection.panelCat.cat_id,domain_property: [].concat.apply([],$scope.updaterDomain.property.map(r=>{return r.pro_name?[r]:[]}))},$scope.updaterDomain);
                domain.property && (delete domain.property);
                if (!domain.cat_id || !domain.domain_name || !domain.domain_title || !domain.domain_title_en || !domain.domain_desc || !domain.domain_desc_en || !domain.domain_rank) {
                    $scope.alert("基本信息不能为空");
                    return;
                }
                return $rootScope.confirm("系统将保存结构设置，您确认要保存吗",()=>{
                    if($scope.refreshing){return}
                    $scope.refreshing = true;
                    return $rootScope.ajax("domain_save", domain).then((data)=> {
                        $scope.refreshing = false;
                        $scope.resetOrder();
                        $scope.exitMode();
                        $scope.step = 0;
                        domain.domain_id ? $scope.searcher():$scope.research();
                        $scope.updaterDomainForm.$setPristine();
                        $scope.updaterDomain = JSON.parse(JSON.stringify(initialUpdaterDomain));
                    },why=>{$scope.refreshing = false;});
                });
            }

            // 模式2，API排序的功能数据
            $scope.orderSelection = {};
            $scope.orderSelection.panelCat = initCat;
            $scope.orderSelection.panelCatGroup = initGroup;
            $scope.chooseOrderCat = (cat, group)=> {
                $scope.orderSelection.panelCat = cat ? cat : {};
                $scope.orderSelection.panelCatGroup = group ? group : {};
                $scope.sortList();
            }
            $scope.sortList = ()=> {
                return $rootScope.ajax("sort_list", {
                    cat_id: $scope.orderSelection.panelCat.cat_id,
                    group_id: $scope.orderSelection.panelCatGroup.group_id
                }, (data)=> {
                    $scope.originalSortData = JSON.parse(JSON.stringify(data));
                    $scope.sortData = data;
                });
            }
            // TODO 业务逻辑需要，批量操作的api_id需要做成@连接的一个字符串
            $scope.sortSave = ()=> {
                if (!$scope.sortData || !$scope.sortData.data_list) {
                    $scope.alert("没有可选排序项");
                }
                let domainIDs = $scope.sortData.data_list.map((r)=> {
                    return {domain_id: r.domain_id}
                });
                return $rootScope.ajax("sort_save", {domain_list: domainIDs}, (data)=> {
                    $scope.enterMode(0);
                });
            }
            $scope.resetOrder = ()=>{
                return initDomainQ&&initDomainQ.then((data)=> {
                        $scope.orderSelection.panelCat = initCat;
                        $scope.orderSelection.panelCatGroup = initGroup;
                        $scope.sortList();
                        return data;
                    });
            }
            $scope.resetOrder();
            $scope.exitOrder = ()=>{
                $scope.mode = 0;
                $scope.resetOrder();
            }

            let modeInfo = [
                {title:"结构列表", cancelFunction: $scope.reset},
                {title:"结构详情", cancelFunction: $scope.cancelStep},
                {title:"结构排序", cancelFunction: $scope.exitOrder},
            ];
            $scope.getModeInfo = ()=>{
                if(typeof $scope.mode == "number"){
                    return modeInfo[$scope.mode]
                } else{
                    return modeInfo[0]
                }
            }

            $scope.appendRow = (row, list) => {
                list.push(row ? row : {})
            };
            $scope.removeRow = (row, list) => {
                list.splice(list.indexOf(row), 1);
            };
            window.test = ()=> {
                console.log($scope);
                return $scope;
            }
            $scope.injectorLoaded = true;
        }];
});
