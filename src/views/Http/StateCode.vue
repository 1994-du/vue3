<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Status Code</span>
                    <h2 class="panel__title">三位数里，第一位就把话说完了</h2>
                </div>
                <span class="panel__meta">2xx 成了、3xx 去别处、4xx 你的错、5xx 我的错</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    状态码是服务器给请求的一个结论。真正需要记的是<strong>第一位</strong>：
                    <code>1xx</code> 继续、<code>2xx</code> 成功、<code>3xx</code> 重定向、
                    <code>4xx</code> 客户端的问题、<code>5xx</code> 服务器的问题。
                    业务系统常见的一个坑是：<em>HTTP 200 里包着业务错误码</em>——
                    HTTP 状态码说的是「这次通信成没成」，业务结果该由响应体里的 code 表达。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">1xx</span>
                        <span class="point__v">信息性，协议握手的中间态（101 切换协议给 WebSocket 用）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">2xx</span>
                        <span class="point__v">成功，但 200/201/204 的语义各不相同</span>
                    </div>
                    <div class="point">
                        <span class="point__k">3xx</span>
                        <span class="point__v">重定向，301/302/307/308 决定了下一次请求用什么方法和 URL</span>
                    </div>
                    <div class="point">
                        <span class="point__k">4xx / 5xx</span>
                        <span class="point__v">责任归属：前者是你请求错了，后者是服务端没扛住</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 真机探测 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">真发出去的请求，状态码是多少</h2>
                </div>
                <span class="panel__meta">下面每一个数字都是当前浏览器刚刚真实拿到的</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    这里不发假数据，全部是 <code>fetch()</code> 打出去的真实请求。
                    点任意一个，看看服务器到底回了什么 —— 包括那几个通常只在课本里出现的 404、304、
                    以及被人忽略的「0 文件就被消掉了 body」的 204。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="p in presets" :key="p.key" type="button" class="w-btn"
                            :disabled="busyKey === p.key" @click="probe(p)">
                            {{ busyKey === p.key ? '请求中…' : p.label }}
                        </button>
                    </div>
                    <span class="w-hint">也可以自己填一个路径 ↓</span>
                </div>

                <div class="cfg">
                    <div class="cfg__row">
                        <span class="cfg__k">自定义路径</span>
                        <input v-model="customUrl" class="cfg__input mono" placeholder="/Vue3/index.html"
                            @keyup.enter="probeCustom">
                        <div class="w-btns">
                            <button type="button" class="w-btn" :disabled="busy" @click="probeCustom">发送</button>
                        </div>
                    </div>
                </div>

                <div v-if="results.length" class="probe-list">
                    <article v-for="r in results" :key="r.id" class="probe" :class="'is-' + r.kind">
                        <div class="probe__head">
                            <span class="probe__code mono">{{ r.status || 'ERR' }} {{ r.statusText }}</span>
                            <span class="probe__tag">{{ r.tag }}</span>
                            <span class="probe__time mono">{{ fmtMs(r.ms) }}</span>
                        </div>
                        <div class="probe__url mono">{{ r.method }} {{ r.url }}</div>
                        <p v-if="r.note" class="probe__note">{{ r.note }}</p>
                        <details v-if="r.headers.length" class="probe__hd">
                            <summary>响应头（{{ r.headers.length }} 条）</summary>
                            <pre class="mono">{{ r.headers.join('\n') }}</pre>
                        </details>
                    </article>
                </div>
                <div v-else class="log-empty">还没有探测记录，点上面的按钮试试</div>

                <!-- Timing 分解 -->
                <div v-if="timings.length" class="timing">
                    <span class="kicker">最后这次请求的耗时分解（Performance API 真实数据）</span>
                    <div v-for="t in timings" :key="t.k" class="timing__row">
                        <span class="timing__k">{{ t.k }}</span>
                        <div class="timing__bar">
                            <i :style="{ width: t.pct + '%', background: t.color }"></i>
                        </div>
                        <span class="timing__v mono">{{ t.v.toFixed(1) }} ms</span>
                    </div>
                    <p class="probe-note">
                        注：同一浏览器对同一域名会<strong>复用 TCP 连接</strong>，
                        所以第二次及以后的请求 DNS / TCP 通常直接是 0ms —— 这正是 HTTP/1.1 keep-alive
                        和连接复用存在的意义。
                    </p>
                </div>
            </div>
        </section>

        <!-- ③ 易混对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">四组最容易搞混的</h2>
                </div>
                <span class="panel__meta">差别都在于「下一次该怎么做」</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article v-for="g in confused" :key="g.title" class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ g.title }}</h3>
                            <span class="card__tag">{{ g.tag }}</span>
                        </div>
                        <p class="card__desc">{{ g.desc }}</p>
                        <div v-for="row in g.rows" :key="row.k" class="res-row">
                            <span class="res-k mono">{{ row.k }}</span>
                            <span class="res-v">{{ row.v }}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ④ 全表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reference</span>
                    <h2 class="panel__title">状态码速查</h2>
                </div>
                <span class="panel__meta">点一个类别切换，或直接搜关键字</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="c in classes" :key="c.key" type="button" class="w-btn"
                            :class="curClass === c.key ? 'is-active' : ''" @click="curClass = c.key">
                            {{ c.label }}
                        </button>
                    </div>
                    <input v-model="kw" class="cfg__input cfg__input--sm mono" placeholder="搜索状态码或说明">
                </div>

                <div class="code-table">
                    <div v-for="item in filtered" :key="item.statusCode" class="code-table__row">
                        <span class="code-table__code mono" :class="'is-' + String(item.statusCode)[0]">
                            {{ item.statusCode }}
                        </span>
                        <span class="code-table__desc">{{ item.statusDesc }}</span>
                    </div>
                    <div v-if="!filtered.length" class="log-empty">没有匹配的状态码</div>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">前端该怎么判断</h2>
                </div>
                <span class="panel__meta">别再用 response.status 硬编码 200 了</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">fetch 的坑：它只在网络失败时 reject</div>
                    <CodeEditor :code="fetchCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">axios：validateStatus 与拦截器分工</div>
                    <CodeEditor :code="axiosCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/* ── 真机探测 ────────────────────────────────────────── */
