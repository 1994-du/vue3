<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Promise</span>
                    <h2 class="panel__title">一个「结果还没到」的占位符</h2>
                </div>
                <span class="panel__meta">单向不可逆，pending → fulfilled / rejected</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    Promise 解决的是回调地狱，但更准确地说是<em>把异步结果变成了一个可以传递、可以组合的值</em>。
                    它有三种状态：<code>pending</code> 进行中、<code>fulfilled</code> 已成功、<code>rejected</code> 已失败。
                    关键约束是<strong>状态只能改一次、不可逆</strong> —— resolve 之后再 reject 也不会有任何效果。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">then 返回新的 Promise</span>
                        <span class="point__v">所以能链式调用；返回值会作为下一环的入参</span>
                    </div>
                    <div class="point">
                        <span class="point__k">错误穿透</span>
                        <span class="point__v">链上任何一环 reject，都会跳到最近的 catch，中间 then 全部跳过</span>
                    </div>
                    <div class="point">
                        <span class="point__k">微任务</span>
                        <span class="point__v">回调进入微任务队列，在本轮同步代码跑完、渲染之前执行</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 并发方法对比 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">四个任务并发跑，五种写法结果完全不同</h2>
                </div>
                <span class="panel__meta">真实计时，真实 reject</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    下面有 {{ tasks.length }} 个任务，各自耗时不同，其中有一个会失败。
                    选一种并发方法按下运行 —— 同样是「等它们跑完」，<strong>有的会直接抛错，有的会把失败也当成结果收好</strong>。
                </p>

                <div class="task-cfg">
                    <div v-for="t in tasks" :key="t.id" class="task-cfg__row">
                        <span class="task-cfg__name mono">{{ t.label }}</span>
                        <input v-model.number="t.ms" type="range" min="100" max="2000" step="100" class="cfg__range">
                        <span class="task-cfg__ms mono">{{ t.ms }} ms</span>
                        <button type="button" class="w-btn" :class="t.ok ? '' : 'is-bad-mode'" @click="t.ok = !t.ok">
                            {{ t.ok ? '成功 ✔' : '失败 ✘' }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="m in methods" :key="m.key" type="button" class="w-btn"
                            :class="method === m.key ? 'is-active' : ''" :disabled="running" @click="method = m.key">
                            {{ m.label }}
                        </button>
                    </div>
                    <span class="w-hint">{{ currentMethod.desc }}</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="running" @click="run">▶ 开始并发</button>
                        <button type="button" class="w-btn" @click="clearRun">清空结果</button>
                    </div>
                    <span class="w-hint">耗时 {{ elapsed }} ms</span>
                </div>

                <!-- 任务条 -->
                <div class="bars">
                    <div v-for="t in tasks" :key="t.id" class="bar">
                        <span class="bar__name mono">{{ t.label }}</span>
                        <div class="bar__track">
                            <i :style="{ width: barPct(t) + '%' }" :class="barClass(t)"></i>
                        </div>
                        <span class="bar__state mono">{{ barText(t) }}</span>
                    </div>
                </div>

                <!-- 结论 -->
                <div class="verdict" :class="'is-' + verdictKind">
                    <div class="verdict__status mono">{{ verdictTitle }}</div>
                    <div class="verdict__meta">
                        <span>总耗时：<b class="mono">{{ elapsed }} ms</b></span>
                        <span>结算方式：<b>{{ currentMethod.settle }}</b></span>
                    </div>
                    <div class="log-list">
                        <div v-for="(l, i) in outLog" :key="i" class="log-item" :class="l.bad ? 'is-bad' : 'is-ok'">
                            <span class="log-item__idx">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="log-item__body mono">{{ l.text }}</span>
                        </div>
                        <div v-if="!outLog.length" class="log-empty">点「开始并发」查看结算过程</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 登录失效场景 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">token 过期时，五个请求一起回来 401</h2>
                </div>
                <span class="panel__meta">这是每个前端迟早要写的一段代码</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    真实场景：页面一打开同时发了 {{ reqCount }} 个请求，token 刚好过期，于是它们<strong>全部返回 401</strong>。
                    教科书式的写法会让每个请求各自去刷新 token —— 结果是刷了 {{ reqCount }} 次，
                    而且<em>先刷出来的那份立刻被后面刷出来的顶掉</em>，后面的请求拿着作废的 token 继续 401。
                    点下面的按钮，看两种写法差在哪。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="!lockMode ? 'is-active' : ''"
                            :disabled="busy401" @click="lockMode = false">写法 A：各自刷新</button>
                        <button type="button" class="w-btn" :class="lockMode ? 'is-active' : ''"
                            :disabled="busy401" @click="lockMode = true">写法 B：共享一把锁</button>
                    </div>
                    <span class="w-hint">{{ lockMode ? '所有 401 共用同一个刷新 Promise' : '每个 401 都自己发一次刷新' }}</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy401" @click="runAuth">
                            ▶ 模拟 {{ reqCount }} 个并发请求全部 401
                        </button>
                        <button type="button" class="w-btn" @click="resetAuth(true)">重置</button>
                    </div>
                    <span class="w-hint">服务端 token 版本：v{{ tokenVersion }}</span>
                </div>

                <div class="stat-grid">
                    <div class="stat">
                        <span class="stat__label">刷新 token 次数</span>
                        <span class="stat__value" :class="refreshCount > 1 ? 'is-bad' : 'is-ok'">
                            {{ refreshCount }}
                        </span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">重放成功的请求</span>
                        <span class="stat__value is-ok">{{ replayOk }} / {{ reqCount }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">最终仍失败</span>
                        <span class="stat__value" :class="replayFail ? 'is-bad' : ''">{{ replayFail }}</span>
                    </div>
                </div>

                <div class="log-list">
                    <div v-for="(l, i) in authLog" :key="i" class="log-item" :class="l.bad ? 'is-bad' : l.warn ? 'is-warn' : 'is-ok'">
                        <span class="log-item__idx">{{ String(i + 1).padStart(2, '0') }}</span>
                        <span class="log-item__body mono">{{ l.text }}</span>
                    </div>
                    <div v-if="!authLog.length" class="log-empty">还没有运行</div>
                </div>

                <p class="probe-note">
                    写法 A 的隐患不止「多刷几次」：<strong>刷新 token 通常是一次性的</strong>（旧 token 用完即废）。
                    第一次刷新成功后服务端就把旧 token 作废了，第二个请求拿旧 token 去刷往往会直接失败 —— 线上表现为
                    「偶发被踢到登录页」。所以必须用一把锁，让并发的 401 <em>排队等同一份结果</em>。
                </p>
            </div>
        </section>

        <!-- ④ 对照表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">到底该用哪个</h2>
                </div>
                <span class="panel__meta">唯一的问题是：某个失败了你打算怎么办</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article v-for="c in compareCards" :key="c.name" class="card">
                        <div class="card__head">
                            <h3 class="card__title mono">{{ c.name }}</h3>
                            <span class="card__tag">{{ c.tag }}</span>
                        </div>
                        <p class="card__desc">{{ c.desc }}</p>
                        <div class="res-row">
                            <span class="res-k">何时用它</span>
                            <span class="res-v">{{ c.when }}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">可以直接抄的两段</h2>
                </div>
                <span class="panel__meta">刷新的那把锁，和一个并发池</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">无感刷新：共享同一个 refreshing Promise</div>
                    <CodeEditor :code="refreshCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">并发池：限制同时发出的请求数</div>
                    <CodeEditor :code="poolCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

/* ── 工具 ────────────────────────────────────────────── */
function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms))
}

