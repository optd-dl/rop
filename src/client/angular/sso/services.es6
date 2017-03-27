define(['angular'], function (angular) {
    'use strict';
    return angular.module('sso.services', [])
        /*.factory('HttpObserver', ['$rootScope','$q',($rootScope,$q)=> {
            var sessionInjector = {
                response: function (config) {
                    if(config.data._expired){
                        window.location.href = `${Constant.protocol}://${Constant.host}:${Constant.port}/sso?from=application`;
                        return $q.reject(config);
                    }
                    window._lastHttpRequest = new Date();
                    return config;
                }
            };
            return sessionInjector;
        }]);*/
});