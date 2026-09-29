<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Async / Await</span>
                    <h2 class="panel__title">Generator 的语法糖，Promise 的执行器</h2>
                </div>
                <span class="panel__meta">写起来像同步，跑起来还是异步</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>async</code> 函数返回一个 Promise；<code>await</code> 会<em>暂停当前函数</em>、
                    把后面的代码包成微任务推入队列，等 Promise 落定再恢复执行 —— 这和
                    <code>Generator</code> 的 <code>yield</code> 是同一个套路，只是有人替你按 <code>next()</code>。
                    代价是：<em>写 await 很容易不小心串行化</em>，明明能并行的事被拖成累加。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">本质</span>
                        <span class="point__v">await 之后的代码 = then 的回调 = 微任务</span>
                    </div>
                    <div class="point">
                        <span class="point__k">陷阱</span>
                        <span class="point__v">连续 await 会串行执行，耗时直接相加</span>
                    </div>
                    <div class="point">
                        <span class="point__k">取舍</span>
                        <span class="point__v">互相依赖只能串行，彼此独立就用 Promise.all</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 串行 vs 并行 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Benchmark</span>
                    <h2 class="panel__title">三个互不依赖的请求</h2>
                </div>
                <span class="panel__meta">同样的事，排着队做和同时做差了一倍多</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy" @click="runSerial">
                            {{ busy ? '跑着呢……' : '串行 await' }}
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="runParallel">
                            并行 Promise.all
                        </button>
                    </div>
                    <span class="w-hint">
                        三个任务分别耗时 {{ TASKS.map((t) => t.ms).join(' / ') }} ms
                    </span>
                </div>

                <div class="gantt">
                    <div v-for="(r, i) in runs" :key="r.name" class="gantt__row">
                        <span class="gantt__name mono">{{ r.name }}</span>
                        <div class="gantt__lane">
                            <span
                                class="gantt__bar"
                                :class="{ 'is-done': r.end !== null }"
                                :style="barStyle(r, i)">
                                <span v-if="r.end !== null" class="gantt__label mono">
                                    {{ Math.round(r.end - r.start) }} ms
                                </span>
                            </span>
                        </div>
                    </div>
                    <p v-if="!runs.length" class="queue__empty gantt__empty">点上面的按钮开始计时</p>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">串行总耗时</h3>
                            <span class="card__tag is-bad">累加</span>
                        </div>
                        <div class="big-num mono">{{ serialMs ? serialMs + ' ms' : '—' }}</div>
                    </article>
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">并行总耗时</h3>
                            <span class="card__tag is-good">取最长</span>
                        </div>
                        <div class="big-num mono">{{ parallelMs ? parallelMs + ' ms' : '—' }}</div>
                    </article>
                    <article class="card" v-if="serialMs && parallelMs">
                        <div class="card__head">
                            <h3 class="card__title">省下来</h3>
                            <span class="card__tag is-good">{{ savedPercent }}%</span>
                        </div>
                        <div class="big-num mono">{{ serialMs - parallelMs }} ms</div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">把糖拆开看看里面</h2>
                </div>
                <span class="panel__meta">上面的对比就是这两种写法</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">串行 vs 并行</div>
                    <CodeEditor :code="runCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">asyncToGenerator · await 的最小原理</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">错误处理：别让一个失败拖垮全部</div>
                    <CodeEditor :code="errCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Task = { name: string; ms: number }
type Run = { name: string; start: number; end: number | null }

const TASKS: Task[] = [
    { name: '请求用户信息', ms: 700 },
    { name: '请求订单列表', ms: 500 },
    { name: '请求推荐位', ms: 600 },
]

const runs = ref<Run[]>([])
const busy = ref(false)
const serialMs = ref(0)
const parallelMs = ref(0)

const savedPercent = computed(() =>
    serialMs.value ? Math.round(((serialMs.value - parallelMs.value) / serialMs.value) * 100) : 0,
)

const maxMs = computed(() => Math.max(...runs.value.map((r) => r.end ?? 0), 1))

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function barStyle(r: Run, i: number) {
    return {
        left: `${(r.start / maxMs.value) * 100}%`,
        width: `${((r.end === null ? Date.now() - windowStart : r.end - r.start) / maxMs.value) * 100}%`,
        background: TASKS[i]?.name === r.name ? 'var(--brand)' : 'var(--brand)',
    }
}

let windowStart = 0

