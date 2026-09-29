<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Event Bus</span>
                    <h2 class="panel__title">Vue2 的 Bus，Vue3 换成了 mitt</h2>
                </div>
                <span class="panel__meta">一个全局 pub/sub，谁都能发谁都能听</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    Vue2 时代常见写法是 <code>new Vue()</code> 当事件总线挂到原型上。
                    Vue3 把 <code>$on</code> / <code>$off</code> / <code>$once</code> 全删了，
                    官方推荐用极小的 <em>mitt</em> 库替代——它做的事和以前一模一样，
                    只是不再依赖 Vue 实例本身。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">为什么删</span>
                        <span class="point__v">实例上的 $on 无法被 tree-shaking，且鼓励了难以追踪的数据流</span>
                    </div>
                    <div class="point">
                        <span class="point__k">mitt 体积</span>
                        <span class="point__v">约 200 字节，核心就是一个 Map&lt;事件名, 回调数组&gt;</span>
                    </div>
                    <div class="point">
                        <span class="point__k">最大风险</span>
                        <span class="point__v">组件卸载时忘了 off，回调连同闭包里的 DOM 引用一起泄漏</span>
                    </div>
                    <div class="point">
                        <span class="point__k">替代方案</span>
                        <span class="point__v">绝大多数场景用 Pinia 更清晰，也更好调试</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：手写一个 mitt -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">它总共就这几行</h2>
                </div>
                <span class="panel__meta">on / off / emit / once / clear，一个不少</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="emitTick">emit('tick', payload)</button>
                        <button type="button" class="w-btn" @click="emitReset">emit('reset')</button>
                        <button type="button" class="w-btn" @click="bus.clear()">bus.all.clear() 清空全部</button>
                    </div>
                    <span class="w-hint">看着右边的监听器数量变化</span>
                </div>

                <div class="stat-grid">
                    <div class="stat">
                        <span class="stat__label">已注册事件</span>
                        <span class="stat__value mono">{{ eventKeys.join(' / ') || '—' }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">tick 监听器数</span>
                        <span class="stat__value mono">{{ tickCount }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">emit 总次数</span>
                        <span class="stat__value mono">{{ emitTimes }}</span>
                    </div>
                </div>

                <div class="cards" style="margin-top: 14px">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">普通订阅</h3>
                            <span class="card__tag is-good">每次 emit 都触发</span>
                        </div>
                        <p class="card__desc">
                            <code>bus.on('tick', fn)</code> 之后，每次 emit 都会把 fn 跑一遍，
                            直到被 <code>off</code> 或者整个事件被清掉。
                        </p>
                        <div class="w-btns" style="margin-bottom: 10px">
                            <button type="button" class="w-btn" @click="subscribe">再挂一个监听器</button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">被触发</span>
                                <span class="kv__v is-ok">{{ normalHits }} 次</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">once 一次性</h3>
                            <span class="card__tag">触发即自行解绑</span>
                        </div>
                        <p class="card__desc">
                            <code>once</code> 的实现就是给回调包一层：跑之前先 <code>off</code> 自己。
                            适合「等第一次数据到位」这类场景。
                        </p>
                        <div class="w-btns" style="margin-bottom: 10px">
                            <button type="button" class="w-btn" @click="subscribeOnce">挂一个 once 监听器</button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">被触发</span>
                                <span class="kv__v is-warn">{{ onceHits }} 次</span></div>
                            <div class="kv"><span class="kv__k">还活着</span>
                                <span class="kv__v">{{ onceAlive ? '是' : '已自动解绑' }}</span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">emit 日志</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 点 emit 发一次事件</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：忘记 off 的幽灵回调 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">组件销毁了，回调还活着</h2>
                </div>
                <span class="panel__meta">这是事件总线最经典的泄漏</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="mountComp">挂载一个新组件</button>
                        <button type="button" class="w-btn" @click="emitTick">emit 一次，看谁响应</button>
                        <button type="button" class="w-btn" @click="clearGhosts">全部清理</button>
                    </div>
                    <span class="w-hint">灰色卡片是已卸载的组件——理应彻底静默</span>
                </div>

                <div class="cards">
                    <article v-for="c in comps" :key="c.id" class="card ghost-card"
                        :class="{ 'is-dead': !c.alive, 'is-haunting': c.alive === false && c.hits > c.liveHits }">
                        <div class="card__head">
                            <h3 class="card__title mono">{{ c.name }}</h3>
                            <span class="card__tag" :class="c.alive ? 'is-good' : 'is-bad'">
                                {{ c.alive ? '已挂载' : '已卸载' }}
                            </span>
                        </div>
                        <p class="card__desc">
                            {{ c.offed ? '卸载时调用了 bus.off —— 干净收场' : '卸载时忘了 off —— 回调仍在总线里' }}
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">响应次数</span>
                                <span class="kv__v" :class="!c.alive && c.hits > c.liveHits ? 'is-bad' : 'is-ok'">
                                    {{ c.hits }}
                                </span></div>
                            <div class="kv"><span class="kv__k">卸载后仍然响应</span>
                                <span class="kv__v" :class="!c.alive && c.hits > c.liveHits ? 'is-bad' : 'is-ok'">
                                    {{ c.alive ? '—' : Math.max(c.hits - c.liveHits, 0) }}
                                </span></div>
                        </div>
                        <div class="w-btns" style="margin-top: 10px">
                            <button v-if="c.alive" type="button" class="w-btn" @click="unmount(c, true)">
                                卸载（记得 off）
                            </button>
                            <button v-if="c.alive" type="button" class="w-btn" @click="unmount(c, false)">
                                卸载（忘了 off）
                            </button>
                            <button v-if="!c.alive && !c.offed" type="button" class="w-btn" @click="fixGhost(c)">
                                亡羊补牢 · off
                            </button>
                        </div>
                    </article>

                    <div v-if="!comps.length" class="card card--empty">
                        <p class="card__desc" style="margin: 0">
                            先挂载几个组件，再用不同方式卸载它们，然后 emit 一次看看。
                        </p>
                    </div>
                </div>

                <p class="ghost-note">
                    红色的「卸载后仍然响应」就是泄漏本身：组件早没了，
                    但它的回调还挂在总线上，每次 emit 都被白白执行一次。
                    回调里通常还闭包着 <code>this.xxx</code>、DOM 节点、定时器——
                    这些都跟着一起无法回收。 <strong>onUnmounted 里配对 off 是硬规矩</strong>。
                </p>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实验里用到的写法</h2>
                </div>
                <span class="panel__meta">与页面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">手写的 mitt 总线（页面里跑的就是它）</div>
                    <CodeEditor :code="busCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">组件里的正确用法</div>
                    <CodeEditor :code="usageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/* ── 手写一个 mitt ──────────────────────────────────── */
type Handler<T = unknown> = (payload: T) => void

function createBus<Events extends Record<string, unknown>>() {
    const all = new Map<keyof Events, Set<Handler<never>>>()

    return {
        all,

        on<K extends keyof Events>(key: K, fn: Handler<Events[K]>) {
            const set = all.get(key) ?? new Set()
            set.add(fn as Handler<never>)
            all.set(key, set)
        },

        off<K extends keyof Events>(key: K, fn?: Handler<Events[K]>) {
            if (!fn) {
                all.delete(key)
                return
            }
            all.get(key)?.delete(fn as Handler<never>)
        },

        emit<K extends keyof Events>(key: K, payload: Events[K]) {
            const set = all.get(key)
            if (!set) return
            // 复制一份再遍历：回调里可能又会 off 自己
            for (const fn of [...set]) (fn as Handler<Events[K]>)(payload)
        },

        once<K extends keyof Events>(key: K, fn: Handler<Events[K]>) {
            const wrapped: Handler<Events[K]> = (p) => {
                this.off(key, wrapped)
                fn(p)
            }
            this.on(key, wrapped)
        },

        clear() {
            all.clear()
        },
    }
}

type DemoEvents = {
    tick: { at: number; seq: number }
    reset: void
}

const bus = createBus<DemoEvents>()

/* ── 日志 ───────────────────────────────────────────── */
type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 40)
}

