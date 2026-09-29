<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Closure</span>
                    <h2 class="panel__title">函数 + 它出生时的那间屋子</h2>
                </div>
                <span class="panel__meta">外层函数已经返回，里面的变量却还活着</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    当一个内部函数被<em>拿到外部</em>引用时，它所依赖的外层变量不会被回收，
                    而是跟着这个函数一起留在内存里 —— 这就是闭包。
                    换句话说：<code>闭包 = 函数 + 定义它时的词法作用域</code>，
                    那间「屋子」只有它能进。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">前提</span>
                        <span class="point__v">函数嵌套，且内层函数被外部持有（返回、挂到对象、当回调用）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">效果</span>
                        <span class="point__v">外层作用域「持久化」，变量既不销毁也不外泄</span>
                    </div>
                    <div class="point">
                        <span class="point__k">代价</span>
                        <span class="point__v">这些变量不会被 GC，用多了就是实打实的内存占用</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：私有变量 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">三个计数器，各自记各自的</h2>
                </div>
                <span class="panel__meta">count 谁都碰不到，只能通过闭包函数改</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="add">+ 新建一个计数器</button>
                        <button type="button" class="w-btn" @click="counters = []">清空</button>
                    </div>
                    <span class="w-hint">
                        每按一次 +1，每个计数器的 count 互不影响——它们各自活在自己的闭包里
                    </span>
                </div>

                <div class="cards">
                    <article v-for="(c, i) in counters" :key="i" class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ c.name }}</h3>
                            <span class="card__tag is-good">私有变量</span>
                        </div>
                        <p class="card__desc">
                            <code>let count</code> 藏在 <code>{{ c.name }}()</code> 调用产生的闭包里，
                            外部拿不到也改不了。
                        </p>
                        <div class="counter-read mono">{{ c.get() }}</div>
                        <div class="w-btns counter-btns">
                            <button type="button" class="w-btn" @click="touch(c.dec)">- 1</button>
                            <button type="button" class="w-btn" @click="touch(c.inc)">+ 1</button>
                        </div>
                    </article>

                    <div v-if="!counters.length" class="card card--empty">
                        <p class="card__desc">
                            点上面那个按钮，每创建一次就诞生一个<strong>全新的独立作用域</strong>。
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：循环陷阱 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">那道经典陷阱：循环里的 var</h2>
                </div>
                <span class="panel__meta">闭包记住的是同一个屋子，不是每一次快照</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="running" @click="runLoop">
                            {{ running ? '跑一下，稍等 0.5 秒……' : '跑一遍循环' }}
                        </button>
                    </div>
                    <span class="w-hint">三种写法同时跑，看延迟打印出来的是啥</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">var + setTimeout</h3>
                            <span class="card__tag is-bad">全是 3</span>
                        </div>
                        <p class="card__desc">
                            三个回调共享同一个<strong>函数作用域</strong>里的 i，
                            等它们执行时循环早跑完了。
                        </p>
                        <div class="loop-out">
                            <span v-for="(v, i) in outVar" :key="i" class="loop-line mono">{{ v }}</span>
                            <span v-if="!outVar.length" class="queue__empty">尚未运行</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">let + setTimeout</h3>
                            <span class="card__tag is-good">0 1 2</span>
                        </div>
                        <p class="card__desc">
                            <code>let</code> 每轮循环都新建一个块级作用域，等价于给每轮一个自己的 i。
                        </p>
                        <div class="loop-out">
                            <span v-for="(v, i) in outLet" :key="i" class="loop-line mono">{{ v }}</span>
                            <span v-if="!outLet.length" class="queue__empty">尚未运行</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">var + IIFE</h3>
                            <span class="card__tag is-good">0 1 2</span>
                        </div>
                        <p class="card__desc">
                            用立即执行函数把每轮的 i 当参数传进去，
                            <strong>手动造一个闭包</strong>把值扣住。
                        </p>
                        <div class="loop-out">
                            <span v-for="(v, i) in outIife" :key="i" class="loop-line mono">{{ v }}</span>
                            <span v-if="!outIife.length" class="queue__empty">尚未运行</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实现就这么多</h2>
                </div>
                <span class="panel__meta">和上面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">实验一 · 计数器工厂</div>
                    <CodeEditor :code="counterCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">实验二 · 循环陷阱的三种写法</div>
                    <CodeEditor :code="loopCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'

