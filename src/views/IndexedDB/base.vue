<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">IndexedDB</span>
                    <h2 class="panel__title">浏览器里唯一能真正「存数据」的地方</h2>
                </div>
                <span class="panel__meta">异步、事务型、按同源隔离，容量按磁盘算</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>localStorage</code> 只有 5MB、同步阻塞主线程、只能存字符串。
                    IndexedDB 是浏览器唯一的<em>事务型数据库</em>：异步不卡主线程、能存结构化对象
                    （File / Blob / ArrayBuffer 都行）、有索引、有版本迁移，
                    容量通常按磁盘剩余空间的比例给。离线草稿、图片缓存、聊天记录本地存档都靠它。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">它是异步的</span>
                        <span class="point__v">所有操作都走 request + onsuccess/onerror，要用 Promise 包一层才好写</span>
                    </div>
                    <div class="point">
                        <span class="point__k">一切都在事务里</span>
                        <span class="point__v">readonly 或 readwrite；事务随事件循环结束而自动提交</span>
                    </div>
                    <div class="point">
                        <span class="point__k">只有这里能建表</span>
                        <span class="point__v">createObjectStore / createIndex 只能写在 onupgradeneeded 里</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 真实操作 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">在浏览器里真的建个库</h2>
                </div>
                <span class="panel__meta">下面每一个增删改查都是真实的，数据会留在这个浏览器里</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    点「打开数据库」开始。之后每一步都会在下面这张表里即时反映出来 ——
                    这就是你浏览器里的<strong>真实数据</strong>（刷新页面都还在，
                    除非点最后的「删库」）。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="openDb">① 打开 / 升级数据库</button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="addMany">
                            ② 批量新增 5 条
                        </button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="getOne">③ 按主键查一条</button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="putOne">④ 改一条（put）</button>
                    </div>
                    <span class="w-hint">DB 状态：{{ dbState }}</span>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="!ready" @click="delOne">⑤ 删一条</button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="countAll">⑥ count()</button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="cursorWalk">
                            ⑦ 游标倒序遍历
                        </button>
                        <button type="button" class="w-btn" :disabled="!ready" @click="indexQuery">
                            ⑧ 按索引查
                        </button>
                        <button type="button" class="w-btn is-danger" :disabled="!ready" @click="clearAll">
                            清空表
                        </button>
                        <button type="button" class="w-btn is-danger" @click="dropDb">删库</button>
                    </div>
                    <input v-model="keyword" class="cfg__input cfg__input--sm mono" placeholder="给新增数据用的关键字">
                </div>

                <div class="stat-grid">
                    <div class="stat">
                        <span class="stat__label">数据库 / 版本</span>
                        <span class="stat__value mono">v{{ version || '—' }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">当前记录数</span>
                        <span class="stat__value mono">{{ rows.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">本地库总数</span>
                        <span class="stat__value mono">{{ dbs === null ? '—' : dbs }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">上次操作耗时</span>
                        <span class="stat__value mono">{{ lastMs ? lastMs + ' ms' : '—' }}</span>
                    </div>
                </div>

                <!-- 数据表 -->
                <div class="table-wrap">
                    <div class="table__head">
                        <span>#</span>
                        <span>title</span>
                        <span>tag（已建索引）</span>
                        <span>score</span>
                        <span>updatedAt</span>
                    </div>
                    <div v-for="r in rows" :key="String(r.id)" class="table__row">
                        <span class="mono">{{ r.id }}</span>
                        <span>{{ r.title }}</span>
                        <span class="mono">{{ r.tag }}</span>
                        <span class="mono">{{ r.score }}</span>
                        <span class="mono">{{ new Date(r.updatedAt).toLocaleTimeString() }}</span>
                    </div>
                    <div v-if="!rows.length" class="log-empty">当前没有数据</div>
                </div>

                <div class="log-list">
                    <div v-for="(l, i) in logs" :key="i" class="log-item" :class="l.bad ? 'is-bad' : 'is-ok'">
                        <span class="log-item__idx">{{ String(logs.length - i).padStart(2, '0') }}</span>
                        <span class="log-item__body mono">{{ l.text }}</span>
                    </div>
                    <div v-if="!logs.length" class="log-empty">还没有操作记录</div>
                </div>
            </div>
        </section>

        <!-- ③ 坑 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Pitfalls</span>
                    <h2 class="panel__title">四个一定会踩的坑</h2>
                </div>
                <span class="panel__meta">它们几乎都不是 IndexedDB 的 bug，是设计如此</span>
            </div>
            <div class="panel__body">
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">① 事务会自动关闭</span>
                        <span class="point__v">
                            事务活在事件循环里，一旦本轮没有待处理的 request 就自动 commit。
                            所以在事务里 <code>await fetch()</code> 之后再用同一个事务，会抛
                            TransactionInactiveError。要么先把 await 放在开事务之前，要开两个事务。
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">② add 遇到同主键会失败</span>
                        <span class="point__v">
                            <code>add()</code> 主键已存在时直接报错（ConstraintError）；<code>put()</code>
                            是「有就改，没有就插」。想做 upsert 用 put。
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">③ 版本升级是唯一能改表结构的时机</span>
                        <span class="point__v">
                            createObjectStore / createIndex 只能在 <code>onupgradeneeded</code> 里调用。
                            要加字段索引就必须 <code>open(db, version + 1)</code>，而且<strong>所有已打开的旧连接都得先关掉</strong>，
                            否则升级请求会被 blocked 住。
                        </span>
                    </div>
                    <div class="point">
                        <span class="point__k">④ 隐私模式 / 清理站点数据</span>
                        <span class="point__v">
                            Safari 无痕模式下 IndexedDB 可能直接不可用；用户清「站点数据」也没商量。
                            所以它只能当缓存，不能当唯一数据源 —— 关键数据必须在服务端有备份。
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">把这套回调包成 Promise</h2>
                </div>
                <span class="panel__meta">上面页面里跑的就是这一层</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">request / transaction 的 Promise 化</div>
                    <CodeEditor :code="wrapCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">打开数据库与版本迁移</div>
                    <CodeEditor :code="openCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'

/* ── 数据模型 ────────────────────────────────────────── */
type Note = {
    id?: number
    title: string
    tag: string
    score: number
    updatedAt: number
}

const DB_NAME = 'vue3-demo-db'
const DB_VERSION = 1
const STORE = 'notes'
const INDEX = 'byTag'

/* ── 状态 ────────────────────────────────────────────── */
const db = ref<IDBDatabase | null>(null)
const ready = ref(false)
const version = ref(0)
const rows = ref<Note[]>([])
const logs = ref<{ text: string; bad: boolean }[]>([])
const lastMs = ref(0)
const dbState = ref('未连接')
const keyword = ref('demo')
const dbs = ref<number | null>(null)

function push(text: string, bad = false) {
    logs.value = [{ text, bad }, ...logs.value].slice(0, 16)
}

/* ── 工具：把 callback 包成 Promise ──────────────────── */
function reqToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

function txDone(tx: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error ?? new Error('事务被中止'))
    })
}

/* ── 打开数据库 ──────────────────────────────────────── */
async function openDb() {
    const t0 = performance.now()
    try {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
            const database = (e.target as IDBOpenDBRequest).result
            if (!database.objectStoreNames.contains(STORE)) {
                const store = database.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
                store.createIndex(INDEX, 'tag', { unique: false })
                push('onupgradeneeded：创建了 objectStore「notes」和索引「byTag」')
            }
        }

        const instance = await reqToPromise(req)
        db.value = instance
        ready.value = true
        version.value = instance.version
        instance.onversionchange = () => {
            // 别的标签页要升级版本时，这里必须让路，否则那边的升级会被 block 住
            instance.close()
            db.value = null
            ready.value = false
            dbState.value = '已被其它标签页抢占关闭'
            push('收到 versionchange：本连接已主动关闭，给版本升级让路', true)
        }
        lastMs.value = Math.round(performance.now() - t0)
        dbState.value = `已连接 ${DB_NAME}`
        push(
            `打开成功：${instance.name} v${instance.version}，stores = ${Array.from(instance.objectStoreNames).join(', ')}`,
        )
        await scanDatabases()
        await readAll()
    } catch (e) {
        push(`打开失败：${String((e as Error).message)}`, true)
        dbState.value = '打开失败'
    }
}

