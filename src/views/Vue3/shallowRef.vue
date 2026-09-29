<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">shallowRef</span>
                    <h2 class="panel__title">只认 .value 换没换</h2>
                </div>
                <span class="panel__meta">把响应式深度砍掉一层，换取性能</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>ref</code> 会把里面的对象一路递归转成响应式代理，对象越大、层级越深，这层转换越贵。
                    <code>shallowRef</code> 砍掉了这件事：<em>它只关心 .value 这个引用有没有被换掉</em>，
                    至于对象内部的属性怎么变，它一律不监听、也不通知。
                    改了内部又确实想刷新，就手动调 <code>triggerRef()</code>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">典型场景</span>
                        <span class="point__v">第三方库实例（ECharts / Three.js / 地图），不该被 Vue 代理</span>
                    </div>
                    <div class="point">
                        <span class="point__k">性能账</span>
                        <span class="point__v">省掉深层递归代理与依赖收集，大对象上差距明显</span>
                    </div>
                    <div class="point">
                        <span class="point__k">代价</span>
                        <span class="point__v">改内部属性不会触发更新，容易以为是「数据没改」</span>
                    </div>
                    <div class="point">
                        <span class="point__k">兄弟</span>
                        <span class="point__v">shallowReactive 同理：只有顶层属性是响应的，深层保持原样</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验：三种响应式源的对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">同一个操作，看谁被通知到</h2>
                </div>
                <span class="panel__meta">通知次数由真实 watcher 统计，不靠肉眼判断</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="bumpTop">改顶层 .n</button>
                        <button type="button" class="w-btn" @click="bumpDeep">改深层 .child.v</button>
                        <button type="button" class="w-btn" @click="replaceAll">整体替换 .value</button>
                        <button type="button" class="w-btn" @click="reset">全部归零</button>
                    </div>
                    <span class="w-hint">
                        三个源做完全相同的操作，统计各自 watcher 收到的<em>通知次数</em>
                    </span>
                </div>

                <div class="matrix">
                    <div class="matrix__head">
                        <span class="matrix__corner">响应式源</span>
                        <span class="matrix__col">当前 n</span>
                        <span class="matrix__col">当前 child.v</span>
                        <span class="matrix__col">通知次数</span>
                        <span class="matrix__col">上一次结论</span>
                    </div>

                    <div class="matrix__row">
                        <span class="matrix__name mono">ref</span>
                        <span class="matrix__cell mono">{{ deepObj.n }}</span>
                        <span class="matrix__cell mono">{{ deepObj.child.v }}</span>
                        <span class="matrix__cell mono is-hot">{{ deepNotify }}</span>
                        <span class="matrix__cell matrix__verdict" :class="deepNotify ? 'is-ok' : 'is-bad'">
                            {{ deepNotify ? '✅ 被通知' : '❌ 静默' }}
                        </span>
                    </div>

                    <div class="matrix__row">
                        <span class="matrix__name mono">shallowRef</span>
                        <span class="matrix__cell mono">{{ shallowObj.n }}</span>
                        <span class="matrix__cell mono">{{ shallowObj.child.v }}</span>
                        <span class="matrix__cell mono is-hot">{{ shallowNotify }}</span>
                        <span class="matrix__cell matrix__verdict" :class="shallowNotify ? 'is-ok' : 'is-bad'">
                            {{ shallowNotify ? '✅ 被通知' : '❌ 静默' }}
                        </span>
                    </div>

                    <div class="matrix__row">
                        <span class="matrix__name mono">shallowReactive</span>
                        <span class="matrix__cell mono">{{ shallowReObj.n }}</span>
                        <span class="matrix__cell mono">{{ shallowReObj.child.v }}</span>
                        <span class="matrix__cell mono is-hot">{{ shallowReNotify }}</span>
                        <span class="matrix__cell matrix__verdict" :class="shallowReNotify ? 'is-ok' : 'is-bad'">
                            {{ shallowReNotify ? '✅ 被通知' : '❌ 静默' }}
                        </span>
                    </div>
                </div>

                <p class="probe-note">
                    点「改顶层」也一样：<code>shallowRef</code> 那一行<strong>照样不响</strong>——
                    它判断的依据是 <code>.value</code> 这个引用有没有换，跟第几层毫无关系。
                    而 <code>shallowReactive</code> 是「第一层响应式」，所以改顶层会响、改深层不会。
                    三者的界线就在这。
                </p>

                <div class="log-block">
                    <div class="code-block__label">操作日志</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 从「改深层」开始最能看出差别</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ triggerRef -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">triggerRef：手动喊一声「我变了」</h2>
                </div>
                <span class="panel__meta">改完内部属性后的补救手段</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="silentBump">静默改深层（不通知）</button>
                        <button type="button" class="w-btn is-active" @click="fireTrigger">triggerRef(shallowObj)</button>
                    </div>
                    <span class="w-hint">
                        先连点几次「静默改」，数据已经涨上去了，再补一枪 triggerRef 让画面追上来
                    </span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">改了但没说</h3>
                            <span class="card__tag is-bad">视图滞后</span>
                        </div>
                        <p class="card__desc">
                            每点一次，对象里的 <code>child.v</code> 都在涨，
                            但下面这个数字纹丝不动——因为没有通知。
                        </p>
                        <div class="readout">{{ display }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">静默修改</span>
                                <span class="kv__v is-warn">{{ silentTimes }} 次</span></div>
                            <div class="kv"><span class="kv__k">triggerRef</span>
                                <span class="kv__v is-ok">{{ triggerTimes }} 次</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">补一枪之后</h3>
                            <span class="card__tag is-good">立刻追平</span>
                        </div>
                        <p class="card__desc">
                            <code>triggerRef</code> 强制执行这个 ref 名下的所有依赖，
                            视图一次性把攒下的差值全补上——这也是
                            <strong>shallowRef 的标准配套用法</strong>。
                        </p>
                        <div class="kv-grid" style="margin-top: 0">
                            <div class="kv"><span class="kv__k">差距曾达</span>
                            <span class="kv__v">{{ maxGap }}</span></div>
                            <div class="kv"><span class="kv__k">当前</span>
                            <span class="kv__v" :class="gapNow === 0 ? 'is-ok' : 'is-warn'">
                                差 {{ gapNow }}</span></div>
                        </div>
                    </article>
                </div>
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
                    <div class="code-block__label">三种源的对比</div>
                    <CodeEditor :code="compareCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">什么时候该用 shallowRef</div>
                    <CodeEditor :code="usageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, shallowReactive, shallowRef, triggerRef, watch } from 'vue'

type Payload = { n: number; child: { v: number } }

function make(v = 0): Payload {
    return { n: v, child: { v } }
}

/* ── 三个源，结构完全一样 ────────────────────────────── */
const deepObj = ref<Payload>(make())
const shallowObj = shallowRef<Payload>(make())
const shallowReObj = shallowReactive<Payload>(make())

/* ── 通知计数：真实的 watcher，不掺假 ────────────────── */
const deepNotify = ref(0)
const shallowNotify = ref(0)
const shallowReNotify = ref(0)

// ref 是深层响应，所以打开 deep 才能反映「内部属性变化」
watch(deepObj, () => { deepNotify.value += 1 }, { deep: true })

// shallowRef：只有 .value 被整体替换才会进来
watch(() => shallowObj.value, () => { shallowNotify.value += 1 })

// shallowReactive：只有顶层属性变化才会进来
watch(() => shallowReObj.n, () => { shallowReNotify.value += 1 })

type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 40)
}