/* ── 实验一：闭包保存私有变量 ─────────────────────────── */
type Counter = {
    name: string
    inc: () => number
    dec: () => number
    get: () => number
}

// 每次调用 createCounter 都会产生一个全新的作用域，
// 里面的 count 只属于这次创建出来的那一组函数。
function createCounter(name: string): Counter {
    let count = 0
    return {
        name,
        inc: () => ++count,
        dec: () => --count,
        get: () => count,
    }
}

// count 存在闭包里，模板读它不会自动触发更新，
// 所以每次改完用「换引用」的方式手动刷新视图。
const counters = shallowRef<Counter[]>([])
let seq = 0

function add() {
    seq += 1
    counters.value = [...counters.value, createCounter(`counter-${seq}`)]
}

function touch(fn: () => number) {
    fn()
    counters.value = [...counters.value]
}

/* ── 实验二：循环里的闭包陷阱 ─────────────────────────── */
const running = ref(false)
const outVar = ref<string[]>([])
const outLet = ref<string[]>([])
const outIife = ref<string[]>([])

function runLoop() {
    running.value = true
    outVar.value = []
    outLet.value = []
    outIife.value = []

    // ① var：三个回调共享同一个 i
    for (var i = 0; i < 3; i++) {
        setTimeout(() => {
            outVar.value = [...outVar.value, `第 ${outVar.value.length + 1} 次 → i = ${i}`]
        }, 400)
    }

    // ② let：每轮一个独立的块级作用域
    for (let j = 0; j < 3; j++) {
        setTimeout(() => {
            outLet.value = [...outLet.value, `第 ${outLet.value.length + 1} 次 → j = ${j}`]
        }, 400)
    }

    // ③ var + IIFE：手动把值扣进新的作用域
    for (var k = 0; k < 3; k++) {
        ;((n: number) => {
            setTimeout(() => {
                outIife.value = [...outIife.value, `第 ${outIife.value.length + 1} 次 → n = ${n}`]
            }, 400)
        })(k)
    }

    setTimeout(() => {
        running.value = false
    }, 500)
}

/* ── 展示用源码 ───────────────────────────────────────── */
const counterCode = `function createCounter(name) {
  // 这个 count 只在这间屋子里，外面够不着
  let count = 0

  return {
    name,
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
  }
}

// 调用两次 = 造出两间互不相干的屋子
const a = createCounter('counter-1')
const b = createCounter('counter-2')

a.inc(); a.inc()   // a 记到 2
b.inc()            // b 还是 1，不受 a 影响`

const loopCode = `// ① 全是同一个 i：回调执行时循环早结束了
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 400)   // 3, 3, 3
}

// ② let 每轮新建作用域，各自记住自己的值
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 400)   // 0, 1, 2
}

// ③ var 时代的老办法：IIFE 把值当参数固定住
for (var k = 0; k < 3; k++) {
  ((n) => {
    setTimeout(() => console.log(n), 400) // 0, 1, 2
  })(k)
}`
</script>

<style scoped>
.card--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-style: dashed;
    background: transparent;
}
.card--empty .card__desc {
    margin: 0;
}

.counter-read {
    font-size: 26px;
    line-height: 1;
    color: var(--brand);
    padding: 8px 0 12px;
}

.counter-btns {
    gap: 8px;
}

.counter-btns .w-btn {
    flex: 1;
    text-align: center;
}

.loop-out {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 54px;
    padding: 8px 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.loop-line {
    font-size: 11px;
    color: var(--text-secondary);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
