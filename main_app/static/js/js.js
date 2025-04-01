let chartData = {
    dates: [],
    currentA: [], currentB: [], currentC: [], angle: [], torque: []
};
function fetchChartData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/get_char_data/',
            method: 'GET',
            success: function(response) {
                // 假设后端返回数据结构包含多个字段
                chartData.dates = response.map(item => item.date);
                chartData.currentA = response.map(item => item.currentA);
                chartData.currentB = response.map(item => item.currentB);
                chartData.currentC = response.map(item => item.currentC);
                chartData.angle = response.map(item => item.angle);
                chartData.torque = response.map(item => item.torque);
                resolve();
            },
            error: function(error) {
                console.error("Error fetching data:", error);
                reject(error);
            }
        });
    });
}

$(function () {
    fetchChartData().then(() => {
        echarts_CH4();
        echarts_C2H6();
        echarts_C2H4();
        echarts_H2();
        echarts_C2H2();
        echarts_1();
        echarts_2();
        echarts_31();
        echarts_32();
        echarts_33();
        echarts_5();
        echarts_6();
    })
function echarts_CH4() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echartCH4'));
           var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                grid: {
                    left: '5',
                    top: '5',
                    right: '0',
                    bottom: '-5',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    margin: 10,
                    data: chartData.dates,
                    name: '采集时间',
                    axisLabel: {
                        interval: 1,
                        rotate: 0,
                        formatter: function (data) {
                            var t_date = new Date(data);
                            return [t_date.getMonth() + 1, t_date.getDate()].join('/');
                        },
                        textStyle: {
                            color: "rgba(255,255,255,1)",
                            fontSize: 10,
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)'
                        },
                    },
                }],
                yAxis: [{
                    min: 0,
                    max: 100,
                    type: 'value',
                    axisTick: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,1)",
                            fontSize: 12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
                series: [
                    {
                        data: chartData.angle,
                        name: '转动角度',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                color: '#00d887',
                                width: 2
                            }
                        },
                        markLine: {
                            label: {
                                show: false
                            },
                            silent: false,
                            symbol: 'line',
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#ff0000',
                                    }
                                }
                            },
                            data: [
                                {
                                    yAxis: 45
                                }
                            ]
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0, 216, 135, 0.4)'
                                }, {
                                    offset: .8,
                                    color: 'rgba(0, 216, 135, 0.1)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#00d887',
                                borderColor: 'rgba(221, 220, 107, .1)',
                                borderWidth: 12,
                            }
                        },
                    },
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

