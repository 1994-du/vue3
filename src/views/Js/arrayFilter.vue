<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Array Unique</span>
                    <h2 class="panel__title">三种去重写法，差别藏在 NaN 和引用里</h2>
                </div>
                <span class="panel__meta">SameValueZero vs 严格相等，这是分水岭</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>Set</code> 和 <code>includes</code> 内部用的是 <em>SameValueZero</em> 比较，
                    认为 <code>NaN</code> 等于自己；而 <code>indexOf</code> 用的是<em>严格相等</em>，
                    <code>NaN !== NaN</code> 会让去重直接失效。除此之外还得留意：
                    <code>1</code> 和 <code>'1'</code> 永远不同，对象比的是<strong>引用</strong>而不是内容。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">Set</span>
                        <span class="point__v">最省事，保序，能处理 NaN，一行搞定</span>
                    </div>
                    <div class="point">
                        <span class="point__k">filter</span>
                        <span class="point__v">配 indexOf 会在 NaN 上翻车，配 includes 就没问题</span>
                    </div>
                    <div class="point">
                        <span class="point__k">对象</span>
                        <span class="point__v">以上三种都按引用去重，想按内容去重得自己写 key</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment</span>
                    <h2 class="panel__title">同一份数据，四种算法同时跑</h2>
                </div>
                <span class="panel__meta">真实执行，留意 NaN 那一项</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">数据</span>
                    <div class="w-btns">
                        <button
                            v-for="c in CASES"
                            :key="c.name"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': active === c.name }"
                            @click="active = c.name">
                            {{ c.name }}
                        </button>
                    </div>
                    <span class="w-hint">{{ current.summary }}</span>
                </div>

                <div class="source-row">
                    <span class="source-label mono">源数据</span>
                    <span v-for="(v, i) in current.data" :key="i" class="cell-chip mono">{{ display(v) }}</span>
                </div>

                <div class="uni-list">
                    <article v-for="m in results" :key="m.name" class="uni-item">
                        <div class="uni-head">
                            <h3 class="uni-name">{{ m.name }}</h3>
                            <span class="card__tag" :class="m.tagClass">{{ m.out }}</span>
                        </div>
                        <p class="uni-desc">{{ m.desc }}</p>
                        <div class="uni-out">
                            <span v-for="(v, i) in m.value" :key="i" class="cell-chip mono">{{ display(v) }}</span>
                            <span v-if="!m.value.length" class="queue__empty">空</span>
                        </div>
                        <div class="res-row">
                            <span class="res-k">长度</span>
                            <span class="res-v mono">
                                {{ m.value.length }} / {{ current.data.length }}
                            </span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">四种写法原文</h2>
                </div>
                <span class="panel__meta">以及对象数组怎么去重</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">基础去重 · Set / filter / reduce</div>
                    <CodeEditor :code="basicCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">对象数组 · 按内容去重</div>
                    <CodeEditor :code="objCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type UniqueCase = {
    name: string
    summary: string
    data: unknown[]
}

const shared = { k: 1 }
const twin = { k: 1 }

const CASES: UniqueCase[] = [
    {
        name: '含 NaN',
        summary: 'indexOf 用严格相等，NaN 永远不等于自己',
        data: [1, 2, 3, 2, 4, 1, 3, 6, 5, Number.NaN, Number.NaN, '1'],
    },
    {
        name: '数字与字符串',
        summary: "1 和 '1' 类型不同，任何方式都不会被合并",
        data: [1, '1', 2, '2', 1, '1'],
    },
    {
        name: '含对象引用',
        summary: '两个长得一样的对象，引用不同就不算重复',
        data: [shared, twin, shared, { k: 1 }, shared],
    },
]

const active = ref<string>(CASES[0].name)
const current = computed(() => CASES.find((c) => c.name === active.value) ?? CASES[0])

function display(v: unknown): string {
    if (typeof v === 'number' && Number.isNaN(v)) return 'NaN'
    if (typeof v === 'object' && v !== null) {
        return `{${Object.keys(v).join(',')}}@ref`
    }
    return typeof v === 'string' ? `'${v}'` : String(v)
}

