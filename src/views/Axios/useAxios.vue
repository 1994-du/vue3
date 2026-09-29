<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Axios</span>
                    <h2 class="panel__title">它替你做了 fetch 不肯做的那些事</h2>
                </div>
                <span class="panel__meta">拦截器、自动 JSON、取消、进度、统一错误处理</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>fetch</code> 是标准 API，但只提供了最低限度的能力：默认不带 cookie、4xx/5xx 不会 reject、
                    没有超时、没有进度、没有拦截器。Axios 是一个「应用层」的封装，
                    把这些几乎每个项目都要重复写一遍的东西统一掉了。项目里
                    <code>src/api/index.ts</code> 那一层 <em>请求-响应式拦截器</em>，
                    就是这套能力最典型的用法。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">拦截器</span>
                        <span class="point__v">请求前统一塞 token、响应后统一剥壳和提示，业务侧只拿数据</span>
                    </div>
                    <div class="point">
                        <span class="point__k">自动转换</span>
                        <span class="point__v">JSON 自动序列化/反序列化，FormData/URLSearchParams 自动识别</span>
                    </div>
                    <div class="point">
                        <span class="point__k">取消</span>
                        <span class="point__v">AbortController（推荐）与 CancelToken（旧版，已废弃）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">进度</span>
                        <span class="point__v">onUploadProgress / onDownloadProgress，文件上传下载必备</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 沙盘 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">请求沙盘 · 六种真实操作</h2>
                </div>
                <span class="panel__meta">走的是真正的 axios，只是把底层 adapter 换成了本地的</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    下面每一次点击都是<strong>真的在调用 axios</strong>（拦截器、状态码校验
                    <code>validateStatus</code> 等逻辑照常生效），
                    唯一替换的是最底层的 adapter —— 由一个本地延时器冒充网络。
                    这样你能自由地造出慢请求、失败请求、超时和取消，而不必真的去找一个坏接口。
                </p>

                <div class="tool-row">
                    <span class="tool-k">模拟网络延迟</span>
                    <input v-model.number="delay" type="range" min="100" max="4000" step="100" class="cfg__range">
                    <span class="tool-v mono">{{ delay }} ms</span>
                    <button type="button" class="w-btn" :class="forceFail ? 'is-bad-mode' : ''"
                        @click="forceFail = !forceFail">
                        {{ forceFail ? '服务端返回 500' : '服务端正常' }}
                    </button>
                </div>

                <div class="tool-row">
                    <span class="tool-k">发送超时上限</span>
                    <input v-model.number="timeout" type="range" min="200" max="4000" step="100" class="cfg__range">
                    <span class="tool-v mono">{{ timeout }} ms</span>
                    <span class="tool-hint">调到比延迟小，就能造出真实的 timeout</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy" @click="doPlain">① 普通请求</button>
                        <button type="button" class="w-btn" :disabled="busy" @click="doParallel">② 并发 3 个</button>
                        <button type="button" class="w-btn" :disabled="!flying" @click="doAbort">
                            ③ 用 AbortController 取消
                        </button>
                        <button type="button" class="w-btn" :disabled="!flying" @click="doCancelToken">
                            ④ 用 CancelToken 取消
                        </button>
                    </div>
                    <span class="w-hint">
                        {{ flying ? `有 ${flyingCount} 个请求在飞（取消按钮现在可用）` : '取消按钮要在请求还在飞的时候按' }}
                    </span>
                </div>

                <div class="log-list">
                    <div v-for="(l, i) in logs" :key="i" class="log-item"
                        :class="l.bad ? 'is-bad' : l.warn ? 'is-warn' : 'is-ok'">
                        <span class="log-item__idx">{{ String(logs.length - i).padStart(2, '0') }}</span>
                        <span class="log-item__body mono">{{ l.text }}</span>
                        <span class="log-item__note mono">{{ l.ms ? l.ms + ' ms' : '' }}</span>
                    </div>
                    <div v-if="!logs.length" class="log-empty">还没有请求记录</div>
                </div>

                <div v-if="lastBody" class="resp">
                    <span class="kicker">最近一次成功的响应体</span>
                    <pre class="mono">{{ lastBody }}</pre>
                </div>
            </div>
        </section>

        <!-- ③ 下载进度 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">下载进度是真的能读到的</h2>
                </div>
                <span class="panel__meta">用 XHR 拉一个 2MB 的本地资源，逐步读的</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>fetch</code> 拿不到下载进度（得自己流式读 body），而 axios 的
                    <code>onDownloadProgress</code> 底层就是 XHR 的 <code>progress</code> 事件 ——
                    每一次都会告诉你 <em>loaded / total</em>。下面直接用一个真实的 XHR 请求演示这件事，
                    数据是本地生成的 {{ fileMB }}MB，不涉及外网。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="downloading" @click="startDownload">
                            ▶ 开始下载（{{ fileMB }} MB）
                        </button>
                        <button type="button" class="w-btn" :disabled="!downloading" @click="abortDownload">
                            ✕ 中断
                        </button>
                    </div>
                    <span class="w-hint">故意让它跑得慢一点，方便看清每个 progress 事件</span>
                </div>

                <div class="prog">
                    <div class="prog__bar">
                        <i :style="{ width: dlPct + '%' }" :class="dlErr ? 'is-bad' : dlPct >= 100 ? 'is-ok' : ''"></i>
                    </div>
                    <div class="prog__meta">
                        <span class="mono">{{ dlPct }}%</span>
                        <span class="mono">{{ fmtBytes(dlLoaded) }} / {{ fmtBytes(dlTotal) }}</span>
                        <span class="mono">{{ dlSpeed }}</span>
                    </div>
                </div>

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">progress 事件次数</span>
                        <span class="kv__v mono">{{ dlTicks }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">lengthComputable</span>
                        <span class="kv__v mono" :class="dlComputable ? 'is-ok' : 'is-bad'">
                            {{ dlComputable === null ? '—' : String(dlComputable) }}
                        </span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">总耗时</span>
                        <span class="kv__v mono">{{ dlMs ? dlMs + ' ms' : '—' }}</span>
                    </div>
                </div>

                <p class="probe-note">
                    <strong>lengthComputable 是 false 时怎么办？</strong>
                    服务端没给 <code>Content-Length</code>（比如开了 chunked 传输），
                    <code>event.total</code> 就是 0，进度条只能做成不确定态。
                    这也是为什么很多下载接口会特意补上这个响应头。
                    {{ dlComputable === false ? '—— 你刚才那次就是这种情况。' : '' }}
                </p>
            </div>
        </section>

        <!-- ④ 真实接口 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 03</span>
                    <h2 class="panel__title">调一次项目的真实接口</h2>
                </div>
                <span class="panel__meta">走 src/api/index.ts 的完整链路</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    右上这个请求会真正打到后端 <code>POST /users/all</code>，
                    一路经过项目的<strong>请求拦截器</strong>（塞 token、判断过期）和<strong>响应拦截器</strong>
                    （统一剥壳、错误提示）。<em>需要你处于登录态</em>；没登录会看到 401 —— 这本身也是个有效的演示。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="realBusy" @click="callReal">
                            {{ realBusy ? '请求中…' : 'GET /users/all' }}
                        </button>
                    </div>
                    <span class="w-hint">耗时 {{ realMs ? realMs + ' ms' : '—' }}</span>
                </div>

                <div v-if="realBody" class="resp">
                    <span class="kicker">响应内容</span>
                    <pre class="mono">{{ realBody }}</pre>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">这个项目的封装长什么样</h2>
                </div>
                <span class="panel__meta">src/api/index.ts 的核心逻辑</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">拦截器：统一处理 token、loading、错误提示</div>
                    <CodeEditor :code="interceptorCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">取消与重试的写法</div>
                    <CodeEditor :code="cancelCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import axios, {
    AxiosError,
    CanceledError,
    type AxiosAdapter,
    type AxiosRequestConfig,
    type AxiosResponse,
    type Cancel,
    type InternalAxiosRequestConfig,
} from 'axios'
import { computed, ref } from 'vue'
import { getUsers } from '@/api/api'

