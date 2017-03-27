/**
 * Created by robin on 22/11/2016.
 */
define(['../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$http', '$mdDialog',
        ($rootScope, $scope, $q, $http, $mdDialog) => {
            $rootScope.tab = "env_set";

            let init = $rootScope.ajax("init",{}).then(data=>{
                $scope.role_list = data.role_list;
                $scope.searcher = (index, size) => {
                    $scope.refreshing = true;

                    return $rootScope.ajax("list",{
                        ename: $scope.ename,
                        pageindex: (index !== undefined) ? index : $scope.pageIndex,
                        pagesize: (size !== undefined) ? size : $scope.pageSize,
                    }).then(data=>{
                        if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true'))) {
                            $scope.tableData = data.data_list;
                            $scope.total = data.list_count;
                        } else {
                            $rootScope.alert(data.msg);
                            $scope.total = 0;
                        }
                    }).finally(()=>{$scope.refreshing = false;});
                }
                $scope.reset();
            }), initialSteps = [{name: "添加环境"}, {name: "地址设置"}],virtualRepeatProsessor = (index)=>{
                if(index !== -1){
                    // TODO 由于虚拟滚动的特殊性，直接把topIndex做成尾部index是不合适的
                    if(index <= ($scope.updater.detail.api_list.length - 5 - 1)){
                        $scope.topIndex = index ;
                    } else {
                        $scope.topIndex = index - 6;
                        $rootScope.nextTick(()=>{$scope.topIndex = index;});
                    }
                } else {
                    $scope.topIndex = 0;
                }
            };
            $scope.research = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
            }
            $scope.reset = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                $scope.mode = 0;
                $scope.updater = {};
                $scope.step = 0;
                $scope.steps = initialSteps;
                $scope.topIndex = 0;
            }


            $scope.canInsert = () => {return $scope.role_list?($scope.role_list.btnInsert == "1"):false}
            $scope.canUpdate = () => {return $scope.tableData && $scope.tableData._select && $scope.role_list?($scope.role_list.btnUpdate == "1"):false}
            $scope.canDelete = () => {return $scope.tableData && $scope.tableData._select && $scope.role_list?($scope.role_list.btnDelete == "1"):false}
            $scope.export = (eid) => {
                if($scope.exporting){return $q.reject();}
                $scope.exporting = true;
                return $rootScope.ajax("export",{
                    eid: eid
                }).then(data=>{
                    if($rootScope.browserType == "Chrome"){
                        let a = window.document.createElement("a");
                        a.href = data.export_url;
                        a.download = true;
                        a.click();
                    } else {
                        window.open(data.export_url,"_blank");
                    }
                }).finally(()=>{$scope.exporting = false;});
            }

            $scope.columns = [
                {text: "环境名称", name: "ename"},
                {text: "备注",name: "remark"},
                {text: "添加时间", name: "create_time", style: {'text-align': "center"}}
            ];
            $scope.batch = false;

            $scope.addMode = () => {
                if($scope.refreshing){return $q.reject();}
                $scope.refreshing = true;
                return $rootScope.ajax("detail", {}).then(data=>{
                    $scope.updater.detail = data;
                    $scope.updater.detail.selectedEnv = data && data.environment_list ? data.environment_list[0]: null;
                    $scope.mode = 1;
                    ($scope.step != 0) && ($scope.step = 0);
                    $scope.steps = initialSteps;
                }).finally(()=>{$scope.refreshing = false;});
            }
            $scope.updateMode = (eid) => {
                if($scope.refreshing){return $q.reject();}
                $scope.refreshing = true;
                return $rootScope.ajax("detail", {eid:eid}).then(data=>{
                    $scope.updater.detail = data;
                    $scope.updater.detail.selectedEnv = data && data.environment_list ? data.environment_list[0]: null;
                    $scope.mode = 1;
                    ($scope.step != 0) && ($scope.step = 0);
                    $scope.steps = initialSteps;
                }).finally(()=>{$scope.refreshing = false;});
            };

            $scope.enterMode = (mode, cb)=> {
                $scope.mode = mode;
                cb && cb.call();
            }
            $scope.exitMode = (cb)=> {
                $scope.mode = 0;
                cb && cb.call();
            }
            $scope.delete = eid =>{
                if($scope.refreshing){return $q.reject();}
                return $rootScope.confirm("请确认是否要删除多环境？", ()=>{
                    return $rootScope.ajax("del", {eid:eid}).then($scope.research);
                });
            }

            $scope.nextStep = ()=> {
                //if ($scope.updater._forView) {($scope.step < 1) && $scope.step++;return;}
                if ($scope.updaterForm.$invalid) {
                    for(let pattern in $scope.updaterForm.$error){
                        $scope.updaterForm.$error[pattern].forEach(r => {r.$setDirty(true);});
                    }
                    return;
                }
                ($scope.step < 1) && $scope.step++;
            }
            $scope.previousStep = ()=> {($scope.step > 0) && $scope.step--;}
            $scope.cancelStep = ()=> {
                //$scope.updaterAPI = JSON.parse(JSON.stringify(initialUpdaterAPI));
                $scope.updaterForm.$setPristine();
                $scope.mode = 0;
                $scope.step = 0;
                $scope.updater = {};
                $scope.keyword = "";
                $scope.invalidURLInfo = undefined;
            }

            $scope.selectEnv = env => {
                $scope.updater.detail.selectedEnv = env
            }
            $scope.cloneEnv = env => {
                if($scope.refreshing){return $q.reject();}
                $scope.refreshing = true;
                $rootScope.ajax("clone", {eid:$scope.updater.detail.selectedEnv.eid}).then(data=>{
                    data.data_list && data.data_list.forEach(r=>{
                        $scope.updater.detail.api_list.forEach(row=>{
                            (row.api_id == r.api_id) && (row.api_url = r.api_url);
                        })
                    })
                }).finally(()=>{$scope.refreshing = false});
            }
            $scope.unifyEnv = env => {
                if($scope.refreshing){return $q.reject();}
                $scope.updater.detail.api_list.forEach(row=>{
                    row.api_url = $scope.updater.detail.url;
                })
            }
            $scope.saveEnv = ()=>{
                if($scope.refreshing){return $q.reject();}
                $scope.updater.keywordResultList = undefined;
                $scope.keyword = "";
                if ($scope.updaterForm.$invalid) {
                    let index = 0;
                    for(var i=$scope.updater.detail.api_list.length - 1;i>=0;i--){
                        $scope.updater.detail.api_list[i]._selected = 0;
                        if($scope.updaterForm.$error.required && (!$scope.updater.detail.api_list[i].api_url || ($scope.updater.detail.api_list[i].api_url == $scope.updaterForm.$error.required[0].$modelValue))){
                            index = i;
                        } else if ($scope.updaterForm.$error.url && ($scope.updater.detail.api_list[i].api_url === $scope.updaterForm.$error.url[0].$modelValue)){
                            index = i;
                        }
                        if(index <= ($scope.updater.detail.api_list.length - 5 - 1)){
                            $scope.topIndex = index ;
                        } else {
                            $scope.topIndex = index - 6;
                            //$rootScope.nextTick(()=>{$scope.topIndex = index-5;});
                        }
                    }
                    $rootScope.nextTick(()=>{
                        $scope.topIndex = index;
                        $scope.updaterForm.$error.required && $scope.updaterForm.$error.required.forEach(r => {r.$setDirty(true);});
                        $scope.updaterForm.$error.url && $scope.updaterForm.$error.url.forEach(r => {r.$setDirty(true);});
                    })
                    return;
                }
                let param = {
                    eid:                $scope.updater.detail.eid || undefined,
                    ename:              $scope.updater.detail.ename || "",
                    remark:             $scope.updater.detail.remark || "",
                    environment_url:    $scope.updater.detail.api_list || [],
                }
                $scope.refreshing = true;
                return $http.post('/agent', {
                    module: "application",
                    partial: $rootScope.tab,
                    api: "save",
                    param: param
                }).then(body => {
                    if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                        $scope.invalidURLInfo = undefined;
                        $scope.exitMode();
                        return $scope.searcher().then(()=>{
                            $rootScope.nextTick(()=>{
                                $scope.updaterForm.$setPristine();
                                $scope.step = 0;
                                $scope.updater = {};
                                $scope.topIndex = 0;
                            });
                        });
                    } else {
                        // TODO 和后端开发者商定的接口格式
                        $scope.invalidURLInfo = body.data;
                        $scope.topIndex = 0;
                        $scope.locateURL();
                        return $q.reject();
                    }
                }, $rootScope.alert).finally(()=>{$scope.refreshing = false});;
            }
            $scope.locateURL = ()=>{
                let index = $scope.updater.detail && $scope.updater.detail.api_list && $scope.invalidURLInfo ?[].concat.apply([], $scope.updater.detail.api_list.map((r,i)=>{return (r.api_url == $scope.invalidURLInfo.sub_msg)?[i]:[]}))[0]: undefined;
                if(index !== -1){
                    // TODO 由于虚拟滚动的特殊性，直接把topIndex做成尾部index是不合适的
                    if(index <= ($scope.updater.detail.api_list.length - 5 - 1)){
                        $scope.topIndex = index ;
                    } else {
                        $scope.topIndex = index - 6;
                        $rootScope.nextTick(()=>{$scope.topIndex = index;});
                    }
                } else {
                    $scope.invalidURLInfo = undefined
                    $scope.topIndex = 0;
                }
                //$scope.topIndex = ((index !== undefined) && (index != ($scope.updater.detail.api_list.length - 1))? index: 0);
            }

            $scope.locate = ()=>{
                if($scope.mode != 1 || $scope.step != 1){return;}
                let candidateList = $scope.updater.detail && $scope.updater.detail.api_list && $scope.keyword ? [].concat.apply([], $scope.updater.detail.api_list.map((r,i)=>{
                    r._selected = 0;
                    if(r.api_url && (r.api_url.indexOf($scope.keyword) != -1)){
                        r._selected = 2;
                        return [i];
                    } else if (r.api_name && (r.api_name.indexOf($scope.keyword) != -1)){
                        r._selected = 1;
                        return [i];
                    } else {
                        return [];
                    }
                    //return ((r.api_url && (r.api_url.indexOf($scope.keyword) != -1)) || (r.api_name && (r.api_name.indexOf($scope.keyword) != -1)))?[i]:[]
                })):$scope.updater.detail.api_list.map((r,i)=>{
                        r._selected = 0;return [r];
                }), index = (candidateList[0] || 0);
                $scope.updater.keywordResultList = candidateList;
                virtualRepeatProsessor(index);
            }
            $scope.locateNext = (e)=>{
                if($scope.mode != 1 || $scope.step != 1){return;}
                e.preventDefault();
                e.stopPropagation();
                let index = 0;
                if($scope.updater.keywordResultList){
                    for(var i =0;i<$scope.updater.keywordResultList.length;i++){
                        let myIndex= $scope.updater.keywordResultList[i];
                        if(myIndex > $scope.topIndex){
                            index = myIndex;
                            break;
                        } else if (i == ($scope.updater.keywordResultList.length -1)){
                            index = $scope.updater.keywordResultList[0];
                        }

                    }
                    virtualRepeatProsessor(index);
                }
            }
            $scope.injectorLoaded = true;

            window.test = () => {return $scope};
            //$scope.$on("$destroy", event => {});
        }];
});
