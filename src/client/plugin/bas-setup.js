(function(para) {
  var p = para.sdk_url,
    n = para.name,
    w = this,
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
  sdk_url: '/js/plugin/bas-data.1.0.0.js',
  name: 'bassdk',
  server_url: 'http://monitor.ruixuesoft.com/monitor/services/monitor/send',
  topic_u:'DPS_users',
  topic_e:'DPS_events'
});
  
/**
 * sdk_url: 是 SDK 文件的地址。 http://bas.ruixuesoft.com/sdk/bas-data.1.0.0.js 这个最新的sdk地址。
 *              为了提高稳定性，建议你们下载下来放在你们服务器或者cdn上，这个地址只提供下载，不保证稳定的网络。
 *              这个文件是utf8编码的，如果打开乱码的话，在浏览器查看中指定下unicode编码。
 * name: 是 SDK 使用的一个默认的全局变量，如定义成 bassdk 的话，后面接可以使用 bassdk.track() 用来跟踪信息。
 *            为了防止变量名重复，你可以修改成其他名称比如 sensorsdata 等 。
 * server_url: 即上面获取到的采集事件的 URL。
 * ※  目前这部分不需要修改
 */

/**
 * Bas埋点常用API使用说明：
 * 注册用户（登录场景同样适用）场景：
 *  //userId为注册完成后生成的用户Id
 *  //bassdk.trackSignup是为了更新以前只有cookie_id的数据，将其对应的userId补全
    bassdk.trackSignup(userId, 'signUp', {
        ReferrerUrl: document.referrer,
        FromUrl: '',
        userName: userInfo.userName,
        companyName: userInfo.companyName,
        telephone: userInfo.tel,
        email: userInfo.email
    });
    //bassdk.userIdentify是为了将本地的cookie_id赋值为userId。
    bassdk.userIdentify(userId, true);

    
    topic设置为**_user，是为了收集注册用户的数据
    properties.topic = 'bas_rongcapital_users';
    bassdk.track('signUp', properties);
 */
 
 /**
 	 埋点使用例：
 	 		$(this).bind('click', function() {      // 客户原有功能点
				var menuText = $(this).text();        // 收集各个埋点信息
				bassdk.track('clickMenu', {                  // 发送埋点信息
					type: 'clickMenu',          // 具体埋点信息项
					MenuText: menuText    // 具体埋点信息项
				})
			})
 */
 
 /**
 	 埋点信息格式（以下埋点项都是可选的，不一定都要设置，按需收集）：
	 	 DPS_events
		{
		    “message”:
		    {
			"事件时间": "2016-06-22 10:28:03",
			"用户ID": "TRW4354556",
			"COOKIE": "A600345346547567",
			"事件": "visit",
			"操作系统版本": "7.1",
			"城市": "大连",
			"设备型号": "iPhone 6",
			"操作系统": "iOS",
			"屏幕宽度": "1080",
			"是否wifi": "true",
			"屏幕高度": "720",
			"应用版本": "2.0",
			"设备制造商": "Apple",
			"国家": "中国",
			"IP地址": "172.20.5.39",
			"省份": "辽宁省",
			"客户来源": "未知",
			"浏览器": "Google",
			"页面名称": "HDFS文件管理",
			"访问时间": "60.00"
		    }
		}

		DPS_users
		{
		    "message":
		    {
			"用户ID": "TRW4354556",
			"用户名": "<真实用户名>",
			"注册时间": "2016-06-22 10:28:03",
			"省份": "辽宁省",
			"城市": "大连",
			"客户类型": "0"
		    }
		}
*/