/* ── 本地 adapter：冒充网络 ───────────────────────────── */
const delay = ref(1200)
const timeout = ref(3000)
const forceFail = ref(false)

// mockDelay 让单次调用可以覆盖默认延迟
type MockConfig = InternalAxiosRequestConfig & { mockDelay?: number }
type MockDelayConfig = AxiosRequestConfig & { mockDelay?: number }

const mockAdapter: AxiosAdapter = (rawConfig) => {
    const config = rawConfig as MockConfig
    const cost = config.mockDelay ?? delay.value
    const willTimeout = typeof config.timeout === 'number' && config.timeout > 0 && config.timeout < cost
    const fireAt = willTimeout ? config.timeout! : cost

    return new Promise<AxiosResponse>((resolve, reject) => {
        let settled = false
        const finish = (fn: () => void) => {
            if (settled) return
            settled = true
            clearTimeout(timer)
            config.signal?.removeEventListener?.('abort', onAbort)
            fn()
        }

        const onAbort = () => finish(() => reject(new CanceledError('request canceled')))

        config.signal?.addEventListener?.('abort', onAbort)

        // CancelToken 也能取消（旧版 API，仅作演示）
        config.cancelToken?.promise.then((reason) =>
            finish(() =>
                reject(new CanceledError(String((reason as Cancel | undefined)?.message ?? 'canceled'))),
            ),
        )

        const timer = window.setTimeout(
            () =>
                finish(() => {
                    if (willTimeout) {
                        reject(
                            new AxiosError(
                                `timeout of ${config.timeout}ms exceeded`,
                                AxiosError.ETIMEDOUT,
                                config as never,
                            ),
                        )
                        return
                    }
                    const status = forceFail.value ? 500 : 200
                    resolve({
                        data: forceFail.value
                            ? { code: 500, msg: '服务端内部错误（沙盘模拟）' }
                            : {
                                  code: 200,
                                  msg: 'success',
                                  data: {
                                      list: [
                                          { id: 1, username: 'admin', role: '超级管理员' },
                                          { id: 2, username: 'editor', role: '编辑' },
                                      ],
                                      total: 2,
                                  },
                              },
                        status,
                        statusText: forceFail.value ? 'Internal Server Error' : 'OK',
                        headers: {},
                        config,
                    } as AxiosResponse)
                }),
            fireAt,
        )
    })
}

