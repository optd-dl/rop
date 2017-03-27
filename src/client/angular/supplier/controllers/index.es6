/**
 * Created by robin on 22/11/2016.
 */
define(['owl', 'holder','../../services'], function (owl,Holder) {
    'use strict';
    return ['$rootScope', '$scope', '$http', '$timeout','$q',
        ($rootScope, $scope, $http, $timeout,$q) => {
            $rootScope.tab = 'index';
            //Revolution Slider
            if ($rootScope.revslider) {

            }

            $scope.scrollToContent = cb => {
                $('body').animate({scrollTop: $(window).height()}, cb);
            }
            $('a[href^="#"]', '#partials').click(e => {
                e.preventDefault();
            });
            //$('.carousel','#partials').carousel();

            let devQ = $http.post('/agent', {
                module: 'supplier',
                partial: 'index',
                api: 'success_developers',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                if (body.data.data_list && body.data.data_list.length) {
                    $scope.success_developers = body.data.data_list;
                    $timeout(() => {
                        Holder && Holder.run({images: document.querySelectorAll('img[src=""]')});
                    })
                }
            }, why => {
                $rootScope.alert(why);
            }).then(()=>{
                // 必须在一个digest周期后再执行
                $timeout(()=>{
                    $("#owl-footer").owlCarousel({
                        items: 4, //10 items above 1000px browser width
                        autoPlay: 3000,
                        pagination: false,
                        navigation: false,
                        navigationText: false,
                        itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option
                    });
                });
            }), featureQ = $http.post('/agent', {
                module: 'supplier',
                partial: 'index',
                api: 'get_feature',
                param: {ssv_user_id: $rootScope.ssv_user_id}
            }).then(body => {
                if (body && body.data && body.data.user_desc) {
                    $scope.ssv_feature = body.data.user_desc;
                }
            }, why => {
                $rootScope.alert(why);
            });

            $q.when(devQ, featureQ).then(()=>{
                $('.carousel').carousel({interval: 6000});
                $scope.injectorLoaded = true;
                return;
            }).then($rootScope.removeLoading)
        }];
});
