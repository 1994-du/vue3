<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Dynamic Script</span>
                    <h2 class="panel__title">手动往页面里塞一个 script</h2>
                </div>
                <span class="panel__meta">onload / onerror 决定 Promise 的成败</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    动态加载脚本的核心就一句：<em>创建 script 元素 → 挂到文档上 → 等 <code>onload</code></em>。
                    把它包一层 Promise 之后，就能用 <code>await</code> 表达加载顺序。
                    但工程上还需要三件东西：<strong>去重缓存</strong>（同一个 URL 别插两次）、
                    <strong>失败清理</strong>（onerror 要把缓存里的坏记录删掉）、
                    <strong>并发限制</strong>（一次性塞几十个 script 会把带宽打满）。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">时机</span>
                        <span class="point__v">appendChild 之后才开始下载，onload 代表执行完毕</span>
                    </div>
                    <div class="point">
                        <span class="point__k">缓存</span>
                        <span class="point__v">用 Map 存 Promise，同一 URL 第二次直接复用</span>
                    </div>
                    <div class="point">
                        <span class="point__k">失败</span>
                        <span class="point__v">404 / 语法错误走 onerror，缓存里的记录要一并清掉</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">真的加载三个脚本</h2>
                </div>
                <span class="panel__meta">脚本内容由 Blob 动态生成，离线也能跑</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy" @click="runSerial">
                            {{ busy ? '加载中……' : '顺序加载 await' }}
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="runParallel">
                            并行加载 Promise.all
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="runCached">
                            再加载一次（命中缓存）
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="runBroken">
                            加载一个坏地址
                        </button>
                        <button type="button" class="w-btn" @click="clear">清空</button>
                    </div>
                </div>

                <div class="gantt">
                    <div v-for="s in SCRIPTS" :key="s.name" class="gantt__row">
                        <span class="gantt__name mono">{{ s.name }}</span>
                        <div class="gantt__lane">
                            <span
                                class="gantt__bar"
                                :class="barClass(s.name)"
                                :style="barStyle(s.name)">
                                <span v-if="endOf(s.name) !== null" class="gantt__label mono">
                                    {{ Math.round((endOf(s.name) as number) - (startOf(s.name) as number)) }} ms
                                </span>
                            </span>
                        </div>
                        <span class="gantt__state mono">{{ stateText(s.name) }}</span>
                    </div>
                    <p v-if="!runs.length" class="queue__empty gantt__empty">点上面的按钮开始</p>
                </div>

                <div class="code-block__label">执行日志</div>
                <div class="log-box">
                    <span v-for="(l, i) in logs" :key="i" class="log-line mono" :class="l.kind">
                        {{ l.text }}
                    </span>
                    <span v-if="!logs.length" class="queue__empty">尚未加载任何脚本</span>
                </div>

                <div class="res-row final-row">
                    <span class="res-k">挂在 window 上</span>
                    <span class="res-v mono">{{ modulesText }}</span>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">从最简版到能用版</h2>
                </div>
                <span class="panel__meta">上面跑的是带缓存那一版</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">基础版 + 带缓存/清理的工程版</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">并发控制：一次最多跑 N 个</div>
                    <CodeEditor :code="poolCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type ScriptInfo = { name: string; cost: number }
type Run = { name: string; start: number; end: number | null; failed?: boolean; cached?: boolean }

const SCRIPTS: ScriptInfo[] = [
    { name: 'a.js', cost: 120 },
    { name: 'b.js', cost: 200 },
    { name: 'c.js', cost: 160 },
]

/* 用 Blob 现场生成脚本内容，避免依赖任何外部 CDN */
function makeUrl(info: ScriptInfo) {
    const body = `
      (function () {
        window.__MODS = window.__MODS || {}
        // 用同步忙等模拟「下载 + 解析」的时间开销
        var t = Date.now()
        while (Date.now() - t < ${info.cost}) { /* 占住主线程 */ }
        window.__MODS['${info.name}'] = '${info.name} 导出的数据'
      })()
    `
    return URL.createObjectURL(new Blob([body], { type: 'application/javascript' }))
}

