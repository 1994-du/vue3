<template>
<div ref="echartRef" class="echart-container" style="width: 100%; height: 100%"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let echartRef = ref(null)
const initEchart = () => {
    const myChart = echarts.init(echartRef.value)
    const option = {
        grid:[
            {left:'55',bottom:'60%', height: '30%'},
            {left:'55',bottom:'5%', height: '50%'}
        ],
        title: {
            text: '散点图与柱状图结合',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                if(params[0].axisIndex === 0) return
                let result = `${params[0].axisValue}<br>`;
                params.forEach(item => {
                    if (item.seriesType === 'bar') { // 只处理柱状图数据
                        result += `${item.marker} ${item.seriesName}: ${item.value}<br>`;
                    }
                });
                return result;
            }
        },
        axisPointer:{
            type:'shadow',
            link: {
                xAxisIndex: 'all'
            }
        },
        // toolbox: {
        //     feature: {
        //         dataView: { show: true, readOnly: false },
        //         magicType: { show: true, type: ['line', 'bar'] },
        //         restore: { show: true },
        //         saveAsImage: { show: true }
        //     }
        // },
        // legend: {
        //     data: ['蒸发量', '降水量', '平均温度']
        // },
        xAxis: [
            {
                gridIndex: 0,
                type: 'category',
                show:false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], axisPointer: {
                    type: 'shadow'
                },
                axisPointer:{
                    type:'line',
                    snap:true
                }
            },
            {
                gridIndex: 1,
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], axisPointer: {
                    type: 'shadow'
                },
                axisPointer:{
                    type:'shadow',
                    snap:true
                }
            }
        ],
        yAxis:
            [
                {
                    gridIndex: 0,
                    type: 'value',
                    name: '水量',
                    min: 0,
                    max: 250,
                    // interval: 50,
                    axisLabel: {
                        formatter: '{value} ml'
                    },
                    axisLabel:{
                        show:true,
                        formatter:(value,index)=>{
                            return value+'%'
                        }
                    },
                    splitLine:{
                        show:true,
                        lineStyle: {
                            color: '#ccc', // 设置横向坐标线的颜色
                            type: 'solid' // 设置横线为虚线样式
                        }
                    }
                },
                {
                    gridIndex: 1,
                    type: 'value',
                    name: '温度',
                    min: 0,
                    max: 25,
                    // interval: 5,
                    splitLine:{
                        show:true,
                        lineStyle: {
                            color: '#ccc', // 设置横向坐标线的颜色
                            type: 'solid' // 设置横线为虚线样式
                        }
                    },
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }
            ],
        series:
            [
                {
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    name: '蒸发量',
                    type: 'scatter',
                    emphasis:{
                        label:{
                            show:true,
                            backgroundColor:'rgba(0,0,0,0.6)',
                            padding:[5,10],
                            borderRadius:5,
                            color:'#fff',
                            formatter:(params)=>{
                                return params.value+'%'
                            }
                        }
                    },
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: '降水量',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: '平均温度',
                    type: 'bar',
                    yAxisIndex: 1, data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
    }
    myChart.setOption(option)
}
onMounted(() => {
    initEchart()
})
</script>
<style lang='scss' scoped>
</style>