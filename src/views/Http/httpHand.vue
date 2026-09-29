<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">TCP Handshake</span>
                    <h2 class="panel__title">在说话之前，先确认彼此都在</h2>
                </div>
                <span class="panel__meta">三次握手建立连接，四次挥手断开连接</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    TCP 是<em>面向连接</em>的：真正传数据之前，双方得先把彼此的<strong>初始序列号</strong>
                    交换清楚。网络是不可靠的——包可能丢、可能重、可能迟到很久才到。
                    握手的目的不是「打招呼」，而是让双方各自确认
                    <code>对方的序号我知道了，而且对方也知道我的了</code>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">SYN</span>
                        <span class="point__v">同步序列编号，「发起连接，并带上我的初始序号」</span>
                    </div>
                    <div class="point">
                        <span class="point__k">ACK</span>
                        <span class="point__v">确认字符，含义是「你发的我都收到了，下一个请从这个号开始」</span>
                    </div>
                    <div class="point">
                        <span class="point__k">FIN</span>
                        <span class="point__v">结束标记，「我这边没数据要发了」（但还能收）</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 三次握手推演 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">三次握手 · 逐帧推演</h2>
                </div>
                <span class="panel__meta">序号每次重置都会重新随机，和真实抓包一样</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="prevHand" :disabled="hStep <= 0">
                            ← 上一步
                        </button>
                        <button type="button" class="w-btn" @click="nextHand" :disabled="hDone">
                            下一步 →
                        </button>
                        <button type="button" class="w-btn" :class="playing ? 'is-active' : ''" @click="togglePlay">
                            {{ playing ? '暂停播放' : '自动播放' }}
                        </button>
                        <button type="button" class="w-btn" @click="resetHand">重置</button>
                    </div>
                    <span class="w-hint">第 {{ hStep }} / {{ handSteps.length }} 步</span>
                </div>

                <div class="lane-wrap">
                    <div class="lane-head">
                        <div class="lane-side">
                            <span class="lane-name">Client</span>
                            <span class="lane-state" :class="stateClass(hClient)">{{ hClient }}</span>
                        </div>
                        <div class="lane-side lane-side--right">
                            <span class="lane-state" :class="stateClass(hServer)">{{ hServer }}</span>
                            <span class="lane-name">Server</span>
                        </div>
                    </div>

                    <div class="lane-body">
                        <div v-for="(s, i) in handSteps" :key="'h' + i" class="msg-row"
                            :class="[s.from, { 'is-done': i < hStep, 'is-current': i === hStep - 1 }]">
                            <div class="msg">
                                <span class="msg__flags">{{ s.flags }}</span>
                                <span class="msg__detail mono">{{ s.detail }}</span>
                                <span class="msg__note">{{ s.note }}</span>
                            </div>
                            <span class="msg__arrow">{{ s.from === 'client' ? '──▶' : '◀──' }}</span>
                        </div>
                        <div v-if="hStep === 0" class="lane-empty">点「下一步」开始推演</div>
                    </div>
                </div>

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">Client ISN (x)</span>
                        <span class="kv__v mono">{{ x }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">Server ISN (y)</span>
                        <span class="kv__v mono">{{ y }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">第三次包的载荷</span>
                        <span class="kv__v" :class="hStep >= 3 ? 'is-ok' : ''">
                            {{ hStep >= 3 ? '可以顺带塞数据了（HTTP 请求紧随其后）' : '还不能发数据' }}
                        </span>
                    </div>
                </div>

                <p class="probe-note">
                    注意 <code>ack</code> 的含义：它不是「我收到了第 N 号包」，而是
                    <strong>「N 号及以前的字节我都收到了，下一个请从 N 开始」</strong>。
                    所以 SYN/FIN 虽然不带数据，也要占掉一个序号 —— 这就是为什么第一二次握手的确认号是 +1。
                </p>
            </div>
        </section>

        <!-- ③ 为什么不能是两次 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">如果只有两次握手会怎样</h2>
                </div>
                <span class="panel__meta">迟到的旧 SYN 是这个问题的关键</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    网络里有个经典场景：客户端发了一个 SYN，迟迟没收到回复，于是超时重发了一个<b>新的</b> SYN。
                    结果那个<em>旧的 SYN 兜了很久才到达服务端</em>。这时候：
                </p>

                <div class="cards">
                    <article class="card" :class="twoWay ? 'is-dim' : ''">
                        <div class="card__head">
                            <h3 class="card__title">三次握手</h3>
                            <span class="card__tag is-good">正确</span>
                        </div>
                        <p class="card__desc">
                            服务端回 SYN-ACK 后还必须等客户端的第三次 ACK 才算建立。
                            客户端发现「你这 ack 对我这次的 seq 对不上」，直接回 <code>RST</code> 把它顶掉。
                        </p>
                        <div class="res-row">
                            <span class="res-k">幽灵连接</span>
                            <span class="res-v is-ok">0 条</span>
                        </div>
                    </article>
                    <article class="card" :class="twoWay ? '' : 'is-dim'">
                        <div class="card__head">
                            <h3 class="card__title">两次握手</h3>
                            <span class="card__tag is-bad">错误</span>
                        </div>
                        <p class="card__desc">
                            服务端「收到 SYN 就建立」。旧 SYN 一来，它就白开了一条连接并一直等着，
                            客户端根本不知道这回事 —— 资源被空占，直到超时。
                        </p>
                        <div class="res-row">
                            <span class="res-k">幽灵连接</span>
                            <span class="res-v is-bad">{{ ghosts }} 条</span>
                        </div>
                    </article>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="twoWay ? '' : 'is-active'"
                            @click="twoWay = false">用三次握手</button>
                        <button type="button" class="w-btn" :class="twoWay ? 'is-active' : ''"
                            @click="twoWay = true">改用两次握手</button>
                        <button type="button" class="w-btn" @click="sendGhost">注入一个迟到的旧 SYN</button>
                        <button type="button" class="w-btn" @click="ghosts = 0; ghostLog = []">清零</button>
                    </div>
                    <span class="w-hint">切换模式后再注入，对比两种握手的后果</span>
                </div>

                <div class="log-list">
                    <div v-for="(l, i) in ghostLog" :key="i" class="log-item" :class="l.bad ? 'is-bad' : 'is-ok'">
                        <span class="log-item__idx">{{ String(i + 1).padStart(2, '0') }}</span>
                        <span class="log-item__body mono">{{ l.text }}</span>
                    </div>
                    <div v-if="!ghostLog.length" class="log-empty">还没有注入记录</div>
                </div>
            </div>
        </section>

        <!-- ④ 四次挥手推演 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 03</span>
                    <h2 class="panel__title">四次挥手 · 逐帧推演</h2>
                </div>
                <span class="panel__meta">重点看两端的「半关闭」与最后的 TIME_WAIT</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="prevWave" :disabled="wStep <= 0">
                            ← 上一步
                        </button>
                        <button type="button" class="w-btn" @click="nextWave" :disabled="wStep >= waveSteps.length">
                            下一步 →
                        </button>
                        <button type="button" class="w-btn" @click="resetWave">重置</button>
                    </div>
                    <span class="w-hint">第 {{ wStep }} / {{ waveSteps.length }} 步</span>
                </div>

                <div class="lane-wrap">
                    <div class="lane-head">
                        <div class="lane-side">
                            <span class="lane-name">Client（主动关闭方）</span>
                            <span class="lane-state" :class="stateClass(wClient)">{{ wClient }}</span>
                        </div>
                        <div class="lane-side lane-side--right">
                            <span class="lane-state" :class="stateClass(wServer)">{{ wServer }}</span>
                            <span class="lane-name">Server（被动关闭方）</span>
                        </div>
                    </div>
                    <div class="lane-body">
                        <div v-for="(s, i) in waveSteps" :key="'w' + i" class="msg-row"
                            :class="[s.from, { 'is-done': i < wStep, 'is-current': i === wStep - 1 }]">
                            <div class="msg">
                                <span class="msg__flags">{{ s.flags }}</span>
                                <span class="msg__detail mono">{{ s.detail }}</span>
                                <span class="msg__note">{{ s.note }}</span>
                            </div>
                            <span class="msg__arrow">{{ s.from === 'client' ? '──▶' : '◀──' }}</span>
                        </div>
                        <div v-if="wStep === 0" class="lane-empty">点「下一步」开始挥手</div>
                    </div>
                </div>

                <div v-if="wStep >= 4" class="timewait">
                    <div class="timewait__head">
                        <span class="kicker">TIME_WAIT · 2MSL</span>
                        <span class="timewait__v mono">{{ remainMs }} ms</span>
                    </div>
                    <div class="timewait__bar">
                        <i :style="{ width: waitPercent + '%' }"></i>
                    </div>
                    <p class="timewait__note">
                        主动关闭方要在这里等 <strong>2 倍 MSL</strong>（一个包在网络里能存活的最长时间）。
                        两个理由：① 保证最后一个 ACK 能到——丢了的话服务端会重发 FIN，这里还能补一次；
                        ② 让本次连接的残余包在网络里消散，避免混进「复用同一四元组」的新连接。
                    </p>
                </div>
            </div>
        </section>

        <!-- ⑤ 对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Summary</span>
                    <h2 class="panel__title">三个常被追问的问题</h2>
                </div>
                <span class="panel__meta">高频考点，也是上面演示想说清的事</span>
            </div>
            <div class="panel__body">
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">为什么握手三次，不是两次</span>
                        <span class="point__v">
                            两次无法确认「服务端的序列号被客户端收到了」。更致命的是：迟到的旧 SYN
                            会让服务端凭空建立连接 —— 实验 02 已经复现了这个过程。
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">为什么握手三次，挥手却四次</span>
                        <span class="point__v">
                            握手时服务端的 SYN 和 ACK 可以合成一个包；挥手时被关闭方往往还有数据没发完，
                            只能先回 ACK、发完了再单独发 FIN，于是 ACK 与 FIN 被拆成了两次。
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">TIME_WAIT 的代价</span>
                        <span class="point__v">
                            它占着这个四元组 2MSL。短时间内大量短连接由本机主动关闭，
                            会堆起成千上万个 TIME_WAIT —— 这是开销，也是它换来的可靠性。
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ⑥ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">怎么亲眼看到这些包</h2>
                </div>
                <span class="panel__meta">浏览器里看不见握手，得下到底层</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">抓包 · 一眼看到三次握手与四次挥手</div>
                    <CodeEditor :code="capCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">后端 · 连接状态与 TIME_WAIT 堆积怎么查</div>
                    <CodeEditor :code="sysCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/* ── 随机数：模拟真实的初始序列号 ─────────────────────── */
function isn(): number {
    return Math.floor(Math.random() * 4_000_000_000) + 1_000_000
}

type Step = {
    from: 'client' | 'server'
    flags: string
    detail: string
    note: string
    client: string
    server: string
}

/* ── 实验一：三次握手 ─────────────────────────────────── */
const x = ref(isn())
const y = ref(isn())

const handSteps = computed<Step[]>(() => [
    {
        from: 'client',
        flags: 'SYN',
        detail: `seq = ${x.value}`,
        note: '我打算连你，我的起始序号是这个',
        client: 'SYN-SENT',
        server: 'LISTEN',
    },
    {
        from: 'server',
        flags: 'SYN + ACK',
        detail: `seq = ${y.value}   ack = ${x.value + 1}`,
        note: '收到；我这边也要发起，我的序号是这个',
        client: 'SYN-SENT',
        server: 'SYN-RCVD',
    },
    {
        from: 'client',
        flags: 'ACK',
        detail: `seq = ${x.value + 1}   ack = ${y.value + 1}`,
        note: '你的序号我也记住了 —— 双向确认完成',
        client: 'ESTABLISHED',
        server: 'ESTABLISHED',
    },
])

const hStep = ref(0)
const hDone = computed(() => hStep.value >= handSteps.value.length)
const hClient = computed(() => (hStep.value === 0 ? 'CLOSED' : handSteps.value[hStep.value - 1].client))
const hServer = computed(() => (hStep.value === 0 ? 'LISTEN' : handSteps.value[hStep.value - 1].server))

function nextHand() {
    if (hStep.value < handSteps.value.length) hStep.value += 1
}
function prevHand() {
    if (hStep.value > 0) hStep.value -= 1
}
function resetHand() {
    stopPlay()
    hStep.value = 0
    x.value = isn()
    y.value = isn()
}

const playing = ref(false)
let playTimer: number | null = null

function stopPlay() {
    playing.value = false
    if (playTimer !== null) {
        clearInterval(playTimer)
        playTimer = null
    }
}

function togglePlay() {
    if (playing.value) {
        stopPlay()
        return
    }
    if (hStep.value >= handSteps.value.length) hStep.value = 0
    playing.value = true
    playTimer = window.setInterval(() => {
        if (hStep.value >= handSteps.value.length) {
            stopPlay()
            return
        }
        hStep.value += 1
    }, 900)
}

/* ── 实验二：迟到 SYN 造成的幽灵连接 ──────────────────── */
const twoWay = ref(false)
const ghosts = ref(0)
const ghostLog = ref<{ text: string; bad: boolean }[]>([])

function sendGhost() {
    const stale = isn()
    if (!twoWay.value) {
        ghostLog.value = [
            ...ghostLog.value,
            { text: `旧 SYN(seq=${stale}) 抵达服务端`, bad: false },
            { text: `服务端回 SYN-ACK(ack=${stale + 1})`, bad: false },
            { text: '客户端校验 ack ≠ 本次 seq+1 → 回 RST', bad: false },
            { text: '服务端收到 RST，连接不成立，资源回收', bad: false },
        ]
        return
    }
    ghosts.value += 1
    ghostLog.value = [
        ...ghostLog.value,
        { text: `旧 SYN(seq=${stale}) 抵达服务端`, bad: true },
        { text: '服务端「收到 SYN 即建立」→ ESTABLISHED', bad: true },
        { text: '客户端并不知情，不会发数据也不会关它', bad: true },
        { text: `幽灵连接 +1（当前累积 ${ghosts.value} 条）`, bad: true },
    ]
}

/* ── 实验三：四次挥手 ─────────────────────────────────── */
const u = isn()
const v = isn()
const w = v + 5000

const waveSteps: Step[] = [
    {
        from: 'client',
        flags: 'FIN + ACK',
        detail: `seq = ${u}   ack = ${v}`,
        note: '我没数据要发了（但我还能收）',
        client: 'FIN-WAIT-1',
        server: 'ESTABLISHED',
    },
    {
        from: 'server',
        flags: 'ACK',
        detail: `ack = ${u + 1}`,
        note: '知道了；但我这边还有数据没收完，稍等',
        client: 'FIN-WAIT-2',
        server: 'CLOSE-WAIT',
    },
    {
        from: 'server',
        flags: 'FIN + ACK',
        detail: `seq = ${w}   ack = ${u + 1}`,
        note: '我这边也发完了，可以关了',
        client: 'FIN-WAIT-2',
        server: 'LAST-ACK',
    },
    {
        from: 'client',
        flags: 'ACK',
        detail: `seq = ${u + 1}   ack = ${w + 1}`,
        note: '收到 —— 但不能立刻走，得等 2MSL',
        client: 'TIME-WAIT',
        server: 'CLOSED',
    },
]

const wStep = ref(0)
const wClient = computed(() => (wStep.value === 0 ? 'ESTABLISHED' : waveSteps[wStep.value - 1].client))
const wServer = computed(() => (wStep.value === 0 ? 'ESTABLISHED' : waveSteps[wStep.value - 1].server))

function nextWave() {
    if (wStep.value < waveSteps.length) wStep.value += 1
}
function prevWave() {
    if (wStep.value > 0) wStep.value -= 1
}
function resetWave() {
    wStep.value = 0
    remainMs.value = 2000
}

/* TIME_WAIT 倒计时演示 */
const remainMs = ref(2000)
let waitTimer: number | null = null

watch(wStep, (n) => {
    if (waitTimer !== null) {
        clearInterval(waitTimer)
        waitTimer = null
    }
    remainMs.value = 2000
    if (n < 4) return
    waitTimer = window.setInterval(() => {
        remainMs.value = Math.max(0, remainMs.value - 100)
        if (remainMs.value === 0 && waitTimer !== null) {
            clearInterval(waitTimer)
            waitTimer = null
        }
    }, 100)
})

const waitPercent = computed(() => Math.round((remainMs.value / 2000) * 100))

const liveStates = new Set(['ESTABLISHED'])
function stateClass(s: string): string {
    if (s === 'CLOSED') return 'is-down'
    if (s === 'TIME-WAIT') return 'is-warn'
    if (liveStates.has(s)) return 'is-live'
    return 'is-mid'
}

onBeforeUnmount(() => {
    stopPlay()
    if (waitTimer !== null) clearInterval(waitTimer)
})

/* ── 展示用源码 ──────────────────────────────────────── */
const capCode = `# 终端里抓一次完整的握手 + 挥手（另开一个窗口跑即可）
tcpdump -i any host 106.15.207.57 and port 80 -nn -v

# 你会看到这样的四行，正好对应上面推演的前三步 + 挥手：
# C → S  [S]   seq=3849211001                      # SYN
# S → C  [S.]  seq=2109384002 ack=3849211002       # SYN + ACK
# C → S  [.]   ack=2109384003                      # ACK，握手完成
# C → S  [F.]  seq=3849211002 ack=2109384003       # FIN，开始挥手

# 只看握手 / 挥手包
tcpdump 'tcp[tcpflags] & (tcp-syn|tcp-fin) != 0'`

const sysCode = `# 看这台机器上各状态连接的数量
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c | sort -rn

# ESTABLISHED 很多 → 正常业务连接
# TIME_WAIT  很多 → 本机大量主动关闭短连接（调 API / 健康检查常见）
# CLOSE_WAIT 很多 → ⚠️ 程序泄漏 socket：收到对方 FIN 却没调用 close()

# 相关内核参数（谨慎调整）
sysctl net.ipv4.tcp_tw_reuse        # 允许复用 TIME_WAIT 连接，通常建议开
sysctl net.ipv4.ip_local_port_range # 可用端口范围，TIME_WAIT 堆满时会耗尽`
</script>

<style lang="scss" scoped>
.lane-wrap {
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.lane-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--hairline);
}

.lane-side {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
}

.lane-side--right {
    justify-content: flex-end;
    border-left: 1px dashed var(--hairline);
}

.lane-name {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
}

.lane-state {
    padding: 2px 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    border: 1px solid var(--hairline);
    color: var(--text-secondary);

    &.is-live {
        color: var(--brand);
        border-color: color-mix(in srgb, var(--brand) 50%, transparent);
        background: color-mix(in srgb, var(--brand) 10%, transparent);
    }

    &.is-mid {
        color: var(--warning);
        border-color: color-mix(in srgb, var(--warning) 45%, transparent);
    }

    &.is-warn {
        color: var(--info);
        border-color: color-mix(in srgb, var(--info) 45%, transparent);
    }

    &.is-down {
        color: var(--text-tertiary);
        opacity: 0.7;
    }
}

.lane-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 150px;
    padding: 14px;
}

