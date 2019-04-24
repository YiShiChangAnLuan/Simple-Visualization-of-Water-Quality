var clickName = '';
var clickNo = 0;

function drawMap() {
    // 地图数据
    d3.csv("国控地表水监测站基础信息.csv", function (error, csvdata) {

        if (error) {
            console.log(error);
        }
        var myChart = echarts.init(document.getElementById('map'));
        var geoCoordMap = {};
        for (let i = 0; i < csvdata.length; i++) {
            geoCoordMap[csvdata[i].name] = [Number(csvdata[i].lon), Number(csvdata[i].lat)];
        }
        var data = new Array();
        for (let i = 0; i < csvdata.length; i++) {
            let tmp = {
                name: csvdata[i].name,
                value: 100
            };
            data.push(tmp);
        }
        //console.log(data);


        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        option = {
            backgroundColor: '#404a59',
            title: {
                text: '国控地表水监测站',

                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name;
                }
            },
            legend: {
                orient: 'vertical',
                y: 'bottom',
                x: 'right',
                //data: ['啊'],
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: [
                {
                    //name: '',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(data),
                    // symbolSize: function (val) {
                    //     return val[2] / 10;
                    // },
                    label: {
                        normal: {
                            formatter: "{b}",
                            //position: 'right',
                            show: false
                        }
                    },
                    //     emphasis: {
                    //         show: false
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);

        //点击事件,根据点击某个省份计算出这个省份的数据
        myChart.on('click', function (params) {
            console.log(params.data.name);
            clickName = params.data.name;
        });
    });
}

function drawParallelCoordinates() {
    d3.csv("国控地表水监测站基础信息.csv", function (error, csvdata1) {

        if (error) {
            console.log(error);
        }
        d3.csv("国控地表水201501站点监测数据.csv", function (error, csvdata2) {
            if (error) {
                console.log(error);
            }
            //console.log("dsfasdfas")
            var myChart = echarts.init(document.getElementById('other'));
            for (let i = 0; i < csvdata1.length; i++) {
                if (clickName == csvdata1[i].name) {
                    clickNo = csvdata1[i].code;
                    break;
                }
            }
            console.log(clickNo);
            // console.log(csvdata2[1].sta_time.substring(8, 10));

            var data = [];
            for (let i = 0; i < 31; i++) {
                data.push([]);
                data[i].push(i + 1,0,0,0,0,0);
            }
            //console.log(data);
            // let sta_ph_v = 0, sta_do_v = 0, sta_an_v = 0, sta_toc_v = 0, sta_pp_v = 0;
            // let count = 0;
            for (let i = 0; i < csvdata2.length; i++) {
                //console.log(Number(csvdata2[i].sta_id));

                if (clickNo == Number(csvdata2[i].sta_id) && data[Number(csvdata2[i].sta_time.substring(8, 10))-1][1] == 0) {
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][1] += Number(csvdata2[i].sta_ph_v);
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][2] += Number(csvdata2[i].sta_do_v);
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][3] += Number(csvdata2[i].sta_an_v);
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][4] += Number(csvdata2[i].sta_toc_v);
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][5] += Number(csvdata2[i].sta_pp_v);
                }
                else if (clickNo == Number(csvdata2[i].sta_id)) {
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][1] = (Number(csvdata2[i].sta_ph_v)+data[Number(csvdata2[i].sta_time.substring(8, 10))-1][1])/2;
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][2] = (Number(csvdata2[i].sta_do_v)+data[Number(csvdata2[i].sta_time.substring(8, 10))-1][2])/2;
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][3] = (Number(csvdata2[i].sta_an_v)+data[Number(csvdata2[i].sta_time.substring(8, 10))-1][3])/2;
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][4] = (Number(csvdata2[i].sta_toc_v)+data[Number(csvdata2[i].sta_time.substring(8, 10))-1][4])/2;
                    data[Number(csvdata2[i].sta_time.substring(8, 10))-1][5] = (Number(csvdata2[i].sta_pp_v)+data[Number(csvdata2[i].sta_time.substring(8, 10))-1][5])/2;
                }
            }

            console.log(data);



            var schema = [
                {name: 'date', index: 0, text: '日期'},
                {name: 'PH', index: 1, text: 'PH值'},
                {name: 'DO', index: 2, text: '溶解氧'},
                {name: 'AN', index: 3, text: '氨氮'},
                {name: 'TOC', index: 4, text: '高锰酸盐'},
                {name: 'PP', index: 5, text: '总有机碳'},
            ];

            var lineStyle = {
                normal: {
                    width: 1,
                    opacity: 0.5
                }
            };

            option = {
                backgroundColor: '#404a59',
                color:["#ddb926"],
                legend: {
                    bottom: 30,
                    data: [clickName],
                    itemGap: 20,

                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                },
                tooltip: {
                    padding: 10,
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    formatter: function (obj) {
                        var value = obj[0].value;
                        return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                            + obj[0].seriesName + ' ' + value[0] + '日期：'
                            + value[7]
                            + '</div>'
                            + schema[1].text + '：' + value[1] + '<br>'
                            + schema[2].text + '：' + value[2] + '<br>'
                            + schema[3].text + '：' + value[3] + '<br>'
                            + schema[4].text + '：' + value[4] + '<br>'
                            + schema[5].text + '：' + value[5] + '<br>'
                            + schema[6].text + '：' + value[6] + '<br>';
                    }
                },
                parallelAxis: [
                    {dim: 0, name: schema[0].text, inverse: true, max: 31, nameLocation: 'start'},
                    {dim: 1, name: schema[1].text},
                    {dim: 2, name: schema[2].text},
                    {dim: 3, name: schema[3].text},
                    {dim: 5, name: schema[5].text},
                ],
                visualMap: {
                    show: false,
                    min: 0,
                    max: 250,
                    right: 20,
                    bottom: 30,
                    dimension: 2,
                    calculable: false,
                    inRange: {
                        color: ["#ddb926"].reverse()
                    },
                    textGap: 20,
                    textStyle: {
                        color: '#fff'
                    }
                },
                parallel: {
                    left: '5%',
                    right: '18%',
                    bottom: 100,
                    parallelAxisDefault: {
                        type: 'value',
                        name: 'AQI指数',
                        nameLocation: 'end',
                        nameGap: 20,
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 12
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#aaa'
                            }
                        },
                        axisTick: {
                            lineStyle: {
                                color: '#777'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: clickName,
                        type: 'parallel',
                        lineStyle: lineStyle,
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        });

    });
}

drawMap();
setInterval(drawParallelCoordinates,100);
//drawParallelCoordinates();