type Preset = {
    key: string
    label: string
    method: string
    url: string
    tag: string
    note: string
}

const presets: Preset[] = [
    {
        key: 'index',
        label: '① 请求首页 → 期望 200',
        method: 'GET',
        url: '/',
        tag: '成功',
        note: '最常见的成功态，响应体里带着真正的 HTML。',
    },
    {
        key: 'notfound',
        label: '② 请求不存在的路径 → 期望 404',
        method: 'GET',
        url: `/probe-missing-${Date.now() % 100000}.xyz`,
        tag: '客户端错误',
        note: '地址写错了。注意：SPA 里如果服务端把所有路径都 fallback 到 index.html，这里也会返回 200 —— 那是路由层的宽容，不是 404 不存在。',
    },
    {
        key: 'api401',
        label: '③ 请求需要登录的接口 → 期望 401',
        method: 'GET',
        url: '/api/users/me',
        tag: '未授权',
        note: '没带 token 或 token 过期。401 的重点是「你是谁我还不知道」，通常要求浏览器弹出认证。',
    },
    {
        key: 'api405',
        label: '④ 用错方法请求 → 期望 405',
        method: 'GET',
        url: '/api/users/setUser',
        tag: '方法不允许',
        note: '接口只接受 POST，你发了 GET。405 的响应里必须带 Allow 头告诉对方能用哪些方法。',
    },
    {
        key: 'revalidate',
        label: '⑤ 带 ETag 再请求一次 → 期望 304',
        method: 'GET',
        url: '/',
        tag: '协商缓存',
        note: '先发一次拿资源指纹，再带着 If-None-Match 问一次。内容没变时服务器只回 headers。',
    },
]

