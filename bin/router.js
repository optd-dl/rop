'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*TODO map 中的path的存在是为了多api库调用功能存在的，multiple是post方式开关，_init用于把api注入到ejs一并发送给前端而存在的*/
var map = {
    welcome: {
        index: {
            _init: [],
            carousels: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.carousel.image.get',
                    image_type: 0
                }
            },
            notice: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.notice.list.get',
                    notice_cat: 0,
                    pageindex: 1,
                    pagesize: 10
                }
            },
            suppliers: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.list.get',
                    pageindex: 1,
                    pagesize: 99
                }
            }
        },
        search: {
            _init: [],
            search: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.search.list.get',
                    keyword: "",
                    pageindex: 1,
                    pagesize: 10,
                    searchflg: "all"
                }
            },
            hints: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.hints.list.get'
                }
            }
        },
        suppliers: {
            _init: [],
            suppliers: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.list.get',
                    pageindex: 1,
                    pagesize: 99999
                }
            }
        },
        info: {
            _init: [],
            infos: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.notice.list.get',
                    pageindex: 1,
                    pagesize: 10,
                    notice_cat: 0
                }
            }
        },
        features: {
            _init: []
        },
        API: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.api.list.get'
                }
            }
        },
        "info-detail": {
            _init: []
        },
        debugTool: {
            _init: []
        },
        services: {
            _init: [],
            notice: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.notice.list.get',
                    notice_cat: 0,
                    pageindex: 1,
                    pagesize: 999
                }
            },
            askQuestion: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.question.add'
                }
            },
            faq: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.question.list.get'
                }
            }
        },
        doc: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.doc.details.get'
                }
            },
            api_flow: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.api.flow.get'
                }
            },
            api_update: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.api.update.list.get'
                }
            },
            doc_cat: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.doc.cat.get',
                    cat_type: '0'
                }
            },
            doc_detail: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.doc.details.get',
                    doc_id: '',
                    // TODO（0：添加访问次数   1：点赞次数）
                    set_type: '0'
                }
            },
            view_count: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.doc.view.count.set',
                    doc_id: ''
                }
            }
        },
        "doc-cat": {
            _init: []
        },
        "doc-details": {
            _init: []
        },
        sdkTool: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.sdk.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            }
        }
    },
    supplier: {
        API: {
            _init: [],
            api_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.list.get',
                    pageindex: 1,
                    pagesize: 99999
                }
            },
            api_domain: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.apidomain.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            api_detail: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.detail.get',
                    api_id: ''
                }
            },
            api_detail_preview: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.detail.preview.get',
                    api_id: ''
                }
            },
            domain_detail: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.apidomain.property.get',
                    domain_id: ''
                }
            },
            domain_detail_preview: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.apidomain.property.preview.get',
                    domain_id: ''
                }
            },
            get_ssv: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.api.userid.get'
                    /*api_id:'',
                     domain_id: undefined*/
                }
            },
            get_ssv_cat: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.api.list.get',
                    ssv_user_id: ''
                }
            }
        },
        index: {
            _init: [],
            carousels: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.carousel.image.get',
                    image_type: 2
                }
            },
            ssv_intro: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.intro.get'
                }
            },
            success_developers: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.success.isv.user.list.get',
                    pageindex: 1,
                    pagesize: 999999
                }
            },
            get_feature: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.feature.desc.get"
                }
            }
        },
        preview: {
            _init: []
        },
        login: {
            _init: []
        },
        'function': {
            _init: [],
            get_feature: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.feature.desc.get"
                }
            }
        },
        info: {
            _init: [],
            infos: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.notice.list.get',
                    notice_cat: 1
                }
            }
        },

        "info-detail": {
            _init: [],
            comments: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.comment.list.get',
                    pageindex: 1,
                    pagesize: 10,
                    ssv_user_id: '36c1c57c-045f-4750-b1f1-4e1dce3599d2'
                }
            },
            submit_comment: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.insert.user.comment'
                }
            }
        },
        "all-comment": {
            _init: [],
            comments: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.comment.list.get',
                    pageindex: 1,
                    pagesize: 99999,
                    ssv_user_id: '36c1c57c-045f-4750-b1f1-4e1dce3599d2'
                }
            },
            add: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.comment.add'
                }
            },
            reply: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.comment.reply'
                }
            },
            delete: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.comment.delete'
                }
            }
        },
        session: {
            favor: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.insert.user.favo'
                }
            },
            request: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.insert.user.app'
                }
            }
        }
    },
    sso: {
        index: {
            _init: [],
            login: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.login',
                    user_account: '',
                    password: ''
                }
            },
            logout: {}
        },
        register: {
            _init: [],
            regist: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.regist'
                }
            }
        },
        findpassword: {
            _init: [],
            findpassword: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.password.reset.mail.send'
                }
            }
        },
        resetpassword: {
            _init: [],
            resetpassword: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.password.reset'
                }
            }
        },
        activeuser: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.active'
                }
            }
        },
        update: {
            _init: [],
            getuser: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.info.get'
                }
            },
            saveuser: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.info.update'
                }
            }
        },
        updatepassword: {
            _init: [],
            updatepassword: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.password.update'
                }
            }
        },
        session: {
            _init: [],
            login: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.login',
                    user_account: '',
                    password: '',
                    login_system: ''
                }
            },
            logout: {}
        }
    },
    application: {
        error: {
            _init: []
        },
        api: {
            _init: [],
            init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.list.init'
                }
            },
            api_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            delete_api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.delete',
                    api_id: ""
                }
            },
            apply_api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.apply',
                    api_id: ""
                }
            },
            cancel_api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.cancel',
                    api_id: ""
                }
            },
            dump_api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.scrap',
                    api_id: ""
                }
            },
            recover_api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.recover',
                    api_id: ""
                }
            },
            batch_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.batch.apply.save',
                    apply_type: "1",
                    api_id: "0cca3abe-bba9-462b-9cfb-b2b130545ef5@0d9584d2-f0e9-4707-b4c9-bd5b1e6729a2"
                }
            },
            noaudit_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.noaudit.list.get',
                    cat_id: ""
                }
            },
            noaudit_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.noaudit.save',
                    api_id: "18c15d6f-b769-4c19-acd9-007eceea2516@2DD9D52E-172F-4F30-BA0E-68F95C5E872D"
                }
            },
            sort_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.sort.list.get',
                    cat_id: "261D8E19-5DBD-4A4B-A914-EF51DB331F31"
                }
            },
            sort_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.sort.save',
                    api_id: "166C21E2-32E4-4DCA-B862-B0CA3A818F6E@543803ED-783B-40F3-A94B-FE8A78A78D34"
                }
            },
            cache_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.cache.init',
                    api_id: "0cca3abe-bba9-462b-9cfb-b2b130545ef5"
                }
            },
            cache_apply: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.cache.status.apply',
                    api_id: "0cca3abe-bba9-462b-9cfb-b2b130545ef5",
                    cache_type: "0",
                    cache_status: "2"
                }
            },
            cache_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.api.cache.save',
                    api_id: "0cca3abe-bba9-462b-9cfb-b2b130545ef5",
                    cache_time: "5",
                    cache_time_online: "5"
                }
            },
            api_init: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.api.edit.init"
                }
            },
            api_info: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.api.info.get",
                    api_id: "0cca3abe-bba9-462b-9cfb-b2b130545ef5"
                }
            },
            api_datatype: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.api.edit.datatype.get",
                    cat_id: "88a8e847-902c-4296-b702-5eb9ed7e4946"
                }
            },
            api_save: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.api.data.save"
                }
            },
            api_export: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.api.data.export",
                    api_id: "8f29d3ab-3c74-4685-b615-000d73baf9f6",
                    test_url: "",
                    online_url: ""
                }
            },
            reminder_developers: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.remind.user.list.get",
                    api_id: ""
                }
            },
            reminder_send: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.remind.mail.send",
                    api_id: "",
                    user_list: [{ user_id: "" }]
                }
            }
        },
        analysis: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.log.statistics.list.get",
                    logtype: "0",
                    keyword: "",
                    searchdate: "2016-10-14",
                    begintime: "08:18:05",
                    endtime: "09:18:05",
                    rowkey: "",
                    pageindex: "1"
                }
            }
        },
        analysis_sandbox: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.log.statistics.list.get",
                    logtype: "1",
                    keyword: "",
                    searchdate: "2016-10-14",
                    begintime: "08:18:05",
                    endtime: "09:18:05",
                    rowkey: "",
                    pageindex: "1"
                }
            }
        },
        app: {
            _init: [],
            /** 获取供应商应用帐号信息数据
             请求参数：
             {
             "action": "ruixue.rop.ssv.app.detail.get",
             "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a"
             }
              返回结果：
             {
             "is_success": "true",
             "sub_code": "",
             "sub_msg": "",
             "code": "",
             "msg": "",
             "app_id": "5e8067b0-7899-4d8d-b0ff-90a18a083413"，
             "app_name": "短信供应商应用",
             "appkey": "0944ce71-b4e1-4ab7-a416-2711ea094d26",
             "appsecret": "ea5f3e1f-ce15-49ec-92ba-1ea85518f0c3",
             "test_appkey": "D587DAC2-8640-4CFC-BFE6-FA77522D8CB7",
             "test_appsecret": "7BA80975-8009-4F4E-AEC9-B77E30F7AFAE",
             "test_access_token": "6EB89BA4-8669-4C5D-A87A-E5E9D0EA3A4A",
             "test_expiring_time": "2025/9/6 11:21:48",
             "access_token": "6A94E094-B8B5-41A3-A423-1C124AA35899",
             "expiring_time": "2025/9/6 11:21:48",
             "remark": "",
             "online_url": "http://api.open.ruixuesoft.com:30001/ropapi",
             "test_url": "http://testapi.open.ruixuesoft.com:30001/ropapi",
             "token_url": "https://api.open.ruixuesoft.com:30005/ropapi",
             "test_token_url": "https://testapi.open.ruixuesoft.com:30005/ropapi"
             }
             供应商应用帐号重置
            请求参数：
            {
                "action": "ruixue.rop.ssv.app.detail.reset",
                "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                "app_id": "5e8067b0-7899-4d8d-b0ff-90a18a083413",
                "reset_type": "0"
            }
             reset_type(0：appkey  1：test_appkey  2：accesstoken  3：test_accesstoken)
             返回结果：
            {
                "is_success": "true",
                "sub_code": "",
                "sub_msg": "",
                "code": "",
                "msg": "",
                "appsecret": "正式"
            }*/
            app_get: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.app.detail.get"
                }
            },
            app_reset: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.app.detail.reset",
                    session_id: "",
                    app_id: "",
                    reset_type: ""
                }
            }
        },
        assist: {
            _init: [],
            api_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.api.call.count.get",
                    log_type: "0"
                }
            },
            app_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.app.call.count.get",
                    log_type: "0"
                }
            },
            day_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.day.call.count.get",
                    log_type: "0"
                }
            },
            count_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.user.api.count.get"
                }
            },
            log_get: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            api_detail: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.api.detail.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            api_app: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.app.detail.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            ip_detail: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.ip.detail.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            hour_api: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.hour.api.detail.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            hour_ip: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.hour.ip.detail.list.get",
                    log_type: "0",
                    user_type: "2"
                }
            },
            realtime_apis: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.hour.call.count.get",
                    log_type: "0"
                }
            }
        },
        assist_sandbox: {
            _init: [],
            api_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.api.call.count.get",
                    log_type: "1"
                }
            },
            app_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.app.call.count.get",
                    log_type: "1"
                }
            },
            day_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.day.call.count.get",
                    log_type: "1"
                }
            },
            count_call: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.user.api.count.get"
                }
            },
            log_get: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            api_detail: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.api.detail.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            api_app: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.app.detail.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            ip_detail: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.ip.detail.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            hour_api: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.hour.api.detail.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            hour_ip: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.analyze.hour.ip.detail.list.get",
                    log_type: "1",
                    user_type: "2"
                }
            },
            realtime_apis: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.hour.call.count.get",
                    log_type: "1"
                }
            }

        },
        auth: {
            _init: []
        },
        category: {
            _init: [],
            /** 请求参数：
             {
                 "action": "ruixue.rop.ssv.category.list.init",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "role_list": {
                     "btnInsert": "1",
                     "btnUpdate": "1",
                     "btnDelete": "1",
                     "btnApply": "1"
                 }
             }
             */
            cat_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.list.init'
                }
            },
            /** 获取供应商分类列表
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "pageindex": "1",
                 "pagesize": "10",
                 "cat_name": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "list_count": "1",
                 "page_count": "1",
                 "data_list": [
                     {
                         "cat_id": "dde85c47-f645-4c73-828b-220a893e801d",
                         "cat_name": "短信API",
                         "cat_title": "短信API",
                         "cat_status": "已审核",
                         "create_time": "2015/4/7 9:41:04"
                     }
                 ]
             }*/
            cat_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.list.get',
                    pageindex: "1",
                    pagesize: "10",
                    cat_name: ""
                }
            },
            /** 供应商分类保存页面初始化
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.data.save.init",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "type_list": [
                     {
                         "type_id": "9F68DAD0-CA44-4624-BD5E-C49E2C965B11",
                         "type_name": "系统API"
                     },
                     {
                         "type_id": "6394743E-269B-49AA-B2AA-8E09D6251704",
                         "type_name": "电商ERP"
                     },
                     {
                         "type_id": "4D02ECEA-E8F7-40A1-B168-E71366821474",
                         "type_name": "新业务"
                     }
                 ]
             }*/
            save_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.data.save.init'
                }
            },
            /** 保存供应商分类
             请求参数：
             cat_type_id：分类类型
             cat_name：分类名称
             cat_name_en：分类名称英文
             cat_title：分类简介
             cat_title_en：分类简介英文
             cat_desc：分类描述
             cat_desc_en：分类描述英文
             cat_id：分类id
             {
                 "action": "ruixue.rop.ssv.category.data.save",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_type_id": "4D02ECEA-E8F7-40A1-B168-E71366821474",
                 "cat_name": "test1",
                 "cat_name_en": "test1",
                 "cat_title": "test1",
                 "cat_title_en": "test1",
                 "cat_desc": "test1",
                 "cat_desc_en": "test1",
                 "cat_id": ""
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            cat_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.data.save',
                    cat_type_id: "",
                    cat_name: "",
                    cat_name_en: "",
                    cat_title: "",
                    cat_title_en: "",
                    cat_desc: "",
                    cat_desc_en: "",
                    cat_id: ""
                }
            },
            /** 删除供应商分类
             请求参数：
             cat_id：分类id
             {
                 "action": "ruixue.rop.ssv.category.delete",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_id": "3B6500C1-5677-416D-A08E-990D6BA99BC8"
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            cat_del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.delete',
                    cat_id: ""
                }
            },
            /** 供应商申请分类页面已审核数据
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.checked.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_name": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "data_list": [
                     {
                         "cat_name": "短信API",
                         "user_name": "短信供应商",
                         "is_apply": "已审核"
                     }
                 ]
             }*/
            cat_checked: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.checked.list.get',
                    cat_name: ""
                }
            },
            /** 供应商申请分类页面未审核数据
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.unchecked.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_name": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "data_list": [
                     {
                         "cat_name": "壹是壹API",
                         "cat_id": "024cc76b-b969-4ec9-bd99-58e316728a98",
                         "user_name": "壹是壹科技",
                         "is_apply": "未申请"
                     },
                     {
                         "cat_name": "退款单API",
                         "cat_id": "06a826c4-4803-4d27-8603-6626df870e3c",
                         "user_name": "",
                         "is_apply": "未申请"
                     }
                 ]
             }*/
            cat_unchecked: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.unchecked.list.get',
                    cat_name: ""
                }
            },
            /** 供应商分类申请
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.apply",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_list": [
                     {
                         "cat_id": "024cc76b-b969-4ec9-bd99-58e316728a98"
                     },
                     {
                         "cat_id": "06a826c4-4803-4d27-8603-6626df870e3c"
                     }
                 ]
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            cat_apply: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.apply',
                    cat_list: [{ cat_id: "" }]
                }
            }
        },
        caution: {
            _init: [],
            api_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.api.list.get'
                }
            },
            mail_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.mail.list.get'
                }
            },
            mobile_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.mobile.list.get'
                }
            },
            mail_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.mail.save',
                    mail_list: [{ user_mail: "" }]
                }
            },
            mobile_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.mobile.save',
                    mobile_list: [{ user_mobile: "" }]
                }
            },
            main_count: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.main.count.get'
                }
            },
            url_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.url.list.get'
                }
            },
            /**
             *  url_list可选
             caution_title：报警信息（必填）
             caution_url：报警地址（必填）
             caution_switch(1：报警  0：不报警)（必填）
             mail_flag：是否邮箱报警(1：报警  0：不报警)（必填）
             sms_flag：是否短信报警(1：报警  0：不报警)（必填）
             interval：扫描间隔（非必填）
             count：扫描次数（非必填）
             time_out：超时时间（非必填）
             caution_mail：报警邮箱（如果没有配置全局报警邮箱，必填）
             caution_mobile：报警手机（如果没有配置全局报警手机，必填）
             */
            url_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.url.save',
                    url_list: [{
                        caution_title: "",
                        caution_url: "",
                        caution_switch: "0",
                        mail_flag: "0",
                        sms_flag: "0",
                        interval: "0",
                        count: "0",
                        time_out: "0",
                        caution_mail: "",
                        caution_mobile: ""
                    }]
                }
            },
            error_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.error.list.get',
                    api_id: ''
                }
            },
            /** error_list可选
             main_flag(1：全局  0：非全局)（必填）
             error_id（非必填，error_id与other_desc不允许同时空，main_flag为1时两个参数传空）
             other_desc（非必填，error_id与other_desc不允许同时空，main_flag为1时两个参数传空）
             mail_flag：是否邮箱报警(1：报警  0：不报警)（必填）
             sms_flag：是否短信报警(1：报警  0：不报警)（必填）
             interval：报警间隔（非必填）
             count：错误次数（非必填）
             caution_mail：报警邮箱（如果没有配置全局报警邮箱，必填）
             caution_mobile：报警手机（如果没有配置全局报警手机，必填）
             */
            error_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.error.save',
                    api_id: '',
                    error_list: [{
                        main_flag: "0",
                        error_id: "",
                        other_desc: "",
                        mail_flag: "0",
                        sms_flag: "0",
                        interval: "0",
                        count: "0",
                        caution_mail: "",
                        caution_mobile: ""
                    }]
                }
            },
            sys_error_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.sys.error.list.get'
                }
            },
            /** api_list可选
             api_id（必填）
             error_list可选
             error_id（非必填，error_id与other_desc不允许同时空，main_flag为1时两个参数传空）
             other_desc（非必填，error_id与other_desc不允许同时空，main_flag为1时两个参数传空）
             mail_flag：是否邮箱报警(1：报警  0：不报警)（必填）
             sms_flag：是否短信报警(1：报警  0：不报警)（必填）
             interval：报警间隔（非必填）
             count：错误次数（非必填）
             caution_mail：报警邮箱（如果没有配置全局报警邮箱，必填）
             caution_mobile：报警手机（如果没有配置全局报警手机，必填）*/
            sys_error_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.caution.sys.error.save',
                    api_list: [{ api_id: "" }],
                    error_list: [{
                        error_id: "",
                        other_desc: "",
                        mail_flag: "0",
                        sms_flag: "0",
                        interval: "0",
                        count: "0",
                        caution_mail: "",
                        caution_mobile: ""
                    }]
                }
            }
        },
        doc: {
            _init: []
        },
        domain: {
            _init: [],
            init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.list.init'
                }
            },
            domain_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.list.get',
                    pageindex: 1,
                    pagesize: 10,
                    domain_name: "",
                    cat_id: "",
                    status: "",
                    sort_name: "",
                    sort_flag: ""
                }
            },
            domain_info: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.domain.property.get",
                    domain_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            domain_delete: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.delete',
                    domain_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            domain_save: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.domain.save"
                }
            },
            domain_optional: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.domain.update.check",
                    domain_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            domain_apply: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.domain.apply",
                    domain_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            domain_cancel: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.status.cancel',
                    domain_id: ""
                }
            },
            domain_status_apply: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.status.update',
                    domain_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            domain_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.edit.init'
                }
            },
            domain_datatype: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.edit.datatype.get',
                    cat_id: "119d6ec1-26da-4b50-ac82-6e41d10a44ae"
                }
            },
            sort_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.sort.list.get'
                }
            },
            sort_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.domain.sort.save'
                }
            }
        },
        download: {
            _init: []
        },
        env_list: {
            _init: []
        },
        env_app: {
            _init: [],
            init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.set.init'
                }
            },
            save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.set.save',
                    id: "",
                    eid: ""
                }
            },
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.set.list.get',
                    pageindex: "1",
                    pagesize: "10",
                    user_id: "",
                    eid: ""
                }
            },
            status: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.status.update',
                    status: "1"
                }
            }
        },
        env_set: {
            _init: [],
            init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.list.init'
                }
            },
            save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.data.save',
                    eid: "",
                    ename: "",
                    remark: "",
                    environment_url: [{ api_id: "", api_url: "" }, { api_id: "", api_url: "" }]
                }
            },
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.list.get',
                    pageindex: "1",
                    pagesize: "10",
                    ename: ""
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.delete',
                    eid: ""
                }
            },
            detail: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.edit.data.get',
                    eid: ""
                }
            },
            clone: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.ssv.environment.url.copy",
                    eid: ""
                }
            },
            export: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.environment.url.export',
                    eid: ""
                }
            }
        },
        flow: {
            _init: []
        },
        func: {
            _init: []
        },
        group: {
            _init: [],
            /** 供应商子分类列表页面初始化
             * 请求参数：
             {
                "action": "ruixue.rop.ssv.category.group.list.init",
                "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                "sub_session_id": ""
             }
              返回结果：
             {
                "is_success": "true",
                "sub_code": "",
                "sub_msg": "",
                "code": "",
                "msg": "",
                "cat_list": [
                    {
                        "cat_id": "dde85c47-f645-4c73-828b-220a893e801d",
                        "cat_name": "短信API"
                    },
                    {
                        "cat_id": "5EC9BC3A-1321-43A8-A6B1-575D8878CDB7",
                        "cat_name": "test2"
                    }
                ],
                "role_list": {
                    "btnInsert": "0",
                    "btnUpdate": "0",
                    "btnDelete": "0",
                    "btnApply": "0"
                }
             }
             */
            cat_group_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.list.init'
                }
            },

            /*获取供应商子分类列表
            请求参数：
            {
                "action": "ruixue.rop.ssv.category.group.list.get",
                "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                "sub_session_id": "",
                "pageindex": "1",
                "pagesize": "10",
                "cat_id": "",
                "group_name": ""
            }
             返回结果：
            {
                "is_success": "true",
                "sub_code": "",
                "sub_msg": "",
                "code": "",
                "msg": "",
                "list_count": "1",
                "page_count": "1",
                "data_list": [
                {
                    "cat_name": "test2",
                    "group_id": "B8C4C45A-819C-401D-A662-59F1A4370FF4",
                    "group_name": "test555",
                    "group_title": "test555",
                    "group_status": "未审核",
                    "create_user_name": "短信供应商",
                    "create_time": "2017/2/7 15:26:34"
                }
            ]
            }*/
            cat_group_list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.list.get',
                    pageindex: "1",
                    pagesize: "10",
                    cat_id: "",
                    group_name: ""
                }
            },
            /** 供应商子分类保存页面初始化
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.group.data.save.init",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "cat_list": [
                     {
                         "cat_id": "dde85c47-f645-4c73-828b-220a893e801d",
                         "cat_name": "短信API"
                     },
                     {
                         "cat_id": "5EC9BC3A-1321-43A8-A6B1-575D8878CDB7",
                         "cat_name": "test2"
                     }
                 ]
             }
             }*/
            save_group_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.data.save.init'
                }
            },
            /**保存供应商子分类
             请求参数：
                "action": "ruixue.rop.ssv.category.group.data.save",
            {
                "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                "sub_session_id": "",
                "cat_id": "5EC9BC3A-1321-43A8-A6B1-575D8878CDB7",
                "group_name": "test555",
                "group_name_en": "test555",
                "group_title": "test555",
                "group_title_en": "test555",
                "group_desc": "test555",
                "group_desc_en": "test555",
                "group_id": ""
            }
             返回结果：
            {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}
            */
            cat_group_save: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.data.save',
                    cat_id: "",
                    group_name: "",
                    group_name_en: "",
                    group_title: "",
                    group_title_en: "",
                    group_desc: "",
                    group_desc_en: "",
                    group_id: ""
                }
            },
            /**
             删除供应商子分类
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.group.delete",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "group_id": "1DC176DD-B2FF-4CDF-86E0-A2B8A14AA452"
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}
             */
            cat_group_del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.delete',
                    group_id: ""
                }
            },
            /*
             供应商申请子分类页面初始化
             请求参数：
             {
                "action":"ruixue.rop.ssv.category.group.apply.init",
                "session_id":"46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                "sub_session_id":""
             }
              */
            cat_group_apply_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.apply.init'
                }
            },

            /**
             *
             供应商申请子分类页面已审核数据
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.group.checked.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_id": "5EC9BC3A-1321-43A8-A6B1-575D8878CDB7",
                 "group_name": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "data_list": [
                     {
                         "group_name": "会员",
                         "user_name": "系统管理员",
                         "is_apply": "已审核"
                     },
                     {
                         "group_name": "二维码",
                         "user_name": "系统管理员",
                         "is_apply": "已审核"
                     }
                 ]
             }
             */
            cat_group_checked: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.checked.list.get',
                    cat_id: "",
                    group_name: ""
                }
            },
            /**
             供应商申请子分类页面未审核数据
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.group.unchecked.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_id": "5EC9BC3A-1321-43A8-A6B1-575D8878CDB7",
                 "group_name": ""
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "data_list": [
                     {
                         "group_name": "二维码",
                         "cat_id": "f627618e-7cab-4a9e-88a6-113f4eb14d0b",
                         "group_id": "a165b6b4-ce01-485d-ab59-3d2caa43db65",
                         "user_name": "系统管理员",
                         "is_apply": "未申请"
                     },
                     {
                         "group_name": "会员",
                         "cat_id": "f627618e-7cab-4a9e-88a6-113f4eb14d0b",
                         "group_id": "b5fc845d-5730-4084-84ac-43d01bdcdabb",
                         "user_name": "系统管理员",
                         "is_apply": "未申请"
                     },
                     {
                         "group_name": "活动",
                         "cat_id": "f627618e-7cab-4a9e-88a6-113f4eb14d0b",
                         "group_id": "f008850a-7a36-4494-b185-cd0b0a3b8a63",
                         "user_name": "系统管理员",
                         "is_apply": "未申请"
                     }
                 ]
             }
             */
            cat_group_unchecked: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.unchecked.list.get',
                    cat_id: "",
                    group_name: ""
                }
            },
            /**
             供应商子分类申请
             请求参数：
             {
                 "action": "ruixue.rop.ssv.category.group.apply",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "sub_session_id": "",
                 "cat_id": "f627618e-7cab-4a9e-88a6-113f4eb14d0b",
                 "group_list": [
                     {
                         "group_id": "a165b6b4-ce01-485d-ab59-3d2caa43db65"
                     },
                     {
                         "group_id": "b5fc845d-5730-4084-84ac-43d01bdcdabb"
                     }
                 ]
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}
             */
            cat_group_apply: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.category.group.apply',
                    cat_id: "",
                    group_list: [{ group_id: "" }]
                }
            }
        },
        isv_app: {
            _init: [],
            /** 开发者应用列表初始化
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.list.init",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a"
             }
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "data_list": [
                 {
                     "user_id": "1197c7f7-18e2-4e0d-a56c-fcb2ff0d456d",
                     "user_name": "系统开发者"
                 }
             ]
            }*/
            list_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.list.init'
                }
            },
            /** 获取开发者应用列表
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a"
                 "search_status":"0",
                 "pageindex":"1",
                 "pagesize":"10",
                 "isv_user_id":"",
                 "app_key":""
             }
             search_status（必须）搜索类型 0：数据查询  1：待办事项
             isv_user_id（可选） 开发者id
             app_key（可选）
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "list_count": "26",
                 "page_count": "3",
                 "data_list": [
                 {
                     "app_id": "daccf0e3-3232-443d-b929-2102bf68cb70",
                     "app_name": "H5Plus开发者",
                     "user_name": "h5开发者",
                     "appkey": "04e89b8a-aec7-43ce-a679-a2756f86f474",
                     "create_time": "2015/7/2 15:41:56"
                 }
             ]}*/

            list_get: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.list.get',
                    search_status: "0",
                    pageindex: "1",
                    pagesize: "10",
                    isv_user_id: "",
                    app_key: ""
                }
            },

            /** 开发者应用审核页面初始化
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.api.list.init",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "app_id": "01973416-7DB6-4071-9D74-4EF6BF93EA7A"
             }
              app_id（必须） 应用id
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "app_name": "日志查询",
                 "cat_list": [
                 {
                     "cat_id": "dde85c47-f645-4c73-828b-220a893e801d",
                     "cat_name": "短信API"
                 }],
                 "status_list": [
                 {
                     "status_id": "0",
                     "status_name": "未审核"
                 }
            ]}*/
            api_init: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.api.list.init',
                    app_id: ""
                }
            },
            /**开发者应用审核页面API列表
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.api.list.get",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "app_id": "74c08f70-5337-4039-ac1a-490ceb1b9f00",
                 "pageindex":"1",
                 "pagesize":"10",
                 "cat_id":"",
                 "status":"0",
                 "sort_name":"",
                 "sort_flag":""
             }
              status 审核状态 0：未审核 1：已审核
              返回结果：
             {
                 "is_success": "true",
                 "sub_code": "",
                 "sub_msg": "",
                 "code": "",
                 "msg": "",
                 "list_count": "2",
                 "page_count": "1",
                 "data_list": [
                 {
                     "api_id": "4c0051d6-d6fc-4e75-bbe1-1d89ade0953f",
                     "api_name": "ruixue.sms.note.send",
                     "api_title": "短信发送接口",
                     "status_id": "1",
                     "status_name": "已审核",
                     "create_time": "2016/7/28 16:46:21"
                 }
             ]}*/
            api_get: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.api.list.get',
                    app_id: "",
                    pageindex: "1",
                    pagesize: "10",
                    cat_id: "",
                    status: "0",
                    sort_name: "",
                    sort_flag: ""
                }
            },
            /** 开发者应用审核页面审核操作
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.api.audit",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "app_id": "74c08f70-5337-4039-ac1a-490ceb1b9f00",
                 "api_list":[
                 {
                     "api_id":"4c0051d6-d6fc-4e75-bbe1-1d89ade0953f"
                 }
             ]
             }
              app_id（必须） 应用id
             api_list（必须）API列表
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            api_audit: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.api.audit',
                    app_id: "",
                    api_list: [{ api_id: "" }]
                }
            },
            /** 开发者应用列表、应用选中API【解除审核】操作
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.api.cancel.audit",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "app_id": "74c08f70-5337-4039-ac1a-490ceb1b9f00",
                 api_id:""
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            api_cancel: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.api.cancel.audit',
                    app_id: "",
                    api_id: ""
                }
            },

            /** 开发者应用列表、应用选中API【删除】操作
             请求参数：
             {
                 "action": "ruixue.rop.ssv.isv.app.api.delete",
                 "session_id": "46ffe078-1b8b-45c3-90ea-64bf30cb1a2a",
                 "app_id": "74c08f70-5337-4039-ac1a-490ceb1b9f00",
                 api_id:""
             }
              返回结果：
             {"is_success":"true","sub_code":"","sub_msg":"","code":"",   "msg":""}*/
            api_delete: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.isv.app.api.delete',
                    app_id: "",
                    api_id: ""
                }
            }
        },
        mail: {
            _init: []
        },
        noapply: {
            _init: []
        },
        notice: {
            _init: []
        },
        ping: {
            _init: []
        },
        sdk: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.sdk.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            }
        },
        subuser: {
            _init: []
        },
        tool: {
            _init: []
        },
        dataroleset: {
            _init: []
        },
        frame: {
            _init: []
        },
        common: {
            _init: [],
            nav_menu: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.func.list.get'
                }
            },
            logger: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.console.operlog.list.get",
                    pageindex: "1",
                    pagesize: "10",
                    recordkey: "4c0051d6-d6fc-4e75-bbe1-1d89ade0953f"
                }
            },
            realtime_apis: {
                path: '',
                multiple: false,
                param: {
                    action: "ruixue.rop.api.log.day.call.count.get"
                }
            }
        },
        applications: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.app.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            details: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.app.details.get'
                }
            },
            create: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.app.add'
                }
            },
            edit: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.app.update'
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.app.delete'
                }
            },
            api: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.appapi.list.get',
                    pageindex: 1,
                    pagesize: 5
                }
            },
            unapi: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.appapi.unadd.list.get',
                    pageindex: 1,
                    pagesize: 5
                }
            },
            'add-api': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.appapi.add'
                }
            },
            'delete-api': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.appapi.delete'
                }
            },
            'secret-reset': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.appsecret.reset'
                }
            },
            'test-secret-reset': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.testappsecret.reset'
                }
            },
            'token-reset': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.accesstoken.reset'
                }
            },
            'test-token-reset': {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.testaccesstoken.reset'
                }
            }
        },
        subusers: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            create: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.add'
                }
            },
            edit: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.update'
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.delete'
                }
            },
            getedit: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.get'
                }
            },
            getrole: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.role.list.get'
                }
            },
            saverole: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.subuser.role.save'
                }
            }
        },
        suppliers: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.userapp.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.userapp.delete'
                }
            }
        },
        docs: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.doc.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            details: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.doc.details.get'
                }
            }
        },
        message: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.message.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            sign: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.message.sign'
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.message.delete'
                }
            }
        },
        collect: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.userfavo.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.isv.userfavo.delete'
                }
            }
        },
        comment: {
            _init: [],
            list1: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.receive.user.comment.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            list2: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.send.user.comment.list.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            del: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.comment.delete'
                }
            }
        },
        userinfos: {
            _init: [],
            list: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.info.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            updateinfo: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.update'
                }
            },
            editpsd: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.password.update'
                }
            }
        }
    },

    console: {
        index: {
            _init: ['nav_menu'],
            nav_menu: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.user.func.list.get'
                }
            }
        }
    },
    common: {
        api: {
            categories: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.common.category.get',
                    pageindex: 1,
                    pagesize: 10
                }
            }
        },
        common: {
            users: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.common.user.get',
                    pageindex: 1,
                    pagesize: 10
                }
            },
            tips: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.message.tips.get'
                }
            }
        },
        sponsor: {
            getId: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.userid.get',
                    user_domain: ""
                }
            },
            get_ssv: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.api.userid.get'
                    /*api_id:'',
                     domain_id: undefined*/
                }
            },
            get_cat_ssv: {
                path: '',
                multiple: false,
                param: {
                    action: 'ruixue.rop.ssv.user.domain.get',
                    cat_id: ""
                }
            }
        },
        svg_template: {
            _init: []
        },
        login: {
            _init: []
        }
    },
    sse: {
        common: {
            tips: {
                path: '',
                multiple: false,
                inverval: 45000,
                param: {
                    action: 'ruixue.rop.message.tips.get'
                }
            }
        }
    }
};

