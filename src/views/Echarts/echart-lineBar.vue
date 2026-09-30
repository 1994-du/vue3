<template>
    <div class="page">
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Combo</span>
                    <h2 class="panel__title">折线 + 柱状双栅联动</h2>
                </div>
                <span class="panel__meta">上下两个 grid 共享 axisPointer，颜色取自设计令牌</span>
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
import { readChartTheme, watchTheme } from '@/utils/chartTheme'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let stopWatchTheme: (() => void) | null = null

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']

const buildOption = () => {
    const t = readChartTheme()

    const rateAxis = {
        gridIndex: 0,
        type: 'value' as const,
        name: '同比增长率',
        nameRotate: -90,
        nameLocation: 'middle' as const,
        nameGap: 40,
        nameTextStyle: { color: t.tertiary, padding: [0, 0, 0, -120] as unknown as number[] },
        axisLabel: {
            show: true,
            color: t.tertiary,
            fontSize: 11,
            formatter: (value: number) => `${value}%`,
        },
        splitLine: { show: true, lineStyle: { color: t.hairline, type: 'dashed' as const } },
    }

    const profitAxis = {
        gridIndex: 1,
        type: 'value' as const,
        name: '本年利润',
        nameRotate: -90,
        nameLocation: 'middle' as const,
        nameGap: 40,
        nameTextStyle: { color: t.tertiary, padding: [0, 0, 0, -120] as unknown as number[] },
        axisLabel: { color: t.tertiary, fontSize: 11 },
        splitLine: { show: true, lineStyle: { color: t.hairline, type: 'dashed' as const } },
    }

    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            trigger: 'axis' as const,
            confine: true,
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
            formatter: (params: any) => {
                if (params[0].axisIndex === 0) return ''
                let result = `${params[0].axisValue}<br>`
                params.forEach((item: any) => {
                    if (item.seriesType === 'bar') {
                        result += `${item.marker} ${item.seriesName}: ${item.value}<br>`
                    }
                })
                return result
            },
        },
        axisPointer: { type: 'shadow' as const, link: { xAxisIndex: 'all' } },
        grid: [
            { left: 55, right: '10%', top: 40, bottom: '50%', height: '35%', containLabel: false },
            { left: 55, right: '10%', top: '55%', bottom: 30, height: '35%', containLabel: false },
        ],
        xAxis: [
            {
                type: 'category' as const,
                data: MONTHS,
                show: false,
                gridIndex: 0,
                axisPointer: { type: 'line' as const, snap: true },
            },
            {
                type: 'category' as const,
                data: MONTHS,
                show: true,
                gridIndex: 1,
                axisLine: { lineStyle: { color: t.hairlineStrong } },
                axisTick: { show: false },
                axisLabel: { color: t.tertiary, fontSize: 11 },
                axisPointer: { type: 'shadow' as const, snap: true },
            },
        ],
        yAxis: [rateAxis, profitAxis],
        series: [
            {
                name: '同比增长率',
                type: 'line' as const,
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [2.1, 2.3, 2.5, 2.4, 2.8, 3.1, 3.2, 3.5],
                itemStyle: { color: t.info, borderColor: t.surface, borderWidth: 2 },
                showSymbol: true,
                symbol: 'circle',
                symbolSize: 8,
                emphasis: {
                    label: {
                        show: true,
                        position: 'left' as const,
                        offset: [0, 0],
                        formatter: (params: any) => `{value|${params.value}%}{triangle|▶}`,
                        rich: {
                            value: {
                                color: t.text,
                                backgroundColor: t.surface,
                                padding: [5, 10],
                                lineHeight: 12,
                                fontSize: 12,
                            },
                            triangle: { padding: [0, -3], color: t.surface },
                        },
                    },
                },
                labelLayout: { hideOverlap: true, moveOverlap: 'shiftY' as const },
            },
            {
                name: '本年利润',
                type: 'bar' as const,
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [10, 16, 19, 20, 12, 0, 1, 15],
                barWidth: 22,
                itemStyle: { color: t.brand },
            },
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
    height: 460px;
}
</style>
