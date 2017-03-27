/**
 * Created by robin on 22/11/2016.
 */
define(['require', 'angular'], function (require, angular) {
    'use strict';

    let controllerModule = angular.module('supplier.controllers', []);
    controllerModule
        .controller('IndexCtrl', ['$scope', '$injector', ($scope, $injector) =>{
            $scope.injectorLoaded = false;
            require(['supplier/controllers/index'], (IndexController) =>{
                $injector.invoke(IndexController, this, {'$scope': $scope});
                $scope.$digest();
            });
        }])
        .controller('FunctionCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {
                $rootScope.tab = 'function';
                $('a[href^="#"]', '#partials').click(e => {
                    e.preventDefault();
                });

                let featureQ = $http.post('/agent', {
                    module: 'supplier',
                    partial: 'function',
                    api: 'get_feature',
                    param: {ssv_user_id: $rootScope.ssv_user_id}
                }).then(body => {
                    if (body && body.data && body.data.user_desc) {
                        $scope.ssv_feature = body.data.user_desc;
                    }
                }, why => {
                    $rootScope.alert(why);
                });
                $scope.$on('$viewContentLoaded',event => { featureQ.finally(()=>{$scope.injectorLoaded = true;$rootScope.removeLoading();})});
            }])
        .controller('AllCommentCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {
                $rootScope.tab = 'allComment';
                $('a[href^="#"]', '#partials').click(e => {
                    e.preventDefault();
                });

                $scope.comments = [];

                $scope.searcher = () => {
                    $scope.loading = true;
                    return $http.post('/agent', {
                        module: 'supplier',
                        partial: 'all-comment',
                        api: 'comments',
                        param: {ssv_user_id: $rootScope.ssv_user_id}
                    }).then(body => {
                        let totalPages = (typeof body.data.page_count == 'number') ? body.data.page_count : (new Number(body.data.page_count));
                        if (body.data.data_list && body.data.data_list.length) {
                            $.extend($scope.comments, body.data.data_list);
                        }
                        $scope.loading = false;
                    }, why => {
                        $scope.loading = false;
                        $rootScope.alert(why);
                    });
                };

                $scope.saveComment = () => {
                    if ($scope.commentForm.$invalid) {
                        $scope.commentForm.$error.required && $scope.commentForm.$error.required.forEach(r => {
                            r.$setDirty(true);
                        });
                        $('#flash').addClass('warn');
                        setTimeout(() => {
                            $('#flash').removeClass('warn');
                            //$('#loginPanel').removeClass('invalid');
                            $scope.$apply();
                        }, 1000)
                        return;
                    }
                    if (!$rootScope.profile) {
                        $rootScope.showAdvanced();
                        return;
                    }
                    $http.post('/agent', {
                        module: 'supplier',
                        partial: 'all-comment',
                        api: 'add',
                        param: {comment_content: $scope.comment_content_area, ssv_user_id: $scope.ssv_user_id}
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $scope.commentForm.$setPristine();
                            $scope.comment_content_area = "";
                            $scope.searcher();
                        } else {
                            $rootScope.alert(body.data.msg);
                        }
                    }, why => {
                        $rootScope.alert(why);
                    });
                }

                $scope.isCurrentSsv = () => {
                    if (!$rootScope.profile || !$rootScope.ssv_intro) {
                        return false;
                    }
                    return ($rootScope.profile.login_user_name == $rootScope.ssv_intro.user_name);
                }
                $scope.toggleReply = comment => {
                    comment._toggleReply = (!comment._toggleReply);
                }
                $scope.replyComment = comment => {
                    comment._toggleReply = (!comment._toggleReply);
                    setTimeout(() => {
                        $http.post('/agent', {
                            module: 'supplier',
                            partial: 'all-comment',
                            api: 'reply',
                            param: {
                                comment_id: comment.comment_id,
                                comment_content: comment._comment_content,
                                ssv_user_id: $scope.ssv_user_id
                            }
                        })
                            .then(body => {
                                if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                                    delete comment._comment_content;
                                    $scope.searcher();
                                } else {
                                    $rootScope.alert(body.data.msg);
                                }
                            }, why => {
                                $rootScope.alert(why);
                            });
                    }, 400);
                }
                $scope.isCreator = comment => {
                    if (!$rootScope.profile || !comment) {
                        return false;
                    }
                    return ($rootScope.profile.login_user_name == comment.create_user);
                }
                $scope.deleteComment = (comment, comments) => {
                    $http.post('/agent', {
                        module: 'supplier',
                        partial: 'all-comment',
                        api: 'delete',
                        param: {comment_id: comment.comment_id}
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            $scope.comment_content_area = "";
                            comments.splice(comments.indexOf(comment), 1);
                        } else {
                            $rootScope.alert(body.data.msg);
                        }
                    }, why => {
                        $rootScope.alert(why);
                    });
                }

                $scope.checkID = () => {
                    if (!$rootScope.profile) {
                        return false;
                    }

                    if ($rootScope.profile.id == $scope.ssv_user_id) {
                        return true;
                    }

                    return true;
                }
                $scope.$on('$viewContentLoaded',event => { $scope.searcher().finally(()=>{$scope.injectorLoaded = true;$rootScope.removeLoading();})});
            }])
        .controller('APICtrl', ['$scope', '$injector', ($scope, $injector) =>{
            $scope.injectorLoaded = false;
            require(['supplier/controllers/api'], (APIController) =>{
                $injector.invoke(APIController, this, {'$scope': $scope});
                $scope.$digest();
            });
        }])
        .controller('InfoCtrl', ['$rootScope', '$scope', '$http',
            ($rootScope, $scope, $http) => {
                $rootScope.tab = 'info';
                $('a[href^="#"]', '#partials').click(e => {
                    e.preventDefault();
                });

                $scope.infos = [];
                let pageIndex = 1;
                let pageSize = 6;

                $scope.searcher = () => {
                    $scope.loading = true;
                    return $http.post('/agent', {
                        module: 'supplier',
                        partial: 'info',
                        api: 'infos',
                        param: {pageindex: pageIndex, pagesize: pageSize, ssv_user_id: $rootScope.ssv_user_id}
                    }).then(body => {
                        let totalPages = (typeof body.data.page_count == 'number') ? body.data.page_count : (new Number(body.data.page_count));
                        if (totalPages >= pageIndex) {
                            if (body.data.data_list && body.data.data_list.length) {
                                body.data.data_list.forEach((r, i) => {
                                    $scope.infos.push(r);
                                });
                                pageIndex++;
                            } else {
                                $scope.loaded = true;
                            }
                        } else {
                            $scope.loaded = true;
                        }

                        $scope.loading = false;
                    }, why => {
                        $scope.loading = false;
                        $rootScope.alert(why);
                    });
                };
                window.test = $scope;

                $scope.$on('$viewContentLoaded',event => { $scope.searcher().finally(()=>{$scope.injectorLoaded = true;$rootScope.removeLoading();})});
            }]);
});
