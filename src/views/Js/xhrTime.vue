<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">RTT Probe</span>
                    <h2 class="panel__title">在最短时间内找出响应最快的 IP</h2>
                </div>
                <span class="panel__meta">限制并发 + 用「当前最优」当超时线</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    逐个探测太慢，全部并发又会把带宽打满。折中办法是<em>限并发批次</em>：
                    先跑一批拿到一个基准 <code>minRTT</code>，之后的请求如果
                    <strong>超过这个基准还没回来</strong>，就说明它一定不是最快 —— 直接废弃，
                    把名额让给下一个候选。基准一旦被刷新，超时线跟着收紧。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">并发池</span>
                        <span class="point__v">同时最多 N 个在飞，回来一个补一个</span>
                    </div>
                    <div class="point">
                        <span class="point__k">早停</span>
                        <span class="point__v">耗时超过当前 minRTT 的请求立即取消</span>
                    </div>
                    <div class="point">
                        <span class="point__k">更新</span>
                        <span class="point__v">有更快的就把 minRTT 拉低，超时线随之收紧</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ nodes.length }} 个候选 IP 正在排队</h2>
                </div>
                <span class="panel__meta">格子颜色代表它此刻的状态</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">候选数</span>
                    <div class="w-btns">
                        <button
                            v-for="n in COUNTS"
                            :key="n"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': count === n }"
                            :disabled="running"
                            @click="count = n">
                            {{ n }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <span class="w-label">并发上限</span>
                    <div class="w-btns">
                        <button
                            v-for="n in LIMITS"
                            :key="n"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': limit === n }"
                            :disabled="running"
                            @click="limit = n">
                            {{ n }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="{ 'is-active': running }" @click="start">
                            {{ running ? '探测中……' : '开始探测' }}
                        </button>
                        <button type="button" class="w-btn" :disabled="running" @click="shuffle">
                            重新生成延迟
                        </button>
                    </div>
                    <span class="w-hint">延迟是随机生成的，没法作弊</span>
                </div>

                <!-- 实时指标 -->
                <div class="stat-grid rtt-stats">
                    <div class="stat">
                        <span class="stat__label">当前最优 RTT</span>
                        <span class="stat__value is-brand">{{ bestMs === null ? '—' : bestMs + ' ms' }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">最优 IP</span>
                        <span class="stat__value">{{ bestIp ?? '—' }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">成功 / 废弃</span>
                        <span class="stat__value">{{ okCount }} / {{ dropCount }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">总耗时</span>
                        <span class="stat__value">{{ elapsedMs }} ms</span>
                    </div>
                </div>

                <!-- IP 网格 -->
                <div class="grid">
                    <div
                        v-for="n in nodes"
                        :key="n.ip"
                        class="cell"
                        :class="[`is-${n.state}`, { 'is-best': bestIp === n.ip }]">
                        <span class="cell__ip mono">{{ n.ip }}</span>
                        <span class="cell__val mono">{{ cellValue(n) }}</span>
                    </div>
                </div>

                <div class="legend">
                    <span class="legend__item"><i class="sw is-idle"></i>排队中</span>
                    <span class="legend__item"><i class="sw is-flying"></i>探测中</span>
                    <span class="legend__item"><i class="sw is-ok"></i>已响应</span>
                    <span class="legend__item"><i class="sw is-dropped"></i>超时废弃</span>
                    <span class="legend__item"><i class="sw is-best"></i>最终当选</span>
                </div>

                <p v-if="result" class="result-line">
                    结论：在 <strong>{{ result.totalMs }} ms</strong> 内从
                    <strong>{{ count }}</strong> 个 IP 中选出
                    <code class="mono">{{ result.ip }}</code>（RTT {{ result.ms }} ms），
                    期间废弃了 {{ dropCount }} 个注定不会更快的请求。
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实现这套策略</h2>
                </div>
                <span class="panel__meta">上面那个网格就是这套逻辑在跑</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">带早停的并发探测</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">真实场景怎么做（XHR / fetch）</div>
                    <CodeEditor :code="realCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type State = 'idle' | 'flying' | 'ok' | 'dropped'
type Node = {
    ip: string
    latency: number
    state: State
    rtt: number | null
    startedAt: number | null
    elapsed: number
}

const COUNTS = [12, 24, 48] as const
const LIMITS = [3, 5, 10] as const

const count = ref<number>(24)
const limit = ref<number>(10)
const nodes = ref<Node[]>([])
const running = ref(false)
const elapsedMs = ref(0)
const bestMs = ref<number | null>(null)
const bestIp = ref<string | null>(null)
const result = ref<{ ip: string; ms: number; totalMs: number } | null>(null)

const okCount = computed(() => nodes.value.filter((n) => n.state === 'ok').length)
const dropCount = computed(() => nodes.value.filter((n) => n.state === 'dropped').length)

function makeNodes() {
    const list: Node[] = []
    for (let i = 0; i < count.value; i++) {
        list.push({
            ip: `10.0.${Math.floor(i / 8)}.${(i % 8) + 2}`,
            latency: Math.round(60 + Math.random() * 900),
            state: 'idle',
            rtt: null,
            startedAt: null,
            elapsed: 0,
        })
    }
    nodes.value = list
}

makeNodes()

watch([count, limit], () => {
    makeNodes()
    resetRun()
})

function shuffle() {
    makeNodes()
    resetRun()
}

function resetRun() {
    running.value = false
    elapsedMs.value = 0
    bestMs.value = null
    bestIp.value = null
    result.value = null
    stopTicker()
}

function cellValue(n: Node) {
    switch (n.state) {
        case 'idle':
            return '排队'
        case 'flying':
            return `${n.elapsed} ms`
        case 'ok':
            return `${n.rtt} ms`
        case 'dropped':
            return '已废弃'
        default:
            return '—'
    }
}

let ticker: ReturnType<typeof setInterval> | null = null

function startTicker(t0: number) {
    stopTicker()
    ticker = setInterval(() => {
        elapsedMs.value = Math.round(performance.now() - t0)
        const now = performance.now()
        nodes.value.forEach((n) => {
            if (n.state === 'flying' && n.startedAt !== null) {
                n.elapsed = Math.round(now - n.startedAt)
            }
        })
        nodes.value = [...nodes.value]
    }, 60)
}

function stopTicker() {
    if (ticker) {
        clearInterval(ticker)
        ticker = null
    }
}

async function start() {
    resetRun()
    running.value = true
    const t0 = performance.now()
    startTicker(t0)

    let cursor = 0

    // 探测单个 IP：超过 best 就自行放弃
    const probe = (node: Node) =>
        new Promise<void>((resolve) => {
            node.state = 'flying'
            node.startedAt = performance.now()
            nodes.value = [...nodes.value]

            let settleTimer: ReturnType<typeof setTimeout> | null = null
            let watchdog: ReturnType<typeof setInterval> | null = null

            const finish = (state: State, rtt: number | null) => {
                if (settleTimer) clearTimeout(settleTimer)
                if (watchdog) clearInterval(watchdog)
                if (node.state === 'flying') {
                    node.state = state
                    node.rtt = rtt
                    nodes.value = [...nodes.value]
                }
                resolve()
            }

            settleTimer = setTimeout(() => {
                const rtt = Math.round(performance.now() - (node.startedAt ?? 0))
                if (bestMs.value === null || rtt < bestMs.value) {
                    bestMs.value = rtt // 刷新基准，后面的超时线随之收紧
                    bestIp.value = node.ip
                }
                finish('ok', rtt)
            }, node.latency)

            //  watchdog：一旦比当前最优还慢，就没必要再等了
            watchdog = setInterval(() => {
                if (bestMs.value === null) return
                const spent = performance.now() - (node.startedAt ?? 0)
                if (spent > bestMs.value) finish('dropped', null)
            }, 30)
        })

    async function worker() {
        while (cursor < nodes.value.length) {
            const node = nodes.value[cursor]
            cursor += 1
            await probe(node)
        }
    }

    const workers = Array.from({ length: Math.min(limit.value, nodes.value.length) }, () => worker())
    await Promise.all(workers)

    stopTicker()
    elapsedMs.value = Math.round(performance.now() - t0)
    running.value = false

    if (bestIp.value !== null && bestMs.value !== null) {
        result.value = { ip: bestIp.value, ms: bestMs.value, totalMs: elapsedMs.value }
    }
}

onBeforeUnmount(stopTicker)

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `async function findFastest(ips, limit = 10) {
  let best = { ip: null, ms: Infinity }
  let cursor = 0

  const probe = (ip) => new Promise((resolve) => {
    let done = false
    const finish = () => { if (!done) { done = true; resolve() } }

    const timer = setTimeout(() => {
      const ms = performance.now() - startedAt
      if (ms < best.ms) best = { ip, ms: Math.round(ms) }  // 刷新基准
      finish()
    }, TIMEOUT)

    const watchdog = setInterval(() => {
      // 比当前最优还慢 → 它不可能是答案，直接放弃
      if (performance.now() - startedAt > best.ms) {
        clearTimeout(timer)
        clearInterval(watchdog)
        finish()
      }
    }, 30)

    const startedAt = performance.now()
    ping(ip).then(() => {
      clearTimeout(timer); clearInterval(watchdog)
      const ms = performance.now() - startedAt
      if (ms < best.ms) best = { ip, ms: Math.round(ms) }
      finish()
    })
  })

  // limit 个「工人」并发去领任务，谁空了谁领下一个
  async function worker() {
    while (cursor < ips.length) {
      await probe(ips[cursor++])
    }
  }

  await Promise.all(Array.from({ length: limit }, worker))
  return best
}`

const realCode = `// ① fetch 版：用 AbortController 真的把请求掐掉
async function pingOnce(url, timeoutMs) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  const startedAt = performance.now()

  try {
    // 用 HEAD + no-cors 避免复杂请求和预检
    await fetch(url, { method: 'HEAD', signal: ctrl.signal, mode: 'no-cors' })
    return performance.now() - startedAt
  } finally {
    clearTimeout(timer)
  }
}

// ② XHR 版：老项目常见，还能拿到更细的阶段耗时
const perf = performance.getEntriesByType('resource')[0]
perf.startTime            // 开始请求
perf.responseEnd - perf.startTime   // 整体耗时

// ③ 真正要小心的是 DNS / TCP / TLS
// 同一个 IP 第二次请求会快很多（连接复用），
// 所以探测前最好用 HEAD 预热或显式禁用 keep-alive

// ④ 线上实践建议
// - 先做一次粗探测（并发小一点），拿到基准后再精测 Top N
// - 把结果缓存一段时间，不要每次进页面都打一轮
// - 失败要有兜底：全部失败时退回默认 IP，而不是什么都不做`
</script>

<style scoped>
.rtt-stats {
    margin-bottom: 14px;
}

.is-brand {
    color: var(--brand);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: 6px;
    margin-bottom: 12px;
}

.cell {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 9px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    transition: border-color 0.15s, background 0.15s;
}

.cell__ip {
    font-size: 11px;
    color: var(--text-secondary);
}

.cell__val {
    font-size: 11px;
    color: var(--text-tertiary);
}

.cell.is-idle {
    opacity: 0.55;
}

.cell.is-flying {
    border-color: var(--warning);
}
.cell.is-flying .cell__val {
    color: var(--warning);
}

.cell.is-ok {
    border-color: var(--success);
}
.cell.is-ok .cell__val {
    color: var(--success);
}

.cell.is-dropped {
    border-style: dashed;
    border-color: var(--danger);
}
.cell.is-dropped .cell__ip,
.cell.is-dropped .cell__val {
    color: var(--danger);
    opacity: 0.75;
}

.cell.is-best {
    background: var(--brand-soft);
    border-color: var(--brand);
}
.cell.is-best .cell__ip,
.cell.is-best .cell__val {
    color: var(--brand);
}

.legend {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.legend__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.sw {
    width: 10px;
    height: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}
.sw.is-flying {
    border-color: var(--warning);
}
.sw.is-ok {
    border-color: var(--success);
}
.sw.is-dropped {
    border-style: dashed;
    border-color: var(--danger);
}
.sw.is-best {
    border-color: var(--brand);
    background: var(--brand-soft);
}

.result-line {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    padding-left: 10px;
}
.result-line code {
    font-family: var(--font-mono);
    color: var(--brand);
}
</style>