const results = computed(() => {
    const arr = current.value.data

    const bySet = [...new Set(arr)]
    const byFilter = arr.filter((item, index, self) => self.indexOf(item) === index)
    const byReduce = arr.reduce<unknown[]>((pre, cur) => (pre.includes(cur) ? pre : [...pre, cur]), [])
    const byFilterIncludes = arr.filter((item, index, self) => self.indexOf(item) === self.findIndex((x) => Object.is(x, item)))

    const hasNaN = arr.some((v) => typeof v === 'number' && Number.isNaN(v))
    const nanCount = (list: unknown[]) =>
        list.filter((v) => typeof v === 'number' && Number.isNaN(v)).length

    return [
        {
            name: 'Set 去重',
            value: bySet,
            desc: '最推荐：一行搞定、保持首次出现的顺序、能正确处理 NaN。',
            tagClass: 'is-good',
            out: hasNaN ? `NaN 剩 ${nanCount(bySet)} 个` : '保序',
        },
        {
            name: 'filter + indexOf',
            value: byFilter,
            desc: '经典写法。indexOf 用 === 比较，NaN !== NaN 会导致 NaN 一个都去不掉。',
            tagClass: hasNaN && nanCount(byFilter) > 1 ? 'is-bad' : 'is-good',
            out: hasNaN ? `NaN 剩 ${nanCount(byFilter)} 个` : '保序',
        },
        {
            name: 'reduce + includes',
            value: byReduce,
            desc: 'includes 内部用 SameValueZero，和 Set 一样能认出 NaN，但要自己拼数组。',
            tagClass: 'is-good',
            out: hasNaN ? `NaN 剩 ${nanCount(byReduce)} 个` : '保序',
        },
        {
            name: 'filter + Object.is',
            value: byFilterIncludes,
            desc: '想彻底对齐 Set 的语义，就得用 Object.is 自己找首次出现的位置。',
            tagClass: 'is-good',
            out: '语义等同 Set',
        },
    ]
})

/* ── 展示用源码 ───────────────────────────────────────── */
const basicCode = `const arr = [1, 2, 3, 2, 4, 1, 3, 6, 5, NaN, NaN, '1']

// ① Set —— 首选，保序 + 能处理 NaN
const a = [...new Set(arr)]
const a2 = Array.from(new Set(arr))

// ② filter + indexOf —— NaN 会被完整保留下来
const b = arr.filter((item, index, self) => self.indexOf(item) === index)

// ③ reduce + includes —— includes 用 SameValueZero，效果等价于 Set
const c = arr.reduce((pre, cur) => pre.includes(cur) ? pre : [...pre, cur], [])

// 为什么 ② 不行？
arr.indexOf(NaN)          // -1，=== 判定 NaN 不等于自己
arr.includes(NaN)         // true，SameValueZero 认为相等
Object.is(NaN, NaN)       // true
Object.is(0, -0)          // false —— 这是它和 === 唯一的另一处不同`

const objCode = `// 对象数组：以上三种都按「引用」去重，长得一样没用
const list = [
  { id: 1, name: 'A' },
  { id: 1, name: 'A' },   // 内容一样但引用不同
  { id: 2, name: 'B' },
]

// 按某个字段去重：用 Map 记住已经出现过的 key
function uniqueBy(arr, key) {
  const seen = new Map()
  for (const item of arr) {
    if (!seen.has(item[key])) seen.set(item[key], item)
  }
  return [...seen.values()]     // 保留首次出现的那个
}
uniqueBy(list, 'id')            // [{ id:1 }, { id:2 }]

// 想保留最后一次出现的，就把赋值改成覆盖
function uniqueByLast(arr, key) {
  const seen = new Map()
  for (const item of arr) seen.set(item[key], item)
  return [...seen.values()]
}

// 整个对象比内容（序列化可行但脆弱，key 顺序会影响结果）
const byJson = [...new Map(list.map((i) => [JSON.stringify(i), i])).values()]`
</script>

<style scoped>
.source-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    padding: 10px 12px;
    margin-bottom: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.source-label {
    flex: none;
    width: 62px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.cell-chip {
    font-size: 11px;
    padding: 2px 7px;
    border: 1px solid var(--hairline);
    color: var(--text-secondary);
    background: var(--surface);
}

.uni-list {
    display: grid;
    gap: 10px;
}

.uni-item {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
    padding: 12px;
}

.uni-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
}

.uni-name {
    margin: 0;
    font-size: 13px;
    color: var(--text-primary);
}

.uni-desc {
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.uni-out {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 30px;
    padding: 8px 10px;
    margin-bottom: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    align-items: center;
}

.is-good {
    color: var(--success);
    border-color: var(--success);
}
.is-bad {
    color: var(--danger);
    border-color: var(--danger);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
