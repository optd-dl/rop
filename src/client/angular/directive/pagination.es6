(function (angular) {
    'use strict';
    let model = angular.module('rop.module.pagination', []);
    model.directive('ropPagination', ['$parse', $parse => ({
        restrict: "A",

        scope: {
            index: "=index",
            size: "=size",
            total: "=total",
            searcher: "=searcher",
            infinite: "=infinite",
            infiniteEnd: "=infiniteEnd"
        },
        controller: $scope=>{},
        controllerAs:"ctrl",
        //replace: true,
        templateUrl: "/_template/pagination",

        link($scope, element, attrs) {
            $scope.ctrl.myIndex = 1;
            $scope.ceilingIndex = $scope.index + 4;

            // TODO 为了防止初始化2次特注掉以下代码，注掉后操作页scope则不能控制分页组件，反之是分页控件控制scope的数据，如果需要可以恢复
            $scope.$watch("total", () => {
                if ($scope.total) {
                    let total = (typeof $scope.total == 'string')? new Number($scope.total):$scope.total;
                    $scope.pages = [];
                    for (let i = 0; i < Math.ceil(total / $scope.size); i++) {
                        $scope.pages.push({index: i + 1})
                    }
                    $scope.index = 1;
                    //$scope.ceilingIndex = 5;
                    $scope.ctrl.myIndex = 1;
                    $scope.ceilingIndex = $scope.index + 4;
                }
            });
            $scope.$watch("size", () => {
                if ($scope.size) {
                    $scope.pages = [];
                    for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                        $scope.pages.push({index: i + 1})
                    }
                    $scope.index = 1;
                    //$scope.ceilingIndex = 5;
                    $scope.ctrl.myIndex = 1;
                    $scope.ceilingIndex = $scope.index + 4;
                    $scope.searcher($scope.index, $scope.size);
                }
            });
            $scope.toFirst = () => {
                $scope.index = 1;
                $scope.ceilingIndex = 5;
                $scope.searcher($scope.index, $scope.size);
            };
            $scope.toLast = () => {
                $scope.index = $scope.pages.length;
                $scope.ceilingIndex = $scope.pages.length;
                $scope.searcher($scope.index, $scope.size);
            };
            $scope.searchPrevious = () => {
                if (($scope.ceilingIndex == $scope.index + 4) && ($scope.index > 1)) {
                    $scope.ceilingIndex--;
                }
                if ($scope.index > 1) {
                    --$scope.index;
                    $scope.searcher($scope.index, $scope.size);
                }
            };

            $scope.searchNext = () => {
                if (($scope.ceilingIndex == $scope.index) && ($scope.index < $scope.pages.length)) {
                    $scope.ceilingIndex++;
                }
                /*if ($scope.index < $scope.pages.length) {
                    ++$scope.index;
                    $scope.searcher($scope.index, $scope.size);
                }*/
                if($scope.infinite || ($scope.index < $scope.pages.length)){
                    ++$scope.index;
                    $scope.searcher($scope.index, $scope.size);
                }
            };

            $scope.searchIndex = i => {
                $scope.index = (typeof i == 'string') ? new Number(i) : i;
                $scope.searcher($scope.index, $scope.size);
            };

            $scope.toPage = () => {
                let myIndex = (typeof $scope.ctrl.myIndex == 'string')? new Number($scope.ctrl.myIndex):$scope.ctrl.myIndex;
                if(myIndex > $scope.pages.length){return};
                //let _myIndex = (typeof myIndex == 'string') ? new Number(myIndex) : myIndex;
                $scope.ceilingIndex = Math.max(Math.min(myIndex + 4, $scope.pages.length),5);
                $scope.searchIndex(myIndex);
            }

            if($scope.infinite){
                $scope.infiniteStart = ()=>{
                    return ($scope.index == 1);
                }
            }
        }
    })]);
})(window.angular);