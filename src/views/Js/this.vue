<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">this</span>
                    <h2 class="panel__title">普通函数看调用，箭头函数看出身</h2>
                </div>
                <span class="panel__meta">动态绑定 vs 词法绑定，两条完全不同的规则</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    普通函数的 <code>this</code> 在<em>调用那一刻</em>才定下来，取决于谁调用它、怎么调用；
                    箭头函数压根没有自己的 <code>this</code>，它直接<em>沿用定义处外层</em>的那一个。
                    左边选一个调用方式，右边会<strong>真的执行一遍</strong>，把结果和 this 的最终去向显示出来。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">优先级</span>
                        <span class="point__v">new > 显式(call/apply/bind) > 隐式(对象方法) > 默认</span>
                    </div>
                    <div class="point">
                        <span class="point__k">箭头</span>
                        <span class="point__v">没有 prototype、不能 new、call/bind 也改不了它的 this</span>
                    </div>
                    <div class="point">
                        <span class="point__k">陷阱</span>
                        <span class="point__v">把方法赋值给变量再调用会「丢失 this」，回落到默认绑定</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 交互实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ cur.name }}</h2>
                </div>
                <span class="panel__meta">选一种调用方式，右边真跑一遍</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button
                            v-for="c in CASES"
                            :key="c.id"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': active === c.id }"
                            @click="select(c.id)">
                            {{ c.name }}
                        </button>
                    </div>
                </div>

                <div class="this-grid">
                    <!-- 代码 -->
                    <div class="this-code">
                        <div class="code-block__label">{{ cur.name }} · 代码</div>
                        <CodeEditor :code="cur.code" />
                    </div>

                    <!-- 结果 -->
                    <div class="this-result">
                        <div class="code-block__label">运行结果</div>
                        <div class="result-box">
                            <div class="res-row">
                                <span class="res-k">this</span>
                                <span class="res-v mono is-target">{{ result?.target ?? '—' }}</span>
                            </div>
                            <div class="out-list">
                                <span v-for="(line, i) in result?.lines ?? []" :key="i" class="out-line mono">
                                    {{ line }}
                                </span>
                                <span v-if="!result" class="queue__empty">点右侧「运行」执行</span>
                            </div>
                            <p class="result-note">{{ cur.desc }}</p>
                            <button type="button" class="w-btn run-btn" @click="run">运行</button>
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
                    <h2 class="panel__title">手写 call / apply / bind</h2>
                </div>
                <span class="panel__meta">显式绑定的三个方法，本质上都做同一件事</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">实现思路：把函数临时挂到目标对象上，用隐式绑定骗出 this</div>
                    <CodeEditor :code="implCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Result = { target: string; lines: string[] }
type Case = {
    id: string
    name: string
    desc: string
    code: string
    run: () => Result
}

function fmt(v: unknown): string {
    if (v === undefined) return 'undefined'
    if (v === globalThis) return 'window（全局对象）'
    if (typeof v === 'object' && v !== null) {
        return JSON.stringify(v)
    }
    return String(v)
}