/* ── 实验一：并发方法对比 ────────────────────────────── */
type TaskDef = {
    id: number
    label: string
    ms: number
    ok: boolean
    value: string
    reason: string
}

const tasks = ref<TaskDef[]>([
    { id: 1, label: '/api/users', ms: 600, ok: true, value: '{ count: 24 }', reason: 'users: 500' },
    { id: 2, label: '/api/roles', ms: 300, ok: true, value: '{ count: 5 }', reason: 'roles: 500' },
    { id: 3, label: '/api/logs', ms: 900, ok: false, value: '{ count: 90 }', reason: 'logs: 403 无权限' },
    { id: 4, label: '/api/menus', ms: 1200, ok: true, value: '{ count: 12 }', reason: 'menus: 500' },
])

type RunState = {
    start: number
    end: number | null
    settled: boolean
    ok: boolean
}

const runStates = ref<Record<number, RunState>>({})
const nowTick = ref(0)
let tickTimer: number | null = null

type MethodKey = 'all' | 'allSettled' | 'race' | 'any' | 'allCaught'

const methods: { key: MethodKey; label: string; desc: string; settle: string }[] = [
    { key: 'all', label: 'Promise.all', desc: '全成功才成功，一个失败就整体失败', settle: '最快失败即结算' },
    { key: 'allSettled', label: 'Promise.allSettled', desc: '永远成功，把每个结果连状态一起收好', settle: '等全部结束' },
    { key: 'race', label: 'Promise.race', desc: '谁先出结果就用谁，失败也会赢', settle: '第一个结算' },
    { key: 'any', label: 'Promise.any', desc: '第一个成功的；全失败才抛 AggregateError', settle: '第一个成功' },
    { key: 'allCaught', label: 'all + 自己兜底', desc: '每个任务先 catch 成统一形状，再 all', settle: '等全部结束' },
]

