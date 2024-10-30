<template>
    <div id="echart_bat" style="width:400px;height:400px;"></div>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let echart2=null;
const initEchart2=()=>{
    echart2 = echarts.init(document.getElementById('echart_bat'));

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
    initEchart2()
})
</script>
<style lang='scss' scoped>
</style>