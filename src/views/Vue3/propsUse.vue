<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Props</span>
                    <h2 class="panel__title">父给子的单向通道</h2>
                </div>
                <span class="panel__meta">只读、可校验、可给默认值</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    props 是组件对外公布的<em>输入接口</em>。几条硬性规则：
                    声明了才收得到（没声明的会落到 attrs 上）、<strong>子组件不许直接改</strong>、
                    类型不匹配时开发环境会警告、没传且没默认值就是 <code>undefined</code>。
                    现在推荐 <code>defineProps</code> 泛型写法——编译期就有完整类型提示，
                    再用 <code>withDefaults</code> 补默认值，两者兼得。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">单向</span>
                        <span class="point__v">子组件想改必须 emit，自己赋值会被警告且无效</span>
                    </div>
                    <div class="point">
                        <span class="point__k">校验</span>
                        <span class="point__v">只在开发模式进行，生产构建会剔除这部分代码</span>
                    </div>
                    <div class="point">
                        <span class="point__k">引用类型</span>
                        <span class="point__v">默认值必须是工厂函数，否则所有实例共用一份</span>
                    </div>
                    <div class="point">
                        <span class="point__k">3.5+</span>
                        <span class="point__v">支持响应式 props 解构，不用再写 props.xxx</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：类型校验实测 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">传错类型会发生什么</h2>
                </div>
                <span class="panel__meta">右侧是 Vue 实际给出的警告原文</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="v in variants" :key="v.name" type="button" class="w-btn"
                            :class="{ 'is-active': picked === v.name }" @click="picked = v.name">
                            {{ v.label }}
                        </button>
                    </div>
                    <span class="w-hint">切换选项，看校验结果怎么变</span>
                </div>

                <div class="pass-box">
                    <div class="pass-box__side">
                        <div class="pass-box__title mono">父组件这样写</div>
                        <CodeEditor :code="cur.parentCode" />
                    </div>
                    <div class="pass-box__arrow mono">→</div>
                    <div class="pass-box__side">
                        <div class="pass-box__title mono">子组件最终拿到的值</div>
                        <div class="kv-grid">
                            <div v-for="(v, k) in receieved" :key="k" class="kv">
                                <span class="kv__k mono">{{ k }}</span>
                                <span class="kv__v" :class="v.tone">{{ v.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="log-block">
                    <div class="code-block__label">Vue 的校验结论</div>
                    <div class="log-list">
                        <div v-for="(w, i) in cur.verdicts" :key="i" class="log-item" :class="w.tone">
                            <span class="log-item__idx">{{ w.tone === 'is-bad' ? 'warn' : 'ok' }}</span>
                            <span class="log-item__body">{{ w.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：三种声明方式 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">写法演进：数组 → 对象 → 泛型</h2>
                </div>
                <span class="panel__meta">现在推荐第三种</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">数组写法</h3>
                            <span class="card__tag is-bad">最弱</span>
                        </div>
                        <p class="card__desc">
                            只报个名字，既不校验也不给默认值。
                            原型阶段图快可以，正经代码里不该出现。
                        </p>
                        <div class="res-row"><span class="res-k">类型安全</span>
                            <span class="res-v is-bad">无</span></div>
                        <div class="res-row"><span class="res-k">默认值</span>
                            <span class="res-v is-bad">不支持</span></div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">运行时对象</h3>
                            <span class="card__tag">能校验</span>
                        </div>
                        <p class="card__desc">
                            能写 <code>type / required / default / validator</code>，
                            但这份类型信息 TS 完全拿不到。
                        </p>
                        <div class="res-row"><span class="res-k">类型安全</span>
                            <span class="res-v is-warn">仅运行时</span></div>
                        <div class="res-row"><span class="res-k">默认值</span>
                            <span class="res-v is-ok">支持</span></div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">defineProps 泛型</h3>
                            <span class="card__tag is-good">推荐</span>
                        </div>
                        <p class="card__desc">
                            编译期就有提示，配合 <code>withDefaults</code> 补默认值，
                            <strong>两边的好处全都要</strong>。
                        </p>
                        <div class="res-row"><span class="res-k">类型安全</span>
                            <span class="res-v is-ok">编译期</span></div>
                        <div class="res-row"><span class="res-k">默认值</span>
                            <span class="res-v is-ok">withDefaults</span></div>
                    </article>
                </div>

                <div class="code-block" style="margin-top: 16px">
                    <div class="code-block__label">三种写法对照</div>
                    <CodeEditor :code="declareCode" />
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">默认值与只读原则</h2>
                </div>
                <span class="panel__meta">最容易出事的两个点</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">对象/数组的默认值必须是工厂函数</div>
                    <CodeEditor :code="defaultCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/* ── 实验一 ─────────────────────────────────────────── */
type Verdict = { text: string; tone: string }
type Variant = {
    name: string
    label: string
    parentCode: string
    props: Record<string, unknown>
    verdicts: Verdict[]
}

const variants: Variant[] = [
    {
        name: 'ok',
        label: '① 全部正确',
        parentCode: `<DemoChild
  title="仪表盘"
  :count="42"
  role="admin"
  :tags="['a', 'b']"
/>`,
        props: { title: '仪表盘', count: 42, role: 'admin', tags: ['a', 'b'] },
        verdicts: [
            { text: '所有字段类型都对得上，静默通过', tone: 'is-ok' },
            { text: '未传的 meta 取到了默认值 {}', tone: 'is-ok' },
        ],
    },
    {
        name: 'wrongType',
        label: '② count 传字符串',
        parentCode: `<DemoChild
  title="仪表盘"
  count="42"      ← 漏了冒号，成了字符串
/>`,
        props: { title: '仪表盘', count: '42' },
        verdicts: [
            { text: 'Invalid prop: type check failed for prop "count". Expected Number, got String', tone: 'is-bad' },
            { text: '注意：值照样传进去了，只是给了个警告——生产构建里连警告也没有', tone: 'is-warn' },
        ],
    },
    {
        name: 'missing',
        label: '③ 缺必填项',
        parentCode: `<DemoChild :count="1" />
<!-- title 声明了 required: true -->`,
        props: { count: 1 },
        verdicts: [
            { text: 'Missing required prop: "title"', tone: 'is-bad' },
            { text: 'title 最终是 undefined，模板里用它多半会跟着报错', tone: 'is-bad' },
        ],
    },
    {
        name: 'null',
        label: '④ 显式传 null',
        parentCode: `<DemoChild
  title="x"
  :count="null"
/>`,
        props: { title: 'x', count: null },
        verdicts: [
            { text: '传 null / undefined 都会走默认值——所以走不了', tone: 'is-warn' },
            { text: '想让它真的为空，得写 allowedTypes:[Number,null] 或用 any', tone: 'is-warn' },
        ],
    },
]

const picked = ref('ok')
const cur = computed(() => variants.find((v) => v.name === picked.value) ?? variants[0])

function fmt(v: unknown): string {
    if (v === undefined) return 'undefined'
    if (v === null) return 'null'
    if (Array.isArray(v)) return `[${v.join(', ')}]`
    if (typeof v === 'object') return JSON.stringify(v)
    if (typeof v === 'string') return `"${v}"`
    return String(v)
}

// 复刻 Vue 应用默认值之后的最终结果（规则：null/undefined 走 default）
const receieved = computed(() => {
    const p = cur.value.props
    const out: Record<string, { text: string; tone: string }> = {}

    const slots: Array<[string, unknown, string]> = [
        ['title', p.title, 'required'],
        ['count', p.count, 'number'],
        ['role', p.role, 'string'],
        ['tags', p.tags, 'array'],
        ['meta', p.meta, 'object'],
    ]

    for (const [key, raw, expect] of slots) {
        let value = raw
        let tone = 'is-ok'

        if (value === undefined || value === null) {
            value = key === 'count' ? 0 : key === 'role' ? 'viewer' : key === 'tags' ? [] : {}
            tone = key === 'title' ? 'is-bad' : 'is-warn'
        } else if (expect === 'number' && typeof value !== 'number') {
            tone = 'is-bad'
        } else if (expect === 'string' && typeof value !== 'string') {
            tone = 'is-bad'
        }

        out[key] = { text: fmt(value), tone }
    }
    return out
})

/* ── 展示用源码 ─────────────────────────────────────── */
const declareCode = `// ① 数组：又快又糙，什么都不管
defineProps(['title', 'count'])

// ② 运行时对象：能校验、能给默认值，但 TS 推断不到
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  role: {
    type: String,
    default: 'viewer',
    validator: (v: string) => ['admin', 'viewer'].includes(v),
  },
})

// ③ 泛型 + withDefaults：编译期类型与默认值兼得（推荐）
interface Props {
  title: string
  count?: number
  role?: 'admin' | 'viewer'
  tags?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  role: 'viewer',
  tags: () => [],            // ⚠️ 引用类型必须用工厂函数
})

// Vue 3.5+ 还能直接响应式解构，不必再写 props.xxx
const { title, count = 0 } = defineProps<Props>()`

const defaultCode = `// ❌ 直接给对象：所有实例共用同一个引用
//    某个组件改了 tags，别处的默认值也跟着脏了
defineProps({ tags: { type: Array, default: ['a'] } })

// ✅ 工厂函数：每次返回全新的实例
defineProps({ tags: { type: Array, default: () => ['a'] } })

// withDefaults 里同理
withDefaults(defineProps<Props>(), {
  tags: () => [],
  meta: () => ({}),
})

// ── 只读原则 ──────────────────────────────────────
// ❌ 子组件直接改：会弹 "Attempting to mutate prop" 警告
props.count++

// ✅ 正确做法：本地副本 + emit
const local = ref(props.count)
watch(() => props.count, (v) => { local.value = v })
emit('update:count', local.value)

// ⚠️ props 是引用类型时，改里层属性不会报错——但依然是错的，
//    源头不明，出了 bug 极难查
props.user.name = '改了'     // 不警告，但绝对别这么干`
</script>

<style scoped>
.pass-box {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 14px;
    align-items: start;
}

.pass-box__side {
    min-width: 0;
}

.pass-box__title {
    margin-bottom: 6px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.pass-box__arrow {
    align-self: center;
    padding-top: 20px;
    font-size: 18px;
    color: var(--brand);
}

.res-row + .res-row {
    margin-top: 4px;
}

.log-block {
    margin-top: 14px;
}

@media (max-width: 860px) {
    .pass-box {
        grid-template-columns: 1fr;
    }

    .pass-box__arrow {
        display: none;
    }
}
</style>
