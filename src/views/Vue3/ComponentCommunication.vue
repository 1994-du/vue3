<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Component Communication</span>
                    <h2 class="panel__title">八条路，挑对的那条走</h2>
                </div>
                <span class="panel__meta">选一种方式，看它的数据往哪流</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    组件通信没有「最好的方案」，只有<em>合适的层级</em>。
                    判断依据其实就两条：<strong>数据是往下传、往上冒，还是要在无亲缘关系的组件间穿行</strong>；
                    以及<strong>要不要长期共享</strong>。
                    父子两级就用 props / emit 老老实实走，跨好几层用 provide/inject 省事，
                    真要全局共享就该交給 Pinia——别用事件总线把应用织成一张看不清的网。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">单向数据流</span>
                        <span class="point__v">props 只读，子组件想改必须 emit 通知父组件改</span>
                    </div>
                    <div class="point">
                        <span class="point__k">就近VS全局</span>
                        <span class="point__v">能局部解决的不要提到全局，否则一处改动到处受影响</span>
                    </div>
                    <div class="point">
                        <span class="point__k">事件总线</span>
                        <span class="point__v">方便但难追踪，兄弟通信优先考虑状态管理</span>
                    </div>
                    <div class="point">
                        <span class="point__k">TS 友好</span>
                        <span class="point__v">defineProps / defineEmits 带泛型，能拿到完整类型推断</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 方式总览 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Overview</span>
                    <h2 class="panel__title">点一张卡，看它的流向</h2>
                </div>
                <span class="panel__meta">当前选中：{{ cur.name }}</span>
            </div>
            <div class="panel__body">
                <div class="cards way-grid">
                    <article v-for="w in ways" :key="w.key" class="card way-card"
                        :class="{ 'is-picked': cur.key === w.key }" @click="pick(w.key)">
                        <div class="card__head">
                            <h3 class="card__title mono">{{ w.name }}</h3>
                            <span class="card__tag" :class="w.tagTone">{{ w.scope }}</span>
                        </div>
                        <p class="card__desc">{{ w.desc }}</p>
                        <div class="way-card__foot">
                            <span class="way-card__dir mono">{{ w.dir }}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 流向图 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Flow</span>
                    <h2 class="panel__title">{{ cur.name }} · 数据怎么走</h2>
                </div>
                <span class="panel__meta">{{ cur.oneLiner }}</span>
            </div>
            <div class="panel__body">
                <div class="flow">
                    <div v-for="(node, i) in cur.nodes" :key="i" class="flow__col">
                        <div class="flow__node" :class="`is-${node.role}`">
                            <span class="flow__node-tag mono">{{ node.tag }}</span>
                            <span class="flow__node-name">{{ node.name }}</span>
                        </div>
                        <div v-if="i < cur.nodes.length - 1" class="flow__arrow">
                            <span class="flow__arrow-line"></span>
                            <span class="flow__arrow-label mono">{{ cur.hops[i] }}</span>
                        </div>
                    </div>
                </div>

                <div class="wrap-grid">
                    <div>
                        <div class="code-block__label">适用场景</div>
                        <ul class="tick-list">
                            <li v-for="(p, i) in cur.pros" :key="i">{{ p }}</li>
                        </ul>
                    </div>
                    <div>
                        <div class="code-block__label">要注意的地方</div>
                        <ul class="tick-list is-warn-list">
                            <li v-for="(c, i) in cur.cons" :key="i">{{ c }}</li>
                        </ul>
                    </div>
                </div>

                <div class="code-block" style="margin-top: 16px">
                    <div class="code-block__label">最小可运行写法</div>
                    <CodeEditor :code="cur.code" />
                </div>
            </div>
        </section>

        <!-- ④ 实战：一条龙 demo -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">把三种方式装进同一个购物车</h2>
                </div>
                <span class="panel__meta">props 往下、emit 往上、provide 跨层</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="addItem">加一件商品</button>
                        <button type="button" class="w-btn" @click="toggleTheme">切换主题（provide）</button>
                        <button type="button" class="w-btn" @click="resetCart">清空</button>
                    </div>
                    <span class="w-hint">
                        中间的「中间层」组件既没接 props 也没写 provide——它只是把孙子渲染出来，
                        照样能拿到最顶层的数据
                    </span>
                </div>

                <div class="demo">
                    <div class="nest">
                        <div class="nest__title">
                            RootPanel
                            <span class="nest__badge">持有数据源 + provide</span>
                        </div>
                        <div class="demo__row">
                            <div class="kv-grid">
                                <div class="kv"><span class="kv__k">cart.count</span>
                                    <span class="kv__v">{{ cart.length }} 件</span></div>
                                <div class="kv"><span class="kv__k">theme</span>
                                    <span class="kv__v is-ok">{{ theme }}</span></div>
                            </div>
                        </div>

                        <div class="nest">
                            <div class="nest__title">
                                MiddleBox
                                <span class="nest__badge">纯透传，零 props</span>
                            </div>
                            <p class="nest__note">
                                这一层不知道购物车里有什么，也不关心主题，
                                它的全部职责就是把下面的组件渲染出来。
                            </p>

                            <div class="nest">
                                <div class="nest__title">
                                    CartList
                                    <span class="nest__badge">props in · emit out</span>
                                </div>
                                <div class="cart">
                                    <div v-for="it in cart" :key="it.id" class="cart__row">
                                        <span class="cart__name mono">{{ it.name }}</span>
                                        <span class="cart__price mono">¥{{ it.price }}</span>
                                        <button type="button" class="w-btn cart__del" @click="emitRemove(it.id)">
                                            删除 → emit
                                        </button>
                                    </div>
                                    <div v-if="!cart.length" class="cart__empty mono">cart is empty</div>
                                </div>
                                <div class="kv-grid" style="margin-top: 10px">
                                    <div class="kv"><span class="kv__k">inject 到手</span>
                                        <span class="kv__v is-ok">{{ injectedTheme }}</span></div>
                                    <div class="kv"><span class="kv__k">经过层数</span>
                                        <span class="kv__v">跳过 1 层</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="log-block">
                    <div class="code-block__label">通信日志</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 点上面的按钮，看数据走的是哪条路</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, readonly, ref, type Ref } from 'vue'

