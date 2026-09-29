<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">toRef / toRefs</span>
                    <h2 class="panel__title">把响应式拆出来，还别把线剪断</h2>
                </div>
                <span class="panel__meta">拆的是「访问方式」，不是数据本身</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    这两个 API <em>只做一件事</em>：给响应式对象的某个属性套一层 ref 外壳，
                    让你可以<code>.value</code>地用、可以随便传参、可以解构，
                    而读写依旧<strong>穿透回原对象</strong>。
                    它们不复制数据——<code>toRef(obj, 'a').value === obj.a</code> 是同一个东西。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">toRef</span>
                        <span class="point__v">单个属性 → 单个 ref，适合只要一个字段的场景</span>
                    </div>
                    <div class="point">
                        <span class="point__k">toRefs</span>
                        <span class="point__v">整个对象 → 一组 ref，专为「解构后仍要响应式」而生</span>
                    </div>
                    <div class="point">
                        <span class="point__k">不复制</span>
                        <span class="point__v">改 ref 会写回源对象，反过来也一样，双向同步</span>
                    </div>
                    <div class="point">
                        <span class="point__k">只对响应源</span>
                        <span class="point__v">传普通对象进去只会得到一个没有联动能力的空壳 ref</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：三路对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">同一个 count，三种取出方式</h2>
                </div>
                <span class="panel__meta">源对象一动，谁跟着动、谁原地不动</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="bumpSource">源对象 form.count++</button>
                        <button type="button" class="w-btn" @click="bumpRef">refCount.value++</button>
                        <button type="button" class="w-btn" @click="bumpRefs">refsCount.value++</button>
                    </div>
                    <span class="w-hint">前两个理应写回源对象，看最上面那行是否同步跟着变</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="bumpRaw">给「解构快照」+1</button>
                        <button type="button" class="w-btn" @click="tick++">强制重渲染</button>
                        <button type="button" class="w-btn" @click="resetAll">全部归零</button>
                    </div>
                    <span class="w-hint">
                        快照是普通变量，改它<em>不会</em>通知视图——要点「强制重渲染」才会被读出来
                    </span>
                </div>

                <div class="src-bar">
                    <span class="src-bar__label">源对象</span>
                    <span class="src-bar__code mono">reactive({ count: <b>{{ form.count }}</b>, name: '{{ form.name }}' })</span>
                    <span class="src-bar__tick mono">重渲染 {{ tick }} 次</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">const { count } = form</h3>
                            <span class="card__tag is-bad">失去响应式</span>
                        </div>
                        <p class="card__desc">
                            解构拿到的是<strong>那一刻的值</strong>，一个普普通通的 number。
                            源再怎么变都与它无关；它自己变了也不通知任何人。
                        </p>
                        <div class="readout">{{ rawCount }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">是否 ref</span>
                                <span class="kv__v is-bad">false</span></div>
                            <div class="kv"><span class="kv__k">与源同步</span>
                                <span class="kv__v is-bad">{{ rawCount === form.count }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">toRef(form, 'count')</h3>
                            <span class="card__tag is-good">双向联动</span>
                        </div>
                        <p class="card__desc">
                            给单个属性套壳。读走 getter、写走 setter，
                            所以<strong>改它就是改源对象</strong>。适合只取一两个字段。
                        </p>
                        <div class="readout">{{ refCount }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">是否 ref</span>
                                <span class="kv__v is-ok">true</span></div>
                            <div class="kv"><span class="kv__k">与源同步</span>
                                <span class="kv__v is-ok">{{ refCount === form.count }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">toRefs(form).count</h3>
                            <span class="card__tag is-good">双向联动</span>
                        </div>
                        <p class="card__desc">
                            一次性把整个对象转成 ref 集合，<strong>解构也不断线</strong>。
                            组合式函数往外 return 一组状态时基本都用它。
                        </p>
                        <div class="readout">{{ refsCount }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">是否 ref</span>
                                <span class="kv__v is-ok">true</span></div>
                            <div class="kv"><span class="kv__k">与源同步</span>
                                <span class="kv__v is-ok">{{ refsCount === form.count }}</span></div>
                        </div>
                    </article>
                </div>

                <p class="after-note">
                    顺带看一眼那个「搭顺风车」现象：给解构快照 +1 之后界面不会立刻动，
                    但只要再触发一次重渲染（比如点源对象的按钮），模板重新读这个变量，
                    它<em>看起来</em>又更新了——其实只是蹭了别人的渲染，它本身依然不是响应式的。
                </p>
            </div>
        </section>

        <!-- ③ 实验二：实战场景 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">两个真正会用到的场景</h2>
                </div>
                <span class="panel__meta">props 解构与「字段可能还不存在」</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">props 里的 toRef</h3>
                            <span class="card__tag">保持单向数据流的响应式</span>
                        </div>
                        <p class="card__desc">
                            <code>props.xxx</code> 本身已响应，但一旦要把它<strong>交给 composable
                            长期盯着</strong>，就得先 toRef——否则那只是个快照。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">直接取</span>
                                <span class="kv__v is-bad">解构即定格</span></div>
                            <div class="kv"><span class="kv__k">toRef 后</span>
                                <span class="kv__v is-ok">跟着父组件更新</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">还不存在的字段</h3>
                            <span class="card__tag">toRef 可，解构不可</span>
                        </div>
                        <p class="card__desc">
                            字段此刻不存在也没关系：<code>toRef</code> 是按<strong>属性名</strong>
                            建的懒引用，将来补上就能读到；解构在那一刻取不到就永远是 undefined。
                        </p>
                        <div class="w-btns" style="margin: 10px 0">
                            <button type="button" class="w-btn" @click="addLaterField">给对象补上 score 字段</button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">lateObj.score</span>
                                <span class="kv__v">{{ lateScore === undefined ? 'undefined' : lateScore }}</span></div>
                            <div class="kv"><span class="kv__k">toRef 的 value</span>
                                <span class="kv__v" :class="lateScore === undefined ? 'is-bad' : 'is-ok'">
                                    {{ lateScore === undefined ? 'undefined' : lateScore }}
                                </span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">toRefs 配异步数据</h3>
                            <span class="card__tag is-bad">经典误区</span>
                        </div>
                        <p class="card__desc">
                            <code>const { list } = toRefs(store)</code> 之后整体
                            <code>store.list = newData</code>：<strong>换的是 store 里的属性</strong>，
                            <code>list</code> 这个 ref 依然指着它，所以照样能收到。
                        </p>
                        <div class="w-btns" style="margin: 10px 0">
                            <button type="button" class="w-btn" @click="swapList">整体替换 list</button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">list 长度</span>
                                <span class="kv__v">{{ listRef.length }}</span></div>
                            <div class="kv"><span class="kv__k">已替换</span>
                                <span class="kv__v is-ok">{{ swapTimes }} 次</span></div>
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
                    <div class="code-block__label">三路对照 · 为什么解构会断线</div>
                    <CodeEditor :code="compareCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">实战 · props 与组合式函数</div>
                    <CodeEditor :code="usageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef, toRefs, watch } from 'vue'

type Form = { count: number; name: string }

/* ── 实验一 ─────────────────────────────────────────── */
const form = reactive<Form>({ count: 0, name: '张三' })

// ① 直接解构：拿到的是那一刻的数值快照
// 用 let 是为了下面演示「改它也不会触发渲染」
let rawCount = form.count

// ② toRef：单字段套壳
const refCount = toRef(form, 'count')

// ③ toRefs：整对象套壳后再解构
const refsCount = toRefs(form).count

// 仅用于强制让组件重渲染，顺便显示次数
const tick = ref(0)

// 记录 ref 两端是否严格相等（每次变化都重新断言一遍）
const synced = ref(true)
watch(
    () => form.count,
    (n) => {
        synced.value = refCount.value === n && refsCount.value === n
    },
)

function bumpSource() {
    form.count += 1
}

function bumpRef() {
    refCount.value += 1
}

function bumpRefs() {
    refsCount.value += 1
}

function bumpRaw() {
    rawCount += 1 // 没有任何响应式系统知道这件事
}

function resetAll() {
    form.count = 0
    rawCount = 0
    synced.value = true
}

/* ── 实验二 ─────────────────────────────────────────── */
// 字段此刻还不存在，toRef 依然能按名字建引用
const lateObj = reactive<Record<string, number | undefined>>({})
const lateScore = toRef(lateObj, 'score')

function addLaterField() {
    lateObj.score = Math.floor(Math.random() * 100)
}

// toRefs 之后再整体替换属性
const storeObj = reactive<{ list: number[] }>({ list: [1, 2, 3] })
const listRef = toRefs(storeObj).list
const swapTimes = ref(0)

function swapList() {
    swapTimes.value += 1
    storeObj.list = Array.from({ length: 3 + swapTimes.value }, (_, i) => i + 1)
}

/* ── 展示用源码 ─────────────────────────────────────── */
const compareCode = `const form = reactive({ count: 0, name: '张三' })

// ① 直接解构 —— 得到一个普通的 number 快照
let rawCount = form.count
form.count = 10        // rawCount 还是 0
rawCount = 999         // form.count 还是 10，视图也不会动

// ② toRef —— 单字段 getter/setter 包装
const refCount = toRef(form, 'count')
refCount.value = 5     // ✅ form.count 同步变成 5
form.count = 8         // ✅ refCount.value 同步变成 8

// ③ toRefs —— 整对象批量包装，解构不断线
const { count, name } = toRefs(form)
count.value++          // ✅ form.count +1

// 它俩本质上都在读写同一个属性：
refCount.value === form.count   // true（同一份数据，不是副本）`

const usageCode = `// 场景一：把 props 的某个字段交给 composable 长期盯着
const props = defineProps<{ userId: string }>()

// ❌ 传快照：props 更新后这里是死值
useUserWatcher(props.userId)

// ✅ 传 ref：父组件一变就跟着重跑
useUserWatcher(toRef(props, 'userId'))

// 场景二：字段可能要晚一点才补上
const obj = reactive<Record<string, number>>({})
const score = toRef(obj, 'score')   // 此刻是 undefined，但引用合法
obj.score = 88                       // score.value 立刻变成 88

// 场景三：组合式函数 return 一组状态时保持解构能力
export function useMouse() {
  const state = reactive({ x: 0, y: 0 })
  return { ...toRefs(state) }        // 调用方可以 const { x, y } = useMouse()
}`
</script>

<style scoped>
.src-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.src-bar__label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
}

.src-bar__code {
    font-size: 12px;
    color: var(--text-secondary);
}

.src-bar__code b {
    color: var(--brand);
    font-size: 15px;
}

.src-bar__tick {
    margin-left: auto;
    font-size: 11px;
    color: var(--text-tertiary);
}

.readout {
    font-family: var(--font-mono);
    font-size: 26px;
    line-height: 1;
    color: var(--brand);
    padding: 6px 0 12px;
    font-variant-numeric: tabular-nums;
}

.kv-grid {
    margin-top: 10px;
}

.after-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-tertiary);
    max-width: 860px;
}

.after-note em {
    font-style: normal;
    color: var(--brand);
}
</style>
