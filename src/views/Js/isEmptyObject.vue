<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">isEmpty</span>
                    <h2 class="panel__title">「空」的定义比你以为的多</h2>
                </div>
                <span class="panel__meta">Symbol 键、继承来的属性、值为 undefined 都会导致误判</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>Object.keys</code> 看不见 Symbol 键；<code>JSON.stringify</code> 会把
                    <code>undefined</code> 和 Symbol 键直接丢掉；<code>for...in</code> 会把原型上的东西也算进来。
                    真正意义上的「自身没有任何键」只有 <em><code>Reflect.ownKeys</code></em> 说得准 ——
                    它同时覆盖字符串键和 Symbol 键，而且只看自身。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">字符串键</span>
                        <span class="point__v">Object.keys / Object.values / Object.entries</span>
                    </div>
                    <div class="point">
                        <span class="point__k">含 Symbol</span>
                        <span class="point__v">Reflect.ownKeys（= 字符串键 + Symbol 键）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">别用</span>
                        <span class="point__v">JSON.stringify 会被 undefined / Symbol 坑，for...in 会带上原型</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 对照实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Matrix</span>
                    <h2 class="panel__title">{{ CASES.length }} 个样本 × 4 种判法</h2>
                </div>
                <span class="panel__meta">下表每一行都是此刻真实算出来的</span>
            </div>
            <div class="panel__body">
                <div class="mtx">
                    <div class="mtx__row mtx__row--head">
                        <span class="mtx__cell">样本</span>
                        <span class="mtx__cell">Object.keys</span>
                        <span class="mtx__cell">JSON.stringify</span>
                        <span class="mtx__cell">for...in</span>
                        <span class="mtx__cell">Reflect.ownKeys</span>
                        <span class="mtx__cell">应当为</span>
                    </div>

                    <div v-for="row in rows" :key="row.id" class="mtx__row">
                        <span class="mtx__cell mono mtx__cell--key">{{ row.label }}</span>
                        <span class="mtx__cell mono" :class="row.keysOk ? 'is-good' : 'is-bad'">
                            {{ row.keys }}
                        </span>
                        <span class="mtx__cell mono" :class="row.jsonOk ? 'is-good' : 'is-bad'">
                            {{ row.json }}
                        </span>
                        <span class="mtx__cell mono" :class="row.forInOk ? 'is-good' : 'is-bad'">
                            {{ row.forIn }}
                        </span>
                        <span class="mtx__cell mono" :class="row.reflectOk ? 'is-good' : 'is-bad'">
                            {{ row.reflect }}
                        </span>
                        <span class="mtx__cell mono">{{ row.expected }}</span>
                    </div>
                </div>

                <p class="mtx-tip">
                    绿色 = 该方法给出的答案与事实一致；红色 = 判断错误或干脆报错。
                    可以看到只有 <span class="mono is-good">Reflect.ownKeys</span> 全对。
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">一个抗造的版本</h2>
                </div>
                <span class="panel__meta">先判类型，再看键，顺序不能反</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">isEmptyObject · 上面表格里最右一列的判定逻辑</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">同类问题：判空数组、判空值</div>
                    <CodeEditor :code="tipCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type Case = {
    id: string
    label: string
    build: () => unknown
    expected: boolean | 'error'
}

const sym = Symbol('k')

const CASES: Case[] = [
    { id: 'empty', label: '{}', build: () => ({}), expected: true },
    { id: 'normal', label: '{ a: 1 }', build: () => ({ a: 1 }), expected: false },
    { id: 'symbol', label: '{ [Symbol]: 1 }', build: () => ({ [sym]: 1 }), expected: false },
    {
        id: 'proto',
        label: 'Object.create({x:1})',
        build: () => Object.create({ x: 1 }),
        expected: true, // 自身没有键，原型上的不算
    },
    { id: 'undef', label: '{ a: undefined }', build: () => ({ a: undefined }), expected: false },
    { id: 'array', label: '[]', build: () => [], expected: true },
    { id: 'nonext', label: 'Object.preventExtensions({})', build: () => Object.preventExtensions({}), expected: true },
]

