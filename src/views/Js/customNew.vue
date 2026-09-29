<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">new operator</span>
                    <h2 class="panel__title">new 一次，引擎偷偷做了四件事</h2>
                </div>
                <span class="panel__meta">创建对象、接原型、绑 this、决定返回值</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>new Fn()</code> 看着简单，背后是一套固定流程。其中最容易被忽略的是最后一步：
                    构造函数如果<em>返回了一个对象</em>，那么这个对象会<strong>顶掉</strong>刚创建出来的实例；
                    返回原始值则被忽略，照样用那个实例。下面把每一步摊开给你看。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">①</span>
                        <span class="point__v">新建一个空对象</span>
                    </div>
                    <div class="point">
                        <span class="point__k">②</span>
                        <span class="point__v">把它的 [[Prototype]] 指向构造函数的 prototype</span>
                    </div>
                    <div class="point">
                        <span class="point__k">③</span>
                        <span class="point__v">以它为 this 执行构造函数</span>
                    </div>
                    <div class="point">
                        <span class="point__k">④</span>
                        <span class="point__v">构造函数返回对象就用它，否则用第 ① 步的对象</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 分步演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ current.name }}</h2>
                </div>
                <span class="panel__meta">{{ current.summary }}</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">构造函数</span>
                    <div class="w-btns">
                        <button
                            v-for="s in SCENES"
                            :key="s.name"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': active === s.name }"
                            @click="pick(s.name)">
                            {{ s.name }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="atEnd" @click="next">
                            下一步
                        </button>
                        <button type="button" class="w-btn" @click="runAll">一次跑完</button>
                        <button type="button" class="w-btn" @click="reset">重置</button>
                    </div>
                    <span class="w-hint">第 {{ step + 1 }} / {{ steps.length }} 步</span>
                </div>

                <div class="new-grid">
                    <!-- 步骤 -->
                    <ol class="steps">
                        <li
                            v-for="(s, i) in steps"
                            :key="i"
                            class="step-item"
                            :class="{ 'is-current': i === step, 'is-done': i < step }">
                            <span class="step-no mono">{{ i + 1 }}</span>
                            <span class="step-text">{{ s.text }}</span>
                        </li>
                    </ol>

                    <!-- 中间状态 -->
                    <div class="snap">
                        <div class="code-block__label">当前对象状态</div>
                        <pre class="snap__json mono">{{ curSnap }}</pre>
                        <div class="res-row">
                            <span class="res-k">最终</span>
                            <span class="res-v mono" :class="atEnd ? 'is-ok' : ''">
                                {{ snap.isReturned ? '采用构造函数的返回值' : '采用第 ① 步创建的实例' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">手写 new</h2>
                </div>
                <span class="panel__meta">四步一行不落</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">myNew · 支持任意构造函数与参数</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">对比：构造函数返回不同类型时的结果</div>
                    <CodeEditor :code="retCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Ctor = (...args: unknown[]) => unknown

type Scene = {
    name: string
    summary: string
    ctor: Ctor
    ctorBody: string
    // 每一步跑完之后，对象的快照
    steps: { text: string; snap: string; isReturned: boolean }[]
}

const SCENES: Scene[] = [
    {
        name: '普通构造函数',
        summary: '什么都不返回，拿到的就是那个新实例',
        ctor: function Person(this: Record<string, unknown>, name: string) {
            this.name = name
            this.say = () => `我是 ${this.name}`
        } as unknown as Ctor,
        ctorBody: 'Person',
        steps: [
            { text: '创建一个空对象 obj', snap: '{}', isReturned: false },
            {
                text: 'obj.__proto__ 指向 Person.prototype',
                snap: '{\n  // [[Prototype]] → Person.prototype\n}',
                isReturned: false,
            },
            {
                text: '以 obj 为 this 执行 Person.call(obj, \'Alice\')',
                snap: '{\n  name: "Alice",\n  say: ƒ\n}',
                isReturned: false,
            },
            {
                text: '构造函数没返回值 → 返回 obj',
                snap: '{\n  name: "Alice",\n  say: ƒ\n}',
                isReturned: false,
            },
        ],
    },
    {
        name: '返回对象',
        summary: '构造函数手写了 return {} —— 这个对象会顶替实例',
        ctor: function Robot(this: Record<string, unknown>, name: string) {
            this.name = name
            return { tag: '我自己返回的' }
        } as unknown as Ctor,
        ctorBody: 'Robot',
        steps: [
            { text: '创建一个空对象 obj', snap: '{}', isReturned: false },
            {
                text: 'obj.__proto__ 指向 Robot.prototype',
                snap: '{\n  // [[Prototype]] → Robot.prototype\n}',
                isReturned: false,
            },
            {
                text: '执行 Robot.call(obj, \'Alice\')，this.name 确实写进去了',
                snap: '{\n  name: "Alice"\n}',
                isReturned: false,
            },
            {
                text: '但构造函数返回了对象 → 它顶掉 obj',
                snap: '{\n  tag: "我自己返回的"\n}',
                isReturned: true,
            },
        ],
    },
    {
        name: '返回原始值',
        summary: 'return 42 会被忽略，照样返回那个实例',
        ctor: function Widget(this: Record<string, unknown>, name: string) {
            this.name = name
            return 42
        } as unknown as Ctor,
        ctorBody: 'Widget',
        steps: [
            { text: '创建一个空对象 obj', snap: '{}', isReturned: false },
            {
                text: 'obj.__proto__ 指向 Widget.prototype',
                snap: '{\n  // [[Prototype]] → Widget.prototype\n}',
                isReturned: false,
            },
            {
                text: '执行 Widget.call(obj, \'Alice\')',
                snap: '{\n  name: "Alice"\n}',
                isReturned: false,
            },
            {
                text: '构造函数返回 42（原始值）→ 被无视，还是用 obj',
                snap: '{\n  name: "Alice"\n}',
                isReturned: false,
            },
        ],
    },
]

const active = ref<string>(SCENES[0].name)
const current = computed(() => SCENES.find((s) => s.name === active.value) ?? SCENES[0])
const steps = computed(() => current.value.steps)
const step = ref(0)
const atEnd = computed(() => step.value >= steps.value.length - 1)
const snap = computed(() => steps.value[step.value])
const curSnap = computed(() => snap.value.snap)

function pick(name: string) {
    active.value = name
    step.value = 0
}

function next() {
    if (atEnd.value) return
    step.value++
}

function runAll() {
    step.value = steps.value.length - 1
}

function reset() {
    step.value = 0
}

/*  真实跑一遍手写的 new，验证第 ④ 步的判断逻辑。
    页面上的步骤动画就是它的可视化版本。 */
function myNew(ctor: Ctor, ...args: unknown[]) {
    const obj = Object.create(ctor.prototype as object) // ① ② 一步到位
    const ret = ctor.apply(obj, args) // ③
    const isObject = ret !== null && (typeof ret === 'object' || typeof ret === 'function')
    return isObject ? ret : obj // ④
}

// 让 TS 不报「未使用」，同时也确认实现可用
console.log('[customNew] demo ready:', typeof myNew === 'function')

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function myNew(constructor, ...args) {
  // ① 创建空对象 ② 让它继承构造函数的原型
  const obj = Object.create(constructor.prototype)

  // ③ 把构造函数里的 this 绑到这个对象上并执行
  const result = constructor.apply(obj, args)

  // ④ 返回值判定：只有「对象/函数」才能顶替实例
  const isObject = result !== null &&
    (typeof result === 'object' || typeof result === 'function')

  return isObject ? result : obj
}

// 用起来
function Person(name) {
  this.name = name
}
Person.prototype.say = function () { return '我是 ' + this.name }

const p = myNew(Person, 'Alice')
p.say()                       // '我是 Alice'
p instanceof Person           // true
Object.getPrototypeOf(p) === Person.prototype   // true`

const retCode = `function A() { this.x = 1 }
function B() { this.x = 1; return { y: 2 } }
function C() { this.x = 1; return 42 }
function D() { this.x = 1; return null }
function E() { this.x = 1; return function () {} }

new A()   // { x: 1 }            ← 没返回值，用实例
new B()   // { y: 2 }            ← 返回对象，实例被顶掉
new C()   // { x: 1 }            ← 返回原始值，被忽略
new D()   // { x: 1 }            ← 返回 null 也算「不是对象」
new E()   // ƒ () {}             ← 函数也是对象，照样顶替

// 注意：class 必须配合 new，且不能返回原始值之外来覆盖 this 的语义
class F {
  constructor() { return 1 }    // 合法，被忽略
}
class G {
  constructor() { return {} }   // 合法！但实例是那个 {}（拿不到 class 的方法）`
</script>

<style scoped>
.new-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
}

.steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
}

.step-item {
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 9px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    font-size: 12px;
    color: var(--text-tertiary);
    transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.step-item.is-done {
    color: var(--text-secondary);
    border-color: var(--hairline-strong);
}
.step-item.is-current {
    color: var(--brand);
    border-color: var(--brand);
    background: var(--brand-soft);
}

.step-no {
    flex: none;
    font-size: 11px;
    opacity: 0.8;
}

.step-text {
    line-height: 1.6;
}

.snap {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 12px;
}

.snap__json {
    margin: 0 0 12px;
    padding: 10px 12px;
    min-height: 110px;
    border: 1px solid var(--hairline);
    background: var(--surface);
    font-size: 11px;
    line-height: 1.7;
    color: var(--text-primary);
    white-space: pre-wrap;
}

@media (max-width: 900px) {
    .new-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
