<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Pub / Sub</span>
                    <h2 class="panel__title">发布者与订阅者互不相识</h2>
                </div>
                <span class="panel__meta">中间隔着一个事件中心，谁也不依赖谁</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    发布订阅模式把「谁发出通知」和「谁关心通知」彻底解耦：发布者只管往事件中心
                    <code>emit</code>，订阅者提前用 <code>on</code> 登记兴趣，中间由<em>事件中心</em>负责转发。
                    DOM 的 <code>addEventListener</code>、Vue 的 mitt / EventBus、Node 的 EventEmitter
                    都是同一套思路。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">解耦</span>
                        <span class="point__v">发布者不需要知道有谁在听，加订阅方也不用改发布方</span>
                    </div>
                    <div class="point">
                        <span class="point__k">必做</span>
                        <span class="point__v">组件销毁时要 off，否则回调持有旧实例 → 内存泄漏</span>
                    </div>
                    <div class="point">
                        <span class="point__k">once</span>
                        <span class="point__v">只听一次，触发后自动注销；实现上就是包装一层再 off</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 交互实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">一个活的事件中心</h2>
                </div>
                <span class="panel__meta">左边登记订阅者，右边发消息，看谁会被叫到</span>
            </div>
            <div class="panel__body">
                <div class="ps-grid">
                    <!-- 订阅 -->
                    <div class="ps-box">
                        <div class="code-block__label">① 登记订阅者</div>
                        <div class="w-row">
                            <input v-model="eventName" class="ps-input mono" placeholder="事件名，如 login" />
                            <div class="w-btns">
                                <button type="button" class="w-btn" @click="subscribe(false)">on 订阅</button>
                                <button type="button" class="w-btn" @click="subscribe(true)">once 只听一次</button>
                            </div>
                        </div>
                        <div class="w-btns preset">
                            <button
                                v-for="e in PRESETS"
                                :key="e"
                                type="button"
                                class="w-btn"
                                @click="eventName = e">
                                {{ e }}
                            </button>
                        </div>

                        <div class="code-block__label mt">已登记的订阅者（{{ subs.length }}）</div>
                        <div class="sub-list">
                            <div v-for="s in subs" :key="s.id" class="sub-row">
                                <span class="sub-event mono">{{ s.event }}</span>
                                <span class="sub-tag mono" :class="s.once ? 'is-once' : 'is-on'">
                                    {{ s.once ? 'once' : 'on' }}
                                </span>
                                <span class="sub-calls mono">被调用 {{ s.calls }} 次</span>
                                <button type="button" class="sub-off mono" @click="unsubscribe(s.id)">off</button>
                            </div>
                            <span v-if="!subs.length" class="queue__empty">还没有人订阅</span>
                        </div>
                    </div>

                    <!-- 发布 -->
                    <div class="ps-box">
                        <div class="code-block__label">② 发布消息</div>
                        <div class="w-row">
                            <input v-model="emitName" class="ps-input mono" placeholder="要发的事件名" />
                            <input v-model="emitPayload" class="ps-input mono" placeholder="携带的数据" />
                        </div>
                        <div class="w-row">
                            <div class="w-btns">
                                <button type="button" class="w-btn" @click="emit">
                                    emit
                                </button>
                                <button type="button" class="w-btn" @click="emitAll">给所有事件发一轮</button>
                                <button type="button" class="w-btn" @click="clearLog">清空日志</button>
                            </div>
                        </div>

                        <div class="code-block__label mt">事件总线 { 事件名 → 订阅者数量 }</div>
                        <div class="bus-map">
                            <div v-for="row in busRows" :key="row.event" class="bus-row">
                                <span class="bus-key mono">{{ row.event }}</span>
                                <span class="bus-arrow mono">→</span>
                                <span class="bus-val mono">{{ row.count }} 个回调</span>
                            </div>
                            <span v-if="!busRows.length" class="queue__empty">总线是空的</span>
                        </div>

                        <div class="code-block__label mt">③ 调用日志</div>
                        <div class="log-box">
                            <span v-for="(l, i) in logs" :key="i" class="log-line mono" :class="l.kind">
                                {{ l.text }}
                            </span>
                            <span v-if="!logs.length" class="queue__empty">还没人收到消息</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">事件中心的实现</h2>
                </div>
                <span class="panel__meta">上面那个总线就是这段代码</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">EventBus · on / once / off / emit</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">在组件里用：别忘了卸载时 off</div>
                    <CodeEditor :code="vueCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Handler = (payload: unknown) => void
