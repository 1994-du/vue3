<template>
    <div ref="chartRef" style="width:400px;height:400px;"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
    if (!chartRef.value) return
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
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
                    { value: 45, label: { show: true, position: 'top', formatter: '目标值1', color: '#000000', fontSize: 14 } },
                    { value: 45, label: { show: true, position: 'bottom', formatter: '45', color: '#000000', fontSize: 14 } }
                ],
                color: "#000000",
                emphasis: {
                    disabled:true
                },
                z: 4
            },
            {
                name: "目标值",
                type: "scatter",
                symbol: "rect",
                symbolSize: [2, 90],
                data: [
                    { value: 95, label: { show: true, position: 'top', formatter: '目标值2', color: '#000000', fontSize: 14 } },
                    { value: 95, label: { show: true, position: 'bottom', formatter: '95', color: '#000000', fontSize: 14 } }
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

onMounted(() => initChart())

onBeforeUnmount(() => {
    chartInstance?.dispose()
    chartInstance = null
})
</script>
<style lang='scss' scoped>
</style>