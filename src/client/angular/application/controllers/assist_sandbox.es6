/**
 * Created by robin on 22/11/2016.
 */
define(['chartJs', '../../services'], function (cta) {
    'use strict';
    return ['$rootScope', '$scope', '$q', '$location', '$mdDialog', 'ROPDateUtil',
        ($rootScope, $scope, $q, $location, $mdDialog, ROPDateUtil) => {
            $rootScope.tab = "assist_sandbox";
            $rootScope.validateEntry();

            let modeArray = [{id: 1, tab: 0, sort: 10}, {id: 2, tab: 0}, {id: 3, tab: 0}],
                secureNumber = value => {
                    return (typeof value == "string") ? Number.parseInt(value) : ((typeof value == "number") ? value : 0)
                },
                apicallSorter = (item1, item2) => {
                    let count1 = (typeof item1.callcount == "string") ? Number.parseInt(item1.callcount) : ((typeof item1.callcount == "number") ? item1.callcount : 0),
                        count2 = (typeof item2.callcount == "string") ? Number.parseInt(item2.callcount) : ((typeof item2.callcount == "number") ? item2.callcount : 0);
                    return (count1 > count2) ? -1 : ((count1 < count2) ? 1 : 0)
                },
                appcallSorter = (item1, item2) => {
                    let count1 = secureNumber(item1.all_count),
                        count2 = secureNumber(item2.all_count);
                    return (count1 > count2) ? -1 : ((count1 < count2) ? 1 : 0)
                },
                daycallSorter = (item1, item2) => {
                    let count1 = secureNumber(item1.content.replace(/^.+\s(.+)/, "$1")),
                        count2 = secureNumber(item2.content.replace(/^.+\s(.+)/, "$1"));
                    return (count1 < count2) ? -1 : ((count1 > count2) ? 1 : 0)
                },
                updateBarChartConfig = log_list => {
                    var barChartConfigClone = {
                        type: 'bar',
                        data: {
                            labels: ["114.132.134.13"],
                            datasets: [
                                {
                                    type: 'bar',
                                    label: "调用次数",
                                    backgroundColor: 'rgba(0,197,163,0.4)',
                                    hoverBackgroundColor: '#00C5A3',
                                    data: [],
                                    yAxisID: "y-axis-0",
                                },
                                {
                                    type: 'bar',
                                    label: "成功次数",
                                    backgroundColor: 'rgba(0,145,120,0.4)',
                                    hoverBackgroundColor: '#009178',
                                    data: [],
                                    yAxisID: "y-axis-0",
                                },
                                {
                                    type: 'line',
                                    label: "占比",
                                    data: [],
                                    borderWidth: 2,
                                    borderColor: '#00C5A3',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    fill: true,
                                    lineTension: 0.1,
                                    pointRadius: 3,
                                    pointHoverRadius: 4,
                                    pointBorderColor: "#fff",
                                    pointHoverBorderWidth: 1,
                                    pointBorderWidth: 1,

                                    pointBackgroundColor: "#009178",
                                    pointHitRadius: 3.5,
                                    yAxisID: "y-axis-1",
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            showLines: true,
                            //responsiveAnimationDuration: 400,
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: '调用数',
                                fontSize: 14,
                                padding: 16,
                                fontFamily: '"lanting","Helvetica Neue","Microsoft YaHei"1'
                            },
                            elements: {
                                rectangle: {
                                    borderWidth: 1.5,
                                    borderColor: '#009178',
                                    borderSkipped: 'bottom'
                                }
                            },
                            hover: {
                                mode: "single",
                                animationDuration: 400
                            },
                            animation: {
                                duration: 400,
                                easing: "easeOutQuart",
                            },
                            scales: {
                                yAxes: [{
                                    id: 'y-axis-0',
                                    ticks: {
                                        beginAtZero: true,
                                        maxTicksLimit: 5
                                    },
                                }, {
                                    id: 'y-axis-1',
                                    display: true,
                                    //scaleLabelcallback: label=>{return label + "%"},
                                    position: 'right',
                                    ticks: {
                                        //beginAtZero:true,
                                        maxTicksLimit: 5,
                                        /*min: 0,
                                         max: 100,*/
                                        beginAtZero: true,
                                        //fontColor: "#fff",
                                        callback: (label, index) => {
                                            return Math.round(10*label)/10 + "%"
                                        }
                                    },
                                    gridLines: {
                                        //color: "rgba(255,255,255,0.2)"
                                        display: true,
                                        lineWidth: 1,
                                        color: "rgba(255,255,255,0.3)",
                                        zeroLineWidth: 1,
                                        //zeroLineColor: "rgba(255,255,255,0)",
                                    }
                                }
                                ],
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        //stepSize: 50
                                    },
                                    //barPercentage:0.99,
                                    gridLines: {
                                        //drawOnChartArea:false,
                                    }
                                }]
                            }
                        }
                    }, labels = [], data = [[], [], []], total = 0;
                    [].concat.apply([], log_list.sort(apicallSorter).map((r, i) => {
                        return (i < $scope.mode.sort) ? [r] : []
                    })).forEach(r => {
                        var callcount = secureNumber(r.callcount);
                        total += callcount;
                        labels.push(r.content);
                        data[0].push(callcount);
                        data[1].push(secureNumber(r.successcount));

                        var percent = 0;
                        data[0].forEach((r1, i1) => {
                            percent += r1;
                        });

                        data[2].push(percent);
                    });

                    barChartConfigClone.data.labels = labels;
                    barChartConfigClone.data.datasets[0].data = data[0];
                    barChartConfigClone.data.datasets[1].data = data[1];
                    barChartConfigClone.data.datasets[2].data = data[2].map(r => {
                        return Math.floor(10000 * r / total) / 100
                    });
                    return barChartConfigClone;
                },
                updateLineChartConfig = log_list => {
                    var lineChartConfigClone = {
                        type: 'line',
                        data: {
                            labels: ["7:00"],
                            datasets: [{
                                label: "实时调用量",
                                data: [5],
                                borderWidth: 2,
                                borderColor: '#fff',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                fill: true,
                                lineTension: 0.1,
                                pointRadius: 3,
                                pointHoverRadius: 4,
                                pointBorderColor: "#fff",
                                pointHoverBorderWidth: 1,
                                pointBorderWidth: 1,

                                pointBackgroundColor: "#009178",
                                pointHitRadius: 3.5,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            showLines: true,
                            title: {
                                display: true,
                                text: '实时调用量',
                                fontColor: "#fff",
                                padding: 14,
                                fontSize: 13,
                                fontFamily: '"lanting","Helvetica Neue","Microsoft YaHei"',
                                fontStyle: "normal"
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                mode: 'label',
                                callbacks: {}
                            },
                            hover: {
                                mode: 'single'
                            },
                            /*chartArea: {
                             backgroundColor: '#009178'
                             },*/
                            scales: {
                                xAxes: [{
                                    id: 'x-axis-0',
                                    gridLines: {
                                        display: false,
                                        lineWidth: 1,
                                        color: "rgba(255,255,255,0.3)",
                                        zeroLineWidth: 0,
                                        zeroLineColor: "rgba(255,255,255,0)",
                                    },
                                    ticks: {
                                        fontColor: "#fff",
                                        beginAtZero: true,
                                        autoSkip: false,
                                        callback: (label, index) => {
                                            return (index % (Math.ceil(log_list.length / 8)) == 0) ? label : null;
                                        }
                                    }
                                }],
                                yAxes: [{
                                    id: 'y-axis-0',
                                    display: true,
                                    ticks: {
                                        //beginAtZero:true,
                                        maxTicksLimit: 5,
                                        beginAtZero: true,
                                        fontColor: "#fff",
                                        //mirror: true,
                                        padding:5
                                    },
                                    gridLines: {
                                        //color: "rgba(255,255,255,0.2)"
                                        display: true,
                                        lineWidth: 1,
                                        color: "rgba(255,255,255,0.3)",
                                        zeroLineWidth: 0,
                                        zeroLineColor: "rgba(255,255,255,0)",
                                    }
                                }]
                            }
                        }
                    }, labels = [], data = [];
                    log_list.forEach(r => {
                        labels.push(r.calldatehour ? r.calldatehour.replace(/.*\s(.*)/, "$1:00") : "00:00");
                        data.push(r.all_count);
                    });
                    lineChartConfigClone.data.labels = labels;
                    lineChartConfigClone.data.datasets[0].data = data;
                    return lineChartConfigClone;
                };
            $scope.summary = {};
            $scope.selectMode = (mode) => {
                if($scope.lock){
                    return;
                }
                $scope.mode = modeArray[mode - 1];
                $scope.listAPI();
            }
            $scope.listAPI = () => {
                if($scope.lock){
                    return;
                }
                $scope.lock = true;
                return $rootScope.ajax("log_get", {
                    search_type: $scope.mode.id,
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    api_name: $scope.api_name,
                    user_id: $scope.user_id,
                    app_id: $scope.app_id
                }, (data) => {
                    $scope.log_list = data.log_list;
                    $scope.log_summary = {
                        callcount: 0,
                        successcount: 0,
                        failcount: 0,
                        sysfailcount: 0,
                        averagetime: 0,
                        avgroptime: 0,
                        avgsuppliertime: 0,
                        f_success_num: 0,
                        f_faild_num: 0,
                        f_num: 0,
                        a_success_num: 0,
                        a_faild_num: 0,
                        a_num: 0,
                        b_success_num: 0,
                        b_faild_num: 0,
                        b_num: 0,
                        c_success_num: 0,
                        c_faild_num: 0,
                        c_num: 0,
                        d_success_num: 0,
                        d_faild_num: 0,
                        d_num: 0,
                        e_success_num: 0,
                        e_faild_num: 0,
                        e_num: 0
                    };
                    $scope.log_list.forEach(r => {
                        $scope.log_summary.callcount += Number.parseInt(r.callcount);
                        $scope.log_summary.successcount += Number.parseInt(r.successcount);
                        $scope.log_summary.failcount += Number.parseInt(r.failcount);
                        $scope.log_summary.sysfailcount += Number.parseInt(r.sysfailcount);
                        $scope.log_summary.averagetime += Number.parseFloat(r.averagetime) * Number.parseInt(r.callcount);
                        $scope.log_summary.avgroptime += Number.parseFloat(r.avgroptime) * Number.parseInt(r.callcount);
                        $scope.log_summary.avgsuppliertime += Number.parseFloat(r.avgsuppliertime) * Number.parseInt(r.callcount);
                        $scope.log_summary.f_success_num += Number.parseInt(r.f_success_num);
                        $scope.log_summary.f_faild_num += Number.parseInt(r.f_faild_num);
                        $scope.log_summary.f_num += Number.parseInt(r.f_num);
                        $scope.log_summary.a_success_num += Number.parseInt(r.a_success_num);
                        $scope.log_summary.a_faild_num += Number.parseInt(r.a_faild_num);
                        $scope.log_summary.a_num += Number.parseInt(r.a_num);
                        $scope.log_summary.b_success_num += Number.parseInt(r.b_success_num);
                        $scope.log_summary.b_faild_num += Number.parseInt(r.b_faild_num);
                        $scope.log_summary.b_num += Number.parseInt(r.b_num);
                        $scope.log_summary.c_success_num += Number.parseInt(r.c_success_num);
                        $scope.log_summary.c_faild_num += Number.parseInt(r.c_faild_num);
                        $scope.log_summary.c_num += Number.parseInt(r.c_num);
                        $scope.log_summary.d_success_num += Number.parseInt(r.d_success_num);
                        $scope.log_summary.d_faild_num += Number.parseInt(r.d_faild_num);
                        $scope.log_summary.d_num += Number.parseInt(r.d_num);
                        $scope.log_summary.e_success_num += Number.parseInt(r.e_success_num);
                        $scope.log_summary.e_faild_num += Number.parseInt(r.e_faild_num);
                        $scope.log_summary.e_num += Number.parseInt(r.e_num);
                    });
                    $scope.log_summary.successrate = ($scope.log_summary.callcount != 0)?(100 * $scope.log_summary.successcount / $scope.log_summary.callcount).toFixed(4):0.0000;
                    // failrate是 路由拦截率占总数比，而不是总失败率
                    $scope.log_summary.failrate = ($scope.log_summary.callcount != 0)?(100 * $scope.log_summary.sysfailcount / $scope.log_summary.callcount).toFixed(4):0.0000;
                    $scope.log_summary.sysfailrate = ($scope.log_summary.failcount != 0)?(100 * $scope.log_summary.sysfailcount / $scope.log_summary.failcount).toFixed(4):0.0000;

                    $scope.log_summary.averagetime = $scope.log_summary.callcount ? ($scope.log_summary.averagetime / $scope.log_summary.callcount).toFixed(4) : 0;
                    $scope.log_summary.avgroptime = $scope.log_summary.callcount ? ($scope.log_summary.avgroptime / $scope.log_summary.callcount).toFixed(4) : 0;
                    $scope.log_summary.avgsuppliertime = $scope.log_summary.callcount ? ($scope.log_summary.avgsuppliertime / $scope.log_summary.callcount).toFixed(4) : 0;
                }).finally(() => {
                    $scope.lock = false ;
                });
            };
            $scope.listHourAPI = ()=>{
                $scope.mindate = $scope.maxdate;
                return $scope.listAPI();
            }
            $scope.showLog = () => {
                if($scope.lock){
                    return;
                }
                $scope.lock = true;
                return $rootScope.ajax("log_get", {
                    search_type: $scope.mode.id,
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    api_name: $scope.api_name,
                    search_key: $scope.mode.log.content,
                    user_id: $scope.user_id,
                    app_id: $scope.app_id
                }, (data) => {
                    if (data && data.log_list && data.log_list.length) {
                        $scope.mode.log = data.log_list[0];
                        if($scope.mode.showingDetail){
                            if ($scope.mode.id == 1) {
                                return $scope.selectAPITab();
                            } else if ($scope.mode.id == 2) {
                                return $scope.selectIPTab();
                            } else if ($scope.mode.id == 3) {
                                return $scope.selectHourTab();
                            }
                        }
                    } else {
                        //$rootScope.alert("查无数据");
                        $scope.mode.log = {content:$scope.mode.log.content};
                        $scope.mode.data.log_list = [];
                        $scope.mode.data.error_list && ($scope.mode.data.error_list = []);
                        if ($scope.mode.id == 1) {
                            $scope.updateChart();
                        }
                    }
                }).finally(()=>{
                    $scope.lock = false;
                });
            }
            $scope.showHourLog = ()=>{
                $scope.mindate = $scope.maxdate;
                return $scope.showLog();
            }
            $scope.realtimeAPIs = () => {
                let today = ROPDateUtil.freeFormatDate(new Date(), "yyyy-MM-dd");
                return $rootScope.ajax("realtime_apis", {
                    search_begin: today,
                    search_end: today,
                    api_name: $scope.mode.log.content
                }, (data) => {
                    $scope.reatimeAPIs = (data && data.log_list && data.log_list.length) ? data.log_list : [];
                    return $scope.reatimeAPIs;
                });
            }

            let getAPIDetail = () => {
                return $rootScope.ajax("api_detail", {
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    api_name: $scope.mode.log.content
                }, (data) => {
                    $scope.mode.data = data;
                    return data;
                });
            }, getAppDetail = () => {
                return $rootScope.ajax("api_app", {
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    api_name: $scope.mode.log.content
                }, (data) => {
                    $scope.mode.data = data;
                    return data;
                });
            }, getIPDetail = () => {
                return $rootScope.ajax("ip_detail", {
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    api_name: $scope.mode.log.content
                }, (data) => {
                    $scope.mode.data = data;
                    return data;
                });
            }, getHourDetail = () => {
                return $rootScope.ajax("hour_api", {
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    search_hour: $scope.mode.log.content
                }, (data) => {
                    $scope.mode.data = data;
                    return data;
                });
            }, getHourIPDetail = () => {
                return $rootScope.ajax("hour_ip", {
                    search_begin: ROPDateUtil.freeFormatDate($scope.mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate($scope.maxdate, "yyyy-MM-dd"),
                    search_hour: $scope.mode.log.content
                }, (data) => {
                    $scope.mode.data = data;
                    return data;
                });
            }
            $scope.updateChart = (dataNumber) => {
                dataNumber && ($scope.mode.sort = dataNumber);
                $scope.barChart && $scope.barChart.destroy();
                $scope.lineChart && $scope.lineChart.destroy();
                //$scope.lineChart1 && $scope.lineChart1.destroy();

                var ctx = $(".hero-canvas canvas")[0].getContext("2d");
                $scope.barChart = new Chart(ctx, updateBarChartConfig($scope.mode.data.log_list));

                var ctx1 = $(".line-canvas canvas")[0].getContext("2d");
                $scope.lineChart = new Chart(ctx1, updateLineChartConfig($scope.reatimeAPIs));
            }
            $scope.selectAPITab = (tab) => {
                (tab !== undefined) && ($scope.mode.tab = tab);
                $scope.mode.data = null;
                $scope.mode.belly = null;
                $scope.sublock = true;
                let q = tab ? getAppDetail() : getAPIDetail();
                return $q.all([q, $scope.realtimeAPIs()]).then(data => {
                    $scope.sublock = false;
                    $rootScope.nextTick(() => {
                        $scope.updateChart();
                    });
                });
            }
            $scope.selectIPTab = tab =>{
                $scope.sublock = true;
                return getIPDetail().then(()=>{
                    $scope.sublock = false;
                });
            }
            $scope.selectHourTab = (tab) => {
                $scope.mode.data = null;
                $scope.sublock = true;
                return (tab ? getHourIPDetail() : getHourDetail()).then(() => {
                    (tab !== undefined) && ($scope.mode.tab = tab);
                    $scope.sublock = false;
                });
            }
            $scope.reset = () => {
                $scope.now = new Date();
                //$scope.mindate = new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate() - 1);
                $scope.mindate = new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate());
                $scope.maxdate = new Date();
                $scope.mode = modeArray[0];
                $scope.mode.showingDetail = false;
                //$scope.user_type = 0;
                $scope.api_name = "";
                //$scope.keyword = "";
                $scope.user_id = "";
                $scope.app_id = "";

                $scope.listAPI();
            };


            $scope.enterDetail = log => {
                if ($scope.lock) {
                    return;
                }

                $scope.mode.log = log;
                $scope.mode.showingDetail = true;
                if ($scope.mode.id == 1) {
                    return $scope.selectAPITab(0);
                } else if ($scope.mode.id == 2) {
                    return $scope.selectIPTab(0);
                } else if ($scope.mode.id == 3) {
                    return $scope.selectHourTab(0);
                }
            }

            /*$scope.toggleMagnify = ()=>{
             if(!$scope.mode.cta){
             $scope.mode.cta = true;
             $rootScope.nextTick(()=>{
             var myCta = cta($(".visible-content .line-canvas canvas")[0], $(".visible-content .line-canvas canvas")[1],()=>{
             $(".shifter.floating").addClass('show');
             }), catWrapper = ()=>{
             $(".shifter.floating").removeClass('show');
             myCta.call();
             };
             $scope.mode.cta = catWrapper;
             });
             } else {
             $scope.mode.cta.call();
             $rootScope.nextTick(()=>{
             $scope.mode.cta = null;
             });
             }

             }*/
            $scope.exitDetail = mode => {
                $scope.barChart && $scope.barChart.destroy();
                $scope.lineChart && $scope.lineChart.destroy();
                $scope.lineChart1 && $scope.lineChart1.destroy();

                $scope.mode.showingDetail = false;
                $scope.mode.cta = null;
                $scope.mode.log = null;
                $scope.mode.belly = null;
                /*$rootScope.nextTick(()=>{
                 });*/
            }
            $scope.reset();
            $scope.expandRow = log => {
                log._expand_status = 2;
                $scope.mode.expanded = log;
            }
            $scope.collapseRow = log => {
                log._expand_status = null;
                $scope.mode.expanded = undefined;
            }
            $scope.updateBellyTable = (region, log) => {
                if($scope.mode && $scope.mode.belly && (log === $scope.mode.belly.log)){
                    $scope.mode.belly = null;
                } else {
                    $scope.mode.belly = {
                        region: region,
                        log: log
                    }
                }
            }
            $scope.getBellyTableTitle = () => {
                if($scope.mode.belly){
                    return $scope.mode.belly.region + ': ' + $scope.mode.belly.log.content + ' 错误原因'
                } else {
                    return 'API: ' + $scope.mode.log.content + ' 错误原因'
                }
            }

            // TODO 这里是统计类弹窗, 需要放在reset方法执行之后以可以使用其中的方法
            $scope.showAPICall = (mindate, maxdate) => {
                return $rootScope.ajax("api_call", {
                    search_begin: ROPDateUtil.freeFormatDate(mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate(maxdate, "yyyy-MM-dd"),
                }, (data) => {
                    return data.log_list;
                });
            }
            $scope.showAppCall = (mindate, maxdate) => {
                return $rootScope.ajax("app_call", {
                    search_begin: ROPDateUtil.freeFormatDate(mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate(maxdate, "yyyy-MM-dd"),
                }, (data) => {
                    return data.log_list;
                });
            }
            $scope.showDayCall = (mindate, maxdate) => {
                /*return $rootScope.ajax("day_call", {
                 search_begin: ROPDateUtil.freeFormatDate(mindate,"yyyy-MM-dd"),
                 search_end: ROPDateUtil.freeFormatDate(maxdate,"yyyy-MM-dd"),
                 }, (data) => {
                 return data.log_list;
                 });*/
                return $rootScope.ajax("log_get", {
                    search_type: 3,
                    search_begin: ROPDateUtil.freeFormatDate(mindate, "yyyy-MM-dd"),
                    search_end: ROPDateUtil.freeFormatDate(maxdate, "yyyy-MM-dd"),
                }, (data) => {
                    return data.log_list;
                })
            }
            $scope.showCountCall = () => {
                return $rootScope.ajax("count_call", {}, (data) => {
                    return data.log_list;
                });
            }

            let updateGraphicLineChartConfig = log_list => {
                var lineChartConfigClone = {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: "API调用总量",
                            data: [],
                            borderWidth: 2,
                            borderColor: '#00C5A3',
                            backgroundColor: 'rgba(0,197,163,0.1)',
                            fill: true,
                            lineTension: 0.1,
                            pointRadius: 3,
                            pointHoverRadius: 4,
                            pointBorderColor: "#fff",
                            pointHoverBorderWidth: 1,
                            pointBorderWidth: 1,

                            pointBackgroundColor: "#00C5A3",
                            pointHitRadius: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        showLines: true,
                        title: {
                            display: true,
                            text: 'API调用数量',
                            //fontColor: "#00C5A3",
                            padding: 16,
                            fontFamily: '"lanting","Helvetica Neue","Microsoft YaHei"'
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            mode: 'label',
                            callbacks: {}
                        },
                        hover: {
                            mode: 'single'
                        },
                        /*chartArea: {
                         backgroundColor: '#009178'
                         },*/
                        scales: {
                            xAxes: [{
                                id: 'x-axis-0',
                                gridLines: {
                                    display: true,
                                    lineWidth: 1,
                                    //color: "rgba(0,197,163,0.3)",
                                    zeroLineWidth: 0,
                                    zeroLineColor: "rgba(255,255,255,0)",
                                },
                                ticks: {
                                    //fontColor: "#00C5A3",
                                    autoSkip: false,
                                    beginAtZero: false,
                                    //maxTicksLimit: 12,
                                    callback: (label, index) => {
                                        return (index % (Math.ceil(log_list.length / 12)) == 0) ? label : null;
                                    }
                                }
                            }],
                            yAxes: [{
                                id: 'y-axis-0',
                                display: true,
                                ticks: {
                                    //beginAtZero:true,
                                    maxTicksLimit: 10,
                                    //beginAtZero: true,
                                    //fontColor: "#00C5A3",
                                },
                                gridLines: {
                                    //color: "rgba(255,255,255,0.2)"
                                    display: true,
                                    lineWidth: 1,
                                    //color: "rgba(0,197,163,0.3)",
                                    zeroLineWidth: 0,
                                    zeroLineColor: "rgba(255,255,255,0)",
                                }
                            }]
                        }
                    }
                }, labels = [], data = [];
                log_list.forEach(r => {
                    labels.push(r.calldate);
                    data.push(secureNumber(r.all_count));
                });
                if (log_list.length == 1) {
                    labels.push("");
                    data.push(null);
                    labels.splice(0, 0, "");
                    data.splice(0, 0, null);
                }
                lineChartConfigClone.data.labels = labels;
                lineChartConfigClone.data.datasets[0].data = data;
                //lineChartConfigClone.data.datasets[1].data = data[1];
                return lineChartConfigClone;
            };
            var apiCallDialogMaxdate = ROPDateUtil.incrementDays($scope.now, -1),
                apiCallDialogMindate = ROPDateUtil.incrementDays(apiCallDialogMaxdate, -30);
            let APICallDialogController = (scope, $mdDialog) => {
                    scope.mindate = apiCallDialogMindate;
                    scope.maxdate = apiCallDialogMaxdate;
                    scope.mode = 1;
                    scope.log_list = [];
                    let logSlicer = log_list => {
                        var trunk = log_list;
                        if (scope.mode == 2) {
                            // 由于产品要求周日要算到上一周，每周周一是一周的开始，所以不得不将周日特殊处理
                            var maxDayIndex = scope.maxdate.getDay(),
                                firstDayOfTheMaxDateWeek = ROPDateUtil.incrementDays(scope.maxdate, 1 - (maxDayIndex ? maxDayIndex : 7)),
                                minDayIndex = scope.mindate.getDay(),
                                firstDayOfTheMinDateWeek = ROPDateUtil.incrementDays(scope.mindate, 1 - (minDayIndex ? minDayIndex : 7)),
                                lastDayOfTheMinDateWeek = ROPDateUtil.incrementDays(firstDayOfTheMinDateWeek, 6),
                                front = {all_count: 0, calldate: ROPDateUtil.freeFormatDate(scope.mindate, "yyyy-MM-dd")},
                                rear = {all_count: 0, calldate: ROPDateUtil.freeFormatDate(scope.maxdate, "yyyy-MM-dd")};
                            trunk = [front];
                            log_list.forEach((r, i) => {
                                // 按周切割天，首先切割掉开始时间和结束时间的周，此后时间必定是7的倍数, 每逢周一push新元素，其他时间取trunk数组最新元素进行加和，最后push结束时间的周
                                var targetDate = ROPDateUtil.createDateAtMidnight(r.calldate);
                                if ((scope.mindate <= targetDate) && (targetDate <= lastDayOfTheMinDateWeek)) {
                                    front.all_count += secureNumber(r.all_count);
                                } else if ((scope.maxdate >= targetDate) && (targetDate >= firstDayOfTheMaxDateWeek)) {
                                    rear.all_count += secureNumber(r.all_count);
                                } else {
                                    var dayIndex = targetDate.getDay(),
                                        firstDayOfTheWeek = ROPDateUtil.incrementDays(targetDate, 1 - (dayIndex ? dayIndex : 7)),
                                        lastDayOfTheWeek = ROPDateUtil.incrementDays(firstDayOfTheWeek, 6),
                                        stackedDate = ROPDateUtil.createDateAtMidnight(trunk[trunk.length - 1].calldate);
                                    if ((firstDayOfTheWeek <= stackedDate) && (stackedDate <= lastDayOfTheWeek)) {
                                        trunk[trunk.length - 1].all_count += secureNumber(r.all_count);
                                    } else {
                                        trunk.push({all_count: secureNumber(r.all_count), calldate: r.calldate})
                                    }
                                }
                            });
                            // 开始周和结束周的计算都是以午夜为原点，如果开始周和结束周的第一天相同，那么尾部计算属于无意义de重复计算，不能被push
                            (firstDayOfTheMinDateWeek.getTime() != firstDayOfTheMaxDateWeek.getTime()) && (trunk.push(rear));
                        } else if (scope.mode == 3) {
                            var firstDateOfTheMaxDateMonth = ROPDateUtil.getFirstDateOfMonth(scope.maxdate),
                                lastDayOfTheMinDateMonth = ROPDateUtil.getLastDateOfMonth(scope.mindate),
                                front = {all_count: 0, calldate: ROPDateUtil.freeFormatDate(scope.mindate, "yyyy-MM")},
                                rear = {all_count: 0, calldate: ROPDateUtil.freeFormatDate(scope.maxdate, "yyyy-MM")};
                            trunk = [front];
                            log_list.forEach((r, i) => {
                                // 按月切割天，首先切割掉开始时间和结束时间的月，此后时间必定是整月的时间段, 每逢1号push新元素，其他时间取trunk数组最新元素进行加和，最后push结束时间的月
                                var targetDate = ROPDateUtil.createDateAtMidnight(r.calldate);
                                if ((scope.mindate <= targetDate) && (targetDate <= lastDayOfTheMinDateMonth)) {
                                    front.all_count += secureNumber(r.all_count);
                                } else if ((scope.maxdate >= targetDate) && (targetDate >= firstDateOfTheMaxDateMonth)) {
                                    rear.all_count += secureNumber(r.all_count);
                                } else {
                                    var firstDayOfTheMonth = ROPDateUtil.getFirstDateOfMonth(targetDate),
                                        lastDayOfTheMonth = ROPDateUtil.getLastDateOfMonth(targetDate),
                                        stackedDate = ROPDateUtil.createDateAtMidnight(trunk[trunk.length - 1].calldate);
                                    if ((firstDayOfTheMonth <= stackedDate) && (stackedDate <= lastDayOfTheMonth)) {
                                        trunk[trunk.length - 1].all_count += secureNumber(r.all_count);
                                    } else {
                                        trunk.push({
                                            all_count: secureNumber(r.all_count),
                                            calldate: ROPDateUtil.freeFormatDate(targetDate, "yyyy-MM")
                                        })
                                    }
                                }
                            });
                            !ROPDateUtil.isSameMonthAndYear(firstDateOfTheMaxDateMonth, lastDayOfTheMinDateMonth) && (trunk.push(rear));
                        }

                        scope.barChart && scope.barChart.destroy();
                        var ctx = document.querySelector("#api-call").getContext("2d");
                        scope.barChart = new Chart(ctx, updateGraphicLineChartConfig(trunk));

                        return trunk;
                    }
                    scope.showAPICall = () => {
                        $scope.showAPICall(scope.mindate, scope.maxdate).then((log_list) => {
                            scope.log_list = log_list;
                            return logSlicer(log_list);
                        })
                    };
                    scope.selectMode = mode => {
                        scope.mode = mode;
                        return logSlicer(scope.log_list);
                    }
                    scope.closeDialog = () => {
                        $mdDialog.hide()
                    };
                    scope.showAPICall();
                },
                showAPICallDialog = (ev) => {
                    var q = $rootScope.defer();
                    $mdDialog.show({
                        controller: APICallDialogController,
                        parent: angular.element("#partials>md-content"),
                        template: `
                            <div class="head cap">
                                <div class="left">
                                    <h5 class="api">API调用统计</h5>
                                    <rop-date-range-picker ng-model="searchdate" min-date="mindate" max-date="maxdate" callback="showAPICall" placeholder="请输入日期" class="md-primary" ></rop-date-range-picker>
                                </div>
                                <div class="right">
                                    <md-button class="md-raised text shrink-button" ng-class="{'fill':(mode == 3),'line':(mode != 3)}" aria-label="data control" ng-click="selectMode(3)">
                                        <span>按月统计</span>
                                    </md-button>
                                    <md-button class="md-raised text shrink-button" ng-class="{'fill':(mode == 2),'line':(mode != 2)}" aria-label="data control" ng-click="selectMode(2)">
                                        <span>按周统计</span>
                                    </md-button>
                                    <md-button class="md-raised text shrink-button" ng-class="{'fill':(mode == 1),'line':(mode != 1)}" aria-label="data control" ng-click="selectMode(1)">
                                        <span>按天统计</span>
                                    </md-button>
                                    <md-button class="md-raised text line" aria-label="data control" ng-click="closeDialog()">
                                        <span>返回</span>
                                    </md-button>
                                </div>
                            </div>
                        
                            <div class="line-canvas">
                                <canvas width="100%" id="api-call"></canvas>
                            </div>
                        `,
                        fullscreen: true,
                        targetEvent: ev,
                        openFrom: ev.target,
                        clickOutsideToClose: true,
                    });
                }

            $scope.showAPICall(apiCallDialogMaxdate, apiCallDialogMaxdate).then(log_list => {
                $scope.summary.apiCalls = 0;
                log_list.forEach(r => {
                    try {
                        $scope.summary.apiCalls += Number.parseInt(r.all_count);
                    } catch (e) {
                    }
                });
                $scope.showAPICallDialog = showAPICallDialog;
            });


            let updateGraphicBarChartConfig = log_list => {
                var barChartConfigClone = {
                    type: 'bar',
                    data: {
                        labels: ["114.132.134.13"],
                        datasets: [
                            {
                                type: 'bar',
                                label: "调用次数",
                                backgroundColor: 'rgba(0,197,163,0.4)',
                                hoverBackgroundColor: '#00C5A3',
                                data: [],
                                yAxisID: "y-axis-0",
                            },
                            {
                                type: 'bar',
                                label: "成功次数",
                                backgroundColor: 'rgba(0,145,120,0.4)',
                                hoverBackgroundColor: '#009178',
                                data: [],
                                yAxisID: "y-axis-0",
                            },
                            {
                                type: 'line',
                                label: "占比",
                                data: [],
                                borderWidth: 2,
                                borderColor: '#00C5A3',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                fill: true,
                                lineTension: 0.1,
                                pointRadius: 3,
                                pointHoverRadius: 4,
                                pointBorderColor: "#fff",
                                pointHoverBorderWidth: 1,
                                pointBorderWidth: 1,

                                pointBackgroundColor: "#009178",
                                pointHitRadius: 3.5,
                                yAxisID: "y-axis-1",
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        //responsiveAnimationDuration: 400,
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: '开发者应用调用数统计',
                            fontSize: 14,
                            padding: 16,
                            fontFamily: '"lanting","Helvetica Neue","Microsoft YaHei"'
                        },
                        elements: {
                            rectangle: {
                                borderWidth: 1.5,
                                borderColor: '#009178',
                                borderSkipped: 'bottom'
                            }
                        },
                        hover: {
                            mode: "single",
                            animationDuration: 400
                        },
                        animation: {
                            duration: 400,
                            easing: "easeOutQuart",
                        },
                        scales: {
                            yAxes: [{
                                id: 'y-axis-0',
                                ticks: {
                                    beginAtZero: true,
                                    maxTicksLimit: 5
                                },
                            }, {
                                id: 'y-axis-1',
                                display: true,
                                position: 'right',
                                ticks: {
                                    maxTicksLimit: 5,
                                    beginAtZero: true,
                                    callback: (label, index) => {
                                        return Math.round(10*label)/10 + "%"
                                    }
                                },
                                gridLines: {
                                    display: true,
                                    lineWidth: 1,
                                    color: "rgba(255,255,255,0.3)",
                                    zeroLineWidth: 1,
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 50
                                },
                                //barPercentage:0.99,
                                gridLines: {
                                    //drawOnChartArea:false,
                                }
                            }]
                        }
                    }
                }, labels = [], data = [[], [], []], appTotal = 0;
                log_list.sort(appcallSorter).forEach(r => {
                    var callcount = secureNumber(r.all_count);
                    appTotal += callcount;
                    labels.push(r.app_name);
                    data[0].push(callcount);
                    data[1].push(secureNumber(r.true_count));

                    var percent = 0;
                    data[0].forEach((r1, i1) => {
                        percent += r1;
                    });

                    data[2].push(percent);
                });
                barChartConfigClone.data.labels = labels;
                barChartConfigClone.data.datasets[0].data = data[0];
                barChartConfigClone.data.datasets[1].data = data[1];
                barChartConfigClone.data.datasets[2].data = data[2].map(r => {
                    return Math.floor(10000 * r / appTotal) / 100
                });
                return barChartConfigClone;
            };
            var appCallDialogMindate = new Date($scope.now.getFullYear(), $scope.now.getMonth(), 1),
                appCallDialogMaxdate = new Date();
            let AppCallDialogController = (scope, $mdDialog) => {
                    scope.mindate = appCallDialogMindate;
                    scope.maxdate = appCallDialogMaxdate;
                    scope.showAppCall = () => {
                        $scope.showAppCall(scope.mindate, scope.maxdate).then((log_list) => {
                            scope.log_list = log_list;

                            scope.barChart && scope.barChart.destroy();
                            var ctx = document.querySelector("#app-call").getContext("2d");
                            scope.barChart = new Chart(ctx, updateGraphicBarChartConfig(log_list));

                            return log_list;
                        })
                    };
                    scope.closeDialog = () => {
                        $mdDialog.hide()
                    };
                    scope.showAppCall();
                },
                showAppCallDialog = (ev) => {
                    $mdDialog.show({
                        controller: AppCallDialogController,
                        parent: angular.element("#partials>md-content"),
                        template: `
                            <div class="head cap">
                                <div class="left">
                                    <h5 class="api">开发者应用调用统计</h5>
                                    <rop-date-range-picker ng-model="searchdate" min-date="mindate" max-date="maxdate" callback="showAppCall" placeholder="请输入日期" class="md-primary" ></rop-date-range-picker>
                                </div>
                                <div class="right">
                                    <md-button class="md-raised text line" aria-label="data control" ng-click="closeDialog()">
                                        <span>返回</span>
                                    </md-button>
                                </div>
                            </div>
                        
                            <div class="line-canvas">
                                <canvas width="100%" id="app-call"></canvas>
                            </div>
                        `,
                        fullscreen: true,
                        targetEvent: ev,
                        openFrom: ev.target,
                        clickOutsideToClose: true,
                        //locals: {next: undefined}
                    });
                }
            $scope.showAppCall(appCallDialogMindate, appCallDialogMaxdate).then(log_list => {
                $scope.summary.appCalls = log_list.sort(appcallSorter).slice(0, 3);
                $scope.showAppCallDialog = showAppCallDialog;
            });


            let updateGraphicRealtimeChartConfig = log_list => {
                var lineChartConfigClone = {
                    type: 'line',
                    data: {
                        labels: ["7:00"],
                        datasets: [{
                            label: "实时调用量",
                            data: [5],
                            borderWidth: 2,
                            borderColor: '#00C5A3',
                            backgroundColor: 'rgba(0,197,163,0.1)',
                            fill: true,
                            lineTension: 0.1,
                            pointRadius: 3,
                            pointHoverRadius: 4,
                            pointBorderColor: "#fff",
                            pointHoverBorderWidth: 1,
                            pointBorderWidth: 1,

                            pointBackgroundColor: "#00C5A3",
                            pointHitRadius: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        showLines: true,
                        title: {
                            display: true,
                            text: '实时API调用统计',
                            //fontColor: "#00C5A3",
                            padding: 16
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            mode: 'label',
                            callbacks: {}
                        },
                        hover: {
                            mode: 'single'
                        },
                        /*chartArea: {
                         backgroundColor: '#009178'
                         },*/
                        scales: {
                            xAxes: [{
                                id: 'x-axis-0',
                                gridLines: {
                                    display: true,
                                    lineWidth: 1,
                                    //color: "rgba(0,197,163,0.3)",
                                    zeroLineWidth: 0,
                                    zeroLineColor: "rgba(255,255,255,0)",
                                },
                                ticks: {
                                    //fontColor: "#00C5A3",
                                    beginAtZero: false,
                                    //maxTicksLimit: 12,
                                    //callback: function(label, index) {return (index % (Math.ceil(log_list.length/12)) == 0) ? label: null;}
                                }
                            }],
                            yAxes: [{
                                id: 'y-axis-0',
                                display: true,
                                ticks: {
                                    maxTicksLimit: 10,
                                },
                                gridLines: {
                                    display: true,
                                    lineWidth: 1,
                                    zeroLineWidth: 0,
                                    zeroLineColor: "rgba(255,255,255,0)",
                                }
                            }]
                        }
                    }
                }, labels = [], data = [];
                log_list.sort(daycallSorter).forEach(r => {
                    labels.push(r.content ? r.content.replace(/.*\s(.*)/, "$1:00") : "00:00");
                    data.push(secureNumber(r.callcount));
                });
                lineChartConfigClone.data.labels = labels;
                lineChartConfigClone.data.datasets[0].data = data;
                //lineChartConfigClone.data.datasets[1].data = data[1];
                return lineChartConfigClone;
            };
            var dayCallDialogMindate = new Date(), dayCallDialogMaxdate = new Date();
            let DayCallDialogController = (scope, $mdDialog) => {
                    scope.searchdate = dayCallDialogMindate;
                    scope.maxdate = new Date();
                    scope.showDayCall = () => {
                        $scope.showDayCall(scope.searchdate, scope.searchdate).then((log_list) => {
                            scope.log_list = log_list;

                            scope.barChart && scope.barChart.destroy();
                            var ctx = document.querySelector("#day-call").getContext("2d");
                            scope.barChart = new Chart(ctx, updateGraphicRealtimeChartConfig(log_list));

                            return log_list;
                        })
                    };
                    scope.closeDialog = () => {
                        $mdDialog.hide()
                    };
                    scope.showDayCall();
                },
                showDayCallDialog = (ev) => {
                    $mdDialog.show({
                        controller: DayCallDialogController,
                        parent: angular.element("#partials>md-content"),
                        template: `
                            <div class="head cap">
                                <div class="left">
                                    <h5 class="api">实时API调用统计</h5>
                                    <rop-date-picker ng-model="searchdate" callback="showDayCall" max-date="maxdate" placeholder="请输入日期" class="md-primary" ></rop-date-picker>
                                </div>
                                <div class="right">
                                    <md-button class="md-raised text line" aria-label="data control" ng-click="closeDialog()">
                                        <span>返回</span>
                                    </md-button>
                                </div>
                            </div>
                        
                            <div class="line-canvas">
                                <canvas width="100%" id="day-call"></canvas>
                            </div>
                        `,
                        fullscreen: true,
                        targetEvent: ev,
                        openFrom: ev.target,
                        clickOutsideToClose: true,
                        //locals: {next: undefined}
                    });
                }
            $scope.showDayCall($scope.now, $scope.now).then(log_list => {
                var apiCalls = 0;
                log_list && log_list.length && log_list.forEach(r => {
                    apiCalls += secureNumber(r.callcount);
                });
                $scope.summary.dayCalls = apiCalls;
                $scope.showDayCallDialog = showDayCallDialog;
            });


            $scope.showCountCall().then(data => {
                $scope.summary.countCalls = data.api_count;
            });

            $scope.injectorLoaded = true;

            window.test = () => {
                return $scope
            };
            $scope.$on("$destroy", event => {
                $scope.barChart && $scope.barChart.destroy();
                $scope.lineChart && $scope.lineChart.destroy();
                $scope.lineChart1 && $scope.lineChart1.destroy();
            });
        }];
});