/* ── 八种通信方式 ───────────────────────────────────── */
type Way = {
    key: string
    name: string
    scope: string
    tagTone?: string
    dir: string
    desc: string
    oneLiner: string
    nodes: { tag: string; name: string; role: string }[]
    hops: string[]
    pros: string[]
    cons: string[]
    code: string
}

const ways: Way[] = [
    {
        key: 'props',
        name: 'props / defineProps',
        scope: '父 → 子',
        tagTone: 'is-good',
        dir: 'down',
        desc: '最基础的下行通道。子组件只读，想改必须通知父组件。',
        oneLiner: '数据往下走，子组件不许直接改',
        nodes: [
            { tag: 'parent', name: 'Parent', role: 'source' },
            { tag: 'props', name: 'Child', role: 'sink' },
        ],
        hops: ['v-bind="data"'],
        pros: [
            '数据流清晰，一眼能看出某值由谁提供',
            '配合 TS 泛型可拿到完整类型推断与校验',
            '子组件保持纯函数性质，便于复用和测试',
        ],
        cons: [
            '跨多层时要逐层手写 v-bind，写起来啰嗦',
            '子组件万万不可直接给 props 赋值',
            '传对象/数组时是引用，容易不小心改到源数据',
        ],
        code: `<!-- 父组件 -->
<Child :count="count" :user="user" />

<!-- 子组件 -->
<script setup lang="ts">
interface Props { count: number; user: User }
const props = defineProps<Props>()

// props 只读，直接用 count 即可（模板自动解包）
console.log(props.count)
<\/script>`,
    },
    {
        key: 'emit',
        name: 'emit / defineEmits',
        scope: '子 → 父',
        tagTone: 'is-good',
        dir: 'up',
        desc: '子组件唯一的合法上报手段：发个事件，让父组件自己改。',
        oneLiner: '事件往上冒，改数据的权力留在源头',
        nodes: [
            { tag: 'child', name: 'Child', role: 'source' },
            { tag: '@event', name: 'Parent', role: 'sink' },
        ],
        hops: ['emit("change", val)'],
        pros: [
            '维持单向数据流，状态变更集中在一处',
            'defineEmits 可声明事件签名并做类型检查',
            '天然支持多个监听器',
        ],
        cons: [
            '孙子要上报得一层层往上抛，中间层被迫当传声筒',
            '事件名是字符串，重构时容易改漏',
            '过度使用会让组件间耦合变高',
        ],
        code: `<!-- 子组件 -->
<script setup lang="ts">
const emit = defineEmits<{
  change: [value: string]
  remove: [id: number]
}>()

emit('change', 'hello')
<\/script>

<!-- 父组件 -->
<Child @change="handleChange" @remove="removeItem" />

<!-- 中间层被迫透传时，可以整包转发 -->
<GrandChild v-bind="$attrs" @change="$emit('change', $event)" />`,
    },
    {
        key: 'vmodel',
        name: 'v-model',
        scope: '父子双向',
        tagTone: 'is-good',
        dir: 'both',
        desc: 'props + emit 的语法糖，让双向绑定写起来像一行。',
        oneLiner: '本质还是 props 下行、事件上行',
        nodes: [
            { tag: 'parent', name: 'Parent', role: 'both' },
            { tag: 'v-model', name: 'Child', role: 'both' },
        ],
        hops: ['prop + update:event'],
        pros: [
            '一行搞定双向绑定，写起来最省事',
            'Vue 3 支持多个 v-model：v-model:title / v-model:content',
            '可以自定义修饰符，比如 v-model.trim',
        ],
        cons: [
            '底层仍是 props + emit，别以为能绕过单向数据流',
            '多个 v-model 时命名要规范，否则容易混',
            '复杂表单还是建议用表单库管理',
        ],
        code: `<!-- 父组件：默认 modelValue -->
<MyInput v-model="keyword" />

<!-- 具名 v-model，可以绑多个 -->
<Editor v-model:title="title" v-model:body="body" />

<!-- 子组件的实现 -->
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
<\/script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>`,
    },
    {
        key: 'provide',
        name: 'provide / inject',
        scope: '任意祖先 → 后代',
        tagTone: 'is-good',
        dir: 'down-far',
        desc: '祖先注册、后代按需取用，中间多少层都不用管。',
        oneLiner: '跳过中间所有层，直接投喂',
        nodes: [
            { tag: 'provide', name: 'Ancestor', role: 'source' },
            { tag: 'middle', name: 'Middle ×N', role: 'passthrough' },
            { tag: 'inject', name: 'Descendant', role: 'sink' },
        ],
        hops: ['provide(key)', '任意深度直达'],
        pros: [
            '彻底消灭逐层透传的样板代码',
            '适合主题、国际化、表单上下文这类「环境级」数据',
            '可以 provide 一个 readonly 的 ref 加 methods，形成受控状态',
        ],
        cons: [
            '数据来源不明确，调试时不好追溯谁提供的',
            '响应式要自己保证（provide 出去的必须是 ref / reactive）',
            '建议在 provide 侧一起给修改方法，避免后代乱改',
        ],
        code: `// 祖先组件
<script setup lang="ts">
import { provide, readonly, ref } from 'vue'

const theme = ref('dark')
provide('theme', readonly(theme))       // 只读，后代改不了
provide('setTheme', (t: string) => { theme.value = t })  // 要改走这个方法
<\/script>

// 任意深度的后代
<script setup lang="ts">
import { inject, type Ref } from 'vue'

const theme = inject<Ref<string>>('theme')
const setTheme = inject<(t: string) => void>('setTheme')
<\/script>`,
    },
    {
        key: 'expose',
        name: 'ref + defineExpose',
        scope: '父 → 子（命令式）',
        tagTone: 'is-warn',
        dir: 'down',
        desc: '拿到子组件实例，直接调它暴露出来的方法。',
        oneLiner: '逃生舱：只有暴露出来的才摸得到',
        nodes: [
            { tag: 'parent', name: 'Parent', role: 'source' },
            { tag: 'ref', name: 'Child 实例', role: 'sink' },
        ],
        hops: ['childRef.value.fn()'],
        pros: [
            '适合「让某个组件聚焦 / 播放 / 重置」这类一次性动作',
            'defineExpose 明确圈定了可访问范围，比 Vue 2 安全',
            '不用为了一次调用专门设计 props 状态',
        ],
        cons: [
            '绕过了数据流，滥用会让状态变更难以追踪',
            '必须等 mounted 之后才能拿到实例',
            '<script setup> 默认全封闭，必须显式 defineExpose',
        ],
        code: `<!-- 子组件：明确交出哪些东西 -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
function reset() { count.value = 0 }

defineExpose({ reset, count })   // 不写的话外部什么都取不到
<\/script>

<!-- 父组件 -->
<script setup lang="ts">
import { ref } from 'vue'
const dialog = ref<InstanceType<typeof MyDialog> | null>(null)
dialog.value?.open()
<\/script>

<template>
  <MyDialog ref="dialog" />
</template>`,
    },
    {
        key: 'mitt',
        name: 'mitt 事件总线',
        scope: '任意组件之间',
        tagTone: 'is-bad',
        dir: 'any',
        desc: '一个极小的发布订阅对象，谁都能 emit、谁都能 on。',
        oneLiner: '方便，但也最容易失控',
        nodes: [
            { tag: 'emit', name: 'Component A', role: 'both' },
            { tag: 'bus', name: 'bus', role: 'passthrough' },
            { tag: 'on', name: 'Component B', role: 'both' },
        ],
        hops: ['bus.emit(k, v)', 'bus.on(k, cb)'],
        pros: [
            '任意两个组件都能通信，不用管层级',
            '库本身不到 200 行，接入成本极低',
            '适合一次性通知（比如全局提示、登出广播）',
        ],
        cons: [
            '数据流彻底隐形，出问题时很难定位来源',
            '组件卸载时忘了 off 就会泄漏，重复绑定还会重复触发',
            '绝大多数场景都能被 Pinia 更好地替代',
        ],
        code: `// utils/bus.ts
import mitt from 'mitt'

type Events = {
  'cart:add': { id: number; name: string }
  'user:logout': void
}

export const bus = mitt<Events>()   // 带上类型，至少 emit 的参数不会写错

// A 组件
bus.emit('cart:add', { id: 1, name: '键盘' })

// B 组件
import { onUnmounted } from 'vue'
const handler = (e: Events['cart:add']) => console.log(e)
bus.on('cart:add', handler)
onUnmounted(() => bus.off('cart:add', handler))   // ⚠️ 一定要解绑`,
    },
    {
        key: 'pinia',
        name: 'Pinia',
        scope: '全局共享',
        tagTone: 'is-good',
        dir: 'any',
        desc: '官方状态管理。跨路由、跨模块共享数据的正解。',
        oneLiner: '需要长期存在的共享状态就交给它',
        nodes: [
            { tag: 'any', name: '任意组件', role: 'both' },
            { tag: 'store', name: 'Pinia Store', role: 'source' },
            { tag: 'any', name: '任意组件', role: 'both' },
        ],
        hops: ['useStore()', '响应式共享'],
        pros: [
            '状态集中管理，devtools 里能看到完整变更时间线',
            '天然支持 SSR、模块自动按需引入',
            '没有 mutations，action 里爱同步异步都行',
        ],
        cons: [
            '小项目或组件内部状态用它属于过度设计',
            '所有东西都塞进 store 会让 store 变成垃圾桶',
            '刷新即丢失，持久化要自己接插件',
        ],
        code: `// stores/cart.ts
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Item[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))

  function add(item: Item) { items.value.push(item) }
  function clear() { items.value = [] }

  return { items, total, add, clear }
})

// 任意组件
const cart = useCartStore()
cart.add({ id: 1, name: '键盘', price: 399 })
cart.total          // 自动算出来了

// 解构时记得 storeToRefs，否则会丢响应式
const { items, total } = storeToRefs(cart)`,
    },
    {
        key: 'storage',
        name: 'URL / Storage',
        scope: '跨页面',
        tagTone: 'is-warn',
        dir: 'any',
        desc: '刷新后仍需保留，或要分享、要能被后退的情况。',
        oneLiner: '出了应用边界的那一类数据',
        nodes: [
            { tag: 'page', name: '页面 A', role: 'both' },
            { tag: 'URL', name: 'query / localStorage', role: 'passthrough' },
            { tag: 'page', name: '页面 B', role: 'both' },
        ],
        hops: ['写入', '读取'],
        pros: [
            '刷新不丢，可直接分享链接给其他人',
            '路由参数能被浏览器后退键正确处理',
            'SSR 场景下是唯一可行的通信方式',
        ],
        cons: [
            '只能存字符串，复杂结构要自己序列化',
            'localStorage 是同步 API，大数据量会阻塞主线程',
            '同标签页内的数据变更不会自动通知另一个组件',
        ],
        code: `// 路由参数：适合列表筛选条件这类「可分享的状态」
const route = useRoute()
const router = useRouter()

watch(() => route.query.page, (p) => load(Number(p ?? 1)))
router.replace({ query: { ...route.query, page: '2' } })   // 写回 URL

// localStorage：适合主题、草稿这类「刷新还要在」的数据
watch(theme, (t) => localStorage.setItem('theme', t), { immediate: true })

// ⚠️  storage 事件只在「其他标签页」触发，
//    同一个标签页里改了不会通知自己，需要自己包一层 ref`,
        },
]