const urls: Record<string, string> = {}
SCRIPTS.forEach((s) => {
    urls[s.name] = makeUrl(s)
})
// 一个必然 404 的地址，用来演示 onerror
const BROKEN = '/__vue3_demo_not_exist__.js'

/* 带缓存的 loadScript */
const cache = new Map<string, Promise<void>>()

function loadScript(src: string): Promise<void> {
    const cached = cache.get(src)
    if (cached) return cached

    const p = new Promise<void>((resolve, reject) => {
        const el = document.createElement('script')
        el.src = src
        el.onload = () => resolve()
        el.onerror = () => {
            cache.delete(src) // 失败了就别再把它的 Promise 留在缓存里
            reject(new Error(`加载失败：${src}`))
        }
        document.body.appendChild(el)
    })

    cache.set(src, p)
    return p
}

const runs = ref<Run[]>([])
const logs = ref<{ text: string; kind: string }[]>([])
const busy = ref(false)

let t0 = 0

const maxMs = computed(() => Math.max(...runs.value.map((r) => r.end ?? 0), 1))
const modulesText = computed(() => {
    const mods = (window as unknown as { __MODS?: Record<string, string> }).__MODS
    if (!mods) return '—'
    const keys = Object.keys(mods)
    if (!keys.length) return '—'
    return keys.map((k) => `${k}=${mods[k]}`).join(' · ')
})

function now() {
    return performance.now() - t0
}

function runOf(name: string) {
    return runs.value.find((r) => r.name === name)
}
function startOf(name: string) {
    return runOf(name)?.start ?? 0
}
function endOf(name: string) {
    return runOf(name)?.end ?? null
}
function barClass(name: string) {
    const r = runOf(name)
    if (!r) return ''
    if (r.failed) return 'is-failed'
    if (r.cached) return 'is-cached'
    return r.end !== null ? 'is-done' : 'is-running'
}
function barStyle(name: string) {
    const r = runOf(name)
    if (!r) return { left: '0%', width: '0%' }
    const start = r.start
    const end = r.end ?? now()
    return {
        left: `${(start / maxMs.value) * 100}%`,
        width: `${((end - start) / maxMs.value) * 100}%`,
    }
}
function stateText(name: string) {
    const r = runOf(name)
    if (!r) return '未加载'
    if (r.failed) return '失败'
    if (r.cached) return '命中缓存'
    return r.end !== null ? '完成' : '加载中'
}

function mark(name: string, patch: Partial<Run>) {
    const exist = runs.value.find((r) => r.name === name)
    if (exist) {
        runs.value = runs.value.map((r) => (r.name === name ? { ...r, ...patch } : r))
    } else {
        runs.value = [...runs.value, { name, start: now(), end: null, ...patch }]
    }
}

async function doLoad(info: ScriptInfo) {
    const src = urls[info.name]
    const isCached = cache.has(src)
    mark(info.name, { start: now(), end: null, cached: isCached, failed: false })
    await loadScript(src)
    mark(info.name, { end: now() })
    logs.value = [
        ...logs.value,
        {
            text: `${info.name} 加载完成${isCached ? '（复用缓存，没有插入新 script）' : ''}`,
            kind: 'is-ok',
        },
    ]
}

async function runSerial() {
    busy.value = true
    runs.value = []
    t0 = performance.now()
    logs.value = [{ text: '顺序加载：一个加载完才发起下一个', kind: 'is-info' }]

    for (const info of SCRIPTS) {
        await doLoad(info)
    }

    logs.value = [...logs.value, { text: `全部完成，总耗时 ${Math.round(now())} ms`, kind: 'is-ok' }]
    busy.value = false
}

async function runParallel() {
    busy.value = true
    runs.value = []
    t0 = performance.now()
    logs.value = [{ text: '并行加载：同时发起，总耗时取决于最慢的那个', kind: 'is-info' }]

    await Promise.all(SCRIPTS.map((info) => doLoad(info)))

    logs.value = [...logs.value, { text: `全部完成，总耗时 ${Math.round(now())} ms`, kind: 'is-ok' }]
    busy.value = false
}