const http = axios.create({ adapter: mockAdapter, baseURL: '/api' })

/* ── 沙盘操作 ────────────────────────────────────────── */
type LogRow = { text: string; bad: boolean; warn?: boolean; ms?: number }

const logs = ref<LogRow[]>([])
const busy = ref(false)
const flying = computed(() => flyingCount.value > 0)
const flyingCount = ref(0)
const lastBody = ref('')

let lastController: AbortController | null = null
let lastSource: ReturnType<typeof axios.CancelToken.source> | null = null

function push(text: string, bad = false, warn = false, ms?: number) {
    logs.value = [{ text, bad, warn, ms }, ...logs.value].slice(0, 14)
}

async function doPlain() {
    const c = new AbortController()
    lastController = c
    lastSource = axios.CancelToken.source()

    flyingCount.value += 1
    busy.value = true
    const t0 = performance.now()
    push(`→ POST /users/all  (signal + cancelToken 都已挂上)`)
    try {
        const res = await http.post(
            '/users/all',
            { page: 1, pageSize: 10 },
            { timeout: timeout.value, signal: c.signal, cancelToken: lastSource.token },
        )
        const ms = Math.round(performance.now() - t0)
        lastBody.value = JSON.stringify(res.data, null, 2)
        push(`← 200 OK，data.code = ${res.data.code}`, false, false, ms)
    } catch (e) {
        const ms = Math.round(performance.now() - t0)
        describeError(e, '请求', ms)
    } finally {
        flyingCount.value -= 1
        busy.value = false
    }
}

async function doParallel() {
    busy.value = true
    const t0 = performance.now()
    push(`→ 并发 3 个请求（耗时分别是 400 / 900 / 1600ms）`)
    const jobs = [400, 900, 1600].map((d, i) => {
        const cfg: MockDelayConfig = { timeout: timeout.value, mockDelay: d }
        return http.post(`/resource-${i + 1}`, {}, cfg) as Promise<AxiosResponse>
    })

    // allSettled：想看到每个请求的结局，就不要用 all
    const settled = await Promise.allSettled(jobs)
    settled.forEach((r, i) => {
        if (r.status === 'fulfilled') {
            push(`  [${i + 1}] fulfilled → code=${r.value.data.code}`, false)
        } else {
            describeError(r.reason, `  [${i + 1}]`, undefined)
        }
    })
    push(
        `← 全部结束，耗时 ${Math.round(performance.now() - t0)}ms（并行不是串行相加，取决于最慢的那个）`,
        false,
        false,
        Math.round(performance.now() - t0),
    )
    busy.value = false
}

function doAbort() {
    if (!lastController) return
    lastController.abort()
    push(`▣ 调用了 controller.abort() —— signal 传给 axios，请求立即被打断`, false, true)
    lastController = null
}

function doCancelToken() {
    if (!lastSource) return
    lastSource.cancel('用户主动取消')
    push(`▣ 调用了 cancelToken.cancel() —— 这是旧写法，axios 已推荐改用 AbortController`, false, true)
    lastSource = null
}

