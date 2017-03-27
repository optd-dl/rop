var i18n = require('i18n'),constant = require('./constant');

i18n.configure({
    locales:['zh-cn', 'zh-en'],
    directory: `${__dirname}/../${constant.localePath}`,
    defaultLocale: 'zh-cn',
    cookie: 'lang'
});

module.exports = {
    updateLocale(req, res, next) {
        i18n.init(req, res);
        let cookie_locale = req.cookies._lang, current_locale = i18n.getLocale();
        if(req.session){
            req.session.locale = current_locale;
            if (!cookie_locale){
                res.cookie("_lang",current_locale,{domain:`.${constant.domain}` /*+ ":" + constant.port*/})
                console.log(`语言初始化为${current_locale}`);
            } else if (cookie_locale != current_locale){
                i18n.setLocale(res.locals,cookie_locale);
                req.session.locale = cookie_locale;
                console.log(`语言切换为${cookie_locale}`);
            } else {
                //i18n.setLocale(res.locals,cookie_locale);
                console.log(`语言保持为${current_locale}`);
            };
        } else {
            console.log(current_locale);
            i18n.setLocale(res.locals,'zh-cn');
        }
        return next();
    },
    localeMap: {
        "zh-cn":0,
        "zh-en":1
    }
};