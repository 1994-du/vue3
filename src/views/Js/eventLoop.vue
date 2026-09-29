<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Event Loop</span>
                    <h2 class="panel__title">一条主线程，两套队列</h2>
                </div>
                <span class="panel__meta">同步 → 清空微任务 → 取一个宏任务，循环往复</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    JS 只有一条主线程：同步代码直接进<em>调用栈</em>执行；异步回调不会马上跑，
                    而是先落进队列排队。栈空之后，事件循环会先把<em>微任务队列</em>
                    <strong>全部清空</strong>，再去宏任务队列里取<strong>一个</strong>，然后重复。
                    下面把这个规则一步步演出来。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">宏任务</span>
                        <span class="point__v">
                            setTimeout / setInterval、事件回调、网络回调；每轮只取一个
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">微任务</span>
                        <span class="point__v">
                            Promise.then / catch / finally、queueMicrotask、MutationObserver；每轮全清
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">关键</span>
                        <span class="point__v">
                            微任务执行中新产生的微任务，同样在本轮就清掉
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 可视化执行 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ sample.name }}</h2>
                </div>
                <span class="panel__meta">{{ sample.summary }}</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">示例</span>
                    <div class="w-btns">
                        <button
                            v-for="s in SAMPLES"
                            :key="s.name"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': activeName === s.name }"
                            @click="pick(s.name)">
                            {{ s.name }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="atEnd" @click="step">
                            下一步
                        </button>
                        <button type="button" class="w-btn" :class="{ 'is-active': playing }" @click="togglePlay">
                            {{ playing ? '暂停' : '自动播放' }}
                        </button>
                        <button type="button" class="w-btn" @click="reset">重置</button>
                    </div>
                    <span class="w-hint">第 {{ index + 1 }} / {{ steps.length }} 步</span>
                </div>

                <div class="el-grid">
                    <!-- 代码 -->
                    <div class="el-col">
                        <div class="el-col__label">Script</div>
                        <ol class="code-lines">
                            <li
                                v-for="(line, i) in codeLines"
                                :key="i"
                                class="code-line"
                                :class="{ 'is-current': current.line === i + 1, 'is-past': current.line > i + 1 }">
                                <span class="ln">{{ String(i + 1).padStart(2, '0') }}</span>
                                <span class="lc mono">{{ line || ' ' }}</span>
                            </li>
                        </ol>
                        <p class="step-note">{{ current.desc }}</p>
                    </div>

                    <!-- 队列 -->
                    <div class="el-queues">
                        <div class="queue">
                            <div class="queue__head">
                                <span class="queue__name">调用栈 CALL STACK</span>
                                <span class="queue__count mono">{{ current.stack.length }}</span>
                            </div>
                            <div class="queue__body">
                                <span v-for="(s, i) in current.stack" :key="i" class="chip is-stack mono">{{ s }}</span>
                                <span v-if="!current.stack.length" class="queue__empty">空</span>
                            </div>
                        </div>

                        <div class="queue">
                            <div class="queue__head">
                                <span class="queue__name">微任务 MICROTASK</span>
                                <span class="queue__count mono">{{ current.micro.length }}</span>
                            </div>
                            <div class="queue__body">
                                <span v-for="(s, i) in current.micro" :key="i" class="chip is-micro mono">{{ s }}</span>
                                <span v-if="!current.micro.length" class="queue__empty">空</span>
                            </div>
                        </div>

                        <div class="queue">
                            <div class="queue__head">
                                <span class="queue__name">宏任务 MACROTASK</span>
                                <span class="queue__count mono">{{ current.macro.length }}</span>
                            </div>
                            <div class="queue__body">
                                <span v-for="(s, i) in current.macro" :key="i" class="chip is-macro mono">{{ s }}</span>
                                <span v-if="!current.macro.length" class="queue__empty">空</span>
                            </div>
                        </div>

                        <div class="queue">
                            <div class="queue__head">
                                <span class="queue__name">CONSOLE</span>
                                <span class="queue__count mono">{{ current.output.length }}</span>
                            </div>
                            <div class="queue__body queue__body--out">
                                <span v-for="(s, i) in current.output" :key="i" class="out-line mono">{{ s }}</span>
                                <span v-if="!current.output.length" class="queue__empty">—</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="final-line">
                    实际输出顺序（浏览器里跑就是它）：
                    <code class="mono">{{ sample.output.join('  →  ') }}</code>
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">上面演的这段代码</h2>
                </div>
                <span class="panel__meta">照着队列推一遍，输出顺序就出来了</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">{{ sample.name }} · 完整代码</div>
                    <CodeEditor :code="sample.code" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

type Step = {
    line: number
    desc: string
    stack: string[]
    micro: string[]
    macro: string[]
    output: string[]
}

type Sample = {
    name: string
    summary: string
    code: string
    output: string[]
    steps: Step[]
}

const SAMPLES: Sample[] = [
    {
        name: '宏任务 vs 微任务',
        summary: '经典三段式：同步先跑，微任务清空，最后才是定时器',
        code: `console.log('1 start')

setTimeout(() => console.log('5 timeout'), 0)

Promise.resolve()
  .then(() => console.log('3 promise-a'))
  .then(() => console.log('4 promise-b'))

console.log('2 end')`,
        output: ['1 start', '2 end', '3 promise-a', '4 promise-b', '5 timeout'],
        steps: [
            {
                line: 1,
                desc: '同步代码开始执行，console.log 进栈 —— 直接打印，不排队',
                stack: ["console.log('1 start')"],
                micro: [],
                macro: [],
                output: ['1 start'],
            },
            {
                line: 3,
                desc: 'setTimeout 的回调是宏任务：登记后立刻出栈，不阻塞当前同步流程',
                stack: ['setTimeout(...)'],
                micro: [],
                macro: ['timeout 回调'],
                output: ['1 start'],
            },
            {
                line: 6,
                desc: 'Promise.then 的回调是微任务，进微任务队列等待',
                stack: ['Promise.resolve()'],
                micro: ['promise-a'],
                macro: ['timeout 回调'],
                output: ['1 start'],
            },
            {
                line: 8,
                desc: '同步代码的最后一行照常执行，不受前面影响',
                stack: ["console.log('2 end')"],
                micro: ['promise-a'],
                macro: ['timeout 回调'],
                output: ['1 start', '2 end'],
            },
            {
                line: 6,
                desc: '调用栈已空 → 事件循环开始把微任务逐个取出，推入栈中执行',
                stack: ['promise-a'],
                micro: [],
                macro: ['timeout 回调'],
                output: ['1 start', '2 end'],
            },
            {
                line: 6,
                desc: 'promise-a 打印完毕，它 return 的结果让链上的 promise-b 入队',
                stack: ['promise-a'],
                micro: ['promise-b'],
                macro: ['timeout 回调'],
                output: ['1 start', '2 end', '3 promise-a'],
            },
            {
                line: 7,
                desc: '本轮继续清掉新产生的微任务 —— 这就是「微任务全清」的含义',
                stack: ['promise-b'],
                micro: [],
                macro: ['timeout 回调'],
                output: ['1 start', '2 end', '3 promise-a', '4 promise-b'],
            },
            {
                line: 3,
                desc: '微任务彻底清空 → 才轮到宏任务出队，且一次只取一个',
                stack: ['timeout 回调'],
                micro: [],
                macro: [],
                output: ['1 start', '2 end', '3 promise-a', '4 promise-b', '5 timeout'],
            },
            {
                line: 0,
                desc: '队列全空，事件循环继续等待新的任务到来',
                stack: [],
                micro: [],
                macro: [],
                output: ['1 start', '2 end', '3 promise-a', '4 promise-b', '5 timeout'],
            },
        ],
    },
    {
        name: 'await 的让行',
        summary: 'await 后面的代码等价于放进 then，属于微任务',
        code: `async function run() {
  console.log('1 同步开始')
  await null
  console.log('3 await 之后')
}

run()
console.log('2 同步结束')`,
        output: ['1 同步开始', '2 同步结束', '3 await 之后'],
        steps: [
            {
                line: 5,
                desc: 'run() 被调用，函数入栈，开始执行函数体',
                stack: ['run()'],
                micro: [],
                macro: [],
                output: [],
            },
            {
                line: 2,
                desc: 'await 之前的部分仍然是同步执行的',
                stack: ["console.log('1 同步开始')"],
                micro: [],
                macro: [],
                output: ['1 同步开始'],
            },
            {
                line: 3,
                desc: '遇到 await：让出线程，后半截函数被包装成微任务入队，run() 出栈',
                stack: [],
                micro: ['await 之后的代码'],
                macro: [],
                output: ['1 同步开始'],
            },
            {
                line: 6,
                desc: '主线程回到外层的同步代码，继续往下跑',
                stack: ["console.log('2 同步结束')"],
                micro: ['await 之后的代码'],
                macro: [],
                output: ['1 同步开始', '2 同步结束'],
            },
            {
                line: 3,
                desc: '栈空 → 微任务出队，await 后面的代码这才执行',
                stack: ['await 之后的代码'],
                micro: [],
                macro: [],
                output: ['1 同步开始', '2 同步结束', '3 await 之后'],
            },
            {
                line: 0,
                desc: '执行完毕，队列全部清空',
                stack: [],
                micro: [],
                macro: [],
                output: ['1 同步开始', '2 同步结束', '3 await 之后'],
            },
        ],
    },
]

const activeName = ref<string>(SAMPLES[0].name)
const sample = computed(() => SAMPLES.find((s) => s.name === activeName.value) ?? SAMPLES[0])
const steps = computed(() => sample.value.steps)
const codeLines = computed(() => sample.value.code.split('\n'))

const index = ref(0)
const current = computed(() => steps.value[Math.min(index.value, steps.value.length - 1)])
const atEnd = computed(() => index.value >= steps.value.length - 1)

function pick(name: string) {
    stop()
    activeName.value = name
    index.value = 0
}

function step() {
    if (atEnd.value) return
    index.value++
}

function reset() {
    stop()
    index.value = 0
}

/* ── 自动播放 ─────────────────────────────────────────── */
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function togglePlay() {
    if (playing.value) {
        stop()
        return
    }
    if (atEnd.value) index.value = 0
    playing.value = true
    timer = setInterval(() => {
        if (atEnd.value) {
            stop()
            return
        }
        index.value++
    }, 1300)
}

function stop() {
    playing.value = false
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

onBeforeUnmount(stop)
</script>

<style scoped>
.el-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
}

.el-col__label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
    margin-bottom: 6px;
}