async function scanDatabases() {
    const factory = indexedDB as IDBFactory & {
        databases?: () => Promise<{ name?: string; version?: number }[]>
    }
    if (typeof factory.databases !== 'function') {
        dbs.value = null
        return
    }
    try {
        const list = await factory.databases()
        dbs.value = list.length
    } catch {
        dbs.value = null
    }
}

function store(mode: IDBTransactionMode): IDBObjectStore {
    if (!db.value) throw new Error('请先打开数据库')
    return db.value.transaction(STORE, mode).objectStore(STORE)
}

/* ── 各项操作 ────────────────────────────────────────── */
async function addMany() {
    const t0 = performance.now()
    const tags = ['vue', 'network', 'css', 'js']
    try {
        const tx = db.value!.transaction(STORE, 'readwrite')
        const os = tx.objectStore(STORE)
        for (let i = 0; i < 5; i++) {
            os.add({
                title: `${keyword.value || 'note'} #${i + 1}`,
                tag: tags[i % tags.length],
                score: Math.floor(Math.random() * 100),
                updatedAt: Date.now(),
            } satisfies Note)
        }
        await txDone(tx)
        lastMs.value = Math.round(performance.now() - t0)
        push(`add() × 5 完成（keyPath=id，主键由 autoIncrement 生成）`, false)
        await readAll()
    } catch (e) {
        push(`新增失败：${String((e as Error).message)}`, true)
    }
}