type Entry = { fn: Handler; once: boolean }

class EventBus {
    #map = new Map<string, Entry[]>()

    on(event: string, fn: Handler) {
        const list = this.#map.get(event) ?? []
        this.#map.set(event, [...list, { fn, once: false }])
        return () => this.off(event, fn)
    }

    once(event: string, fn: Handler) {
        const list = this.#map.get(event) ?? []
        this.#map.set(event, [...list, { fn, once: true }])
        return () => this.off(event, fn)
    }

    off(event: string, fn?: Handler) {
        if (!fn) {
            this.#map.delete(event)
            return
        }
        const list = this.#map.get(event)
        if (!list) return
        const next = list.filter((e) => e.fn !== fn)
        if (next.length) this.#map.set(event, next)
        else this.#map.delete(event)
    }

    emit(event: string, payload?: unknown) {
        const list = this.#map.get(event)
        if (!list || !list.length) return 0
        // 拷一份再遍历：once 的回调执行时会删掉自己
        for (const entry of [...list]) {
            entry.fn(payload)
            if (entry.once) this.off(event, entry.fn)
        }
        return list.length
    }

    // 给页面展示用的快照
    snapshot() {
        return [...this.#map.entries()].map(([event, list]) => ({ event, count: list.length }))
    }
}

const bus = new EventBus()

const PRESETS = ['login', 'logout', 'pay'] as const

type Sub = { id: number; event: string; once: boolean; calls: number }

const subs = ref<Sub[]>([])
const logs = ref<{ text: string; kind: string }[]>([])
const eventName = ref<string>('login')
const emitName = ref<string>('login')
const emitPayload = ref<string>('Alice')

let seq = 0

// id → 真正的回调引用，点「off」时要拿着它去总线注销，
// 不然只是把 UI 上的那一行擦掉，回调还挂在总线上。
const registry = new Map<number, { event: string; fn: Handler; once: boolean }>()

const busRows = computed(() => bus.snapshot())

function subscribe(once: boolean) {
    const event = eventName.value.trim()
    if (!event) return

    seq += 1
    const id = seq
    const sub: Sub = { id, event, once, calls: 0 }

    const handler = (payload: unknown) => {
        const target = subs.value.find((s) => s.id === id)
        if (target) target.calls += 1
        logs.value = [
            ...logs.value,
            {
                text: `订阅者 #${id}（${event}）收到：${JSON.stringify(payload ?? null)}`,
                kind: once ? 'is-once' : 'is-hit',
            },
        ]
        // once 触发后从列表里划掉
        if (once) subs.value = subs.value.filter((s) => s.id !== id)
    }

    if (once) bus.once(event, handler)
    else bus.on(event, handler)

    subs.value = [...subs.value, sub]
    logs.value = [...logs.value, { text: `订阅者 #${id} 登记了 ${once ? 'once' : 'on'} ${event}`, kind: 'is-info' }]
}

function unsubscribe(id: number) {
    const target = subs.value.find((s) => s.id === id)
    if (target) {
        subs.value = subs.value.filter((s) => s.id !== id)
        logs.value = [...logs.value, { text: `订阅者 #${id} 已退订 ${target.event}`, kind: 'is-off' }]
    }
    bus.snapshot()
}

function emit() {
    const event = emitName.value.trim()
    if (!event) return
    const n = bus.emit(event, emitPayload.value)
    if (n === 0) {
        logs.value = [...logs.value, { text: `emit('${event}') 发出去了，但没人订阅`, kind: 'is-off' }]
    } else {
        logs.value = [...logs.value, { text: `emit('${event}') → 触发 ${n} 个订阅者`, kind: 'is-info' }]
    }
    subs.value = [...subs.value]
}

function emitAll() {
    PRESETS.forEach((e) => {
        const n = bus.emit(e, `${e} 的数据`)
        logs.value = [
            ...logs.value,
            {
                text: `emit('${e}') → ${n ? `触发 ${n} 个订阅者` : '无人订阅'}`,
                kind: n ? 'is-info' : 'is-off',
            },
        ]
    })
    subs.value = [...subs.value]
}

function clearLog() {
    logs.value = []
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `class EventBus {
  #map = new Map()          // event -> [{ fn, once }]

  on(event, fn) {
    const list = this.#map.get(event) ?? []
    this.#map.set(event, [...list, { fn, once: false }])
    return () => this.off(event, fn)     // 顺手返回一个「退订函数」
  }

  once(event, fn) {
    const list = this.#map.get(event) ?? []
    this.#map.set(event, [...list, { fn, once: true }])
    return () => this.off(event, fn)
  }

  off(event, fn) {
    // 不传 fn 表示把这个事件的订阅者全清掉
    if (!fn) return void this.#map.delete(event)

    const list = this.#map.get(event)
    if (!list) return
    const next = list.filter((e) => e.fn !== fn)
    next.length ? this.#map.set(event, next) : this.#map.delete(event)
  }

  emit(event, payload) {
    const list = this.#map.get(event)
    if (!list || !list.length) return 0

    // ★ 拷一份再遍历：once 的回调会在执行时把自己删掉
    for (const entry of [...list]) {
      entry.fn(payload)
      if (entry.once) this.off(event, entry.fn)
    }
    return list.length
  }
}

export default new EventBus()`

const vueCode = `// Vue 组件里最常见的踩坑点：订阅了却忘了退订
import bus from './eventBus'

export default {
  setup() {
    const handler = (payload) => { /* 更新页面状态 */ }

    bus.on('login', handler)

    // 组件卸载必须退订，否则 handler 会一直被总线持有，
    // 里面的旧实例也就跟着无法回收
    onBeforeUnmount(() => {
      bus.off('login', handler)
    })
  }
}

// 更省事：on 返回了退订函数
const stop = bus.on('pay', handler)
onBeforeUnmount(stop)

// Vue3 里跨层级通信其实更推荐 provide/inject 或 Pinia，
// 事件总线适合「确实不想建立依赖关系」的场景。`
</script>

<style scoped>
.ps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 12px;
    align-items: start;
}

.ps-box {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 12px;
}

.mt {
    margin-top: 14px;
}

.ps-input {
    flex: 1 1 120px;
    min-width: 0;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--surface);
    border: 1px solid var(--hairline);
    padding: 6px 10px;
    outline: none;
}
.ps-input:focus {
    border-color: var(--brand);
}
.ps-input::placeholder {
    color: var(--text-tertiary);
}

