/**
 * Created by robin on 22/11/2016.
 */
define(['../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$location', '$http','$timeout','$mdDialog','MiscTool',
        ($rootScope, $scope, $q, $location, $http, $timeout,$mdDialog,MiscTool) => {
            $rootScope.tab = "caution";

            $scope.mode = 0;
            $scope.selectMode = mode =>{
                if($scope.loading || $scope.refreshing){
                    return;
                }
                if(mode == 0){
                    $scope.mode = mode;
                } else if (mode == 1){
                    sysErrorQ.then(()=>{
                        $scope.mode = mode;
                    });
                } else if (mode == 2){
                    urlErrorQ.then(()=>{
                        $scope.mode = mode;
                    });
                }
            }
            $scope.loading = true;
            $scope.apiKeyword = "";
            $scope.apiInterval = "";
            $scope.apiCountdown = "";
            $scope.sysKeyword = "";
            $scope.sysInterval = "";
            $scope.sysCountdown = "";
            $scope.urlKeyword = "";
            $scope.urlInterval = "";
            $scope.urlCountdown = "";
            $scope.urlTimeout = "";
            // mode 0 情况
            let apiQ = $rootScope.ajax("api_list").then(data=>{
                    $scope.api_list = data.data_list;
                    return $scope.selectAPI($scope.api_list[0])
                }).finally(()=>{$scope.loading = false;}),
                getMailQ = ()=>$rootScope.ajax("mail_list").then(data=>{
                    $scope.mail_error_list = data.data_list;
                    $scope.mailGetter = ()=>{return $scope.mail_error_list.map(r=>r.user_mail).join(";")};
                    return data;
                }),
                mailQ = getMailQ(),
                getMobileQ = ()=>$rootScope.ajax("mobile_list").then(data=>{
                    $scope.mobile_error_list = data.data_list;
                    $scope.mobileGetter = ()=>{return $scope.mobile_error_list.map(r=>r.user_mobile).join(";")};
                    return data;
                }),
                mobileQ = getMobileQ(),
                getSysError = ()=>$rootScope.ajax("sys_error_list").then(data=>{
                    $scope.sys_error = data;
                }), sysErrorQ = getSysError(),
                getUrlError = ()=>$rootScope.ajax("url_list").then(data=>{
                    $scope.url_error = data;
                }), urlErrorQ = getUrlError();

            $scope.reset = ()=>{
                if($scope.loading || $scope.refreshing){
                    return;
                }
                if($scope.mode == 0){
                    apiQ.then(()=>{
                        return $scope.api_list && $scope.api_list[0] ? $scope.selectAPI($scope.api_list[0]): undefined;
                    });
                } else if ($scope.mode == 1){
                    $scope.refreshing = true;
                    sysErrorQ = getSysError().finally(()=>{$scope.refreshing = false;});
                } else if ($scope.mode == 2){
                    $scope.refreshing = true;
                    urlErrorQ = getUrlError().finally(()=>{$scope.refreshing = false;});
                }
            }
            $scope.api_error_all = [];
            $scope.selectAPI = api=>{
                if($scope.api_list){
                    $scope.api_list._selected = api;
                    $scope.refreshing = true;
                    return $rootScope.ajax("error_list",{
                        api_id:api.api_id
                    }).then(data=>{
                        $scope.api_error = data;
                        $scope.api_error_all = (data.error_list || []).concat([data.error_main]);
                        $scope.getAPIErrorAll = ()=>(data.error_list || []).concat([data.error_main]);
                    }).finally(()=>{$scope.refreshing = false;});;
                } else {
                    return $q.reject();
                }
            };
            $scope.apiErrorSave = ()=>apiQ.then(()=>{
                if($scope.refreshing){
                    return;
                }
                if ($scope.alarmForm.$invalid) {
                    $scope.alarmForm.$error.required && $scope.alarmForm.$error.required.forEach(r => {r.$setDirty(true);});
                    $scope.alarmForm.$error.pattern && $scope.alarmForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                    $scope.alarmForm.$error.maxlength && $scope.alarmForm.$error.maxlength.forEach(r => {r.$setDirty(true);});
                    $scope.alarmForm.$error.email && $scope.alarmForm.$error.email.forEach(r => {r.$setDirty(true);});
                    return;
                }

                if($scope.api_list){
                    $scope.refreshing = true;
                    let error_list = $scope.api_error.error_list.concat([$scope.api_error.error_main]);
                    for(var i=0;i<error_list.length;i++){
                        !error_list[i].main_flag && (error_list[i].main_flag = "0");
                        /*!error_list[i].error_id && (error_list[i].other_desc = error_list[i].error_desc);*/
                    }
                    return $rootScope.ajax("error_save",{
                        api_id:$scope.api_list._selected.api_id,
                        error_list:error_list
                    }).then(data=>{
                        return $scope.selectAPI($scope.api_list._selected);
                    }).finally(()=>{$scope.refreshing = false;});
                } else {
                    return $q.reject();
                }
            });
            $scope.apiLocate = ()=>apiQ.then(()=>{
                if($scope.api_list){
                    var list = [].concat.apply([],$scope.api_list.map((r,v)=>(((r.api_name.indexOf($scope.apiKeyword) != -1)||(r.api_title.indexOf($scope.apiKeyword) != -1))?[v]:[])));
                    $scope.apiTopIndex = list[0];
                } else {
                    return $q.reject();
                }
            });
            $scope.apiLocateNext = ()=>apiQ.then(()=>{
                if($scope.api_list){
                    var list = [].concat.apply([],$scope.api_list.map((r,v)=>(((r.api_name.indexOf($scope.apiKeyword) != -1)||(r.api_title.indexOf($scope.apiKeyword) != -1))?[v]:[])));
                    for(var i=0;i<list.length;i++){
                        if(list[i]>$scope.apiTopIndex) {
                            $scope.apiTopIndex = list[i];
                            break;
                        } else if (i == (list.length -1)){
                            $scope.apiTopIndex = list[0];
                        }
                    }
                } else {
                    return $q.reject();
                }
            });

            $scope.sysLocate = ()=>sysErrorQ.then(()=>{
                if($scope.sys_error&&$scope.sys_error.api_list){
                    var list = [].concat.apply([],$scope.sys_error.api_list.map((r,v)=>(((r.api_name.indexOf($scope.sysKeyword) != -1)||(r.api_title.indexOf($scope.sysKeyword) != -1))?[v]:[])));
                    $scope.sysTopIndex = list[0];
                } else {
                    return $q.reject();
                }
            });
            $scope.sysLocateNext = ()=>sysErrorQ.then(()=>{
                if($scope.sys_error&&$scope.sys_error.api_list){
                    var list = [].concat.apply([],$scope.sys_error.api_list.map((r,v)=>(((r.api_name.indexOf($scope.sysKeyword) != -1)||(r.api_title.indexOf($scope.sysKeyword) != -1))?[v]:[])));
                    for(var i=0;i<list.length;i++){
                        if(list[i]>$scope.sysTopIndex) {
                            $scope.sysTopIndex = list[i];
                            break;
                        } else if (i == (list.length -1)){
                            $scope.sysTopIndex = list[0];
                        }
                    }
                } else {
                    return $q.reject();
                }
            });
            $scope.sysErrorSave = ()=>sysErrorQ.then(()=>{
                if($scope.refreshing){
                    return;
                }
                let list = [].concat.apply([],$scope.sys_error.api_list.map((r,i)=>(r.check_flag == "1")?[{api_id:r.api_id}]:[]));
                if ($scope.systemForm.$invalid) {
                    $scope.systemForm.$error.required && $scope.systemForm.$error.required.forEach(r => {r.$setDirty(true);});
                    $scope.systemForm.$error.pattern && $scope.systemForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                    $scope.systemForm.$error.maxlength && $scope.systemForm.$error.maxlength.forEach(r => {r.$setDirty(true);});
                    $scope.systemForm.$error.email && $scope.systemForm.$error.email.forEach(r => {r.$setDirty(true);});
                    return;
                }
                if(!list.length){
                    $rootScope.alert("请选择至少一条API");
                    return;
                }

                if($scope.sys_error && $scope.sys_error.api_list && $scope.sys_error.api_list.length && $scope.sys_error.error_list && $scope.sys_error.error_list.length){
                    $scope.refreshing = true;
                    return $rootScope.ajax("sys_error_save",{
                        api_list:list,
                        error_list:$scope.sys_error.error_list
                    }).then(data=>{
                        sysErrorQ = getSysError();
                        return sysErrorQ;
                    }).finally(()=>{$scope.refreshing = false;});
                } else {
                    return $q.reject();
                }
            });

            $scope.urlLocate = ()=>urlErrorQ.then(()=>{
                if($scope.url_error&&$scope.url_error.data_list){
                    var list = [].concat.apply([],$scope.url_error.data_list.map((r,v)=>(((r.caution_title.indexOf($scope.urlKeyword) != -1)||(r.caution_url.indexOf($scope.urlKeyword) != -1))?[v]:[])));
                    angular.element("#urlScroller")[0].scrollTop = 40*list[0];
                    if(list[0]){
                        $scope.urlTopIndex = list[0];
                    } else {
                        $scope.urlTopIndex = undefined;
                    }
                } else {
                    return $q.reject();
                }
            });
            $scope.urlLocateNext = ()=>urlErrorQ.then(()=>{
                if($scope.url_error&&$scope.url_error.data_list){
                    var list = [].concat.apply([],$scope.url_error.data_list.map((r,v)=>(((r.caution_title.indexOf($scope.urlKeyword) != -1)||(r.caution_url.indexOf($scope.urlKeyword) != -1))?[v]:[])));
                    for(var i=0;i<list.length;i++){
                        if(list[i]>$scope.urlTopIndex) {
                            $scope.urlTopIndex = list[i];
                            break;
                        } else if (i == (list.length -1)){
                            $scope.urlTopIndex = list[0];
                        }
                    }
                    angular.element("#urlScroller")[0].scrollTop = 40*$scope.urlTopIndex;
                } else {
                    return $q.reject();
                }
            });
            $scope.urlErrorSave = ()=>urlErrorQ.then(()=>{
                if($scope.refreshing){
                    return;
                }
                if ($scope.urlForm.$invalid) {
                    $scope.urlForm.$error.required && $scope.urlForm.$error.required.forEach(r => {r.$setDirty(true);});
                    $scope.urlForm.$error.pattern && $scope.urlForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                    $scope.urlForm.$error.maxlength && $scope.urlForm.$error.maxlength.forEach(r => {r.$setDirty(true);});
                    $scope.urlForm.$error.email && $scope.urlForm.$error.email.forEach(r => {r.$setDirty(true);});
                    return;
                }

                for(var i=0;i<$scope.url_error.data_list.length;i++){
                    var item =$scope.url_error.data_list[i];
                    if((item.mail_flag != "1") && (item.sms_flag != "1")){
                        item.caution_switch = "0"
                    } else {
                        item.caution_switch = "1"
                    };
                }
                if($scope.url_error&&$scope.url_error.data_list){
                    $scope.refreshing = true;
                    return $http.post('/agent', {
                        module: "application",
                        partial: $rootScope.tab,
                        api: "url_save",
                        param: {url_list:$scope.url_error.data_list}
                    }).then(body => {
                        if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                            urlErrorQ = getUrlError();
                            $scope.urlKeyword = "";
                            return urlErrorQ;
                        } else {
                            $rootScope.alert(body.data.msg);
                            $scope.urlKeyword = body.data.sub_msg;
                            $scope.urlLocate();
                        }
                    }, why => {
                        $rootScope.alert(why);
                        return $q.reject(why);
                    }).finally(()=>{$scope.refreshing = false;});
                } else {
                    return $q.reject();
                }
            });
            $scope.isSMSRequired = row => row?(row.sms_flag == "1")&&(!$scope.mobile_error_list || !$scope.mobile_error_list.length):false;
            $scope.isMailRequired = row => row?(row.mail_flag == "1")&&(!$scope.mail_error_list || !$scope.mail_error_list.length):false;

            let MailController = (scope, mail_list)=> {
                scope.mail_list = JSON.parse(JSON.stringify(mail_list));
                scope.append = list=>$scope.append(list,"#"+scope.uniqueID);
                scope.splice = $scope.splice;
                scope.uniqueID = String(new Date().getTime());
                scope.title = "全局邮件报警设置";
                let regardless = undefined;
                scope.saveMail = ()=>{
                    if(scope.refreshing){return;}
                    if (scope.mailForm.$invalid) {
                        scope.mailForm.$error.required && scope.mailForm.$error.required.forEach(r => {r.$setDirty(true);});
                        scope.mailForm.$error.pattern && scope.mailForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                        scope.mailForm.$error.email && scope.mailForm.$error.email.forEach(r => {r.$setDirty(true);});
                        return;
                    }
                    if(scope.mail_list && !scope.mail_list.length){
                        scope.error="清空全局报警邮箱会引起部分自定义邮箱报警设置无法使用";
                        return;
                    }

                    var mail_error_list_length = scope.mail_list && scope.mail_list.length || 0, uniqueList = [ ...new Set((scope.mail_list||[]).map(r=>r.user_mail))]
                    if(!regardless && (uniqueList.length < mail_error_list_length)){
                        scope.error = "系统将对重复的数据做合并处理";
                        regardless = true;
                        return $q.reject();
                    } else {
                        scope.refreshing = true;
                        return $http.post('/agent', {
                            module: "application",
                            partial: $rootScope.tab,
                            api: "mail_save",
                            param: {mail_list:scope.mail_list}
                        }).then(body => {
                            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                                mailQ = getMailQ().then(data=>{
                                    scope.close();
                                    return data;
                                });
                                return mailQ;
                            } else {
                                scope.error = body.data.msg;
                                return $q.reject(body.data.msg);
                            }
                        }, why => {
                            scope.error = why;
                            return $q.reject(why);
                        }).finally(()=>{scope.refreshing = false;});
                    }
                }
                scope.close = () => {
                    $mdDialog.hide()
                };
            }, RowMailController = (scope, row)=> {
                scope.mail_list = row&&row.caution_mail?row.caution_mail.split(";").map(r=>{return {user_mail:r}}):[];
                scope.append = list=>$scope.append(list,"#"+scope.uniqueID);
                scope.splice = $scope.splice;
                scope.uniqueID = String(new Date().getTime());
                scope.title = "自定义邮件报警设置";
                let regardless = undefined;
                scope.saveMail = ()=>{
                    if (scope.mailForm.$invalid) {
                        scope.mailForm.$error.required && scope.mailForm.$error.required.forEach(r => {r.$setDirty(true);});
                        scope.mailForm.$error.pattern && scope.mailForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                        scope.mailForm.$error.email && scope.mailForm.$error.email.forEach(r => {r.$setDirty(true);});
                        return;
                    }
                    var mail_error_list_length = scope.mail_list && scope.mail_list.length || 0, uniqueList = [ ...new Set((scope.mail_list||[]).map(r=>r.user_mail))]
                    if(!regardless && (uniqueList.length < mail_error_list_length)){
                        scope.error = "系统将对重复的数据做合并处理";
                        regardless = true;
                        return;
                    } else {
                        row.caution_mail = [ ...new Set(scope.mail_list.map(r=>r.user_mail))].join(";");
                        scope.close();
                    }
                }
                scope.close = () => {
                    $mdDialog.hide();
                };
            }, mailerTemplate = `
                                <md-dialog aria-label="邮箱报警设置" class="quick-edit" aria-describedby="quick edit">
                                    <md-toolbar>
                                        <div class="md-toolbar-tools">
                                            <md-icon md-svg-icon="communication:ic_mail_outline_24px"></md-icon>
                                            <h3><span ng-bind='title'></span></h3>
                                            <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">
                                                <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>
                                            </md-button>
                                        </div>
                                    </md-toolbar>
                                
                                    <md-dialog-content>
                                        <div class="md-dialog-content" >
                                            <form name="mailForm" class="table-wrapper" autocomplete="off">
                                                <table cellspacing="0" class="md-datatable fixed">
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            <md-icon md-svg-icon="content:ic_add_24px" class="expander" ng-click="append(mail_list)"></md-icon>
                                                        </th>
                                                        <th>
                                                            <span>邮箱名称</span>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                                <div class="scroller" id="{{uniqueID}}">
                                                    <table cellspacing="0" class="md-datatable">
                                                        <tbody>
                                                        <tr ng-repeat="mail in mail_list">
                                                            <td>
                                                                <md-icon md-svg-icon="content:ic_remove_24px" class="collapser" ng-click="splice(mail_list,mail)"></md-icon>
                                                            </td>
                                                            <td class="blend-wrapper">
                                                                <input type="text" class="blend" name="user_mail{{$index}}" placeholder="请输入报警邮箱" ng-model="mail.user_mail" required pattern="^((?=[\\w\\.])[^;])+?@((?=[\\w\\.])[^;])+$"/>
                                                            </td>
                                                        </tr>
                                                        </tbody>                            
                                                    </table>
                                                </div>
                                                <div class="app-loading" ng-if="refreshing">
                                                    <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                                                </div>
                                            </form>
                                        </div>
                                    </md-dialog-content>
                                    
                                    <md-dialog-actions layout="row">
                                        <div class="message" ng-if="error">
                                            <span ng-bind="error"></span>
                                        </div>
                                      <md-button ng-click="saveMail()">保存</md-button>
                                    </md-dialog-actions>
                                </md-dialog>
                            `;

            $scope.mailer = (ev)=>{
                mailQ.then(data=>{
                    $mdDialog.show({
                        controller: MailController,
                        template:mailerTemplate,
                        parent: angular.element("body>section>md-content"),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {mail_list:data.data_list}
                    });
                    return data;
                });
            };
            $scope.rowMailer = (row, ev)=>{
                $mdDialog.show({
                    controller: RowMailController,
                    template:mailerTemplate,
                    parent: angular.element("body>section>md-content"),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {row:row}
                });
            };

            let MobileController = (scope, mobile_list)=> {
                scope.mobile_list = JSON.parse(JSON.stringify(mobile_list));
                scope.append = list=>$scope.append(list,"#"+scope.uniqueID);
                scope.splice = $scope.splice;
                scope.title = "全局短信报警设置";
                scope.uniqueID = String(new Date().getTime());
                let regardless = undefined;
                scope.saveMobile = ()=>{
                    if(scope.refreshing){return;}
                    if (scope.mobileForm.$invalid) {
                        scope.mobileForm.$error.required && scope.mobileForm.$error.required.forEach(r => {r.$setDirty(true);});
                        scope.mobileForm.$error.pattern && scope.mobileForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                        return;
                    }
                    if(scope.mobile_list && !scope.mobile_list.length){
                        scope.error="清空全局报警手机会引起部分自定义短信报警设置无法使用";
                        return;
                    }
                    var mobile_error_list_length = scope.mobile_list && scope.mobile_list.length || 0,uniqueList = [ ...new Set((scope.mobile_list||[]).map(r=>r.user_mobile))];
                    if(!regardless && (uniqueList.length < mobile_error_list_length)){
                        scope.error = "系统将对重复的数据做合并处理";
                        regardless = true;
                        return $q.reject();
                    } else {
                        scope.refreshing = true;
                        return $http.post('/agent', {
                            module: "application",
                            partial: $rootScope.tab,
                            api: "mobile_save",
                            param: {mobile_list:scope.mobile_list}
                        }).then(body => {
                            if (((typeof body.data.is_success == 'boolean') && body.data.is_success) || ((typeof body.data.is_success == 'string') && (body.data.is_success == 'true'))) {
                                mobileQ = getMobileQ().then(data=>{
                                    scope.close();
                                    return data;
                                });
                                return mobileQ;
                            } else {
                                scope.error = body.data.msg;
                                return $q.reject(body.data.msg);
                            }
                        }, why => {
                            scope.error = why;
                            return $q.reject(why);
                        }).finally(()=>{scope.refreshing = false;});
                    }
                }
                scope.close = () => {
                    $mdDialog.hide()
                };
            }, RowMobileController = (scope, row)=> {
                scope.mobile_list = row&&row.caution_mobile?row.caution_mobile.split(";").map(r=>{return {user_mobile:r}}):[];
                scope.append = list=>$scope.append(list,"#"+scope.uniqueID);
                scope.splice = $scope.splice;
                scope.title = "自定义短信报警设置";
                scope.uniqueID = String(new Date().getTime());
                let regardless = undefined;
                scope.saveMobile = ()=>{
                    if (scope.mobileForm.$invalid) {
                        scope.mobileForm.$error.required && scope.mobileForm.$error.required.forEach(r => {r.$setDirty(true);});
                        scope.mobileForm.$error.pattern && scope.mobileForm.$error.pattern.forEach(r => {r.$setDirty(true);});
                        return;
                    }
                    var mobile_error_list_length = scope.mobile_list && scope.mobile_list.length || 0,uniqueList = [ ...new Set((scope.mobile_list||[]).map(r=>r.user_mobile))];
                    if(!regardless && (uniqueList.length < mobile_error_list_length)){
                        scope.error = "系统将对重复的数据做合并处理";
                        regardless = true;
                        return;
                    } else {
                        row.caution_mobile = [ ...new Set(scope.mobile_list.map(r=>r.user_mobile))].join(";");
                        scope.close();
                    }
                }
                scope.close = () => {
                    $mdDialog.hide()
                };
            },mobilerTemplate = `
                                <md-dialog aria-label="用户提醒" class="quick-edit" aria-describedby="quick edit">
                                    <md-toolbar>
                                        <div class="md-toolbar-tools">
                                            <md-icon class="" md-svg-icon="hardware:ic_phone_iphone_24px"></md-icon>
                                            <h3><span ng-bind='title'></span></h3>
                                            <md-button class="md-icon-button md-primary md-hue-1" aria-label="Settings" ng-click="close()">
                                                <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>
                                            </md-button>
                                        </div>
                                    </md-toolbar>
                                
                                    <md-dialog-content>
                                        <div class="md-dialog-content" >
                                            <form name="mobileForm" class="table-wrapper" autocomplete="off">
                                                <table cellspacing="0" class="md-datatable fixed">
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            <md-icon md-svg-icon="content:ic_add_24px" class="expander" ng-click="append(mobile_list)"></md-icon>
                                                        </th>
                                                        <th>
                                                            <span>手机号码</span>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                                <div class="scroller" id="{{uniqueID}}">
                                                    <table cellspacing="0" class="md-datatable">
                                                        <tbody>
                                                        <tr ng-repeat="mobile in mobile_list">
                                                            <td>
                                                                <md-icon md-svg-icon="content:ic_remove_24px" class="collapser" ng-click="splice(mobile_list,mobile)"></md-icon>
                                                            </td>
                                                            <td class="blend-wrapper">
                                                                <input type="text" class="blend" name="user_mobile{{$index}}" placeholder="请输入手机号码" ng-model="mobile.user_mobile" required pattern="1\\d{10}"/>
                                                            </td>
                                                        </tr>
                                                        </tbody>                            
                                                    </table>
                                                </div>
                                                <div class="app-loading" ng-if="refreshing">
                                                    <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                                                </div>
                                            </form>
                                        </div>
                                    </md-dialog-content>
                                    
                                    <md-dialog-actions layout="row">
                                        <div class="message" ng-if="error">
                                            <span ng-bind="error"></span>
                                        </div>
                                      <md-button ng-click="saveMobile()">保存</md-button>
                                    </md-dialog-actions>
                                </md-dialog>
                            `;

            $scope.mobiler = (ev)=>{
                mobileQ.then(data=>{
                    $mdDialog.show({
                        controller: MobileController,
                        template: mobilerTemplate,
                        targetEvent: ev,
                        parent: angular.element("body>section>md-content"),
                        clickOutsideToClose: true,
                        locals: {mobile_list:data.data_list}
                    });
                    return data;
                });
            };
            $scope.rowMobiler = (row, ev)=>{
                //angular.element(ev.target).blur();
                $mdDialog.show({
                    controller: RowMobileController,
                    template:mobilerTemplate,
                    targetEvent: ev,
                    parent: angular.element("body>section>md-content"),
                    clickOutsideToClose: true,
                    locals: {row:row}
                });
            };

            $scope.toggleAll = (list, props)=>{
                var allChecked = $scope.allChecked(list,props);
                if(list&&list.length){
                    if(allChecked){
                        for(var i=0;i<list.length;i++){
                            list[i][props] = "0";
                        }
                    } else {
                        for(var i=0;i<list.length;i++){
                            list[i][props] = "1";
                        }
                    }
                }
            }
            $scope.allChecked = (list, props)=>(list&&list.length?![].concat.apply([],list.map((r,i)=>((r[props] != "1")?[r]:[]))).length:0);
            $scope.append = MiscTool.append;
            $scope.splice = MiscTool.splice;
            $scope.unifyList = (list, props, value)=>{
                if(value === undefined){return;}
                for(var i=0;i<list.length;i++){
                    list[i][props] = (value || "");
                }
            }
            $scope.$watch(()=>{
                return angular.element("#caution-main").width()
            }, width=>{
                $scope.mainWidth = width;
                $timeout(()=>{
                    let myWidth = angular.element("#caution-main").width();
                    $scope.mainWidth = myWidth;
                },500);
            })
            $scope.injectorLoaded = true;
            window.test = $scope;
            //$scope.$on("$destroy", event => {});
        }];
});
