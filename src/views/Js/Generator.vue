<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Generator</span>
                    <h2 class="panel__title">能随时暂停的函数</h2>
                </div>
                <span class="panel__meta">yield 交出控制权，next 才接着跑</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>function*</code> 声明的函数调用后<em>不会立刻执行</em>，而是返回一个迭代器。
                    每调一次 <code>next()</code>，它就往下跑到<strong>下一个 <code>yield</code></strong> 停住，
                    把 yield 后面的值交出去并<strong>冻结现场</strong>。
                    更妙的是双向通信：<code>next(v)</code> 传进去的值，会成为<em>上一个 yield 表达式的结果</em>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">暂停</span>
                        <span class="point__v">yield 处冻结，局部变量原封不动保留着</span>
                    </div>
                    <div class="point">
                        <span class="point__k">双向</span>
                        <span class="point__v">next(v) 的值，就是上一个 yield 表达式的返回值</span>
                    </div>
                    <div class="point">
                        <span class="point__k">终点</span>
                        <span class="point__v">return 或函数跑完 → { done: true }；之后再 next 只有 undefined</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 交互推演 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">亲手按 next</h2>
                </div>
                <span class="panel__meta">高亮行 = 当前停在这一句</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="doNext(null)">next()</button>
                        <button type="button" class="w-btn" @click="doNext(inputVal)">
                            next('{{ inputVal || '值' }}')
                        </button>
                        <button type="button" class="w-btn" @click="traverse">for...of 一次跑完</button>
                        <button type="button" class="w-btn" @click="reset">重置</button>
                    </div>
                    <input v-model="inputVal" class="gen-input mono" type="text" placeholder="要传回去的值" />
                    <span class="w-hint">下次 next 会把这个值交给上一个 yield</span>
                </div>

                <div class="gen-grid">
                    <!-- 代码 -->
                    <div class="gen-code">
                        <ol class="code-lines">
                            <li
                                v-for="(line, i) in codeLines"
                                :key="i"
                                class="code-line"
                                :class="{ 'is-current': activeLine === i + 1, 'is-past': activeLine > i + 1 }">
                                <span class="ln">{{ String(i + 1).padStart(2, '0') }}</span>
                                <span class="lc mono">{{ line || ' ' }}</span>
                            </li>
                        </ol>
                        <p class="step-note">{{ note }}</p>
                    </div>

                    <!-- 调用历史 -->
                    <div class="gen-history">
                        <div class="code-block__label">调用记录</div>
                        <div class="hist-box">
                            <div v-for="(h, i) in history" :key="i" class="hist-row">
                                <span class="hist-call mono">{{ h.call }}</span>
                                <span class="hist-res mono" :class="{ 'is-done': h.done }">
                                    value: {{ h.value }}, done: {{ h.done }}
                                </span>
                            </div>
                            <span v-if="!history.length" class="queue__empty">还没有调用过 next()</span>
                        </div>

                        <div class="res-row">
                            <span class="res-k">状态</span>
                            <span class="res-v" :class="finished ? 'is-bad' : 'is-ok'">
                                {{ finished ? '生成器已结束' : '暂停中，等待 next()' }}
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
                    <h2 class="panel__title">生成器还能这么用</h2>
                </div>
                <span class="panel__meta">惰性序列、yield* 委托，以及 async 的底层</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">页面里跑的就是这个生成器</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">惰性无限序列 · yield* 委托 · 提前收工</div>
                    <CodeEditor :code="usageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/* 演示用的生成器：两个 yield + 一个 return */
function* demo(): Generator<string, string, string> {
    const a = yield '第 1 站：给我一个值'
    const b = yield `第 2 站：收到了「${a}」，再给一个`
    return `收工：${a} 和 ${b}`
}

const codeLines = [
    'function* demo() {',
    "  const a = yield '第 1 站：给我一个值'",
    '  const b = yield `第 2 站：收到了「${a}」，再给一个`',
    '  return `收工：${a} 和 ${b}`',
    '}',
]

// 每次 next() 之后停在哪一行，跑完回到 0（不高亮）
const LINE_STEPS = [2, 3, 4, 0]

type HistItem = { call: string; value: string; done: boolean }

const NOTES = [
    '停在第 2 行：yield 后面的值交出去了，函数冻结在这一句，变量 a 此时还没有值。',
    '停在第 3 行：刚才 next 传进来的值，已经赋给了变量 a。',
    '停在第 4 行：b 也拿到了，下一次 next 会执行 return 并给出 done: true。',
    '生成器已经跑完，再怎么 next 都只会拿到 { value: undefined, done: true }。',
]

const START_NOTE = '点 next() 开始：函数会从第一行往下跑，到第一个 yield 才停。'

const history = ref<HistItem[]>([])
const activeLine = ref(0)
const inputVal = ref('')
const note = ref(START_NOTE)
const finished = ref(false)

