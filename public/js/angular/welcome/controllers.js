"use strict";define(["require","angular","swiper"],function(require,angular){var controllerModule=angular.module("welcome.controllers",[]);controllerModule.controller("IndexCtrl",["$rootScope","$scope","$http","$q","$window",function($rootScope,$scope,$http,$q,$window){$rootScope.tab="index",$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()}),$scope.news=[],$scope.showMeTitle=function(e){$(e.currentTarget).hasClass("animation");$(e.currentTarget).toggleClass("animation")};var lastScrollY=0;window.scrollBinder=$(".view-frame").bind("scroll",function(e){var scrollY=$(e.target).scrollTop(),height=$(e.target).height(),scrollHeight=e.target.scrollHeight;scrollY-lastScrollY>10?scrollY<200?$rootScope._toolbarFeature=0:scrollY+height>scrollHeight-200?$rootScope._toolbarFeature=2:$rootScope._toolbarFeature=1:scrollY-lastScrollY<-10&&(scrollY<200?$rootScope._toolbarFeature=0:scrollY+height>scrollHeight-200?$rootScope._toolbarFeature=2:$rootScope._toolbarFeature=2),lastScrollY=scrollY,$scope.$apply()});var swiperOpt={pagination:".swiper-pagination",autoplay:6e3,speed:800,slidesPerView:1,paginationClickable:!0,spaceBetween:30,keyboardControl:!0,effect:"fade",preloadImages:!1,onLazyImageReady:function(swiper,slide,image){},onProgress:function(swiper,progress){}};document.body.scrollTop=0,$(".transitionEndBubbleStop").off("transitionend"),$(".transitionEndBubbleStop").bind("transitionend",function(e){e.stopPropagation()}),window.swiper=$(".swiper-container:visible").length?new Swiper(".swiper-container",swiperOpt):void 0,!window.swiper&&(window.swiper=new Swiper(".swiper-container",swiperOpt)),$rootScope._toolbarFeature=0,$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=0,$rootScope.removeLoading()})}]).controller("FeaturesCtrl",["$rootScope","$scope","$http","$state",function($rootScope,$scope,$http,$state){$rootScope.tab="features",$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()}),$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("APICtrl",["$rootScope","$scope","$http","$state",function($rootScope,$scope,$http,$state){$rootScope.tab="API";var catQ=function(){return $http.post("/agent",{module:"welcome",partial:"API",api:"list"}).then(function(body){if($scope.originalCat={cat_list:body.data.cat_list,_selectedItem:0},body.data&&body.data.cat_list&&body.data.cat_list.length){if($scope.cat={cat_list:body.data.cat_list,_selectedItem:0},$scope.cat.cat_list)for(var j=0;j<$scope.cat.cat_list.length;j++)if($scope.cat.cat_list[j].group_list){$scope.cat.cat_list[j]._selectedItem=0;for(var i=0;i<$scope.cat.cat_list[j].group_list.length;i++)if($scope.cat.cat_list[j].group_list[i].api_list)for(var k=0;k<$scope.cat.cat_list[j].group_list[i].api_list.length;k++);}}else $scope.cat={cat_list:body.data.cat_list,_selectedItem:0},$rootScope.alert("当前供应商没有任何API发布")},function(why){$rootScope.alert(why)})};$scope.changeAPISearch=function(){var cat=JSON.parse(JSON.stringify($scope.originalCat));if(cat._selectedItem=$scope.cat._selectedItem,cat.cat_list)for(var j=0;j<cat.cat_list.length;j++)if(cat.cat_list[j]._selectedItem=$scope.cat.cat_list[j]._selectedItem,cat.cat_list[j].group_list)for(var i=0;i<cat.cat_list[j].group_list.length;i++)if(cat.cat_list[j].group_list[i].api_list)for(var k=cat.cat_list[j].group_list[i].api_list.length;k--;)cat.cat_list[j].group_list[i].api_list[k].api_name.indexOf($scope.apiSearch)==-1&&cat.cat_list[j].group_list[i].api_list[k].api_title.indexOf($scope.apiSearch)==-1&&cat.cat_list[j].group_list[i].api_list.splice(k,1);$scope.cat=cat},catQ(),$scope.apiMethod=function(api){return Constant.protocol+"://"+Constant.host+"/api/ApiMethod-"+api.api_id+".html"},$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("DebugToolCtrl",["$rootScope","$scope","$http","$stateParams","$location",function($rootScope,$scope,$http,$stateParams,$location){$rootScope.tab="debugTool";var key=$stateParams.key?$stateParams.key:$location.search().key;$("#mainFrame").attr("src","/frame/ApiTool/index"+(key?"?sign="+key:"")),$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()}),$scope.$on("$viewContentLoaded",function(event){window._messageListener=function(event){event.origin==Constant.legacyDomain&&(console.log(event.data),$("iframe").height(event.data+20))},window.addEventListener("message",window._messageListener),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("SDKToolCtrl",["$rootScope","$scope","$http","$stateParams",function($rootScope,$scope,$http,$stateParams){$rootScope.tab="sdkTool",$scope.sdks=[{logo:"/resource/logo-dotnet.png",bg:"#33B5E5"},{logo:"/resource/logo-java.png",bg:"#AA66CC"},{logo:"/resource/logo-php.png",bg:"#00CC99"},{logo:"/resource/logo-js.png",bg:"#FFBB33"},{logo:"/resource/logo-android.png",bg:"#FF4444"}],$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()});$http.post("/agent",{module:"welcome",partial:"sdkTool",api:"list",param:{sdk_type:1}}).then(function(body){if("boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success){$scope.sdkcontent=[];for(var prop in body.data.sdk)$scope.sdkcontent.push($.extend({_title:prop},body.data.sdk[prop]))}else $rootScope.alert(body.data.msg)},function(why){$rootScope.alert(why)});$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("ServicesCtrl",["$rootScope","$scope","$http","$mdDialog","$mdSidenav","$window",function($rootScope,$scope,$http,$mdDialog,$mdSidenav,$window){$rootScope.tab="services",$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()});$http.post("/agent",{module:"welcome",partial:"services",api:"notice",param:{}}).then(function(body){body.data.data_list&&body.data.data_list.length&&($scope.notice_list=body.data.data_list)},function(why){$rootScope.alert(why)}),$http.post("/agent",{module:"welcome",partial:"services",api:"faq",param:{}}).then(function(body){body.data.data_list&&body.data.data_list.length&&($scope.faqs=body.data.data_list)},function(why){$rootScope.alert(why)});$scope.toggleSidenav=function(){return $mdSidenav("right").toggle()},$scope.askQuestion=function(e){return $scope.qaForm.$invalid?($mdDialog.show($mdDialog.alert().title("提示").textContent("请核对提交表单是否正确").ariaLabel("提交失败").ok("好的").targetEvent(e)),void($scope.qaForm.$error.required&&$scope.qaForm.$error.required.forEach(function(r){r.$setDirty(!0)}))):(e.preventDefault(),$http.post("/agent",{module:"welcome",partial:"services",api:"askQuestion",param:$scope.question}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($mdDialog.show($mdDialog.alert().title("提交成功").textContent("我们收到了您的问题，会尽快回答，请次日登录帮助中心查看我们的回复.").ariaLabel("提交成功").ok("好的").targetEvent(e)),$mdSidenav("right").close()):$mdDialog.show($mdDialog.alert().title("提交失败").textContent(body.data.msg).ariaLabel("提交失败").ok("好的").targetEvent(e))},function(why){$rootScope.alert(why)}))},$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("SuppliersCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){$rootScope.tab="suppliers",$scope.items=[],$scope.ssvs=[],$scope.pageindex=1,$('a[href^="#"]',"#partials").click(function(e){e.preventDefault()}),$scope.load=function(){$scope.lock||($scope.lock=!0,$http.post("/agent",{module:"welcome",partial:"suppliers",api:"suppliers"}).then(function(body){if("boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success){$scope.items=body.data.data_list}else $rootScope.alert(body.data.msg);$scope.lock=!1},function(why){$rootScope.alert(why),$scope.lock=!1}))},$scope.toSsv=function(ssv){$scope.locate(Constant.protocol+"://"+ssv.user_domain+"."+Constant.host+":"+Constant.port)},$scope.isOdd=function(index){var isOdd=index%2;return isOdd},$scope.load(),$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}]).controller("DocCtrl",["$rootScope","$scope","$http","$stateParams","$location",function($rootScope,$scope,$http,$stateParams,$location){var docId=$stateParams.docId?$stateParams.docId:$location.search().doc;"index"==$rootScope.tab;$rootScope.tab="doc";var visitCounter=function(param){return $rootScope.ajax("view_count",param)},catQ=function(){return $rootScope.ajax("doc_cat",{}).then(function(body){$scope.rootTree=body})},detailQ=function(doc_id){return $rootScope.ajax("doc_detail",{doc_id:doc_id}).then(function(data){$scope.docId=doc_id,$scope.docDetail=data;var flag=!0;return $scope.rootTree.cat_list_level_1.every(function(trunk,i){return!!flag&&(trunk.cat_list_level_2&&trunk.cat_list_level_2.length&&trunk.cat_list_level_2.every(function(branch,i){return delete branch._isOpen,branch.cat_list_level_3&&branch.cat_list_level_3.length?branch.cat_list_level_3.every(function(leaf,i){return leaf.doc_id==doc_id&&(branch._isOpen=!0,flag=!1),!0}):branch.doc_id==doc_id&&(branch._isOpen=!0,flag=!1),!0}),!0)}),visitCounter({doc_id:doc_id,set_type:0}),!0})};$scope.checkoutDoc=function(trunk,branch,ev){ev.stopPropagation();var trueBranch=branch;if(trueBranch||(trueBranch=trunk.cat_list_level_2[0]),trueBranch.doc_id){$scope.docId=trueBranch.doc_id;var detailThen=detailQ(trueBranch.doc_id);$scope.currentTrunk||detailThen.then(function(){$rootScope.go("doc.details",{id:trueBranch.doc_id})})}else $scope.catId=trueBranch.cat_id,detailQ(trueBranch.cat_list_level_3[0].doc_id).then(function(){$rootScope.go("doc.details",{id:trueBranch.cat_list_level_3[0].doc_id})});$scope.isPreview=!1},$scope.isOpen=function(branch){return branch.cat_list_level_3&&[].concat.apply([],branch.cat_list_level_3.map(function(r,i){return r.cat_id?[r.cat.id]:[]})).indexOf(docId)!=-1},$scope.toggleOpen=function(branch){branch._isOpen?branch._isOpen=!1:branch._isOpen=!0},$scope.detailQ=detailQ,$scope.catQ=catQ,$scope.resetDoc=function(){$scope.catId="",$scope.docId="",$scope.docDetail=null,$scope.currentTrunk=null,$scope.isPreview=void 0,$rootScope.go("doc.cat")},!$scope.rootTree&&$scope.catQ()}]).controller("DocCatCtrl",["$rootScope","$scope","$timeout",function($rootScope,$scope,$timeout){$scope.resetDoc(),window.test=$scope,$scope.$on("$viewContentLoaded",function(event){$timeout(function(){$rootScope._toolbarFeature=2},600),$rootScope.removeLoading()})}]).controller("DocDetailCtrl",["$rootScope","$scope","$stateParams","$timeout","$location","$q",function($rootScope,$scope,$stateParams,$timeout,$location,$q){var docId=$stateParams.id,isPreview=$location.search().preview,processor=function(){return $scope.rootTree.cat_list_level_1.every(function(trunk,i){return!$scope.currentTrunk&&(trunk.cat_list_level_2&&trunk.cat_list_level_2.length&&trunk.cat_list_level_2.every(function(branch,i){if(branch.doc_id){if(branch.doc_id==docId)return $scope.currentTrunk=trunk,!1}else branch.cat_list_level_3&&branch.cat_list_level_3.length&&branch.cat_list_level_3.every(function(leaf,i){return leaf.doc_id!=docId||($scope.currentTrunk=trunk,!1)});return!0}),!0)}),$scope.currentTrunk&&($scope.heroId="hero_"+($scope.currentTrunk.doc_id?$scope.currentTrunk.doc_id:$scope.currentTrunk.cat_id),$scope.currentIndex=$scope.rootTree.cat_list_level_1.indexOf($scope.currentTrunk)),!0},mainDefer=$q.defer();if($scope.rootTree){var flag=processor();flag&&mainDefer.resolve()}else docId&&void 0===$scope.isPreview&&(isPreview&&($scope.isPreview=!0),$scope.catQ().then(function(){return $scope.detailQ(docId)}).then(processor).then(function(flag){flag&&mainDefer.resolve()}));$scope.docPrefix=Constant.protocol+"://"+Constant.host+"/api/doc_detail.html?id=",$scope.getDoc=function(doc_id){return $scope.detailQ(doc_id)},require(["clipboard"],function(Clipboard){var _lang=$rootScope._lang,beforeClipboardCopy="zh-cn"==_lang?"复制文档地址":"Copy document URL",afterClipboardCopy="zh-cn"==_lang?"已复制":"Copied",workaroundSupportClipboard=function(action){var actionMsg=" 来"+("cut"===action?"剪切":"拷贝"),actionKey="cut"===action?"X":"C";return actionMsg=/iPhone|iPad/i.test(navigator.userAgent)?"暂不支持iPhone和iPad :(":/Mac/i.test(navigator.userAgent)?"请按 ⌘-"+actionKey+actionMsg:"请按 Ctrl-"+actionKey+actionMsg};$scope.clipboardHints=beforeClipboardCopy,$scope.locator=function(e,hash){e.preventDefault(),e.stopPropagation();var currentScrollTop=$(".view-frame.doc .sub-frame")[0].scrollTop;$(".view-frame.doc .sub-frame").animate({scrollTop:currentScrollTop+$(hash).offset().top-64})};var cliper=new Clipboard(".cliper");cliper.on("success",function(e){e.clearSelection(),$scope.clipboardHints=afterClipboardCopy,$scope.tooltipFlag=!0,$scope.$apply(),setTimeout(function(){$scope.tooltipFlag=!1,$scope.clipboardHints=beforeClipboardCopy,$scope.$apply()},5e3)}),cliper.on("error",function(e){$scope.clipboardHints=workaroundSupportClipboard(e.action),$scope.$apply(),setTimeout(function(){$scope.clipboardHints=beforeClipboardCopy,$scope.$apply()},5e3)})}),window.test=$scope,$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading(),mainDefer.promise.then(function(){$(".view-frame.doc .sub-frame").scrollspy({target:"#menu",offset:15})})})}]).controller("SearchCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){$rootScope.tab="search",$scope.searchCategory="all",$scope.hints=[],$scope.pageIndex=1,$scope.pageSize=new Number(10);var initial=!0;$scope.searcher=function(index,size){return initial?void(initial=!1):void $http.post("/agent",{module:"welcome",partial:"search",api:"search",param:{pageindex:index?index:$scope.pageIndex,pagesize:size?size:$scope.pageSize,searchflg:$scope.searchCategory,keyword:$("#bloodhound").val()}}).then(function(body){$scope.response=body.data.response,body.data.response&&body.data.response.docs&&body.data.response.docs.length?"all"==$scope.searchCategory?$scope.total=body.data.response.numFound:"api"==$scope.searchCategory?$scope.total=body.data.response.numFoundApi:"doc"==$scope.searchCategory?$scope.total=body.data.response.numFoundDoc:"sdk"==$scope.searchCategory?$scope.total=body.data.response.numFoundSdk:"tool"==$scope.searchCategory?$scope.total=body.data.response.numFoundTool:"other"==$scope.searchCategory?$scope.total=body.data.response.numFoundOther:$scope.total=0:$scope.total=0,setTimeout(function(){$(window).trigger("scroll")},100)},function(why){$rootScope.alert(why),$scope.total=0})},$http.post("/agent",{module:"welcome",partial:"search",api:"hints"}).then(function(body){"boolean"==typeof body.data.is_success&&body.data.is_success||"string"==typeof body.data.is_success&&"true"==body.data.is_success?($scope.rawHints=body.data.hint_list,require(["bloodhound","typeahead"],function(){var keyword=new Bloodhound({datumTokenizer:function(str){return str?str.split(""):[]},queryTokenizer:function(str){return str?str.split(""):[]},sorter:function(itemA,itemB){return itemA.indexOf($scope.keyword)>itemB.indexOf($scope.keyword)?-1:itemA.indexOf($scope.keyword)<itemB.indexOf($scope.keyword)?1:0},local:$scope.rawHints.map(function(r){return r.title})});$(".typeahead").typeahead({hint:!0,highlight:!0,minLength:1},{name:"keyword",source:keyword,limit:10}).on("typeahead:selected",function(event,selection){$scope.research($scope.searchCategory),$scope.$apply()})})):$rootScope.alert(body.data.msg)},function(why){$rootScope.alert(why)}),$scope.research=function(cat,key){$scope.hints=[],$scope.searchCategory=cat,$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.$on("$viewContentLoaded",function(event){$(window).trigger("scroll"),$rootScope._toolbarFeature=2,$rootScope.removeLoading()})}])});