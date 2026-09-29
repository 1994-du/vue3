<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Template Ref</span>
                    <h2 class="panel__title">ref 这个词，在 Vue 里是三个东西</h2>
                </div>
                <span class="panel__meta">响应式数据、DOM 元素、组件实例</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    同一个 <code>ref</code> 有三重身份，刚上手最容易混：<strong>①</strong>
                    <code>ref(0)</code> 是一个响应式数据的容器；<strong>②</strong> 写在模板上
                    <code>&lt;div ref="box"&gt;</code>，拿到的是那个真实 DOM 元素；
                    <strong>③</strong> 写在组件上 <code>&lt;Child ref="c"&gt;</code>，
                    拿到的是子组件的实例（而且是<em>它主动暴露出来</em>的那一小部分）。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">什么时候才拿得到</span>
                        <span class="point__v">挂载之后。setup 期间它是 null，要放在 onMounted 或事件里读</span>
                    </div>
                    <div class="point">
                        <span class="point__k">组件 ref 拿到了什么</span>
                        <span class="point__v">只有 defineExpose() 列出来的那些；不写就是空的（Vue3 的安全默认）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">v-for 上的 ref</span>
                        <span class="point__v">拿到的是数组，且<strong>顺序不保证</strong>与数据源一致</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 拿 DOM -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">拿到元素之后能做什么</h2>
                </div>
                <span class="panel__meta">下面的数字都是此刻真实测量出来的</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    拿到 DOM 元素之后，你能做任何原生 API 能做的事：测几何、聚焦、
                    滚动、选中、甚至调第三方库去初始化图表。但记得 ——
                    <em>能用响应式解决的，就别碰 DOM</em>。
                </p>

                <div class="probe-box">
                    <div ref="boxEl" class="probe-box__target" :style="{ width: boxWidth + 'px' }">
                        <span class="mono">我就是要被测量的那个元素</span>
                    </div>
                </div>

                <div class="cfg">
                    <div class="cfg__row">
                        <span class="cfg__k">盒子宽度</span>
                        <input v-model.number="boxWidth" type="range" min="120" max="420" class="cfg__range">
                        <span class="cfg__v mono">{{ boxWidth }} px</span>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="measure">① 读取几何信息</button>
                        <button type="button" class="w-btn" @click="focusInput">② 聚焦并全选输入框</button>
                        <button type="button" class="w-btn" @click="scrollToBox">③ 滚动到它</button>
                        <button type="button" class="w-btn" @click="flash">④ 直接改它的 style</button>
                    </div>
                    <span class="w-hint">元素引用：{{ boxEl ? '已挂载' : 'null（还没挂载）' }}</span>
                </div>

                <input ref="inputEl" v-model="text" class="cmd-search" placeholder="点上面的「聚焦并全选」">

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">offsetWidth</span>
                        <span class="kv__v mono">{{ geo.w || '—' }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">offsetHeight</span>
                        <span class="kv__v mono">{{ geo.h || '—' }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">getBoundingClientRect().top</span>
                        <span class="kv__v mono">{{ geo.top === null ? '—' : geo.top.toFixed(1) }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">computed 出来的背景色</span>
                        <span class="kv__v mono">{{ geo.bg || '—' }}</span>
                    </div>
                </div>

                <p class="probe-note">
                    注意 <code>getBoundingClientRect()</code> 给的是<strong>相对视口</strong>的位置，
                    页面滚动时会变；<code>offsetTop</code> 则是相对父元素的布局位置。
                    做「滚动到某个位置」这类需求时，别把两者搞混。
                </p>
            </div>
        </section>

        <!-- ③ 拿组件实例 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">父组件调用子组件的方法</h2>
                </div>
                <span class="panel__meta">子组件用 defineExpose 主动交出来的那部分</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    Vue3 里，父组件<strong>拿不到子组件的任何内部状态</strong>，除非子组件自己写
                    <code>defineExpose({ ... })</code>。这不是麻烦，是<em>刻意的封装</em> ——
                    父组件能碰到的永远是那几个白名单方法，内部 ref 怎么改都不影响外部。
                </p>

                <div class="nest">
                    <div class="nest__title">
                        <span>子组件实例</span>
                        <span class="nest__badge">defineExpose 暴露了 3 个方法</span>
                    </div>
                    <CounterBox ref="childRef" />
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="childRef?.inc()">child.inc()</button>
                        <button type="button" class="w-btn" @click="childRef?.reset()">child.reset()</button>
                        <button type="button" class="w-btn" @click="readChild">child.get() 读一次</button>
                    </div>
                    <span class="w-hint">父组件读到的值：{{ childValue === null ? '—' : childValue }}</span>
                </div>
            </div>
        </section>

        <!-- ④ v-for 的 ref 数组 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 03</span>
                    <h2 class="panel__title">v-for 上面挂 ref，得到的是数组</h2>
                </div>
                <span class="panel__meta">而且顺序不保证跟数据源一致</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    在 <code>v-for</code> 里写 <code>ref</code>，Vue 会把收集到的元素放进一个数组。
                    坑在于：<strong>这个数组的顺序不保证与你的数据源一致</strong>，
                    排序、过滤之后就更没法依赖下标了。要精确定位，就自己用
                    <code>:ref="(el) => setRef(el, item.id)"</code> 存成 Map。
                </p>

                <div class="input-row">
                    <div v-for="item in items" :key="item.id" class="input-row__cell">
                        <span class="input-row__label mono">{{ item.label }}</span>
                        <input :ref="(el) => setItemRef(el, item.id)" v-model="item.value" class="cmd-search cmd-search--sm">
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="focusById(2)">聚焦 id=2 的那个</button>
                        <button type="button" class="w-btn" @click="clearAll">清空全部</button>
                        <button type="button" class="w-btn" @click="shuffle">打乱顺序（看 ref 会不会乱）</button>
                    </div>
                    <span class="w-hint">已收集 {{ refMapSize }} 个元素引用</span>
                </div>

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">用 Map 存引用</span>
                        <span class="kv__v is-ok">按 id 精确取，顺序变了也不受影响</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">用数组存引用</span>
                        <span class="kv__v is-bad">依赖下标，数据源一排序就错位</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">三种写法与注意事项</h2>
                </div>
                <span class="panel__meta">和上面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">DOM ref / 组件 ref / v-for ref</div>
                    <CodeEditor :code="refCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">什么时候该用 ref，什么时候不该</div>
                    <CodeEditor :code="whenCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, h, onMounted, ref } from 'vue'

/* ── 实验一：DOM 元素 ────────────────────────────────── */
const boxEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const boxWidth = ref(240)
const text = ref('这个值由输入框自己维护')

const geo = ref<{ w: number; h: number; top: number | null; bg: string }>({
    w: 0,
    h: 0,
    top: null,
    bg: '',
})

function measure() {
    const el = boxEl.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    geo.value = {
        w: el.offsetWidth,
        h: el.offsetHeight,
        top: rect.top,
        bg: getComputedStyle(el).backgroundColor,
    }
}

function focusInput() {
    inputEl.value?.focus()
    inputEl.value?.select()
}

function scrollToBox() {
    boxEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function flash() {
    const el = boxEl.value
    if (!el) return
    el.style.borderColor = 'var(--brand)'
    el.style.boxShadow = 'inset 0 0 0 1px var(--brand)'
    window.setTimeout(() => {
        el.style.borderColor = ''
        el.style.boxShadow = ''
    }, 700)
}

/* ── 实验二：子组件实例 ──────────────────────────────── */
type ChildApi = {
    inc: () => number
    reset: () => void
    get: () => number
}

/** 一个真实存在的子组件：内部状态不外泄，只交出三个方法 */
const CounterBox = defineComponent({
    name: 'CounterBox',
    setup(_props, { expose }) {
        const n = ref(0)
        const bump = () => {
            n.value += 1
            return n.value
        }
        expose({
            inc: bump,
            reset: () => {
                n.value = 0
            },
            get: () => n.value,
        } satisfies ChildApi)
        return () =>
            h('div', { class: 'child-box' }, [
                h('span', { class: 'mono' }, `内部计数：${n.value}`),
                h('span', { class: 'child-box__hint' }, '（父组件只能通过暴露出来的方法碰到它）'),
            ])
    },
})

const childRef = ref<ChildApi | null>(null)
const childValue = ref<number | null>(null)

function readChild() {
    childValue.value = childRef.value?.get() ?? null
}

/* ── 实验三：v-for 上的 ref ──────────────────────────── */
type Item = { id: number; label: string; value: string }

const items = ref<Item[]>([
    { id: 1, label: '字段 A', value: 'a' },
    { id: 2, label: '字段 B', value: 'b' },
    { id: 3, label: '字段 C', value: 'c' },
    { id: 4, label: '字段 D', value: 'd' },
])

const refMap = new Map<number, HTMLInputElement>()
// 用 ref 触发一次重渲染，让上面的「已收集 N 个」显示得出来
const refMapSize = ref(refMap.size)

function setItemRef(el: unknown, id: number) {
    if (el instanceof HTMLInputElement) refMap.set(id, el)
    else refMap.delete(id)
    refMapSize.value = refMap.size
}

function focusById(id: number) {
    refMap.get(id)?.focus()
}

function clearAll() {
    items.value.forEach((i) => {
        i.value = ''
    })
}

function shuffle() {
    items.value = [...items.value].reverse()
}

onMounted(() => {
    measure()
})

/* ── 展示用源码 ─────────────────────────────────────── */
const refCode = `<script setup lang="ts">
import { onMounted, ref } from 'vue'

// ① 拿 DOM：变量名要和模板上的 ref 属性一致
const boxEl = ref<HTMLElement | null>(null)

onMounted(() => {
  console.log(boxEl.value?.offsetWidth)   // ← 这里才拿得到，setup 期间是 null
})

function measure() {
  const el = boxEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()  // 相对视口
  console.log(el.offsetWidth, rect.top)
}
<\/script>

<template>
  <div ref="boxEl">…</div>
</template>

// ② 拿组件实例：子组件必须自己 defineExpose
// Child.vue
const n = ref(0)
defineExpose({
  inc: () => ++n.value,
  reset: () => (n.value = 0),
})

// 父组件
<Child ref="childRef" />
childRef.value?.inc()

// ③ v-for 上的 ref：推荐用函数形式存成 Map，别依赖数组下标
const refMap = new Map<number, HTMLInputElement>()
function setItemRef(el: unknown, id: number) {
  if (el instanceof HTMLInputElement) refMap.set(id, el)
  else refMap.delete(id)      // 元素卸载时 el 是 null，要记得删掉，否则内存泄漏
}

<input v-for="item in list" :key="item.id" :ref="(el) => setItemRef(el, item.id)" />`

const whenCode = `// ── 该用 ref 的场景 ──────────────────────────────────
// 1. 管理焦点、选中、播放：input.focus() / video.play()
// 2. 测量元素几何：做虚拟列表、吸顶、动画起始位置
// 3. 集成第三方库：ECharts.init(el)、地图初始化（它们就只认 DOM）
// 4. 调用子组件命令式的方法：打开弹窗、重置表单、播放动画

// ── 不该用的场景 ──────────────────────────────────────
// ❌ el.style.color = 'red'
//    → 应该用 :style 或 class，交给响应式
// ❌ el.innerText = count
//    → 模板插值 {{ count }} 就够了
// ❌ 在 watch 里立刻读刚改过的 DOM
//    → DOM 更新是异步的，要等 nextTick()
//      await nextTick(); console.log(el.offsetWidth)

// ── 两个常踩的坑 ──────────────────────────────────────
// ① v-if 控制的 ref：条件为 false 时引用是 null
//    判断一下再调用，否则 Cannot read properties of null
// ② 组件卸载时 v-for 的函数 ref 会收到 null
//    一定要在这个分支里把 Map 里的引用删掉

// ── Vue 3.5+ 的写法 ───────────────────────────────────
// useTemplateRef 可以省掉「变量名要对应」这件事
import { useTemplateRef } from 'vue'
const box = useTemplateRef<HTMLElement>('box')   // 模板里写 ref="box"`
</script>

<style lang="scss" scoped>
.probe-box {
    padding: 16px;
    margin-bottom: 12px;
    border: 1px dashed var(--hairline);
    background: var(--app-bg);
}

.probe-box__target {
    display: grid;
    place-items: center;
    height: 84px;
    margin: 0 auto;
    font-size: 12px;
    color: var(--text-primary);
    border: 1px solid var(--hairline);
    background: var(--brand);
    transition: width 0.15s ease;
}

.cfg {
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.cfg__row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.cfg__k {
    flex-shrink: 0;
    min-width: 92px;
    font-size: 12px;
    color: var(--text-tertiary);
}

.cfg__v {
    min-width: 62px;
    font-size: 12px;
    color: var(--brand);
}

.cfg__range {
    flex: 1;
    max-width: 300px;
    accent-color: var(--brand);
}

.input-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
}

.input-row__label {
    display: block;
    margin-bottom: 4px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.cmd-search--sm {
    flex: 1 1 auto;
    width: 100%;
}

:deep(.child-box) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--text-secondary);
}

:deep(.child-box__hint) {
    font-size: 11px;
    color: var(--text-tertiary);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}
</style>
