<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Typeof / Instanceof / ToString</span>
                    <h2 class="panel__title">四种判类型的手段，各自能信几分</h2>
                </div>
                <span class="panel__meta">下表全是此刻真实算出来的结果</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>typeof</code> 只能分辨基本类型和 function，碰到 <code>null</code>、数组、对象一律报
                    <code>object</code>；<code>instanceof</code> 看的是原型链，原始值直接判 false；
                    <code>constructor</code> 能被改写，不算可靠；
                    真正稳的是 <em><code>Object.prototype.toString.call()</code></em>——
                    它对内置类型几乎百发百中，但对自定义类也只会说「这是个 Object」。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">坑一</span>
                        <span class="point__v">typeof null === 'object'，历史遗留 bug，永远改不了</span>
                    </div>
                    <div class="point">
                        <span class="point__k">坑二</span>
                        <span class="point__v">instanceof 跨 iframe / 跨 realm 会因原型不同失效</span>
                    </div>
                    <div class="point">
                        <span class="point__k">坑三</span>
                        <span class="point__v">constructor 只是个普通属性，随手就能改掉</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 对照表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Matrix</span>
                    <h2 class="panel__title">{{ rows.length }} 种值 × 4 种判定</h2>
                </div>
                <span class="panel__meta">悬停同一行看不同方法给出的答案差在哪</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">过滤</span>
                    <div class="w-btns">
                        <button
                            v-for="f in FILTERS"
                            :key="f.key"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': filter === f.key }"
                            @click="filter = f.key">
                            {{ f.label }}
                        </button>
                    </div>
                    <span class="w-hint">「看区别」只留那些判定容易踩空的值</span>
                </div>

                <div class="mtx">
                    <div class="mtx__row mtx__row--head">
                        <span class="mtx__cell">值</span>
                        <span class="mtx__cell">typeof</span>
                        <span class="mtx__cell">instanceof Object</span>
                        <span class="mtx__cell">constructor</span>
                        <span class="mtx__cell">Object.prototype.toString.call</span>
                    </div>

                    <div
                        v-for="r in visibleRows"
                        :key="r.label"
                        class="mtx__row"
                        :class="{ 'is-focus': focus === r.label }"
                        @mouseenter="focus = r.label"
                        @mouseleave="focus = ''">
                        <span class="mtx__cell mono mtx__cell--key">{{ r.label }}</span>
                        <span class="mtx__cell mono" :class="cellClass(r, 'type')">{{ r.type }}</span>
                        <span class="mtx__cell mono" :class="cellClass(r, 'instance')">{{ r.instance }}</span>
                        <span class="mtx__cell mono" :class="cellClass(r, 'ctor')">{{ r.ctor }}</span>
                        <span class="mtx__cell mono" :class="cellClass(r, 'tag')">{{ r.tag }}</span>
                    </div>
                </div>

                <p class="mtx-tip">
                    <span class="mono is-good">绿色</span> 表示这一列给出的答案能准确区分该类型，
                    <span class="mono is-bad">红色</span> 表示它在这里「说了等于没说」或者干脆报错。
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">一个够用的万能判断</h2>
                </div>
                <span class="panel__meta">上面的表格就是这么算的</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">getType · 兼顾内置类型和自定义类</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">补充：几个常被问到的细节</div>
                    <CodeEditor :code="tipCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

class MyThing {}
const instance = new MyThing()

type ValueCase = { label: string; build: () => unknown; kind: 'primitive' | 'reference' | 'special' }

const VALUES: ValueCase[] = [
    { label: '123', build: () => 123, kind: 'primitive' },
    { label: "'abc'", build: () => 'abc', kind: 'primitive' },
    { label: 'true', build: () => true, kind: 'primitive' },
    { label: 'Symbol()', build: () => Symbol('id'), kind: 'primitive' },
    { label: '10n', build: () => BigInt(10), kind: 'primitive' },
    { label: 'undefined', build: () => undefined, kind: 'special' },
    { label: 'null', build: () => null, kind: 'special' },
    { label: 'NaN', build: () => NaN, kind: 'special' },
    { label: '[1, 2]', build: () => [1, 2], kind: 'reference' },
    { label: '{ a: 1 }', build: () => ({ a: 1 }), kind: 'reference' },
    { label: 'function () {}', build: () => function () {}, kind: 'reference' },
    { label: 'new Date()', build: () => new Date(), kind: 'reference' },
    { label: '/abc/', build: () => /abc/, kind: 'reference' },
    { label: 'new Map()', build: () => new Map(), kind: 'reference' },
    { label: 'new Error()', build: () => new Error('x'), kind: 'reference' },
    { label: 'Promise.resolve()', build: () => Promise.resolve(), kind: 'reference' },
    { label: 'new MyThing()', build: () => instance, kind: 'reference' },
]

type Row = {
    label: string
    kind: ValueCase['kind']
    type: string
    instance: string
    ctor: string
    tag: string
}

