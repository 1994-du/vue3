<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">customRef</span>
                    <h2 class="panel__title">自己说了算的 ref</h2>
                </div>
                <span class="panel__meta">get 里 track，set 里 trigger——时机随你定</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    普通的 <code>ref</code> 读写是固定的：读就收集依赖、写就立刻通知。
                    <code>customRef</code> 把这两个动作交到你手上——工厂函数给你一对
                    <code>track()</code> 和 <code>trigger()</code>，
                    <em>什么时候收集、什么时候通知，全由你决定</em>。
                    最经典的用法就是防抖 ref：写完不急着通知，等你不输了再一次性刷新。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">track</span>
                        <span class="point__v">在 get 里调用，告诉 Vue「这次渲染依赖了这个值」</span>
                    </div>
                    <div class="point">
                        <span class="point__k">trigger</span>
                        <span class="point__v">在想要刷新的时候调用，时机完全自主</span>
                    </div>
                    <div class="point">
                        <span class="point__k">典型用途</span>
                        <span class="point__v">防抖 / 节流、同步 localStorage、埋点计数</span>
                    </div>
                    <div class="point">
                        <span class="point__k">注意</span>
                        <span class="point__v">别忘了清理定时器，组件卸载时容易留下野任务</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：防抖 ref 对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">同一个输入框，两条路</h2>
                </div>
                <span class="panel__meta">普通 ref 改一次刷一次，防抖 ref 攒够了再刷</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">延迟</span>
                    <div class="w-btns">
                        <button v-for="ms in delays" :key="ms" type="button" class="w-btn"
                            :class="{ 'is-active': delay === ms }" @click="delay = ms">
                            {{ ms }}ms
                        </button>
                    </div>
                    <span class="w-hint">在下面输入框里连续敲字，观察两边的刷新次数和延迟</span>
                </div>

                <div class="input-row">
                    <label class="input-row__label" for="cr-input">输入框</label>
                    <input id="cr-input" v-model="raw" class="text-input mono" type="text"
                        placeholder="随便敲点什么…" autocomplete="off" />
                    <span class="input-row__meta mono">已敲 {{ raw.length }} 个字符</span>
                </div>

                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">普通 ref</h3>
                            <span class="card__tag is-bad">次次都渲染</span>
                        </div>
                        <p class="card__desc">
                            每敲一个字符立刻 <code>trigger</code>。
                            如果这个值是拿去发请求或重算大列表，代价很实在。
                        </p>
                        <div class="readout">{{ plain }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">刷新次数</span>
                                <span class="kv__v is-bad">{{ plainCount }}</span></div>
                            <div class="kv"><span class="kv__k">内容长度</span>
                                <span class="kv__v">{{ plain.length }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">customRef 防抖版</h3>
                            <span class="card__tag is-good">停手才刷新</span>
                        </div>
                        <p class="card__desc">
                            <code>set</code> 里只做一件事：清掉上一个定时器、排一个新的。
                            {{ delay }}ms 内没新输入，才真正 <code>trigger</code>。
                        </p>
                        <div class="readout">{{ debounced }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">刷新次数</span>
                                <span class="kv__v is-ok">{{ debounceCount }}</span></div>
                            <div class="kv"><span class="kv__k">内容长度</span>
                                <span class="kv__v">{{ debounced.length }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">省下来的渲染</h3>
                            <span class="card__tag">实时统计</span>
                        </div>
                        <p class="card__desc">
                            两者相减就是被合并掉的那些中间状态——
                            输入越快越多，这个数字涨得越猛。
                        </p>
                        <div class="readout is-brand">{{ saved }}</div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">压缩比</span>
                                <span class="kv__v is-ok">{{ ratio }}</span></div>
                            <div class="kv"><span class="kv__k">待处理的输入</span>
                                <span class="kv__v" :class="pending ? 'is-warn' : 'is-ok'">
                                    {{ pending ? '定时器在排队' : '空闲' }}
                                </span></div>
                        </div>
                    </article>
                </div>

                <div class="log-block">
                    <div class="code-block__label">刷新时间线（最新在上）</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 在输入框里连续敲字试试</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：副作用型 ref -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">顺手 driver 个持久化和历史栈</h2>
                </div>
                <span class="panel__meta">set 里不止能排定时器</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">同步进内存「 Storage 」</h3>
                            <span class="card__tag">写入即持久化</span>
                        </div>
                        <p class="card__desc">
                            <code>set</code> 里除了 <code>trigger</code>，
                            顺手把值写进一个模拟的存储对象——这就是
                            <code>useStorage</code> 那类 hook 的雏形。
                        </p>
                        <div class="w-btns" style="margin-bottom: 10px">
                            <button type="button" class="w-btn" @click="stored += 1">值 +1</button>
                            <button type="button" class="w-btn" @click="stored -= 1">值 -1</button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前值</span>
                                <span class="kv__v">{{ stored }}</span></div>
                            <div class="kv"><span class="kv__k">存储里</span>
                                <span class="kv__v is-ok">{{ fakeStorage.value }}</span></div>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">只读式：带历史栈</h3>
                            <span class="card__tag">每次写入留痕</span>
                        </div>
                        <p class="card__desc">
                            同一个 customRef 也可以做节流 HISTORY、校验、甚至拒绝某些值——
                            <strong>拦截点就在那个 set 里</strong>。
                        </p>
                        <div class="w-btns" style="margin-bottom: 10px">
                            <button type="button" class="w-btn" @click="hist = Math.floor(Math.random() * 90) + 10">
                                写入一个随机数
                            </button>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">当前值</span>
                                <span class="kv__v">{{ hist }}</span></div>
                            <div class="kv"><span class="kv__k">写入次数</span>
                                <span class="kv__v is-ok">{{ history.length }}</span></div>
                        </div>
                        <div class="hist-strip">
                            <span v-for="(h, i) in history" :key="i" class="hist-chip mono">{{ h }}</span>
                            <span v-if="!history.length" class="log-empty">// 还没有写入</span>
                        </div>
                    </article>
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
                    <div class="code-block__label">防抖 ref · 项目里的 @/utils/useCustomRef</div>
                    <CodeEditor :code="debounceCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">持久化 ref · set 里做副作用</div>
                    <CodeEditor :code="storageCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, customRef, ref, watch } from 'vue'

/* ── 一个带计时能力的 customRef ─────────────────────── */
function useTrackedRef<T>(initial: T, delayMs: () => number, label: string) {
    let value = initial
    let timer: ReturnType<typeof setTimeout> | null = null

    const r = customRef<T>((track, trigger) => ({
        get() {
            track() // 收集依赖：谁读了我，将来就要被我通知
            return value
        },
        set(next: T) {
            if (timer) clearTimeout(timer)
            onFlushStart(label)
            timer = setTimeout(() => {
                value = next
                timer = null
                onFlushed(label, String(next))
                trigger() // 到这里才通知
            }, delayMs())
        },
    }))

    return r
}

/* ── 实验一 ─────────────────────────────────────────── */
const delays = [200, 600, 1500] as const
const delay = ref<number>(600)

type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 40)
}

const pending = ref(false)

function onFlushStart(label: string) {
    if (label !== 'debounced') return
    pending.value = true
}

function onFlushed(label: string, value: string) {
    const at = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    const len = value.length
    if (label === 'plain') {
        plainCount.value += 1
        push(`渲染第 ${plainCount.value} 次，收到 "${value.slice(-8)}"（${len} 字）`, 'ref', 'is-bad')
    } else {
        pending.value = false
        debounceCount.value += 1
        push(`第 ${debounceCount.value} 次延迟触发，内容 "${value.slice(-8)}"（${len} 字）`, `+${delay.value}ms`, 'is-ok')
    }
    void at
}

const plainCount = ref(0)
const debounceCount = ref(0)

const raw = ref('')

const plain = useTrackedRef<string>('', () => 0, 'plain')
const debounced = useTrackedRef<string>('', () => delay.value, 'debounced')

watch(raw, (v) => {
    plain.value = v
    debounced.value = v
    if (!v) {
        plainCount.value = 0
        debounceCount.value = 0
        logs.value = []
        seq = 0
    }
})

const saved = computed(() => Math.max(plainCount.value - debounceCount.value, 0))
const ratio = computed(() => {
    if (!plainCount.value) return '—'
    return `${Math.round((debounceCount.value / plainCount.value) * 100)}%`
})

/* ── 实验二：带副作用的 ref ─────────────────────────── */
const fakeStorage = ref<{ value: number }>({ value: 0 })

function useStoredRef(initial: number) {
    let value = initial
    return customRef<number>((track, trigger) => ({
        get() {
            track()
            return value
        },
        set(next: number) {
            value = next
            fakeStorage.value = { value: next } // 顺手写的副作用
            trigger()
        },
    }))
}

const stored = useStoredRef(0)

// 拦截点：每次写入都记一笔历史
const history = ref<number[]>([])

function useHistoryRef(initial: number) {
    let value = initial
    return customRef<number>((track, trigger) => ({
        get() {
            track()
            return value
        },
        set(next: number) {
            value = next
            history.value = [...history.value, next].slice(-12)
            trigger()
        },
    }))
}

const hist = useHistoryRef(0)

/* ── 展示用源码 ─────────────────────────────────────── */
const debounceCode = `import { customRef } from 'vue'

export function useDebouncedRef<T>(value: T, delay: number = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return customRef<T>((track, trigger) => ({
    get() {
      track()               // ① 收集依赖，和普通 ref 一样
      return value
    },
    set(newValue: T) {
      if (timer) clearTimeout(timer)   // ② 取消上一次排的任务
      timer = setTimeout(() => {
        value = newValue
        timer = null
        trigger()           // ③ 到这里才通知视图
      }, delay)
    },
  }))
}

// 用法：只是把它当成 ref 用而已
const keyword = useDebouncedRef('', 500)
watch(keyword, (kw) => search(kw))   // 用户停手 500ms 后才真的去查`

const storageCode = `// set 里除了 trigger，还能做任意副作用
function useStoredRef(initial: number) {
  let value = initial

  return customRef<number>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(next: number) {
      value = next
      localStorage.setItem('k', String(next))  // 顺手写盘
      trigger()
    },
  }))
}

// 同样的骨架，把 set 换成节流、校验、拒绝非法值……
// 都只是「什么时候 trigger、要不要 trigger」的区别。
// ⚠️ 记得在组件卸载时清掉定时器，否则会有延迟任务打在已经销毁的组件上`
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
    font-size: 13px;
    color: var(--text-primary);
    background: var(--surface-subtle);
    border: 1px solid var(--hairline);
    outline: none;
    transition: border-color 0.15s;
}

.text-input:focus {
    border-color: var(--brand);
}

.input-row__meta {
    flex: none;
    font-size: 11px;
    color: var(--text-tertiary);
}

.readout {
    font-family: var(--font-mono);
    font-size: 22px;
    line-height: 1.2;
    color: var(--text-primary);
    padding: 6px 0 12px;
    word-break: break-all;
    min-height: 34px;
}

.readout.is-brand {
    font-size: 26px;
    color: var(--brand);
    font-variant-numeric: tabular-nums;
}

.kv-grid {
    margin-top: 10px;
}

.hist-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
}

.hist-chip {
    padding: 2px 7px;
    font-size: 11px;
    color: var(--text-secondary);
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.log-block {
    margin-top: 14px;
}
</style>