type ProbeResult = {
    id: number
    status: number
    statusText: string
    kind: string
    method: string
    url: string
    tag: string
    ms: number
    note: string
    headers: string[]
}

const results = ref<ProbeResult[]>([])
const busyKey = ref('')
const busy = ref(false)
const customUrl = ref('')
let seq = 0

/* 上一次拿到的指纹，用来做 304 探测 */
let cachedETag = ''
let cachedLastMod = ''

function kindOf(status: number): string {
    if (status === 0) return 'err'
    const c = String(status)[0]
    if (c === '2' || c === '3') return 'ok'
    if (c === '4') return 'warn'
    return 'bad'
}

function fmtMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(0)} ms`
}

async function probe(p: Preset) {
    busyKey.value = p.key
    busy.value = true
    await runRequest(p)
    busyKey.value = ''
    busy.value = false
}

async function probeCustom() {
    const u = customUrl.value.trim()
    if (!u) return
    busy.value = true
    await runRequest({
        key: 'custom',
        label: '自定义',
        method: 'GET',
        url: u,
        tag: '自定义请求',
        note: '',
    })
    busy.value = false
}

async function runRequest(p: Preset) {
    const t0 = performance.now()
    const headers: Record<string, string> = {}
    let url = p.url

    if (p.key === 'revalidate') {
        // 先无条件取一次拿到指纹，再带着它问第二次
        if (!cachedETag) {
            try {
                const first = await fetch(url, { cache: 'no-store' })
                cachedETag = first.headers.get('etag') ?? ''
                cachedLastMod = first.headers.get('last-modified') ?? ''
            } catch {
                /* 忽略，下面会表现为失败 */
            }
        }
        if (cachedETag) headers['If-None-Match'] = cachedETag
        else if (cachedLastMod) headers['If-Modified-Since'] = cachedLastMod
        url = url + (url.includes('?') ? '&' : '?') + '_p=' + Date.now()
    }

    let status = 0
    let statusText = 'Network Error'
    const heads: string[] = []

    try {
        const res = await fetch(url, { method: p.method, headers, credentials: 'include' })
        status = res.status
        statusText = res.statusText
        res.headers.forEach((v, k) => {
            heads.push(`${k}: ${v}`)
        })
    } catch (e) {
        statusText = e instanceof Error ? e.message : '请求失败'
    }

    const ms = performance.now() - t0
    seq += 1

    const note =
        p.key === 'revalidate' && status === 304
            ? `服务器算了 ETag(${cachedETag || '—'}) 之后说「没变」，只回了 headers，实体 body 是空的。`
            : p.key === 'revalidate'
                ? `这次没能命中 304（状态 ${status}）。可能是资源没有 ETag/Last-Modified，或服务端每次都重算。`
                : p.note

    results.value = [
        {
            id: seq,
            status,
            statusText,
            kind: kindOf(status),
            method: p.method,
            url,
            tag: p.tag,
            ms,
            note,
            headers: heads.slice(0, 18),
        },
        ...results.value,
    ].slice(0, 8)

    readTiming(url)
}

/* ── Performance API 耗时分解 ────────────────────────── */
type Timing = { k: string; v: number; pct: number; color: string }

const timings = ref<Timing[]>([])

function readTiming(url: string) {
    const abs = new URL(url, location.href).href
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const hit = entries.filter((e) => e.name === abs).pop()
    if (!hit) {
        timings.value = []
        return
    }
    const raw: { k: string; v: number; color: string }[] = [
        { k: '重定向', v: Math.max(0, hit.redirectEnd - hit.redirectStart), color: 'var(--text-tertiary)' },
        { k: 'DNS 查询', v: Math.max(0, hit.domainLookupEnd - hit.domainLookupStart), color: 'var(--info)' },
        { k: 'TCP 连接', v: Math.max(0, hit.connectEnd - hit.connectStart), color: 'var(--brand)' },
        { k: 'TLS 握手', v: Math.max(0, hit.requestStart - hit.secureConnectionStart > 0 && hit.secureConnectionStart > 0 ? hit.requestStart - hit.secureConnectionStart : 0), color: 'var(--warning)' },
        { k: '等待首字节 TTFB', v: Math.max(0, hit.responseStart - hit.requestStart), color: 'var(--danger)' },
        { k: '下载', v: Math.max(0, hit.responseEnd - hit.responseStart), color: 'var(--success)' },
    ]
    const total = hit.duration || 1
    timings.value = raw.map((r) => ({ ...r, pct: Math.min(100, (r.v / total) * 100) }))
}

/* ── 易混对照 ────────────────────────────────────────── */
const confused = [
    {
        title: '200 / 204 / 201 的区别',
        tag: '语义',
        desc: '都是成功，但对前端的处理要求完全不同。',
        rows: [
            { k: '200 OK', v: '成功，并且响应体里有你想要的数据' },
            { k: '201 Created', v: '创建成功，响应头 Location 里是新建资源的地址' },
            { k: '204 No Content', v: '成功但没有响应体 —— 用它时 res.json() 会直接抛错' },
        ],
    },
    {
        title: '重定向四兄弟',
        tag: '缓存与方法',
        desc: '关键区别在于：允不允许把 POST 改成 GET，以及这次跳转会被缓存多久。',
        rows: [
            { k: '301', v: '永久移动。会被浏览器长期缓存，下次连问都不问；POST 可能被悄悄改成 GET' },
            { k: '302', v: '临时移动。不缓存，但历史上同样允许把 POST 降级成 GET' },
            { k: '307', v: '临时重定向，不许改方法 —— POST 过去还是 POST' },
            { k: '308', v: '永久重定向，不许改方法。301 的严格版本' },
        ],
    },
    {
        title: '401 和 403',
        tag: '身份 vs 权限',
        desc: '一个在问「你是谁」，一个在说「我知道你是谁，但你没资格」。',
        rows: [
            { k: '401 Unauthorized', v: '未认证：没带凭证或凭证失效，响应必须带 WWW-Authenticate' },
            { k: '403 Forbidden', v: '已认证但无权限，再登录也没用' },
        ],
    },
    {
        title: '502 和 504',
        tag: '网关',
        desc: '都出在网关这一层，区别是上游给的是「坏答案」还是「没答案」。',
        rows: [
            { k: '502 Bad Gateway', v: '上游给了无效响应（比如后端进程挂了、返回了非 HTTP 内容）' },
            { k: '504 Gateway Timeout', v: '上游在超时时间内没有回应（后端慢查询、接口卡死）' },
            { k: '503 Unavailable', v: '服务本身不可用（过载、正在发布），常带 Retry-After' },
        ],
    },
]

/* ── 状态码表 ────────────────────────────────────────── */
type CodeItem = { statusCode: number; statusDesc: string }

const stateCodeList: CodeItem[] = [
    { statusCode: 100, statusDesc: '继续 - 服务器已收到请求头，客户端应继续发送请求体' },
    { statusCode: 101, statusDesc: '切换协议 - 服务器同意升级协议，常见于 WebSocket 握手' },
    { statusCode: 103, statusDesc: '早期提示 - 服务器建议浏览器提前预加载 Link 里指出的资源' },
    { statusCode: 200, statusDesc: '成功 - 请求已成功处理，响应体里带数据' },
    { statusCode: 201, statusDesc: '已创建 - 新资源已建好，Location 头给出它的地址' },
    { statusCode: 202, statusDesc: '已接受 - 请求已收到但还没处理完，典型是异步任务' },
    { statusCode: 204, statusDesc: '无内容 - 成功处理但没有响应体，前端别去 res.json()' },
    { statusCode: 206, statusDesc: '部分内容 - 断点续传/分片下载时用，配合 Range 头' },
    { statusCode: 301, statusDesc: '永久移动 - 资源已永久换址，浏览器会缓存这次跳转' },
    { statusCode: 302, statusDesc: '临时移动 - 临时换址，理论上不应该改变请求方法' },
    { statusCode: 304, statusDesc: '未修改 - 协商缓存命中，用本地副本，响应体为空' },
    { statusCode: 307, statusDesc: '临时重定向 - 与 302 类似，但严禁把 POST 改成 GET' },
    { statusCode: 308, statusDesc: '永久重定向 - 与 301 类似，但严禁改变请求方法' },
    { statusCode: 400, statusDesc: '错误请求 - 语法错误或参数不合法，前端先自查' },
    { statusCode: 401, statusDesc: '未授权 - 缺少凭证或凭证失效，需要重新登录' },
    { statusCode: 403, statusDesc: '禁止访问 - 身份没问题但权限不够，通常是 RBAC 拦的' },
    { statusCode: 404, statusDesc: '未找到 - 路径不存在，也可能是被 SPA fallback 吃掉了' },
    { statusCode: 405, statusDesc: '方法不允许 - 该路径不支持这个 HTTP 方法，响应须带 Allow' },
    { statusCode: 408, statusDesc: '请求超时 - 客户端发得太慢，服务端等不下去了' },
    { statusCode: 409, statusDesc: '冲突 - 资源状态冲突，常见于并发编辑、重复主键' },
    { statusCode: 410, statusDesc: '已删除 - 资源曾经存在且已被永久移除' },
    { statusCode: 413, statusDesc: '载荷过大 - 上传的文件超过服务端限制' },
    { statusCode: 415, statusDesc: '媒体类型不支持 - Content-Type 服务端处理不了' },
    { statusCode: 422, statusDesc: '无法处理的实体 - 语义正确但业务校验没过' },
    { statusCode: 429, statusDesc: '请求过多 - 被限流了，看 Retry-After 决定多久后重试' },
    { statusCode: 500, statusDesc: '服务器内部错误 - 兜底错误，通常是未捕获异常' },
    { statusCode: 501, statusDesc: '未实现 - 服务端不支持这个功能' },
    { statusCode: 502, statusDesc: '网关错误 - 上游返回了无效响应' },
    { statusCode: 503, statusDesc: '服务不可用 - 过载或维护中，常带 Retry-After' },
    { statusCode: 504, statusDesc: '网关超时 - 上游在超时时间内没有回应' },
    { statusCode: 505, statusDesc: 'HTTP 版本不受支持 - 服务端不支持该协议版本' },
]

const classes = [
    { key: '1', label: '1xx' },
    { key: '2', label: '2xx' },
    { key: '3', label: '3xx' },
    { key: '4', label: '4xx' },
    { key: '5', label: '5xx' },
]
const curClass = ref('4')
const kw = ref('')

const filtered = computed(() =>
    stateCodeList.filter((i) => {
        if (!String(i.statusCode).startsWith(curClass.value)) return false
        if (!kw.value.trim()) return true
        const q = kw.value.trim().toLowerCase()
        return String(i.statusCode).includes(q) || i.statusDesc.toLowerCase().includes(q)
    }),
)

/* ── 展示用源码 ─────────────────────────────────────── */
const fetchCode = `// ⚠️ fetch 最大的坑：只有「网络层面的失败」才会 reject，
//    404 / 500 这些它一样会正常 resolve —— 必须自己看 ok / status。
const res = await fetch('/api/users/me')

