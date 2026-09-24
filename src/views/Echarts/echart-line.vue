<template>
    <div class="page line-page">
        <!-- ① 基础折线图 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Basic Demo</span>
                    <h2 class="panel__title">基础折线图</h2>
                </div>
                <span class="panel__meta">趋势首选；折线表达的是「连续」，柱状表达的是「离散对比」</span>
            </div>
            <div class="panel__body">
                <div ref="basicRef" class="chart"></div>
            </div>
        </section>

        <!-- ② 形态试验台 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">形态试验台</h2>
                </div>
                <span class="panel__meta">同一份数据的四种讲法：折线 / 平滑 / 阶梯，叠加面积与极值标记</span>
            </div>
            <div class="panel__body">
                <div class="pg__controls">
                    <div class="pg__row">
                        <span class="pg__label">形态</span>
                        <div class="pg__btns">
                            <button
                                v-for="s in shapes"
                                :key="s.value"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': shape === s.value }"
                                @click="shape = s.value">
                                {{ s.label }}
                            </button>
                        </div>
                    </div>
                    <div class="pg__row">
                        <span class="pg__label">叠加</span>
                        <div class="pg__btns">
                            <button
                                v-for="d in overlays"
                                :key="d.key"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': flags[d.key] }"
                                @click="flags[d.key] = !flags[d.key]">
                                {{ d.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div ref="pgRef" class="chart"></div>
            </div>
        </section>

        <!-- ③ 使用要点 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">使用要点</h2>
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
import { reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const VALUES = [120, 200, 150, 80, 70, 110, 130]

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

function baseOption(t: Theme) {
    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line', lineStyle: { color: t.hairlineStrong } },
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
        },
        grid: { left: 8, right: 16, top: 28, bottom: 8, containLabel: true },
        xAxis: {
            type: 'category',
            data: WEEK,
            boundaryGap: false,
            axisLine: { lineStyle: { color: t.hairlineStrong } },
            axisTick: { show: false },
            axisLabel: { color: t.tertiary, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: t.tertiary, fontSize: 11 },
            splitLine: { lineStyle: { color: t.hairline, type: 'dashed' } },
        },
    }
}

/* ---- ① 基础折线图 ---- */
const basicRef = ref<HTMLElement | null>(null)
let basicChart: echarts.ECharts | null = null

function buildBasicOption() {
    const t = readTheme()
    return {
        ...baseOption(t),
        series: [
            {
                name: '访问量',
                type: 'line',
                data: VALUES,
                lineStyle: { color: t.brand, width: 2 },
                itemStyle: { color: t.brand },
                symbol: 'circle',
                symbolSize: 6,
            },
        ],
    }
}

/* ---- ② 试验台 ---- */
const pgRef = ref<HTMLElement | null>(null)
let pgChart: echarts.ECharts | null = null

const shapes = [
    { label: '折线', value: 'polyline' },
    { label: '平滑', value: 'smooth' },
    { label: '阶梯', value: 'step' },
] as const
const overlays = [
    { key: 'area', label: '面积渐变' },
    { key: 'mark', label: '极值与均值' },
    { key: 'label', label: '数值标签' },
] as const

const shape = ref<'polyline' | 'smooth' | 'step'>('polyline')
const flags = reactive({ area: true, mark: false, label: false })

function buildPgOption() {
    const t = readTheme()
    const series: Record<string, unknown> = {
        name: '访问量',
        type: 'line',
        data: VALUES,
        smooth: shape.value === 'smooth',
        step: shape.value === 'step' ? 'middle' : false,
        lineStyle: { color: t.brand, width: 2 },
        itemStyle: { color: t.brand },
        symbol: 'circle',
        symbolSize: 6,
        label: {
            show: flags.label,
            position: 'top',
            color: t.secondary,
            fontSize: 10,
            fontFamily: t.font,
        },
    }
    if (flags.area) {
        series.areaStyle = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: alpha(t.brand, 0.28) },
                { offset: 1, color: alpha(t.brand, 0.02) },
            ]),
        }
    }
    if (flags.mark) {
        series.markPoint = {
            symbolSize: 34,
            itemStyle: { color: alpha(t.brand, 0.85) },
            label: { color: t.surface, fontSize: 10, fontFamily: t.font },
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
        }
        series.markLine = {
            silent: true,
            symbol: 'none',
            lineStyle: { color: t.tertiary, type: 'dashed' },
            label: { color: t.tertiary, fontSize: 10, fontFamily: t.font, formatter: '均值 {c}' },
            data: [{ type: 'average', name: '均值' }],
        }
    }
    return { ...baseOption(t), series: [series] }
}

/* ---- 要点 ---- */
const notes = [
    {
        title: 'smooth 有失真',
        desc: '平滑曲线好看，但贝塞尔会越过真实数据点「造」出极值；正式汇报建议直折线，装饰场景再开平滑。',
    },
    {
        title: '面积只给一条线用',
        desc: 'areaStyle 的渐变（顶部 28% 透明度 → 底部近 0）强化趋势感；多系列叠面积会互相遮挡，慎用。',
    },
    {
        title: '阶梯表达「保持到下一刻」',
        desc: 'step: "middle" / "end" 适合离散状态、费率档位这类「不变化就维持」的数据，比斜线诚实。',
    },
    {
        title: 'markPoint / markLine 一开就有',
        desc: '最大最小值气泡与均值虚线不用手算，{ type: "max" } 声明即可；给 markLine 设 silent 免得挡 tooltip。',
    },
    {
        title: 'connectNulls 与断线的含义',
        desc: '数据有缺口时默认断线；connectNulls: true 会连过去。断线本身可能是信息（服务宕机、未开盘），连之前想清楚。',
    },
    {
        title: '大数据量开降采样',
        desc: '数千点以上设 sampling: "lttb"（保留形状的降采样），同时关掉 symbol，否则画布全是圆点糊成一团。',
    },
]

/* ---- 生命周期 ---- */
let themeObserver: MutationObserver | null = null

function refreshAll() {
    basicChart?.setOption(buildBasicOption(), { notMerge: true })
    pgChart?.setOption(buildPgOption(), { notMerge: true })
}

function onResize() {
    basicChart?.resize()
    pgChart?.resize()
}

onMounted(() => {
    if (basicRef.value) {
        basicChart = echarts.init(basicRef.value)
        basicChart.setOption(buildBasicOption())
    }
    if (pgRef.value) {
        pgChart = echarts.init(pgRef.value)
        pgChart.setOption(buildPgOption())
    }
    themeObserver = new MutationObserver(refreshAll)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
})

watch([shape, flags], () => pgChart?.setOption(buildPgOption(), { notMerge: true }))

onBeforeUnmount(() => {
    themeObserver?.disconnect()
    themeObserver = null
    window.removeEventListener('resize', onResize)
    basicChart?.dispose()
    basicChart = null
    pgChart?.dispose()
    pgChart = null
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

/* ---- ② 试验台 ------------------------------------------------------ */

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
}
</style>
