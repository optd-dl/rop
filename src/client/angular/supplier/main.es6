/**
 * Created by robin on 22/11/2016.
 */
require.config(Constant.requires);

require(['angular','./supplier/app'],  (angular)=> {
    angular.bootstrap(document, ['supplier']);
});