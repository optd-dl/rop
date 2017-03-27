/**
 * Created by robin on 22/11/2016.
 */
define(['require','angular','../services'], function (require, angular) {
    'use strict';

    let controllerModule = angular.module('application.controllers', ['rop.services']);
    controllerModule
        .controller('FrameCtrl', ['$rootScope', '$scope','$stateParams',
            ($rootScope, $scope , $stateParams) => {
                $rootScope.tab = "frame";
                $rootScope.validateEntry().then((isOld)=>{
                    $scope.src = $stateParams.src;
                },why=>{
                    $rootScope.alert(why);
                }).finally(()=>{
                    $scope.injectorLoaded = true;
                });
            }])
        .controller('ErrorCtrl', ['$rootScope', '$scope','$stateParams',
            ($rootScope, $scope , $stateParams) => {
                $rootScope.tab = "error";
                $rootScope.removeLoading();
                $scope.error = $stateParams.error;
                $scope.injectorLoaded = true;
            }])
        .controller('APICtrl', ['$rootScope','$scope', '$location','$injector','$timeout','ModuleLoader', ($rootScope, $scope, $location, $injector,$timeout,ModuleLoader) =>{
            $scope.injectorLoaded = false;
            var self = this;

            ModuleLoader.reload('angularDNDL','*[dnd-list]',$scope).then(()=>{
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/api'], (APIController) =>{
                        let injector = ()=>{
                            $injector.invoke(APIController, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            });
        }])
        .controller('DomainCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
            $scope.injectorLoaded = false;
            var self = this;
            $rootScope.validateEntry().then((isOld)=>{
                if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                require(['application/controllers/domain'], (DomainController) =>{
                    let injector = ()=>{
                        $injector.invoke(DomainController, self, {'$scope': $scope});
                        $scope.$digest();
                    }
                    $rootScope.tab ? injector.call():$timeout(injector,300);
                });
            },why=>{
                $rootScope.alert(why);
                $scope.injectorLoaded = true;
            });
        }])
        .controller('AppCtrl', ['$rootScope', '$scope', '$location', '$injector', '$timeout', ($rootScope, $scope, $location, $injector, $timeout) => {
          $scope.injectorLoaded = false;
          var self = this;
          $rootScope.validateEntry().then((isOld) => {
            if (isOld) { $rootScope.go("frame", { src: `/frame/${$location.path()}` });
              return; }
            require(['application/controllers/app_list'], (AppListCtrl) => {
              let injector = () => {
                $injector.invoke(AppListCtrl, self, { '$scope': $scope });
                $scope.$digest();
              }
              $rootScope.tab ? injector.call() : $timeout(injector, 300);
            });
          }, why => {
            $rootScope.alert(why);
            $scope.injectorLoaded = true;
          });
        }])
        .controller('ISVAppCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
            var self = this;
            $rootScope.validateEntry().then((isOld)=>{
                if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                require(['application/controllers/isv_app'], (ISVAppCtrl) =>{
                    let injector = ()=>{
                        $injector.invoke(ISVAppCtrl, self, {'$scope': $scope});
                        $scope.$digest();
                    }
                    $rootScope.tab ? injector.call():$timeout(injector,300);
                });
            },why=>{
                $rootScope.alert(why);
                $scope.injectorLoaded = true;
            });
        }])
        .controller('EnvironmentCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "env";
                $rootScope.validateEntry();
                $scope.injectorLoaded = true;
            }])
        .controller('EnvironmentAppCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
                //$rootScope.tab = "envApp";
                $scope.injectorLoaded = false;
                var self = this;
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/env_app'], (EnvironmentCtrl) =>{
                        let injector = ()=>{
                            $injector.invoke(EnvironmentCtrl, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            }])
        .controller('EnvironmentSetCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
            //$rootScope.tab = "envSet";
            $scope.injectorLoaded = false;
            var self = this;
            $rootScope.validateEntry().then((isOld)=>{
                if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                require(['application/controllers/env_set'], (EnvironmentCtrl) =>{
                    let injector = ()=>{
                        $injector.invoke(EnvironmentCtrl, self, {'$scope': $scope});
                        $scope.$digest();
                    }
                    $rootScope.tab ? injector.call():$timeout(injector,300);
                });
            },why=>{
                $rootScope.alert(why);
                $scope.injectorLoaded = true;
            });
        }])
        .controller('APIFlowCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "flow";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
                //$scope.$on('$viewContentLoaded', event => {});
            }])
        .controller('APICautionCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
                $scope.injectorLoaded = false;
                var self = this;
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/caution'], (EnvironmentCtrl) =>{
                        let injector = ()=>{
                            $injector.invoke(EnvironmentCtrl, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });

                //$scope.$on('$viewContentLoaded', event => {});
            }])
        .controller('CategoryCtrl', ['$rootScope','$scope', '$location', '$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
                $scope.injectorLoaded = false;
                var self = this;
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/category'], (CategoryCtrl) =>{
                        let injector = ()=>{
                            $injector.invoke(CategoryCtrl, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            }])
	    .controller('CategoryGroupCtrl', ['$rootScope', '$scope', '$location', '$injector', '$timeout', ($rootScope, $scope, $location, $injector, $timeout) =>{
	    	$scope.injectorLoaded = false;
	    	let self = this;
	    	$rootScope.validateEntry().then((isOld)=>{
                if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
	    		require(['application/controllers/category_group'], (CategoryGroupCtrl)=>{
	    			let injector = ()=>{
	    				$injector.invoke(CategoryGroupCtrl, self, {'$scope': $scope});
	    				$scope.$digest();
				    }
				    $rootScope.tab ? injector.call():$timeout(injector, 300);
			    });
		    }, why=>{
			    $rootScope.alert(why);
	    		$scope.injectorLoaded = true;
		    });
	    }])
        .controller('NoApplyCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "noapply";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('AuthorityCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "auth";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('MailCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "mail";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('PingCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "ping";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('SandboxLogAssistCtrl', ['$rootScope','$scope', '$location','$injector', '$timeout','ModuleLoader',($rootScope, $scope, $location, $injector,$timeout,ModuleLoader) =>{
            $scope.injectorLoaded = false;
            var self = this;
            ModuleLoader.reload('angularCalendar','rop-date-range-picker',$scope).then(()=>{
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/assist_sandbox'], (assistSandboxController) =>{
                        let injector = ()=>{
                            $injector.invoke(assistSandboxController, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                }, why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            });
        }])
        .controller('LogAssistCtrl', ['$rootScope','$scope', '$location','$injector','$timeout','ModuleLoader', ($rootScope, $scope, $location, $injector,$timeout,ModuleLoader) =>{
            $scope.injectorLoaded = false;
            var self = this;
            ModuleLoader.reload('angularCalendar','rop-date-range-picker',$scope).then(()=>{
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/assist'], (assistController) =>{
                        let injector = ()=>{
                            $injector.invoke(assistController, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            });
        }])
        .controller('SandboxLogAnalysisCtrl', ['$rootScope','$scope', '$location','$injector', '$timeout','ModuleLoader',($rootScope, $scope, $location, $injector,$timeout,ModuleLoader) =>{
            $scope.injectorLoaded = false;
            var self = this;
            ModuleLoader.reload('angularCalendar','rop-date-time-range-picker',$scope).then(()=>{
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/analysis_sandbox'], (analysisSandboxController) => {
                        let injector = ()=>{
                            $injector.invoke(analysisSandboxController, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            });
        }])
        .controller('LogAnalysisCtrl', ['$rootScope','$scope', '$location','$injector','$timeout','ModuleLoader', ($rootScope, $scope, $location, $injector,$timeout,ModuleLoader) =>{
            $scope.injectorLoaded = false;
            var self = this;
            ModuleLoader.reload('angularCalendar','rop-date-time-range-picker',$scope).then(()=>{
                $rootScope.validateEntry().then((isOld)=>{
                    if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/analysis'], (analysisController) => {
                        let injector = ()=>{
                            $injector.invoke(analysisController, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            });
        }])
        .controller('DownloadCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "download";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('DocCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "doc";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('NoticeCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "notice";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('ToolDownloadCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "tool";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('SDKCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "sdk";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('FunctionCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "func";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('SubUserCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$mdDialog',
            ($rootScope, $scope, $stateParams, $location, $mdDialog) => {
                $rootScope.tab = "subuser";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();
            }])
        .controller('DataRoleSetCtrl', ['$rootScope','$scope', '$location','$injector', '$timeout',($rootScope, $scope, $location, $injector,$timeout) =>{
                /*$rootScope.tab = "dataroleset";
                $scope.injectorLoaded = true;
                $rootScope.validateEntry();*/

                $scope.injectorLoaded = false;
                var self = this;
                $rootScope.validateEntry().then((isOld)=>{
                    // TODO 请解除comment
                    //if(isOld){$rootScope.go("frame",{src:`/frame/${$location.path()}`});return;}
                    require(['application/controllers/dataroleset'], (CategoryCtrl) =>{
                        let injector = ()=>{
                            $injector.invoke(CategoryCtrl, self, {'$scope': $scope});
                            $scope.$digest();
                        }
                        $rootScope.tab ? injector.call():$timeout(injector,300);
                    });
                },why=>{
                    $rootScope.alert(why);
                    $scope.injectorLoaded = true;
                });
            }]);
});
