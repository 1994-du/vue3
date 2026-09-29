<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Transaction</span>
                    <h2 class="panel__title">IndexedDB 里唯一的「原子性」来源</h2>
                </div>
                <span class="panel__meta">要么全做成，要么一条都不做</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    关系型数据库的事务你熟，IndexedDB 的<em>看起来像但脾气不一样</em>：
                    它没有显式的 commit —— <strong>事务活在当前事件循环里，一旦没有待处理的 request 就自动 commit</strong>。
                    这意味着你把一个 <code>await sleep(100)</code> 混进事务，事务就会在你等待的过程中悄悄结束，
                    等你回头再写，拿到的是 <code>TransactionInactiveError</code>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">readonly</span>
                        <span class="point__v">只读。多个只读事务可以并发跑，互不阻塞</span>
                    </div>
                    <div class="point">
                        <span class="point__k">readwrite</span>
                        <span class="point__v">读写。同一 store 上的写事务会串行化，后来的要排队</span>
                    </div>
                    <div class="point">
                        <span class="point__k">abort()</span>
                        <span class="point__v">主动中止，本事务内已发出的所有写操作全部回滚</span>
                    </div>
                    <div class="point">
                        <span class="point__k">durability</span>
                        <span class="point__v">relaxed（快，掉电可能丢最后几百毫秒）/ strict（慢，确保落盘）/ default</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 中止回滚实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">写一半然后 abort，数据还在吗</h2>
                </div>
                <span class="panel__meta">真实事务，真实回滚</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    下面这个事务会连着写 {{ batch }} 条记录，写到第 {{ Math.min(abortAt, batch) }} 条时调用
                    <code>tx.abort()</code>。跑完看数据表 ——
                    <strong>一条都不会留下</strong>。这就是事务最该被记住的性质。
                </p>

                <div class="cfg">
                    <div class="cfg__row">
                        <span class="cfg__k">本批要写几条</span>
                        <input v-model.number="batch" type="range" min="1" max="10" class="cfg__range">
                        <span class="cfg__v mono">{{ batch }} 条</span>
                    </div>
                    <div class="cfg__row">
                        <span class="cfg__k">在第几条后中止</span>
                        <input v-model.number="abortAt" type="range" min="1" max="10" class="cfg__range">
                        <span class="cfg__v mono">第 {{ abortAt }} 条</span>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy" @click="runBatch(false)">
                            ▶ 写完正常提交
                        </button>
                        <button type="button" class="w-btn is-danger" :disabled="busy" @click="runBatch(true)">
                            ▶ 写到一半 abort
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="readAll">刷新表格</button>
                        <button type="button" class="w-btn is-danger" :disabled="busy" @click="clearAll">清空</button>
                    </div>
                    <span class="w-hint">DB：{{ dbState }}</span>
                </div>

                <div class="table-wrap">
                    <div class="table__head">
                        <span>#</span>
                        <span>seq</span>
                        <span>label</span>
                        <span>写入时间</span>
                    </div>
                    <div v-for="r in rows" :key="String(r.id)" class="table__row">
                        <span class="mono">{{ r.id }}</span>
                        <span class="mono">{{ r.seq }}</span>
                        <span>{{ r.label }}</span>
                        <span class="mono">{{ new Date(r.at).toLocaleTimeString() }}</span>
                    </div>
                    <div v-if="!rows.length" class="log-empty">当前没有数据</div>
                </div>

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">本次事务已发出的写</span>
                        <span class="kv__v mono">{{ issued }} 次 add()</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">最终落盘</span>
                        <span class="kv__v mono" :class="resultKind">{{ rows.length }} 条</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">事务结论</span>
                        <span class="kv__v" :class="verdict === 'aborted' ? 'is-bad' : verdict === 'committed' ? 'is-ok' : ''">
                            {{ verdictText }}
                        </span>
                    </div>
                </div>

                <div class="log-list">
                    <div v-for="(l, i) in logs" :key="i" class="log-item"
                        :class="l.bad ? 'is-bad' : l.warn ? 'is-warn' : 'is-ok'">
                        <span class="log-item__idx">{{ String(logs.length - i).padStart(2, '0') }}</span>
                        <span class="log-item__body mono">{{ l.text }}</span>
                    </div>
                    <div v-if="!logs.length" class="log-empty">还没有操作记录</div>
                </div>
            </div>
        </section>

        <!-- ③ 并发与自动提交 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">并发、排队，以及那个必踩的坑</h2>
                </div>
                <span class="panel__meta">写事务要排队；事务还会在 await 的间隙里悄悄结束</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    同一个 objectStore 上并发多个事务，规则很朴素：<strong>读可以并行，写必须排队</strong>。
                    下面会一次性丢进 {{ concurrency }} 个事务，看它们各自什么时候结束 ——
                    读事务凑在一起回来，写事务则排成一条队。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="busy" @click="raceReads">
                            ① 并发 {{ concurrency }} 个只读事务
                        </button>
                        <button type="button" class="w-btn" :disabled="busy" @click="raceWrites">
                            ② 并发 {{ concurrency }} 个读写事务
                        </button>
                        <button type="button" class="w-btn is-danger" :disabled="busy" @click="autoCommitTrap">
                            ③ 复现事务自动提交
                        </button>
                    </div>
                    <span class="w-hint">右侧时间挤在一起 = 并行；拉开 = 排队等写锁</span>
                </div>

                <div class="timeline">
                    <div v-for="t in lanes" :key="t.id" class="timeline__row">
                        <span class="timeline__k mono">{{ t.label }}</span>
                        <div class="timeline__bar">
                            <i :class="t.mode === 'readonly' ? 'is-read' : 'is-write'"
                                :style="{ marginLeft: t.offsetPct + '%', width: t.widthPct + '%' }"></i>
                        </div>
                        <span class="timeline__v mono">{{ t.ms }} ms</span>
                    </div>
                    <div v-if="!lanes.length" class="log-empty">还没有运行</div>
                </div>

                <p class="probe-note">
                    第三个按钮复现的是最典型的线上事故：事务里一旦出现
                    <code>await fetch()</code> / <code>await sleep()</code> 这类非 IndexedDB 的等待，
                    事务就已经 commit 结束了。回头再 <code>tx.objectStore()</code>，浏览器会直接抛异常。
                    <strong>正确做法是：先把所有异步数据准备好，事务里只做纯 IndexedDB 操作。</strong>
                </p>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">写事务的正确姿势</h2>
                </div>
                <span class="panel__meta">分片提交、错误即回滚、别在事务里 await</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">如何在事务里表达「要么全成，要么全不做」</div>
                    <CodeEditor :code="abortCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">批量写入：分片提交 + 中途校验失败就回滚</div>
                    <CodeEditor :code="batchCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

