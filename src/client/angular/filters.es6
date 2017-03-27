define(['angular'], angular => {
    'use strict';
    angular.module('rop.filters', [])
        .filter('escapeHtml', () => {
            let entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };
            return str => String(str).replace(/[&<>"'\/]/g, s => entityMap[s])
        })
        .filter('unescapeHtml', () => {
            let entityMap = {
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                '&quot;': '"',
                '&#39;': "'",
                '&#x2F;': "/"
            };
            return (str, type) => {
                if (!str) {
                    return;
                }
                let rawStr = String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, s => entityMap[s]);
                if (str && (str != 'undefined')) {
                    if (type == 'json') {
                        return JSON.stringify(JSON.parse(rawStr), null, 2);
                    } else if (type == 'xml') {
                        return formatXml(rawStr);
                    }
                }

                return rawStr
            }
        })
        .filter('ellipsis', ['$filter', $filter => function () {
            let result = $filter('limitTo').apply(this, arguments);
            return `${result}......`;
        }])
        .filter('trusthtml', ['$sce', $sce => t => $sce.trustAsHtml(t)])
        .filter('parseYear', () => (str, type) => {
            let year = str;
            try {
                year = new Date(str).getFullYear();
            } catch (e) {
                console.log("warning, unable to parse the date string")
            }

            return year
        })
        .filter('parseMonth', () => (str, type) => {
            let month = str;
            try {
                month = new Date(str).getMonth() + 1;
            } catch (e) {
                console.log("warning, unable to parse the date string")
            }

            return month
        })
        .filter('parseDate', () => (str, type) => {
            let date = str;
            try {
                date = new Date(str).getDate();
                (date < 10) && (date = `0${date}`);
            } catch (e) {
                console.log("warning, unable to parse the date string")
            }

            return date
        });
});
