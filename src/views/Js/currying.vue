<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Currying</span>
                    <h2 class="panel__title">一次收一个参数，凑齐了才干活</h2>
                </div>
                <span class="panel__meta">把 f(a, b, c) 变成 f(a)(b)(c)</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    柯里化就是把一个接收多个参数的函数，改造成一串<em>每次只收一个参数</em>的函数链。
                    每次调用如果参数没凑够，就返回<strong>一个新函数</strong>继续等；
                    凑够了才真正执行。好处是：<em>固定一部分参数</em>，造出可复用的专用函数。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">判断</span>
                        <span class="point__v">已收集的参数个数 ≥ 元数（fn.length）时执行</span>
                    </div>
                    <div class="point">
                        <span class="point__k">本质</span>
                        <span class="point__v">闭包记住已传参数 + 递归返回自身</span>
                    </div>
                    <div class="point">
                        <span class="point__k">用途</span>
                        <span class="point__v">参数复用（如固定税率/折扣）、延迟执行、函数组合</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ cur.name }}</h2>
                </div>
                <span class="panel__meta">{{ cur.formula }}</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">示例</span>
                    <div class="w-btns">
                        <button
                            v-for="c in CASES"
                            :key="c.id"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': active === c.id }"
                            @click="select(c.id)">
                            {{ c.name }}
                        </button>
                    </div>
                    <span class="w-hint">参数一个个点，凑够就出结果</span>
                </div>

                <div class="curry-grid">
                    <!-- 参数收集 -->
                    <div class="curry-panel">
                        <div class="code-block__label">已收集的参数</div>
                        <div class="args-box">
                            <span v-for="(a, i) in collected" :key="i" class="arg-chip mono">
                                {{ cur.labels[i] }}={{ a }}
                            </span>
                            <span v-if="!collected.length" class="queue__empty">点下面的按钮喂参数</span>
                            <span v-for="i in cur.labels.length - collected.length" :key="`p-${i}`" class="arg-chip is-pending mono">
                                {{ cur.labels[collected.length + i - 1] }}=?
                            </span>
                        </div>

                        <div class="progress-bar">
                            <span
                                class="progress-fill"
                                :style="{ width: (collected.length / cur.labels.length) * 100 + '%' }"></span>
                        </div>
                        <p class="progress-text mono">
                            {{ collected.length }} / {{ cur.labels.length }} 个参数
                        </p>

                        <div class="w-btns param-btns">
                            <button
                                v-for="opt in cur.options"
                                :key="opt.label"
                                type="button"
                                class="w-btn"
                                @click="feed(opt.value)">
                                {{ opt.label }}
                            </button>
                        </div>
                    </div>

                    <!-- 调用链 -->
                    <div class="curry-panel">
                        <div class="code-block__label">调用过程</div>
                        <div class="call-chain">
                            <span v-for="(c, i) in chain" :key="i" class="chain-row">
                                <span class="chain-call mono">{{ c.call }}</span>
                                <span class="chain-arrow mono">→</span>
                                <span class="chain-result mono" :class="c.kind">
                                    {{ c.result }}
                                </span>
                            </span>
                            <span v-if="!chain.length" class="queue__empty">尚未调用</span>
                        </div>
                        <div class="res-row chain-final">
                            <span class="res-k">最终</span>
                            <span class="res-v mono" :class="lastIsValue ? 'is-ok' : 'is-warn'">
                                {{ lastResult }}
                            </span>
                        </div>
                        <button type="button" class="w-btn reset-btn" @click="reset">重置</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">通用 curry 的写法</h2>
                </div>
                <span class="panel__meta">上面演示的就在跑这段逻辑</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">实现：闭包存参数，没凑够就返回自己</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">经典用法：参数复用</div>
                    <CodeEditor :code="usageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type NumericFn = (...args: number[]) => number

/*  curry：把多参函数改造成逐个收参的函数链。
    参数没凑够就返回自身继续等，凑够了立刻执行并清空。 */
function curry(fn: NumericFn, arity: number) {
    let pool: number[] = []

    const collect = (...args: number[]): unknown => {
        pool = [...pool, ...args]
        if (pool.length >= arity) {
            const result = fn(...pool)
            pool = []
            return result
        }
        return collect
    }

    return collect
}

type Case = {
    id: string
    name: string
    formula: string
    labels: string[]
    options: { label: string; value: number }[]
    run: NumericFn
    unit?: string
}