const pickedKey = ref('props')
const cur = computed(() => ways.find((w) => w.key === pickedKey.value) ?? ways[0])

function pick(key: string) {
    pickedKey.value = key
}

/* ── 实战 demo ──────────────────────────────────────── */
type CartItem = { id: number; name: string; price: number }

const cart = ref<CartItem[]>([
    { id: 1, name: '机械键盘', price: 399 },
    { id: 2, name: '显示器支架', price: 259 },
])

const theme = ref<'dark' | 'light'>('dark')

// provide 出去的是 readonly 的 ref + 一个专门的修改方法，
// 后代只能读、或者走 setTheme 改，形成受控访问。
type DemoTheme = 'dark' | 'light'
provide('demo-theme', readonly(theme))
provide('demo-setTheme', (t: DemoTheme) => {
    theme.value = t
})

// 后代取用（这里同页面演示，真实场景中它在任意深度的子组件里）
const injectedTheme = inject<Readonly<Ref<DemoTheme>>>('demo-theme')
const injectedSetter = inject<(t: DemoTheme) => void>('demo-setTheme')

type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0
let autoId = 3

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 30)
}

function addItem() {
    const item: CartItem = {
        id: autoId++,
        name: ['键帽套装', '桌垫', 'USB 集线器', '显示器'][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 400) + 50,
    }
    cart.value = [...cart.value, item]
    push(`新增「${item.name}」￥${item.price} —— props 往下传给了列表`, 'props')
}

