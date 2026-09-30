<template>
    <div class="page">
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Bullet</span>
                    <h2 class="panel__title">子弹图</h2>
                </div>
                <span class="panel__meta">实际值柱 + 目标刻线，颜色全部取自设计令牌，明暗主题自动跟随</span>
            </div>
            <div class="panel__body">
                <div ref="chartRef" class="chart"></div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { readChartTheme, watchTheme, withAlpha } from '@/utils/chartTheme'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let stopWatchTheme: (() => void) | null = null

const TARGET_MARK = 'path://M0 0M443.733333 0 h145.066667 v1024 H443.733333z'

const buildOption = () => {
    const t = readChartTheme()

    const hiddenAxis = {
        type: 'category' as const,
        data: [''],
        axisLine: { show: false },
        axisTick: { show: false },
    }

    const targetLine = (value: number, name: string) => ({
        name: '目标值',
        type: 'scatter' as const,
        symbol: 'rect',
        symbolSize: [2, 90],
        data: [
            { value, label: { show: true, position: 'top' as const, formatter: name, color: t.text, fontSize: 12 } },
            { value, label: { show: true, position: 'bottom' as const, formatter: String(value), color: t.text, fontSize: 12 } },
        ],
        color: t.text,
        emphasis: { disabled: true },
        z: 4,
    })

    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            formatter: '{a}: {c}',
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
        },
        legend: {
            data: ['实际值', { name: '目标值', icon: TARGET_MARK }],
            selectedMode: false,
            textStyle: { color: t.tertiary, fontSize: 11 },
        },
        grid: { containLabel: true, width: '99%', height: 120, left: 0, top: 50 },
        xAxis: {
            type: 'value' as const,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: t.hairline, type: 'dashed' as const } },
            axisLabel: { color: t.tertiary, fontSize: 11 },
        },
        yAxis: [hiddenAxis, hiddenAxis],
        series: [
            {
                name: '背景色作用',
                data: [100],
                type: 'bar' as const,
                yAxisIndex: 0,
                stack: 'range',
                silent: true,
                barWidth: 90,
                itemStyle: { color: withAlpha(t.tertiary, 0.14) },
            },
            {
                name: '实际值',
                data: [75],
                type: 'bar' as const,
                yAxisIndex: 1,
                barWidth: 60,
                itemStyle: { color: t.brand },
                z: 3,
            },
            targetLine(45, '目标值1'),
            targetLine(95, '目标值2'),
        ],
    }
}

function onResize() {
    chartInstance?.resize()
}

onMounted(() => {
    if (!chartRef.value) return
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(buildOption())
    // data-theme 一变就重读令牌重画，画布不会残留旧主题的颜色
    stopWatchTheme = watchTheme(() => {
        chartInstance?.setOption(buildOption(), { notMerge: true })
    })
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    stopWatchTheme?.()
    stopWatchTheme = null
    window.removeEventListener('resize', onResize)
    chartInstance?.dispose()
    chartInstance = null
})
</script>
<style lang="scss" scoped>
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.chart {
    width: 100%;
    height: 320px;
}
</style>
