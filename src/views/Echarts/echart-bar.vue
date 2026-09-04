<template>
    <div class="echart_bar">
        <div ref="chartRef" style="width:100%;height:100%;"></div>
    </div>
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
        tooltip: { show: true },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: { type: 'value' },
        series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'bar' }]
    })
}

onMounted(() => initChart())

onBeforeUnmount(() => {
    chartInstance?.dispose()
    chartInstance = null
})
</script>
<style lang='scss' scoped>
.echart_bar{
height: 100%;
    display: flex;
    flex-direction: column;
    .echart_item{
        display: flex;
        align-items: center;
        .img{
            img{
                width: 400px;
                height: 400px;
            }
        }
    }
}
</style>