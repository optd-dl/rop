/**
 * Created by zhangjj on 22/01/2017.
 */
define(['../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$http', '$mdDialog',
        ($rootScope, $scope, $q, $http, $mdDialog) => {
            $rootScope.tab = "app";
            $scope.appInfo = {};
            $scope.refreshing0 = false;
            $scope.refreshing1 = false;
            $scope.refreshing2 = false;
            $scope.refreshing3 = false;
            $scope.initRefreshing = true;
            let initFun = ()=>{
                return $rootScope.ajax("app_get",{}).then(data=>{
                    if ((typeof data.is_success === 'boolean' && data.is_success) || (typeof data.is_success === 'string' && data.is_success === 'true')){
                        $scope.appInfo = data;
                        return data;
                    } else {
                        return $q.reject();
                    }
                }).finally(()=>{
	                $scope.initRefreshing = false;
                })
            }, initFunQ = initFun();

            $scope.reset = (type) => {
            	let str = 'App Secret';
            	if (type == '2' || type == '3'){
            		str = 'Access Token';
	            }
	            return $rootScope.confirm(`确定要重置${str}吗？`, ()=>{
		            initFunQ && initFunQ.then(data=>{
			            if (typeof type != 'string' || !data.app_id){
				            return $q.reject();
			            } else {
			            	switch (type) {
					            case '0':
						            $scope.refreshing0 = true;
						            break;
					            case '1':
						            $scope.refreshing1 = true;
						            break;
					            case '2':
						            $scope.refreshing2 = true;
						            break;
					            case '3':
						            $scope.refreshing3 = true;
						            break;
				            }
				            return $rootScope.ajax("app_reset", {
					            'app_id': $scope.appInfo.app_id,
					            'reset_type': type
				            }).finally(()=>{
					            switch (type) {
						            case '0':
							            $scope.refreshing0 = false;
							            break;
						            case '1':
							            $scope.refreshing1 = false;
							            break;
						            case '2':
							            $scope.refreshing2 = false;
							            break;
						            case '3':
							            $scope.refreshing3 = false;
							            break;
					            }
					            return initFun();
				            });
			            }
		            });
	            });
            };

            $scope.injectorLoaded = true;

            window.test = $scope;
            //$scope.$on("$destroy", event => {});
        }];
});