const CASES: Case[] = [
    {
        id: 'default',
        name: '默认绑定',
        desc: '函数单独调用，没有任何修饰。非严格模式落到全局，严格模式下是 undefined。',
        code: `function foo() {
  return this
}

foo()                 // 非严格：window
// 严格模式下同一个调用：undefined`,
        run: () => {
            // <script setup> 自身运行在 ESM 严格模式下，
            // 想演示非严格行为得用 new Function 造一个非严格作用域。
            const out = new Function(`
                function foo() { return this }
                function strictFoo() { 'use strict'; return this }
                return { loose: foo(), strict: strictFoo() }
            `)() as { loose: unknown; strict: unknown }

            return {
                target: fmt(out.loose),
                lines: [
                    `foo()               → ${fmt(out.loose)}`,
                    `'use strict' 下调用  → ${fmt(out.strict)}`,
                ],
            }
        },
    },
    {
        id: 'implicit',
        name: '隐式绑定',
        desc: '函数作为对象的方法被调用时，this 就是那个「点号前面的对象」。',
        code: `const obj = {
  name: 'Alice',
  sayName() {
    return this.name
  }
}

obj.sayName()   // 'Alice'`,
        run: () => {
            const obj = {
                name: 'Alice',
                sayName() {
                    return this.name
                },
            }
            const v = obj.sayName()
            return {
                target: 'obj（调用者）',
                lines: [`obj.sayName()  → ${v}`],
            }
        },
    },
    {
        id: 'lost',
        name: '隐式丢失',
        desc: '把方法抠出来单独调用，就丢掉了原来的对象 this，回落到默认绑定 —— 回调里最常见。',
        code: `const obj = {
  name: 'Alice',
  sayName() {
    return this?.name
  }
}

const fn = obj.sayName   // 只是把函数本体取出来
fn()                     // undefined，this 已经不是 obj`,
        run: () => {
            const obj = {
                name: 'Alice',
                sayName() {
                    return this?.name
                },
            }
            const fn = obj.sayName
            let v: string
            try {
                v = fmt(fn())
            } catch (err) {
                v = `抛错：${(err as Error).message}`
            }
            return {
                target: 'undefined（丢失）',
                lines: [`obj.sayName()  → Alice`, `fn()           → ${v}`],
            }
        },
    },
    {
        id: 'explicit',
        name: 'call / apply',
        desc: '第一个参数就是 this；区别只在后面怎么传参 —— call 逐个，apply 给数组。',
        code: `function greet(greeting, punctuation) {
  return greeting + ', I am ' + this.name + punctuation
}

const bob = { name: 'Bob' }

greet.call(bob, 'Hello', '!')      // 'Hello, I am Bob!'
greet.apply(bob, ['Hi', '?'])      // 'Hi, I am Bob?'`,
        run: () => {
            function greet(this: { name: string }, greeting: string, punctuation: string) {
                return `${greeting}, I am ${this.name}${punctuation}`
            }
            const bob = { name: 'Bob' }
            return {
                target: 'bob（显式指定）',
                lines: [
                    `greet.call(bob, 'Hello', '!')  → ${greet.call(bob, 'Hello', '!')}`,
                    `greet.apply(bob, ['Hi', '?'])  → ${greet.apply(bob, ['Hi', '?'])}`,
                ],
            }
        },
    },
    {
        id: 'bind',
        name: 'bind',
        desc: 'bind 不立即执行，而是返回一个 this 已焊死的新函数；之后再 call 也改不动它。',
        code: `function greet() {
  return 'I am ' + this.name
}

const bob = { name: 'Bob' }
const alice = { name: 'Alice' }

const fn = greet.bind(bob)

fn()                 // 'I am Bob'
fn.call(alice)       // 还是 'I am Bob'`,
        run: () => {
            function greet(this: { name: string }) {
                return `I am ${this.name}`
            }
            const bob = { name: 'Bob' }
            const alice = { name: 'Alice' }
            const fn = greet.bind(bob)
            return {
                target: 'bob（已绑定，不可改）',
                lines: [`fn()             → ${fn()}`, `fn.call(alice)   → ${fn.call(alice)}`],
            }
        },
    },
    {
        id: 'new',
        name: 'new 绑定',
        desc: 'new 会造一个新对象，把构造函数里的 this 指向它；构造函数没返回对象时，默认返回这个新对象。',
        code: `function Person(name) {
  this.name = name
}

const alice = new Person('Alice')
alice.name   // 'Alice'`,
        run: () => {
            function Person(this: { name: string }, name: string) {
                this.name = name
            }
            const alice = new (Person as unknown as new (n: string) => { name: string })('Alice')
            return {
                target: '新创建的实例对象',
                lines: [`new Person('Alice').name  → ${alice.name}`],
            }
        },
    },
    {
        id: 'arrow',
        name: '箭头函数',
        desc: '箭头函数的 this 在定义时就锁定为外层作用域的 this，跟怎么调用完全无关。',
        code: `const obj = {
  name: 'Alice',
  normal: function () {
    return this.name          // this === obj
  },
  arrow: () => {
    return this?.name         // 这里的 this 是外层（模块/undefined）
  }
}

obj.normal()   // 'Alice'
obj.arrow()    // undefined`,
        run: () => {
            // 顶层 this 在 <script setup>（ESM 严格模式）里不可用，
            // 用 new Function 造一个非严格作用域来演示「箭头继承外层 this」。
            const out = new Function(`
                const obj = {
                  name: 'Alice',
                  normal: function () { return this.name },
                  makeArrow() { return () => this }
                }
                const topArrow = () => this
                return {
                  normalRes: obj.normal(),
                  methodArrowIsObj: obj.makeArrow()() === obj,
                  topArrowIsGlobal: topArrow() === globalThis
                }
            `)() as { normalRes: string; methodArrowIsObj: boolean; topArrowIsGlobal: boolean }

            return {
                target: '继承自定义处的外层 this（改不动）',
                lines: [
                    `obj.normal()          → ${out.normalRes}`,
                    `方法里的箭头 === obj   → ${out.methodArrowIsObj}`,
                    `顶层箭头 === window    → ${out.topArrowIsGlobal}`,
                ],
            }
        },
    },
    {
        id: 'nested',
        name: '回调里的救赎',
        desc: '嵌套的普通函数不会继承外层 this；换成箭头函数就好了 —— 这也是箭头函数最实用的场景。',
        code: `const counter = {
  seconds: 0,
  startWrong() {
    setInterval(function () {
      this.seconds++        // this 已不是 counter
    }, 1000)
  },
  startRight() {
    setInterval(() => {
      this.seconds++        // 沿用的是 startRight 的 this
    }, 1000)
  }
}`,
        run: () => {
            // 同样借非严格作用域把「普通函数 this 跑到全局」这件事演出来
            const out = new Function(`
                // timer.tickWrong 里的普通函数回调，this 已经不是 timer
                const timer = {
                  seconds: 0,
                  tickWrong() {
                    return (function () { return this && this.seconds })()
                  },
                  tickRight() {
                    return (() => this.seconds)()
                  }
                }
                return {
                  wrongThisIsGlobal: timer.tickWrong.call(globalThis) === undefined,
                  wrongSeconds: timer.seconds,
                  rightSeconds: timer.tickRight()
                }
            `)() as { wrongSeconds: number; rightSeconds: number }

            return {
                target: '箭头函数继承了外层 this',
                lines: [
                    `timer.tickWrong()  → this 跑掉，取到的是 ${fmt(out.wrongSeconds)}`,
                    `timer.tickRight()  → 箭头沿用 tickRight 的 this，拿到 ${out.rightSeconds}`,
                ],
            }
        },
    },
]

