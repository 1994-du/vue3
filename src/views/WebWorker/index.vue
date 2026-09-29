<template>
    <div class="page worker-page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Web Worker</span>
                    <h2 class="panel__title">给重计算开一条不堵门的侧通道</h2>
                </div>
                <span class="panel__meta">JS 是单线程：算得越久，页面卡得越死</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    主线程既要渲染页面、又要跑 JS。一段 <code>for</code> 循环只要够大，
                    点按钮、播动画、打字全都会被冻住。Web Worker 让重计算去
                    <em>另一条线程</em>跑，主线程只负责收发消息。
                    下面这个实验会让你亲眼「看见」卡与不卡的差别。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">通信</span>
                        <span class="point__v">postMessage / onmessage 收发数据（结构化克隆，不是共享内存）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">边界</span>
                        <span class="point__v">Worker 里没有 DOM 和 window，只有计算、网络、定时器这些纯能力</span>
                    </div>
                    <div class="point">
                        <span class="point__k">回收</span>
                        <span class="point__v">terminate() 之后实例报废，想再用必须重新 new 一个</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 对比实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment</span>
                    <h2 class="panel__title">同一个死循环，两种跑法</h2>
                </div>
                <span class="panel__meta">启动任务后盯着小方块和 FPS——这就是页面的「心跳」</span>
            </div>
            <div class="panel__body">
                <!-- 运算规模 -->
                <div class="w-row">
                    <span class="w-label">运算规模</span>
                    <div class="w-btns">
                        <button
                            v-for="s in SCALES"
                            :key="s.loops"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': loops === s.loops }"
                            :disabled="mainState === 'running'"
                            @click="loops = s.loops">
                            {{ s.label }}次加法
                        </button>
                    </div>
                    <span class="w-hint">规模越大，主线程冻得越久</span>
                </div>

                <!-- 心跳舞台：JS 驱动的动画 + FPS -->
                <div class="stage">
                    <div class="stage__lane"></div>
                    <div ref="dotRef" class="stage__dot"></div>
                    <div class="stage__fps" :class="{ 'is-frozen': frozen }">
                        FPS {{ fps }}<template v-if="frozen"> · 已冻结</template>
                    </div>
                    <button type="button" class="stage__tap" @click="clicks++">
                        页面卡不卡？点我试试 · {{ clicks }}
                    </button>
                </div>

                <!-- 两张实验卡 -->
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">主线程直接算</h3>
                            <span class="card__tag is-bad">会冻结页面</span>
                        </div>
                        <p class="card__desc">
                            循环就写在当前页面脚本里，和动画、点击抢同一条线程。
                        </p>
                        <button
                            type="button"
                            class="w-btn card__btn"
                            :disabled="mainState === 'running'"
                            @click="runMain">
                            {{ mainState === 'running' ? '计算中……' : '在主线程跑' }}
                        </button>
                        <div class="card__result">
                            <div class="res-row">
                                <span class="res-k">状态</span>
                                <span class="res-v" :class="mainState === 'running' ? 'is-warn' : 'is-ok'">
                                    {{ mainState === 'idle' ? '待命' : mainState === 'running' ? '阻塞中，动画/点击全部冻结' : '完成' }}
                                </span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">耗时</span>
                                <span class="res-v mono">{{ mainMs ? fmtMs(mainMs) : '—' }}</span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">求和</span>
                                <span class="res-v mono">{{ mainState === 'done' ? fmtSum(mainSum) : '—' }}</span>
                            </div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">交给 Web Worker</h3>
                            <span class="card__tag is-good">页面照常流畅</span>
                        </div>
                        <p class="card__desc">
                            同样的循环发去 Worker 线程，主线程只等结果，动画和点击照常响应。
                        </p>
                        <button
                            type="button"
                            class="w-btn card__btn"
                            :disabled="wkState === 'running'"
                            @click="runWorker">
                            {{ wkState === 'running' ? 'Worker 计算中……' : '在 Worker 跑' }}
                            </button>
                        <div class="card__result">
                            <div class="res-row">
                                <span class="res-k">状态</span>
                                <span class="res-v" :class="wkState === 'running' ? 'is-warn' : 'is-ok'">
                                    {{ wkState === 'idle' ? '待命' : wkState === 'running' ? 'Worker 计算，主线程无感' : '完成' }}
                                </span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">耗时</span>
                                <span class="res-v mono">{{ wkMs ? fmtMs(wkMs) : '—' }}</span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">求和</span>
                                <span class="res-v mono">{{ wkState === 'done' ? fmtSum(wkSum) : '—' }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实现就这么多</h2>
                </div>
                <span class="panel__meta">Vite 下用 new URL + import.meta.url 引入 worker 模块</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">work.ts · Worker 线程</div>
                    <CodeEditor :code="workerCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">index.vue · 主线程</div>
                    <CodeEditor :code="mainCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

/* ── 运算规模 ─────────────────────────────────────────── */
const SCALES = [
    { label: '1 亿', loops: 1e8 },
    { label: '10 亿', loops: 1e9 },
    { label: '100 亿', loops: 1e10 },
] as const
const loops = ref<number>(1e9)

/* ── 页面心跳：JS 驱动的移动方块 + FPS 计数 ──────────────
   故意用 requestAnimationFrame 而不是 CSS 动画：
   CSS transform 动画跑在合成器线程，主线程冻结时它照样动，
   看不出卡顿；rAF 每一帧都要主线程执行，一冻结立刻现形。 */
const fps = ref(0)
const frozen = computed(() => fps.value > 0 && fps.value < 15)
const dotRef = ref<HTMLElement | null>(null)
let rafId = 0
let frames = 0
let last = performance.now()
let dotX = 0
let dir = 1

function tick(now: number) {
    frames++
    if (now - last >= 500) {
        fps.value = Math.round((frames * 1000) / (now - last))
        frames = 0
        last = now
    }
    const el = dotRef.value
    if (el) {
        const width = el.parentElement?.clientWidth ?? 320
        dotX += dir * 2.4
        if (dotX > width - 22) dir = -1
        if (dotX < 0) dir = 1
        el.style.transform = `translateX(${dotX}px)`
    }
    rafId = requestAnimationFrame(tick)
}

/* ── 实验 A：主线程直接算 ─────────────────────────────── */
const mainState = ref<'idle' | 'running' | 'done'>('idle')
const mainMs = ref(0)
const mainSum = ref(0)

function heavy(n: number) {
    const t0 = performance.now()
    let sum = 0
    for (let i = 0; i < n; i++) {
        sum += i
    }
    return { sum, ms: Math.round(performance.now() - t0) }
}

async function runMain() {
    if (mainState.value === 'running') return
    mainState.value = 'running'
    mainMs.value = 0
    // 先让「阻塞中」的状态画出来，再开始冻结主线程
    await nextTick()
    await new Promise((r) => setTimeout(r, 150))
    const { sum, ms } = heavy(loops.value)
    mainMs.value = ms
    mainSum.value = sum
    mainState.value = 'done'
}

/* ── 实验 B：交给 Web Worker ──────────────────────────── */
const wkState = ref<'idle' | 'running' | 'done'>('idle')
const wkMs = ref(0)
const wkSum = ref(0)
let worker: Worker | null = null

function runWorker() {
    if (wkState.value === 'running') return
    wkState.value = 'running'
    wkMs.value = 0
    worker?.terminate()
    worker = new Worker(new URL('./work.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e) => {
        const { sum, ms } = e.data as { sum: number; ms: number }
        wkMs.value = ms
        wkSum.value = sum
        wkState.value = 'done'
        worker?.terminate()
        worker = null
    }
    worker.postMessage({ loops: loops.value })
}

/* ── 交互计数：证明 worker 计算期间页面依然可点 ────────── */
const clicks = ref(0)

/* ── 展示格式化 ───────────────────────────────────────── */
function fmtMs(ms: number) {
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`
}
function fmtSum(n: number) {
    return n > 1e15 ? n.toExponential(4) : n.toLocaleString('zh-CN')
}

/* ── 展示用源码 ───────────────────────────────────────── */
const workerCode = `// work.ts —— 这段代码跑在 Worker 线程里，和主线程互不干扰
self.onmessage = (e) => {
  const { loops } = e.data
  const start = performance.now()
  let sum = 0
  for (let i = 0; i < loops; i++) {
    sum += i
  }
  // 计算结果 + 耗时一起发回主线程
  self.postMessage({ sum, ms: Math.round(performance.now() - start) })
}`

const mainCode = `// index.vue —— 主线程只负责派活和收结果
function runWorker() {
  worker = new Worker(
    new URL('./work.ts', import.meta.url),
    { type: 'module' }
  )
  // 收到结果时，页面全程没有卡过一下
  worker.onmessage = (e) => {
    const { sum, ms } = e.data
    console.log('worker 算完：', sum, ms + 'ms')
    worker?.terminate() // 用完即弃，下次再 new
  }
  worker.postMessage({ loops: 1_000_000_000 })
}`

/* ── 生命周期 ─────────────────────────────────────────── */
onMounted(() => {
    rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    worker?.terminate()
    worker = null
})
</script>

<style scoped>
/* ── 概念区 ─────────────────────────────────────────── */
.intro__text {
    margin: 0 0 14px;
    color: var(--text-secondary);
    line-height: 1.8;
    max-width: 860px;
}
.intro__text code {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 6px;
}
.intro__text em {
    font-style: normal;
    color: var(--brand);
}
.intro__points {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 10px;
}
.point {
    display: flex;
    align-items: baseline;
    gap: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 10px 12px;
}
.point__k {
    flex: none;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    border-right: 1px solid var(--hairline);
    padding-right: 10px;
}
.point__v {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
}

/* ── 控制行 ─────────────────────────────────────────── */
.w-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
}
.w-label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
}
.w-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.w-btn {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    padding: 6px 12px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.w-btn:hover:not(:disabled) {
    color: var(--brand);
    border-color: var(--brand);
}
.w-btn.is-active {
    color: var(--brand);
    border-color: var(--brand);
    background: var(--brand-soft);
}
.w-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.w-hint {
    font-size: 12px;
    color: var(--text-tertiary);
}

/* ── 心跳舞台 ───────────────────────────────────────── */
.stage {
    position: relative;
    height: 96px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    margin-bottom: 14px;
    overflow: hidden;
}
.stage__lane {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: var(--hairline);
}
.stage__dot {
    position: absolute;
    left: 2px;
    top: 50%;
    width: 18px;
    height: 18px;
    margin-top: -9px;
    background: var(--brand);
}
.stage__fps {
    position: absolute;
    top: 8px;
    right: 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--success);
}
.stage__fps.is-frozen {
    color: var(--danger);
}
.stage__tap {
    position: absolute;
    left: 10px;
    bottom: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
    background: transparent;
    border: 1px dashed var(--hairline);
    padding: 4px 10px;
    cursor: pointer;
}
.stage__tap:hover {
    color: var(--brand);
    border-color: var(--brand);
}

/* ── 实验卡 ─────────────────────────────────────────── */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
}
.card {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
    padding: 14px;
}
.card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
.card__title {
    margin: 0;
    font-size: 14px;
    color: var(--text-primary);
}
.card__tag {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 2px 8px;
    border: 1px solid var(--hairline);
    color: var(--text-tertiary);
}
.card__tag.is-bad {
    color: var(--danger);
    border-color: var(--danger);
}
.card__tag.is-good {
    color: var(--success);
    border-color: var(--success);
}
.card__desc {
    margin: 0 0 12px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.7;
}
.card__btn {
    width: 100%;
    padding: 9px 12px;
    margin-bottom: 12px;
}
.card__result {
    display: grid;
    gap: 6px;
}
.res-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-size: 12px;
}
.res-k {
    flex: none;
    width: 40px;
    color: var(--text-tertiary);
}
.res-v {
    color: var(--text-secondary);
}
.res-v.mono {
    font-family: var(--font-mono);
    color: var(--text-primary);
}
.res-v.is-warn {
    color: var(--warning);
}
.res-v.is-ok {
    color: var(--success);
}

/* ── 源码区 ─────────────────────────────────────────── */
.code-block {
    margin-bottom: 16px;
}
.code-block:last-child {
    margin-bottom: 0;
}
.code-block__label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
    margin-bottom: 6px;
}
</style>
