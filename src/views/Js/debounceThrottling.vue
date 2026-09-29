<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Throttle &amp; Debounce</span>
                    <h2 class="panel__title">一个求稳，一个求准</h2>
                </div>
                <span class="panel__meta">节流：均匀发枪；防抖：等你说完</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    两者都是给高频事件「降频」，但性格相反：<em>节流</em>保证每个时间段里
                    <strong>至少执行一次</strong>（像机枪匀速点射）；<em>防抖</em>则是每次触发都重新计时，
                    只有<strong>彻底安静下来</strong>才执行一次（等你说完最后一字）。
                    下面在一条时间轴上把它们并排放出来。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">防抖</span>
                        <span class="point__v">输入框搜索联想、窗口 resize 结束后重排、表单校验</span>
                    </div>
                    <div class="point">
                        <span class="point__k">节流</span>
                        <span class="point__v">滚动监听、鼠标移动、按钮连击防护、游戏射击</span>
                    </div>
                    <div class="point">
                        <span class="point__k">共性</span>
                        <span class="point__v">都依赖闭包保存 timer / last 时间戳，所以必须先「造」后「用」</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment</span>
                    <h2 class="panel__title">一路输入，三种待遇</h2>
                </div>
                <span class="panel__meta">同一个事件流同时喂给三路处理</span>
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
                            :class="{ 'is-active': delay === d }"
                            @click="delay = d">
                            {{ d }} ms
                        </button>
                    </div>
                    <span class="w-hint">改间隔会重置时间轴</span>
                </div>

                <div class="w-row">
                    <input
                        v-model="text"
                        class="dt-input"
                        type="text"
                        placeholder="在这里连续打字，或者按右边的按钮制造事件"
                        @input="emit" />
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="burst">连打 12 下</button>
                        <button type="button" class="w-btn" @click="reset">重置</button>
                    </div>
                </div>

                <!-- 时间轴 -->
                <div class="timeline">
                    <div v-for="row in rows" :key="row.key" class="tl-row">
                        <span class="tl-name mono" :class="`is-${row.key}`">{{ row.label }}</span>
                        <div class="tl-track">
                            <span
                                v-for="m in marks"
                                :key="`${row.key}-${m.seq}`"
                                class="tl-tick"
                                :class="[{ 'is-on': isOn(row.key, m.seq), 'is-input': m.seq === lastSeq }]">
                            </span>
                            <span v-if="!marks.length" class="queue__empty">还没有事件</span>
                        </div>
                        <span class="tl-count mono">{{ row.count }}</span>
                    </div>
                </div>

                <!-- 统计 -->
                <div class="stat-grid dt-stats">
                    <div class="stat">
                        <span class="stat__label">事件总数</span>
                        <span class="stat__value">{{ total }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">原始处理</span>
                        <span class="stat__value">{{ counts.raw }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">防抖处理</span>
                        <span class="stat__value">{{ counts.debounce }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">节流处理</span>
                        <span class="stat__value">{{ counts.throttle }}</span>
                    </div>
                </div>

                <div class="cards dt-cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">防抖最后一次处理</h3>
                            <span class="card__tag is-good">安静 {{ delay }}ms 才执行</span>
                        </div>
                        <div class="dt-value mono">{{ debounceResult || '—' }}</div>
                    </article>
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">节流最近一次处理</h3>
                            <span class="card__tag is-good">每 {{ delay }}ms 最多一次</span>
                        </div>
                        <div class="dt-value mono">{{ throttleResult || '—' }}</div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">两个函数，十几行</h2>
                </div>
                <span class="panel__meta">timer 藏在闭包里，所以每次用必须是同一个函数实例</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">debounce · 最后一次说了算</div>
                    <CodeEditor :code="debounceCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">throttle · 定时器版（尾巴一定会执行）</div>
                    <CodeEditor :code="throttleCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">throttle · 时间戳版（第一次立即执行）</div>
                    <CodeEditor :code="throttleTimeCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

type Kind = 'raw' | 'debounce' | 'throttle'
type Mark = { seq: number; fired: Kind[] }

const DELAYS = [300, 600, 1000] as const

const delay = ref<number>(600)
const text = ref('')
const total = ref(0)
const lastSeq = ref(0)
const marks = ref<Mark[]>([])

const counts = reactive<Record<Kind, number>>({ raw: 0, debounce: 0, throttle: 0 })
const debounceResult = ref('')
const throttleResult = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let throttleTimer: ReturnType<typeof setTimeout> | null = null

const rows = computed(() => [
    { key: 'raw' as Kind, label: '原始', count: counts.raw },
    { key: 'debounce' as Kind, label: '防抖', count: counts.debounce },
    { key: 'throttle' as Kind, label: '节流', count: counts.throttle },
])

function isOn(kind: Kind, seq: number) {
    return marks.value.find((m) => m.seq === seq)?.fired.includes(kind) ?? false
}

function fire(kind: Kind, value: string) {
    counts[kind] += 1
    const last = marks.value[marks.value.length - 1]
    if (last) last.fired.push(kind)
    if (kind === 'debounce') debounceResult.value = value
    if (kind === 'throttle') throttleResult.value = value
}

function emit() {
    const value = text.value
    total.value += 1
    lastSeq.value += 1
    // 时间轴上先画一个「输入」的位置，后面谁处理了就往这个位置点亮
    marks.value = [...marks.value, { seq: lastSeq.value, fired: [] }]
    if (marks.value.length > 64) marks.value = marks.value.slice(-64)

    // ① 原始：来一个处理一个
    fire('raw', value)

    // ② 防抖：重置计时器，只在彻底停手后执行
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        debounceTimer = null
        fire('debounce', value)
    }, delay.value)

    // ③ 节流：定时器存在就跳过，到点执行后才放行下一个
    if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
            throttleTimer = null
            fire('throttle', text.value)
        }, delay.value)
    }
}