var constant = require("./constant");

var deliverOption = function deliverOption(module, partial, api, param) {
    // 拷贝默认参数
    var data = JSON.parse(JSON.stringify(map[module][partial][api].param));
    // 将用户设置参数mixin到参数体内
    if (param) {
        for (var prop in param) {
            data[prop] = param[prop];
        }
    }
    // TODO 由于ROP访问规则变更，输入的参数需要
    if (constant.ROPRequestType == 1) {
        return {
            url: constant.apiHost + map[module][partial][api].path + constant.generateROPStandardRequest(constant.ROPRequestType),
            multiple: map[module][partial][api].multiple,
            body: data
        };
    } else {
        var standardData = constant.generateROPStandardRequest();
        standardData.request_parameter = JSON.stringify(data);
        return {
            url: constant.apiHost + map[module][partial][api].path,
            multiple: map[module][partial][api].multiple,
            data: standardData
        };
    }
};

var deliverOptions = function deliverOptions(module, partial, names, param) {
    var options = {};
    names.forEach(function (name) {
        options[name] = deliverOption(module, partial, name, param);
    });
    return options;
};

var initDeliverOptions = function initDeliverOptions(module, partial, param) {
    return map[module] && map[module][partial] && map[module][partial]._init ? deliverOptions(module, partial, map[module][partial]._init, param) : [];
};

exports.map = map;
exports.deliverOption = deliverOption;
exports.deliverOptions = deliverOptions;
exports.initDeliverOptions = initDeliverOptions;