function snapshot(n: number) {
    return `ref=${deepNotify.value} shallowRef=${shallowNotify.value} shallowReactive=${shallowReNotify.value}（第 ${n} 轮）`
}

/* ── 操作 ───────────────────────────────────────────── */
let round = 0

function bumpTop() {
    round += 1
    deepObj.value.n += 1
    shallowObj.value.n += 1
    shallowReObj.n += 1
    push(`改顶层 .n → ${snapshot(round)}`, '顶层')
}

function bumpDeep() {
    round += 1
    deepObj.value.child.v += 1
    shallowObj.value.child.v += 1
    shallowReObj.child.v += 1
    push(`改深层 .child.v → ${snapshot(round)}`, '深层', 'is-bad')
}

function replaceAll() {
    round += 1
    const v = deepObj.value.n + 10
    deepObj.value = make(v)
    shallowObj.value = make(v)
    shallowReObj.n = v
    push(`整体替换 .value → ${snapshot(round)}`, '替换', 'is-ok')
}

function reset() {
    deepObj.value = make()
    shallowObj.value = make()
    shallowReObj.n = 0
    shallowReObj.child.v = 0
    deepNotify.value = 0
    shallowNotify.value = 0
    shallowReNotify.value = 0
    logs.value = []
    seq = 0
    round = 0
    silentTimes.value = 0
    triggerTimes.value = 0
    maxGap.value = 0
}