.msg-row {
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.35;
    transition: opacity var(--transition-fast);

    &.server {
        flex-direction: row-reverse;
    }

    &.is-done {
        opacity: 0.75;
    }

    &.is-current {
        opacity: 1;
    }
}

.msg {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 62%;
    padding: 8px 12px;
    border: 1px solid var(--hairline);
    background: var(--app-bg);
}

.is-current .msg {
    border-color: var(--brand);
    box-shadow: inset 3px 0 0 var(--brand);
}

.msg__flags {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--brand);
}

.msg__detail {
    font-size: 11px;
    color: var(--text-secondary);
}

.msg__note {
    font-size: 12px;
    color: var(--text-tertiary);
}

.msg__arrow {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
}

.lane-empty {
    font-size: 12px;
    color: var(--text-tertiary);
}

.kv-grid {
    margin-top: 12px;
}

.cards .card.is-dim {
    opacity: 0.5;
}

.log-list {
    margin-top: 12px;
}

.timewait {
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--info) 45%, transparent);
    background: color-mix(in srgb, var(--info) 8%, transparent);
}

.timewait__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.timewait__v {
    font-size: 12px;
    color: var(--info);
}

.timewait__bar {
    height: 6px;
    overflow: hidden;
    background: var(--surface-muted);

    i {
        display: block;
        height: 100%;
        background: var(--info);
        transition: width 0.1s linear;
    }
}

.timewait__note {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}
</style>
