<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Deep Clone</span>
                    <h2 class="panel__title">拷的是值还是那根线</h2>
                </div>
                <span class="panel__meta">浅拷贝只复制第一层，深拷贝要递归到底</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    赋值操作复制的是<em>引用地址</em>；浅拷贝（<code>{...obj}</code>）会新建外层对象，
                    但里层的嵌套对象<strong>仍然共用同一份</strong>；深拷贝才会把每一层都复制出来，
                    让新旧对象彻底不相干。<code>JSON.parse(JSON.stringify())</code>
                    是最偷懒的深拷贝，但它丢得掉 <code>undefined</code>、函数、Symbol，
                    遇到循环引用还会直接报错。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">浅拷贝</span>
                        <span class="point__v">Object.assign / {...obj} / slice / concat / [...arr]</span>
                    </div>
                    <div class="point">
                        <span class="point__k">深拷贝</span>
                        <span class="point__v">structuredClone（现代浏览器内置）、递归实现、lodash.cloneDeep</span>
                    </div>
                    <div class="point">
                        <span class="point__k">难点</span>
                        <span class="point__v">循环引用要靠 WeakMap 记住「已经拷过谁」</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 引用关系实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment</span>
                    <h2 class="panel__title">改一层嵌套，看谁跟着变</h2>
                </div>
                <span class="panel__meta">每种拷贝方式都真跑一遍，=== 判定共享与否</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="mutate">改原对象：profile.city</button>
                        <button type="button" class="w-btn" @click="mutateArray">改原对象：tags[0]</button>
                        <button type="button" class="w-btn" @click="rebuild">还原现场</button>
                    </div>
                    <span class="w-hint">改完之后看四张卡的取值是否跟着动</span>
                </div>

                <div class="cards">
                    <article
                        v-for="c in copies"
                        :key="c.key"
                        class="card"
                        :class="{ 'is-linked': sharesNested(c.key) }">
                        <div class="card__head">
                            <h3 class="card__title">{{ c.name }}</h3>
                            <span class="card__tag" :class="sharesNested(c.key) ? 'is-bad' : 'is-good'">
                                {{ sharesNested(c.key) ? '嵌套层共享' : '完全独立' }}
                            </span>
                        </div>
                        <p class="card__desc">{{ c.desc }}</p>
                        <div class="kv-list">
                            <div class="res-row">
                                <span class="res-k">外层</span>
                                <span class="res-v mono">
                                    {{ nestedOf(c.key) === origin ? '=== 源对象' : '新对象' }}
                                </span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">city</span>
                                <span class="res-v mono">{{ nestedOf(c.key)?.profile?.city ?? '—' }}</span>
                            </div>
                            <div class="res-row">
                                <span class="res-k">tags</span>
                                <span class="res-v mono">{{ tagsText(c.key) }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ JSON 法的坑 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Traps</span>
                    <h2 class="panel__title">JSON 那套办法会丢什么</h2>
                </div>
                <span class="panel__meta">点一下就当场验证</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="runJsonTraps">跑一遍 JSON 深拷贝</button>
                        <button type="button" class="w-btn" @click="runCircular">试试循环引用</button>
                    </div>
                </div>

                <div class="log-box">
                    <span v-for="(l, i) in trapLogs" :key="i" class="log-line mono" :class="l.kind">
                        {{ l.text }}
                    </span>
                    <span v-if="!trapLogs.length" class="queue__empty">尚未运行</span>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">能应对循环引用的版本</h2>
                </div>
                <span class="panel__meta">WeakMap 是关键一步</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">deepClone · 递归 + WeakMap 破环</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">浅拷贝一览 & 现代替代方案</div>
                    <CodeEditor :code="shallowCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Nested = { profile: { city: string; age: number }; tags: string[] }
type Origin = Nested & { name: string }

function makeOrigin(): Origin {
    return {
        name: 'Alice',
        profile: { city: '上海', age: 28 },
        tags: ['前端', '摸鱼'],
    }
}

const origin = ref<Origin>(makeOrigin())

/* 四种拷贝：赋值、浅拷贝、JSON 深拷贝、递归深拷贝 */
const assignment = ref<Origin>(origin.value)
const shallow = ref<Origin>({ ...origin.value })
const jsonClone = ref<Origin>(JSON.parse(JSON.stringify(origin.value)))

function deepClone<T>(obj: T, weak = new WeakMap<object, unknown>()): T {
    if (obj === null || typeof obj !== 'object') return obj
    // 已经拷过就直接用，循环利用这层破环
    const existing = weak.get(obj as object)
    if (existing) return existing as T

    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as unknown as T
    if (obj instanceof Map) return new Map(obj) as unknown as T
    if (obj instanceof Set) return new Set(obj) as unknown as T

    const copy = (Array.isArray(obj) ? [] : {}) as T
    weak.set(obj as object, copy)

    for (const key of Reflect.ownKeys(obj as object)) {
        ;(copy as Record<string | symbol, unknown>)[key] = deepClone(
            (obj as Record<string | symbol, unknown>)[key],
            weak,
        )
    }
    return copy
}

const manualClone = ref<Origin>(deepClone(origin.value))

const COPIES = [
    { key: 'assign', name: '直接赋值', desc: '连外层都没拷，只是多了一个指向同一对象的变量。' },
    { key: 'shallow', name: '浅拷贝 {...obj}', desc: '外层是新对象，里层的 profile / tags 还是同一份引用。' },
    { key: 'json', name: 'JSON 深拷贝', desc: '两层都拷了，但会丢 undefined、函数、Symbol，循环引用会报错。' },
    { key: 'manual', name: '递归深拷贝', desc: '逐层复制，配合 WeakMap 解决循环引用，最可控。' },
] as const

const copies = computed(() => COPIES)

function cloneOf(key: string): Origin {
    switch (key) {
        case 'assign':
            return assignment.value
        case 'shallow':
            return shallow.value
        case 'json':
            return jsonClone.value
        default:
            return manualClone.value
    }
}

function nestedOf(key: string) {
    return cloneOf(key)
}

function sharesNested(key: string): boolean {
    const c = cloneOf(key)
    return c.profile === origin.value.profile || c.tags === origin.value.tags
}

function tagsText(key: string) {
    const tags = cloneOf(key).tags
    return tags.length ? tags.join(' / ') : '—'
}

function rebuild() {
    origin.value = makeOrigin()
    assignment.value = origin.value
    shallow.value = { ...origin.value }
    jsonClone.value = JSON.parse(JSON.stringify(origin.value))
    manualClone.value = deepClone(origin.value)
    trapLogs.value = []
}

function mutate() {
    origin.value.profile.city = `上海-${Date.now() % 100}`
    // 触发视图刷新（源对象是 ref，深层属性改动需要整体替换）
    origin.value = { ...origin.value }
}

function mutateArray() {
    origin.value.tags[0] = `已改${Date.now() % 100}`
    origin.value = { ...origin.value }
}

/* ── JSON 法的坑：真实运行 ────────────────────────────── */
const trapLogs = ref<{ text: string; kind: string }[]>([])

function runJsonTraps() {
    const source = {
        a: 1,
        b: undefined,
        fn: function hello() {},
        sym: Symbol('k'),
        date: new Date('2026-01-01'),
        nan: Number.NaN,
        inf: Number.POSITIVE_INFINITY,
    }

    let cloned: Record<string, unknown> = {}
    try {
        cloned = JSON.parse(JSON.stringify(source)) as Record<string, unknown>
    } catch (err) {
        trapLogs.value = [{ text: `直接报错：${(err as Error).message}`, kind: 'is-bad' }]
        return
    }

    const lines: { text: string; kind: string }[] = []

    if (!('b' in cloned)) lines.push({ text: 'undefined 没了 —— 属性被直接丢弃', kind: 'is-bad' })
    if (!('fn' in cloned)) lines.push({ text: 'function 没了 —— 属性被直接丢弃', kind: 'is-bad' })
    if (!('sym' in cloned)) lines.push({ text: 'Symbol 键没了 —— 属性被直接丢弃', kind: 'is-bad' })
    lines.push({ text: `Date 变成了字符串：${JSON.stringify(cloned.date)}`, kind: 'is-bad' })
    lines.push({ text: `NaN 变成 null：${JSON.stringify(cloned.nan)}`, kind: 'is-bad' })
    lines.push({ text: `Infinity 也变成 null：${JSON.stringify(cloned.inf)}`, kind: 'is-bad' })
    lines.push({ text: `最后剩下的：${JSON.stringify(cloned)}`, kind: 'is-info' })

    trapLogs.value = lines
}

function runCircular() {
    type Node = { name: string; self?: unknown }
    const node: Node = { name: '我引用了我自己' }
    node.self = node // 制造循环引用

    try {
        JSON.stringify(node)
        trapLogs.value = [{ text: '居然没报错（异常）', kind: 'is-ok' }]
    } catch (err) {
        trapLogs.value = [
            { text: `JSON.stringify 抛错：${(err as Error).message}`, kind: 'is-bad' },
            { text: '这就是循环引用必须自己处理的原因', kind: 'is-info' },
        ]
    }

    try {
        const cloned = deepClone(node)
        trapLogs.value = [
            ...trapLogs.value,
            {
                text: `deepClone 扛住了：${cloned.name}，且 self === 克隆后的自己 → ${
                    (cloned as Node).self === cloned
                }`,
                kind: 'is-ok',
            },
        ]
    } catch (err) {
        trapLogs.value = [
            ...trapLogs.value,
            { text: `deepClone 也挂了：${(err as Error).message}`, kind: 'is-bad' },
        ]
    }
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function deepClone(obj, hash = new WeakMap()) {
  // ① 基本类型直接还回来
  if (obj === null || typeof obj !== 'object') return obj

  // ② 循环引用：拷过就直接给回上次的副本
  if (hash.has(obj)) return hash.get(obj)

  // ③ 特殊对象各自处理
  if (obj instanceof Date)   return new Date(obj.getTime())
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  if (obj instanceof Map)    return new Map(obj)
  if (obj instanceof Set)    return new Set(obj)

  // ④ 数组/普通对象：先造容器并登记，再递归填充
  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)                      // ★ 必须在递归之前登记

  // Reflect.ownKeys 连 Symbol 键一起拷
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], hash)
  }

  return clone
}

