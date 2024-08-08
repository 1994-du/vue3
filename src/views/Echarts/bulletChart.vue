<template>
    <div class="main">
        <h4>子弹图</h4>
        <div id="echart_1" style="width:400px;height:400px;"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
let echart1=null;
const initEchart1=()=>{
    if(echart1!==null){
        echart1.dispose()
    }
    echart1=echarts.init(document.getElementById('echart_1'))
    window.onresize=()=>{
        echart1.resize()
    }
    echart1.setOption({
        title: {
            text: "子弹图示例"
        },
        yAxis: [
            {
                type: 'category',
                data: [''],
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            {
                type: 'category',
                data: [''],
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }
        ],
        xAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        tooltip: {
            formatter: '{a}: {c}'
        },
        legend: {
            data: ['实际值', {
                name: '目标值',
                icon: 'path://M0 0M443.733333 0 h145.066667 v1024 H443.733333z'
            }],
            selectedMode: false
        },
        grid: {
            containLabel: true,
            width: "99%",
            height: 120,
            left: 0,
            top: 50
        },
        series: [
            {
                name: "背景色作用",
                data: [100],
                type: 'bar',
                yAxisIndex: 0,
                stack: "range",
                silent: true,
                barWidth: 90,
                color: "#fdebf0"
            },
            {
                name: "实际值",
                data: [75],
                type: 'bar',
                yAxisIndex: 1,
                barWidth: 60,
                color: "#d21f3e",
                z: 3,
            },
            {
                name: "目标值",
                type: "scatter",
                symbol: "rect",
                symbolSize: [2, 90],
                data: [
                    { value: 85, label: { show: true, position: 'top', formatter: '目标值', color: '#000000', fontSize: 14 } },
                    { value: 85, label: { show: true, position: 'bottom', formatter: '85', color: '#000000', fontSize: 14 } }
                ],
                color: "#000000",
                emphasis: {
                    disabled:true
                },
                z: 4
            }
        ]
    })
}
onMounted(()=>{
    initEchart1()
})
</script>
<style lang='scss' scoped>
</style>