function describeError(e: unknown, prefix: string, ms?: number) {
    if (e instanceof CanceledError || axios.isCancel(e)) {
        push(`${prefix} 已被取消：${String((e as Error).message)}`, false, true, ms)
        return
    }
    const ax = e as AxiosError<{ msg?: string }>
    if (ax.code === AxiosError.ETIMEDOUT) {
        push(`${prefix} 超时：${ax.message}`, true, false, ms)
        return
    }
    if (ax.response) {
        push(
            `${prefix} HTTP ${ax.response.status}：${ax.response.data?.msg ?? ax.message}`,
            true,
            false,
            ms,
        )
        return
    }
    push(`${prefix} 失败：${(e as Error).message}`, true, false, ms)
}

/* ── 下载进度 ────────────────────────────────────────── */
const fileMB = 2
const dlPct = ref(0)
const dlLoaded = ref(0)
const dlTotal = ref(0)
const dlTicks = ref(0)
const dlComputable = ref<boolean | null>(null)
const dlMs = ref(0)
const dlErr = ref(false)
const dlSpeed = ref('—')
const downloading = ref(false)
let xhr: XMLHttpRequest | null = null

function fmtBytes(b: number): string {
    if (!b) return '0 B'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function makeBlobUrl(): string {
    // 造一份真正有体积的数据，让 Content-Length 有值，进度才有意义
    const chunk = 'x'.repeat(1024 * 64) // 64KB 一块
    const parts: string[] = []
    for (let i = 0; i < (fileMB * 1024) / 64; i++) parts.push(chunk)
    const blob = new Blob([parts.join('')], { type: 'application/octet-stream' })
    return URL.createObjectURL(blob)
}

function startDownload() {
    downloading.value = true
    dlErr.value = false
    dlPct.value = 0
    dlLoaded.value = 0
    dlTotal.value = 0
    dlTicks.value = 0
    dlComputable.value = null
    dlMs.value = 0
    dlSpeed.value = '—'

    const url = makeBlobUrl()
    const t0 = performance.now()
    let lastT = t0
    let lastLoaded = 0

    xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'

    xhr.onprogress = (e) => {
        dlTicks.value += 1
        dlComputable.value = e.lengthComputable
        if (e.lengthComputable) {
            dlTotal.value = e.total
            dlLoaded.value = e.loaded
            dlPct.value = Math.round((e.loaded / e.total) * 100)
        } else {
            dlLoaded.value = e.loaded
        }
        const now = performance.now()
        const dt = (now - lastT) / 1000
        if (dt > 0.12) {
            const speed = (e.loaded - lastLoaded) / dt
            dlSpeed.value = `${fmtBytes(Math.round(speed))}/s`
            lastT = now
            lastLoaded = e.loaded
        }
    }

    xhr.onload = () => {
        dlMs.value = Math.round(performance.now() - t0)
        dlPct.value = 100
        downloading.value = false
        URL.revokeObjectURL(url)
        push(`下载完成：${fmtBytes(dlTotal.value || fileMB * 1024 * 1024)}，共触发 ${dlTicks.value} 次 progress`, false)
    }

    xhr.onerror = () => {
        dlErr.value = true
        downloading.value = false
        URL.revokeObjectURL(url)
    }

    xhr.onabort = () => {
        dlErr.value = true
        downloading.value = false
        push(`下载被中断：已收到 ${fmtBytes(dlLoaded.value)}（${dlTicks.value} 次 progress）`, false, true)
        URL.revokeObjectURL(url)
    }

    xhr.send()
}

function abortDownload() {
    xhr?.abort()
}

/* ── 真实接口 ────────────────────────────────────────── */
const realBusy = ref(false)
const realMs = ref(0)
const realBody = ref('')

async function callReal() {
    realBusy.value = true
    realBody.value = ''
    const t0 = performance.now()
    try {
        const res = await getUsers({ page: 1, pageSize: 10 })
        realMs.value = Math.round(performance.now() - t0)
        realBody.value = JSON.stringify(res, null, 2)
    } catch (e) {
        realMs.value = Math.round(performance.now() - t0)
        const ax = e as AxiosError
        realBody.value = JSON.stringify(
            {
                error: ax.message ?? String(e),
                status: ax.response?.status ?? '—',
                note: '未登录时会是 401；项目响应拦截器里会对 401 调用 handleTokenExpire()',
            },
            null,
            2,
        )
    } finally {
        realBusy.value = false
    }
}

/* ── 展示用源码 ─────────────────────────────────────── */
const interceptorCode = `// 本项目 src/api/index.ts（节选）
const Axios = axios.create({ baseURL: '/api', timeout: 300000 })

// ① 请求拦截器：统一塞 token、统一开 loading
Axios.interceptors.request.use(async (config) => {
  const rc = config as ApiRequestConfig
  if (rc.needAuth !== false) {
    if (isTokenExpired()) {
      await handleTokenExpire()               // 过期了直接 reject，不让它打到后端
      return Promise.reject(new ApiError('token已过期', { status: 401 }))
    }
    const token = getToken()
    if (token) config.headers.set('Authorization', \`Bearer \${token}\`)
  }
  if (rc.showLoading) showLoading()
  return config
})

// ② 响应拦截器：统一剥壳 + 统一提示
Axios.interceptors.response.use(
  (response) => {
    if (isUnauthorized(response)) {
      void handleTokenExpire()
      return Promise.reject(new ApiError('token已过期', { status: 401 }))
    }
    const result = response.data
    // 注意这里：HTTP 200 不代表业务成功，真正的成败要看 body 里的 code
    if (result.code !== 200) {
      ElMessage.error(result.msg || '请求失败')
    } else if (shouldShowSuccess) {
      ElMessage.success(result.msg)
    }
    return result          // ← 业务侧拿到的就是这层剥好的数据
  },
  (error) => {
    if (error instanceof ApiError || error.name === 'CanceledError') {
      return Promise.reject(error)            // 自己抛的和主动取消的，别弹统一提示
    }
    if (isUnauthorized(error.response)) void handleTokenExpire()
    else ElMessage.error(error.response?.data?.msg || '请求失败')
    return Promise.reject(error)
  },
)

// 用法：业务侧再也见不到 status / headers，只管数据
// const { data } = await getUsers({ page: 1, pageSize: 10 })`

const cancelCode = `// ── ① AbortController：现在的推荐写法 ──────────────────
const controller = new AbortController()

axios.get('/api/slow', { signal: controller.signal })
  .catch((err) => {
    if (axios.isCancel(err)) console.log('主动取消，不是错误', err.message)
  })

// 组件卸载、路由切换、用户点了取消，都能这样打住
onBeforeUnmount(() => controller.abort())

// Vue 里最常见的用法：搜索框
watch(keyword, (kw) => {
  controller?.abort()                 // 先把上一次没回来的请求打掉
  controller = new AbortController()
  search(kw, controller.signal)       // 只保留最后一次的结果
})

// ── ② CancelToken：还能用，但已废弃 ───────────────────
const source = axios.CancelToken.source()
axios.get('/api/slow', { cancelToken: source.token })
source.cancel('用户主动取消')

// ── ③ 超时是可以单独设的 ─────────────────────────────
axios.get('/api/slow', { timeout: 5000 })
// 超时后 err.code === 'ECONNABORTED'，err.message 形如 "timeout of 5000ms exceeded"

// ── ④ 带退避的重试（axios 没有内置，得自己写一层）──────
async function withRetry<T>(fn: () => Promise<T>, times = 3): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    const ax = e as AxiosError
    const retryable = !ax.response || (ax.response.status >= 500 && ax.response.status < 600)
    if (!retryable || times <= 1) throw e
    await new Promise((r) => setTimeout(r, 400 * (4 - times)))   // 退避：400 / 800 ms
    return withRetry(fn, times - 1)
  }
}
// 注意：只重试幂等请求。POST 下单别乱重试，除非接口做了幂等键`
</script>

<style lang="scss" scoped>
.tool-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 5px 0;
}