/* ── triggerRef 实验 ────────────────────────────────── */
const silentTimes = ref(0)
const triggerTimes = ref(0)
const maxGap = ref(0)

// 这个 ref 跟着「已被通知到的值」走，用来和真实值做差
const acknowledged = ref(0)

watch(() => shallowObj.value, () => {
    acknowledged.value = shallowObj.value.child.v
})

function silentBump() {
    silentTimes.value += 1
    shallowObj.value.child.v += 1
    // 故意不调 triggerRef
}

function fireTrigger() {
    triggerTimes.value += 1
    triggerRef(shallowObj)
}

const gapNow = computed(() => shallowObj.value.child.v - acknowledged.value)

watch(gapNow, (g) => {
    if (g > maxGap.value) maxGap.value = g
})

const display = computed(() => acknowledged.value)

/* ── 展示用源码 ─────────────────────────────────────── */
const compareCode = `type Payload = { n: number; child: { v: number } }

const deep       = ref<Payload>({ n: 0, child: { v: 0 } })
const shallow    = shallowRef<Payload>({ n: 0, child: { v: 0 } })
const shallowRe  = shallowReactive<Payload>({ n: 0, child: { v: 0 } })

// ── 改内部属性（哪怕是第一层）────────────────────────
deep.value.n += 1            // ✅ ref 递归代理了每一层
shallow.value.n += 1         // ❌ shallowRef 眼里这只是改某个对象的属性
                             //    和 .value 这个引用无关，全程静默
shallowRe.n += 1             // ✅ shallowReactive 的顶层属性是响应式的

// ── 改更深的层 ──────────────────────────────────────
deep.value.child.v += 1      // ✅
shallow.value.child.v += 1   // ❌
shallowRe.child.v += 1       // ❌ 深层压根没被代理

// ── 整体替换 ────────────────────────────────────────
shallow.value = { n: 9, child: { v: 9 } }   // ✅ 只有这一条能让 shallowRef 动起来

// 一句话记法：
//   ref            → 往里看透，全都要管
//   shallowRef     → 只看 .value 换没换
//   shallowReactive→ 只看第一层属性`

const usageCode = `const el = ref<HTMLElement | null>(null)
const chart = shallowRef<ECharts | null>(null)

// ❌ 用 ref 包 ECharts 实例：Vue 会去深层代理它，
//    既拖慢初始化，还可能和实例内部状态打架
const chart = ref<ECharts | null>(null)

// ✅ shallowRef：实例原样保存，只在整体替换时更新一次
onMounted(() => {
  chart.value = echarts.init(el.value!)
})

onUnmounted(() => {
  chart.value?.dispose()
})

// 大数据列表也是同理：整棵树换掉才需要重渲染，
// 中间怎么增删都不用惊动 Vue
const rows = shallowRef<Row[]>([])
function reload(next: Row[]) {
  rows.value = next          // 整体替换，天然触发
}

// 万一真改了内部又想刷新，手动来一枪
rows.value[0].name = '改了'
triggerRef(rows)`
</script>

<style scoped>
.matrix {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
}

.matrix__head,
.matrix__row {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr;
    align-items: center;
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
    font-size: 13px;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

.matrix__cell.is-hot {
    color: var(--brand);
}

.matrix__verdict {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 9px 10px;
    background: var(--surface);
}

.matrix__verdict.is-ok {
    color: var(--success);
}

.matrix__verdict.is-bad {
    color: var(--danger);
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.probe-note em {
    font-style: normal;
    color: var(--brand);
}

.probe-note strong {
    color: var(--warning);
}

.readout {
    font-family: var(--font-mono);
    font-size: 26px;
    line-height: 1;
    color: var(--brand);
    padding: 6px 0 12px;
    font-variant-numeric: tabular-nums;
}

.log-block {
    margin-top: 14px;
}

@media (max-width: 760px) {
    .matrix__head {
        display: none;
    }

    .matrix__row {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>
