define(['angular','angularMaterial','common'], function(angular) {
    'use strict';
    angular.module('rop.directives', ['ngMaterial'])
        .directive('ropTreeView', ['$compile', $compile => ({
            restrict: "AE",
            scope: {
                data: '=data',
                field: '=field',
                option: '=option'
            },

            replace: true,
            templateUrl: "/js/angular/template/tree_view.html",

            link($scope, element, attrs) {
                let collapsed = [], checked = [];
                // 不想影响原数据
                try {
                    $scope.data = JSON.parse(attrs.data);
                } catch (e) {
                    $scope.data = $scope.$parent[attrs.data];
                }

                let recur = (item, runner) => {
                        if (item[$scope.field.children] && (item[$scope.field.children].length)) {
                            item[$scope.field.children].forEach(subItem => {
                                runner(subItem, item);
                                recur(subItem, runner);
                            });
                        }
                    },
                    recur_counter = (item, checked) => {
                        let allUnchecked = true;
                        item[$scope.field.children] && item[$scope.field.children].forEach(brother => {
                            if (checked) {
                                (!brother[$scope.field.checked]) && (allUnchecked = false);
                            } else {
                                (brother[$scope.field.checked]) && (allUnchecked = false);
                            }
                        });
                        if (allUnchecked) {
                            item[$scope.field.checked] = checked;
                            item._parent && recur_counter(item._parent, checked);
                        }
                    };

                let watcher = () => {
                    !$scope.option && ($scope.option = {});
                    if ($scope.field) {
                        !$scope.field.id && ($scope.field.id = "_id");
                        !$scope.field.label && ($scope.field.id = "_label");
                        !$scope.field.children && ($scope.field.children = "_children");
                        !$scope.field.checked && ($scope.field.checked = "_checked");
                        !$scope.field.collapsed && ($scope.field.collapsed = "_collapsed");
                        /*!$scope.field.selected && ($scope.field.selected = "_selected");*/
                    }
                    if ($scope.data) {
                        $scope.data.forEach(item => {
                            if (item[$scope.field.children] && item[$scope.field.children].length) {
                                $scope.option.collapseAll ? (item[$scope.field.collapsed] = true) : (item[$scope.field.collapsed] = false);
                            }
                            recur(item, (node, parent) => {
                                node._parent = parent;
                                if (node[$scope.field.children] && node[$scope.field.children].length) {
                                    $scope.option.collapseAll ? (node[$scope.field.collapsed] = true) : (node[$scope.field.collapsed] = false);
                                }
                            })
                        });
                    }
                };

                $scope.$watch("data", () => {
                    watcher();
                });

                $scope.$parent.RopTreeView = {};
                $scope.$parent.RopTreeView.getChecked = () => {
                    let list = [];
                    if ($scope.data) {
                        $scope.data.forEach(item => {
                            if (item[$scope.field.checked]) {
                                list.push(item);
                            }
                            recur(item, node => {
                                if (node[$scope.field.checked]) {
                                    list.push(node);
                                }
                            })
                        });
                    }
                    return list;
                }
                $scope.toggleChecked = item => {
                    item[$scope.field.checked] = !item[$scope.field.checked];
                    recur(item, node => {
                        node[$scope.field.checked] = item[$scope.field.checked];
                    });

                    if (!item[$scope.field.checked]) {
                        item._parent && recur_counter(item._parent, false);
                    } else {
                        if (item._parent) {
                            item._parent[$scope.field.checked] = item[$scope.field.checked];
                            if (item._parent._parent) {
                                item._parent._parent[$scope.field.checked] = item[$scope.field.checked];
                            }
                        }
                    }

                }

                $scope.toggleCollapse = item => {
                    item[$scope.field.collapsed] = !item[$scope.field.collapsed];
                }
            }
        })])
        .directive('strboolean', ()=> {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    ngModel.$formatters.push(function (value) {
                        return (value === undefined) ? undefined : (value ? "1" : "0");
                    });
                    ngModel.$parsers.push(function (value) {
                        return (value === undefined) ? undefined : (value ? "1" : "0");
                    });
                }
            }
        })
        .directive('charRestriction', [()=> {
            return {
                restrict: 'A',
                scope:{
                    charcodes: "=charcodes",
                },
                link: function (scope, element, attrs) {
                    if(scope.charcodes && scope.charcodes.length){
                        angular.element(element).on("keydown", function (e) {
                            //let selectionStart = originalValue.substring(0,this.selectionStart),selectionEnd = originalValue.substring(this.selectionEnd,originalValue.length);
                            if((e.key != "ArrowLeft") && (e.key != "ArrowRight") && (e.key != "Shift") && (e.key != "Control") && (e.key != "Alt") && (e.key != "Meta") && (e.key != "Backspace")&&(e.key != "Forward")&&(e.key != "Delete")){
                                if(scope.charcodes.indexOf(e.keyCode) < 0){
                                    e.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                }
            }
        }])
        .directive('xmlValidator', () => ({
            require: "ngModel",
            link(scope, element, attributes, ngModel) {
                ngModel.$validators.xmlValidator = modelValue => {
                    var xml, tmp;
                    try {
                        if ( window.DOMParser ) {
                            tmp = new DOMParser();
                            xml = tmp.parseFromString( modelValue , "text/xml" );
                        } else {
                            xml = new ActiveXObject( "Microsoft.XMLDOM" );
                            xml.async = "false";
                            xml.loadXML( modelValue );
                        }
                    } catch( e ) {
                        xml = undefined;
                    }
                    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                        return false
                    }
                    return true;
                };
            }
        }))
        .directive('jsonValidator', () => ({
            require: "ngModel",
            link(scope, element, attributes, ngModel) {
                ngModel.$validators.jsonValidator = modelValue => {
                    let result = true;
                    try {
                        JSON.parse(modelValue);
                    } catch (e) {
                        result = false;
                    }
                    return result;
                };
            }
        }))
        .directive('ropDatatable', ['$parse','$timeout', ($parse,$timeout) => ({
            restrict: "AE",

            scope: {
                cols: "=cols",
                sorter: "=sorter",
                data: "=data",

                index: "=index",
                size: "=size",
                total: "=total",
                searcher: "=searcher",
                infinite: "@infinite",

                multiSelection:"=multiple",
                noSelection:"=noselection",
            },
            //replace: true,
            templateUrl: "/_template/datatable",

            link($scope, element, attrs) {
                $scope.checkAll = ()=>{
                    if(!$scope.allChecked){
                        $scope.data.forEach((r)=>{!r._locked && (r._checked = true)});
                        $scope.allChecked = true;
                    } else {
                        $scope.data.forEach((r)=>{!r._locked && (r._checked = false)})
                        $scope.allChecked = false;
                    }
                }
                $scope.sort = col =>{
                    col.sort = (col.sort == "1")?"0":"1";
                    //Object.assign($scope.sorter,col);
                    $scope.cols.forEach((r,i)=>{
                        if(r !== col){
                            r.sort = r.sort?"1":undefined;
                        }
                    });
                    for(let prop in col){
                        $scope.sorter[prop] = col[prop];
                    }
                    $scope.index = 1;
                    $scope.size = new Number($scope.size);
                }
                $scope.verifyCheckAll = ()=>{
                    let result = true;
                    if($scope.data){
                        if ($scope.data.length == 0){
                            result = false;
                        } else {
                            for(var i=0;i<$scope.data.length;i++){
                                var r = $scope.data[i];
                                !r._locked && !r._checked&&(result = false);
                                r._locked &&(result = false);
                            }
                        }
                    }
                    if(!result){$scope.allChecked = false;} else {$scope.allChecked = true;}
                }
                $scope.$watch("data", () => {
                    $scope.verifyCheckAll();
                });


                /*$scope.$watch("sorter", () => {
                 if ($scope.size) {
                 $scope.pages = [];
                 for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                 $scope.pages.push({index: i + 1})
                 }
                 $scope.index = 1;
                 $scope.ceilingIndex = 5;
                 $scope.myIndex = $scope.index;
                 $scope.ceilingIndex = $scope.index + 4;
                 $scope.searcher($scope.index, $scope.size);
                 }
                 });*/
            }
        })])
        .directive('ropFixedTable', ['$parse','$timeout', ($parse,$timeout) => ({
            restrict: "AE",

            scope: {
                cols: "=cols",
                data: "=data",
                cursor: "=cursor",
                keyword: "=keyword",
                multiSelection:"=multiple",
                noSelection:"=noselection",
                noRowSelection:"=norowselection",
                lineHeight: "@lineHeight",
                scrollerStyle: "=scrollerstyle"
            },
            //replace: true,
            templateUrl: "/_template/fixed_table",

            link($scope, element, attrs) {
                $scope.checkAll = ()=>{
                    if(!$scope.allChecked){
                        $scope.data.forEach((r)=>{!r._locked && (r._checked = true)});
                        $scope.allChecked = true;
                    } else {
                        $scope.data.forEach((r)=>{!r._locked && (r._checked = false)})
                        $scope.allChecked = false;
                    }
                };
                $scope.verifyCheckAll = ()=>{
                    let result = true;
                    if($scope.data){
                        if ($scope.data.length == 0){
                            result = false;
                        } else {
                            for(var i=0;i<$scope.data.length;i++){
                                var r = $scope.data[i];
                                !r._locked && !r._checked&&(result = false);
                                r._locked &&(result = false);
                            }
                        }
                    }
                    if(!result){$scope.allChecked = false;} else {$scope.allChecked = true;}
                };
                $scope.$watch("data", () => {
                    //$scope.allChecked = false;
                    $scope.verifyCheckAll();
                });
                $scope.$watch(()=>$scope.cursor, (a)=>{
                    let $el = element.find(".scroller");
                    $el.animate({scrollTop: ($scope.lineHeight || 40)*$scope.cursor});
                })
            }
        })])
        .directive('ropPagination', ['$parse', $parse => ({
            restrict: "A",

            scope: {
                index: "=index",
                size: "=size",
                total: "=total",
                searcher: "=searcher",
                infinite: "=infinite",
                infiniteEnd: "=infiniteEnd"
            },
            controller: $scope=>{},
            controllerAs:"ctrl",
            //replace: true,
            templateUrl: "/_template/pagination",

            link($scope, element, attrs) {
                $scope.ctrl.myIndex = 1;
                $scope.ceilingIndex = $scope.index + 4;

                // TODO 为了防止初始化2次特注掉以下代码，注掉后操作页scope则不能控制分页组件，反之是分页控件控制scope的数据，如果需要可以恢复
                $scope.$watch("total", () => {
                    if ($scope.total) {
                        let total = (typeof $scope.total == 'string')? new Number($scope.total):$scope.total;
                        $scope.pages = [];
                        for (let i = 0; i < Math.ceil(total / $scope.size); i++) {
                            $scope.pages.push({index: i + 1})
                        }
                        $scope.index = 1;
                        //$scope.ceilingIndex = 5;
                        $scope.ctrl.myIndex = 1;
                        $scope.ceilingIndex = $scope.index + 4;
                    }
                });
                $scope.$watch("size", () => {
                    if ($scope.size) {
                        $scope.pages = [];
                        for (let i = 0; i < Math.ceil($scope.total / $scope.size); i++) {
                            $scope.pages.push({index: i + 1})
                        }
                        $scope.index = 1;
                        //$scope.ceilingIndex = 5;
                        $scope.ctrl.myIndex = 1;
                        $scope.ceilingIndex = $scope.index + 4;
                        $scope.searcher($scope.index, $scope.size);
                    }
                });
                $scope.toFirst = () => {
                    $scope.index = 1;
                    $scope.ceilingIndex = 5;
                    $scope.searcher($scope.index, $scope.size);
                };
                $scope.toLast = () => {
                    $scope.index = $scope.pages.length;
                    $scope.ceilingIndex = $scope.pages.length;
                    $scope.searcher($scope.index, $scope.size);
                };
                $scope.searchPrevious = () => {
                    if (($scope.ceilingIndex == $scope.index + 4) && ($scope.index > 1)) {
                        $scope.ceilingIndex--;
                    }
                    if ($scope.index > 1) {
                        --$scope.index;
                        $scope.searcher($scope.index, $scope.size);
                    }
                };

                $scope.searchNext = () => {
                    if (($scope.ceilingIndex == $scope.index) && ($scope.index < $scope.pages.length)) {
                        $scope.ceilingIndex++;
                    }
                    /*if ($scope.index < $scope.pages.length) {
                     ++$scope.index;
                     $scope.searcher($scope.index, $scope.size);
                     }*/
                    if($scope.infinite || ($scope.index < $scope.pages.length)){
                        ++$scope.index;
                        $scope.searcher($scope.index, $scope.size);
                    }
                };

                $scope.searchIndex = i => {
                    $scope.index = (typeof i == 'string') ? new Number(i) : i;
                    $scope.searcher($scope.index, $scope.size);
                };

                $scope.toPage = () => {
                    let myIndex = (typeof $scope.ctrl.myIndex == 'string')? new Number($scope.ctrl.myIndex):$scope.ctrl.myIndex;
                    if(myIndex > $scope.pages.length){return};
                    //let _myIndex = (typeof myIndex == 'string') ? new Number(myIndex) : myIndex;
                    $scope.ceilingIndex = Math.max(Math.min(myIndex + 4, $scope.pages.length),5);
                    $scope.searchIndex(myIndex);
                }

                if($scope.infinite){
                    $scope.infiniteStart = ()=>{
                        return ($scope.index == 1);
                    }
                }
            }
        })])
        .directive('ropStepper', ['$parse','$timeout', ($parse,$timeout) => ({
            restrict: "AE",

            scope: {
                index: "=index",
                steps: "=steps"
            },
            replace: true,
            templateUrl: "/_template/stepper",

            link($scope, element, attrs) {
            }
        })])
        .directive('compareTo', () => ({
            require: "ngModel",

            scope: {
                otherModelValue: "=compareTo"
            },

            link(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = modelValue => modelValue == scope.otherModelValue;

                scope.$watch("otherModelValue", () => {
                    ngModel.$validate();
                });
            }
        }))
        .directive('captchaValidator', ['$cookies', $cookies => ({
            restrict: "A",
            require: "ngModel",
    
            scope: {
                captchaValue: "=captchaValidator"
            },
    
            link(scope, element, attributes, ngModel) {
    
                ngModel.$validators.validCaptcha = modelValue => (modelValue ? modelValue.toLowerCase() : "") == ($cookies.get("_captcha") ? $cookies.get("_captcha").toLowerCase() : '');
    
                scope.$watch("captchaValue", () => {
                    ngModel.$validate();
                });
            }
        })])
        .directive('unicodeLengthValidator', [ () => ({
            restrict: "A",
            require: "ngModel",
            link(scope, element, attributes, ngModel) {
                var maxlength = attributes.maxlength;
                (typeof maxlength != 'int') && (maxlength = Number(maxlength));
                ngModel.$validators.validUnicodeLength = modelValue => ((maxlength !== NaN)?maxlength:0) >= (modelValue?modelValue.getBytesLength():0);
            }
        })])
        .directive('contentSelection', ['$timeout',($timeout)=> {
            return {
                restrict: 'A',
                scope:{
                    keyword:"=keyword"
                },
                link(scope, element, attrs) {
                    scope.$watch("keyword", ()=>{
                        if(scope.keyword){
                            var value = element.val(),start = value.indexOf(scope.keyword), end = value.indexOf(scope.keyword) + scope.keyword.length;
                            element[0].setSelectionRange(start,end);
                            element.focus();
                        }
                    })
                    /*console.log(scope);
                    let getTextNodesIn = (node) =>{
                        var textNodes = [];
                        if (node.nodeType == 3) {
                            textNodes.push(node);
                        } else {
                            var children = node.childNodes;
                            for (var i = 0, len = children.length; i < len; ++i) {
                                textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
                            }
                        }
                        return textNodes;
                    }, setSelectionRange = (el, start, end) =>{
                        if (document.createRange && window.getSelection) {
                            var range = document.createRange();
                            range.selectNodeContents(el);
                            var textNodes = getTextNodesIn(el);
                            var foundStart = false;
                            var charCount = 0, endCharCount;

                            for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                                endCharCount = charCount + textNode.length;
                                if (!foundStart && start >= charCount
                                    && (start < endCharCount ||
                                    (start == endCharCount && i <= textNodes.length))) {
                                    range.setStart(textNode, start - charCount);
                                    foundStart = true;
                                }
                                if (foundStart && end <= endCharCount) {
                                    range.setEnd(textNode, end - charCount);
                                    break;
                                }
                                charCount = endCharCount;
                            }

                            var sel = window.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);
                        } else if (document.selection && document.body.createTextRange) {
                            var textRange = document.body.createTextRange();
                            textRange.moveToElementText(el);
                            textRange.collapse(true);
                            textRange.moveEnd("character", end);
                            textRange.moveStart("character", start);
                            textRange.select();
                        }
                    }

                    scope.setSelectionRange = ()=>{};
                    $timeout(()=>{
                        setSelectionRange(element[0], scope.start, scope.end)
                    })*/
                }
            }
        }]);
});