const CASES: Case[] = [
    {
        id: 'sum',
        name: '三个数求和',
        formula: 'add(a)(b)(c) = a + b + c',
        labels: ['a', 'b', 'c'],
        options: [
            { label: '+ 1', value: 1 },
            { label: '+ 2', value: 2 },
            { label: '+ 5', value: 5 },
            { label: '+ 10', value: 10 },
        ],
        run: (a: number, b: number, c: number) => a + b + c,
    },
    {
        id: 'discount',
        name: '折扣复用',
        formula: 'discount(折扣)(原价) = 实付',
        labels: ['折扣', '原价'],
        options: [
            { label: '9 折 (0.9)', value: 0.9 },
            { label: '8 折 (0.8)', value: 0.8 },
            { label: '原价 199', value: 199 },
            { label: '原价 599', value: 599 },
        ],
        run: (rate: number, price: number) => Number((rate * price).toFixed(2)),
    },
    {
        id: 'volume',
        name: '长方体体积',
        formula: 'volume(长)(宽)(高)',
        labels: ['长', '宽', '高'],
        options: [
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
        ],
        run: (l: number, w: number, h: number) => l * w * h,
    },
]

const active = ref<string>(CASES[0].id)
const cur = computed(() => CASES.find((c) => c.id === active.value) ?? CASES[0])

const collected = ref<number[]>([])
const chain = ref<{ call: string; result: string; kind: string }[]>([])
const lastResult = ref('—')
const lastIsValue = ref(false)

// 每个示例一套独立的实现实例，重置时跟着换
let runner = curry(cur.value.run, cur.value.labels.length)

function select(id: string) {
    active.value = id
    reset()
}

function reset() {
    collected.value = []
    chain.value = []
    lastResult.value = '—'
    lastIsValue.value = false
    runner = curry(cur.value.run, cur.value.labels.length)
}

function feed(value: number) {
    const idx = collected.value.length
    const label = cur.value.labels[idx] ?? 'x'
    const out = runner(value)

    collected.value = [...collected.value, value]

    const isValue = typeof out !== 'function'
    const call = `${cur.value.name}(${collected.value.join(')(')})`
    const suffix = collected.value.length < cur.value.labels.length ? '' : ')'

    chain.value = [
        ...chain.value,
        {
            call: `第 ${idx + 1} 次 ${call}${suffix}`,
            result: isValue ? String(out) : '返回一个新函数，继续等参数',
            kind: isValue ? 'is-value' : 'is-fn',
        },
    ]

    if (isValue) {
        lastResult.value = String(out)
        lastIsValue.value = true
        // 结果出完就换新实例，方便接着演示
        runner = curry(cur.value.run, cur.value.labels.length)
        // 结果出来后清空收集区，视觉上表示这一轮结束了
        setTimeout(() => {
            if (collected.value.length >= cur.value.labels.length) collected.value = []
        }, 600)
    } else {
        lastResult.value = `还差 ${cur.value.labels.length - collected.value.length} 个参数`
        lastIsValue.value = false
    }
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function curry(fn, arity = fn.length) {
  let pool = []            // 闭包里存放已收集的参数

  const collect = (...args) => {
    pool = [...pool, ...args]

    if (pool.length >= arity) {
      const result = fn(...pool)   // 凑够了就执行
      pool = []
      return result
    }
    return collect                 // 没够，把自己交出去继续等
  }

  return collect
}

const add = curry((a, b, c) => a + b + c)
add(1)        // ƒ collect
add(1)(2)     // ƒ collect
add(1)(2)(3)  // 6`

const usageCode = `// 参数复用：把「每次都要传」的前置参数固定下来
function discount(rate, price) {
  return (rate * price).toFixed(2)
}

const vip = curry(discount)(0.8)     // 固定 8 折
vip(199)   // '159.20'
vip(599)   // '479.20'

// 日志前缀同理
function log(level, time, msg) {
  console.log(\`[\${level}] \${time} \${msg}\`)
}
const error = curry(log)('ERROR')
const today = error(new Date().toLocaleDateString())
today('接口挂了')   // [ERROR] 2026/9/29 接口挂了`
</script>

<style scoped>
.curry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
    align-items: start;
}

.curry-panel {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 12px;
}

.args-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 34px;
    align-items: center;
}

.arg-chip {
    font-size: 11px;
    padding: 3px 8px;
    border: 1px solid var(--brand);
    color: var(--brand);
    background: var(--surface);
}

.arg-chip.is-pending {
    border: 1px dashed var(--hairline);
    color: var(--text-tertiary);
    background: transparent;
}

.progress-bar {
    height: 2px;
    margin: 12px 0 6px;
    background: var(--hairline);
}

.progress-fill {
    display: block;
    height: 100%;
    background: var(--brand);
    transition: width 0.2s;
}

.progress-text {
    margin: 0 0 12px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.param-btns {
    gap: 8px;
}

.param-btns .w-btn {
    flex: 1 1 auto;
}

/* ── 调用链 ─────────────────────────────────────────── */
.call-chain {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 96px;
    padding: 8px 10px;
    margin-bottom: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.chain-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
    font-size: 11px;
}

.chain-call {
    flex: none;
    color: var(--text-tertiary);
}

.chain-arrow {
    color: var(--text-tertiary);
}

.chain-result {
    color: var(--text-secondary);
}

.chain-result.is-fn {
    color: var(--warning);
}

.chain-result.is-value {
    color: var(--success);
}

.chain-final {
    margin-bottom: 12px;
}

.reset-btn {
    width: 100%;
    text-align: center;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