const method = ref<MethodKey>('all')
const currentMethod = computed(() => methods.find((m) => m.key === method.value)!)

const running = ref(false)
const elapsed = ref(0)
const outLog = ref<{ text: string; bad: boolean }[]>([])
const verdictKind = ref<'idle' | 'ok' | 'bad'>('idle')
const verdictTitle = ref('待运行')

function barPct(t: TaskDef): number {
    const s = runStates.value[t.id]
    if (!s) return 0
    const dur = s.end !== null ? s.end - s.start : nowTick.value - s.start
    return Math.min(100, Math.round((dur / t.ms) * 100))
}

function barClass(t: TaskDef): string {
    const s = runStates.value[t.id]
    if (!s || !s.settled) return 'is-running'
    return s.ok ? 'is-ok' : 'is-bad'
}

function barText(t: TaskDef): string {
    const s = runStates.value[t.id]
    if (!s) return '—'
    if (!s.settled) return 'pending…'
    return `${s.end! - s.start}ms ${s.ok ? 'fulfilled' : 'rejected'}`
}

function taskPromise(t: TaskDef): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (t.ok) resolve(t.value)
            else reject(new Error(t.reason))
        }, t.ms)
    })
}

async function run() {
    running.value = true
    verdictKind.value = 'idle'
    verdictTitle.value = '运行中…'
    outLog.value = []
    elapsed.value = 0
    runStates.value = {}

    const t0 = performance.now()
    tasks.value.forEach((t) => {
        runStates.value[t.id] = { start: performance.now(), end: null, settled: false, ok: false }
    })

    // 进度条驱动
    if (tickTimer !== null) clearInterval(tickTimer)
    tickTimer = window.setInterval(() => {
        nowTick.value = performance.now()
    }, 30)

    const ps = tasks.value.map(async (t) => {
        try {
            const v = await taskPromise(t)
            const s = runStates.value[t.id]
            s.end = performance.now()
            s.settled = true
            s.ok = true
            return { t, ok: true as const, v }
        } catch (e) {
            const s = runStates.value[t.id]
            s.end = performance.now()
            s.settled = true
            s.ok = false
            return { t, ok: false as const, v: (e as Error).message }
        }
    })

    const totalStart = t0

    if (method.value === 'all') {
        try {
            const values = await Promise.all(tasks.value.map(taskPromise))
            elapsed.value = Math.round(performance.now() - totalStart)
            verdictKind.value = 'ok'
            verdictTitle.value = 'fulfilled'
            values.forEach((v, i) => outLog.value.push({ text: `[${i}] ${tasks.value[i].label} → ${v}`, bad: false }))
        } catch (e) {
            elapsed.value = Math.round(performance.now() - totalStart)
            verdictKind.value = 'bad'
            verdictTitle.value = 'rejected（整个 Promise 立即失败）'
            outLog.value.push({ text: `✘ ${(e as Error).message}`, bad: true })
            outLog.value.push({
                text: '注意：失败发生时其余任务仍在后台跑完，只是它们的成果被丢弃了',
                bad: true,
            })
        }
    } else if (method.value === 'allSettled') {
        const res = await Promise.all(ps)
        elapsed.value = Math.round(performance.now() - totalStart)
        verdictKind.value = 'ok'
        verdictTitle.value = 'fulfilled（永远不会 reject）'
        res.forEach((r) =>
            outLog.value.push({
                text: `${r.t.label} → ${r.ok ? 'fulfilled ' + r.v : 'rejected ' + r.v}`,
                bad: !r.ok,
            }),
        )
    } else if (method.value === 'race') {
        const winner = await Promise.race(ps)
        elapsed.value = Math.round(performance.now() - totalStart)
        verdictKind.value = winner.ok ? 'ok' : 'bad'
        verdictTitle.value = winner.ok ? `fulfilled（赢家 ${winner.t.label}）` : `rejected（赢家 ${winner.t.label}）`
        outLog.value.push({
            text: `胜出：${winner.t.label} ${winner.ok ? '→ ' + winner.v : '→ 抛 ' + winner.v}`,
            bad: !winner.ok,
        })
        outLog.value.push({ text: '其余结果被忽略，但它们仍在继续跑', bad: false })
    } else if (method.value === 'any') {
        try {
            const v = await Promise.any(tasks.value.map(taskPromise))
            elapsed.value = Math.round(performance.now() - totalStart)
            verdictKind.value = 'ok'
            verdictTitle.value = 'fulfilled（第一个成功的）'
            outLog.value.push({ text: `第一个成功的结果：${v}`, bad: false })
        } catch (e) {
            elapsed.value = Math.round(performance.now() - totalStart)
            verdictKind.value = 'bad'
            verdictTitle.value = 'rejected AggregateError'
            const agg = e as AggregateError
            outLog.value.push({ text: `所有任务都失败了，共 ${agg.errors?.length ?? 0} 个原因`, bad: true })
            ;(agg.errors ?? []).forEach((err: Error, i: number) =>
                outLog.value.push({ text: `  [${i}] ${err.message}`, bad: true }),
            )
        }
    } else {
        const res = await Promise.all(ps)
        elapsed.value = Math.round(performance.now() - totalStart)
        verdictKind.value = 'ok'
        verdictTitle.value = 'fulfilled（失败已被消化成数据）'
        res.forEach((r) =>
            outLog.value.push({
                text: `${r.t.label} → ${r.ok ? 'ok ' + r.v : 'err ' + r.v}`,
                bad: !r.ok,
            }),
        )
    }

    if (tickTimer !== null) {
        clearInterval(tickTimer)
        tickTimer = null
    }
    running.value = false
}

