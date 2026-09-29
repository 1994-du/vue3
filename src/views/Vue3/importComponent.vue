<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Async Component</span>
                    <h2 class="panel__title">用到的时候再去下载</h2>
                </div>
                <span class="panel__meta">把首屏用不到的代码切成独立 chunk</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    顶层 <code>import</code> 会被打包进主 chunk，无论用户有没有走到那个功能。
                    换成动态 <code>import()</code> 之后，构建工具会把它切成独立文件，
                    <em>只有真正渲染时浏览器才去发那个请求</em>。
                    Vue 提供了 <code>defineAsyncComponent</code> 把这件事包装成一个组件，
                    顺便把「加载中、加载失败、超时」这三个状态也管了。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">本质</span>
                        <span class="point__v">一个返回 Promise&lt;Component&gt; 的 loader 函数</span>
                    </div>
                    <div class="point">
                        <span class="point__k">典型收益</span>
                        <span class="point__v">首屏 JS 体积下降，图表/富文本这类重物挪出主包</span>
                    </div>
                    <div class="point">
                        <span class="point__k">路由懒加载</span>
                        <span class="point__v">同一个机制在路由表上的应用，按页面分包</span>
                    </div>
                    <div class="point">
                        <span class="point__k">代价</span>
                        <span class="point__v">首次点到那一刻会有等待，需要给好占位 UI</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：真实分包 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">点一下，看它真的去下载了</h2>
                </div>
                <span class="panel__meta">网络请求清单来自浏览器的 Performance API</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="loadedBox" @click="loadBox">
                            {{ loadedBox ? '已加载 MarkerCanvas' : '动态加载 MarkerCanvas' }}
                        </button>
                        <button type="button" class="w-btn" @click="scanRequests">扫描 JS 请求</button>
                    </div>
                    <span class="w-hint">
                        加载前后各点一次「扫描」，对比多出来的那个 chunk 文件
                    </span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">静态引入</h3>
                            <span class="card__tag is-bad">直接进主包</span>
                        </div>
                        <p class="card__desc">
                            <code>import Box from './Box.vue'</code> ——
                            打开首页就一起下载了，哪怕用户从没点到这块区域。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">时机</span>
                                <span class="kv__v">随主 bundle 一起到达</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">动态引入</h3>
                            <span class="card__tag is-good">按需拉取</span>
                        </div>
                        <p class="card__desc">
                            <code>() =&gt; import('./Box.vue')</code> ——
                            构建时会产出<strong>独立 chunk</strong>，只有那一刻才会出现在网络面板里。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">状态</span>
                                <span class="kv__v" :class="loadedBox ? 'is-ok' : 'is-warn'">
                                    {{ loadedBox ? '已到达并渲染' : '尚未请求' }}
                                </span></div>
                            <div class="kv"><span class="kv__k">耗时</span>
                                <span class="kv__v">{{ loadCost === null ? '—' : loadCost + ' ms' }}</span></div>
                        </div>
                    </article>
                </div>

                <div v-if="loadedBox" class="loaded-slot">
                    <Suspense>
                        <template #default>
                            <component :is="remoteBox" />
                        </template>
                        <template #fallback>
                            <span class="mono">Suspense 兜底中…</span>
                        </template>
                    </Suspense>
                </div>

                <div class="log-block">
                    <div class="code-block__label">扫描到的 JS 资源（最近 12 条）</div>
                    <div class="log-list">
                        <div v-for="(r, i) in requests" :key="i" class="log-item" :class="r.isNew ? 'is-ok' : ''">
                            <span class="log-item__idx">{{ (r.transferSize / 1024).toFixed(1) }}KB</span>
                            <span class="log-item__body">{{ r.name }}</span>
                            <span class="log-item__note">{{ r.isNew ? '新到达' : '早先' }}</span>
                        </div>
                        <div v-if="!requests.length" class="log-empty">// 点「扫描 JS 请求」读取浏览器记录</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：loading / error / timeout -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">加载中、超时、失败这三个状态</h2>
                </div>
                <span class="panel__meta">defineAsyncComponent 的高级配置</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="asyncState !== 'idle'" @click="startLoad('slow')">
                            慢加载（{{ slowDelay }}ms）
                        </button>
                        <button type="button" class="w-btn" :disabled="asyncState !== 'idle'" @click="startLoad('fail')">
                            必定失败
                        </button>
                        <button type="button" class="w-btn" :disabled="asyncState !== 'idle'" @click="startLoad('timeout')">
                            超时（> {{ timeoutMs }}ms）
                        </button>
                        <button type="button" class="w-btn" @click="resetAsync">重置</button>
                    </div>
                    <span class="w-hint">
                        加载前 {{ delayMs }}ms 内不显示占位——这个空白窗口就是 delay 参数的作用
                    </span>
                </div>

                <div class="stage">
                    <component :is="AsyncDemo" v-if="AsyncDemo" />
                    <span v-else class="stage__slot">点击上面的按钮开始加载</span>
                </div>

                <div class="kv-grid">
                    <div class="kv"><span class="kv__k">当前状态</span>
                        <span class="kv__v" :class="stateTone">{{ stateText }}</span></div>
                    <div class="kv"><span class="kv__k">loader 已调用</span>
                        <span class="kv__v">{{ loaderCalls }} 次</span></div>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实验里用到的写法</h2>
                </div>
                <span class="panel__meta">与页面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">基础 · 一行搞定</div>
                    <CodeEditor :code="basicCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">高级 · 三个状态都接管</div>
                    <CodeEditor :code="advancedCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">批量 · import.meta.glob 自动注册</div>
                    <CodeEditor :code="globCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, h, ref, shallowRef, type Component } from 'vue'

