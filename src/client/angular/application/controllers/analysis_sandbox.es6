/**
 * Created by robin on 22/11/2016.
 */
define([], function () {
    'use strict';
    return ['$rootScope', '$scope', '$mdDialog',($rootScope, $scope, $mdDialog) => {
            $rootScope.tab = "analysis_sandbox";

            let pageTotal = 999999;
            $scope.reset = ()=> {
                //$scope.keyword = "";
                $scope.keywordArray=[""];
                $scope.nextRowkey = "";
                $scope.pageIndex = 1;
                $scope.pageIndexClone = 1;
                $scope.pageSize = new Number(10);
                $scope.pageTotal = 999999;
                $scope.infinite = true;
                $scope.hasNext = true;
                $scope.searchdate = new Date();
                $scope.endtime = $scope.searchdate.Format("HH:mm:ss");
                $scope.begintime = new Date(new Date().setHours(Math.max($scope.searchdate.getHours() - 1, 0))).Format("HH:mm:ss");
                // 只能是60天之内的搜索
                $scope.mindate = new Date($scope.searchdate.getFullYear(), $scope.searchdate.getMonth(), $scope.searchdate.getDate() - 60);
                $scope.maxdate = new Date();

                $scope.hasNext = true;
            }
            $scope.searcher = (index, size) => {
                let rowkey = index?((index > $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone]:((index < $scope.pageIndexClone)?$scope.keywordArray[$scope.pageIndexClone - 2]:$scope.keywordArray[$scope.pageIndexClone - 1])):$scope.keywordArray[$scope.pageIndexClone - 1],
                    pageindex = index ? index : $scope.pageIndex;
                if($scope.refreshing || (pageTotal < pageindex)){
                    $rootScope.nextTick(()=>{($scope.pageIndex!= $scope.pageIndexClone) && ($scope.pageIndex = $scope.pageIndexClone);});
                    return;
                }
                $scope.refreshing = true;
                return $rootScope.ajax("list", {
                    pageindex: pageindex,
                    keyword: $scope.keyword,
                    searchdate: $scope.searchdate.Format("yyyy-MM-dd"),
                    begintime: $scope.begintime,
                    endtime: $scope.endtime,
                    rowkey: rowkey
                }, (data)=> {
                    if (((typeof data.is_success == 'boolean') && data.is_success) || ((typeof data.is_success == 'string') && (data.is_success == 'true')) || data.log_list) {
                        $scope.tableData = data.log_list;
                        if(data.rowkey){
                            if((pageindex >= $scope.pageIndexClone) && (data.rowkey > $scope.nextRowkey)){
                                $scope.keywordArray.push(data.rowkey);
                            } else if ((pageindex <= $scope.pageIndexClone)  && (data.rowkey < $scope.nextRowkey)){
                                $scope.keywordArray && ($scope.keywordArray.length > 2)?$scope.keywordArray.splice(pageindex):$scope.keywordArray.splice(1);
                            }
                        }
                        if(data.has_next != "1"){
                            pageTotal = pageindex;
                            $scope.hasNext = false;
                        } else {
                            $scope.hasNext = true;
                        }
                        $scope.pageIndexClone = pageindex;
                    } else {
                        $rootScope.alert(data.msg);
                    }
                }, ()=>{}).finally(()=>{
                    $scope.refreshing = false;
                });
            }
            $scope.tableData = [];
            $scope.research = () => {
                $scope.pageIndex = 1;
                $scope.hasNext = true;
                pageTotal = 999999;
                $scope.pageSize = new Number(10);
            }
            $scope.reset();
            $scope.infiniteEnd = index=>{
                return !$scope.hasNext
            }

            $scope.expandRow = row=>{
                $scope.tableData && $scope.tableData.length && $scope.tableData.forEach(r=>{(r !== row) && (r._expand = false);});
                row._expand = !row._expand;
            }

            let ParamController = (scope, $mdDialog, data)=> {
                scope.data = data;
                scope.makeTag = row=>{return `<${row.param_name}>${row.param_value}</${row.param_name}>`;}
                scope.closeDialog = () => {$mdDialog.hide()};
            }
            $scope.showParamDialog = ($event,rawData) => {
                // 由于原始数据是被转义过的，所以为了转义功能，使用假div对数据进行清洗
                let data = [];
                try{
                    data = JSON.parse(angular.element(`<div>${rawData}</div>`)[0].innerHTML.replace(/'/g,'"'));
                }catch(e){
                    $rootScope.alert("数据解析出现问题，请联系开发者");
                    return;
                }
                $mdDialog.show({
                    controller: ParamController,
                    template: `<md-dialog aria-label="Mango (Fruit)">
                                <md-dialog-content class="md-dialog-content param-viewer">
                                    <div class="md-dialog-content-body">
                                        <table class="md-datatable" cellspacing="0">
                                            <tbody>
                                                <tr><td colspan="3"><span>&lt;</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr ng-repeat="row in data"><td></td><td></td><td><span>&lt;</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span><span class="content" ng-bind="row.param_value"></span><span>&lt;/</span><span class="tag" ng-bind="row.param_name"></span><span>&gt;</span></td></tr>
                                                <tr><td></td><td colspan="2"><span>&lt;/</span><span class="tag">Parameters</span><span>&gt;</span></td></tr>
                                                <tr><td colspan="3"><span>&lt;/</span><span class="tag">LogDetails</span><span>&gt;</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </md-dialog-content>
                            </md-dialog>`,
                    /*parent: angular.element(document.body),*/
                    targetEvent: $event,
                    parent: angular.element(document.querySelector('body>section>md-content')),
                    clickOutsideToClose: true,
                    locals: {data: data}
                });
            };
            window.test = ()=> {
                console.log($scope);
                return $scope;
            };

            $scope.injectorLoaded = true;
        }];
});