function clearRun() {
    runStates.value = {}
    outLog.value = []
    elapsed.value = 0
    verdictTitle.value = '待运行'
    verdictKind.value = 'idle'
}

/* ── 实验二：token 过期并发刷新 ──────────────────────── */
const reqCount = 5
const lockMode = ref(false)
const busy401 = ref(false)
const tokenVersion = ref(1)
const refreshCount = ref(0)
const replayOk = ref(0)
const replayFail = ref(0)
const authLog = ref<{ text: string; bad: boolean; warn?: boolean }[]>([])

let currentToken = 'token-v1'
let sharedRefresh: Promise<string> | null = null

function pushLog(text: string, bad = false, warn = false) {
    authLog.value = [...authLog.value, { text, bad, warn }]
}

async function doRefresh(label: string): Promise<string> {
    refreshCount.value += 1
    pushLog(`${label} 发起刷新 token（第 ${refreshCount.value} 次）`, false, true)
    await sleep(700)
    tokenVersion.value += 1
    currentToken = `token-v${tokenVersion.value}`
    pushLog(`${label} 刷新成功 → ${currentToken}`, false)
    return currentToken
}

/** 写法 A：各自刷新 —— 谁 401 谁自己去刷 */
async function naiveRequest(i: number): Promise<void> {
    const label = `#${i}`
    await sleep(150 + i * 40)
    pushLog(`${label} 请求 → 401 token 失效`, true)
    try {
        await doRefresh(label)
        await sleep(120)
        // 模拟：旧 token 已被后面的刷新顶掉，这里仍可能失败
        if (Math.random() < 0.5) {
            replayOk.value += 1
            pushLog(`${label} 用新 token 重放成功`, false)
        } else {
            replayFail.value += 1
            pushLog(`${label} 重放仍失败：手里的 token 已被后来的刷新作废`, true)
        }
    } catch {
        replayFail.value += 1
    }
}