/* ── 实验一：真实动态 import ────────────────────────── */
// 这一行会让 Vite 把 theme-img.vue 切成一个独立 chunk
const remoteBox = shallowRef<Component | null>(null)
const loadedBox = ref(false)
const loadCost = ref<number | null>(null)

async function loadBox() {
    const t0 = performance.now()
    const mod = await import('@/views/Canvas/theme-img.vue')
    remoteBox.value = mod.default
    loadCost.value = Math.round(performance.now() - t0)
    loadedBox.value = true
}

type ReqRow = { name: string; transferSize: number; isNew: boolean }
const requests = ref<ReqRow[]>([])
const seen = new Set<string>()

function scanRequests() {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const js = entries
        .filter((e) => e.name.endsWith('.js'))
        .sort((a, b) => a.startTime - b.startTime)
        .slice(-12)
        .reverse()

    requests.value = js.map((e) => {
        const isNew = !seen.has(e.name)
        seen.add(e.name)
        const base = e.name.split('/').pop() ?? e.name
        return { name: base, transferSize: e.transferSize || e.encodedBodySize, isNew }
    })
}

/* ── 实验二：loading / error / timeout ──────────────── */
const slowDelay = 1200
const delayMs = 200
const timeoutMs = 3000

type Mode = 'slow' | 'fail' | 'timeout'
const asyncState = ref<'idle' | 'pending' | 'ok' | 'error'>('idle')
const loaderCalls = ref(0)
const asyncKey = ref(0)
let mode: Mode = 'slow'

// 占位组件
const LoadingBox = {
    name: 'LoadingBox',
    setup: () => () => h('div', { class: 'stage__slot is-loading' }, '加载中…'),
}

const ErrorBox = {
    name: 'ErrorBox',
    setup: () => () => h('div', { class: 'stage__slot is-error' }, '加载失败，点重置再来一次'),
}

const OkBox = {
    name: 'OkBox',
    setup: () => () => h('div', { class: 'stage__slot is-ok' }, '✅ 异步组件就位'),
}

const AsyncDemo = shallowRef<Component | null>(null)

