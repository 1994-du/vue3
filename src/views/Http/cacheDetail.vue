<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">HTTP Cache</span>
                    <h2 class="panel__title">最快的请求，是根本没发出去的那个</h2>
                </div>
                <span class="panel__meta">强缓存不问服务器，协商缓存只问一句「变了吗」</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    浏览器缓存解决三件事：<strong>少发请求</strong>、<strong>少传字节</strong>、<strong>少等时间</strong>。
                    它分两级 —— 第一级叫<em>强缓存</em>：只要在有效期内，浏览器连请求都不发，直接从本地拿；
                    过期了才轮到第二级<em>协商缓存</em>：带着资源的「指纹」去问服务器，
                    服务器说没变就回一个空体的 <code>304</code>，你继续用本地那份。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">强缓存</span>
                        <span class="point__v">Cache-Control: max-age / Expires　状态码 200 (from disk cache)</span>
                    </div>
                    <div class="point">
                        <span class="point__k">协商缓存</span>
                        <span class="point__v">ETag ↔ If-None-Match、Last-Modified ↔ If-Modified-Since　状态码 304</span>
                    </div>
                    <div class="point">
                        <span class="point__k">优先级</span>
                        <span class="point__v">Cache-Control 胜过 Expires，ETag 胜过 Last-Modified</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 缓存决策沙盘 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">缓存决策沙盘</h2>
                </div>
                <span class="panel__meta">改响应头 → 发请求 → 看它到底走了哪条路</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    下面是一份完整的浏览器决策过程。<strong>先按「第 1 次请求」把资源取下来</strong>，
                    再按「再次请求」，对比服务器<em>没变</em>和<em>变了</em>两种情况的差别；
                    最后试试把 max-age 调到 0、或者按 Ctrl+F5 硬刷新，看路径怎么改。
                </p>

                <!-- 配置区 -->
                <div class="cfg">
                    <div class="cfg__row">
                        <span class="cfg__k">响应头 Cache-Control</span>
                        <div class="w-btns">
                            <button v-for="o in ccOptions" :key="o.key" type="button" class="w-btn"
                                :class="cc === o.key ? 'is-active' : ''" @click="cc = o.key">
                                {{ o.label }}
                            </button>
                        </div>
                    </div>
                    <div class="cfg__row" v-if="cc === 'maxage'">
                        <span class="cfg__k">max-age 有效期</span>
                        <input v-model.number="maxAge" type="range" min="0" max="3600" step="10" class="cfg__range">
                        <span class="cfg__v mono">{{ maxAge }} s</span>
                    </div>
                    <div class="cfg__row">
                        <span class="cfg__k">带上校验字段</span>
                        <div class="w-btns">
                            <button type="button" class="w-btn" :class="hasEtag ? 'is-active' : ''"
                                @click="hasEtag = !hasEtag">ETag</button>
                            <button type="button" class="w-btn" :class="hasLastMod ? 'is-active' : ''"
                                @click="hasLastMod = !hasLastMod">Last-Modified</button>
                        </div>
                    </div>
                    <div class="cfg__row">
                        <span class="cfg__k">距离上次缓存已过去</span>
                        <input v-model.number="age" type="range" min="0" max="7200" step="10" class="cfg__range">
                        <span class="cfg__v mono">{{ readableAge }}</span>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="send('navigate')">① 第 1 次请求</button>
                        <button type="button" class="w-btn" @click="send('reload')">② 普通刷新 F5</button>
                        <button type="button" class="w-btn" @click="send('hard')">③ 硬刷新 Ctrl+F5</button>
                        <button type="button" class="w-btn" @click="changeResource">改一下服务器上的资源</button>
                        <button type="button" class="w-btn" @click="resetSandbox">清空缓存</button>
                    </div>
                    <span class="w-hint">服务端资源当前版本 v{{ serverVersion }}</span>
                </div>

                <!-- 决策路径 -->
                <div class="flow">
                    <div v-for="n in flowNodes" :key="n.id" class="flow__node"
                        :class="[trace.nodes.includes(n.id) ? 'is-on' : '', n.id === lastNode ? 'is-final' : '']">
                        <span class="flow__dot">{{ trace.nodes.indexOf(n.id) + 1 }}</span>
                        <div class="flow__body">
                            <span class="flow__t">{{ n.label }}</span>
                            <span class="flow__d">{{ nodeDetail(n.id) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 结论 -->
                <div class="verdict" :class="'is-' + trace.kind">
                    <div class="verdict__status mono">{{ trace.status }}</div>
                    <div class="verdict__meta">
                        <span>网络请求：<b>{{ trace.network ? '发了' : '没发' }}</b></span>
                        <span>传输体积：<b class="mono">{{ trace.bodySize }}</b></span>
                        <span>命中环节：<b>{{ trace.hit }}</b></span>
                    </div>
                    <p class="verdict__note">{{ trace.note }}</p>
                </div>

                <!-- 报文 -->
                <div class="wire">
                    <div class="wire__col">
                        <span class="wire__cap">→ Request</span>
                        <div class="code-block" style="margin: 0">
                            <CodeEditor :code="reqText" />
                        </div>
                    </div>
                    <div class="wire__col">
                        <span class="wire__cap">← Response</span>
                        <div class="code-block" style="margin: 0">
                            <CodeEditor :code="resText" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 字段对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Fields</span>
                    <h2 class="panel__title">四个字段的分工</h2>
                </div>
                <span class="panel__meta">谁先看，谁说了算</span>
            </div>
            <div class="panel__body">
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">Cache-Control: max-age</span>
                        <span class="point__v">相对时间，从响应返回的那一刻开始倒数。不受客户端系统时间影响，优先级最高</span>
                    </div>
                    <div class="point">
                        <span class="point__k">Expires</span>
                        <span class="point__v">HTTP/1.0 的绝对过期时间点。依赖客户端时钟，改一下系统时间就会被骗；同时存在时被 max-age 覆盖</span>
                    </div>
                    <div class="point">
                        <span class="point__k">ETag / If-None-Match</span>
                        <span class="point__v">资源的指纹（常由内容哈希或 mtime+size 算出）。能识别「一秒内改了又改」，精度最高</span>
                    </div>
                    <div class="point">
                        <span class="point__k">Last-Modified / If-Modified-Since</span>
                        <span class="point__v">最后修改时间。只精确到秒，同一秒内的改动识别不出来；分布式部署时各机器时间要一致</span>
                    </div>
                </div>

                <p class="intro__text" style="margin-top: 14px">
                    <strong>注意 no-cache 这个名字：它不是「不要缓存」</strong>。
                    「不要缓存」是 <code>no-store</code>；<code>no-cache</code> 的真实含义是
                    <em>「可以缓存，但每次用之前必须回服务器确认」</em> —— 也就是跳过强缓存、直接走协商缓存。
                </p>
            </div>
        </section>

        <!-- ④ Cache-Control 指令表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Directives</span>
                    <h2 class="panel__title">Cache-Control 常见取值</h2>
                </div>
                <span class="panel__meta">同一个头可以出现在请求里，也可以出现在响应里</span>
            </div>
            <div class="panel__body">
                <h4 class="sub-title">服务端返回时用（响应头）</h4>
                <div class="kv-grid kv-grid--wide">
                    <div v-for="d in serverDirectives" :key="d.name" class="kv">
                        <span class="kv__k mono">{{ d.name }}</span>
                        <span class="kv__v">{{ d.description }}</span>
                    </div>
                </div>

                <h4 class="sub-title">客户端请求时用（请求头）</h4>
                <div class="kv-grid kv-grid--wide">
                    <div v-for="d in clientDirectives" :key="d.name" class="kv">
                        <span class="kv__k mono">{{ d.name }}</span>
                        <span class="kv__v">{{ d.description }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">线上到底该怎么配</h2>
                </div>
                <span class="panel__meta">带 hash 的产物可以永久强缓存，入口文件必须禁止</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">nginx · 带 hash 的静态资源用长期强缓存，index.html 禁止缓存</div>
                    <CodeEditor :code="nginxCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">前端 · 上线后用户为什么还看到旧页面</div>
                    <CodeEditor :code="pitfallCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

/* ── 沙盘状态 ────────────────────────────────────────── */
type CcKey = 'none' | 'maxage' | 'nocache' | 'nostore'

const ccOptions: { key: CcKey; label: string }[] = [
    { key: 'none', label: '不返回（只有 Expires）' },
    { key: 'maxage', label: 'max-age=N' },
    { key: 'nocache', label: 'no-cache' },
    { key: 'nostore', label: 'no-store' },
]

const cc = ref<CcKey>('maxage')
const maxAge = ref(60)
const hasEtag = ref(true)
const hasLastMod = ref(true)
const age = ref(0)

const serverVersion = ref(1)
const FILE_SIZE = 128 // KB，假装这是那个资源的大小

type CacheEntry = {
    etag: string | null
    lastMod: string | null
    version: number
}
const cache = ref<CacheEntry | null>(null)

const readableAge = computed(() => {
    if (age.value < 60) return `${age.value} s`
    if (age.value < 3600) return `${Math.floor(age.value / 60)} min ${age.value % 60}s`
    return `${Math.floor(age.value / 3600)} h ${Math.floor((age.value % 3600) / 60)} min`
})

function stamp(): string {
    // 用「现在减去已过去的时间」生成一个稳定的时间串，方便演示
    const d = new Date(Date.now() - age.value * 1000)
    return d.toUTCString()
}

function serverStamp(): string {
    const d = new Date(Date.now() - (age.value - 10) * 1000)
    return d.toUTCString()
}

/* ── 决策流程 ────────────────────────────────────────── */
type FlowId =
    | 'start'
    | 'nostore'
    | 'hascache'
    | 'fresh'
    | 'usecache'
    | 'revalidate'
    | 'server'
    | 'r304'
    | 'r200'
    | 'write'

const flowNodes: { id: FlowId; label: string }[] = [
    { id: 'start', label: '浏览器准备发起请求' },
    { id: 'nostore', label: '这个响应允许被存下来吗' },
    { id: 'hascache', label: '本地有没有这份资源的副本' },
    { id: 'fresh', label: '副本还在有效期内吗' },
    { id: 'usecache', label: '直接用副本，请求终止' },
    { id: 'revalidate', label: '带上校验字段去问服务器' },
    { id: 'server', label: '服务器比对指纹' },
    { id: 'r304', label: '回 304，空响应体' },
    { id: 'r200', label: '回 200，带上完整资源' },
    { id: 'write', label: '按响应头更新本地缓存' },
]

type Verdict = {
    nodes: FlowId[]
    status: string
    kind: 'hit' | 'revalidate' | 'miss'
    network: boolean
    bodySize: string
    hit: string
    note: string
    reqHeaders: string[]
    resHeaders: string[]
}

const trace = ref<Verdict>({
    nodes: [],
    status: '尚未发起请求',
    kind: 'miss',
    network: false,
    bodySize: '—',
    hit: '—',
    note: '点一下上面的请求按钮，观察每一步是怎么走的。',
    reqHeaders: [],
    resHeaders: [],
})

const lastNode = computed<FlowId | null>(() =>
    trace.value.nodes.length ? trace.value.nodes[trace.value.nodes.length - 1] : null,
)

function currentResHeaders(): string[] {
    const h: string[] = []
    if (cc.value === 'maxage') h.push(`Cache-Control: max-age=${maxAge.value}`)
    else if (cc.value === 'nocache') h.push('Cache-Control: no-cache')
    else if (cc.value === 'nostore') h.push('Cache-Control: no-store')
    else h.push('Expires: ' + new Date(Date.now() + 60000).toUTCString())
    if (hasEtag.value) h.push(`ETag: "v${serverVersion.value}-${(FILE_SIZE * 1024).toString(16)}"`)
    if (hasLastMod.value) h.push('Last-Modified: ' + serverStamp())
    h.push('Content-Type: application/javascript')
    return h
}

function etagOf(version: number): string {
    return `"v${version}-${(FILE_SIZE * 1024).toString(16)}"`
}

function send(mode: 'navigate' | 'reload' | 'hard') {
    const nodes: FlowId[] = ['start']
    const req: string[] = ['GET /assets/app.js HTTP/1.1', 'Host: demo.local']
    const res: string[] = []

    // 硬刷新：浏览器主动绕过一切本地缓存
    if (mode === 'hard') {
        req.push('Cache-Control: no-cache', 'Pragma: no-cache')
    } else if (mode === 'reload') {
        req.push('Cache-Control: max-age=0')
    }

    const hardOrReload = mode !== 'navigate'
    const stored = cache.value

    // ── 节点：是否允许存储 ──
    if (cc.value === 'nostore') {
        nodes.push('nostore')
        // no-store：既不读旧的，也不写新的
        req.push('Accept: */*')
        res.push('HTTP/1.1 200 OK', ...currentResHeaders(), `Content-Length: ${FILE_SIZE * 1024}`)
        trace.value = {
            nodes,
            status: '200 OK',
            kind: 'miss',
            network: true,
            bodySize: `${FILE_SIZE} KB`,
            hit: '未缓存',
            note: 'Cache-Control: no-store —— 浏览器不允许保存任何副本，所以每次都是完整下载。银行流水、验证码这类敏感数据用它。',
            reqHeaders: req,
            resHeaders: res,
        }
        return
    }

    // ── 节点：本地是否有副本 ──
    nodes.push('hascache')
    if (!stored || hardOrReload) {
        // 没有本地副本，或者被刷新操作强制跳过强缓存
        let hit = '首次下载'
        if (hardOrReload) hit = mode === 'hard' ? '硬刷新跳过缓存' : 'F5 跳过强缓存'
        nodes.push('revalidate')
        if (stored?.etag) req.push(`If-None-Match: ${stored.etag}`)
        if (stored?.lastMod) req.push(`If-Modified-Since: ${stored.lastMod}`)

        nodes.push('server')
        res.push('HTTP/1.1 200 OK', ...currentResHeaders(), `Content-Length: ${FILE_SIZE * 1024}`)
        nodes.push('r200', 'write')
        cache.value = {
            etag: hasEtag.value ? etagOf(serverVersion.value) : null,
            lastMod: hasLastMod.value ? serverStamp() : null,
            version: serverVersion.value,
        }
        trace.value = {
            nodes,
            status: '200 OK',
            kind: 'miss',
            network: true,
            bodySize: `${FILE_SIZE} KB`,
            hit,
            note: `${hit}：本地没有可用的副本（或浏览器被要求跳过），只能完整下载一遍，然后把 ${FILE_SIZE}KB 写进磁盘缓存。`,
            reqHeaders: req,
            resHeaders: res,
        }
        return
    }

    // ── 节点：副本是否新鲜 ──
    nodes.push('fresh')
    const fresh =
        cc.value === 'maxage'
            ? age.value < maxAge.value
            : cc.value === 'none'
                ? age.value < 60
                : false // no-cache：永不算新鲜

    if (fresh && cc.value !== 'nocache') {
        nodes.push('usecache')
        res.push('（无网络请求）', '状态码显示为 200，但后面标注 from disk cache / memory cache')
        trace.value = {
            nodes,
            status: '200 OK (from disk cache)',
            kind: 'hit',
            network: false,
            bodySize: '0 B',
            hit: '强缓存',
            note: `副本才用了 ${readableAge.value}，没到 max-age=${maxAge.value}s 的有效期，浏览器直接拿本地的用 —— 这一次请求压根没出门，Network 面板里会显示 0ms。`,
            reqHeaders: ['（请求未发出，Network 面板中会标注 from cache）'],
            resHeaders: res,
        }
        return
    }

    // ── 节点：协商缓存 ──
    nodes.push('revalidate')
    if (stored.etag) req.push(`If-None-Match: ${stored.etag}`)
    if (stored.lastMod) req.push(`If-Modified-Since: ${stored.lastMod}`)

    const canAsk = Boolean(stored.etag || stored.lastMod)
    if (!canAsk) {
        nodes.push('r200', 'write')
        res.push('HTTP/1.1 200 OK', ...currentResHeaders(), `Content-Length: ${FILE_SIZE * 1024}`)
        cache.value = {
            etag: hasEtag.value ? etagOf(serverVersion.value) : null,
            lastMod: hasLastMod.value ? serverStamp() : null,
            version: serverVersion.value,
        }
        trace.value = {
            nodes: [...nodes],
            status: '200 OK',
            kind: 'miss',
            network: true,
            bodySize: `${FILE_SIZE} KB`,
            hit: '缓存过期且无校验字段',
            note: '副本过期了，又没有任何校验字段可以拿去问服务器，只能老老实实重新下载一份。所以 ETag / Last-Modified 至少要留一个。',
            reqHeaders: req,
            resHeaders: res,
        }
        return
    }

    nodes.push('server')
    const changed = stored.version !== serverVersion.value
    const collision =
        stored.lastMod !== null && stored.version === serverVersion.value && age.value > 0 && serverVersion.value > 1

    if (!changed) {
        nodes.push('r304', 'write')
        res.push(
            'HTTP/1.1 304 Not Modified',
            hasEtag.value ? `ETag: ${etagOf(serverVersion.value)}` : '',
            hasLastMod.value ? `Last-Modified: ${serverStamp()}` : '',
            '',
            '（响应体为空）',
        )
        trace.value = {
            nodes,
            status: '304 Not Modified',
            kind: 'revalidate',
            network: true,
            bodySize: '0 B（只发了头）',
            hit: '协商缓存',
            note: collision
                ? '注意：这次时间戳其实在同一秒内变过又变回来了，只有 ETag 能识别出来 —— 这就是 ETag 存在的意义。'
                : `请求确实发出去了（会有几十毫秒的 RTT），但服务器只回了 headers，实体 body 是空的，省下的正是那 ${FILE_SIZE}KB。`,
            reqHeaders: req,
            resHeaders: res.filter(Boolean),
        }
        return
    }

    nodes.push('r200', 'write')
    res.push('HTTP/1.1 200 OK', ...currentResHeaders(), `Content-Length: ${FILE_SIZE * 1024}`)
    cache.value = {
        etag: hasEtag.value ? etagOf(serverVersion.value) : null,
        lastMod: hasLastMod.value ? serverStamp() : null,
        version: serverVersion.value,
    }
    trace.value = {
        nodes,
        status: '200 OK',
        kind: 'miss',
        network: true,
        bodySize: `${FILE_SIZE} KB`,
        hit: '协商未命中',
        note: `服务器发现指纹对不上（本地是 v${stored.version}，服务器已经是 v${serverVersion.value}），只能把新的一整份发回来。`,
        reqHeaders: req,
        resHeaders: res,
    }
}

function changeResource() {
    serverVersion.value += 1
    age.value = Math.min(age.value + 30, 7200)
}

function resetSandbox() {
    cache.value = null
    serverVersion.value = 1
    age.value = 0
    trace.value = {
        nodes: [],
        status: '尚未发起请求',
        kind: 'miss',
        network: false,
        bodySize: '—',
        hit: '—',
        note: '本地缓存已清空。现在点「第 1 次请求」重新开始。',
        reqHeaders: [],
        resHeaders: [],
    }
}

function nodeDetail(id: FlowId): string {
    if (!trace.value.nodes.includes(id)) return '本次未经过'
    switch (id) {
        case 'start':
            return '浏览器要 /assets/app.js'
        case 'nostore':
            return '响应带了 no-store → 禁止保存'
        case 'hascache':
            return cache.value ? `本地有副本（v${cache.value.version}）` : '本地没有副本'
        case 'fresh':
            return `副本已存放 ${readableAge.value}`
        case 'usecache':
            return '✔ 直接用本地副本，请求到此为止'
        case 'revalidate':
            return '带着 If-None-Match / If-Modified-Since 发请求'
        case 'server':
            return `服务端当前 v${serverVersion.value}`
        case 'r304':
            return '指纹一致 → 304，空响应体'
        case 'r200':
            return '指纹不一致 → 200，全量下发'
        case 'write':
            return '按新的响应头刷新本地缓存'
        default:
            return ''
    }
}

const reqText = computed(() =>
    trace.value.reqHeaders.length ? trace.value.reqHeaders.join('\n') : '# 还没有发起请求',
)
const resText = computed(() =>
    trace.value.resHeaders.length ? trace.value.resHeaders.join('\n') : '# 还没有响应',
)

/* ── 指令表 ──────────────────────────────────────────── */
interface CacheDirective {
    name: string
    description: string
}

const serverDirectives: CacheDirective[] = [
    { name: 'max-age', description: '在多少秒内有效，是相对时间，比 Expires 精确' },
    { name: 's-maxage', description: '只在共享缓存（CDN）上生效，优先级高于 max-age' },
    { name: 'no-cache', description: '不是不缓存，而是每次用之前必须回源验证（走协商缓存）' },
    { name: 'no-store', description: '彻底禁止缓存，每次完整下载，适合敏感数据' },
    { name: 'public', description: '允许任何中间节点缓存，包括 CDN 与代理' },
    { name: 'private', description: '只允许终端用户的浏览器缓存，禁止 CDN 存' },
    { name: 'must-revalidate', description: '一旦过期就必须回源验证，不允许用已过期的副本' },
    { name: 'immutable', description: '告诉浏览器有效期内连刷新都不必验证，适合带 hash 的产物' },
]

const clientDirectives: CacheDirective[] = [
    { name: 'max-stale', description: '可以接受已过期但在指定秒数内的副本' },
    { name: 'min-fresh', description: '要求副本至少还剩指定时间的新鲜度' },
    { name: 'only-if-cached', description: '只接受本地缓存，拿不到就返回 504' },
    { name: 'no-cache（F5 / Ctrl+F5 自动带上）', description: '浏览器刷新时自动附加，用来跳过本地缓存' },
]

/* ── 展示用源码 ─────────────────────────────────────── */
const nginxCode = `# 带 hash 的产物：内容一变文件名就变，可以放心长期强缓存
location /assets/ {
    # Vite 的产物都长这样：app-4f8a2c1d.js
    add_header Cache-Control "public, max-age=31536000, immutable";
    expires 1y;
}

# HTML 入口绝对不能缓存 —— 否则用户拿到的还是引用旧 js 的那份
location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
    expires -1;
}

# 兜底：SPA 的其他路径同样按 index.html 处理
location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache, must-revalidate";
}`

const pitfallCode = `// ❌ 常见误区：只配了 max-age，上线后发现用户还是旧页面
// 因为 index.html 被 CDN / 浏览器缓存住了，它引用的还是旧的 app-abc123.js

// ✅ 正确做法：两级缓存策略
// 1) 产物文件名带内容 hash（Vite / Webpack 默认行为），改动后文件名必然变化
//    dist/assets/app-4f8a2c1d.js   ← 内容不变则 hash 不变
// 2) index.html 永不缓存，它负责指向「当前这一版」的 hash 文件名

// Vite 里确认 hash 生效：
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}

// 排查手法：
// 1. F12 → Network → 勾 Disable cache（仅开发期）
// 2. 看 Response Headers 里的 Cache-Control 到底是谁给的：
//    浏览器 / CDN / nginx 任何一个写了都会生效
// 3. curl -I https://your.site/assets/app-xxx.js  看 nginx 层实际返回`
</script>

<style lang="scss" scoped>
.cfg {
    padding: 12px 14px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.cfg__row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 5px 0;
}

.cfg__k {
    flex-shrink: 0;
    min-width: 168px;
    font-size: 12px;
    color: var(--text-tertiary);
}

.cfg__v {
    min-width: 88px;
    font-size: 12px;
    color: var(--brand);
}

.cfg__range {
    flex: 1;
    max-width: 320px;
    accent-color: var(--brand);
}

.flow {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 14px;
}

.flow__node {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--hairline);
    border-bottom: none;
    background: var(--surface);
    opacity: 0.4;

    &:last-child {
        border-bottom: 1px solid var(--hairline);
    }

    &.is-on {
        opacity: 1;
        border-left: 2px solid var(--brand);
        background: color-mix(in srgb, var(--brand) 6%, var(--surface));
    }

    &.is-final.is-on {
        border-color: var(--brand);
        background: color-mix(in srgb, var(--brand) 12%, var(--surface));
    }
}

.flow__dot {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
}

.is-on .flow__dot {
    color: var(--brand);
    border-color: var(--brand);
}

.flow__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.flow__t {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
}

.flow__d {
    font-size: 11px;
    color: var(--text-tertiary);
}

.verdict {
    padding: 12px 14px;
    margin-bottom: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);

    &.is-hit {
        border-color: color-mix(in srgb, var(--success) 55%, transparent);
        background: color-mix(in srgb, var(--success) 8%, var(--surface));
    }

    &.is-revalidate {
        border-color: color-mix(in srgb, var(--brand) 55%, transparent);
        background: color-mix(in srgb, var(--brand) 8%, var(--surface));
    }

    &.is-miss {
        border-color: color-mix(in srgb, var(--danger) 45%, transparent);
        background: color-mix(in srgb, var(--danger) 6%, var(--surface));
    }
}

.verdict__status {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-primary);
}

.verdict__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-tertiary);

    b {
        color: var(--text-primary);
        font-weight: 500;
    }
}

.verdict__note {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.wire {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.wire__col {
    min-width: 0;
}

.wire__cap {
    display: block;
    margin-bottom: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--text-tertiary);
}

.sub-title {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.kv-grid--wide {
    margin-bottom: 14px;
}

@media (max-width: 900px) {
    .wire {
        grid-template-columns: 1fr;
    }

    .cfg__row {
        flex-wrap: wrap;
    }
}
</style>
