"use strict";function getCookie(name){var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");return(arr=document.cookie.match(reg))?unescape(arr[2]):null}function formatXml(xml){var formatted="",reg=/(>)(<)(\/*)/g;xml=xml.replace(/>\s*</g,"><").replace(reg,"$1\r\n$2$3");var pad=0;return $.each(xml.split("\r\n"),function(index,node){var indent=0;node.match(/.+<\/\w[^>]*>$/)?indent=0:node.match(/^<\/\w/)?0!=pad&&(pad-=1):indent=node.match(/^<\w[^>]*[^\/]>.*$/)?1:0;for(var padding="",i=0;i<pad;i++)padding+="  ";formatted+=padding+node+"\r\n",pad+=indent}),formatted}function PlayJsQQPopWin(qq,site,hasMenu){setTimeout(function(){window.location.href="tencent://message/?uin="+qq+"&Site="+site+"&Menu="+hasMenu})}var _hmt=_hmt||[];!function(){var hm=document.createElement("script");hm.src="//hm.baidu.com/hm.js?ed13a730df72b0d9d0307dff4d8fdaeb";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)}(),window.bassdk={quick:function(){},track:function(){},userIdentify:function(){}},function($){function transitionEnd(){var el=document.createElement("bootstrap"),transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var name in transEndEventNames)if(void 0!==el.style[name])return{end:transEndEventNames[name]};return!1}$.event.special.destroyed={remove:function(o){o.handler&&o.handler()}},$.support.transition=transitionEnd();var addWithTransition=function($father,$child,direction,cb){"none"==$father.css("display")&&$father.show(0),$father.css({height:"auto",transition:"0.6s"});var childOption={transition:"0.6s",position:"relative",opacity:0},scope=this;childOption[direction]="20px",$child.css(childOption),$father.data("oldHeight",$father.height()),$father.append($child),$father.data("newHeight",$father.height()),$father.height($father.data("oldHeight")).height($father.data("newHeight")).one($.support.transition.end,function(){$father.css({height:"",transition:""})}),childOption.opacity=1,childOption[direction]=0,$child.css(childOption).one($.support.transition.end,function(){var childOption={transition:"",position:"",opacity:""};childOption[direction]="",$(this).css(childOption),cb&&cb.call(scope)})},detachWithTransition=function($father,$child,direction,cb){"none"==$father.css("display")&&$father.show(0),$father.css({height:"auto",transition:"0.6s"});var childOption={transition:"0.6s",position:"relative",opacity:1},scope=this;childOption[direction]="0",$child.css(childOption),$father.data("oldHeight",$father.height()),$child.hide(0),$father.data("newHeight",$father.height()),$child.show(0),childOption.opacity=0,childOption[direction]="20px",$child.css(childOption).one($.support.transition.end,function(){$child.detach(),cb&&cb.call(scope)}),$father.height($father.data("oldHeight")).height($father.data("newHeight")).one($.support.transition.end,function(){$father.css({height:"",transition:""})})};$.fn.appendWithTransition=function(dom,direction,cb){var $father=this,$test=$(dom),$child=$test?$test:dom;return addWithTransition($father,$child,direction?direction:"left",cb),this},$.fn.appendToWithTransition=function(dom,direction,cb){var $child=this,$test=$(dom),$father=$test?$test:dom;return addWithTransition($father,$child,direction?direction:"left",cb),this},$.fn.detachWithTransition=function(direction,cb){var $father=this.parent();return detachWithTransition($father,this,direction?direction:"left",cb),this};var originalAddEventListener=window.addEventListener,originalRemoveEventListener=window.removeEventListener;window.addEventListener=function(){!window.listenerStack&&(window.listenerStack={}),window.listenerStack[arguments[0]]=arguments[1],originalAddEventListener.apply(this,arguments)},window.removeEventListener=function(){!window.listenerStack&&(window.listenerStack={}),delete window.listenerStack[arguments[0]],originalRemoveEventListener.apply(this,arguments)},$.fn.consistentTransition=function(){var _this=this,rect=$.data(window,this.attr("rcp-id"));if(rect&&rect.hasOwnProperty("top")&&rect.el[0]!==this[0]){var newRect=window.getScreenRect(this,$("body")),transform="translate3d("+(rect.left-newRect.left)+"px, "+(rect.top-newRect.top)+"px, 0)";this.hide(0),this.css({"-webkit-transform":transform,transform:transform,width:newRect.width+"px",height:newRect.height+"px",transition:0}),this.show(0),this.css({"-webkit-transform":"translate3d(0,0,0)",transform:"translate3d(0,0,0)",width:rect.width+"px",height:rect.height+"px",transition:"all 300ms cubic-bezier(0.55, 0, 0.55, 0.2)"}).one($.support.transition.end,function(){_this.css({"-webkit-transform":"",transform:"",width:"",height:"",transition:""}),$.data(window,_this.attr("rcp-id"),$.extend({el:_this},window.getScreenRect(_this,$("body"))))})}else this.css({"-webkit-transform":"",transform:"",width:"",height:"",transition:""}),$.data(window,this.attr("rcp-id"),$.extend({el:this},window.getScreenRect(this,$("body"))))}}($),Date.prototype.Format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(fmt)&&(fmt=fmt.replace(RegExp.$1,(""+this.getFullYear()).substr(4-RegExp.$1.length)));for(var k in o)new RegExp("("+k+")").test(fmt)&&(fmt=fmt.replace(RegExp.$1,1==RegExp.$1.length?o[k]:("00"+o[k]).substr((""+o[k]).length)));return fmt},window.getBrowserType=function(){var is_chrome=navigator.userAgent.indexOf("Chrome")>-1,is_explorer=navigator.userAgent.indexOf("MSIE")>-1,is_firefox=navigator.userAgent.indexOf("Firefox")>-1,is_safari=navigator.userAgent.indexOf("Safari")>-1,is_opera=navigator.userAgent.toLowerCase().indexOf("op")>-1;return is_chrome&&is_safari&&(is_safari=!1),is_chrome&&is_opera&&(is_chrome=!1),is_explorer?"MSIE":is_firefox?"Firefox":is_opera?"op":is_safari?"Safari":is_chrome?"Chrome":null},window.getScreenRect=function(element,screen){var elementRect=element[0].getBoundingClientRect(),screenRect=screen[0].getBoundingClientRect();return{top:elementRect.top-screenRect.top,left:elementRect.left-screenRect.left,width:elementRect.width,height:elementRect.height}},window.clearSelection=function(){window.getSelection?window.getSelection().empty?window.getSelection().empty():window.getSelection().removeAllRanges&&window.getSelection().removeAllRanges():document.selection&&document.selection.empty()},window.ROPStyleConstant={loadingTime:0},String.prototype.plural=function(revert){var plural={"(quiz)$":"$1zes","^(ox)$":"$1en","([m|l])ouse$":"$1ice","(matr|vert|ind)ix|ex$":"$1ices","(x|ch|ss|sh)$":"$1es","([^aeiouy]|qu)y$":"$1ies","(hive)$":"$1s","(?:([^f])fe|([lr])f)$":"$1$2ves","(shea|lea|loa|thie)f$":"$1ves",sis$:"ses","([ti])um$":"$1a","(tomat|potat|ech|her|vet)o$":"$1oes","(bu)s$":"$1ses","(alias)$":"$1es","(octop)us$":"$1i","(ax|test)is$":"$1es","(us)$":"$1es","([^s]+)$":"$1s"},singular={"(quiz)zes$":"$1","(matr)ices$":"$1ix","(vert|ind)ices$":"$1ex","^(ox)en$":"$1","(alias)es$":"$1","(octop|vir)i$":"$1us","(cris|ax|test)es$":"$1is","(shoe)s$":"$1","(o)es$":"$1","(bus)es$":"$1","([m|l])ice$":"$1ouse","(x|ch|ss|sh)es$":"$1","(m)ovies$":"$1ovie","(s)eries$":"$1eries","([^aeiouy]|qu)ies$":"$1y","([lr])ves$":"$1f","(tive)s$":"$1","(hive)s$":"$1","(li|wi|kni)ves$":"$1fe","(shea|loa|lea|thie)ves$":"$1f","(^analy)ses$":"$1sis","((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$":"$1$2sis","([ti])a$":"$1um","(n)ews$":"$1ews","(h|bl)ouses$":"$1ouse","(corpse)s$":"$1","(us)es$":"$1",s$:""},irregular={move:"moves",foot:"feet",goose:"geese",sex:"sexes",child:"children",man:"men",tooth:"teeth",person:"people"},uncountable=["sheep","fish","deer","moose","series","species","money","rice","information","equipment"];if(uncountable.indexOf(this.toLowerCase())>=0)return this;for(var word in irregular){if(revert)var pattern=new RegExp(irregular[word]+"$","i"),replace=word;else var pattern=new RegExp(word+"$","i"),replace=irregular[word];if(pattern.test(this))return this.replace(pattern,replace)}if(revert)var array=singular;else var array=plural;for(var reg in array){var pattern=new RegExp(reg,"i");if(pattern.test(this))return this.replace(pattern,array[reg])}return this};
"use strict";var ssoApp=angular.module("SSOApp",["ui.router","ngAnimate","ngCookies","ngMaterial","ngMessages"]);ssoApp.config(function($mdThemingProvider){var customBlueMap=$mdThemingProvider.extendPalette("cyan",{contrastDefaultColor:"light",contrastDarkColors:["50"],50:"ffffff",300:"00C8AB",500:"00C5A3",800:"00A589",A100:"EEFCFF"});$mdThemingProvider.definePalette("customBlue",customBlueMap),$mdThemingProvider.theme("default").primaryPalette("customBlue",{"default":"500","hue-1":"50","hue-2":"800","hue-3":"A100"}).accentPalette("pink"),$mdThemingProvider.theme("dracular","default").primaryPalette("grey",{"default":"900","hue-1":"50","hue-2":"800","hue-3":"900"}).accentPalette("customBlue")}),ssoApp.config(function($mdIconProvider){$mdIconProvider.iconSet("action","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg",24).iconSet("alert","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg",24).iconSet("av","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-av.svg",24).iconSet("communication","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg",24).iconSet("content","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg",24).iconSet("device","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-device.svg",24).iconSet("editor","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg",24).iconSet("file","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg",24).iconSet("hardware","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg",24).iconSet("image","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg",24).iconSet("maps","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg",24).iconSet("navigation","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg",24).iconSet("notification","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg",24).iconSet("social","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg",24).iconSet("toggle","/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg",24).defaultIconSet("/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg",24)}),ssoApp.config(["$stateProvider","$urlRouterProvider","$locationProvider",function($stateProvider,$urlRouterProvider,$locationProvider){$stateProvider.state("index",{templateUrl:"/_view/sso/index",url:"/sso/home",controller:"IndexCtrl"}).state("findpassword",{templateUrl:"/_view/sso/findpassword",url:"/sso/findpassword",controller:"FindpasswordCtrl"}).state("resetpassword",{params:{token:"shiqifeng2000@gmail.com"},templateUrl:"/_view/sso/resetpassword",url:"/sso/resetpassword?token",controller:"ResetpasswordCtrl"}).state("register",{templateUrl:"/_view/sso/register",url:"/sso/register",controller:"RegisterCtrl"}).state("activeuser",{params:{code:"shiqifeng2000@gmail.com"},templateUrl:"/_view/sso/activeuser",url:"/sso/activeuser?code",controller:"ActiveUserCtrl"}).state("update",{templateUrl:"/_view/sso/update",url:"/sso/update",controller:"UpdateCtrl"}).state("updatepassword",{templateUrl:"/_view/sso/updatepassword",url:"/sso/updatepassword",controller:"UpdatepasswordCtrl"}),$urlRouterProvider.otherwise("/sso/home"),$locationProvider.html5Mode(!0),$locationProvider.hashPrefix("!")}]),ssoApp.controller("SSOCtrl",["$rootScope","$scope","$state","$location","$window","$cookies","$mdDialog",function($rootScope,$scope,$state,$location,$window,$cookies,$mdDialog){$rootScope.from=$location.search().from,$rootScope.loginMistakes=0,$rootScope.removeLoading=function(){$(".loading").hasClass("out")||($(".loading").addClass("start"),setTimeout(function(){$(".loading").addClass("out").one($.support.transition.end,function(){$(this).hide(),$(".view-frame").addClass("reveal")})},ROPStyleConstant.loadingTime))},$rootScope._lang=$cookies.get("_lang"),$rootScope.locate=function(url){$window.location.href=url},$rootScope.locateAbs=function(url){$window.location.href=Constant.protocol+"://"+Constant.host+":"+Constant.port+"/"+(url?url:"")},$rootScope.toWelcome=function(){$scope.locate(Constant.protocol+"://"+Constant.host+":"+Constant.port)},$rootScope.go=function(tab,param){$state.go(tab,param)};var _session=$cookies.get("_session")?JSON.parse($cookies.get("_session")):"";_session&&($rootScope.profile=_session),$rootScope.confirmDialog=function(ev,param){var confirm=$mdDialog.confirm().parent(angular.element(ev.target).parent(".view-frame")).title(param.title).textContent(param.content).clickOutsideToClose(!0).ariaLabel(param.ariaLabel).targetEvent(ev).ok(param.ok).cancel(param.cancel);$mdDialog.show(confirm).then(param.success,param.cancel)},$rootScope.alertDialog=function(ev,param){var confirm=$mdDialog.alert().title(param.title).textContent(param.content).clickOutsideToClose(!0).ariaLabel(param.ariaLabel).ok(param.ok);$mdDialog.show(confirm).then(param.success)},$rootScope.isAdmin=function(){return $rootScope.profile&&("0"==$rootScope.profile.login_user_type||"3"==$rootScope.profile.login_user_type)},$rootScope.isSsv=function(){return $rootScope.profile&&"2"==$rootScope.profile.login_user_type},$rootScope.isIsv=function(){return $rootScope.profile&&"1"==$rootScope.profile.login_user_type}}]),ssoApp.controller("IndexCtrl",["$rootScope","$scope","$http","$window","$cookies",function($rootScope,$scope,$http,$window,$cookies){$rootScope.tab="index",$scope.login_msg="";var captcha_img="/captcha?l=50&_l=1";$scope.captcha_img=captcha_img+"&time="+(new Date).getTime(),$scope.clearMsg=function(){$scope.login_msg=""},$scope.login=function(){if($scope.loginForm.$invalid)return $scope.loginForm.$error.required&&$scope.loginForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#loginPanel").addClass("invalid"),setTimeout(function(){$("#loginPanel").removeClass("invalid"),$scope.login_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600),void $rootScope.loginMistakes++;var OSName="Unknown OS";navigator.appVersion.indexOf("Win")!=-1&&(OSName="Windows"),navigator.appVersion.indexOf("Mac")!=-1&&(OSName="MacOS"),navigator.appVersion.indexOf("X11")!=-1&&(OSName="UNIX"),navigator.appVersion.indexOf("Linux")!=-1&&(OSName="Linux");var myParam={user_account:$scope.user_account,password:$scope.password,login_system:OSName};$http.post("/agent",{module:"sso",partial:"session",api:"login",param:myParam}).then(function(body){if("boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success){if($rootScope.profile=body.data,$cookies.put("_session",JSON.stringify($rootScope.profile),{path:"/",domain:"."+Constant.host}),bassdk){var sign="";try{sign=JSON.parse(getCookie("_session")).sign}catch(e){}bassdk.userIdentify(sign,!0)}$rootScope.from?"application"==$rootScope.from?$rootScope.isSsv()?$rootScope.locateAbs($rootScope.from):$rootScope.isAdmin()?$rootScope.locateAbs("console"):$rootScope.isIsv&&$rootScope.locateAbs("console"):"console"==$rootScope.from&&($rootScope.isSsv()?$rootScope.locateAbs("application"):$rootScope.isAdmin()?$rootScope.locateAbs("console"):$rootScope.isIsv&&$rootScope.locateAbs("console")):$rootScope.locateAbs("")}else $rootScope.loginMistakes++,$("#loginPanel").addClass("invalid"),setTimeout(function(){$("#loginPanel").removeClass("invalid"),$scope.login_msg=body.data.msg,$scope.$apply()},600)},function(why){$scope.login_msg=why})},$scope.resetCaptcha=function(){$scope.captchaCode="",$scope.captcha_img=captcha_img+"&time="+(new Date).getTime()},$scope.clearMsg=function(){$scope.login_msg=""},$scope.verifyCode=function(){var _captcha=$cookies.get("_captcha");return _captcha?$scope.captchaCode&&$scope.captchaCode.toLowerCase()==$cookies.get("_captcha").toLowerCase():void $scope.resetCaptcha()},$scope.$on("$viewContentLoaded",function(event){setTimeout(function(){$("#inputPassword").attr("type","password").val(""),$rootScope.removeLoading()})})}]),ssoApp.controller("RegisterCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){$rootScope.tab="register",$scope.ssv_msg="",$scope.dev_msg="",$scope.chooseType=function(type){$scope.userType=type},window.test=function(type){$scope.userType=type,$scope.$apply()},$scope.clearMsg=function(type){2==type?$scope.ssv_msg="":$scope.dev_msg=""},$scope.register=function(ev){var type=$scope.userType;if(2==type){if($scope.ssvForm.$invalid)return $scope.ssvForm.$error.required&&$scope.ssvForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#ssvRegisterPanel").addClass("invalid"),void setTimeout(function(){$("#ssvRegisterPanel").removeClass("invalid"),$scope.ssv_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600);$http.post("/agent",{module:"sso",partial:"register",api:"regist",param:$.extend({user_type:type},$scope.ssv)}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.ssv._success=!0,$scope.ssv_msg="zh-cn"==$rootScope._lang?"注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户":"Success, please proceed to your mailbox and active your account"):(console.log(body.data.msg),$scope.ssv_msg=body.data.msg)},function(why){$scope.ssv_msg=why})}else{if($scope.devForm.$invalid)return $scope.devForm.$error.required&&$scope.devForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#devRegisterPanel").addClass("invalid"),void setTimeout(function(){$("#devRegisterPanel").removeClass("invalid"),$scope.dev_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600);$http.post("/agent",{module:"sso",partial:"register",api:"regist",param:$.extend({user_type:type},$scope.developer)}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.developer._success=!0,$scope.dev_msg="zh-cn"==$rootScope._lang?"注册成功，请登录注册邮箱查看本站发送的邮件，并按邮件提示激活账户":"Success, please proceed to your mailbox and active your account"):(console.log(body.data.msg),$scope.dev_msg=body.data.msg)},function(why){$scope.dev_msg=why})}},$scope.$on("$viewContentLoaded",function(event){setTimeout(function(){$("input.password").attr("type","password").val("")}),$rootScope.removeLoading()})}]),ssoApp.controller("UpdateCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){$rootScope.profile||($rootScope.alertDialog(null,{title:"zh-cn"==$rootScope._lang?"跳转失败":"Failed",content:"zh-cn"==$rootScope._lang?"用户没有登录，无法取得个人信息":"No signed in yet",ariaLabel:"zh-cn"==$rootScope._lang?"跳转失败":"Failed",ok:"Ok"}),$rootScope.go("index")),$rootScope.tab="update",$scope.update_msg="",$scope.clearMsg=function(type){$scope.update_msg=""},$scope.init=function(){$http.post("/agent",{module:"sso",partial:"update",api:"getuser"}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.initialData=JSON.parse(JSON.stringify(body.data)),"2"!=$rootScope.profile.login_user_type?$scope.developer=body.data:$scope.ssv=body.data):(console.log(body.data.msg),$scope.update_msg=body.data.msg)},function(why){$scope.update_msg=why})},$scope.reset=function(){$scope.developer?$scope.developer=$scope.initialData:$scope.ssv=$scope.initialData},$scope.update=function(ev){if($scope.ssv){if($scope.ssvForm.$invalid)return $scope.ssvForm.$error.required&&$scope.ssvForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#ssvRegisterPanel").addClass("invalid"),void setTimeout(function(){$("#ssvRegisterPanel").removeClass("invalid"),$scope.update_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600);$http.post("/agent",{module:"sso",partial:"update",api:"saveuser",param:$.extend({user_type:$rootScope.profile.login_user_type},$scope.ssv)}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.ssv._success=!0,$scope.update_msg="修改成功"):(console.log(body.data.msg),$scope.update_msg=body.data.msg)},function(why){$scope.update_msg=why})}else{if($scope.devForm.$invalid)return $scope.devForm.$error.required&&$scope.devForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#devRegisterPanel").addClass("invalid"),void setTimeout(function(){$("#devRegisterPanel").removeClass("invalid"),$scope.update_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600);$http.post("/agent",{module:"sso",partial:"update",api:"saveuser",param:$.extend({user_type:$rootScope.profile.login_user_type},$scope.developer)}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.developer._success=!0,$scope.update_msg="zh-cn"==$rootScope._lang?"修改成功":"DONE"):(console.log(body.data.msg),$scope.update_msg=body.data.msg)},function(why){$scope.update_msg=why})}},$scope.init(),$scope.$on("$viewContentLoaded",function(event){$rootScope.removeLoading()})}]),ssoApp.controller("UpdatepasswordCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){$rootScope.tab="updatepassword",$scope.update_msg="",$scope.clearMsg=function(type){$scope.update_msg=""},$scope.update=function(ev){return $scope.userForm.$invalid?($scope.userForm.$error.required&&$scope.userForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#userPanel").addClass("invalid"),void setTimeout(function(){$("#userPanel").removeClass("invalid"),$scope.update_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600)):void $http.post("/agent",{module:"sso",partial:"updatepassword",api:"updatepassword",param:$.extend({user_type:$rootScope.profile.login_user_type},$scope.user)}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.user._success=!0,$scope.update_msg="zh-cn"==$rootScope._lang?"修改成功":"DONE"):(console.log(body.data.msg),$scope.update_msg=body.data.msg)},function(why){$scope.update_msg=why})},$scope.$on("$viewContentLoaded",function(event){$rootScope.removeLoading()})}]),ssoApp.controller("FindpasswordCtrl",["$rootScope","$scope","$http","$mdDialog",function($rootScope,$scope,$http,$mdDialog){$rootScope.tab="findpassword",$scope.reset_msg="";var captcha_img="/captcha?l=50&_l=1";$scope.captcha_img=captcha_img,$scope.clearMsg=function(){$scope.reset_msg=""},$scope.resetmail=function(ev){return $scope.findForm.$invalid?($scope.findForm.$error.required&&$scope.findForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#findpasswordPanel").addClass("invalid"),void setTimeout(function(){$("#findpasswordPanel").removeClass("invalid"),$scope.reset_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600)):void $http.post("/agent",{module:"sso",partial:"findpassword",api:"findpassword",param:$scope.param}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.param._success=!0,$scope.reset_msg="zh-cn"==$rootScope._lang?"邮件发送成功, 请打开注册邮箱激活新密码":"Please open your mailbox and active the new password"):(console.log(body.msg),$scope.reset_msg=body.data.msg)},function(why){$scope.reset_msg=why})},$scope.resetCaptcha=function(){$scope.captcha="",$scope.captcha_img=captcha_img+"&time="+(new Date).getTime()},$scope.verifyCode=function(){var _captcha=$cookies.get("_captcha");return _captcha?$scope.captchaCode&&$scope.captcha.toLowerCase()==$cookies.get("_captcha").toLowerCase():void $scope.resetCaptcha()},$scope.$on("$viewContentLoaded",function(event){setTimeout(function(){$rootScope.removeLoading()})})}]),ssoApp.controller("ResetpasswordCtrl",["$rootScope","$scope","$http","$stateParams",function($rootScope,$scope,$http,$stateParams){$rootScope.tab="resetpassword",$scope.param={},$scope.param._remaining=5,$scope.reset_msg="",$scope.clearMsg=function(){$scope.reset_msg=""},$scope.resetpassword=function(ev){return $scope.resetForm.$invalid?($scope.resetForm.$error.required&&$scope.resetForm.$error.required.forEach(function(r){r.$setDirty(!0)}),$("#resetPanel").addClass("invalid"),setTimeout(function(){$("#resetPanel").removeClass("invalid"),$scope.reset_msg="zh-cn"==$rootScope._lang?"请检查输入项是否正确":"Please verify the inputs",$scope.$apply()},600),void $scope.param._remaining--):void $http.post("/agent",{module:"sso",partial:"resetpassword",api:"resetpassword",param:{reset_code:$stateParams.token,new_password:$scope.param.new_password}}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.param._success=!0,$scope.reset_msg="zh-cn"==$rootScope._lang?"密码重置成功":"Password reset!"):($scope.param._error=!0,$scope.reset_msg=body.data.msg,console.log(body.data.msg))},function(why){$scope.reset_msg=why})},$scope.$on("$viewContentLoaded",function(event){setTimeout(function(){$rootScope.removeLoading()})})}]),ssoApp.controller("ActiveUserCtrl",["$rootScope","$scope","$http","$window","$state","$stateParams",function($rootScope,$scope,$http,$window,$state,$stateParams){$rootScope.tab="activeUser",$scope.secondsRemaining=5,$scope.msg="zh-cn"==$rootScope._lang?"处理中......":"Processing...",$http.post("/agent",{module:"sso",partial:"activeuser",api:"list",param:{active_key:$stateParams.code}}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?!function(){$scope.msg="zh-cn"==$rootScope._lang?"账号激活成功":"Account actived";var mark=setInterval(function(){$scope.secondsRemaining?($scope.secondsRemaining--,$scope.$apply()):(clearInterval(mark),$scope.go("index"))},1e3)}():($scope.msg="zh-cn"==$rootScope._lang?"账号激活失败，原因如下":"Active failed",$scope.error=body.data.msg,console.log(body.data.msg))},function(why){$scope.msg="zh-cn"==$rootScope._lang?"账号激活失败，原因如下":"Active failed",$scope.error=why,cb&&cb.call()}),$scope.$on("$viewContentLoaded",function(event){$rootScope.removeLoading()})}]),ssoApp.filter("escapeHtml",function(){var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};return function(str){return String(str).replace(/[&<>"'\/]/g,function(s){return entityMap[s]})}}),ssoApp.filter("unescapeHtml",function(){var entityMap={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#x2F;":"/"};return function(str,type){if(str){var rawStr=String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g,function(s){return entityMap[s]});if(str&&"undefined"!=str){if("json"==type)return JSON.stringify(JSON.parse(rawStr),null,2);if("xml"==type)return formatXml(rawStr)}return rawStr}}}),ssoApp.filter("trusthtml",["$sce",function($sce){return function(t){return $sce.trustAsHtml(t)}}]),ssoApp.directive("compareTo",function(){return{require:"ngModel",scope:{otherModelValue:"=compareTo"},link:function(scope,element,attributes,ngModel){ngModel.$validators.compareTo=function(modelValue){return modelValue==scope.otherModelValue},scope.$watch("otherModelValue",function(){ngModel.$validate()})}}}),ssoApp.directive("captchaValidator",["$cookies",function($cookies){return{restrict:"A",require:"ngModel",scope:{captchaValue:"=captchaValidator"},link:function(scope,element,attributes,ngModel){ngModel.$validators.validCaptcha=function(modelValue){return(modelValue?modelValue.toLowerCase():"")==($cookies.get("_captcha")?$cookies.get("_captcha").toLowerCase():"")},scope.$watch("captchaValue",function(){ngModel.$validate()})}}}]),ssoApp.directive("ropPagination",["$parse",function($parse){return{restrict:"A",scope:{index:"=index",size:"=size",total:"=total",searcher:"=searcher"},templateUrl:"/_template/pagination",link:function($scope,element,attrs){$scope.myIndex=$scope.index,$scope.ceilingIndex=$scope.index+4,$scope.$watch("total",function(){$scope.pages=[];for(var i=0;i<Math.ceil($scope.total/$scope.size);i++)$scope.pages.push({index:i+1})}),$scope.$watch("size",function(){$scope.pages=[];for(var i=0;i<Math.ceil($scope.total/$scope.size);i++)$scope.pages.push({index:i+1});$scope.index=1,$scope.ceilingIndex=5,$scope.searcher($scope.index,$scope.size)}),$scope.toFirst=function(){$scope.index=1,$scope.ceilingIndex=5,$scope.searcher($scope.index,$scope.size)},$scope.toLast=function(){$scope.index=$scope.pages.length,$scope.ceilingIndex=$scope.pages.length,$scope.searcher($scope.index,$scope.size)},$scope.searchPrevious=function(){$scope.ceilingIndex==$scope.index+4&&$scope.index>1&&$scope.ceilingIndex--,$scope.index>1&&(--$scope.index,$scope.searcher($scope.index,$scope.size))},$scope.searchNext=function(){$scope.ceilingIndex==$scope.index&&$scope.index<$scope.pages.length&&$scope.ceilingIndex++,$scope.index<$scope.pages.length&&(++$scope.index,$scope.searcher($scope.index,$scope.size))},$scope.searchIndex=function(i){$scope.index=i,$scope.searcher($scope.index,$scope.size)},$scope.toPage=function(myIndex){$scope.ceilingIndex=Math.min(Number.parseInt(myIndex)+4,$scope.pages.length),$scope.searchIndex(myIndex)}}}}]);