function burst() {
    let n = 0
    const id = setInterval(() => {
        n += 1
        text.value = `连打第 ${n} 下`
        emit()
        if (n >= 12) clearInterval(id)
    }, 80)
}

function clearTimers() {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (throttleTimer) clearTimeout(throttleTimer)
    debounceTimer = null
    throttleTimer = null
}

function reset() {
    clearTimers()
    text.value = ''
    total.value = 0
    lastSeq.value = 0
    marks.value = []
    counts.raw = 0
    counts.debounce = 0
    counts.throttle = 0
    debounceResult.value = ''
    throttleResult.value = ''
}

watch(delay, reset)
onBeforeUnmount(clearTimers)

/* ── 展示用源码 ───────────────────────────────────────── */
const debounceCode = `function debounce(fn, delay, immediate = false) {
  let timer = null

  return function (...args) {
    const context = this

    if (immediate) {
      // 立即执行版：第一次触发马上跑，之后的 delay 内不再理人
      const callNow = !timer
      timer = setTimeout(() => { timer = null }, delay)
      if (callNow) fn.apply(context, args)
    } else {
      // 常规版：每来一次就重置，只有「安静够久」才真正执行
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}`

const throttleCode = `// 定时器版：尾巴一定会执行一次
function throttle(fn, delay) {
  let timer = null

  return function (...args) {
    const context = this

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null        // 到点后才放行下一次
      }, delay)
    }
  }
}`

const throttleTimeCode = `// 时间戳版：第一次立即响应，之后按间隔放行
function throttle(fn, delay) {
  let last = 0

  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}`
</script>

<style scoped>
.dt-input {
    flex: 1 1 260px;
    min-width: 0;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-primary);
    background: var(--surface-subtle);
    border: 1px solid var(--hairline);
    padding: 8px 12px;
    outline: none;
}
.dt-input:focus {
    border-color: var(--brand);
}
.dt-input::placeholder {
    color: var(--text-tertiary);
}

/* ── 时间轴 ─────────────────────────────────────────── */
.timeline {
    display: grid;
    gap: 6px;
    padding: 12px;
    margin-bottom: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.tl-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.tl-name {
    flex: none;
    width: 46px;
    font-size: 11px;
    color: var(--text-tertiary);
}
.tl-name.is-raw {
    color: var(--text-secondary);
}
.tl-name.is-debounce {
    color: var(--success);
}
.tl-name.is-throttle {
    color: var(--warning);
}

.tl-track {
    flex: 1;
    display: flex;
    gap: 2px;
    align-items: center;
    min-height: 18px;
}

.tl-tick {
    flex: 1 1 0;
    min-width: 2px;
    height: 14px;
    background: var(--hairline);
}
.tl-tick.is-input {
    background: var(--hairline-strong);
}
.tl-tick.is-on {
    background: var(--brand);
}

.tl-count {
    flex: none;
    width: 28px;
    text-align: right;
    font-size: 11px;
    color: var(--text-primary);
}

.dt-stats {
    margin-bottom: 14px;
}

.dt-value {
    font-size: 13px;
    color: var(--brand);
    word-break: break-all;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
