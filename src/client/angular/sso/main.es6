/**
 * Created by robin on 22/11/2016.
 */
require.config(Constant.requires);

require(['angular','./sso/app'],  (angular)=> {
    angular.bootstrap(document, ['sso']);
});