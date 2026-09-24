<template>
    <div class="page bars-page">
        <!-- ① 分组与堆叠 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Grouped / Stacked</span>
                    <h2 class="panel__title">多系列对比</h2>
                </div>
                <span class="panel__meta">同一份数据：分组比大小，堆叠看总量</span>
            </div>
            <div class="panel__body">
                <div class="pg__controls">
                    <div class="pg__row">
                        <span class="pg__label">形态</span>
                        <div class="pg__btns">
                            <button
                                v-for="m in modes"
                                :key="m.value"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': mode === m.value }"
                                @click="mode = m.value">
                                {{ m.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div ref="msRef" class="chart"></div>
            </div>
        </section>

        <!-- ② 长数据滚动与完整导出 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Scroll & Export</span>
                    <h2 class="panel__title">长数据滚动与完整导出</h2>
                </div>
                <span class="panel__meta">50 条横向数据 + dataZoom 窗口，导出时绕过窗口拿全量</span>
            </div>
            <div class="panel__body">
                <div ref="zoomRef" class="chart chart--tall"></div>
                <div class="exp__actions">
                    <button type="button" class="dl-btn" @click="downloadFullImage">
                        ▸ 下载完整图表（PNG）
                    </button>
                    <span class="exp__hint">导出原理：getOption 后删掉 dataZoom，在屏外容器按全量高度重渲一次再 getDataURL</span>
                </div>
            </div>
        </section>

        <!-- ③ 配置要点 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">配置要点</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="note-grid">
                    <div v-for="note in notes" :key="note.title" class="note">
                        <span class="note__mark" aria-hidden="true">▸</span>
                        <div>
                            <p class="note__title">{{ note.title }}</p>
                            <p class="note__desc">{{ note.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

/* ---- 主题令牌：画布取不到 CSS 变量，挂载时读一次，切主题时重读 ---- */
type Theme = {
    brand: string
    text: string
    secondary: string
    tertiary: string
    hairline: string
    hairlineStrong: string
    surface: string
    font: string
}

function readTheme(): Theme {
    const s = getComputedStyle(document.documentElement)
    const v = (n: string) => s.getPropertyValue(n).trim()
    return {
        brand: v('--brand'),
        text: v('--text-primary'),
        secondary: v('--text-secondary'),
        tertiary: v('--text-tertiary'),
        hairline: v('--hairline'),
        hairlineStrong: v('--hairline-strong'),
        surface: v('--surface-raised'),
        font: v('--font-sans'),
    }
}

function alpha(color: string, a: number): string {
    const hex = color.trim()
    if (!hex.startsWith('#')) return hex
    const full = hex.length === 4
        ? hex.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3')
        : hex
    const n = parseInt(full.slice(1), 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return `rgba(${r}, ${g}, ${b}, ${a})`
}

/* ---- 公共坐标轴 / 提示框 ---- */
function baseOption(t: Theme) {
    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
        },
        legend: {
            top: 0,
            right: 0,
            itemWidth: 12,
            itemHeight: 8,
            itemGap: 14,
            textStyle: { color: t.secondary, fontSize: 11 },
        },
        grid: { left: 8, right: 12, top: 32, bottom: 8, containLabel: true },
    }
}

/* ---- ① 多系列：分组 / 堆叠 ---- */
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月']
/* 终端配方只允许一个饱和色：主系列琥珀，其余系列全部降饱和 */
const SERIES_META = [
    { name: '直营店', color: 'brand' },
    { name: '加盟店', color: 'tertiary' },
    { name: '线上渠道', color: 'hairlineStrong' },
] as const
const SERIES_DATA = [
    [320, 302, 341, 374, 390, 450],
    [240, 182, 191, 234, 290, 330],
    [150, 212, 201, 154, 190, 260],
]

const msRef = ref<HTMLElement | null>(null)
let msChart: echarts.ECharts | null = null

const modes = [
    { label: '分组', value: 'group' },
    { label: '堆叠', value: 'stack' },
]
const mode = ref<'group' | 'stack'>('group')

function buildMultiOption() {
    const t = readTheme()
    return {
        ...baseOption(t),
        xAxis: {
            type: 'category',
            data: MONTHS,
            axisLine: { lineStyle: { color: t.hairlineStrong } },
            axisTick: { show: false },
            axisLabel: { color: t.tertiary, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: t.tertiary, fontSize: 11 },
            splitLine: { lineStyle: { color: t.hairline, type: 'dashed' } },
        },
        series: SERIES_META.map((meta, i) => ({
            name: meta.name,
            type: 'bar',
            stack: mode.value === 'stack' ? 'total' : '',
            barGap: '20%',
            barMaxWidth: 32,
            data: SERIES_DATA[i],
            itemStyle: { color: t[meta.color], borderRadius: mode.value === 'group' ? [2, 2, 0, 0] : 0 },
        })),
    }
}

/* ---- ② 长数据：dataZoom 滚动 + 完整导出 ---- */
const zoomRef = ref<HTMLElement | null>(null)
let zoomChart: echarts.ECharts | null = null

const bigData = Array.from({ length: 50 }, (_, i) => ({
    name: `数据${String(i + 1).padStart(2, '0')}`,
    value: Math.floor(Math.random() * 100),
}))

function buildZoomOption() {
    const t = readTheme()
    const count = bigData.length
    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
        },
        grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
        xAxis: {
            type: 'value',
            axisLabel: { color: t.tertiary, fontSize: 11 },
            splitLine: { lineStyle: { color: t.hairline, type: 'dashed' } },
        },
        yAxis: {
            type: 'category',
            data: bigData.map((d) => d.name),
            axisLine: { lineStyle: { color: t.hairlineStrong } },
            axisTick: { show: false },
            axisLabel: { color: t.tertiary, fontSize: 10 },
        },
        series: [
            {
                name: '数值',
                type: 'bar',
                data: bigData.map((d) => d.value),
                barWidth: 10,
                itemStyle: { color: t.brand },
            },
        ],
        dataZoom: [
            {
                type: 'slider',
                yAxisIndex: 0,
                start: 0,
                end: (100 / count) * 10,
                backgroundColor: t.surface,
                borderColor: t.hairline,
                fillerColor: alpha(t.brand, 0.12),
                dataBackground: {
                    lineStyle: { color: t.hairlineStrong },
                    areaStyle: { color: alpha(t.tertiary, 0.15) },
                },
                textStyle: { color: t.tertiary, fontSize: 10 },
                handleStyle: { color: t.brand },
                moveHandleStyle: { color: t.hairlineStrong },
                emphasis: { handleStyle: { borderColor: t.brand } },
            },
        ],
    }
}

/* 导出全量图表：临时实例挂在屏外，用完即毁 */
function downloadFullImage() {
    if (!zoomChart) return
    const t = readTheme()
    const fullOption = zoomChart.getOption()
    delete (fullOption as Record<string, unknown>).dataZoom

    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.cssText = `position:absolute;top:-9999px;width:800px;height:${bigData.length * 40}px;`
    document.body.appendChild(hiddenDiv)

    const tempChart = echarts.init(hiddenDiv)
    tempChart.setOption(fullOption)
    const url = tempChart.getDataURL({ type: 'png', backgroundColor: t.surface, pixelRatio: 2 })
    tempChart.dispose()
    document.body.removeChild(hiddenDiv)

    const link = document.createElement('a')
    link.href = url
    link.download = 'full_chart.png'
    link.click()
}

/* ---- 要点 ---- */
const notes = [
    {
        title: '多系列就是多一个对象',
        desc: 'series 数组里每个对象是一个系列，name 与 legend 对应；不设 legend 时默认展示在右上角。',
    },
    {
        title: 'stack 同名即堆叠',
        desc: '所有系列设 stack: "total" 后纵向叠加看总量；清掉同名就回到分组比大小。一份数据两种叙事。',
    },
    {
        title: '配色纪律：只有一个饱和色',
        desc: '主系列用品牌琥珀，次要系列全部降饱和（tertiary / hairline 级），多系列才不会变成调色盘。',
    },
    {
        title: 'dataZoom 的轴向别搞反',
        desc: '横向条形图的滚动条在 Y 轴上，要写 yAxisIndex: 0；窗口大小用 start / end 百分比表达。',
    },
    {
        title: '完整导出的原理',
        desc: 'getOption 拿配置、删掉 dataZoom，塞进屏外容器按「数据条数 × 行高」重渲一次再 getDataURL，导出的是全量而不是当前窗口。',
    },
    {
        title: '导出底色要跟主题',
        desc: 'getDataURL 的 backgroundColor 原来写死 #fff，暗色主题里导出会是一张刺眼的白图——这里改成读令牌。',
    },
]

/* ---- 生命周期 ---- */
let themeObserver: MutationObserver | null = null

function refreshAll() {
    msChart?.setOption(buildMultiOption(), { notMerge: true })
    zoomChart?.setOption(buildZoomOption(), { notMerge: true })
}

function onResize() {
    msChart?.resize()
    zoomChart?.resize()
}

onMounted(() => {
    if (msRef.value) {
        msChart = echarts.init(msRef.value)
        msChart.setOption(buildMultiOption())
    }
    if (zoomRef.value) {
        zoomChart = echarts.init(zoomRef.value)
        zoomChart.setOption(buildZoomOption())
    }
    themeObserver = new MutationObserver(refreshAll)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
})

watch(mode, () => msChart?.setOption(buildMultiOption(), { notMerge: true }))

onBeforeUnmount(() => {
    themeObserver?.disconnect()
    themeObserver = null
    window.removeEventListener('resize', onResize)
    msChart?.dispose()
    msChart = null
    zoomChart?.dispose()
    zoomChart = null
})
</script>

<style scoped lang="scss">
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

.chart--tall {
    height: 420px;
}

/* ---- ① 形态切换 ---------------------------------------------------- */

.pg__controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.pg__row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.pg__label {
    flex-shrink: 0;
    width: 44px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.pg__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.pg__btn {
    appearance: none;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    padding: 6px 12px;
    cursor: pointer;
    transition: border-color 120ms linear, color 120ms linear, background-color 120ms linear;
}

.pg__btn:hover {
    border-color: var(--brand);
    color: var(--text-primary);
}

.pg__btn.is-active {
    border-color: var(--brand);
    color: var(--brand);
    background: color-mix(in srgb, var(--brand) 8%, transparent);
}

.pg__btn:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}

/* ---- ② 导出 -------------------------------------------------------- */

.exp__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
}

.dl-btn {
    appearance: none;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    background: transparent;
    border: 1px solid var(--brand);
    padding: 7px 14px;
    cursor: pointer;
    transition: background-color 120ms linear, color 120ms linear;
}

.dl-btn:hover {
    background: var(--brand);
    color: var(--app-bg);
}

.dl-btn:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}

.exp__hint {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-tertiary);
}

/* ---- ③ 要点 -------------------------------------------------------- */

.note-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.note {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
}

.note__mark {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    padding-top: 2px;
    user-select: none;
}

.note__title {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.note__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- Responsive ---------------------------------------------------- */

@media (max-width: 760px) {
    .note-grid {
        grid-template-columns: 1fr;
    }

    .chart {
        height: 260px;
    }

    .chart--tall {
        height: 320px;
    }
}
</style>
