<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">HTTP Versions</span>
                    <h2 class="panel__title">三十多年，一直在解决「堵」的问题</h2>
                </div>
                <span class="panel__meta">从一次一个请求，到一条连接跑所有流</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    HTTP 的每次升级几乎都在回答同一个问题：<em>「怎么让网页更快加载完」</em>。
                    这条路可以粗略分成三段 —— 先是<strong>能不能复用连接</strong>（1.0 → 1.1），
                    然后是<strong>能不能并行</strong>（1.1 → 2，多路复用），
                    最后是<strong>丢包会不会拖累所有人</strong>（2 → 3，把队列从 TCP 挪到 QUIC）。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">队头阻塞</span>
                        <span class="point__v">前头的东西没过去，后头全都跟着等 —— 这是 1.1 和 2 各自的痛点</span>
                    </div>
                    <div class="point">
                        <span class="point__k">1.1 的版本</span>
                        <span class="point__v">连接可复用，但浏览器对同一域名最多开 6 条，多的要排队</span>
                    </div>
                    <div class="point">
                        <span class="point__k">2 的破法</span>
                        <span class="point__v">二进制分帧 + 多路复用，一条连接同时跑几十个 stream，不再受 6 条限制</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 核心实验：队头阻塞 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">同时加载 60 个资源，看看谁先完</h2>
                </div>
                <span class="panel__meta">同样的带宽、同样的丢包，只有协议不同</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    下面是一张现代网页的缩略：{{ TOTAL }} 个小资源。三种模式用<strong>完全相同的带宽</strong>下载它们，
                    区别只在于协议允许怎么排队。先跑一次不丢包的，再加上丢包重跑一遍 ——
                    你会发现 HTTP/2 的痛点根本不在「并行」，而在它底下那层 TCP。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="m in modes" :key="m.key" type="button" class="w-btn"
                            :class="mode === m.key ? 'is-active' : ''" :disabled="running"
                            @click="mode = m.key">
                            {{ m.label }}
                        </button>
                    </div>
                    <span class="w-hint">{{ currentMode.desc }}</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="dropMode === 'none' ? 'is-active' : ''"
                            :disabled="running" @click="dropMode = 'none'">网络状况：不丢包</button>
                        <button type="button" class="w-btn" :class="dropMode === 'once' ? 'is-active' : ''"
                            :disabled="running" @click="dropMode = 'once'">丢一次</button>
                        <button type="button" class="w-btn" :class="dropMode === 'repeat' ? 'is-active' : ''"
                            :disabled="running" @click="dropMode = 'repeat'">持续丢包（弱网）</button>
                    </div>
                    <span class="w-hint">丢包后要等 {{ RTO_MS }}ms 重传，这段时间内该干什么由协议决定</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="running" @click="start">
                            ▶ 开始加载
                        </button>
                        <button type="button" class="w-btn" :disabled="!running" @click="pause">
                            ⏸ 暂停
                        </button>
                        <button type="button" class="w-btn" @click="resetAll">清空记录</button>
                    </div>
                    <span class="w-hint">已加载 {{ doneCount }} / {{ TOTAL }}　耗时 {{ (elapsed / 1000).toFixed(2) }}s</span>
                </div>

                <!-- 资源网格 -->
                <div class="grid-wrap" :class="'is-' + mode">
                    <div v-for="r in resources" :key="r.id" class="cell" :class="{
                        'is-done': r.done,
                        'is-stalled': stallLeft(r.id) > 0,
                        'is-active': !r.done && stallLeft(r.id) === 0 && elapsed > 0,
                        'is-queued': mode === 'http1' && !r.done && !r.started,
                    }">
                        <i :style="{ height: pct(r) + '%' }"></i>
                    </div>
                </div>

                <div v-if="mode === 'http1'" class="conn-note">
                    灰色描边的方块表示正在「等连接」—— {{ TOTAL }} 个资源只有 {{ CONN }} 条管道，
                    排在第 7 个之后的必须等前面让出位置（队头阻塞 · 第一层）。
                </div>
                <div v-if="mode === 'http2'" class="conn-note">
                    所有资源同时开始。但注意丢包发生时：<strong>整个网格一起停下来</strong>
                    —— TCP 只认字节流，丢的那个分段没到，后面所有已到的数据都不能交给上层（队头阻塞 · 第二层）。
                </div>
                <div v-if="mode === 'http3'" class="conn-note">
                    丢包只让对应的那一个方块变红，其他流照跑 —— QUIC 把「可靠」这件事
                    从连接下沉到了每条流，谁丢谁自己等。
                </div>

                <!-- 结果表 -->
                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">当前模式</span>
                        <span class="kv__v">{{ currentMode.label }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">丢包次数</span>
                        <span class="kv__v mono" :class="dropCount ? 'is-warn' : ''">{{ dropCount }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">总耗时</span>
                        <span class="kv__v mono" :class="doneCount === TOTAL ? 'is-ok' : ''">
                            {{ (elapsed / 1000).toFixed(2) }} s
                        </span>
                    </div>
                </div>

                <div class="score-table">
                    <div class="score-table__head">
                        <span>模式 / 网络</span>
                        <span>不丢包</span>
                        <span>丢一次</span>
                        <span>持续丢包</span>
                    </div>
                    <div v-for="row in scoreRows" :key="row.label" class="score-table__row">
                        <span>{{ row.label }}</span>
                        <span class="mono">{{ fmt(row.none) }}</span>
                        <span class="mono">{{ fmt(row.once) }}</span>
                        <span class="mono">{{ fmt(row.repeat) }}</span>
                    </div>
                </div>
                <p class="probe-note">
                    跑满三行再看这张表：不丢包时 1.1 明显吃亏，但 2 和 3 几乎打平；
                    一旦开始丢包，2 被 TCP 的队头阻塞拖住，3 基本不受影响 —— 这就是 HTTP/3 存在的全部理由。
                </p>
            </div>
        </section>

        <!-- ③ 版本时间线 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Timeline</span>
                    <h2 class="panel__title">每一版改了什么</h2>
                </div>
                <span class="panel__meta">点一层看它的关键变化与遗留问题</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="v in versions" :key="v.key" type="button" class="w-btn"
                            :class="cur === v.key ? 'is-active' : ''" @click="cur = v.key">
                            {{ v.name }}
                        </button>
                    </div>
                    <span class="w-hint">{{ curVersion.year }} 年</span>
                </div>

                <div class="ver-detail">
                    <div class="ver-detail__head">
                        <span class="ver-detail__name">{{ curVersion.name }}</span>
                        <span class="ver-detail__year mono">{{ curVersion.year }}</span>
                    </div>
                    <p class="intro__text">{{ curVersion.summary }}</p>
                    <div class="kv-grid">
                        <div class="kv">
                            <span class="kv__k">带来</span>
                            <span class="kv__v is-ok">{{ curVersion.gain }}</span>
                        </div>
                        <div class="kv">
                            <span class="kv__k">遗留问题</span>
                            <span class="kv__v is-bad">{{ curVersion.pain }}</span>
                        </div>
                    </div>
                    <ul class="ver-list">
                        <li v-for="(p, i) in curVersion.points" :key="i">{{ p }}</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">怎么看自己站上跑的是哪一版</h2>
                </div>
                <span class="panel__meta">浏览器面板、curl、nginx 三种确认方式</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">确认当前连接用的协议版本</div>
                    <CodeEditor :code="checkCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">nginx 上开启 HTTP/2 与 HTTP/3</div>
                    <CodeEditor :code="nginxCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

/* ── 模拟参数 ────────────────────────────────────────── */
const TOTAL = 60 // 资源总数
const SIZE = 10 // 每个资源的「单位」大小
const BW = 300 // 总带宽：单位 / 秒
const CONN = 6 // HTTP/1.1 每域名的连接上限
const RTT_MS = 150 // 一次请求-响应的固有延迟
const RTO_MS = 1000 // 丢包后等待重传的时间
const TICK_MS = 50

type ModeKey = 'http1' | 'http2' | 'http3'
type DropKey = 'none' | 'once' | 'repeat'

const modes: { key: ModeKey; label: string; desc: string }[] = [
    { key: 'http1', label: 'HTTP/1.1', desc: `同一域名最多 ${CONN} 条连接，连接内串行` },
    { key: 'http2', label: 'HTTP/2', desc: '一条连接多路复用，但队头阻塞在 TCP 层' },
    { key: 'http3', label: 'HTTP/3 (QUIC)', desc: '每条流独立可靠，丢包互不牵连' },
]

const mode = ref<ModeKey>('http1')
const currentMode = computed(() => modes.find((m) => m.key === mode.value)!)

/* ── 资源状态 ────────────────────────────────────────── */
type Res = {
    id: number
    slot: number // HTTP/1.1 里它排在哪条连接上
    loaded: number
    done: boolean
    started: boolean // 是否已经被调度过（用来只付一次 RTT）
    wait: number // 还要等多久才开始传（模拟 RTT）
}

function makeResources(): Res[] {
    return Array.from({ length: TOTAL }, (_, i) => ({
        id: i,
        slot: i % CONN,
        loaded: 0,
        done: false,
        started: false,
        wait: 0,
    }))
}

const resources = ref<Res[]>(makeResources())
const stalls = ref<Record<number, number>>({}) // resId → 剩余重传等待(ms)
const elapsed = ref(0)
const running = ref(false)
const dropMode = ref<DropKey>('none')
const dropCount = ref(0)

let timer: number | null = null
let droppedOnce = false

const doneCount = computed(() => resources.value.filter((r) => r.done).length)

function pct(r: Res): number {
    return Math.min(100, Math.round((r.loaded / SIZE) * 100))
}
function stallLeft(id: number): number {
    return stalls.value[id] ?? 0
}

/* ── 主循环 ──────────────────────────────────────────── */
function tick() {
    const dt = TICK_MS / 1000
    const list = resources.value
    const active = list.filter((r) => !r.done)
    if (!active.length) {
        finish()
        return
    }

    // 到期触发丢包
    handleDrop(active)

    if (mode.value === 'http1') {
        // 每条连接只推队头那一个，队头卡住整条连接就停摆
        const per = (BW / CONN) * dt
        for (let s = 0; s < CONN; s++) {
            const head = list.find((r) => !r.done && r.slot === s)
            if (!head) continue
            transfer(head, per)
        }
    } else if (mode.value === 'http2') {
        // TCP 队头阻塞：只要有一个分段在重传，整个连接都不往上交付
        const stalled = active.some((r) => (stalls.value[r.id] ?? 0) > 0)
        if (!stalled) {
            const per = (BW / active.length) * dt
            active.forEach((r) => transfer(r, per))
        }
    } else {
        // QUIC：丢的那条流自己等，其余照常
        const movable = active.filter((r) => (stalls.value[r.id] ?? 0) === 0)
        if (movable.length) {
            const per = (BW / movable.length) * dt
            movable.forEach((r) => transfer(r, per))
        }
    }

    elapsed.value += TICK_MS
}

function transfer(r: Res, per: number) {
    // 每个请求都逃不掉一次请求-响应的往返延迟；
    // HTTP/1.1 里它们是串行的所以累加，HTTP/2 起是并行的所以只付一次。
    if (!r.started) {
        r.started = true
        r.wait = RTT_MS
    }
    if (r.wait > 0) {
        r.wait -= TICK_MS
        return
    }
    r.loaded = Math.min(SIZE, r.loaded + per)
    if (r.loaded >= SIZE) {
        r.done = true
        r.wait = 0
    }
}

function handleDrop(active: Res[]) {
    const ms = elapsed.value

    if (dropMode.value === 'once' && !droppedOnce && doneCount.value > 2) {
        droppedOnce = true
        injectLoss(active)
        return
    }
    if (dropMode.value === 'repeat' && ms > 0 && Math.floor(ms / 1200) >= dropCount.value && doneCount.value < TOTAL) {
        injectLoss(active)
    }
}

function injectLoss(active: Res[]) {
    if (!active.length) return
    const victim = active[Math.floor(Math.random() * active.length)]
    stalls.value = { ...stalls.value, [victim.id]: RTO_MS }
    dropCount.value += 1
}

// 每 tick 递减重传等待
function decayStalls() {
    const next: Record<number, number> = {}
    let changed = false
    for (const [k, v] of Object.entries(stalls.value)) {
        const left = v - TICK_MS
        if (left > 0) next[Number(k)] = left
        changed = true
    }
    if (changed) stalls.value = next
}

function start() {
    if (running.value) return
    if (doneCount.value === TOTAL) reset()
    running.value = true
    timer = window.setInterval(() => {
        if (!resources.value.filter((r) => !r.done).length) {
            finish()
            return
        }
        decayStalls()
        tick()
    }, TICK_MS)
}

function pause() {
    running.value = false
    if (timer !== null) {
        clearInterval(timer)
        timer = null
    }
}

function finish() {
    pause()
    // HTTP/1.1 一开始要给每条连接付一次 RTT
    record(elapsed.value)
}

function reset() {
    resources.value = makeResources()
    stalls.value = {}
    elapsed.value = 0
    dropCount.value = 0
    droppedOnce = false
}

function resetAll() {
    pause()
    reset()
    scores.value = {
        http1: { none: 0, once: 0, repeat: 0 },
        http2: { none: 0, once: 0, repeat: 0 },
        http3: { none: 0, once: 0, repeat: 0 },
    }
}

type Scores = Record<ModeKey, Record<DropKey, number>>
const scores = ref<Scores>({
    http1: { none: 0, once: 0, repeat: 0 },
    http2: { none: 0, once: 0, repeat: 0 },
    http3: { none: 0, once: 0, repeat: 0 },
})

function record(ms: number) {
    scores.value = {
        ...scores.value,
        [mode.value]: { ...scores.value[mode.value], [dropMode.value]: ms },
    }
}

const scoreRows = computed(() =>
    modes.map((m) => ({
        label: m.label,
        ...scores.value[m.key],
    })),
)

function fmt(ms: number): string {
    return ms ? `${(ms / 1000).toFixed(2)} s` : '—'
}

onBeforeUnmount(() => {
    if (timer !== null) clearInterval(timer)
})

/* ── 版本时间线 ──────────────────────────────────────── */
type Ver = {
    key: string
    name: string
    year: number
    summary: string
    gain: string
    pain: string
    points: string[]
}

const versions: Ver[] = [
    {
        key: '09',
        name: 'HTTP/0.9',
        year: 1991,
        summary: '只有一个 GET，没有请求头也没有响应头，服务端回一段 HTML 就关门。',
        gain: '极简，奠定了请求-响应的基本形态',
        pain: '没有状态码、没有类型协商，一张网页上的图片都拿不下来',
        points: [
            '请求只有一行：GET /index.html',
            '响应体就是 HTML 本身，没有 Content-Type',
            '发完即关：一次 TCP 连接只承载一个请求',
        ],
    },
    {
        key: '10',
        name: 'HTTP/1.0',
        year: 1996,
        summary: '引入了请求头、响应头和状态码，HTTP 才算有了完整的「信封」。',
        gain: '有了 header 协商格式语言编码，有了 status code 表达结果',
        pain: '默认每个请求都新建连接；请求里不带 host，一个 IP 只能挂一个站',
        points: [
            '新增 HEAD / POST 方法',
            '新增 Expires、Last-Modified 等一批头字段',
            '缺点：每次取资源都要重新握手，TCP 开销巨大',
        ],
    },
    {
        key: '11',
        name: 'HTTP/1.1',
        year: 1997,
        summary: '迄今使用最广的一版。长连接、Host 头、管道化，撑起了整个 Web 2.0。',
        gain: 'keep-alive 复用连接；Host 支持虚拟主机；新增 TLS 即 HTTPS',
        pain: '浏览器对同一域名只开 6 条连接，超出的资源必须排队（上面实验里能看到）',
        points: [
            'Connection: keep-alive 默认开启，一次握手可以发多个请求',
            'Host 头让同一 IP 上能托管多个域名',
            '引入 Cache-Control / ETag / If-None-Match 等缓存协商机制',
            '队头阻塞第一层：同一条连接上，前一个响应没回来后一个就得等',
        ],
    },
    {
        key: '2',
        name: 'HTTP/2',
        year: 2015,
        summary: '二进制分帧 + 多路复用 + 头部压缩，一条连接能同时跑几十条 stream。',
        gain: '突破 6 连接限制，网页不再需要雪碧图、域名分片这些土办法',
        pain: '它脚下仍是 TCP：只要丢一个包，所有流都要等重传（队头阻塞第二层）',
        points: [
            '二进制分帧：请求响应被拆成 HEADERS / DATA 帧，交错发出',
            'HPACK 压缩头部，重复的长 header 不再浪费带宽',
            '支持服务端推送（实践中收益有限，多数场景已弃用）',
            '必须走 HTTPS：主流浏览器只支持 ALPN 协商的 h2',
        ],
    },
    {
        key: '3',
        name: 'HTTP/3',
        year: 2018,
        summary: '把传输层换成基于 UDP 的 QUIC，可靠性从「连接」下沉到「流」。',
        gain: '丢包只影响对应的那条流；连接迁移让 WiFi 切 4G 不断线',
        pain: 'UDP 端口被限速/拦截的网络上会退化；服务端与中间设备支持仍在铺',
        points: [
            'QUIC 内置 TLS 1.3，握手 0-RTT 就能发数据',
            '每条 stream 独立做可靠传输与流控，互不阻塞',
            '用 Connection ID 而非四元组标识连接，换网络不断线',
            '缺点：需要开放 UDP 443，部分企业网络与旧中间件会掉回 HTTP/2',
        ],
    },
]

const cur = ref('11')
const curVersion = computed(() => versions.find((v) => v.key === cur.value)!)

/* ── 展示用源码 ─────────────────────────────────────── */
const checkCode = `# ① 浏览器：F12 → Network，右键表头勾选 Protocol，直接看到 h2 / http/1.1 / h3

# ② curl 看协商结果（--alpn 只在支持 http2 的构建里有）
curl -I --http2 https://example.com -v 2>&1 | grep -iE "ALPN|HTTP"

# HTTP/2 会看到：
# * ALPN: offering h2,http/1.1
# * ALPN: server accepted h2

# HTTP/3 需要 curl 支持 HTTP3
curl -I --http3 https://example.com -v 2>&1 | grep -iE "using http3|QUIC"

# ③ 最省事的办法：在页面上直接读 Performance API
performance.getEntriesByType('resource')[0].nextHopProtocol  // "h2" / "http/1.1" / "h3"`

const nginxCode = `# HTTP/2 —— 一行开启，前提是已经有 TLS（浏览器只认 ALPN 协商的 h2）
server {
    listen 443 ssl;
    http2 on;                       # nginx ≥ 1.25.1 用这个；老版本写 listen 443 ssl http2
    ssl_certificate     /path/fullchain.pem;
    ssl_certificate_key /path/privkey.pem;
    # ...
}

# HTTP/3 —— 额外开一个 UDP 端口，并在响应里告诉客户端可以走 h3
server {
    listen 443 quic reuseport;      # QUIC 走 UDP，腾讯云/阿里云安全组记得放行 UDP 443
    listen 443 ssl;
    http2 on;

    add_header Alt-Svc 'h3=":443"; ma=86400' always;   # 关键：让客户端下次尝试 h3
    ssl_protocols TLSv1.3;                             # QUIC 只支持 TLS 1.3
}

# 验证 UDP 443 是否真的放行了
# nc -vz -u your.host 443`
</script>

<style lang="scss" scoped>
.grid-wrap {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    gap: 3px;
    margin: 14px 0 12px;
    padding: 12px;
    border: 1px solid var(--hairline);
    background: var(--app-bg);
}

.cell {
    position: relative;
    height: 18px;
    overflow: hidden;
    border: 1px solid var(--hairline);
    background: var(--surface-muted);

    i {
        position: absolute;
        inset: auto 0 0 0;
        display: block;
        background: color-mix(in srgb, var(--brand) 65%, transparent);
        transition: height 0.05s linear;
    }

    &.is-active {
        border-color: color-mix(in srgb, var(--brand) 45%, transparent);
    }

    &.is-done {
        border-color: color-mix(in srgb, var(--success) 55%, transparent);

        i {
            background: var(--success);
        }
    }

    &.is-stalled {
        border-color: var(--danger);
        background: color-mix(in srgb, var(--danger) 18%, transparent);

        i {
            background: var(--danger);
        }
    }
}

/* HTTP/1.1 下：还没轮到连接的方块画成虚线，一眼看出「在排队」 */
.grid-wrap.is-http1 .cell.is-queued {
    border-style: dashed;
    opacity: 0.45;
}

.conn-note {
    margin-bottom: 12px;
    padding: 10px 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    background: var(--surface-muted);
}

.score-table {
    margin-top: 12px;
    border: 1px solid var(--hairline);

    &__head,
    &__row {
        display: grid;
        grid-template-columns: 1.2fr 1fr 1fr 1fr;
        gap: 1px;
        background: var(--hairline);
    }

    &__head span,
    &__row span {
        padding: 7px 10px;
        font-size: 12px;
        background: var(--surface);
        color: var(--text-secondary);
    }

    &__head span {
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-tertiary);
        background: var(--surface-raised);
    }
}

.ver-detail {
    padding: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.ver-detail__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
}

.ver-detail__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.ver-detail__year {
    font-size: 12px;
    color: var(--text-tertiary);
}

.ver-list {
    margin: 10px 0 0;
    padding-left: 18px;

    li {
        margin-bottom: 4px;
        font-size: 12px;
        line-height: 1.7;
        color: var(--text-secondary);
    }
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}
</style>