/* ── 数据模型 ────────────────────────────────────────── */
type Row = {
    id?: number
    seq: number
    label: string
    at: number
}

const DB_NAME = 'vue3-tx-demo'
const DB_VERSION = 1
const STORE = 'journal'
const concurrency = 4

/* ── 状态 ────────────────────────────────────────────── */
const db = ref<IDBDatabase | null>(null)
const ready = ref(false)
const dbState = ref('未连接')
const busy = ref(false)
const rows = ref<Row[]>([])
const logs = ref<{ text: string; bad: boolean; warn?: boolean }[]>([])
const batch = ref(6)
const abortAt = ref(3)
const issued = ref(0)
const verdict = ref<'idle' | 'committed' | 'aborted'>('idle')
const lanes = ref<{ id: number; label: string; mode: string; offsetPct: number; widthPct: number; ms: number }[]>([])

const verdictText = computed(() => {
    if (verdict.value === 'committed') return '已提交（全部落盘）'
    if (verdict.value === 'aborted') return '已回滚（一条都没留）'
    return '未运行'
})

const resultKind = computed(() => {
    if (verdict.value === 'aborted') return 'is-bad'
    if (verdict.value === 'committed') return 'is-ok'
    return ''
})

function push(text: string, bad = false, warn = false) {
    logs.value = [{ text, bad, warn }, ...logs.value].slice(0, 16)
}

/* ── 工具 ────────────────────────────────────────────── */
function reqToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

function txSettled(tx: IDBTransaction): Promise<'complete' | 'abort'> {
    return new Promise((resolve) => {
        tx.oncomplete = () => resolve('complete')
        tx.onabort = () => resolve('abort')
        tx.onerror = () => resolve('abort')
    })
}

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms))
}

async function ensureDb(): Promise<IDBDatabase> {
    if (db.value && ready.value) return db.value
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
        const database = (e.target as IDBOpenDBRequest).result
        if (!database.objectStoreNames.contains(STORE)) {
            database.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        }
    }
    const instance = await reqToPromise(req)
    db.value = instance
    ready.value = true
    dbState.value = `已连接 ${DB_NAME} v${instance.version}`
    return instance
}