/* ── 代码区 ─────────────────────────────────────────── */
.code-lines {
    list-style: none;
    margin: 0;
    padding: 6px 0;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}
.code-line {
    display: flex;
    gap: 10px;
    padding: 3px 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
    border-left: 2px solid transparent;
}
.code-line .ln {
    flex: none;
    color: var(--text-tertiary);
    opacity: 0.6;
    user-select: none;
}
.code-line .lc {
    font-size: 12px;
    white-space: pre-wrap;
}
.code-line.is-past {
    color: var(--text-secondary);
}
.code-line.is-current {
    color: var(--brand);
    background: var(--brand-soft);
    border-left-color: var(--brand);
}

.step-note {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    padding-left: 10px;
}

/* ── 队列区 ─────────────────────────────────────────── */
.el-queues {
    display: grid;
    gap: 10px;
}
.queue {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}
.queue__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid var(--hairline);
}
.queue__name {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
}
.queue__count {
    font-size: 11px;
    color: var(--text-tertiary);
}
.queue__body {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 34px;
    padding: 8px 10px;
    align-items: center;
}
.queue__body--out {
    flex-direction: column;
    align-items: stretch;
    gap: 3px;
}
.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}

.chip {
    font-size: 11px;
    padding: 3px 8px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}
.chip.is-stack {
    color: var(--text-primary);
    border-color: var(--hairline-strong);
}
.chip.is-micro {
    color: var(--success);
    border-color: var(--success);
}
.chip.is-macro {
    color: var(--warning);
    border-color: var(--warning);
}

.out-line {
    font-size: 11px;
    color: var(--brand);
}

.final-line {
    margin: 14px 0 0;
    font-size: 12px;
    color: var(--text-secondary);
}
.final-line code {
    color: var(--brand);
    font-size: 12px;
}

@media (max-width: 900px) {
    .el-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