function constructorName(v: unknown): string {
    if (v === null || v === undefined) return 'TypeError（报错）'
    try {
        return (v as { constructor?: { name?: string } }).constructor?.name ?? 'undefined'
    } catch {
        return 'TypeError（报错）'
    }
}

const rows = computed<Row[]>(() =>
    VALUES.map(({ label, build, kind }) => {
        const v = build()
        return {
            label,
            kind,
            type: typeof v,
            instance: String(v instanceof Object),
            ctor: constructorName(v),
            tag: Object.prototype.toString.call(v),
        }
    }),
)

const FILTERS = [
    { key: 'all', label: '全部' },
    { key: 'primitive', label: '基本类型' },
    { key: 'reference', label: '引用类型' },
    { key: 'tricky', label: '看区别' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

const filter = ref<FilterKey>('all')
const focus = ref('')

const visibleRows = computed(() => {
    if (filter.value === 'all') return rows.value
    if (filter.value === 'tricky') {
        // typeof 或 constructor 在这几行里明显不可靠
        return rows.value.filter((r) => r.type === 'object' || r.ctor === 'TypeError（报错）')
    }
    return rows.value.filter((r) => r.kind === filter.value)
})

/* 给单元格上色：判断这一列在此行是否「说了有用的话」 */
function cellClass(r: Row, col: 'type' | 'instance' | 'ctor' | 'tag') {
    if (col === 'type') {
        // object 对 null/数组/对象没有区分度
        return r.type === 'object' ? 'is-bad' : 'is-good'
    }
    if (col === 'instance') {
        return r.kind === 'primitive' || r.kind === 'special' ? 'is-bad' : 'is-good'
    }
    if (col === 'ctor') {
        return r.ctor === 'TypeError（报错）' ? 'is-bad' : 'is-good'
    }
    // toString.call：只有自定义类会退化成 Object
    return r.tag === '[object Object]' && r.label !== '{ a: 1 }' ? 'is-warn' : 'is-good'
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `// 统一用 Object.prototype.toString.call 取内部标签
function getType(value) {
  if (value === null) return 'null'
  if (typeof value !== 'object' && typeof value !== 'function') {
    return typeof value            // number / string / boolean / symbol / bigint / undefined
  }

  const raw = Object.prototype.toString.call(value)   // '[object Array]'
  const tag = raw.slice(8, -1)                        // 'Array'

  if (tag !== 'Object') return tag                    // Array / Date / RegExp / Map …

  // 剩下的是「纯对象」或自定义类的实例，交给构造器区分
  const { constructor } = value
  if (typeof constructor === 'function') {
    const name = constructor.name                     // 'MyThing'
    if (name && name !== 'Object') return name
  }
  return 'Object'
}

getType(null)            // 'null'      ← typeof 会误报成 object
getType([1, 2])          // 'Array'
getType(new Date())      // 'Date'
getType(new MyThing())   // 'MyThing'   ← 原生 toString.call 只能给 Object`

const tipCode = `// ① 判断数组：优先用内置方法，别自己写
Array.isArray([1, 2])          // true，跨 realm 也稳
;[1, 2] instanceof Array       // true，但跨 iframe 会因原型不同而 false

// ② NaN 只能用 Number.isNaN 或自身不等
NaN === NaN                    // false（唯一不等于自己的值）
Number.isNaN(NaN)              // true
Number.isNaN('abc')            // false ← 注意，它不做类型转换
Number.isNaN(Number('abc'))    // true

// ③ 判空对象要注意 Symbol 键
function isEmptyObject(obj) {
  return Reflect.ownKeys(obj).length === 0   // 比 Object.keys 多覆盖 Symbol
}

// ④ 原型相关
Object.getPrototypeOf(obj) === obj.__proto__          // true（后者是历史遗留访问器）
Object.create(null)                                   // 得到一个连 toString 都没有的对象`
</script>

<style scoped>
.mtx {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    overflow-x: auto;
}

.mtx__row {
    display: grid;
    grid-template-columns: 150px 100px 150px 150px minmax(200px, 1fr);
    min-width: 720px;
    border-bottom: 1px solid var(--hairline);
}
.mtx__row:last-child {
    border-bottom: none;
}
.mtx__row--head {
    background: var(--surface-muted);
}
.mtx__row.is-focus {
    background: var(--brand-soft);
}

.mtx__cell {
    padding: 7px 10px;
    font-size: 11px;
    color: var(--text-secondary);
    border-right: 1px solid var(--hairline);
    word-break: break-all;
}
.mtx__cell:last-child {
    border-right: none;
}

.mtx__row--head .mtx__cell {
    font-size: 10px;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
}

.mtx__cell--key {
    color: var(--text-primary);
}

.mtx__cell.is-good {
    color: var(--success);
}
.mtx__cell.is-warn {
    color: var(--warning);
}
.mtx__cell.is-bad {
    color: var(--danger);
}

.mtx-tip {
    margin: 12px 0 0;
    font-size: 12px;
    color: var(--text-secondary);
}
.mtx-tip .mono.is-good {
    color: var(--success);
}
.mtx-tip .mono.is-bad {
    color: var(--danger);
}
</style>
