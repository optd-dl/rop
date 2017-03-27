/**
 * Created by robin on 22/11/2016.
 */
define(['../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$location', '$mdDialog',
        ($rootScope, $scope, $q, $location, $mdDialog) => {
            $rootScope.tab = "env_app";

            let init = $rootScope.ajax("init",{}).then(data=>{
                $scope.preset = data;
                $scope.searcher = (index, size) => {
                    $scope.refreshing = true;

                    return $rootScope.ajax("list",{
                        user_id:$scope.selectedUser?$scope.selectedUser.user_id:"",
                        eid: $scope.selectedEnv?$scope.selectedEnv.eid:"",
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
                $scope.multi = $scope.preset && ($scope.preset.uat_flag == "1");
            });

            $scope.research = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
            }
            $scope.reset = () => {
                $scope.pageIndex = 1;
                $scope.pageSize = new Number(10);
                $scope.selectedUser = null;
                $scope.selectedEnv = null;
            }

            $scope.confirm = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if($scope.refreshing){return;}
                if(!$scope.multi){
                    $rootScope.confirm("开启多环境，多环境功能将在10分钟后生效，是否开启多环境？", ()=>{
                        $scope.refreshing = true;
                        $rootScope.ajax("status",{status: "1",}).then(data=>{
                            $scope.pageIndex = 1;
                            return $scope.searcher();
                        }).finally(()=>{$scope.multi = true;$scope.refreshing = false;});
                    })
                } else {
                    $rootScope.confirm("停用多环境，将会使所有开发者应用的调用环境全部停用，是否停用多环境？", ()=>{
                        $scope.refreshing = true;
                        $rootScope.ajax("status",{status: "0",}).then(data=>{
                            $scope.pageIndex = 1;
                            return $scope.searcher();
                        }).finally(()=>{$scope.multi = false;$scope.refreshing = false;});
                    })
                }
            }
            $scope.confirm = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if($scope.refreshing){return;}
                if(!$scope.multi){
                    $rootScope.confirm("开启多环境，多环境功能将在10分钟后生效，是否开启多环境？", ()=>{
                        $scope.refreshing = true;
                        $rootScope.ajax("status",{status: "1",}).then(data=>{
                            $scope.pageIndex = 1;
                            return $scope.searcher();
                        }).finally(()=>{$scope.multi = true;$scope.refreshing = false;});
                    })
                } else {
                    $rootScope.confirm("停用多环境，将会使所有开发者应用的调用环境全部停用，是否停用多环境？", ()=>{
                        $scope.refreshing = true;
                        $rootScope.ajax("status",{status: "0",}).then(data=>{
                            $scope.pageIndex = 1;
                            return $scope.searcher();
                        }).finally(()=>{$scope.multi = false;$scope.refreshing = false;});
                    })
                }
            }

            $scope.getTargetEnvironment = id => {
                return $scope.preset && $scope.preset.environment_list ?[].concat.apply([], $scope.preset.environment_list.map(r=>{return (r.eid == id)?[r]:[]}))[0]:undefined;
            }
            $scope.getTargetUser = id => {
                return $scope.preset && $scope.preset.user_list ?[].concat.apply([], $scope.preset.user_list.map(r=>{return (r.user_id == id)?[r]:[]}))[0]:undefined;
            }

            $scope.selectEnv = env =>{
                $scope.selectedEnv = env;
                $scope.research();
            }
            $scope.selectRowEnv = (env, row) =>{
                row.eid = env.eid;
            }
            $scope.selectUser = user =>{
                $scope.selectedUser = user;
                $scope.research();
            }
            $scope.saveRowEnv = row=>{
                $rootScope.confirm("修改后的结果将在10分钟后生效。确定要保存吗？", ()=>{
                    $scope.refreshing = true;
                    return $rootScope.ajax("save",{
                        id: row && row.id || "",
                        eid: row && row.eid || "",
                    }).then(()=>{return $scope.searcher()}).finally(()=>{$scope.refreshing = false;});
                })
            }

            $scope.injectorLoaded = true;

            window.test = () => {return $scope};
            //$scope.$on("$destroy", event => {});
        }];
});