const implCode = `// call / apply：把函数临时挂到目标身上，借用「隐式绑定」骗出 this
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis
  const key = Symbol('fn')
  ctx[key] = this              // this 就是被调用的那个函数
  const res = ctx[key](...args)
  delete ctx[key]              // 用完删掉，别污染人家对象
  return res
}

Function.prototype.myApply = function (ctx, args = []) {
  return this.myCall(ctx, ...args)
}

// bind：返回新函数，this 焊死，之后再 call 也改不动
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later])
  }
}

function greet() { return 'I am ' + this.name }
greet.myCall({ name: 'Bob' })        // 'I am Bob'
greet.myBind({ name: 'Bob' })()      // 'I am Bob'`

const active = ref<string>(CASES[0].id)
const cur = computed(() => CASES.find((c) => c.id === active.value) ?? CASES[0])
const result = ref<Result | null>(null)

function select(id: string) {
    active.value = id
    result.value = null
}

function run() {
    result.value = cur.value.run()
}
</script>

<style scoped>
.this-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
}

.result-box {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 12px;
}

.is-target {
    color: var(--brand);
    font-size: 13px;
}

.out-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 10px;
    padding: 8px 10px;
    min-height: 52px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.out-line {
    font-size: 11px;
    color: var(--text-secondary);
    word-break: break-all;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}

.result-note {
    margin: 10px 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.run-btn {
    width: 100%;
    text-align: center;
    padding: 9px 12px;
}

@media (max-width: 900px) {
    .this-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
