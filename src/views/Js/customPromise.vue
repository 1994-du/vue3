<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Promise</span>
                    <h2 class="panel__title">一个不可逆的状态机</h2>
                </div>
                <span class="panel__meta">pending → fulfilled / rejected，落定后再也回不去</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    Promise 的全部秘密就三件事：<em>状态</em>、<em>回调队列</em>、<em>then 返回新 Promise</em>。
                    状态只有 <code>pending</code> / <code>fulfilled</code> / <code>rejected</code> 三种，
                    一旦不是 pending 就<strong>永远定型</strong>；异步还没结果时调用 <code>then</code>，
                    回调会被存进队列，等落定那一刻再统一执行。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">状态</span>
                        <span class="point__v">resolve 或 reject 只认第一次，之后再调用直接忽略</span>
                    </div>
                    <div class="point">
                        <span class="point__k">队列</span>
                        <span class="point__v">pending 期间的 then 回调先存着，settle 后按注册顺序执行</span>
                    </div>
                    <div class="point">
                        <span class="point__k">链式</span>
                        <span class="point__v">then 必须返回新 Promise，才能一直往下 .then</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 状态机演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">亲自把状态推一遍</h2>
                </div>
                <span class="panel__meta">下面跑的是一个真实可用的简化实现</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="create">新建 Promise</button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="registerThen">
                            注册 then 回调
                        </button>
                        <button type="button" class="w-btn" :disabled="state !== 'pending'" @click="doResolve">
                            resolve('搞定')
                        </button>
                        <button type="button" class="w-btn" :disabled="state !== 'pending'" @click="doReject">
                            reject('报错了')
                        </button>
                    </div>
                </div>

                <div class="pm-grid">
                    <!-- 状态机 -->
                    <div class="pm-box">
                        <div class="code-block__label">状态</div>
                        <div class="sm">
                            <div class="sm__node" :class="{ 'is-on': state === 'pending' }">
                                <span class="sm__name mono">pending</span>
                                <span class="sm__sub">等待中</span>
                            </div>
                            <div class="sm__links">
                                <span class="sm__link" :class="{ 'is-on': state === 'fulfilled' }">resolve ↓</span>
                                <span class="sm__link" :class="{ 'is-on': state === 'rejected' }">reject ↓</span>
                            </div>
                            <div class="sm__branch">
                                <div class="sm__node is-end" :class="{ 'is-on': state === 'fulfilled' }">
                                    <span class="sm__name mono">fulfilled</span>
                                    <span class="sm__sub">{{ state === 'fulfilled' ? String(value) : '—' }}</span>
                                </div>
                                <div class="sm__node is-end" :class="{ 'is-on': state === 'rejected' }">
                                    <span class="sm__name mono">rejected</span>
                                    <span class="sm__sub">{{ state === 'rejected' ? String(value) : '—' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="res-row sm-res">
                            <span class="res-k">终值</span>
                            <span class="res-v mono">{{ settled ? String(value) : '尚未落定' }}</span>
                        </div>
                    </div>

                    <!-- 回调队列 -->
                    <div class="pm-box">
                        <div class="code-block__label">回调队列（{{ queueLength }} 个在排队）</div>
                        <div class="queue-box">
                            <span v-for="i in queueLength" :key="i" class="queue-chip mono">then · #{{ i }}</span>
                            <span v-if="!queueLength" class="queue__empty">空的 —— pending 时注册的回调才会排在这里</span>
                        </div>
                        <div class="code-block__label mt">执行日志</div>
                        <div class="log-box">
                            <span v-for="(l, i) in logs" :key="i" class="log-line mono" :class="l.kind">
                                {{ l.text }}
                            </span>
                            <span v-if="!logs.length" class="queue__empty">先点「新建 Promise」</span>
                        </div>
                    </div>
                </div>

                <p class="pm-tip">
                    试试这个顺序：新建 → 注册两个 then → resolve，
                    再点 reject（会被无情忽略）；或者先 resolve，再注册 then（回调会立刻异步触发）。
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">能跑起来的那一版</h2>
                </div>
                <span class="panel__meta">上面演示的就是这段代码</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">MyPromise · 状态 + 队列 + then</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">完整版还要处理：then 的返回值穿透（Promise Resolution Procedure）</div>
                    <CodeEditor :code="fullCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type State = 'pending' | 'fulfilled' | 'rejected'
type Callback = () => void

/*  一个能真实运行的简化版 Promise。
    关键三处：状态不可回退、回调先入队、then 回来新实例。 */
class MiniPromise {
    state: State = 'pending'
    value: unknown = undefined
    callbacks: Callback[] = []

    settle(next: State, value: unknown) {
        if (this.state !== 'pending') return // ① 状态一旦落定就不再变
        this.state = next
        this.value = value
        // 用微任务模拟「settle 之后才统一跑回调」
        queueMicrotask(() => {
            const queued = this.callbacks.slice()
            this.callbacks = []
            queued.forEach((fn) => fn())
        })
    }

    then(onFulfilled?: (v: unknown) => void, onRejected?: (v: unknown) => void) {
        const cb: Callback = () => {
            if (this.state === 'fulfilled') onFulfilled?.(this.value)
            if (this.state === 'rejected') onRejected?.(this.value)
        }

        if (this.state === 'pending') {
            this.callbacks.push(cb) // ② 还没结果，先存着
        } else {
            queueMicrotask(cb) // ③ 已经落定，直接异步执行
        }
    }
}

const state = ref<State>('pending')
const value = ref<unknown>(undefined)
const settled = ref(false)
const queueLength = ref(0)
const logs = ref<{ text: string; kind: string }[]>([])
const ready = ref(false)

let instance: MiniPromise | null = null

function syncState() {
    if (!instance) {
        state.value = 'pending'
        value.value = undefined
        settled.value = false
        queueLength.value = 0
        ready.value = false
        return
    }
    ready.value = true
    state.value = instance.state
    value.value = instance.value
    settled.value = instance.state !== 'pending'
    queueLength.value = instance.callbacks.length
}

function create() {
    instance = new MiniPromise()
    logs.value = [{ text: "new MyPromise() → state = 'pending'", kind: 'is-info' }]
    syncState()
}

function registerThen() {
    if (!instance) return
    instance.then(
        (v) => {
            logs.value = [...logs.value, { text: `then 收到成功值：${String(v)}`, kind: 'is-ok' }]
            syncState()
        },
        (v) => {
            logs.value = [...logs.value, { text: `then 收到失败原因：${String(v)}`, kind: 'is-bad' }]
            syncState()
        },
    )
    const n = instance.callbacks.length
    logs.value = [
        ...logs.value,
        {
            text: instance.state === 'pending' ? `注册第 ${n} 个 then → 回调入队` : '已落定 → 回调直接排微任务执行',
            kind: 'is-info',
        },
    ]
    syncState()
}

function doResolve() {
    if (!instance) return
    const before = instance.state
    instance.settle('fulfilled', '搞定')
    if (before === 'pending') {
        logs.value = [...logs.value, { text: "resolve('搞定') → pending 变 fulfilled", kind: 'is-ok' }]
    }
    syncState()
}

function doReject() {
    if (!instance) return
    const before = instance.state
    instance.settle('rejected', '报错了')
    if (before === 'pending') {
        logs.value = [...logs.value, { text: "reject('报错了') → pending 变 rejected", kind: 'is-bad' }]
    } else {
        logs.value = [
            ...logs.value,
            { text: `已经 ${before} 了，reject 被忽略 —— 状态不可逆`, kind: 'is-bad' },
        ]
    }
    syncState()
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `class MyPromise {
  constructor(executor) {
    this.state = 'pending'      // pending | fulfilled | rejected
    this.value = undefined
    this.callbacks = []         // pending 期间攒着的 then 回调

    const resolve = (value) => { this.settle('fulfilled', value) }
    const reject = (reason) => { this.settle('rejected', reason) }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)               // 执行器抛错直接判失败
    }
  }

  settle(next, value) {
    if (this.state !== 'pending') return   // ★ 状态不可逆
    this.state = next
    this.value = value

    queueMicrotask(() => {                 // 标准里是微任务
      const queued = this.callbacks.slice()
      this.callbacks = []
      queued.forEach((fn) => fn())
    })
  }

  then(onFulfilled, onRejected) {
    const cb = () => {
      if (this.state === 'fulfilled') onFulfilled?.(this.value)
      if (this.state === 'rejected')  onRejected?.(this.value)
    }

    if (this.state === 'pending') {
      this.callbacks.push(cb)              // 没结果就先排队
    } else {
      queueMicrotask(cb)                   // 已落定就直接异步跑
    }
  }
}`

const fullCode = `// 完整版最关键的一步：处理 then 返回值的穿透
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('不能返回自己'))   // 循环引用
  }

  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let called = false
    try {
      const then = x.then                          // 取 then 可能抛错
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => { if (called) return; called = true; resolvePromise(promise2, y, resolve, reject) },
          (e) => { if (called) return; called = true; reject(e) }
        )
      } else {
        resolve(x)                                 // 普通对象/函数直接当成功值
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)                                     // 基本类型
  }
}`
</script>

<style scoped>
.pm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
    align-items: start;
}

.pm-box {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 12px;
}

.mt {
    margin-top: 14px;
}

/* ── 状态机图 ─────────────────────────────────────────── */
.sm {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}

.sm__node {
    min-width: 132px;
    padding: 8px 12px;
    text-align: center;
    border: 1px solid var(--hairline);
    background: var(--surface);
    transition: border-color 0.2s, background 0.2s;
}
.sm__node.is-on {
    border-color: var(--brand);
    background: var(--brand-soft);
}
.sm__node.is-end {
    flex: 1;
}

.sm__name {
    display: block;
    font-size: 12px;
    color: var(--text-primary);
}
.sm__node.is-on .sm__name {
    color: var(--brand);
}
.sm__sub {
    display: block;
    margin-top: 3px;
    font-size: 11px;
    color: var(--text-tertiary);
    word-break: break-all;
}

.sm__links {
    display: flex;
    gap: 24px;
}
.sm__link {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
}
.sm__link.is-on {
    color: var(--success);
}

.sm__branch {
    display: flex;
    gap: 12px;
    width: 100%;
}

.sm-res {
    padding-top: 10px;
    border-top: 1px solid var(--hairline);
}

/* ── 队列 / 日志 ─────────────────────────────────────── */
.queue-box,
.log-box {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 62px;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}
.queue-box {
    flex-direction: row;
    flex-wrap: wrap;
}

.queue-chip {
    font-size: 11px;
    padding: 2px 8px;
    border: 1px solid var(--warning);
    color: var(--warning);
}

.log-line {
    font-size: 11px;
    color: var(--text-secondary);
}
.log-line.is-ok {
    color: var(--success);
}
.log-line.is-bad {
    color: var(--danger);
}
.log-line.is-info {
    color: var(--text-secondary);
}

.pm-tip {
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