/* ── 实验一：中止回滚 ────────────────────────────────── */
async function runBatch(shouldAbort: boolean) {
    busy.value = true
    issued.value = 0
    verdict.value = 'idle'
    logs.value = []
    try {
        const database = await ensureDb()
        const tx = database.transaction(STORE, 'readwrite')
        const os = tx.objectStore(STORE)

        const total = batch.value
        const stopAt = shouldAbort ? Math.min(abortAt.value, total) : -1

        for (let i = 1; i <= total; i++) {
            os.add({ seq: i, label: `第 ${i} 条记录`, at: Date.now() } satisfies Row)
            issued.value += 1
            const isLast = i === stopAt
            push(
                `add() seq=${i}${isLast ? '　← 这里紧接着调用 tx.abort()' : ''}`,
                false,
                isLast,
            )
            if (isLast) {
                tx.abort()
                break
            }
        }

        const outcome = await txSettled(tx)
        verdict.value = outcome === 'complete' ? 'committed' : 'aborted'
        push(
            outcome === 'complete'
                ? '事务 oncomplete：所有写入一起落盘'
                : '事务 onabort：本事务内已发出的写入全部撤销',
            outcome !== 'complete',
        )

        await readAll()
    } catch (e) {
        push(`失败：${String((e as Error).message)}`, true)
    } finally {
        busy.value = false
    }
}

async function readAll() {
    try {
        const database = await ensureDb()
        rows.value = (await reqToPromise(
            database.transaction(STORE, 'readonly').objectStore(STORE).getAll(),
        )) as Row[]
    } catch {
        rows.value = []
    }
}

async function clearAll() {
    try {
        const database = await ensureDb()
        const tx = database.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).clear()
        await txSettled(tx)
        rows.value = []
        push('已清空')
    } catch (e) {
        push(`清空失败：${String((e as Error).message)}`, true)
    }
}

/* ── 实验二：并发 ────────────────────────────────────── */
async function race(mode: IDBTransactionMode, doWrite: boolean) {
    const database = await ensureDb()
    const starts: number[] = []
    const ends: number[] = []

    const jobs = Array.from({ length: concurrency }, (_, i) => async () => {
        const tx = database.transaction(STORE, mode)
        const os = tx.objectStore(STORE)
        starts.push(performance.now())
        // 在事务里拖一会儿：读写差异会在这段时间内体现出来
        await sleep(doWrite ? 140 : 80)
        if (doWrite) os.add({ seq: i + 1, label: `${mode} #${i + 1}`, at: Date.now() } satisfies Row)
        else os.getAll()
        await txSettled(tx)
        ends.push(performance.now())
    })

    lanes.value = []
    const t0 = performance.now()
    await Promise.all(jobs.map((j) => j()))
    const span = performance.now() - t0 || 1

    lanes.value = ends.map((end, i) => ({
        id: i,
        label: `#${i + 1} ${mode}`,
        mode,
        ms: Math.round(end - t0),
        offsetPct: Math.max(0, Math.round(((starts[i] - t0) / span) * 100)),
        widthPct: Math.max(2, Math.round(((end - starts[i]) / span) * 100)),
    }))

    const last = lanes.value[lanes.value.length - 1]?.ms ?? 0
    const serialGuess = concurrency * (doWrite ? 140 : 80)
    push(
        `${concurrency} 个 ${mode} 事务：最后一个在 ${last}ms 结束（若完全串行则约 ${serialGuess}ms）→ ${
            last < serialGuess * 0.7 ? '明显并行' : '基本在排队'
        }`,
        false,
        false,
    )
    await readAll()
}

async function raceReads() {
    busy.value = true
    logs.value = []
    try {
        await race('readonly', false)
    } catch (e) {
        push(`失败：${String((e as Error).message)}`, true)
    } finally {
        busy.value = false
    }
}

async function raceWrites() {
    busy.value = true
    logs.value = []
    try {
        await race('readwrite', true)
    } catch (e) {
        push(`失败：${String((e as Error).message)}`, true)
    } finally {
        busy.value = false
    }
}

/* 复现「事务在 await 期间自动提交」 */
async function autoCommitTrap() {
    busy.value = true
    lanes.value = []
    logs.value = []
    try {
        const database = await ensureDb()
        const tx = database.transaction(STORE, 'readwrite')
        const os = tx.objectStore(STORE)
        os.add({ seq: 1, label: 'await 之前发出的写', at: Date.now() } satisfies Row)
        push('① 开启 readwrite 事务，发出 add()')
        push('② 接下来 await sleep(100) —— 一个跟 IndexedDB 无关的等待', false, true)
        await sleep(100)
        push('③ 等待期间事务没有待处理请求，浏览器已自动把它 commit 了', false, true)

        try {
            os.add({ seq: 2, label: 'await 之后的写', at: Date.now() } satisfies Row)
            push('竟然写进去了？（通常不会，取决于浏览器实现）', true)
        } catch (e) {
            const err = e as DOMException
            push(`④ 再次操作该事务时抛错：${err.name} — ${err.message}`, true)
        }

        try {
            tx.objectStore(STORE)
        } catch (e) {
            const err = e as DOMException
            push(`⑤ tx.objectStore() 同样失败：${err.name}`, true)
        }

        push('结论：事务里只允许 IndexedDB 请求，任何 await 都要挪到事务外', true)
        await readAll()
    } catch (e) {
        push(`失败：${String((e as Error).message)}`, true)
    } finally {
        busy.value = false
    }
}