let gen: Generator<string, string, string> | null = null

function fmt(v: unknown) {
    return typeof v === 'string' ? `'${v}'` : String(v)
}

function doNext(arg: string | null) {
    if (!gen) gen = demo()
    const empty = arg === null || arg === ''
    const res = empty ? gen.next() : gen.next(arg)
    const idx = history.value.length

    history.value = [
        ...history.value,
        {
            call: `next(${empty ? '' : `'${arg}'`})`,
            value: fmt(res.value),
            done: res.done === true, // IteratorResult 的 done 是可选的，这里收窄成布尔
        },
    ]

    if (res.done) {
        activeLine.value = 0
        finished.value = true
        note.value = NOTES[3]
        return
    }

    activeLine.value = LINE_STEPS[Math.min(idx, LINE_STEPS.length - 1)]
    note.value = NOTES[Math.min(idx, NOTES.length - 1)]
}

function traverse() {
    reset()
    gen = demo()
    let cursor = gen.next()
    while (cursor.done !== true) {
        history.value = [...history.value, { call: 'next()', value: fmt(cursor.value), done: false }]
        cursor = gen.next()
    }
    activeLine.value = 0
    finished.value = true
    note.value =
        'for...of 只遍历 yield 出来的值 —— 注意最后 return 的那句「收工」没有出现在上面，' +
        '这就是 next() 与 for...of 的区别。'
}

function reset() {
    gen = null
    finished.value = false
    activeLine.value = 0
    history.value = []
    note.value = START_NOTE
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function* demo() {
  const a = yield '第 1 站：给我一个值'          // ← 停在这里，把字符串交出去
  const b = yield \`第 2 站：收到了「\${a}」，再给一个\`  // ← next 传的值赋给了 a
  return \`收工：\${a} 和 \${b}\`                   // ← done: true 时才是这个值
}

const gen = demo()
gen.next()           // { value: '第 1 站：给我一个值', done: false }
gen.next('苹果')      // { value: '第 2 站：收到了「苹果」，再给一个', done: false }
gen.next('香蕉')      // { value: '收工：苹果 和 香蕉', done: true }
gen.next()           // { value: undefined, done: true }

// 注意：return 的值不会被 for...of 遍历出来
for (const v of demo()) {
  console.log(v)     // 只有两个 yield 的字符串
}`

const usageCode = `// ① 惰性无限序列：不调用就不算，内存里永远只有当前这一项
function* fib() {
  let [a, b] = [0, 1]
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}
const iter = fib()
Array.from({ length: 8 }, () => iter.next().value)   // [0,1,1,2,3,5,8,13]

// ② yield* 把别的迭代器委托进来，像把它的代码内联到此处
function* all() {
  yield* [1, 2]        // 数组本来就可迭代
  yield* demo()
}
[...all()]             // [1, 2, '第 1 站：给我一个值', '第 2 站：…']

// ③ 提前收工：return() 让生成器立刻 done
const g = demo()
g.next()             // 走到第一个 yield
g.return('不玩了')     // { value: '不玩了', done: true }

// ④ async/await 的底层就是「Promise + 生成器自动执行」
async function run() {
  await sleep(100)   // ≈ yield 一个 Promise，由执行器替你按 next
}`
</script>

<style scoped>
.gen-input {
    flex: none;
    width: 150px;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--surface-subtle);
    border: 1px solid var(--hairline);
    padding: 6px 10px;
    outline: none;
}
.gen-input:focus {
    border-color: var(--brand);
}
.gen-input::placeholder {
    color: var(--text-tertiary);
}

.gen-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
}

/* ── 代码区 ─────────────────────────────────────────── */
.code-lines {
    list-style: none;
    margin: 0;
    padding: 6px 0;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}
.code-line {
    display: flex;
    gap: 10px;
    padding: 3px 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
    border-left: 2px solid transparent;
}
.code-line .ln {
    flex: none;
    color: var(--text-tertiary);
    opacity: 0.6;
    user-select: none;
}
.code-line .lc {
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
}
.code-line.is-past {
    color: var(--text-secondary);
}
.code-line.is-current {
    color: var(--brand);
    background: var(--brand-soft);
    border-left-color: var(--brand);
}

.step-note {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    padding-left: 10px;
}

/* ── 历史 ───────────────────────────────────────────── */
.hist-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 130px;
    padding: 8px 10px;
    margin-bottom: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.hist-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 5px 0;
    border-bottom: 1px dashed var(--hairline);
}
.hist-row:last-child {
    border-bottom: none;
}

.hist-call {
    font-size: 11px;
    color: var(--text-tertiary);
}

.hist-res {
    font-size: 11px;
    color: var(--success);
    word-break: break-all;
}
.hist-res.is-done {
    color: var(--warning);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}

@media (max-width: 900px) {
    .gen-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