/** 写法 B：共享同一把锁 */
async function lockedRequest(i: number): Promise<void> {
    const label = `#${i}`
    await sleep(150 + i * 40)
    pushLog(`${label} 请求 → 401 token 失效`, true)

    if (!sharedRefresh) {
        // 第一个到的负责真刷新，其他人 await 同一个 Promise
        sharedRefresh = doRefresh(label)
        try {
            await sharedRefresh
        } finally {
            sharedRefresh = null
        }
    } else {
        pushLog(`${label} 已有刷新在进行，挂起等待同一个 Promise`, false)
        await sharedRefresh
    }

    await sleep(80)
    replayOk.value += 1
    pushLog(`${label} 拿到 ${currentToken} 后重放成功`, false)
}

async function runAuth() {
    busy401.value = true
    resetAuth(false)
    const jobs = Array.from({ length: reqCount }, (_, i) =>
        lockMode.value ? lockedRequest(i + 1) : naiveRequest(i + 1),
    )
    await Promise.allSettled(jobs)
    pushLog(
        `结束：刷新 ${refreshCount.value} 次，成功重放 ${replayOk.value}/${reqCount}，失败 ${replayFail.value}`,
        replayFail.value > 0 || refreshCount.value > 1,
    )
    busy401.value = false
}

function resetAuth(clearLog = true) {
    refreshCount.value = 0
    replayOk.value = 0
    replayFail.value = 0
    sharedRefresh = null
    if (clearLog) authLog.value = []
}

/* ── 对照卡 ──────────────────────────────────────────── */
const compareCards = [
    {
        name: 'Promise.all',
        tag: '全有或全无',
        desc: '全部成功才成功，一旦有一个 reject 整体立即 reject —— 但其余请求并不会被取消。',
        when: '多个结果缺一不可（如：首屏必须同时拿到用户和菜单）',
    },
    {
        name: 'Promise.allSettled',
        tag: '全都要',
        desc: '永远 fulfilled，结果数组里每项带 status: fulfilled | rejected。',
        when: '部分失败也不影响整体，想逐个看结果（如：批量上传、批量删除）',
    },
    {
        name: 'Promise.race',
        tag: '谁快用谁',
        desc: '第一个 settle 的结果决定一切 —— 注意：失败也会「胜出」。',
        when: '超时控制：把超时的 Promise 和真实请求 race 起来',
    },
    {
        name: 'Promise.any',
        tag: '第一个成功的',
        desc: '忽略失败，拿到第一个成功的结果；全部失败才抛 AggregateError。',
        when: '多个镜像源 / 备用节点，取最快可用的那个',
    },
    {
        name: 'all + map(catch)',
        tag: '最实用',
        desc: '先把每个任务的失败消化成 {ok, data} 形状，再 all —— 既等全部完成，又不会整体失败。',
        when: '业务里最常见的形态，推荐作为默认写法',
    },
]

