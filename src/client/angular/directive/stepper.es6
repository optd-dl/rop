(function (angular) {
    'use strict';
    angular.module('rop.module.stepper', []).directive('ropStepper', ['$parse','$timeout', ($parse,$timeout) => ({
        restrict: "AE",

        scope: {
            index: "=index",
            steps: "=steps"
        },
        replace: true,
        templateUrl: "/_template/stepper",

        link($scope, element, attrs) {
            /*$scope.steps = [];
             for(var index =0; index<$scope.total; index++){
             $scope.steps.push({status:($scope.index>index)?"done":(($scope.index==index)?"ready":"")});
             }*/
            /*
             $scope.$watch("index", (newValue,oldValue) => {
             if(newValue < oldValue){
             $scope.steps.forEach((r,i)=>{
             if((i <= oldValue) && (i >= newValue)){
             $timeout(()=>{
             r.status = (i == newValue)?"ready":"";
             },1600*(oldValue - i))
             }
             });
             } else {
             $scope.steps.forEach((r,i)=>{
             if((i >= oldValue) && (i <= newValue)){
             if(){

             }
             $timeout(()=>{
             r.status = (i == newValue)?"ready":"done";
             },(i > oldValue)?(1600*(i - oldValue - 1) + 200):0)
             }
             });
             }
             });*/

        }
    })]);
})(window.angular);