/**
 * Created by robin on 22/11/2016.
 */
require.config(Constant.requires);

require(['angular','./application/app'],  (angular)=> {
    angular.bootstrap(document, ['application']);
});