async function getOne() {
    const t0 = performance.now()
    try {
        const id = rows.value[0]?.id ?? 1
        const r = await reqToPromise(store('readonly').get(id))
        lastMs.value = Math.round(performance.now() - t0)
        push(r ? `get(${id}) → ${r.title}` : `get(${id}) → undefined（没有这个主键）`, !r)
    } catch (e) {
        push(`查询失败：${String((e as Error).message)}`, true)
    }
}

async function putOne() {
    const t0 = performance.now()
    if (!rows.value.length) {
        push('表里没数据，先新增几条', true)
        return
    }
    try {
        const target = rows.value[0]
        const tx = db.value!.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).put({
            ...target,
            score: Math.min(100, target.score + 10),
            updatedAt: Date.now(),
        } satisfies Note)
        await txDone(tx)
        lastMs.value = Math.round(performance.now() - t0)
        push(`put({ id: ${target.id} })：整条覆盖写入，score 从 ${target.score} 提到了 ${Math.min(100, target.score + 10)}`)
        await readAll()
    } catch (e) {
        push(`修改失败：${String((e as Error).message)}`, true)
    }
}

async function delOne() {
    const t0 = performance.now()
    if (!rows.value.length) {
        push('表里没数据', true)
        return
    }
    try {
        const id = rows.value[rows.value.length - 1].id!
        const tx = db.value!.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).delete(id)
        await txDone(tx)
        lastMs.value = Math.round(performance.now() - t0)
        push(`delete(${id}) 完成`)
        await readAll()
    } catch (e) {
        push(`删除失败：${String((e as Error).message)}`, true)
    }
}

async function countAll() {
    const t0 = performance.now()
    try {
        const n = await reqToPromise(store('readonly').count())
        lastMs.value = Math.round(performance.now() - t0)
        push(`count() → ${n} 条`)
    } catch (e) {
        push(`count 失败：${String((e as Error).message)}`, true)
    }
}

async function cursorWalk() {
    const t0 = performance.now()
    try {
        const result: Note[] = []
        await new Promise<void>((resolve, reject) => {
            const req = store('readonly').openCursor(null, 'prev')
            req.onsuccess = (e) => {
                const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result
                if (cursor) {
                    result.push(cursor.value as Note)
                    cursor.continue()
                } else {
                    resolve()
                }
            }
            req.onerror = () => reject(req.error)
        })
        lastMs.value = Math.round(performance.now() - t0)
        push(`游标倒序遍历 ${result.length} 条 → ${result.map((r) => r.id).join(', ')}`)
        rows.value = result
    } catch (e) {
        push(`遍历失败：${String((e as Error).message)}`, true)
    }
}

