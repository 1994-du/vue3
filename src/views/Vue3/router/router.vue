<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">vue-router</span>
                    <h2 class="panel__title">路由对象手里都有什么</h2>
                </div>
                <span class="panel__meta">本项目由后端菜单动态生成路由</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    两个 hook 的职责完全不同：<code>useRouter()</code> 拿到的是<em>路由实例</em>，
                    用来 push / replace / go；<code>useRoute()</code> 拿到的是<em>当前这一条路由</em>的
                    <strong>响应式快照</strong>，路径一变它自动更新。
                    本项目比较特殊：<strong>路由表由后端返回的菜单动态拼出来</strong>
                    （<code>generateRoutes.ts</code> + <code>import.meta.glob</code>），
                    所以下面的列表就是你此刻在侧边栏看到的那些页面。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">router</span>
                        <span class="point__v">全局实例，负责跳转与守卫，一个应用只有一个</span>
                    </div>
                    <div class="point">
                        <span class="point__k">route</span>
                        <span class="point__v">当前路由信息，响应式，直接用解构会丢响应式</span>
                    </div>
                    <div class="point">
                        <span class="point__k">命名路由</span>
                        <span class="point__v">用 name 跳转比写死路径更能扛住重构</span>
                    </div>
                    <div class="point">
                        <span class="point__k">$router vs $route</span>
                        <span class="point__v">模板里可以直接用，组合式 API 里推荐 use 版本</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：当前路由解剖 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">改 query，看它跟着变</h2>
                </div>
                <span class="panel__meta">route 是响应式的，不用 watch 就能刷新</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="setParam('demo', String(counter + 1))">
                            add query.demo
                        </button>
                        <button type="button" class="w-btn" @click="setParam('tab', tabs[(tabIdx + 1) % tabs.length])">
                            switch query.tab
                        </button>
                        <button type="button" class="w-btn" @click="router.replace({ query: {} })">
                            clear query
                        </button>
                    </div>
                    <span class="w-hint">地址栏会跟着变，下面的字段同步更新——这就是响应式</span>
                </div>

                <div class="kv-grid">
                    <div class="kv"><span class="kv__k">fullPath</span>
                        <span class="kv__v">{{ route.fullPath }}</span></div>
                    <div class="kv"><span class="kv__k">path</span>
                        <span class="kv__v">{{ route.path }}</span></div>
                    <div class="kv"><span class="kv__k">name</span>
                        <span class="kv__v">{{ String(route.name ?? '—') }}</span></div>
                    <div class="kv"><span class="kv__k">params</span>
                        <span class="kv__v">{{ JSON.stringify(route.params) }}</span></div>
                    <div class="kv"><span class="kv__k">query.demo</span>
                        <span class="kv__v is-ok">{{ String(route.query.demo ?? '—') }}</span></div>
                    <div class="kv"><span class="kv__k">query.tab</span>
                        <span class="kv__v is-ok">{{ String(route.query.tab ?? '—') }}</span></div>
                    <div class="kv"><span class="kv__k">hash</span>
                        <span class="kv__v">{{ route.hash || '—' }}</span></div>
                    <div class="kv"><span class="kv__k">matched 层数</span>
                        <span class="kv__v">{{ route.matched.length }}</span></div>
                    <div class="kv"><span class="kv__k">meta</span>
                        <span class="kv__v">{{ JSON.stringify(route.meta) }}</span></div>
                </div>

                <p class="route-note">
                    注意 <code>params</code> 一直是空的：只有路径里声明了动态段
                    （如 <code>/user/:id</code>）才会有值，query 走的是另一条字段。
                    另外 <strong>直接解构 route 会丢响应式</strong>——要取值请用 <code>toRefs(route)</code>
                    或 <code>computed(() =&gt; route.query.xxx)</code>。
                </p>
            </div>
        </section>

        <!-- ③ 实验二：真实路由表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">当前应用里所有已注册的路由</h2>
                </div>
                <span class="panel__meta">共 {{ filtered.length }} 条（总 {{ allRoutes.length }} 条）</span>
            </div>
            <div class="panel__body">
                <div class="input-row">
                    <label class="input-row__label" for="rt-search">过滤</label>
                    <input id="rt-search" v-model="keyword" class="text-input mono" type="text"
                        placeholder="按路径或名字过滤…" autocomplete="off" />
                    <span class="input-row__meta mono">命中 {{ filtered.length }}</span>
                </div>

                <div class="rt">
                    <div class="rt__head">
                        <span class="rt__c rt__c--path">path</span>
                        <span class="rt__c rt__c--name">name</span>
                        <span class="rt__c">是否当前</span>
                    </div>
                    <div v-for="r in filtered" :key="r.path" class="rt__row"
                        :class="{ 'is-current': r.path === route.path }">
                        <span class="rt__c rt__c--path mono">{{ r.path }}</span>
                        <span class="rt__c rt__c--name mono">{{ r.name || '—' }}</span>
                        <span class="rt__c rt__c--flag">
                            <span v-if="r.path === route.path" class="rt__flag is-now">当前</span>
                            <span v-else class="rt__flag" @click="jump(r.path)">跳转</span>
                        </span>
                    </div>
                    <div v-if="!filtered.length" class="rt__empty mono">// 没有匹配的路由</div>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">常用 API 汇总</h2>
                </div>
                <span class="panel__meta">与页面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">跳转与参数</div>
                    <CodeEditor :code="apiCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">本项目：路由由后端菜单生成</div>
                    <CodeEditor :code="genCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/* ── 实验一 ─────────────────────────────────────────── */