onBeforeUnmount(() => {
    db.value?.close()
})

/* ── 展示用源码 ─────────────────────────────────────── */
const abortCode = `// ── 错误写法：在事务里 await 非 IndexedDB 的东西 ──────
const tx = db.transaction('orders', 'readwrite')
const os = tx.objectStore('orders')
for (const item of cart) {
  const stock = await getStockRemote(item.sku)   // ❌ 事务在这里就已经 commit 了
  if (stock < item.count) throw new Error('库存不足')
  os.put(item)                                   // TransactionInactiveError
}

// ── 正确写法：先把数据备齐，事务只负责写 ──────────────
const stocks = await Promise.all(cart.map((i) => getStockRemote(i.sku)))   // ← 事务外 await
const invalid = cart.find((item, i) => stocks[i] < item.count)
if (invalid) throw new Error('库存不足')          // 还没开事务，零副作用

const tx = db.transaction('orders', 'readwrite')
const os = tx.objectStore('orders')
cart.forEach((item) => os.put(item))

// 中途想中止：
// tx.abort() 或者让某个 request .onerror 被触发 —— 整个事务都会回滚

await new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve()               // 只有走到这里才算真落盘
  tx.onabort = () => reject(tx.error ?? new Error('aborted'))
  tx.onerror = () => reject(tx.error)
})`

const batchCode = `/** 一次性写 10 万条的正确方式：分片 + 让出主线程 */
async function bulkPut(db: IDBDatabase, rows: Row[], chunkSize = 1000) {
  let done = 0
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const tx = db.transaction('journal', 'readwrite')
    const os = tx.objectStore('journal')

    chunk.forEach((r) => os.put(r))

    try {
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onabort = () => reject(tx.error ?? new Error('aborted'))
        tx.onerror = () => reject(tx.error)
      })
    } catch (e) {
      console.error(\`第 \${i} 批失败，整批回滚\`, e)   // 每批要么全成，要么全不成
      throw e
    }

    done += chunk.length
    onProgress?.(done, rows.length)

    // 让出主线程，给 UI 和 IndexedDB 自己喘息的机会
    await new Promise((r) => setTimeout(r, 0))
  }
}

// durability 三档（transaction 的第三个参数）
db.transaction('journal', 'readwrite', { durability: 'relaxed' })  // 快，掉电可能丢最后几百 ms
db.transaction('journal', 'readwrite', { durability: 'strict' })   // 慢，确保写到了磁盘
db.transaction('journal', 'readwrite', { durability: 'default' })  // 浏览器自行权衡（默认）`
</script>

<style lang="scss" scoped>
.cfg {
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.cfg__row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
}

.cfg__k {
    flex-shrink: 0;
    min-width: 148px;
    font-size: 12px;
    color: var(--text-tertiary);
}

.cfg__v {
    min-width: 62px;
    font-size: 12px;
    color: var(--brand);
}

.cfg__range {
    flex: 1;
    max-width: 320px;
    accent-color: var(--brand);
}

.is-danger {
    color: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 45%, transparent);
}

.table-wrap {
    margin: 12px 0;
    border: 1px solid var(--hairline);
}

.table__head,
.table__row {
    display: grid;
    grid-template-columns: 56px 60px 1fr 110px;
    gap: 10px;
    padding: 6px 12px;
    border-bottom: 1px solid var(--hairline);
}

.table__head {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    background: var(--surface-raised);
}

.table__row {
    font-size: 12px;
    color: var(--text-secondary);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: var(--surface-muted);
    }
}

.timeline {
    margin: 12px 0;
}

.timeline__row {
    display: grid;
    grid-template-columns: 150px 1fr 70px;
    align-items: center;
    gap: 10px;
    padding: 3px 0;
}

.timeline__k {
    font-size: 11px;
    color: var(--text-secondary);
}

.timeline__bar {
    height: 10px;
    background: var(--surface-muted);
    border: 1px solid var(--hairline);

    i {
        display: block;
        height: 100%;

        &.is-read {
            background: color-mix(in srgb, var(--info) 70%, transparent);
        }

        &.is-write {
            background: color-mix(in srgb, var(--brand) 70%, transparent);
        }
    }
}

.timeline__v {
    font-size: 11px;
    text-align: right;
    color: var(--text-tertiary);
}

.log-item.is-warn .log-item__body {
    color: var(--warning);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}

@media (max-width: 820px) {
    .timeline__row {
        grid-template-columns: 110px 1fr 60px;
    }
}
</style>