/* ── 实验一 ─────────────────────────────────────────── */
const emitTimes = ref(0)
const normalHits = ref(0)
const onceHits = ref(0)
const onceAlive = ref(false)

const tickCount = computed(() => bus.all.get('tick')?.size ?? 0)
const eventKeys = computed(() => [...bus.all.keys()] as string[])

function subscribe() {
    bus.on('tick', (p) => {
        normalHits.value += 1
        push(`普通监听器收到第 ${p.seq} 次 tick`, 'on')
    })
    push('挂载一个普通监听器', 'on')
}

function subscribeOnce() {
    const wrapped: Handler<DemoEvents['tick']> = (p) => {
        bus.off('tick', wrapped)
        onceAlive.value = false
        onceHits.value += 1
        push(`once 监听器收到第 ${p.seq} 次 tick，然后把自己解绑了`, 'once', 'is-warn')
    }
    bus.on('tick', wrapped)
    onceAlive.value = true
    push('挂载一个 once 监听器', 'once')
}

function emitTick() {
    emitTimes.value += 1
    ghostEmit()
    push(`emit('tick') 第 ${emitTimes.value} 次，当前 ${tickCount.value} 个监听器`, 'emit', 'is-ok')
}

function emitReset() {
    bus.emit('reset', undefined)
    push("emit('reset')", 'emit')
}