type Row = {
    id: string
    label: string
    keys: string
    json: string
    forIn: string
    reflect: string
    expected: string
    keysOk: boolean
    jsonOk: boolean
    forInOk: boolean
    reflectOk: boolean
}

function tryIt(fn: () => boolean): string {
    try {
        return String(fn())
    } catch (err) {
        return `报错：${(err as Error).name}`
    }
}

const rows = computed<Row[]>(() =>
    CASES.map((c) => {
        const v = c.build()

        const keys = tryIt(() => Object.keys(v as object).length === 0)
        const json = tryIt(() => JSON.stringify(v) === '{}')
        const forIn = tryIt(() => {
            // eslint-disable-next-line no-unreachable-loop
            for (const key in v as object) {
                if (Object.prototype.hasOwnProperty.call(v, key)) return false
            }
            return true
        })
        const reflect = tryIt(() => Reflect.ownKeys(v as object).length === 0)

        const expectStr = String(c.expected)
        return {
            id: c.id,
            label: c.label,
            keys,
            json,
            forIn,
            reflect,
            expected: expectStr,
            keysOk: keys === expectStr,
            jsonOk: json === expectStr,
            forInOk: forIn === expectStr,
            reflectOk: reflect === expectStr,
        }
    }),
)

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function isEmptyObject(value) {
  // ① 先确定它确实是个对象，别上来就取 keys
  if (value === null || typeof value !== 'object') {
    return false            // 或者按业务需要抛错，总之不能返回 true
  }

  // ② Reflect.ownKeys 同时覆盖字符串键和 Symbol 键，且只看自身
  return Reflect.ownKeys(value).length === 0
}

isEmptyObject({})                    // true
isEmptyObject({ a: 1 })              // false
isEmptyObject({ [Symbol()]: 1 })     // false  ← Object.keys 会误判成 true
isEmptyObject(Object.create({x:1}))  // true   ← 原型上的属性不算自己的
isEmptyObject([])                    // true   ← 数组也是对象，必要时单独挡一下
isEmptyObject(null)                  // false

// 想连数组一起排掉：
function isEmptyPlainObject(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    Reflect.ownKeys(value).length === 0
  )
}`

const tipCode = `// ① 空值判断：别用宽松相等把 0 和 '' 一起误伤
const isNil = (v) => v === null || v === undefined      // 只认这两个
const isEmpty = (v) => isNil(v) || v === ''             // 视业务而定

if (!x) { /* x 为 0、''、false、NaN、null、undefined 都会进来 */ }

// ② 空数组 / 空类数组
arr.length === 0                      // 最直接
Array.isArray(arr) && arr.length === 0

// ③ Map / Set 看 size，字符串 trim 后再判断
map.size === 0
str.trim().length === 0

// ④ 可选链 + 空值合并，省掉一堆判空分支
const city = user?.address?.city ?? '未知'
// 注意可选链挡不住 dempty 字符串：'' ?? '未知' 得到的还是 ''`
</script>

<style scoped>
.mtx {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    overflow-x: auto;
}

.mtx__row {
    display: grid;
    grid-template-columns: 190px 96px 116px 96px 120px 88px;
    min-width: 760px;
    border-bottom: 1px solid var(--hairline);
}
.mtx__row:last-child {
    border-bottom: none;
}
.mtx__row--head {
    background: var(--surface-muted);
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
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
}

.mtx__cell--key {
    color: var(--text-primary);
}

.mtx__cell.is-good {
    color: var(--success);
}
.mtx__cell.is-bad {
    color: var(--danger);
}

.mtx-tip {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}
.mtx-tip .mono.is-good {
    color: var(--success);
}
</style>
