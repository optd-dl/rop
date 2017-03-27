function del_html_tags(str, reallyDo, replaceWith) {
    var e = new RegExp(reallyDo, "g");
    words = str.replace(e, replaceWith);
    return words;
} 

function packageTree(data) {
    if (data.indexOf('body')) {
        data = del_html_tags(data, 'body', 'body1');
    }
    var html = '<code class="plain">&lt;?xml version="1.0" ?&gt;</code>';
    var xml;
    var startIndex;
    if ($.browser.msie) {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.loadXML(data);
        xml = $(xml).children();
        startIndex = 0;
    } else {
        xml = data;
        startIndex = 1;
    }
    var xmlObj = $(xml);
	html = html + '<ul id="tree">';
	for (var i = startIndex; i < xmlObj.length; i++) {
		var $xmlroot = $(xmlObj[i]);
		var xmlroot = xmlObj[i];
		if (xmlroot.nodeType == 1) {
		    html = html + '<li><code class="plain">&lt;</code><code class="keyword">' + xmlroot.nodeName.toLowerCase() + '</code>';
		    var atr = xmlroot.attributes;
		    if (typeof (atr) != "undefined") {
		        for (var k = 0; k < atr.length; k++) {
		            html = html + ' ' + '<code class="color1">' + atr[k].nodeName + '</code>' + '="' + '<code class="string">' + atr[k].nodeValue + '</code>' + '"';
		        }
		    }
		    html = html + '<code class="plain">&gt;</code>';
		    if ($xmlroot.children().length > 0) {
		        html = html + packageChildren($xmlroot.children());
		    } else {
		        html = html + '<code class="plainplain">' + $xmlroot.text() + '</code>';
		    }
		    html = html + '<code class="plain">&lt;/</code><code class="keyword">' + xmlroot.nodeName.toLowerCase() + '</code><code class="plain">&gt;</code></li>';
		}
	}
	html = html + '</ul>';

	if (html.indexOf('body1')) {
	    html = del_html_tags(html, 'body1', 'body');
	}
	
	$('#CanvasXml').html(html);
	$("#tree").treeview();
}

function packageTreeError(data) {
    if (data.indexOf('body')) {
        data = del_html_tags(data, 'body', 'body1');
    }
    var html = '<code class="plain">&lt;?xml version="1.0" ?&gt;</code>';
    var xml;
    var startIndex;
    if ($.browser.msie) {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.loadXML(data);
        xml = $(xml).children();
        startIndex = 0;
    } else {
        xml = data;
        startIndex = 1;
    }
    var xmlObj = $(xml);
    html = html + '<ul id="treeError">';
    for (var i = startIndex; i < xmlObj.length; i++) {
        var $xmlroot = $(xmlObj[i]);
        var xmlroot = xmlObj[i];
        if (xmlroot.nodeType == 1) {
            html = html + '<li><code class="plain">&lt;</code><code class="keyword">' + xmlroot.nodeName.toLowerCase() + '</code>';
            var atr = xmlroot.attributes;
            if (typeof (atr) != "undefined") {
                for (var k = 0; k < atr.length; k++) {
                    html = html + ' ' + '<code class="color1">' + atr[k].nodeName + '</code>' + '="' + '<code class="string">' + atr[k].nodeValue + '</code>' + '"';
                }
            }
            html = html + '<code class="plain">&gt;</code>';
            if ($xmlroot.children().length > 0) {
                html = html + packageChildren($xmlroot.children());
            } else {
                html = html + '<code class="plainplain">' + $xmlroot.text() + '</code>';
            }
            html = html + '<code class="plain">&lt;/</code><code class="keyword">' + xmlroot.nodeName.toLowerCase() + '</code><code class="plain">&gt;</code></li>';
        }
    }
    html = html + '</ul>';

    if (html.indexOf('body1')) {
        html = del_html_tags(html, 'body1', 'body');
    }

    $('#CanvasXmlError').html(html);
    $("#treeError").treeview();
}

function packageChildren(children) {
	var html = '';
	html = html + '<ul>';
	for (var i = 0; i < children.length; i++) {
		var $node = $(children[i]);
		var node = children[i];
		html = html + '<li><code class="plain">&lt;</code><code class="keyword">' + node.nodeName.toLowerCase() + '</code>';
		var atr = children[i].attributes;
		if (typeof(atr) != "undefined") { 
			for (var k = 0; k < atr.length; k++) {
				//html = html + ' '+ atr[k].nodeName + '="' + atr[k].nodeValue + '"';
				html = html + ' '+'<code class="color1">'+ atr[k].nodeName + '</code>'+ '="' +'<code class="string">'+  atr[k].nodeValue + '</code>'+ '"';
			}
		}
		html = html + '<code class="plain">&gt;</code>';
		if ($node.children().length > 0) {
			html = html + packageChildren($node.children());
		} else {
		    html = html + '<code class="plainplain">' + $node.text() + '</code>';
		}
		html = html + '<code class="plain">&lt;/</code><code class="keyword">' + node.nodeName.toLowerCase() + '</code><code class="plain">&gt;</code></li>';
	}
	html = html + '</ul>';
	return html;
}