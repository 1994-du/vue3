<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">setInterval</span>
                    <h2 class="panel__title">定时器从来就不是「精确」的意思</h2>
                </div>
                <span class="panel__meta">它只是「尽快插队」，且误差会累积</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>setInterval(fn, 100)</code> 并不是每 100ms 执行一次 fn，
                    它的真实含义是：<em>每隔 100ms 把 fn 塞进任务队列</em>。
                    主线程要是正忙着，回调就得排队等着；浏览器还有最小值限制（嵌套超过 5 层后通常至少 4ms），
                    后台标签页甚至会被压到 1 秒以上。更糟的是 <strong>误差会累积</strong>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">排队</span>
                        <span class="point__v">回调入队后要等调用栈空出来，同步阻塞会让它迟到</span>
                    </div>
                    <div class="point">
                        <span class="point__k">最小间隔</span>
                        <span class="point__v">嵌套 5 层以上多为 ≥4ms；后台标签页会被限流</span>
                    </div>
                    <div class="point">
                        <span class="point__k">累积</span>
                        <span class="point__v">按「上次结束 + 间隔」排程，误差会不断往后滚雪球</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 漂移实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment</span>
                    <h2 class="panel__title">原生 vs 自纠偏，同时开跑</h2>
                </div>
                <span class="panel__meta">设定间隔 {{ interval }} ms，柱子代表实际偏差</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">间隔</span>
                    <div class="w-btns">
                        <button
                            v-for="d in DELAYS"
                            :key="d"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': interval === d }"
                            :disabled="running"
                            @click="interval = d">
                            {{ d }} ms
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="{ 'is-active': running }" @click="toggle">
                            {{ running ? '停止' : '开始' }}
                        </button>
                        <button type="button" class="w-btn" @click="blockMain">制造 400ms 卡顿</button>
                        <button type="button" class="w-btn" @click="clear">清空数据</button>
                    </div>
                    <span class="w-hint">卡顿会直接顶出一个大偏差，肉眼可见</span>
                </div>

                <div class="stat-grid iv-stats">
                    <div class="stat">
                        <span class="stat__label">原生次数</span>
                        <span class="stat__value">{{ nativeTicks.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">原生平均偏差</span>
                        <span class="stat__value is-bad">{{ avgNative }} ms</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">自纠偏次数</span>
                        <span class="stat__value">{{ fixedTicks.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">自纠偏平均偏差</span>
                        <span class="stat__value is-ok">{{ avgFixed }} ms</span>
                    </div>
                </div>

                <div class="charts">
                    <div class="chart">
                        <div class="chart__head">
                            <span class="chart__name">setInterval</span>
                            <span class="chart__meta mono">最大 {{ maxNative }} ms</span>
                        </div>
                        <div class="chart__body">
                            <span
                                v-for="(t, i) in nativeTicks"
                                :key="`n-${i}`"
                                class="bar bar--native"
                                :class="{ 'is-late': t - interval > 20 }"
                                :style="{ height: barHeight(t) + 'px' }">
                            </span>
                            <span v-if="!nativeTicks.length" class="queue__empty">尚未采集</span>
                        </div>
                    </div>

                    <div class="chart">
                        <div class="chart__head">
                            <span class="chart__name">自纠偏 setTimeout</span>
                            <span class="chart__meta mono">最大 {{ maxFixed }} ms</span>
                        </div>
                        <div class="chart__body">
                            <span
                                v-for="(t, i) in fixedTicks"
                                :key="`f-${i}`"
                                class="bar bar--fixed"
                                :class="{ 'is-late': t - interval > 20 }"
                                :style="{ height: barHeight(t) + 'px' }">
                            </span>
                            <span v-if="!fixedTicks.length" class="queue__empty">尚未采集</span>
                        </div>
                    </div>
                </div>

                <p class="iv-tip">
                    柱子的高度 = 实际间隔相对设定值的偏差。左边会越跑越歪（误差累积），
                    右边每次都用「目标时刻」重新校准，歪了也能拉回来。
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">两种靠谱一点的写法</h2>
                </div>
                <span class="panel__meta">动画用 rAF，周期任务用自纠偏 setTimeout</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">自纠偏 setTimeout · 右边那张图就是它在跑</div>
                    <CodeEditor :code="fixCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">配合 requestAnimationFrame 做动画计时</div>
                    <CodeEditor :code="rafCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, computed, onBeforeUnmount, ref, watch } from 'vue'

const DELAYS = [100, 500, 1000] as const
const MAX_KEEP = 48

const interval = ref<number>(500)
const running = ref(false)
const nativeTicks = ref<number[]>([])
const fixedTicks = ref<number[]>([])

let nativeId: ReturnType<typeof setInterval> | null = null
let fixedId: ReturnType<typeof setTimeout> | null = null
let nativeLast = 0
let fixedTarget = 0

function push(list: Ref<number[]>, ms: number) {
    list.value = [...list.value, ms].slice(-MAX_KEEP)
}

const avgOf = (list: number[]) =>
    list.length ? Math.round(list.reduce((sum, v) => sum + v, 0) / list.length - interval.value) : 0
const maxOf = (list: number[]) => (list.length ? Math.max(...list) - interval.value : 0)

const avgNative = computed(() => avgOf(nativeTicks.value))
const avgFixed = computed(() => avgOf(fixedTicks.value))
const maxNative = computed(() => maxOf(nativeTicks.value))
const maxFixed = computed(() => maxOf(fixedTicks.value))

function barHeight(actual: number) {
    const drift = Math.abs(actual - interval.value)
    return Math.min(48, Math.max(3, Math.round((drift / interval.value) * 48)))
}

function start() {
    stopTimers()
    running.value = true

    // ① 原生：每次排程 1000ms 后入队，误差会被下一次继承
    nativeLast = performance.now()
    nativeId = setInterval(() => {
        const now = performance.now()
        push(nativeTicks, Math.round(now - nativeLast))
        nativeLast = now
    }, interval.value)

    // ② 自纠偏：始终算「下一个该触发的绝对时刻」，歪了能拉回来
    fixedTarget = performance.now() + interval.value
    const loop = () => {
        const now = performance.now()
        const prevTarget = fixedTarget
        push(fixedTicks, Math.round(now - (prevTarget - interval.value)))
        fixedTarget += interval.value
        // 万一落后太多（比如切走了标签页），直接跳到现在，别追补一堆
        if (fixedTarget < now) fixedTarget = now + interval.value
        fixedId = setTimeout(loop, Math.max(0, fixedTarget - performance.now()))
    }
    fixedId = setTimeout(loop, interval.value)
}

function stopTimers() {
    if (nativeId) clearInterval(nativeId)
    if (fixedId) clearTimeout(fixedId)
    nativeId = null
    fixedId = null
}

function toggle() {
    if (running.value) {
        stopTimers()
        running.value = false
        return
    }
    clear()
    start()
}

function clear() {
    nativeTicks.value = []
    fixedTicks.value = []
}

function blockMain() {
    // 同步忙等，模拟一次长时间计算把主线程占住
    const until = performance.now() + 400
    while (performance.now() < until) {
        /* 故意卡住主线程 */
    }
}

watch(interval, () => {
    const wasRunning = running.value
    stopTimers()
    running.value = false
    clear()
    if (wasRunning) start()
})

onBeforeUnmount(stopTimers)

/* ── 展示用源码 ───────────────────────────────────────── */
const fixCode = `// 自纠偏：每次都按「计划中的绝对时刻」排下一次
function preciseInterval(callback, interval) {
  let target = Date.now() + interval
  let timer = null
  let stopped = false

  const tick = () => {
    if (stopped) return
    callback()

    target += interval
    const now = Date.now()
    // 落后太多就丢掉累积的欠账，重新对表
    if (target < now) target = now + interval

    timer = setTimeout(tick, Math.max(0, target - Date.now()))
  }

  timer = setTimeout(tick, interval)
  return () => { stopped = true; clearTimeout(timer) }
}

const stop = preciseInterval(() => {
  console.log('准点执行', Date.now())
}, 1000)

// 不用了记得停
stop()`

const rafCode = `// 动画计时：跟着屏幕刷新率走，比任何定时器都准
function tickEveryFrame(callback) {
  let start = performance.now()
  let raf = 0

  const loop = (now) => {
    callback(now - start)      // 传进来的 elapsed 才是真实经过的时间
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => cancelAnimationFrame(raf)
}

// 做动画时不要用「每次 += 固定值」假设帧率恒定，
// 而要用真实经过的时间换算进度：
function move(start) {
  const DURATION = 1000
  return (now) => {
    const p = Math.min(1, (now - start) / DURATION)   // 0 → 1
    el.style.transform = \`translateX(\${240 * p}px)\`
  }
}

// 补充：后台标签页里 setTimeout/setInterval 会被限流到秒级，
// 所以「倒计时」这类要准的功能，应当以时间戳为准而不是累计次数。`
</script>

<style scoped>
.iv-stats {
    margin-bottom: 14px;
}

.is-bad {
    color: var(--danger);
}
.is-ok {
    color: var(--success);
}

.charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
}

.chart {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.chart__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid var(--hairline);
}

.chart__name {
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
}

.chart__meta {
    font-size: 11px;
    color: var(--text-tertiary);
}

.chart__body {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 56px;
    padding: 8px 10px;
    overflow-x: auto;
}

.bar {
    flex: 1 1 4px;
    min-width: 3px;
    background: var(--brand);
    transition: height 0.12s linear;
}

.bar--fixed {
    background: var(--success);
}

.bar.is-late {
    background: var(--danger);
}

.iv-tip {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    padding-left: 10px;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
