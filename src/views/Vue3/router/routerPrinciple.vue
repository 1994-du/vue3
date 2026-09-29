<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">vue-router</span>
                    <h2 class="panel__title">两种模式，都是在骗浏览器</h2>
                </div>
                <span class="panel__meta">本质：改 URL 但不真的发请求</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    SPA 的全部魔法就在于<em>「地址栏变了，页面却没刷新」</em>。
                    <strong>hash 模式</strong>借的是 <code>#</code> 后面那段天生不会发给服务器的特性，
                    监听 <code>hashchange</code>；
                    <strong>history 模式</strong>用 HTML5 的 <code>pushState</code> 改写地址，
                    监听 <code>popstate</code>。
                    两者差别在 URL 长相、服务端配合、以及兼容范围。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">hash</span>
                        <span class="point__v">带 #，不会发给服务端，部署零配置，但看着别扭</span>
                    </div>
                    <div class="point">
                        <span class="point__k">history</span>
                        <span class="point__v">干净的正常 URL，刷新时需要服务端把所有路径回落到 index.html</span>
                    </div>
                    <div class="point">
                        <span class="point__k">共同点</span>
                        <span class="point__v">pushState / 改 hash 都不会触发任何网络请求</span>
                    </div>
                    <div class="point">
                        <span class="point__k">注意</span>
                        <span class="point__v">popstate 只响应前进/后退，主动 pushState 不会触发它</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：真实操作地址栏 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">亲自按一遍这些 API</h2>
                </div>
                <span class="panel__meta">地址栏会真的变，页面绝对不刷新</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="doPush">pushState(+1 条历史)</button>
                        <button type="button" class="w-btn" @click="doReplace">replaceState(不增历史)</button>
                        <button type="button" class="w-btn" @click="doHash">改 location.hash</button>
                        <button type="button" class="w-btn" @click="doBack">history.back()</button>
                        <button type="button" class="w-btn" @click="doForward">history.forward()</button>
                    </div>
                    <span class="w-hint">注意右上的历史记录计数变化</span>
                </div>

                <div class="url-bar">
                    <span class="url-bar__k">location.href</span>
                    <span class="url-bar__v mono">{{ href }}</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">hash 模式关心的</h3>
                            <span class="card__tag">hashchange</span>
                        </div>
                        <p class="card__desc">
                            只有 <code>#</code> 后面变了才会触发。
                            你 <code>pushState</code> 改 pathname 时，这个事件<strong>完全不会有反应</strong>。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前 hash</span>
                                <span class="kv__v">{{ hash || '(空)' }}</span></div>
                            <div class="kv"><span class="kv__k">触发次数</span>
                                <span class="kv__v" :class="hashHits ? 'is-ok' : ''">{{ hashHits }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">history 模式关心的</h3>
                            <span class="card__tag">popstate</span>
                        </div>
                        <p class="card__desc">
                            只在<strong>前进/后退</strong>时触发。这也是为什么 vue-router
                            不能只靠 popstate——它还得自己拦截 push/replace 手动更新。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">pathname</span>
                                <span class="kv__v">{{ pathname }}</span></div>
                            <div class="kv"><span class="kv__k">触发次数</span>
                                <span class="kv__v" :class="popHits ? 'is-ok' : ''">{{ popHits }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">历史堆栈</h3>
                            <span class="card__tag">length 近似值</span>
                        </div>
                        <p class="card__desc">
                            <code>history.length</code> 浏览器不给精确值（上限 50），
                            但能看出 push 让它变多、replace 不变。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">length</span>
                                <span class="kv__v is-warn">{{ histLen }}</span></div>
                            <div class="kv"><span class="kv__k">state 里的计数</span>
                            <span class="kv__v">{{ stateCounter }}</span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">真实事件日志</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 点上面的按钮，事件会被真实监听记录下来</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：差异对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Comparison</span>
                    <h2 class="panel__title">到底该选哪个</h2>
                </div>
                <span class="panel__meta">多数情况选 history</span>
            </div>
            <div class="panel__body">
                <div class="matrix">
                    <div class="matrix__head">
                        <span class="matrix__corner">对比项</span>
                        <span class="matrix__col">hash 模式</span>
                        <span class="matrix__col">history 模式</span>
                    </div>
                    <div v-for="row in compare" :key="row.k" class="matrix__row">
                        <span class="matrix__name">{{ row.k }}</span>
                        <span class="matrix__cell note-cell">{{ row.hash }}</span>
                        <span class="matrix__cell note-cell">{{ row.history }}</span>
                    </div>
                </div>

                <p class="probe-note">
                    history 模式<strong>必须</strong>在服务端做 fallback：任意路径都返回 index.html，
                    否则用户刷新 <code>/user/1</code> 会直接 404。
                    这是它唯一的部署成本，换来的是干净的 URL 和更好的 SEO。
                </p>
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
                    <div class="code-block__label">历史堆栈操作</div>
                    <CodeEditor :code="historyCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">nginx / vite 的 fallback 配置</div>
                    <CodeEditor :code="serverCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/* ── 真实监听 ───────────────────────────────────────── */
type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 40)
}

const hashHits = ref(0)
const popHits = ref(0)
const tick = ref(0)

