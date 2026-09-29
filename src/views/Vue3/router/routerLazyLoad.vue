<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Lazy Load</span>
                    <h2 class="panel__title">按路由切一刀</h2>
                </div>
                <span class="panel__meta">用户没点到的页面，就别让他下载</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    路由懒加载没有新东西——它就是<em>异步组件那套机制挂在路由表上</em>。
                    把 <code>component</code> 从一个组件对象换成一个返回 Promise 的函数，
                    构建工具就会把这个页面单独打包。
                    收益很直接：<strong>首屏只下载看得见的那几页</strong>，
                    剩下的等用户真的点进去再说。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">粒度</span>
                        <span class="point__v">默认按「每个被 import 的文件」一个 chunk</span>
                    </div>
                    <div class="point">
                        <span class="point__k">平衡点</span>
                        <span class="point__v">切太碎请求数暴涨，切太粗等于没切，按页面级最划算</span>
                    </div>
                    <div class="point">
                        <span class="point__k">预取</span>
                        <span class="point__v">可以在空闲时提前拉下一屏，用户点上去就没等待了</span>
                    </div>
                    <div class="point">
                        <span class="point__k">本项目</span>
                        <span class="point__v">import.meta.glob 天然生成懒加载函数，无需手写</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：四种写法 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">component 那里到底填什么</h2>
                </div>
                <span class="panel__meta">只有两种是对的</span>
            </div>
            <div class="panel__body">
                <div class="matrix">
                    <div class="matrix__head">
                        <span class="matrix__corner">写法</span>
                        <span class="matrix__col">是否分包</span>
                        <span class="matrix__col">结论</span>
                    </div>
                    <div v-for="row in forms" :key="row.code" class="matrix__row">
                        <span class="matrix__name mono is-code">{{ row.code }}</span>
                        <span class="matrix__cell note-cell" :class="row.split ? 'is-yes' : 'is-no'">
                            {{ row.split ? '✅ 独立 chunk' : '❌ 打进主包' }}
                        </span>
                        <span class="matrix__cell note-cell">{{ row.note }}</span>
                    </div>
                </div>

                <p class="probe-note">
                    第 1 条 <code>require</code> 是 webpack 时代的老写法，Vite 里直接不认；
                    第 4 条最容易搞混——<code>const Index = () =&gt; import(...)</code> 和
                    直接的顶层 import 长得太像，<strong>关键区别在于有没有被立即调用</strong>。
                </p>
            </div>
        </section>

        <!-- ③ 实验二：真实观察产物 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">看新 chunk 真的被下载下来</h2>
                </div>
                <span class="panel__meta">数据来自浏览器的 Performance API</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="loaded" @click="loadPage">
                            {{ loaded ? 'Echarts/echart-line 已就位' : '动态加载 Echarts/echart-line 页面' }}
                        </button>
                        <button type="button" class="w-btn" @click="scan">扫描 JS 资源</button>
                    </div>
                    <span class="w-hint">先扫一次做基线，加载后再扫，多出来的就是新 chunk</span>
                </div>

                <div class="stat-grid">
                    <div class="stat">
                        <span class="stat__label">JS 资源数</span>
                        <span class="stat__value mono">{{ resources.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">页面级 chunk（排除 vendor / index）</span>
                        <span class="stat__value mono">{{ chunkLike }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">主入口体积</span>
                        <span class="stat__value mono">{{ entrySize }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">本次新到达</span>
                        <span class="stat__value mono">{{ fresh.length }}</span>
                    </div>
                </div>

                <div v-if="loaded" class="loaded-slot">
                    <span class="mono">// Echarts/echart-line.vue 已通过动态 import 取到组件</span>
                </div>

                <div class="log-block">
                    <div class="code-block__label">JS 资源清单（新到达的会被点亮）</div>
                    <div class="log-list">
                        <div v-for="r in resources" :key="r.name" class="log-item" :class="r.fresh ? 'is-ok' : ''">
                            <span class="log-item__idx">{{ r.size }}</span>
                            <span class="log-item__body">{{ r.name }}</span>
                            <span class="log-item__note">{{ r.fresh ? 'NEW' : '' }}</span>
                        </div>
                        <div v-if="!resources.length" class="log-empty">// 点「扫描 JS 资源」读取当前已加载的文件</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">推荐写法与分包控制</h2>
                </div>
                <span class="panel__meta">可直接抄进路由表</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">路由表标准写法</div>
                    <CodeEditor :code="routeCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">Vite 里手动控制产物</div>
                    <CodeEditor :code="buildCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, type Component } from 'vue'

/* ── 四种写法对照 ───────────────────────────────────── */
const forms = [
    {
        code: "resolve => require(['@/views/A.vue'], resolve)",
        split: true,
        note: 'webpack 老写法，Vite 不支持，新项目不要抄',
    },
    {
        code: "() => import('@/views/A.vue')",
        split: true,
        note: '最推荐的写法，一行搞定，Vite / webpack 都认',
    },
    {
        code: "import('@/views/A.vue')",
        split: false,
        note: '错：这是立即调用，返回值是 Promise 不是组件',
    },
    {
        code: "import A from '@/views/A.vue'; component: A",
        split: false,
        note: '静态引入，整个页面被打进主 bundle',
    },
]

/* ── 真实动态加载一个页面 ───────────────────────────── */
const loadedEchart = shallowRef<Component | null>(null)
const loaded = computed(() => loadedEchart.value !== null)

async function loadPage() {
    const mod = await import('@/views/Echarts/echart-line.vue')
    loadedEchart.value = mod.default as Component
    scan()
}

/* ── 扫描已加载的 JS 资源 ───────────────────────────── */
type Row = { name: string; size: string; fresh: boolean }
const resources = ref<Row[]>([])
const seen = new Set<string>()
const baseline = new Set<string>()

function kb(n: number): string {
    return n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`
}

function scan() {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const js = entries
        .filter((e) => e.name.endsWith('.js'))
        .sort((a, b) => a.startTime - b.startTime)

    resources.value = js.map((e) => {
        const name = e.name.split('/').pop() ?? e.name
        return {
            name,
            size: kb(e.transferSize || e.encodedBodySize),
            fresh: seen.has(name) && !baseline.has(name),
        }
    })

    js.forEach((e) => {
        const name = e.name.split('/').pop() ?? e.name
        seen.add(name)
    })
}

const fresh = computed(() => resources.value.filter((r) => r.fresh))

const chunkLike = computed(
    () => resources.value.filter((r) => !/^(index|vendor|vue|pinia|echarts)/i.test(r.name)).length,
)

const entrySize = computed(() => {
    const hit = resources.value.find((r) => /^index[-.]?/.test(r.name))
    return hit ? hit.size : '—'
})

// 第一次扫描作为基线，之后扫出来的新文件才算「新到达」
scan()
resources.value.forEach((r) => baseline.add(r.name))
resources.value = resources.value.map((r) => ({ ...r, fresh: false }))

/* ── 展示用源码 ─────────────────────────────────────── */
const routeCode = `// router/routes.ts
const routes = [
  // ✅ 页面级懒加载：每个本文件都会变成独立 chunk
  { path: '/report', name: 'report', component: () => import('@/views/Echarts/echart-line.vue') },

  // ✅ 需要 loading / error 状态时套一层 defineAsyncComponent
  {
    path: '/heavy',
    component: defineAsyncComponent({
      loader: () => import('@/views/WebGL/Cube3x3.vue'),
      loadingComponent: PageSkeleton,
      delay: 200,
      timeout: 8000,
    }),
  },

  // ❌ 静态引入 = 全部塞进主包
  import Home from '@/views/HomePage.vue'
  { path: '/', component: Home },
]

// 本项目由后端菜单生成，import.meta.glob 天然产出懒加载函数
const modules = import.meta.glob('@/views/**/*.vue')
const component = modules[\`/src/views/\${menu.component}.vue\`]   // 它本身就是 () => import(...)`

const buildCode = `// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 把这三个大库拆出去，避免主 chunk 过肥
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
          three: ['three'],
        },
      },
    },
    // chunk 超过这个值会报警，可以据此决定要不要再切
    chunkSizeWarningLimit: 800,
  },
})

// ── 预取：让可能在下一次点击的页面提前到 ──────────────
// Vite 会自动给动态 import 生成 modulepreload，一般不用手动管；
// 想自己控制时机可以在空闲时手动触发：
requestIdleCallback(() => {
  import('@/views/Echarts/line.vue')   // 提前拉下来，真点进去就是秒开
})`
</script>

<style scoped>
.matrix {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
}

.matrix__head,
.matrix__row {
    display: grid;
    grid-template-columns: 1.6fr 0.8fr 1.6fr;
    align-items: stretch;
    gap: 1px;
    background: var(--hairline);
}

.matrix__head {
    padding: 1px;
}

.matrix__corner,
.matrix__col {
    padding: 7px 10px;
    background: var(--surface-subtle);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
}

.matrix__row {
    padding: 1px;
    border-top: 1px solid var(--hairline);
}

.matrix__name {
    padding: 9px 10px;
    background: var(--surface);
    font-size: 11px;
    color: var(--text-primary);
    word-break: break-all;
}

.matrix__cell {
    padding: 9px 10px;
    background: var(--surface);
    font-size: 12px;
    color: var(--text-primary);
}

.note-cell {
    font-family: var(--font-sans);
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-secondary);
}

.note-cell.is-yes {
    color: var(--success);
}

.note-cell.is-no {
    color: var(--danger);
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.probe-note code {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
}

.loaded-slot {
    margin-top: 14px;
    padding: 10px 12px;
    border: 1px solid var(--success);
    background: var(--surface-subtle);
    font-size: 12px;
    color: var(--success);
}

.log-block {
    margin-top: 14px;
}

@media (max-width: 760px) {
    .matrix__head {
        display: none;
    }

    .matrix__row {
        grid-template-columns: 1fr;
    }
}
</style>
