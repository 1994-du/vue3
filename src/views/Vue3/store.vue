<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Pinia</span>
                    <h2 class="panel__title">把「谁都能改的状态」关进一个地方</h2>
                </div>
                <span class="panel__meta">本项目实际在用的状态管理方案</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    多个毫无亲缘关系的组件要读写同一份数据，靠 props / emit 就得层层转运。
                    Pinia 的做法是把这份数据和<em>改它的办法</em>放在一起做成一个 store，
                    任何组件 <code>useXxxStore()</code> 就能拿到——
                    <strong>数据源只有一个，改法也只有一套</strong>，出了问题知道去哪查。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">三大块</span>
                        <span class="point__v">state 存数据、getters 算派生、actions 放改法</span>
                    </div>
                    <div class="point">
                        <span class="point__k">vs Vuex</span>
                        <span class="point__v">砍掉 mutations，简化 modules，天然支持 TS 与 SSR</span>
                    </div>
                    <div class="point">
                        <span class="point__k">注意</span>
                        <span class="point__v">直接解构会丢响应式，要用 storeToRefs</span>
                    </div>
                    <div class="point">
                        <span class="point__k">持久化</span>
                        <span class="point__v">刷新会丢，本项目接了 pinia-plugin-persistedstate</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：真实操作 store -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">对 @/store/pinia/counter 下手</h2>
                </div>
                <span class="panel__meta">下面每个数字都来自真实 store，不是写死的</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="counter.increment()">increment()</button>
                        <button type="button" class="w-btn" @click="counter.decrement()">decrement()</button>
                        <button type="button" class="w-btn" @click="counter.$patch({ count: counter.count + 10 })">
                            $patch(+10)
                        </button>
                        <button type="button" class="w-btn" @click="counter.$patch((s) => { s.count *= 2 })">
                            $patch(fn)
                        </button>
                        <button type="button" class="w-btn" @click="counter.$reset()">$reset()</button>
                    </div>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">state.count</h3>
                            <span class="card__tag">原始状态</span>
                        </div>
                        <p class="card__desc">
                            store 里唯一的那份数据。所有组件读到的都是它，不存在副本。
                        </p>
                        <div class="readout">{{ counter.count }}</div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">getters.doubleCount</h3>
                            <span class="card__tag is-good">自动缓存</span>
                        </div>
                        <p class="card__desc">
                            和 computed 一样带缓存，依赖没变就不重算。
                            这里算的是 <code>count * 2</code>。
                        </p>
                        <div class="readout">{{ counter.doubleCount }}</div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">storeToRefs 解构</h3>
                            <span class="card__tag is-good">保持响应式</span>
                        </div>
                        <p class="card__desc">
                            直接 <code>const { count } = store</code> 会定格成快照，
                            必须走 <code>storeToRefs</code>——这就是
                            <code>toRefs</code> 在真实项目里的样子。
                        </p>
                        <div class="readout">{{ destructured }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">是否与源同步</span>
                                <span class="kv__v is-ok">{{ destructured === counter.count }}</span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">$subscribe 捕获到的变更记录</div>
                    <div class="log-list">
                        <div v-for="l in patchLogs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!patchLogs.length" class="log-empty">// 点上面的按钮，每一次改动都会被记下来</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：Vuex 对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Comparison</span>
                    <h2 class="panel__title">从 Vuex 迁过来要改什么</h2>
                </div>
                <span class="panel__meta">两者的概念对应关系</span>
            </div>
            <div class="panel__body">
                <div class="matrix">
                    <div class="matrix__head">
                        <span class="matrix__corner">Vuex 3 / 4</span>
                        <span class="matrix__col">Pinia</span>
                        <span class="matrix__col">说明</span>
                    </div>
                    <div v-for="row in mapping" :key="row.vuex" class="matrix__row">
                        <span class="matrix__name mono">{{ row.vuex }}</span>
                        <span class="matrix__cell mono">{{ row.pinia }}</span>
                        <span class="matrix__cell matrix__note">{{ row.note }}</span>
                    </div>
                </div>

                <p class="probe-note">
                    最关键的一条：<strong>Pinia 没有 mutations</strong>。
                    以前写 mutations 只是为了给 devtools 一个可读的变更名，
                    现在 action 里想同步就同步、想 await 就 await，
                    <em>少了一整个概念层</em>。
                    <br />
                    顺带一提：这个页面以前同时用着 Vuex 和 Pinia，但本项目只注册了 Pinia——
                    <code>useStore()</code> 会直接抛错导致整页白屏，现在已经彻底换成 Pinia。
                </p>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">本项目里的真实 store</h2>
                </div>
                <span class="panel__meta">src/store/pinia/counter.ts</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">选项式写法（项目在用的）</div>
                    <CodeEditor :code="optionCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">组合式写法 + 组件里的用法</div>
                    <CodeEditor :code="setupCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useCounterStore from '@/store/pinia/counter'

/* ── 真实 store ─────────────────────────────────────── */
const counter = useCounterStore()

// ✅ 正确：storeToRefs 之后解构，响应式不丢
const { count } = storeToRefs(counter)
const destructured = computed(() => count.value)

/* ── $subscribe 变更日志 ────────────────────────────── */
type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const patchLogs = ref<LogLine[]>([])
let seq = 0

counter.$subscribe((_mutation, state) => {
    seq += 1
    patchLogs.value = [
        { idx: seq, msg: `count → ${state.count}`, tag: 'mutation', tone: 'is-ok' },
        ...patchLogs.value,
    ].slice(0, 30)
})

/* ── Vuex 对照表 ────────────────────────────────────── */
const mapping = [
    { vuex: 'state', pinia: 'state', note: '都是返回初始值的函数，避免复用时共享引用' },
    { vuex: 'getters', pinia: 'getters', note: '都带缓存，Pinia 里还能通过第二个参数用别的 getter' },
    { vuex: 'mutations', pinia: '❌ 已移除', note: '同步异步都直接写进 actions' },
    { vuex: 'actions', pinia: 'actions', note: 'Pinia 里 this 直接指向 state，随便 await' },
    { vuex: 'modules', pinia: '多个独立 store', note: '天然扁平，import 即用，还能互相调用' },
    { vuex: 'commit(...)', pinia: '直接调用方法', note: 'counter.increment() 就够了' },
    { vuex: 'dispatch(...)', pinia: '同样的方法调用', note: '同步异步写法统一了' },
    { vuex: 'mapState 等辅助函数', pinia: 'storeToRefs', note: '只对 state/getters 用，action 可以直接解' },
]

/* ── 展示用源码 ─────────────────────────────────────── */
const optionCode = `// src/store/pinia/counter.ts —— 项目里真实存在的代码
import { defineStore } from 'pinia'

interface CounterState { count: number }

const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({ count: 0 }),

  getters: {
    doubleCount: (state): number => state.count * 2,
  },

  actions: {
    increment(): void { this.count++ },
    decrement(): void { this.count-- },
  },
})

export default useCounterStore

// main.ts 里注册
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)`

const setupCode = `// 组合式写法：把 state / getters / actions 写成普通变量
export const useCartStore = defineStore('cart', () => {
  const items = ref<Item[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))

  async function fetchList() {
    items.value = await api.list()
  }

  return { items, total, fetchList }   // ref 会被自动解包
})

// ── 组件里 ─────────────────────────────────────────
import { storeToRefs } from 'pinia'

const counter = useCounterStore()

// ❌ 直接解构 = 拿到快照，再也不更新
const { count } = counter

// ✅ state / getters 要用 storeToRefs
const { count, doubleCount } = storeToRefs(counter)

// ✅ action 是普通函数，直接解没问题
const { increment, decrement } = counter

// ── 批量修改 / 订阅 / 重置 ──────────────────────────
counter.$patch({ count: 10 })
counter.$patch((s) => { s.count *= 2 })
counter.$reset()

// 监听整个 store 的变化（页面下方那段日志就是这么来的）
counter.$subscribe((mutation, state) => {
  console.log(mutation.type, state.count)
})`
</script>

<style scoped>
.readout {
    font-family: var(--font-mono);
    font-size: 26px;
    line-height: 1;
    color: var(--brand);
    padding: 6px 0 12px;
    font-variant-numeric: tabular-nums;
}

.matrix {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
}

.matrix__head,
.matrix__row {
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 2fr;
    align-items: stretch;
    gap: 1px;
    background: var(--hairline);
}

.matrix__head {
    padding: 1px;
}

.matrix__corner,
.matrix__col {
    padding: 7px 10px;
    background: var(--surface-subtle);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
}

.matrix__row {
    padding: 1px;
    border-top: 1px solid var(--hairline);
}

.matrix__name {
    padding: 9px 10px;
    background: var(--surface);
    font-size: 12px;
    color: var(--brand);
}

.matrix__cell {
    padding: 9px 10px;
    background: var(--surface);
    font-size: 12px;
    color: var(--text-primary);
}

.matrix__note {
    font-family: var(--font-sans);
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-secondary);
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.probe-note strong {
    color: var(--text-primary);
}

.probe-note em {
    font-style: normal;
    color: var(--brand);
}

.probe-note code {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
}

.log-block {
    margin-top: 14px;
}

@media (max-width: 760px) {
    .matrix__head {
        display: none;
    }

    .matrix__row {
        grid-template-columns: 1fr 1fr;
    }

    .matrix__note {
        grid-column: 1 / -1;
    }
}
</style>