const tabs = ['overview', 'detail', 'settings'] as const
const tabIdx = computed(() => tabs.indexOf((route.query.tab as (typeof tabs)[number]) ?? 'overview'))
const counter = computed(() => Number(route.query.demo ?? 0))

// replace 不会在历史里留痕，适合「筛选条件」这种变化
function setParam(key: string, value: string) {
    router.replace({ query: { ...route.query, [key]: value } })
}

/* ── 实验二：真实路由表 ─────────────────────────────── */
const allRoutes = router.getRoutes().filter((r) => !r.path.includes(':'))
const keyword = ref('')

const filtered = computed(() => {
    const k = keyword.value.trim().toLowerCase()
    if (!k) return allRoutes.slice(0, 60)
    return allRoutes
        .filter((r) => r.path.toLowerCase().includes(k) || String(r.name ?? '').toLowerCase().includes(k))
        .slice(0, 60)
})

function jump(path: string) {
    router.push(path)
}

/* ── 展示用源码 ─────────────────────────────────────── */
const apiCode = `import { useRoute, useRouter } from 'vue-router'

const router = useRouter()   // 实例：负责「去哪儿」
const route = useRoute()     // 当前路由：负责「现在在哪」

// ── 跳转 ────────────────────────────────────────────
router.push('/user/1')
router.push({ name: 'user', params: { id: 1 } })      // 推荐：用 name
router.push({ path: '/list', query: { page: 2 } })    // query 只能配 path
router.replace({ query: { tab: 'detail' } })          // 不留历史
router.back()
router.go(-2)

// ── 读参 ────────────────────────────────────────────
route.params.id        // /user/:id 的动态段
route.query.page       // ?page=2
route.fullPath         // 含 query 和 hash 的完整串
route.meta             // 路由元信息，常用来放权限标记
route.matched          // 匹配到的嵌套路由链

// ── 响应式 ──────────────────────────────────────────
// ❌ 解构会拿到快照，URL 变了它不动
const { query } = route

// ✅ 这两种才是对的
const page = computed(() => route.query.page)
watch(() => route.fullPath, (p) => { /* 统一在这里响应 */ })`

const genCode = `// src/router/generateRoutes.ts —— 项目真实采用的方案：
// 菜单由后端返回，前端把 component 字符串映射成真实组件
const modules = import.meta.glob('@/views/**/*.vue')

function toComponent(path: string) {
  // 'Js/eventLoop' → () => import('@/views/Js/eventLoop.vue')
  const loader = modules[\`/src/views/\${path}.vue\`]
  return loader ? defineAsyncComponent(loader as any) : undefined
}

// 后端给的 children 里带 component 字段，递归成嵌套路由
export function build(menus: Menu[]) {
  return menus.map((m) => ({
    path: m.path,
    name: m.name,
    component: toComponent(m.component),   // 顺带就实现了路由懒加载
    children: build(m.children ?? []),
  }))
}

// ⚠️ 所以在这个项目里，路由表是运行态才拼出来的：
//    router.getRoutes() 的结果取决于后端菜单，
//    新增页面后要在「菜单管理」里加一条，侧边栏才会出现`
</script>

<style scoped>
.input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
}

.input-row__label {
    flex: none;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
}

.text-input {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--surface-subtle);
    border: 1px solid var(--hairline);
    outline: none;
}

.text-input:focus {
    border-color: var(--brand);
}

.input-row__meta {
    flex: none;
    font-size: 11px;
    color: var(--text-tertiary);
}

.rt {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
    max-height: 320px;
    overflow-y: auto;
}

.rt__head,
.rt__row {
    display: grid;
    grid-template-columns: 1.6fr 1fr 90px;
    gap: 1px;
    background: var(--hairline);
}

.rt__head {
    padding: 1px;
    position: sticky;
    top: 0;
    z-index: 1;
}

.rt__c {
    padding: 7px 10px;
    background: var(--surface-subtle);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
}

.rt__row {
    padding: 1px;
    border-top: 1px solid var(--hairline);
}

.rt__row .rt__c {
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 12px;
}

.rt__row.is-current .rt__c {
    background: var(--brand-soft);
    color: var(--brand);
}

.rt__c--path {
    word-break: break-all;
}

.rt__c--flag {
    text-align: center;
}

.rt__flag {
    display: inline-block;
    padding: 1px 7px;
    font-size: 10px;
    border: 1px solid var(--hairline);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
}

.rt__flag:hover:not(.is-now) {
    color: var(--brand);
    border-color: var(--brand);
}

.rt__flag.is-now {
    color: var(--brand);
    border-color: var(--brand);
    cursor: default;
}

.rt__empty {
    padding: 14px 10px;
    font-size: 11px;
    color: var(--text-tertiary);
    background: var(--surface);
}

.route-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.route-note code {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
}

.route-note strong {
    color: var(--text-primary);
}
</style>