async function indexQuery() {
    const t0 = performance.now()
    try {
        const idx = store('readonly').index(INDEX)
        const all = (await reqToPromise(idx.getAll())) as Note[]
        lastMs.value = Math.round(performance.now() - t0)
        if (!all.length) {
            push('index(byTag).getAll() → 空表，先加数据', true)
            return
        }
        const tag = all[0].tag
        const hit = (await reqToPromise(idx.getAll(tag))) as Note[]
        push(`index(byTag).getAll('${tag}') → 命中 ${hit.length} / ${all.length} 条`)
        rows.value = hit
    } catch (e) {
        push(`索引查询失败：${String((e as Error).message)}`, true)
    }
}

async function readAll() {
    try {
        rows.value = (await reqToPromise(store('readonly').getAll())) as Note[]
    } catch {
        rows.value = []
    }
}

async function clearAll() {
    try {
        const tx = db.value!.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).clear()
        await txDone(tx)
        push('clear()：表已清空（库还在）')
        await readAll()
    } catch (e) {
        push(`清空失败：${String((e as Error).message)}`, true)
    }
}

async function dropDb() {
    try {
        db.value?.close()
        await reqToPromise(indexedDB.deleteDatabase(DB_NAME))
        db.value = null
        ready.value = false
        rows.value = []
        version.value = 0
        dbState.value = '未连接'
        push('数据库已删除')
        await scanDatabases()
    } catch (e) {
        push(`删库失败：${String((e as Error).message)}`, true)
    }
}

onBeforeUnmount(() => {
    db.value?.close()
})

/* ── 展示用源码 ─────────────────────────────────────── */
const wrapCode = `/** 所有 IndexedDB 操作都是 request + 回调，先包成 Promise 才好写 */
function reqToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** 事务的完成信号：oncomplete 才算落盘，onabort/onerror 一律当失败 */
function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error ?? new Error('事务被中止'))
  })
}

// 于是增删改写起来就正常了：
async function put(db: IDBDatabase, value: Note) {
  const tx = db.transaction('notes', 'readwrite')
  tx.objectStore('notes').put(value)   // 发出请求，不用 await request
  await txDone(tx)                     // 等整个事务 commit
}

// ⚠️ 千万别这么写：事务会在 await 的间隙里自动 commit
async function wrong(db: IDBDatabase, value: Note) {
  const tx = db.transaction('notes', 'readwrite')
  const row = await reqToPromise(tx.objectStore('notes').get(1))
  const fresh = await fetch(\`/api/detail/\${row.id}\`).then((r) => r.json())  // ← 事务在这里就失效了
  tx.objectStore('notes').put({ ...row, ...fresh })   // TransactionInactiveError
}`

const openCode = `const DB_NAME = 'vue3-demo-db'
const DB_VERSION = 1

const req = indexedDB.open(DB_NAME, DB_VERSION)

// ① 只有「首次创建」或「版本号变大」时才会触发这里是唯一能改表结构的地方
req.onupgradeneeded = (e) => {
  const db = (e.target as IDBOpenDBRequest).result
  if (!db.objectStoreNames.contains('notes')) {
    const store = db.createObjectStore('notes', {
      keyPath: 'id',          // 主键取自 value.id
      autoIncrement: true,    // 不传 id 时由数据库自动生成
    })
    store.createIndex('byTag', 'tag', { unique: false })
  }
}

// ② 另一个标签页也想升级版本时，必须在这里让路，否则它的升级会被 blocked
const db = await reqToPromise(req)
db.onversionchange = () => {
  db.close()
  // 通常会提示用户：「有新版本，请刷新页面」
}

// ③ 升级流程：把当前 DOM 数据行版本 ++ → 在 onupgradeneeded 里做迁移。
//    从 v1 到 v2 加一个索引，老数据一条都不会丢。
// ④ deleteDatabase 前一定要先把所有连接 close() 掉，否则会被 block`
</script>

<style lang="scss" scoped>
.cfg__input--sm {
    flex: 0 0 200px;
    padding: 5px 9px;
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
    grid-template-columns: 56px 1fr 120px 72px 96px;
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

@media (max-width: 820px) {
    .table__head,
    .table__row {
        grid-template-columns: 44px 1fr 90px;
    }

    .table__row span:nth-child(n + 4),
    .table__head span:nth-child(n + 4) {
        display: none;
    }
}
</style>