function emitRemove(id: number) {
    const target = cart.value.find((i) => i.id === id)
    cart.value = cart.value.filter((i) => i.id !== id)
    push(`子组件的删除按钮 emit('remove', ${id})，父组件移除「${target?.name ?? '未知'}」`, 'emit', 'is-bad')
}

function toggleTheme() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    injectedSetter?.(next)
    push(`通过 provide 出去的 setTheme 改成 ${next}，跳过了中间层直达后代`, 'provide', 'is-ok')
}

function resetCart() {
    cart.value = []
    push('清空购物车 —— 状态变更始终发生在持有数据的那一层', 'props')
}
</script>

<style scoped>
.way-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.way-card {
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
}

.way-card:hover {
    border-color: var(--brand);
}

.way-card.is-picked {
    border-color: var(--brand);
    background: var(--brand-soft);
}

.way-card__foot {
    display: flex;
    align-items: center;
    gap: 8px;
}

.way-card__dir {
    font-size: 11px;
    color: var(--text-tertiary);
}

/* 流向图：横排节点 + 中间带标签的箭头 */
.flow {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 0;
    padding: 16px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    overflow-x: auto;
}

.flow__col {
    display: flex;
    align-items: center;
}

.flow__node {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 130px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.flow__node.is-source {
    border-color: var(--brand);
}

.flow__node.is-sink {
    border-color: var(--success);
}

.flow__node.is-both {
    border-color: var(--brand);
}

.flow__node.is-passthrough {
    border-style: dashed;
    color: var(--text-tertiary);
}

.flow__node-tag {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.flow__node-name {
    font-size: 13px;
    color: var(--text-primary);
}

.flow__arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 90px;
    padding: 0 6px;
}

.flow__arrow-line {
    position: relative;
    width: 100%;
    height: 1px;
    background: var(--brand);
}

.flow__arrow-line::after {
    content: '';
    position: absolute;
    right: -1px;
    top: -3px;
    border-left: 6px solid var(--brand);
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
}

.flow__arrow-label {
    font-size: 10px;
    color: var(--text-tertiary);
}

.wrap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 14px;
    margin-top: 16px;
}

.tick-list {
    margin: 0;
    padding: 10px 12px 10px 26px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    font-size: 12px;
    line-height: 1.9;
    color: var(--text-secondary);
}

.tick-list li::marker {
    color: var(--success);
}

.tick-list.is-warn-list li::marker {
    color: var(--warning);
}

.demo {
    margin-bottom: 4px;
}

.demo__row {
    margin-bottom: 10px;
}

.nest__note {
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}

.cart {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.cart__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: var(--surface);
}

.cart__row + .cart__row {
    border-top: 1px solid var(--hairline);
}

.cart__name {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: var(--text-primary);
}

.cart__price {
    font-size: 12px;
    color: var(--brand);
}

.cart__del {
    flex: none;
}

.cart__empty {
    padding: 12px 10px;
    font-size: 11px;
    color: var(--text-tertiary);
    background: var(--surface);
}

.log-block {
    margin-top: 14px;
}
</style>