function buildAsync() {
    return defineAsyncComponent({
        loader: () => {
            loaderCalls.value += 1
            asyncState.value = 'pending'

            if (mode === 'fail') {
                return new Promise<Component>((_r, reject) => {
                    setTimeout(() => {
                        asyncState.value = 'error'
                        reject(new Error('模拟请求失败'))
                    }, 500)
                })
            }

            if (mode === 'timeout') {
                return new Promise<Component>((resolve) => {
                    setTimeout(() => resolve(OkBox), timeoutMs + 800)
                })
            }

            return new Promise<Component>((resolve) => {
                setTimeout(() => {
                    asyncState.value = 'ok'
                    resolve(OkBox)
                }, slowDelay)
            })
        },
        loadingComponent: LoadingBox,
        errorComponent: ErrorBox,
        delay: delayMs,        // 200ms 内不用显示占位，避免闪一下
        timeout: timeoutMs,    // 超时就转交 errorComponent
    })
}

function startLoad(next: Mode) {
    mode = next
    asyncState.value = 'pending'
    AsyncDemo.value = buildAsync()
    asyncKey.value += 1
}

function resetAsync() {
    asyncState.value = 'idle'
    loaderCalls.value = 0
    AsyncDemo.value = null
    asyncKey.value = 0
}

const stateText = computed(() => {
    const map = { idle: '未开始', pending: '正在加载', ok: '加载成功', error: '已失败' }
    return map[asyncState.value]
})

const stateTone = computed(() => {
    if (asyncState.value === 'ok') return 'is-ok'
    if (asyncState.value === 'error') return 'is-bad'
    if (asyncState.value === 'pending') return 'is-warn'
    return ''
})

/* ── 展示用源码 ─────────────────────────────────────── */
const basicCode = `import { defineAsyncComponent } from 'vue'

// 最短写法：给一个返回 Promise 的 loader
const Markdown = defineAsyncComponent(() => import('./Markdown.vue'))

// 在模板里当普通组件用，渲染到它的时候才开始下载
<Markdown v-if="showEditor" :source="text" />

// 路由懒加载是同一套机制写在路由表里
const routes = [
  { path: '/report', component: () => import('@/views/Echarts/line.vue') },
]`

const advancedCode = `const Chart = defineAsyncComponent({
  // loader 里可以随便包：请求重试、权限判断、预都行
  loader: () => import('./HeavyChart.vue'),

  loadingComponent: ChartSkeleton,  // 加载中显示的占位
  errorComponent: ChartError,       // 失败时显示，可以放个重试按钮
  delay: 200,                       // 200ms 内先不显示占位，免得闪一下再消失
  timeout: 5000,                    // 超过 5 秒直接转交 errorComponent
})

// ⚠️ loadingComponent 的 delay 很关键：
//    设成 0 的话，本地秒开时占位会闪一下，反而更难受`

const globCode = `// 一次性把某个目录下的模块都登记为懒加载
// eager: false（默认）表示「不打包进主 bundle」
const widgets = import.meta.glob('@/views/Canvas/*.vue')

// 得到的 key → () => import(...)，可以直接喂给路由或组件映射
const asyncRoutes = Object.entries(widgets).map(([path, loader]) => ({
  path: path.replace(/^.*\\//, '').replace('.vue', ''),
  component: defineAsyncComponent(loader as any),
}))

// 反过来，想要「全部静态打进来」就加 eager
const allModules = import.meta.glob('@/views/Canvas/*.vue', { eager: true })`
</script>

<style scoped>
.stage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90px;
    margin-bottom: 14px;
    border: 1px dashed var(--hairline);
    background: var(--surface-subtle);
}

.stage__slot {
    padding: 12px 20px;
    border: 1px solid var(--hairline);
    background: var(--surface);
    font-family: var(--font-mono);
    font-size: 12px;
}

.stage__slot.is-loading {
    color: var(--warning);
    border-color: var(--warning);
}

.stage__slot.is-error {
    color: var(--danger);
    border-color: var(--danger);
}

.stage__slot.is-ok {
    color: var(--success);
    border-color: var(--success);
}

.loaded-slot {
    margin-top: 14px;
    padding: 12px;
    border: 1px solid var(--brand);
    background: var(--brand-soft);
}

.log-block {
    margin-top: 14px;
}
</style>
