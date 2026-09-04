<template>
   <div ref="chartRef" style="width:100%;height:100%;"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
    if (!chartRef.value) return
    chartInstance = echarts.init(chartRef.value)
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: { type: 'shadow' }
        },
        yAxis: { type: 'value' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line' }]
    }

    chartInstance.setOption(option)
    chartInstance.getZr().on('click', (params: any) => {
        if (!chartInstance) return
        const pointInGrid = chartInstance.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])
        if (!pointInGrid) return
        const xIndex = Math.round(pointInGrid[0])
    })
}

onMounted(() => initChart())

onBeforeUnmount(() => {
    chartInstance?.dispose()
    chartInstance = null
})
</script>
<style scoped lang='scss'>
</style>