async function runSerial() {
    busy.value = true
    runs.value = TASKS.map((t) => ({ name: t.name, start: 0, end: null }))
    const t0 = performance.now()
    windowStart = Date.now()

    for (let i = 0; i < TASKS.length; i++) {
        const start = performance.now() - t0
        await sleep(TASKS[i].ms)
        const end = performance.now() - t0
        runs.value = runs.value.map((r, idx) => (idx === i ? { ...r, start, end } : r))
    }

    serialMs.value = Math.round(performance.now() - t0)
    busy.value = false
}

async function runParallel() {
    busy.value = true
    runs.value = TASKS.map((t) => ({ name: t.name, start: 0, end: null }))
    const t0 = performance.now()
    windowStart = Date.now()

    await Promise.all(
        TASKS.map(async (task, i) => {
            const start = performance.now() - t0
            await sleep(task.ms)
            const end = performance.now() - t0
            runs.value = runs.value.map((r, idx) => (idx === i ? { ...r, start, end } : r))
        }),
    )

    parallelMs.value = Math.round(performance.now() - t0)
    busy.value = false
}

/* ── 展示用源码 ───────────────────────────────────────── */
const runCode = `const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ① 串行：一个接一个，总耗时是三者之和（≈ 1800ms）
async function serial() {
  const a = await sleep(700)
  const b = await sleep(500)     // 必须等 a 完事
  const c = await sleep(600)
  return [a, b, c]
}

// ② 并行：同时发起，总耗时取最长的那个（≈ 700ms）
async function parallel() {
  const [a, b, c] = await Promise.all([
    sleep(700),
    sleep(500),
    sleep(600)
  ])
  return [a, b, c]
}

// ③ 有依赖就只能串行：后一个请求需要前一个的结果
async function chained() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)   // 这个 await 没法并行
  return orders
}`

const implCode = `// async/await 的本质：Generator + 自动调用 next 的执行器
// 下面这段会把 async 函数「翻译」成 Generator 版本
function asyncToGenerator(generatorFn) {
  return function (...args) {
    const gen = generatorFn.apply(this, args)

    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let result
        try {
          result = gen[key](arg)          // 相当于 await 处恢复执行
        } catch (err) {
          return reject(err)              // 抛错 = reject
        }

        const { value, done } = result
        if (done) {
          return resolve(value)           // 跑完了，把 return 的值交给外层
        }
        // value 是个 Promise，等它好了再把结果丢回生成器，继续下一步
        return Promise.resolve(value).then(
          (v) => step('next', v),
          (e) => step('throw', e)
        )
      }

      step('next')
    })
  }
}

// 用法：这就是 await 的雏形
const run = asyncToGenerator(function* () {
  const a = yield sleep(700)
  const b = yield sleep(500)
  return a + b
})`

const errCode = `// ① 串行写法里，中间任何一个抛错都会中断后续逻辑
async function risky() {
  try {
    const a = await fetchA()
    const b = await fetchB()      // 这里挂了，下面就不跑了
    return [a, b]
  } catch (err) {
    console.log('任意一个失败就走这里', err)
  }
}

// ② 想「部分失败也继续」，用 allSettled
const results = await Promise.allSettled([fetchA(), fetchB()])
const ok = results
  .filter((r) => r.status === 'fulfilled')
  .map((r) => r.value)

// ③ 给每个 promise 单独兜底，最省事
const safe = Promise.all([
  fetchA().catch(() => null),
  fetchB().catch(() => null)
])

// ④ 顶层 await 没有 try/catch 会变成 unhandledrejection
window.addEventListener('unhandledrejection', (e) => {
  console.error('漏掉的 Promise 异常：', e.reason)
})`
</script>

<style scoped>
.gantt {
    display: grid;
    gap: 6px;
    padding: 12px;
    margin-bottom: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.gantt__row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.gantt__name {
    flex: none;
    width: 108px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.gantt__lane {
    position: relative;
    flex: 1;
    height: 20px;
    background: var(--surface);
    border: 1px solid var(--hairline);
}

.gantt__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    min-width: 2px;
    background: var(--brand);
    opacity: 0.85;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 4px;
    transition: width 0.15s linear;
}

.gantt__bar.is-done {
    opacity: 1;
}

.gantt__label {
    font-size: 10px;
    color: var(--surface);
    mix-blend-mode: difference;
}

.gantt__empty {
    padding: 6px 0;
}

.big-num {
    font-size: 22px;
    color: var(--brand);
    line-height: 1.2;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
