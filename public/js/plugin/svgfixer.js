!function(e,t){"use strict";e.addEventListener("DOMContentLoaded",function(){var n=t.location.href.replace(t.location.hash,"");[].slice.call(e.querySelectorAll("use[*|href]")).filter(function(e){return 0===e.getAttribute("xlink:href").indexOf("#")}).forEach(function(e){e.setAttribute("xlink:href",n+e.getAttribute("xlink:href"))})},!1)}(document,window);