/* ── 实验二：幽灵回调 ───────────────────────────────── */
type Comp = {
    id: number
    name: string
    alive: boolean
    offed: boolean
    hits: number
    liveHits: number
    handler: Handler<DemoEvents['tick']>
}

const comps = ref<Comp[]>([])
let compSeq = 0

function mountComp() {
    compSeq += 1
    const comp: Comp = {
        id: compSeq,
        name: `Widget-${compSeq}`,
        alive: true,
        offed: false,
        hits: 0,
        liveHits: 0,
        handler: () => {
            comp.hits += 1
            if (comp.alive) comp.liveHits = comp.hits
        },
    }
    bus.on('tick', comp.handler)
    comps.value = [...comps.value, comp]
    push(`${comp.name} 挂载并完成订阅`, 'mount', 'is-ok')
}

// 每次 emit 都要让已卸载组件也跑一遍，才能看到幽灵调用
function ghostEmit() {
    bus.emit('tick', { at: Date.now(), seq: emitTimes.value })
}

function unmount(c: Comp, doOff: boolean) {
    c.alive = false
    c.liveHits = c.hits
    if (doOff) {
        bus.off('tick', c.handler)
        c.offed = true
        push(`${c.name} 卸载并正确 off`, 'unmount', 'is-ok')
    } else {
        push(`${c.name} 卸载了，但监听器还留着 —— 幽灵开始`, 'leak', 'is-bad')
    }
}

function fixGhost(c: Comp) {
    bus.off('tick', c.handler)
    c.offed = true
    push(`${c.name} 补了一次 off，后续不再响应`, 'fix', 'is-ok')
}

function clearGhosts() {
    comps.value.forEach((c) => {
        if (!c.offed) bus.off('tick', c.handler)
    })
    comps.value = []
    push('清空所有组件与其监听器', 'clear')
}

/* ── 展示用源码 ─────────────────────────────────────── */
const busCode = `// utils/bus.ts —— mitt 的全部核心就是这个
type Handler<T = unknown> = (payload: T) => void

export function createBus<Events extends Record<string, unknown>>() {
  const all = new Map<keyof Events, Set<Handler>>()

  return {
    all,
    on(key, fn) {
      const set = all.get(key) ?? new Set()
      set.add(fn)
      all.set(key, set)
    },
    off(key, fn) {
      if (!fn) return void all.delete(key)   // 不传 fn 就整个事件清掉
      all.get(key)?.delete(fn)
    },
    emit(key, payload) {
      // ⚠️ 必须复制一份再遍历：回调里可能又会 off 自己，
      //    直接遍历原 Set 会发生「边遍历边修改」
      for (const fn of [...(all.get(key) ?? [])]) fn(payload)
    },
    once(key, fn) {
      const wrapped = (p: any) => { this.off(key, wrapped); fn(p) }
      this.on(key, wrapped)
    },
    clear() { all.clear() },
  }
}

// 带上事件签名，emit 的参数就不会写错
type AppEvents = {
  'cart:add': { id: number; name: string }
  'user:logout': void
}
export const bus = createBus<AppEvents>()`

const usageCode = `<script setup lang="ts">
import { onUnmounted } from 'vue'
import { bus } from '@/utils/bus'

// ⚠️ 一定要是具名函数或存下来的引用，
//    写匿名函数就再也无法 off 了
const onTick = (p: { seq: number }) => {
  console.log('tick', p.seq)
}

bus.on('tick', onTick)

onUnmounted(() => {
  bus.off('tick', onTick)   // 配对解绑，缺一行就是泄漏
})
<\/script>

// Vue2 的老写法（Vue3 已经没有 \$on 了）
const bus = new Vue()      // ❌ 不要再用
bus.$on('tick', handler)
bus.$emit('tick', data)

// 更推荐的替代：这种场景用 Pinia 往往更清楚
const cart = useCartStore()
cart.add(item)              // 数据来源一目了然，devtools 还能看到变更记录`
</script>

<style scoped>
.ghost-card {
    transition: opacity 0.15s, border-color 0.15s;
}

.ghost-card.is-dead {
    opacity: 0.75;
}

.ghost-card.is-haunting {
    border-color: var(--danger);
    opacity: 1;
}

.card--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-style: dashed;
    background: transparent;
}

.ghost-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.ghost-note code {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
}

.log-block {
    margin-top: 14px;
}
</style>
