'use strict';
/*******************************************************************************
 * 描述：动态分页指令<br>
 * 作者：亿量前端-Boleer<br>
 * 日期：2015-09-10<br>
 * -----------------------------------------------------------------<br>
 * 变更序号：<br>
 * 修改日期：<br>
 * 修改人员：<br>
 * 修改原因：<br>
 * **********************************************************************
 */

function PagingComponent($compile, $parse, $log, $timeout, $window) {

	/**
	 * 设置控件环境上下文
	 */
	this.context = function(scope, element, attrs, transclude) {
	};
	/**
	 * 编译控件指令
	 */
	this.link = function(scope, element, attrs, controller) {
		var total = attrs.total, size = attrs.size, index = attrs.index, list = attrs.list, searcher = attrs.searcher;
		var $size = new Number(size), $index = $parse(index)(scope), _$searcher = $parse(searcher)(scope);
		var $scope = element.scope(),$searcher = function(){
            this.loading = true;
            _$searcher.apply(null,arguments);
        }.bind(scope);

        scope.$parent[searcher] = $searcher;
        $scope.size = $size.toString();
        
		scope.$watch(total, function() {
			var $total = $parse(total)(scope);
			$scope.pages = [];
			for (var i = 0; i < Math.ceil($total / parseInt($scope.size)); i++) {
				$scope.pages.push({
					index : i + 1
				})
			}
            $scope.total = $total;
		});
        scope.$watch(list, function() {
            this.loading = false;
        }.bind(scope));

        $scope.$watch("size", function() {
            $scope.pages = [];
            for (var i = 0; i < Math.ceil($scope.total / parseInt($scope.size)); i++) {
                $scope.pages.push({
                    index : i + 1
                })
            }
            $scope.index = 1;
            $scope.ceilingIndex = 5;
            $searcher($scope.index,$scope.size);
        });

        $scope.$watch(index, function() {
            //$searcher($scope.index,$scope.size);
            console.log($scope.index);
            console.log($scope[index]);
            //$scope.toPage($scope.index);
            if($scope.index != $scope[index]){
                $scope.index = $scope[index];
                $scope.toPage($scope.index);
            }
        });
		$scope.index = $index;
        $scope.myIndex = 1;
        $scope.ceilingIndex = 5;
        $scope.toFirst = function() {
            $scope.index = 1;
            $scope.ceilingIndex = 5;
            $searcher($scope.index,$scope.size);
        };
        $scope.toLast = function() {
            $scope.index = $scope.pages.length;
            $scope.ceilingIndex = $scope.pages.length;
            $searcher($scope.index,$scope.size);
        };

		$scope.searchPrevious = function() {
            if(($scope.ceilingIndex == $scope.index + 4) && ($scope.index>1)){
                $scope.ceilingIndex--;
            }
			if ($scope.index > 1) {
				--$scope.index;
				$searcher($scope.index,$scope.size);
			}
		};

		$scope.searchNext = function() {
            if(($scope.ceilingIndex == $scope.index) && ($scope.index<$scope.pages.length)){
                $scope.ceilingIndex++;
            }
			if ($scope.index < $scope.pages.length) {
				++$scope.index;
				$searcher($scope.index,$scope.size);
			}
		};

		$scope.searchIndex = function(i) {
			$scope.index = i;
            $searcher($scope.index,$scope.size);
		};

        $scope.toPage = function(myIndex){
            $scope.ceilingIndex = Math.min(parseInt(myIndex)+4,$scope.pages.length);
            $scope.searchIndex(myIndex);;
        }
	};

}