if (!res.ok) {
  // 走到这里的是 4xx / 5xx
  throw new Error(\`请求失败：\${res.status}\`)
}

// 204 这条要单独处理：
if (res.status === 204) {
  return null          // res.json() 在空 body 上会抛 Unexpected end of JSON input
}

return res.json()

// 另一个坑：fetch 默认不带 cookie
fetch(url, { credentials: 'include' })   // 同源/跨站要这样写`

const axiosCode = `import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // axios 反过来：默认只在 2xx 时 resolve，其它一律进 catch。
  // 想自己接管状态码判断就改这里：
  validateStatus: (status) => status >= 200 && status < 300,
})

http.interceptors.response.use(
  (res) => {
    // HTTP 层成功 ≠ 业务成功。多数业务系统的错误藏在 body 里：
    const body = res.data
    if (body.code !== 200) {
      ElMessage.error(body.msg || '请求失败')
      return Promise.reject(new Error(body.msg))
    }
    return res
  },
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      // 401：清 token、跳登录
    } else if (status === 403) {
      // 403：提示无权限，别跳登录
    } else if (status === 429) {
      // 429：读 Retry-After 退避重试
    } else if (status >= 500) {
      // 5xx：可以重试，但要加上退避和次数上限
    }
    return Promise.reject(err)
  },
)`
</script>

<style lang="scss" scoped>
.cfg {
    padding: 10px 12px;
    margin: 10px 0;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.cfg__row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.cfg__k {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--text-tertiary);
}

.cfg__input {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--app-bg);
    border: 1px solid var(--hairline);
    border-radius: 0;
    outline: none;

    &:focus {
        border-color: var(--brand);
    }
}

.cfg__input--sm {
    flex: 0 0 220px;
}

.probe-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.probe {
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);

    &.is-ok {
        border-left: 3px solid var(--success);
    }

    &.is-warn {
        border-left: 3px solid var(--warning);
    }

    &.is-bad {
        border-left: 3px solid var(--danger);
    }

    &.is-err {
        border-left: 3px solid var(--text-tertiary);
    }
}

