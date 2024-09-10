<template>
    <div class="main">
        <h4>子弹图</h4>
        <div id="echart_1" style="width:400px;height:400px;"></div>
        <h4>柱状图</h4>        
        <div id="echart_2" style="width:400px;height:400px;"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let formData = ref({
    input3: '',
    select: ''
})
let formRules = ref({
    input3: [
        { required: true, message: '请输入金额', trigger: 'blur' },
    ],
    select: [
        { required: true, message: '请选择单位', trigger: 'change' },
    ]
})


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
let echart2=null;
const initEchart2=()=>{
    echart2 = echarts.init(document.getElementById('echart_2'));

    // 示例数据
    var data = [2.4, 1.2, 9.4, 16992.44, 6.3];

    // 计算数据的最大最小值
    var minValue = Math.min(...data);
    var maxValue = Math.max(...data);

    // 自定义函数来生成刻度值
    function generateCustomTicks(min, max) {
        var ticks = [];
        var diffPartEnd = 100; // 等差部分的结束值
        var diffStep = 50;     // 等差部分的步长

        // 生成等差部分
        for (var i = min; i <= diffPartEnd; i += diffStep) {
            ticks.push(i);
        }

        // 生成等比部分
        var ratio = 2;        // 等比部分的倍率
        var value = diffPartEnd;
        while (value < max) {
            value *= ratio;
            ticks.push(value);
        }

        return ticks;
    }

    // 根据数据范围生成自定义刻度
    var customTicks = generateCustomTicks(minValue, maxValue);
    console.log('customTicks',customTicks);
    const interval = Math.ceil((maxValue - minValue) / 5);
    const option = {
        label: {
            show: true,
        },
        xAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: maxValue,
            // splitNumber: 10, // 刻度数量
            axisLine: {
                show: false
            },
            axisLabel: {
                formatter: function (value) {
                    if (value >= 1000) {
                    return value / 1000 + 'k'; // 格式化刻度
                    }
                    return value;
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
            type: 'bar',
            data: data
            }
        ]
    };

    echart2.setOption(option);
}
onMounted(()=>{
    initEchart1()
    initEchart2()
})
</script>
<style lang='scss' scoped>
</style>