/* ── 展示用源码 ─────────────────────────────────────── */
const refreshCode = `// 关键点：用一个模块级变量把「正在刷新」这件事锁住。
// 并发的多个 401 都 await 同一个 Promise，而不是各自发一次刷新。
import axios from 'axios'
import { getToken, setToken, clearAuth } from '@/utils/tokenManager'

let refreshing: Promise<string> | null = null

async function refreshToken(): Promise<string> {
  if (refreshing) return refreshing      // ← 已经在刷了，排队等这份结果

  refreshing = (async () => {
    const { data } = await axios.post('/api/auth/refresh', { refreshToken: getRefreshToken() })
    setToken(data.token)
    return data.token
  })()

  try {
    return await refreshing
  } finally {
    refreshing = null                    // ← 一定要在 finally 释放，否则后续 401 永远排队
  }
}

// 响应拦截器里
axios.interceptors.response.use(undefined, async (error) => {
  const cfg = error.config
  if (error.response?.status !== 401 || cfg._retry) {
    return Promise.reject(error)
  }
  cfg._retry = true                      // ← 防止重放再失败时无限循环
  const token = await refreshToken()
  cfg.headers.Authorization = \`Bearer \${token}\`
  return axios(cfg)                      // ← 重放原请求
})

// 什么时候才应该跳登录页？刷新也失败的时候：
// refreshToken 内部 catch 到失败 → clearAuth() → router.push('/login')`

const poolCode = `/** 限制并发数：一次最多跑 limit 个，跑完一个补一个 */
async function limitConcurrency<T>(
  items: (() => Promise<T>)[],
  limit = 4,
  onProgress?: (done: number, total: number) => void,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(items.length)
  let cursor = 0
  let done = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      const task = items[index]
      try {
        results[index] = { status: 'fulfilled', value: await task() }
      } catch (reason) {
        results[index] = { status: 'rejected', reason }
      } finally {
        done += 1
        onProgress?.(done, items.length)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// 用法：100 张图上传，同时只发 4 个
const r = await limitConcurrency(
  files.map((f) => () => upload(f)),
  4,
  (d, t) => console.log(\`\${d}/\${t}\`),
)
const failed = r.filter((x) => x.status === 'rejected')
console.log('失败的', failed.length)`

onBeforeUnmount(() => {
    if (tickTimer !== null) clearInterval(tickTimer)
})
</script>

<style lang="scss" scoped>
.task-cfg {
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.task-cfg__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
}

.task-cfg__name {
    flex-shrink: 0;
    min-width: 108px;
    font-size: 12px;
    color: var(--text-secondary);
}

.task-cfg__ms {
    min-width: 62px;
    font-size: 12px;
    color: var(--text-tertiary);
}

.cfg__range {
    flex: 1;
    max-width: 320px;
    accent-color: var(--brand);
}

.is-bad-mode {
    color: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 45%, transparent);
}

.bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

.bar {
    display: grid;
    grid-template-columns: 108px 1fr 150px;
    align-items: center;
    gap: 10px;
}

.bar__name {
    font-size: 11px;
    color: var(--text-secondary);
}

.bar__track {
    height: 10px;
    overflow: hidden;
    background: var(--surface-muted);
    border: 1px solid var(--hairline);

    i {
        display: block;
        height: 100%;
        transition: width 0.03s linear;

        &.is-running {
            background: color-mix(in srgb, var(--brand) 60%, transparent);
        }

        &.is-ok {
            background: var(--success);
        }

        &.is-bad {
            background: var(--danger);
        }
    }
}

.bar__state {
    font-size: 11px;
    text-align: right;
    color: var(--text-tertiary);
}

.verdict {
    padding: 12px 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);

    &.is-ok {
        border-color: color-mix(in srgb, var(--success) 55%, transparent);
        background: color-mix(in srgb, var(--success) 7%, var(--surface));
    }

    &.is-bad {
        border-color: color-mix(in srgb, var(--danger) 50%, transparent);
        background: color-mix(in srgb, var(--danger) 6%, var(--surface));
    }
}

.verdict__status {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.verdict__meta {
    display: flex;
    gap: 18px;
    margin: 8px 0 10px;
    font-size: 12px;
    color: var(--text-tertiary);

    b {
        color: var(--text-primary);
        font-weight: 500;
    }
}

.stat__value.is-ok {
    color: var(--success);
}

.stat__value.is-bad {
    color: var(--danger);
}

.log-item.is-warn .log-item__body {
    color: var(--warning);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}

@media (max-width: 820px) {
    .bar {
        grid-template-columns: 90px 1fr;
    }

    .bar__state {
        display: none;
    }
}
</style>