function onHashChange() {
    hashHits.value += 1
    tick.value += 1
    push(`hash 变成了 ${location.hash || '(空)'}`, 'hashchange', 'is-warn')
}

function onPopState(e: PopStateEvent) {
    popHits.value += 1
    tick.value += 1
    push(`前进/后退触发，state = ${JSON.stringify(e.state)}`, 'popstate', 'is-ok')
}

window.addEventListener('hashchange', onHashChange)
window.addEventListener('popstate', onPopState)
onBeforeUnmount(() => {
    window.removeEventListener('hashchange', onHashChange)
    window.removeEventListener('popstate', onPopState)
})

/* ── 当前 URL 快照 ──────────────────────────────────── */
const href = computed(() => {
    void tick.value
    return location.href
})
const hash = computed(() => {
    void tick.value
    return location.hash
})
const pathname = computed(() => {
    void tick.value
    return location.pathname
})
const histLen = computed(() => {
    void tick.value
    return history.length
})
const stateCounter = computed(() => {
    void tick.value
    return String((history.state?.demoStep as number | undefined) ?? 0)
})

/* ── 操作 ───────────────────────────────────────────── */
const base = computed(() => `${route.path}`)
let step = 0

function doPush() {
    step += 1
    tick.value += 1
    history.pushState({ ...(history.state ?? {}), demoStep: step }, '', `${base.value}?demo=${step}`)
    push(`pushState → ${base.value}?demo=${step}（不会产生 popstate）`, 'pushState')
}

function doReplace() {
    step += 1
    tick.value += 1
    history.replaceState({ ...(history.state ?? {}), demoStep: step }, '', `${base.value}?demo=${step}`)
    push(`replaceState → ${base.value}?demo=${step}（历史条数不变）`, 'replaceState', 'is-warn')
}

function doHash() {
    step += 1
    tick.value += 1
    location.hash = `demo-hash-${step}`
    push(`改 location.hash → #demo-hash-${step}`, 'hash')
}

function doBack() {
    push('调用 history.back()', 'back')
    history.back()
}

function doForward() {
    push('调用 history.forward()', 'forward')
    history.forward()
}

/* ── 对照表 ─────────────────────────────────────────── */
const compare = [
    { k: 'URL 长相', hash: '/app/#/user/1', history: '/app/user/1' },
    { k: '服务端配合', hash: '不需要，# 后不会发给服务器', history: '需要全部路径回落到 index.html' },
    { k: '刷新行为', hash: '一定回到根页面逻辑，安全', history: '直接 404，除非配了 fallback' },
    { k: 'SEO', hash: '搜索引擎基本不认 # 后的路径', history: '和普通页面一致，SSR 友好' },
    { k: '监听事件', hash: 'hashchange', history: 'popstate' },
    { k: '同源限制', hash: '只能在当前文档改 hash', history: 'pushState 的 URL 必须同源' },
    { k: '适用场景', hash: '静态托管、Electron、不想配服务器', history: '正式站点，服务端可控' },
]

/* ── 展示用源码 ─────────────────────────────────────── */
const historyCode = `// ── 写 ────────────────────────────────────────────
// 压一条新历史（地址变了，但不发请求、不触发 popstate）
history.pushState({ step: 1 }, '', '/list?page=2')

// 改写当前这条（历史堆栈长度不变）
history.replaceState({ step: 2 }, '', '/list?page=3')

// hash 模式的「跳转」就是改这个
location.hash = '/user/1'          // 会触发 hashchange

// ── 读 ────────────────────────────────────────────
history.length        // 历史条数（浏览器会封顶到 50）
history.state         // 上次 push/replace 存进去的对象

// ── 走 ────────────────────────────────────────────
history.back()
history.forward()
history.go(-2)        // 负数后退，正数前进

// ── 听 ────────────────────────────────────────────
// ⚠️ 只有用户点前进/后退（或调 back/forward/go）才会触发，
//    pushState / replaceState 自己是不会触发 popstate 的
window.addEventListener('popstate', (e) => {
  console.log('位置变了', location.pathname, e.state)
})

// vue-router 的做法：既监听 popstate 兜底用户的前进后退，
// 又在自己的 push/replace 里手动更新响应式路由对象
const route = useRoute()
watch(() => route.fullPath, (p) => { /* 统一在这里响应变化 */ })`

const serverCode = `# nginx：所有找不到的路径都回落到 index.html
location / {
  try_files $uri $uri/ /index.html;
}

# Vue CLI / Vite dev server 默认已经开了 historyApiFallback，
# 所以本地开发从来不会遇到刷新 404，容易忘了部署时要配

# Vite 生产预览
// vite.config.ts
export default defineConfig({
  // 部署到子路径时还要同步改 base
  base: '/',
})

// 路由实例要保持一致的 base
createWebHistory(import.meta.env.BASE_URL)`
</script>

<style scoped>
.url-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.url-bar__k {
    flex: none;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
}

.url-bar__v {
    font-size: 12px;
    color: var(--brand);
    word-break: break-all;
}

.matrix {
    border: 1px solid var(--hairline);
    background: var(--surface-raised);
}

.matrix__head,
.matrix__row {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1.4fr;
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
    font-size: 12px;
    color: var(--brand);
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

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 880px;
}

.probe-note strong {
    color: var(--text-primary);
}

.probe-note code {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
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