.probe__head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
}

.probe__code {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.probe__tag {
    padding: 1px 7px;
    font-size: 11px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
}

.probe__time {
    margin-left: auto;
    font-size: 11px;
    color: var(--text-tertiary);
}

.probe__url {
    margin-top: 5px;
    font-size: 11px;
    color: var(--text-secondary);
    word-break: break-all;
}

.probe__note {
    margin: 6px 0 0;
    font-size: 12px;
    line-height: 1.65;
    color: var(--text-tertiary);
}

.probe__hd {
    margin-top: 6px;

    summary {
        font-size: 11px;
        color: var(--text-tertiary);
        cursor: pointer;
    }

    pre {
        max-height: 160px;
        margin: 6px 0 0;
        padding: 8px 10px;
        overflow: auto;
        font-size: 11px;
        line-height: 1.6;
        color: var(--text-secondary);
        background: var(--app-bg);
        border: 1px solid var(--hairline);
    }
}

.timing {
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.timing__row {
    display: grid;
    grid-template-columns: 110px 1fr 70px;
    align-items: center;
    gap: 10px;
    padding: 3px 0;
}

.timing__k {
    font-size: 11px;
    color: var(--text-tertiary);
}

.timing__bar {
    height: 6px;
    background: var(--surface-muted);

    i {
        display: block;
        height: 100%;
        min-width: 1px;
    }
}

.timing__v {
    font-size: 11px;
    text-align: right;
    color: var(--text-secondary);
}

.cards .card .res-row {
    margin-top: 6px;
}

.code-table {
    margin-top: 10px;
    border: 1px solid var(--hairline);
}

.code-table__row {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 10px;
    padding: 7px 12px;
    border-bottom: 1px solid var(--hairline);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: var(--surface-muted);
    }
}

.code-table__code {
    font-size: 12px;
    font-weight: 600;

    &.is-1 {
        color: var(--text-tertiary);
    }

    &.is-2 {
        color: var(--success);
    }

    &.is-3 {
        color: var(--info);
    }

    &.is-4 {
        color: var(--warning);
    }

    &.is-5 {
        color: var(--danger);
    }
}

.code-table__desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-secondary);
}

.probe-note {
    margin: 10px 0 0;
    font-size: 11px;
    line-height: 1.7;
    color: var(--text-tertiary);
}

@media (max-width: 780px) {
    .timing__row {
        grid-template-columns: 90px 1fr 60px;
    }
}
</style>
