<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Prototype</span>
                    <h2 class="panel__title">对象背后那条看不见的链</h2>
                </div>
                <span class="panel__meta">prototype 是函数的属性，__proto__ 是对象的属性</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    只有<em>函数</em>才有 <code>prototype</code>（原型对象，给实例继承用）；
                    每个<em>对象</em>都有一条内部链接指向自己的原型（可读作 <code>__proto__</code>，
                    标准写法是 <code>Object.getPrototypeOf()</code>）。
                    实例的属性一层找不到，就顺着这条链往上问，直到 <code>null</code>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">关系</span>
                        <span class="point__v">实例.__proto__ === 构造函数.prototype</span>
                    </div>
                    <div class="point">
                        <span class="point__k">终点</span>
                        <span class="point__v">Object.prototype.__proto__ === null，链到此为止</span>
                    </div>
                    <div class="point">
                        <span class="point__k">查找</span>
                        <span class="point__v">自身 → 原型 → 再原型 …… 找到为止，全无则 undefined</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 原型链可视化 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Chain</span>
                    <h2 class="panel__title">person 这条链长什么样</h2>
                </div>
                <span class="panel__meta">每层列出它自己「拥有」的属性</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">演示用的对象</div>
                    <CodeEditor :code="setupCode" />
                </div>

                <div class="chain">
                    <template v-for="(node, i) in chain" :key="i">
                        <div class="chain__arrow mono" v-if="i > 0">__proto__ →</div>
                        <div
                            class="chain__node"
                            :class="{
                                'is-hit': i === hitLevel,
                                'is-visited': i <= probeLevel && i !== hitLevel,
                            }">
                            <div class="chain__name mono">{{ node.name }}</div>
                            <div class="chain__props">
                                <span v-for="p in node.props" :key="p" class="prop-chip mono">{{ p }}</span>
                                <span v-if="!node.props.length" class="queue__empty">无自有属性</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <!-- ③ 属性查找演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Lookup</span>
                    <h2 class="panel__title">访问一个属性时，它往上问了谁</h2>
                </div>
                <span class="panel__meta">选一个属性看看它落在哪一层</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">属性</span>
                    <div class="w-btns">
                        <button
                            v-for="p in PROPS"
                            :key="p.name"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': prop === p.name }"
                            @click="pick(p.name)">
                            {{ p.name }}
                        </button>
                    </div>
                    <span class="w-hint">{{ currentProp?.hint }}</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="probing" @click="probe">
                            {{ probing ? '查找中……' : '开始查找' }}
                        </button>
                    </div>
                    <span class="w-hint">一层一层往上问，命中即停</span>
                </div>

                <div class="lookup-out">
                    <span v-for="(line, i) in trail" :key="i" class="trail-line" :class="line.cls">
                        <span class="trail-level mono">{{ line.level }}</span>
                        <span>{{ line.text }}</span>
                    </span>
                    <span v-if="!trail.length" class="queue__empty">尚未开始查找</span>
                </div>

                <div class="res-row final-res">
                    <span class="res-k">结果</span>
                    <span class="res-v mono" :class="hitLevel === null ? 'is-bad' : 'is-ok'">
                        {{ finalText }}
                    </span>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">顺着链自己走一遍</h2>
                </div>
                <span class="panel__meta">上面的查链动画就是用这两段代码算出来的</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">遍历整条原型链</div>
                    <CodeEditor :code="chainCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">模拟属性查找</div>
                    <CodeEditor :code="lookupCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/* ── 演示对象：一条标准的两级原型链 ───────────────────── */
class Person {
    name: string
    constructor(name: string) {
        this.name = name
    }
    sayName() {
        return this.name
    }
}

const person = new Person('Alice')

/* ── 原型链快照 ───────────────────────────────────────── */
type Node = { name: string; props: string[] }

const chain = computed<Node[]>(() => {
    const nodes: Node[] = []
    let cur: object | null = person
    let level = 0
    while (cur) {
        nodes.push({
            name: level === 0 ? 'person（实例）' : level === 1 ? 'Person.prototype' : 'Object.prototype',
            props: Object.getOwnPropertyNames(cur).filter((p) => p !== 'constructor'),
        })
        cur = Object.getPrototypeOf(cur)
        level += 1
    }
    nodes.push({ name: 'null', props: [] })
    return nodes
})

/* ── 属性查找 ─────────────────────────────────────────── */
const PROPS = [
    { name: 'name', hint: '实例自身就有' },
    { name: 'sayName', hint: '挂在 Person.prototype 上' },
    { name: 'toString', hint: '一路问到 Object.prototype' },
    { name: 'nickname', hint: '整条链上都没有' },
] as const

const prop = ref<string>('sayName')
const currentProp = computed(() => PROPS.find((p) => p.name === prop.value))