async function runCached() {
    if (!runs.value.length) {
        logs.value = [{ text: '先加载一次再点这个，才能看出缓存的差异', kind: 'is-warn' }]
        return
    }
    busy.value = true
    t0 = performance.now()
    logs.value = [...logs.value, { text: '再次加载同一批脚本 —— 观察缓存命中', kind: 'is-info' }]
    for (const info of SCRIPTS) {
        await doLoad(info)
    }
    logs.value = [...logs.value, { text: `走缓存几乎瞬间返回，总耗时 ${Math.round(now())} ms`, kind: 'is-ok' }]
    busy.value = false
}

async function runBroken() {
    busy.value = true
    t0 = performance.now()
    logs.value = [...logs.value, { text: '加载一个不存在的地址，看 onerror 怎么走', kind: 'is-info' }]
    try {
        await loadScript(BROKEN)
    } catch (err) {
        logs.value = [...logs.value, { text: `捕获到失败：${(err as Error).message}`, kind: 'is-bad' }]
    }
    busy.value = false
}

function clear() {
    runs.value = []
    logs.value = []
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `// ① 最简版
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)   // 插进文档才真正开始下载
  })
}

// ② 工程版：缓存去重 + 失败清理
const cache = new Map()

function loadScriptSafe(src) {
  if (cache.has(src)) return cache.get(src)   // 同一个 URL 复用同一个 Promise

  const p = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => {
      cache.delete(src)     // ★ 失败了要让下次能重试
      reject(new Error('加载失败：' + src))
    }
    document.body.appendChild(script)
  })

  cache.set(src, p)
  return p
}

// 顺序：一个好了再下一个
await loadScriptSafe('a.js')
await loadScriptSafe('b.js')

// 并行：同时发，总耗时取最慢的
await Promise.all([loadScriptSafe('a.js'), loadScriptSafe('b.js')])`

const poolCode = `// 并发池：一次最多 n 个，剩下的排队
function createPool(limit) {
  let active = 0
  const queue = []

  const next = () => {
    if (active >= limit || !queue.length) return
    active++
    const { task, resolve, reject } = queue.shift()
    task().then(resolve, reject).finally(() => {
      active--
      next()          // 有坑位了，拉下一个
    })
  }

  return function run(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject })
      next()
    })
  }
}

const run = createPool(3)   // 最多同时发 3 个

const urls = ['a.js', 'b.js', 'c.js', 'd.js', 'e.js']
await Promise.all(urls.map((u) => run(() => loadScriptSafe(u))))

// 想要「全部都跑完，哪怕有失败」：
const results = await Promise.allSettled(urls.map((u) => loadScriptSafe(u)))
results
  .filter((r) => r.status === 'rejected')
  .forEach((r) => console.error('挂了的：', r.reason))`
</script>

<style scoped>
.gantt {
    display: grid;
    gap: 6px;
    padding: 12px;
    margin-bottom: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.gantt__row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.gantt__name {
    flex: none;
    width: 54px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.gantt__lane {
    position: relative;
    flex: 1;
    height: 20px;
    background: var(--surface);
    border: 1px solid var(--hairline);
}

.gantt__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    min-width: 2px;
    background: var(--brand);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 4px;
    transition: width 0.1s linear;
}
.gantt__bar.is-running {
    opacity: 0.6;
}
.gantt__bar.is-cached {
    background: var(--success);
}
.gantt__bar.is-failed {
    background: var(--danger);
}

.gantt__label {
    font-size: 10px;
    color: var(--surface);
    mix-blend-mode: difference;
}

.gantt__state {
    flex: none;
    width: 74px;
    text-align: right;
    font-size: 11px;
    color: var(--text-tertiary);
}

.gantt__empty {
    padding: 4px 0;
}

.log-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 110px;
    max-height: 220px;
    overflow-y: auto;
    padding: 8px 10px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.log-line {
    font-size: 11px;
    color: var(--text-secondary);
    word-break: break-all;
}
.log-line.is-ok {
    color: var(--success);
}
.log-line.is-info {
    color: var(--text-tertiary);
}
.log-line.is-bad {
    color: var(--danger);
}
.log-line.is-warn {
    color: var(--warning);
}

.final-row {
    padding-top: 10px;
    border-top: 1px solid var(--hairline);
}
.final-row .res-k {
    width: 96px;
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
