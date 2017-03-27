let _hmt = _hmt || [];
((() => {
    let hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?ed13a730df72b0d9d0307dff4d8fdaeb";
    let s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}))();


/*(function(para){var p=para.sdkUrl,n=para.name,w=this,d=w.document,s="script",x=null,y=null;w["RXSTREAM201607"]=n;w[n]=w[n]||{};if(!w[n].lt){x=d.createElement(s),y=d.getElementsByTagName(s)[0];x.async=1;x.src=p;y.parentNode.insertBefore(x,y);w[n].lt=1*new Date();w[n].para=para}})({sdkUrl:"https://stream.ruixuesoft.com/sdk/rxStream.js",sendLimit:1,name:"rxStream",serverUrl:"https://stream.basauthorize.rc.dataengine.com/bassass/app/a53f17521f5326131f71e96645c7478d20160728164338335/authorize/"});*/
/*(function(para) {
    var p = para.sdk_url,
        n = para.name,
        w = window,
        d = w.document,
        s = 'script',
        x = null,
        y = null;
    w['bassdk201603'] = n;
    w[n] = w[n] || function(a) {
        return function() {
            (w[n]._q = w[n]._q || []).push([a, arguments]);
        }
    };
    var ifs = ['track', 'quick', 'register', 'registerOnce', 'registerSession', 'registerSessionOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','userIdentify'];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        y.parentNode.insertBefore(x, y);
        w[n]._t = 1 * new Date();
        w[n].para = para;
    }
})({
    sdk_url: '/js/plugin/bas-data.ROP.1.0.1.js',
    name: 'bassdk',
    server_url: 'http://monitor.ruixuesoft.com/monitor/services/monitor/send',
    topic_u:'ROP_users',
    topic_e:'ROP_events'
});*/
// TODO 请每次升级正式版的时候将上段代码取消注释
window.bassdk ={
    quick:()=>{},
    track:()=>{},
    userIdentify:()=>{},

}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