type TrailLine = { level: string; text: string; cls: string }

const trail = ref<TrailLine[]>([])
const hitLevel = ref<number | null>(null)
const probeLevel = ref(-1)
const probing = ref(false)
const finalText = ref('—')

let timer: ReturnType<typeof setTimeout> | null = null

function pick(name: string) {
    prop.value = name
    resetTrail()
}

function resetTrail() {
    if (timer) clearTimeout(timer)
    trail.value = []
    hitLevel.value = null
    probeLevel.value = -1
    probing.value = false
    finalText.value = '—'
}

function probe() {
    resetTrail()
    probing.value = true

    let level = 0
    let cur: object | null = person

    const walk = () => {
        if (!cur) {
            // 走到 null 了
            probing.value = false
            trail.value = [
                ...trail.value,
                { level: 'null', text: '链已到头，返回 undefined', cls: 'is-miss' },
            ]
            finalText.value = 'undefined'
            return
        }

        const own = Object.prototype.hasOwnProperty.call(cur, prop.value)
        probeLevel.value = level

        if (own) {
            const value = (person as unknown as Record<string, unknown>)[prop.value]
            const raw = typeof value === 'function' ? 'ƒ function' : String(value)
            trail.value = [
                ...trail.value,
                { level: chain.value[level].name, text: `命中 → ${raw}`, cls: 'is-hit' },
            ]
            hitLevel.value = level
            probing.value = false
            finalText.value = raw
            return
        }

        trail.value = [
            ...trail.value,
            { level: chain.value[level].name, text: `没有 ${prop.value}，继续往上`, cls: 'is-miss' },
        ]
        cur = Object.getPrototypeOf(cur)
        level += 1
        timer = setTimeout(walk, 620)
    }

    walk()
}

/* ── 展示用源码 ───────────────────────────────────────── */
const setupCode = `class Person {
  constructor(name) {
    this.name = name          // 实例自身的属性
  }
  sayName() {
    return this.name          // 挂在 Person.prototype 上
  }
}

const person = new Person('Alice')

Object.getPrototypeOf(person) === Person.prototype   // true
Person.prototype.constructor === Person              // true`

const chainCode = `function walkProtoChain(obj) {
  let cur = obj
  const chain = []
  while (cur) {
    chain.push({
      name: cur.constructor?.name || 'Object.prototype',
      props: Object.getOwnPropertyNames(cur),
    })
    cur = Object.getPrototypeOf(cur)   // 一层一层往上
  }
  return chain   // 最后自然走到 null
}`

const lookupCode = `// 引擎查找属性做的事，摊开就是这么个循环
function lookup(obj, prop) {
  let cur = obj
  while (cur) {
    if (Object.prototype.hasOwnProperty.call(cur, prop)) {
      return cur[prop]          // 命中即停，不再往上
    }
    cur = Object.getPrototypeOf(cur)
  }
  return undefined              // 问到 null 也没有
}

lookup(person, 'name')      // 'Alice'          —— 实例自身
lookup(person, 'sayName')   // ƒ sayName()      —— Person.prototype
lookup(person, 'toString')  // ƒ toString()     —— Object.prototype
lookup(person, 'nickname')  // undefined        —— 扑空`
</script>

<style scoped>
.chain {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 8px;
}

.chain__arrow {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: var(--text-tertiary);
}

.chain__node {
    flex: 1 1 180px;
    min-width: 0;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 10px 12px;
    transition: border-color 0.2s, background 0.2s;
}

.chain__name {
    font-size: 12px;
    color: var(--text-primary);
    margin-bottom: 8px;
    word-break: break-all;
}

.chain__props {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.prop-chip {
    font-size: 11px;
    padding: 2px 6px;
    border: 1px solid var(--hairline);
    color: var(--text-tertiary);
    background: var(--surface);
}

.chain__node.is-visited {
    border-color: var(--hairline-strong);
}

.chain__node.is-hit {
    border-color: var(--success);
    background: var(--brand-soft);
}
.chain__node.is-hit .chain__name {
    color: var(--brand);
}

/* ── 查找日志 ─────────────────────────────────────────── */
.lookup-out {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 96px;
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.trail-line {
    display: flex;
    gap: 12px;
    align-items: baseline;
    font-size: 12px;
    color: var(--text-secondary);
    padding: 3px 0;
    border-bottom: 1px dashed var(--hairline);
}
.trail-line:last-child {
    border-bottom: none;
}

.trail-level {
    flex: none;
    width: 150px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.trail-line.is-hit {
    color: var(--success);
}
.trail-line.is-hit .trail-level {
    color: var(--success);
}
.trail-line.is-miss {
    color: var(--text-secondary);
}

.final-res {
    padding-top: 4px;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
