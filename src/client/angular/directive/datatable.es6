(function (angular) {
    'use strict';
    angular.module('rop.module.datatable', []).directive('ropDatatable', ['$parse','$timeout', ($parse,$timeout) => ({
        restrict: "AE",

        scope: {
            cols: "=cols",
            sorter: "=sorter",
            data: "=data",

            index: "=index",
            size: "=size",
            total: "=total",
            searcher: "=searcher",
            infinite: "@infinite",

            multiSelection:"=multiple",
            noSelection:"=noselection",
            noRowSelection:"=norowselection",
        },
        //replace: true,
        templateUrl: "/_template/datatable",

        link($scope, element, attrs) {
            $scope.checkAll = ()=>{
                if(!$scope.allChecked){
                    $scope.data.forEach((r)=>{!r._locked && (r._checked = true)});
                    $scope.allChecked = true;
                } else {
                    $scope.data.forEach((r)=>{!r._locked && (r._checked = false)})
                    $scope.allChecked = false;
                }
            }
            $scope.sort = col =>{
                col.sort = (col.sort == "1")?"0":"1";
                //Object.assign($scope.sorter,col);
                $scope.cols.forEach((r,i)=>{
                    if(r !== col){
                        r.sort = r.sort?"1":undefined;
                    }
                });
                for(let prop in col){
                    $scope.sorter[prop] = col[prop];
                }
                $scope.index = 1;
                $scope.size = new Number($scope.size);
            }
            $scope.verifyCheckAll = ()=>{
                let result = true;
                if($scope.data){
                    if ($scope.data.length == 0){
                        result = false;
                    } else {
                        for(var i=0;i<$scope.data.length;i++){
                            var r = $scope.data[i];
                            !r._locked && !r._checked&&(result = false);
                            r._locked &&(result = false);
                        }
                    }
                }
                if(!result){$scope.allChecked = false;} else {$scope.allChecked = true;}
            }
            $scope.$watch("data", () => {
                $scope.verifyCheckAll();
            });

            /*$scope.$watch("sorter", () => {
             if ($scope.size) {
             $scope.pages = [];
             for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
             $scope.pages.push({index: i + 1})
             }
             $scope.index = 1;
             $scope.ceilingIndex = 5;
             $scope.myIndex = $scope.index;
             $scope.ceilingIndex = $scope.index + 4;
             $scope.searcher($scope.index, $scope.size);
             }
             });*/
        }
    })]);
})(window.angular);