const obj = { a: 1 }
obj.self = obj                 // 循环引用
const copy = deepClone(obj)
copy.self === copy             // true，环被正确还原
copy.a === obj.a               // true，值相同
copy === obj                   // false，是不同对象

// 现代浏览器其实已经内置了：
structuredClone(obj)           // 支持循环引用、Map/Set/Date，但不认函数`

const shallowCode = `// ① 浅拷贝的几种写法（都只拷第一层）
const arr = [1, [2, 3]]
const a1 = arr.slice()
const a2 = arr.concat()
const a3 = [...arr]
a1[1] === arr[1]        // true —— 里层那份数组还是同一个

const obj = { a: 1, nested: { b: 2 } }
const o1 = { ...obj }
const o2 = Object.assign({}, obj)
o1.nested === obj.nested // true

// ② Object.assign 还有个坑：它触发的是 setter
const target = {
  set name(v) { console.log('setter 被调用', v) }
}
Object.assign(target, { name: 'x' })   // setter 会跑一遍，{ ...obj } 则不会

// ③ 想「改一下不影响原对象」的最短写法
const next = { ...state, nested: { ...state.nested, city: '北京' } }

// ④ 大对象别滥用深度响应式：Vue3 里浅层对象可以用 shallowRef / shallowReactive 省掉深层代理开销`
</script>

<style scoped>
.card.is-linked {
    border-color: var(--danger);
}

.kv-list {
    display: grid;
    gap: 5px;
}

.log-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 100px;
    max-height: 240px;
    overflow-y: auto;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.log-line {
    font-size: 11px;
    color: var(--text-secondary);
    word-break: break-all;
}
.log-line.is-ok {
    color: var(--success);
}
.log-line.is-bad {
    color: var(--danger);
}
.log-line.is-info {
    color: var(--text-tertiary);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
