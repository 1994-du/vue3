<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">watch</span>
                    <h2 class="panel__title">盯着一个源，变了就回调</h2>
                </div>
                <span class="panel__meta">惰性的、能拿到新旧值的副作用</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>watch(源, 回调, 选项)</code> 的第一个参数可以是 ref、reactive 对象、
                    一个返回值的 getter，或者这些东西组成的<em>数组</em>。
                    它默认是<em>惰性的</em>——首次不执行，只有源真的变了才触发。
                    最容易踩坑的是那三个选项：<code>immediate</code> 决定要不要先跑一次，
                    <code>deep</code> 决定要不要往对象内部钻，<code>flush</code> 决定回调插在
                    <em>组件更新的哪一刻</em>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">vs computed</span>
                        <span class="point__v">computed 要产出新值；watch 只管副作用，不要求返回值</span>
                    </div>
                    <div class="point">
                        <span class="point__k">vs watchEffect</span>
                        <span class="point__v">watchEffect 自动收集依赖且立即执行；watch 的源要明确写出来</span>
                    </div>
                    <div class="point">
                        <span class="point__k">返回值</span>
                        <span class="point__v">watch 返回一个停止函数，调它即解绑；组件卸载时自动停</span>
                    </div>
                    <div class="point">
                        <span class="point__k">大坑</span>
                        <span class="point__v">改对象内部属性时 newVal 与 oldVal 是同一个引用，比不出差异</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：flush 时机 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">flush：回调到底插在哪一刻</h2>
                </div>
                <span class="panel__meta">三个 watcher 同时盯着 num，各自打印它看到的 DOM</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="num++">num++</button>
                        <button type="button" class="w-btn" @click="num += 10">num += 10</button>
                        <button type="button" class="w-btn" @click="reset1">清空日志</button>
                    </div>
                    <span class="w-hint">
                        三个 watcher 都去读下面那句真实渲染出的数字——谁读到新值，说明它在 DOM 更新<em>之后</em>跑
                    </span>
                </div>

                <div class="watch-target">
                    <span class="watch-target__label">模板里真实渲染的 num</span>
                    <span ref="domProbe" class="watch-target__v mono">{{ num }}</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">flush: 'sync'</h3>
                            <span class="card__tag">改完立刻跑</span>
                        </div>
                        <p class="card__desc">
                            值一改就同步触发，比渲染还早，读到的 DOM 一定是<strong>旧的</strong>。
                            频繁改值时会同步跑很多次，一般只在要立刻同步外部状态时用。
                        </p>
                        <div class="res-row"><span class="res-k">触发</span>
                            <span class="res-v mono">{{ syncCount }} 次</span></div>
                        <div class="res-row"><span class="res-k">读到</span>
                            <span class="res-v mono" :class="syncSeen === num ? 'is-ok' : 'is-warn'">{{ syncSeen }}</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">flush: 'pre'</h3>
                            <span class="card__tag is-bad">默认，DOM 未更新</span>
                        </div>
                        <p class="card__desc">
                            排进<strong>更新之前</strong>的队列。多个 watcher 会合并成一次，
                            所以同样读不到新 DOM——回调里要操作 DOM 就该换成 post。
                        </p>
                        <div class="res-row"><span class="res-k">触发</span>
                            <span class="res-v mono">{{ preCount }} 次</span></div>
                        <div class="res-row"><span class="res-k">读到</span>
                            <span class="res-v mono" :class="preSeen === num ? 'is-ok' : 'is-warn'">{{ preSeen }}</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">flush: 'post'</h3>
                            <span class="card__tag is-good">DOM 已更新</span>
                        </div>
                        <p class="card__desc">
                            等组件渲染完再跑，读到的就是<strong>新 DOM</strong>。
                            回调里要量尺寸、要滚动、要接第三方库，一律用这个。
                        </p>
                        <div class="res-row"><span class="res-k">触发</span>
                            <span class="res-v mono">{{ postCount }} 次</span></div>
                        <div class="res-row"><span class="res-k">读到</span>
                            <span class="res-v mono" :class="postSeen === num ? 'is-ok' : 'is-warn'">{{ postSeen }}</span>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">按真实发生顺序排列的回调日志（最新在上）</div>
                    <div class="log-list">
                        <div v-for="l in logs1" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs1.length" class="log-empty">// 点上面的 num++，看三者的先后顺序</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：deep -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">deep：什么才算「变了」</h2>
                </div>
                <span class="panel__meta">源是 ref 包的对象时，开关才真正生效</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    注意这里用的是 <code>ref({...})</code> 而不是 <code>reactive({...})</code>：
                    监听 <em>reactive 对象本身</em>时 Vue 会把 <code>deep</code> 强制成 <code>true</code>，
                    开关写了也白写。只有源是 ref 时，<code>deep: false</code> 才意味着
                    <em>「只有整个 .value 被换掉才算变」</em>。
                </p>

                <div class="w-row">
                    <span class="w-label">deep</span>
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="{ 'is-active': !deep }" @click="deep = false">false</button>
                        <button type="button" class="w-btn" :class="{ 'is-active': deep }" @click="deep = true">true</button>
                    </div>
                    <span class="w-hint">切换会重建 watcher，并开始新的一轮统计</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">改内部 state.value.age</h3>
                            <span class="card__tag" :class="deep ? 'is-good' : 'is-bad'">deep={{ deep }}</span>
                        </div>
                        <p class="card__desc">
                            <code>deep: false</code> 时不触发——因为 <code>.value</code>
                            这个引用从头到尾没换过。
                        </p>
                        <button type="button" class="w-btn card__btn" @click="state.age++">state.age++</button>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前 age</span>
                                <span class="kv__v">{{ state.age }}</span></div>
                            <div class="kv"><span class="kv__k">触发</span>
                                <span class="kv__v" :class="objCount ? 'is-ok' : 'is-bad'">{{ objCount }} 次</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">改深层 state.value.contact.city</h3>
                            <span class="card__tag" :class="deep ? 'is-good' : 'is-bad'">deep={{ deep }}</span>
                        </div>
                        <p class="card__desc">
                            嵌套两层更要靠 deep 兜住。右栏计数是同一个 watcher，
                            所以和左卡共用 <code>{{ objCount }}</code>。
                        </p>
                        <button type="button" class="w-btn card__btn" @click="state.contact.city = `城市-${++deepSeq}`">
                            contact.city = …
                        </button>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前 city</span>
                                <span class="kv__v">{{ state.contact.city }}</span></div>
                            <div class="kv"><span class="kv__k">n === o</span>
                                <span class="kv__v" :class="sameRef ? 'is-bad' : 'is-ok'">{{ sameRef }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">整个替换 .value</h3>
                            <span class="card__tag is-good">两种 deep 都触发</span>
                        </div>
                        <p class="card__desc">
                            引用换了，<code>deep: false</code> 也一样拦不住。
                            这时 <code>n === o</code> 才是 <code>false</code>。
                        </p>
                        <button type="button" class="w-btn card__btn" @click="replaceState">state.value = { … }</button>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">替换次数</span>
                                <span class="kv__v">{{ replaceCount }}</span></div>
                            <div class="kv"><span class="kv__k">触发</span>
                                <span class="kv__v" :class="objCount ? 'is-ok' : 'is-bad'">{{ objCount }} 次</span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">watch 日志</div>
                    <div class="log-list">
                        <div v-for="l in logs2" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs2.length" class="log-empty">// deep=false 时试试改内部属性，会发现什么都没发生</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ④ 实验三：immediate 与竞态清理 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 03</span>
                    <h2 class="panel__title">immediate 与 onCleanup：别让过期的结果盖回来</h2>
                </div>
                <span class="panel__meta">搜索框场景的经典竞态</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="nextQuery">发一次新查询</button>
                        <button type="button" class="w-btn" @click="burst">连发三次（制造乱序）</button>
                        <button type="button" class="w-btn" @click="reset3">重置</button>
                    </div>
                    <span class="w-hint">每次请求的耗时是随机的，所以返回顺序会乱</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">没做清理</h3>
                            <span class="card__tag is-bad">谁回来晚谁说话</span>
                        </div>
                        <p class="card__desc">
                            三个请求先后发出，先发的那个万一最后回来，会把旧结果盖到界面上——
                            <strong>用户看到的内容和当前查询对不上</strong>。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前 query</span>
                                <span class="kv__v">{{ query }}</span></div>
                            <div class="kv"><span class="kv__k">显示结果</span>
                                <span class="kv__v" :class="naiveResult === `结果-${query}` ? 'is-ok' : 'is-bad'">
                                    {{ naiveResult || '—' }}
                                </span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">用 onCleanup 作废</h3>
                            <span class="card__tag is-good">只认最后一次</span>
                        </div>
                        <p class="card__desc">
                            回调的第三个参数就是清理钩子：下次 watch 触发前会先执行它，
                            把上一次的请求标记为作废，于是<strong>过期结果不再落地</strong>。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前 query</span>
                                <span class="kv__v">{{ query }}</span></div>
                            <div class="kv"><span class="kv__k">显示结果</span>
                                <span class="kv__v" :class="safeResult === `结果-${query}` ? 'is-ok' : 'is-warn'">
                                    {{ safeResult || '—' }}
                                </span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">immediate 首次执行 + 请求落地日志</div>
                    <div class="log-list">
                        <div v-for="l in logs3" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs3.length" class="log-empty">// 挂载时 immediate 已经先跑过一次了</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ⑤ 源码 -->
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
                    <div class="code-block__label">flush · 回调里读 DOM 的正确姿势</div>
                    <CodeEditor :code="flushCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">deep · reactive 与 ref 源的差异</div>
                    <CodeEditor :code="deepCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">onCleanup · 竞态请求的处理范本</div>
                    <CodeEditor :code="cleanupCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

type LogLine = { idx: number; msg: string; tag: string; tone?: string }

/* ── 实验一：flush 时机 ──────────────────────────────── */
const num = ref(0)
const domProbe = ref<HTMLElement | null>(null)

const logs1 = ref<LogLine[]>([])
let seq1 = 0

function readDom(): number {
    return Number(domProbe.value?.textContent ?? -1)
}

function push1(msg: string, tag: string, tone?: string) {
    seq1 += 1
    logs1.value = [{ idx: seq1, msg, tag, tone }, ...logs1.value].slice(0, 40)
}

const syncCount = ref(0)
const preCount = ref(0)
const postCount = ref(0)
const syncSeen = ref(-1)
const preSeen = ref(-1)
const postSeen = ref(-1)

watch(num, (n, o) => {
    syncCount.value += 1
    syncSeen.value = readDom()
    push1(`num ${o} → ${n}，读到 DOM = ${syncSeen.value}`, 'sync')
}, { flush: 'sync' })

watch(num, (n, o) => {
    preCount.value += 1
    preSeen.value = readDom()
    push1(`num ${o} → ${n}，读到 DOM = ${preSeen.value}`, 'pre')
}, { flush: 'pre' })

watch(num, (n, o) => {
    postCount.value += 1
    postSeen.value = readDom()
    push1(`num ${o} → ${n}，读到 DOM = ${postSeen.value}`, 'post', postSeen.value === n ? 'is-ok' : 'is-warn')
}, { flush: 'post' })

function reset1() {
    logs1.value = []
    seq1 = 0
    syncCount.value = 0
    preCount.value = 0
    postCount.value = 0
    syncSeen.value = -1
    preSeen.value = -1
    postSeen.value = -1
}

/* ── 实验二：deep ────────────────────────────────────── */
type Contact = { city: string }
type Profile = { age: number; contact: Contact }

// 用 ref 包对象而非 reactive——只有 ref 源才能让 deep 开关真正生效。
const state = ref<Profile>({ age: 18, contact: { city: '城市-0' } })
const deep = ref(true)
const deepSeq = ref(0)

const logs2 = ref<LogLine[]>([])
let seq2 = 0

function push2(msg: string, tag: string, tone?: string) {
    seq2 += 1
    logs2.value = [{ idx: seq2, msg, tag, tone }, ...logs2.value].slice(0, 40)
}

const objCount = ref(0)
const sameRef = ref(false)
const replaceCount = ref(0)

type StopHandle = () => void
let stopState: StopHandle | null = null

// deep 是静态选项，想跟着开关变化只能 stop 掉重建。
function bindStateWatcher() {
    stopState?.()
    stopState = watch(
        state,
        (n, o) => {
            objCount.value += 1
            sameRef.value = n === o
            push2(`触发：age=${n.age} city=${n.contact.city}（n === o 为 ${n === o}）`, `deep=${deep.value}`)
        },
        { deep: deep.value },
    )
}

bindStateWatcher()

watch(deep, (v) => {
    objCount.value = 0
    sameRef.value = false
    push2(`重建 watcher，deep = ${v}`, 'config')
    bindStateWatcher()
})

// 模板里直接写 state.age：ref 会自动解包到内部属性。
function replaceState() {
    replaceCount.value += 1
    state.value = { age: 100 + replaceCount.value, contact: { city: '城市-新' } }
}

/* ── 实验三：immediate + onCleanup 竞态 ──────────────── */
const query = ref('q1')
const naiveResult = ref('')
const safeResult = ref('')

const logs3 = ref<LogLine[]>([])
let seq3 = 0
let querySeq = 0

function push3(msg: string, tag: string, tone?: string) {
    seq3 += 1
    logs3.value = [{ idx: seq3, msg, tag, tone }, ...logs3.value].slice(0, 40)
}

// 模拟耗时随机的请求
function fakeFetch(q: string): Promise<string> {
    const cost = 200 + Math.floor(Math.random() * 900)
    return new Promise((resolve) => {
        setTimeout(() => resolve(`结果-${q}`), cost)
    })
}

// ① 裸写：谁先回来谁落地，结果可能过期
watch(query, (q) => {
    void fakeFetch(q).then((res) => {
        naiveResult.value = res
        push3(`${res} 落地（未做防护）`, 'naive', 'is-bad')
    })
}, { immediate: true })

// ② 用第三个参数onCleanup 作废上一次
watch(query, (q, _o, onCleanup) => {
    let cancelled = false
    onCleanup(() => {
        cancelled = true
        push3(`query 已离开 ${q}，作废它的回调`, 'cleanup')
    })

    void fakeFetch(q).then((res) => {
        if (cancelled) {
            push3(`${res} 到达但已作废，丢弃`, 'safe')
            return
        }
        safeResult.value = res
        push3(`${res} 落地`, 'safe', 'is-ok')
    })
}, { immediate: true })

function nextQuery() {
    querySeq += 1
    query.value = `q${querySeq + 1}`
    push3(`发出查询 ${query.value}`, 'emit')
}

function burst() {
    nextQuery()
    setTimeout(nextQuery, 120)
    setTimeout(nextQuery, 260)
}

function reset3() {
    logs3.value = []
    seq3 = 0
    querySeq = 0
    query.value = 'q1'
    naiveResult.value = ''
    safeResult.value = ''
}

/* ── 展示用源码 ──────────────────────────────────────── */
const flushCode = `const num = ref(0)
const box = ref<HTMLElement | null>(null)

// ❌ 默认 flush: 'pre' —— 回调排在渲染之前，量到的是旧 DOM
watch(num, (n) => {
  console.log(box.value?.textContent)   // 还是上一次的值
})

// ✅ 想在回调里碰 DOM，必须用 post
watch(
  num,
  (n) => {
    console.log(box.value?.textContent)  // 已更新为新值
    box.value?.scrollIntoView()
  },
  { flush: 'post' },
)

// flush: 'sync' 最激进：值一改就同步触发，连批处理的机会都没有
watch(num, (n) => { /* … */ }, { flush: 'sync' })`

const deepCode = `// 源是 reactive 对象：deep 被 Vue 强制打开，写了 false 也没用
const profile = reactive({ age: 18, contact: { city: '城市-0' } })
watch(profile, cb, { deep: false })   // ⚠️ 实际等价于 deep: true

// 源是 ref：deep 开关才真正生效
const state = ref({ age: 18, contact: { city: '城市-0' } })

// deep: false —— 只有整个 .value 被替换才算变化
watch(state, cb)                       // state.age++ 不触发

// deep: true —— 内部任意一层变化都触发
watch(state, cb, { deep: true })       // state.contact.city = 'x' 也触发

// 只想盯一个字段时，getter 比 deep 便宜得多
watch(() => state.value.contact.city, cb)`

const cleanupCode = `const query = ref('q1')
const result = ref('')

watch(query, (q, oldValue, onCleanup) => {
  let cancelled = false

  // 下一次 watch 触发前，Vue 会先执行这里
  onCleanup(() => { cancelled = true })

  fetch(\`/api/search?q=\${q}\`)
    .then((r) => r.json())
    .then((data) => {
      if (cancelled) return          // 过期结果直接丢掉
      result.value = data
    })
}, { immediate: true })   // immediate 让首次 also 立刻发一次请求`
</script>

<style scoped>
.watch-target {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.watch-target__label {
    font-size: 12px;
    color: var(--text-tertiary);
}

.watch-target__v {
    margin-left: auto;
    font-size: 18px;
    color: var(--brand);
}

.log-block {
    margin-top: 14px;
}

.res-row + .res-row {
    margin-top: 4px;
}

.kv-grid {
    margin-top: 10px;
}
</style>