function formatXml(xml) {
    let formatted = '';
    let reg = /(>)(<)(\/*)/g;
    xml = xml.replace(/>\s*</g,'><').replace(reg, '$1\r\n$2$3');
    let pad = 0;
    $.each(xml.split('\r\n'), (index, node) => {
        let indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += `${padding + node}\r\n`;
        pad += indent;
    });

    return formatted;
}


// 插件以及覆盖
(($ => {

    // jquery自定义event<destroy>，只用于在dom被jquery销毁（任何方式）的时候执行其绑定的函数 ,类似于onremove的作用
    $.event.special.destroyed = {
        remove(o) {
            if (o.handler) {
                o.handler()
            }
        }
    }

    // css3动画结束事件探测器
    function transitionEnd() {
        let el = document.createElement('bootstrap');

        let transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        };

        for (let name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {end: transEndEventNames[name]}
            }
        }

        return false // explicit for ie8 (  ._.)
    }
    $.support.transition = transitionEnd();

    // 添加dom自动为动画效果
    // 注意，请不要在被添加的dom或者添加的dom上加这些css style: transition,opacity,left,position, 否则会被覆盖，并且被添加的dom会被强制显示
    let addWithTransition = function($father, $child, direction,cb){
        if ($father.css('display') == 'none') {
            $father.show(0);
        }
        $father.css({
            height: 'auto',
            transition: '0.6s'
        })
        let childOption = {transition: '0.6s',position: 'relative',opacity: 0}, scope = this;
        childOption[direction] = '20px';
        $child.css(childOption)
        $father.data('oldHeight', $father.height());
        $father.append($child);
        $father.data('newHeight', $father.height());
        $father.height($father.data('oldHeight')).height($father.data('newHeight')).one($.support.transition.end,
            () => {
                $father.css({
                    height: "",
                    transition: ""
                })
            });
        childOption.opacity = 1;
        childOption[direction] = 0;
        $child.css(childOption)
            .one($.support.transition.end,
            function () {
                let childOption = {transition: '',position: '',opacity: ''};
                childOption[direction] = '';
                $(this).css(childOption)
                cb && cb.call(scope);
            });
    };

    let detachWithTransition = function($father, $child, direction,cb){
        if ($father.css('display') == 'none') {
            $father.show(0);
        }
        $father.css({
            height: 'auto',
            transition: '0.6s'
        })
        let childOption = {transition: '0.6s',position: 'relative',opacity: 1}, scope = this;
        childOption[direction] = '0';
        $child.css(childOption);
        $father.data('oldHeight', $father.height());
        $child.hide(0);
        $father.data('newHeight', $father.height());
        $child.show(0);
        childOption.opacity = 0;
        childOption[direction] = '20px';
        $child.css(childOption)
            .one($.support.transition.end,
            () => {
                $child.detach();
                cb && cb.call(scope);
            });
        $father.height($father.data('oldHeight')).height($father.data('newHeight')).one($.support.transition.end,
            () => {
                $father.css({
                    height: "",
                    transition: ""
                })
            });

    };

    $.fn.appendWithTransition = function (dom,direction,cb) {
        let $father = this, $test = $(dom), $child = (!$test) ? dom : $test;
        addWithTransition($father, $child,direction?direction:'left',cb);
        return this;
    }

    $.fn.appendToWithTransition = function (dom, direction,cb) {
        let $child = this, $test = $(dom), $father = (!$test) ? dom : $test;
        addWithTransition($father, $child,direction?direction:'left',cb);
        return this;
    }

    // 增加了销毁动画
    $.fn.detachWithTransition = function (direction,cb) {
        let $father = this.parent();
        detachWithTransition($father, this,direction?direction:'left',cb);
        return this;
    }

    let originalAddEventListener = window.addEventListener, originalRemoveEventListener = window.removeEventListener;
    window.addEventListener = function(){
        !window.listenerStack && (window.listenerStack = {});
        window.listenerStack[arguments[0]] = arguments[1];
        originalAddEventListener.apply(this,arguments);
    }
    window.removeEventListener = function(){
        !window.listenerStack && (window.listenerStack = {});
        delete window.listenerStack[arguments[0]];
        originalRemoveEventListener.apply(this,arguments);
    }

    // for ROP Consistant Transition, must have an attribute rcp-id
    $.fn.consistentTransition = function(){
        let rect = $.data(window,this.attr("rcp-id"));
        if(rect && rect.hasOwnProperty("top") && (rect.el[0] !== this[0])){
            let newRect = window.getScreenRect(this,$("body")), transform = `translate3d(${rect.left - newRect.left}px, ${rect.top - newRect.top}px, 0)`;
            this.hide(0);
            this.css({
                '-webkit-transform': transform,
                transform,
                width: `${newRect.width}px`,
                height: `${newRect.height}px`,
                transition: 0
            });
            this.show(0)
            this.css({
                '-webkit-transform': "translate3d(0,0,0)",
                transform: "translate3d(0,0,0)",
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                transition: 'all 300ms cubic-bezier(0.55, 0, 0.55, 0.2)'
            }).one($.support.transition.end,
                () => {
                    this.css({
                        '-webkit-transform': "",
                        transform: "",
                        width: '',
                        height: '',
                        transition: ''
                    })
                    $.data(window,this.attr("rcp-id"),$.extend({el:this},window.getScreenRect(this,$("body"))));
                });

        } else {
            this.css({
                '-webkit-transform': "",
                transform: "",
                width: '',
                height: '',
                transition: ''
            })
            $.data(window,this.attr("rcp-id"),$.extend({el:this},window.getScreenRect(this,$("body"))));
        }


        // for ROP Consistant Transition, must have an attribute rcp-id
    }

}))($);




function PlayJsQQPopWin(qq, site, hasMenu) {
    setTimeout(() => {
        window.location.href = `tencent://message/?uin=${qq}&Site=${site}&Menu=${hasMenu}`;
    });
};


Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    return fmt;
}
String.prototype.getBytesLength =  function(){ //author: meizz
    var length = 0;
    for(var i=0;i<this.length;i++){
        var code = this.charCodeAt(i),str = String.fromCharCode(code);
        if(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/.test(str)){
            length +=2;
        } else {
            length +=1;
        }
    }
    return length;
}

window.getBrowserType = () => {
    let is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    let is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    let is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    let is_safari = navigator.userAgent.indexOf("Safari") > -1;
    let is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if ((is_chrome)&&(is_safari)) {is_safari=false;}
    if ((is_chrome)&&(is_opera)) {is_chrome=false;}

    if(is_explorer){
        return "MSIE"
    } else if (is_firefox){
        return "Firefox";
    } else if (is_opera){
        return "op";
    } else if (is_safari){
        return "Safari";
    } else if (is_chrome){
        return "Chrome"
    }

    return null;
}
window.getOSName = () => {
    let OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
}
window.getScreenRect = (element, screen) => {
    let elementRect = element[0].getBoundingClientRect();
    let screenRect = screen[0].getBoundingClientRect();

    return {
        top: elementRect.top - screenRect.top,
        left: elementRect.left - screenRect.left,
        width: elementRect.width,
        height: elementRect.height
    };
};
window.clearSelection = ()=>{
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}
window.ROPStyleConstant={
    preLoadingTime: 800,
    loadingTime: 400
}
let previousSearch = "";
window.browserSearch = (el,text) =>{
    var focusElement = document.activeElement;
    if (window.find && window.getSelection) {
        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(el, 0);

        while (window.find(previousSearch)) {
            document.execCommand("removeFormat");
            sel.collapseToEnd();
        }
        while (window.find(text)) {
            document.execCommand("HiliteColor", false, "#00C5A3");
            document.execCommand("ForeColor", false, "white");
            sel.collapseToEnd();
        }
        document.designMode = "off";
    } else if (el.createTextRange) {
        var textRangeP = el.createTextRange();
        while (textRangeP.findText(text)) {
            textRangeP.execCommand("removeFormat");
            textRangeP.collapse(false);
        }
        var textRange = el.createTextRange();
        while (textRange.findText(text)) {
            textRange.execCommand("BackColor", false, "#00C5A3");
            textRange.execCommand("ForeColor", false, "white");
            textRange.collapse(false);
        }
    }
    previousSearch = text;
    // TODO Firefox的focus有bug，这里是workaround
    setTimeout(function() {
        focusElement.focus();
    }, 0);
}


String.prototype.plural = function(revert){

    var plural = {
        '(quiz)$'               : "$1zes",
        '^(ox)$'                : "$1en",
        '([m|l])ouse$'          : "$1ice",
        '(matr|vert|ind)ix|ex$' : "$1ices",
        '(x|ch|ss|sh)$'         : "$1es",
        '([^aeiouy]|qu)y$'      : "$1ies",
        '(hive)$'               : "$1s",
        '(?:([^f])fe|([lr])f)$' : "$1$2ves",
        '(shea|lea|loa|thie)f$' : "$1ves",
        'sis$'                  : "ses",
        '([ti])um$'             : "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$'                : "$1ses",
        '(alias)$'              : "$1es",
        '(octop)us$'            : "$1i",
        '(ax|test)is$'          : "$1es",
        '(us)$'                 : "$1es",
        '([^s]+)$'              : "$1s"
    };

    var singular = {
        '(quiz)zes$'             : "$1",
        '(matr)ices$'            : "$1ix",
        '(vert|ind)ices$'        : "$1ex",
        '^(ox)en$'               : "$1",
        '(alias)es$'             : "$1",
        '(octop|vir)i$'          : "$1us",
        '(cris|ax|test)es$'      : "$1is",
        '(shoe)s$'               : "$1",
        '(o)es$'                 : "$1",
        '(bus)es$'               : "$1",
        '([m|l])ice$'            : "$1ouse",
        '(x|ch|ss|sh)es$'        : "$1",
        '(m)ovies$'              : "$1ovie",
        '(s)eries$'              : "$1eries",
        '([^aeiouy]|qu)ies$'     : "$1y",
        '([lr])ves$'             : "$1f",
        '(tive)s$'               : "$1",
        '(hive)s$'               : "$1",
        '(li|wi|kni)ves$'        : "$1fe",
        '(shea|loa|lea|thie)ves$': "$1f",
        '(^analy)ses$'           : "$1sis",
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
        '([ti])a$'               : "$1um",
        '(n)ews$'                : "$1ews",
        '(h|bl)ouses$'           : "$1ouse",
        '(corpse)s$'             : "$1",
        '(us)es$'                : "$1",
        's$'                     : ""
    };

    var irregular = {
        'move'   : 'moves',
        'foot'   : 'feet',
        'goose'  : 'geese',
        'sex'    : 'sexes',
        'child'  : 'children',
        'man'    : 'men',
        'tooth'  : 'teeth',
        'person' : 'people'
    };

    var uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if(uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;

    // check for irregular forms
    for(var word in irregular){

        if(revert){
            var pattern = new RegExp(irregular[word]+'$', 'i');
            var replace = word;
        } else{ var pattern = new RegExp(word+'$', 'i');
            var replace = irregular[word];
        }
        if(pattern.test(this))
            return this.replace(pattern, replace);
    }

    if(revert) var array = singular;
    else  var array = plural;

    // check for matches using regular expressions
    for(var reg in array){

        var pattern = new RegExp(reg, 'i');

        if(pattern.test(this))
            return this.replace(pattern, array[reg]);
    }

    return this;
}

