.tool-k {
    flex-shrink: 0;
    min-width: 108px;
    font-size: 12px;
    color: var(--text-tertiary);
}

.tool-v {
    min-width: 66px;
    font-size: 12px;
    color: var(--brand);
}

.tool-hint {
    font-size: 11px;
    color: var(--text-tertiary);
}

.cfg__range {
    flex: 1;
    max-width: 300px;
    accent-color: var(--brand);
}

.is-bad-mode {
    color: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 45%, transparent);
}

.log-item__note {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 11px;
    color: var(--text-tertiary);
}

.resp {
    margin-top: 12px;

    pre {
        max-height: 220px;
        margin: 6px 0 0;
        padding: 10px 12px;
        overflow: auto;
        font-size: 11px;
        line-height: 1.6;
        color: var(--text-secondary);
        background: var(--app-bg);
        border: 1px solid var(--hairline);
    }
}

.prog {
    margin-bottom: 12px;
}

.prog__bar {
    height: 10px;
    overflow: hidden;
    background: var(--surface-muted);
    border: 1px solid var(--hairline);

    i {
        display: block;
        height: 100%;
        background: color-mix(in srgb, var(--brand) 70%, transparent);
        transition: width 0.08s linear;

        &.is-ok {
            background: var(--success);
        }

        &.is-bad {
            background: var(--danger);
        }
    }
}

.prog__meta {
    display: flex;
    gap: 18px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--text-tertiary);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}
</style>