.preset {
    gap: 6px;
    margin-bottom: 4px;
}

/* ── 订阅列表 ─────────────────────────────────────────── */
.sub-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 86px;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.sub-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    padding: 3px 0;
    border-bottom: 1px dashed var(--hairline);
}
.sub-row:last-child {
    border-bottom: none;
}

.sub-event {
    flex: 1;
    color: var(--text-primary);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sub-tag {
    font-size: 10px;
    padding: 1px 6px;
    border: 1px solid var(--hairline);
    color: var(--text-tertiary);
}
.sub-tag.is-once {
    color: var(--warning);
    border-color: var(--warning);
}
.sub-tag.is-on {
    color: var(--success);
    border-color: var(--success);
}

.sub-calls {
    font-size: 10px;
    color: var(--text-tertiary);
}

.sub-off {
    font-size: 10px;
    color: var(--danger);
    background: transparent;
    border: 1px solid var(--hairline);
    padding: 1px 6px;
    cursor: pointer;
}
.sub-off:hover {
    border-color: var(--danger);
}

/* ── 总线快照 ─────────────────────────────────────────── */
.bus-map {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-height: 62px;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.bus-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
    font-size: 11px;
}

.bus-key {
    color: var(--brand);
    min-width: 78px;
}

.bus-arrow {
    color: var(--text-tertiary);
}

.bus-val {
    color: var(--text-secondary);
}

/* ── 日志 ─────────────────────────────────────────────── */
.log-box {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-height: 120px;
    max-height: 220px;
    overflow-y: auto;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.log-line {
    font-size: 11px;
    color: var(--text-secondary);
    word-break: break-all;
}
.log-line.is-hit {
    color: var(--success);
}
.log-line.is-once {
    color: var(--warning);
}
.log-line.is-off {
    color: var(--danger);
}
.log-line.is-info {
    color: var(--text-tertiary);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