function echarts_C2H6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echartC2H6'));

    option = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
    //图例标签
    //     legend: {
    //         top:'-1%',
    //         data:['安卓','IOS'],
    //         textStyle: {
    //             color: 'rgba(255,255,255,.5)',
	// 		    fontSize:'12',
    //     }
    // },
    grid: {
        left: '5',
		top: '5',
        right: '0',
        bottom: '-5',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
        margin: 10,

        data:chartData.dates,
        name: '采集时间',
        axisLabel:  {

              interval: 1,
              rotate: 0, //设置日期显示样式（倾斜度）
              formatter: function (data) {//在这里写你需要的时间格式
                var t_date = new Date(data);
                return [t_date.getMonth() + 1, t_date.getDate()].join('/')
                // + " " + [t_date.getHours(), t_date.getMinutes()].join(':'); 时分
              },

            textStyle: {
                color: "rgba(255,255,255,1)",
                fontSize:10,
                },
            },
            axisLine: {
			    lineStyle: {
				color: 'rgba(255,255,255,.3)'
			},

        },



    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,
    }],

    yAxis: [{
        min:0,  //取0为最小刻度
        max: 100, //取100为最大刻度
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.3)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,1)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
        {
        // data: C2H6,
        data:chartData.currentA,
        name: 'A相电流',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
				color: '#00d887',
                width: 2
            }
        },
        markLine: {
                        label: {
                            show: false
                        },
                        silent: false, // 鼠标移动到标记线上无操作
                        symbol: 'line',
                        symbolSize: 15,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#ff0000',
                                }
                            }
                        },

                        data: [
                            {
                                yAxis:600
                            }
                            ]
                    },
        //曲线阴影
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: .8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
        //浮动颜色
        itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12,
			}
		},
    },
]

};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
function echarts_C2H4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echartC2H4'));

    option = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
    //图例标签
    //     legend: {
    //         top:'-1%',
    //         data:['安卓','IOS'],
    //         textStyle: {
    //             color: 'rgba(255,255,255,.5)',
	// 		    fontSize:'12',
    //     }
    // },
    grid: {
        left: '5',
		top: '5',
        right: '0',
        bottom: '-5',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
        margin: 10,

        data:chartData.dates,
        name: '采集时间',
        axisLabel:  {

              interval: 1,
              rotate: 0, //设置日期显示样式（倾斜度）
              formatter: function (data) {//在这里写你需要的时间格式
                var t_date = new Date(data);
                return [t_date.getMonth() + 1, t_date.getDate()].join('/')
                // + " " + [t_date.getHours(), t_date.getMinutes()].join(':'); 时分
              },

            textStyle: {
                color: "rgba(255,255,255,1)",
                fontSize:10,
                },
            },
            axisLine: {
			    lineStyle: {
				color: 'rgba(255,255,255,.3)'
			},

        },



    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,
    }],

    yAxis: [{
            min:0,  //取0为最小刻度
          max: 50, //取100为最大刻度
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.3)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,1)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
        {
        // data: C2H4,
        data:chartData.currentB,
        smooth: true,
        name: 'B相电流',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
				color: '#00d887',
                width: 2
            }
        },
        markLine: {
                        label: {
                            show: false
                        },
                        silent: false, // 鼠标移动到标记线上无操作
                        symbol: 'line',
                        symbolSize: 15,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#ff0e0d',
                                }
                            }
                        },

                        data: [
                            {
                                yAxis:25
                            }
                            ]
                    },
        //曲线阴影
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: .8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
        //浮动颜色
        itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12,
			}
		},
    },
]

};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
function echarts_H2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echartH2'));

    option = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
    //图例标签
    //     legend: {
    //         top:'-1%',
    //         data:['安卓','IOS'],
    //         textStyle: {
    //             color: 'rgba(255,255,255,.5)',
	// 		    fontSize:'12',
    //     }
    // },
    grid: {
        left: '5',
		top: '5',
        right: '0',
        bottom: '-5',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
        margin: 10,

        data:chartData.dates,
        name: '采集时间',
        axisLabel:  {

              interval: 1,
              rotate: 0, //设置日期显示样式（倾斜度）
              formatter: function (data) {//在这里写你需要的时间格式
                var t_date = new Date(data);
                return [t_date.getMonth() + 1, t_date.getDate()].join('/')
                // + " " + [t_date.getHours(), t_date.getMinutes()].join(':'); 时分
              },

            textStyle: {
                color: "rgba(255,255,255,1)",
                fontSize:10,
                },
            },
            axisLine: {
			    lineStyle: {
				color: 'rgba(255,255,255,.3)'
			},

        },



    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,
    }],

    yAxis: [{
            min:0,  //取0为最小刻度
          max: 20, //取100为最大刻度
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.3)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,1)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
        {
        // data: H2,
        data: chartData.torque,
        name: '主轴扭矩',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
				color: '#00d887',
                width: 2
            }
        },
        markLine: {
                        label: {
                            show: false
                        },
                        silent: false, // 鼠标移动到标记线上无操作
                        symbol: 'line',
                        symbolSize: 15,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#ff0000',
                                }
                            }
                        },

                        data: [
                            {
                                yAxis:15
                            }
                            ]
                    },
        //曲线阴影
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: .8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
        //浮动颜色
        itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12,
			}
		},
    },
]

};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
function echarts_C2H2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echartC2H2'));

    option = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
    //图例标签
    //     legend: {
    //         top:'-1%',
    //         data:['安卓','IOS'],
    //         textStyle: {
    //             color: 'rgba(255,255,255,.5)',
	// 		    fontSize:'12',
    //     }
    // },
    grid: {
        left: '5',
		top: '5',
        right: '0',
        bottom: '-5',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
        margin: 10,

        data:chartData.dates,
        name: '采集时间',
        axisLabel:  {

              interval: 1,
              rotate: 0, //设置日期显示样式（倾斜度）
              formatter: function (data) {//在这里写你需要的时间格式
                var t_date = new Date(data);
                return [t_date.getMonth() + 1, t_date.getDate()].join('/')
                // + " " + [t_date.getHours(), t_date.getMinutes()].join(':'); 时分
              },

            textStyle: {
                color: "rgba(255,255,255,1)",
                fontSize:10,
                },
            },
            axisLine: {
			    lineStyle: {
				color: 'rgba(255,255,255,.3)'
			},

        },



    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,
    }],

    yAxis: [{
        min:0,  //取0为最小刻度
        max: 100, //取100为最大刻度
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.3)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,1)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
        {
        // data: C2H2,
        data:chartData.currentC,
        name: 'C相电流',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
				color: '#00d887',
                width: 2
            }
        },
        markLine: {
                        label: {
                            show: false
                        },
                        silent: false, // 鼠标移动到标记线上无操作
                        symbol: 'line',
                        symbolSize: 15,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#ff0000',
                                }
                            }
                        },

                        data: [
                            {
                                yAxis:0.2
                            }
                            ]
                    },
        //曲线阴影
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: .8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
        //浮动颜色
        itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12,
			}
		},
    },
]

};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
function echarts_1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart1'));

       option = {
  //  backgroundColor: '#00265f',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '0%',
		top:'10px',
        right: '0%',
        bottom: '4%',
       containLabel: true
    },
    xAxis: [{
        type: 'category',
      		data: ['商超门店', '教育培训', '房地产', '生活服务', '汽车销售', '旅游酒店', '五金建材'],
        axisLine: {
            show: true,
         lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },

        axisTick: {
            show: false,
        },
		axisLabel:  {
                interval: 0,
               // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
            },
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
           //formatter: '{value} %'
			show:true,
			 textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1	)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
               color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [
		{
        type: 'bar',
        data: [200, 300, 300, 900, 1500, 1200, 600],
        barWidth:'35%', //柱子宽度
       // barGap: 1, //柱子之间间距
        itemStyle: {
            normal: {
                color:'#2f89cf',
                opacity: 1,
				barBorderRadius: 5,
            }
        }
    }

	]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart2'));

       option = {
  //  backgroundColor: '#00265f',
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow'}
    },
    grid: {
        left: '0%',
		top:'10px',
        right: '0%',
        bottom: '4%',
       containLabel: true
    },
    xAxis: [{
        type: 'category',
      		data: ['浙江', '上海', '江苏', '广东', '北京', '深圳', '安徽'],
        axisLine: {
            show: true,
         lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
		
        axisTick: {
            show: false,
        },
		axisLabel:  {
                interval: 0,
               // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
            },
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
           //formatter: '{value} %'
			show:true,
			 textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1	)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
               color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [
		{
       
        type: 'bar',
        data: [1500, 1200, 600, 200, 300, 300, 900],
        barWidth:'35%', //柱子宽度
       // barGap: 1, //柱子之间间距
        itemStyle: {
            normal: {
                color:'#27d08a',
                opacity: 1,
				barBorderRadius: 5,
            }
        }
    }
		
	]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_5() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart5'));

       option = {
  //  backgroundColor: '#00265f',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    
    grid: {
        left: '0%',
		top:'10px',
        right: '0%',
        bottom: '2%',
       containLabel: true
    },
    xAxis: [{
        type: 'category',
      		data: ['浙江', '上海', '江苏', '广东', '北京', '深圳', '安徽', '四川'],
        axisLine: {
            show: true,
         lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
		
        axisTick: {
            show: false,
        },
		axisLabel:  {
                interval: 0,
               // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
            },
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
           //formatter: '{value} %'
			show:true,
			 textStyle: {
 					color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1	)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
               color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [{
        type: 'bar',
        data: [2, 3, 3, 9, 15, 12, 6, 4, 6, 7, 4, 10],
        barWidth:'35%', //柱子宽度
       // barGap: 1, //柱子之间间距
        itemStyle: {
            normal: {
                color:'#2f89cf',
                opacity: 1,
				barBorderRadius: 5,
            }
        }
    }
	]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart6'));

        var dataStyle = {
	normal: {
		label: {
			show: false
		},
		labelLine: {
			show: false
		},
		//shadowBlur: 40,
		//shadowColor: 'rgba(40, 40, 40, 1)',
	}
};
var placeHolderStyle = {
	normal: {
		color: 'rgba(255,255,255,.05)',
		label: {show: false,},
		labelLine: {show: false}
	},
	emphasis: {
		color: 'rgba(0,0,0,0)'
	}
};
option = {
	color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
	tooltip: {
		show: true,
		formatter: "{a} : {c} "
	},
	legend: {
		itemWidth: 10,
        itemHeight: 10,
		itemGap: 12,
		bottom: '3%',
		
		data: ['浙江', '上海', '广东', '北京', '深圳'],
		textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
	},
	
	series: [
		{
		name: '浙江',
		type: 'pie',
		clockWise: false,
		center: ['50%', '42%'],
		radius: ['59%', '70%'],
		itemStyle: dataStyle,
		hoverAnimation: false,
		data: [{
			value: 80,
			name: '01'
		}, {
			value: 20,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: '上海',
		type: 'pie',
		clockWise: false,
		center: ['50%', '42%'],
		radius: ['49%', '60%'],
		itemStyle: dataStyle,
		hoverAnimation: false,
		data: [{
			value: 70,
			name: '02'
		}, {
			value: 30,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	}, 
		{
		name: '广东',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['39%', '50%'],
		itemStyle: dataStyle,
		data: [{
			value: 65,
			name: '03'
		}, {
			value: 35,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	},
		{
		name: '北京',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['29%', '40%'],
		itemStyle: dataStyle,
		data: [{
			value: 60,
			name: '04'
		}, {
			value: 40,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	}, 
		{
		name: '深圳',
		type: 'pie',
		clockWise: false,
		hoverAnimation: false,
		center: ['50%', '42%'],
		radius: ['20%', '30%'],
		itemStyle: dataStyle,
		data: [{
			value: 50,
			name: '05'
		}, {
			value: 50,
			name: 'invisible',
			tooltip: {show: false},
			itemStyle: placeHolderStyle
		}]
	}, ]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_31() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb1')); 
option = {
   
	    title: [{
        text: '年龄分布',
        left: 'center',
        textStyle: {
            color: '#fff',
			fontSize:'16'
        }

    }],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
position:function(p){   //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
        }
    },
    legend: {
        
top:'70%',
       itemWidth: 10,
        itemHeight: 10,
        data:['0岁以下','20-29岁','30-39岁','40-49岁','50岁以上'],
                textStyle: {
            color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    series: [
        {
        	name:'年龄分布',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
                  color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],	
            label: {show:false},
			labelLine: {show:false},
            data:[
                {value:1, name:'0岁以下'},
                {value:4, name:'20-29岁'},
                {value:2, name:'30-39岁'},
                {value:2, name:'40-49岁'},
                {value:1, name:'50岁以上'},
            ]
        }
    ]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_32() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb2'));
option = {
   
	    title: [{
        text: '职业分布',
        left: 'center',
        textStyle: {
            color: '#fff',
			fontSize:'16'
        }

    }],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
position:function(p){   //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
        }
    },
    legend: {
        
    top:'70%',
       itemWidth: 10,
        itemHeight: 10,
        data:['电子商务','教育','IT/互联网','金融','学生','其他'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    series: [
        {
        	name:'年龄分布',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
            color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],	
            label: {show:false},
			labelLine: {show:false},
            data:[
                {value:5, name:'电子商务'},
                {value:1, name:'教育'},
                {value:6, name:'IT/互联网'},
                {value:2, name:'金融'},
                {value:1, name:'学生'},
                {value:1, name:'其他'},
            ]
        }
    ]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_33() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb3'));
option = {
	    title: [{
        text: '兴趣分布',
        left: 'center',
        textStyle: {
            color: '#fff',
			fontSize:'16'
        }

    }],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
position:function(p){   //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
        }
    },
    legend: {
    top:'70%',
       itemWidth: 10,
        itemHeight: 10,
        data:['汽车','旅游','财经','教育','软件','其他'],
                textStyle: {
            color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    series: [
        {
        	name:'兴趣分布',
            type:'pie',
			center: ['50%', '42%'],
            radius: ['40%', '60%'],
                   color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab','#06b4ab','#06c8ab','#06dcab','#06f0ab'],	
            label: {show:false},
			labelLine: {show:false},
            data:[
                {value:2, name:'汽车'},
                {value:3, name:'旅游'},
                {value:1, name:'财经'},
                {value:4, name:'教育'},
                {value:8, name:'软件'},
                {value:1, name:'其他'},
            ]
        }
    ]
};
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
				
	
})



		
		
		


		









