<template>
    <div class="page bar-page">
        <!-- ① 基础柱状图 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Basic Demo</span>
                    <h2 class="panel__title">单系列柱状图</h2>
                </div>
                <span class="panel__meta">颜色与轴线全部取自设计令牌，明暗主题自动跟随</span>
            </div>
            <div class="panel__body">
                <div ref="basicRef" class="chart"></div>
            </div>
        </section>

        <!-- ② 样式试验台 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">样式试验台</h2>
                </div>
                <span class="panel__meta">点开关即时生效，观察柱宽 / 圆角 / 渐变 / 刻线的组合效果</span>
            </div>
            <div class="panel__body">
                <div class="pg__controls">
                    <div class="pg__row">
                        <span class="pg__label">柱宽</span>
                        <div class="pg__btns">
                            <button
                                v-for="w in widths"
                                :key="w.value"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': barWidth === w.value }"
                                @click="barWidth = w.value">
                                {{ w.label }}
                            </button>
                        </div>
                    </div>
                    <div class="pg__row">
                        <span class="pg__label">修饰</span>
                        <div class="pg__btns">
                            <button
                                v-for="t in decorations"
                                :key="t.key"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': flags[t.key] }"
                                @click="flags[t.key] = !flags[t.key]">
                                {{ t.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div ref="pgRef" class="chart"></div>
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

/* #FFA02F → rgba(r,g,b,a)，渐变第二站与背景刻线要用带透明度的颜色 */
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

/* ---- 公共坐标轴 / 提示框，页面里所有图表共享同一套观感 ---- */
function baseOption(t: Theme, pointer: 'shadow' | 'line' = 'shadow') {
    return {
        textStyle: { fontFamily: t.font },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: pointer },
            backgroundColor: t.surface,
            borderColor: t.hairline,
            textStyle: { color: t.text, fontSize: 12 },
        },
        grid: { left: 8, right: 12, top: 28, bottom: 8, containLabel: true },
        xAxis: {
            type: 'category',
            data: WEEK,
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

/* ---- ① 基础柱状图 ---- */
const basicRef = ref<HTMLElement | null>(null)
let basicChart: echarts.ECharts | null = null

function buildBasicOption() {
    const t = readTheme()
    return {
        ...baseOption(t),
        series: [
            {
                name: '访问量',
                type: 'bar',
                data: VALUES,
                barWidth: 26,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: t.brand },
                        { offset: 1, color: alpha(t.brand, 0.25) },
                    ]),
                    borderRadius: [3, 3, 0, 0],
                },
                showBackground: true,
                backgroundStyle: { color: alpha(t.tertiary, 0.1), borderRadius: [3, 3, 0, 0] },
            },
        ],
    }
}

/* ---- ② 试验台 ---- */
const pgRef = ref<HTMLElement | null>(null)
let pgChart: echarts.ECharts | null = null

const widths = [
    { label: '窄', value: 12 },
    { label: '适中', value: 26 },
    { label: '宽', value: 44 },
]
const decorations = [
    { key: 'radius', label: '顶部圆角' },
    { key: 'gradient', label: '纵向渐变' },
    { key: 'label', label: '数值标签' },
    { key: 'bg', label: '背景刻线' },
] as const

const barWidth = ref(26)
const flags = reactive({ radius: true, gradient: true, label: false, bg: true })

function buildPgOption() {
    const t = readTheme()
    const color = flags.gradient
        ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: t.brand },
              { offset: 1, color: alpha(t.brand, 0.2) },
          ])
        : t.brand
    return {
        ...baseOption(t),
        series: [
            {
                name: '访问量',
                type: 'bar',
                data: VALUES,
                barWidth: barWidth.value,
                itemStyle: { color, borderRadius: flags.radius ? [4, 4, 0, 0] : 0 },
                label: {
                    show: flags.label,
                    position: 'top',
                    color: t.secondary,
                    fontSize: 10,
                    fontFamily: t.font,
                },
                showBackground: flags.bg,
                backgroundStyle: {
                    color: alpha(t.tertiary, 0.1),
                    borderRadius: flags.radius ? [4, 4, 0, 0] : 0,
                },
            },
        ],
    }
}

/* ---- 要点 ---- */
const notes = [
    {
        title: '柱宽交给谁管',
        desc: 'barWidth 写死、不设自适应；barGap / barCategoryGap 都是「柱宽的百分比」，分别控制组内与组间间距。',
    },
    {
        title: 'showBackground 背景刻线',
        desc: '给每根柱子补一条「满量程」的灰底，实际值与上限的差距一眼可见，汇报场景比纯柱子有说服力。',
    },
    {
        title: '渐变只给纵向用',
        desc: 'LinearGradient(0,0,0,1) 从顶部饱和到底部近透明，强化柱子的高度感；横向渐变和多系列渐变都会花。',
    },
    {
        title: '圆角只加顶部两角',
        desc: 'borderRadius 用 [w, w, 0, 0]，四角全圆会把柱子变成胶囊，数值对比反而变难。',
    },
    {
        title: 'tooltip 的两种粒度',
        desc: '类目轴配 trigger: "axis" 看整列，"item" 只看单柱；axisPointer: "shadow" 的影子提示和柱状图最搭。',
    },
    {
        title: '画布读不到 CSS 变量',
        desc: 'ECharts 画在 canvas 里，取不到 CSS 变量——挂载时用 getComputedStyle 读令牌，切主题时 MutationObserver 触发重设 option。',
    },
]

/* ---- 生命周期：两个图表 + 主题监听 + resize ---- */
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
    // data-theme 属性一变就重读令牌重画，画布不会残留旧主题的颜色
    themeObserver = new MutationObserver(refreshAll)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
})

watch([barWidth, flags], () => pgChart?.setOption(buildPgOption(), { notMerge: true }))

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
