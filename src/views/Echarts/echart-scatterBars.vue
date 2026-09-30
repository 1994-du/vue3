<template>
    <div class="page">
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Combo</span>
                    <h2 class="panel__title">散点 + 柱状 + 折线混排</h2>
                </div>
                <span class="panel__meta">上栅散点、下栅柱线，两个 grid 共享 axisPointer</span>
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

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const RAINFALL = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
const TEMP = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
const EVAPORATION = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]

const buildOption = () => {
    const t = readChartTheme()

    const valueAxis = (gridIndex: number, name: string, max: number, suffix = '') => ({
        gridIndex,
        type: 'value' as const,
        name,
        min: 0,
        max,
        nameRotate: -90,
        nameLocation: 'middle' as const,
        nameGap: 40,
        nameTextStyle: { color: t.tertiary, padding: [0, 0, 0, -120] as unknown as number[] },
        axisLabel: {
            show: true,
            color: t.tertiary,
            fontSize: 11,
            formatter: (value: number) => `${value}${suffix}`,
        },
        splitLine: { show: true, lineStyle: { color: t.hairline, type: 'dashed' as const } },
    })

    return {
        textStyle: { fontFamily: t.font },
        grid: [
            { left: 55, right: 30, bottom: '60%', height: '28%' },
            { left: 55, right: 30, bottom: 30, height: '46%' },
        ],
        tooltip: {
            trigger: 'axis' as const,
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
            formatter: (params: any[]) => {
                if (params[0].axisIndex === 0) return ''
                let result = `${params[0].axisValue}<br>`
                params.forEach((item: any) => {
                    if (item.axisIndex !== 1) return
                    result += `${item.marker} ${item.seriesName}：<b>${item.value}</b><br>`
                })
                return result
            },
        },
        axisPointer: { type: 'shadow' as const, link: { xAxisIndex: 'all' } },
        xAxis: [
            {
                gridIndex: 0,
                type: 'category' as const,
                data: MONTHS,
                show: false,
                axisPointer: { type: 'shadow' as const, snap: true },
            },
            {
                gridIndex: 1,
                type: 'category' as const,
                data: MONTHS,
                axisLine: { lineStyle: { color: t.hairlineStrong } },
                axisTick: { show: false },
                axisLabel: { color: t.tertiary, fontSize: 11 },
                axisPointer: { type: 'shadow' as const, snap: true },
            },
        ],
        yAxis: [
            valueAxis(0, '水量', 250),
            valueAxis(1, '温度', 25, ' °C'),
        ],
        series: [
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: '蒸发量',
                type: 'scatter' as const,
                symbolSize: 9,
                itemStyle: { color: t.info },
                emphasis: {
                    label: {
                        show: true,
                        backgroundColor: withAlpha(t.text, 0.85),
                        color: t.surface,
                        padding: [5, 10],
                        fontSize: 12,
                        formatter: (params: any) => `${params.value}%`,
                    },
                },
                data: EVAPORATION,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: '降水量',
                type: 'bar' as const,
                barWidth: 14,
                itemStyle: { color: t.brand },
                data: RAINFALL,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: '平均温度',
                type: 'bar' as const,
                barWidth: 14,
                itemStyle: { color: withAlpha(t.brand, 0.45) },
                data: TEMP,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: '温度趋势',
                type: 'line' as const,
                symbol: 'none',
                lineStyle: { color: t.success, width: 1.5 },
                itemStyle: { color: t.success },
                data: TEMP,
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
    height: 480px;
}
</style>
