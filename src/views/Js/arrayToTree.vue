<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Array → Tree</span>
                    <h2 class="panel__title">先把 id 记下来，再一次性挂上去</h2>
                </div>
                <span class="panel__meta">用 Map 索引把 O(n²) 降成 O(n)</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    扁平数据里每个节点只知道自己的 <code>parent</code>。
                    朴素做法是每挂一个节点就去数组里 <code>find</code> 它的父节点 —— 两层循环，O(n²)。
                    更省的做法是<em>先把所有节点按 id 存进 Map</em>，之后每次查父都是 O(1)，
                    整体就变成 <strong>O(n)</strong>。下面把这个过程一步步演出来。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">一遍</span>
                        <span class="point__v">遍历数组，map.set(item.id, item)</span>
                    </div>
                    <div class="point">
                        <span class="point__k">二遍</span>
                        <span class="point__v">无 parent 的进根数组，有 parent 的 push 到父的 children</span>
                    </div>
                    <div class="point">
                        <span class="point__k">副作用</span>
                        <span class="point__v">直接改原对象会污染源数据，重要的话先深拷贝一份</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 分步演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ SOURCE.length }} 个节点，逐步挂上去</h2>
                </div>
                <span class="panel__meta">{{ progressText }}</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :disabled="atEnd" @click="next">
                            下一步
                        </button>
                        <button type="button" class="w-btn" :class="{ 'is-active': playing }" @click="togglePlay">
                            {{ playing ? '暂停' : '自动播放' }}
                        </button>
                        <button type="button" class="w-btn" @click="finish">一次跑完</button>
                        <button type="button" class="w-btn" @click="reset">重置</button>
                    </div>
                    <span class="w-hint">树会随每一步长出来</span>
                </div>

                <p class="step-note">{{ note }}</p>

                <div class="att-grid">
                    <!-- 扁平数据 -->
                    <div class="att-col">
                        <div class="code-block__label">扁平数据</div>
                        <div class="flat-list">
                            <div
                                v-for="(item, i) in SOURCE"
                                :key="item.id"
                                class="flat-row"
                                :class="{
                                    'is-current': i === step - 1,
                                    'is-done': i < step - 1,
                                }">
                                <span class="flat-id mono">id {{ item.id }}</span>
                                <span class="flat-sep mono">·</span>
                                <span class="flat-parent mono">
                                    parent {{ item.parent === null ? 'null' : item.parent }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Map -->
                    <div class="att-col">
                        <div class="code-block__label">Map 索引（{{ mapCount }} 项）</div>
                        <div class="map-list">
                            <span v-for="n in mapCount" :key="n" class="map-chip mono">
                                {{ SOURCE[n - 1].id }} → 节点
                            </span>
                            <span v-if="!mapCount" class="queue__empty">尚未建索引</span>
                        </div>
                    </div>

                    <!-- 树 -->
                    <div class="att-col">
                        <div class="code-block__label">生成中的树</div>
                        <div class="tree-list">
                            <div
                                v-for="row in treeRows"
                                :key="row.key"
                                class="tree-row"
                                :style="{ paddingLeft: row.depth * 16 + 'px' }">
                                <span class="tree-branch mono">{{ row.branch }}</span>
                                <span class="tree-node mono">
                                    {{ row.node.value }}
                                    <span class="tree-id">#{{ row.node.id }}</span>
                                </span>
                                <span v-if="row.node.children?.length" class="tree-count mono">
                                    {{ row.node.children.length }} 个子
                                </span>
                            </div>
                            <span v-if="!treeRows.length" class="queue__empty">还没有根节点</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">两版实现</h2>
                </div>
                <span class="panel__meta">页面里逐步跑的 Map 版本</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">推荐 · Map 索引版 O(n)</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">对照 · 递归查找版 O(n²)，以及反向：树转扁平</div>
                    <CodeEditor :code="moreCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

type TreeItem = {
    id: number
    value: number
    parent: number | null
    children?: TreeItem[]
}

const SOURCE: TreeItem[] = [
    { id: 1, value: 1, parent: null },
    { id: 2, value: 2, parent: 1 },
    { id: 3, value: 3, parent: 1 },
    { id: 4, value: 4, parent: 2 },
    { id: 5, value: 5, parent: 2 },
    { id: 6, value: 6, parent: 3 },
    { id: 7, value: 7, parent: 3 },
    { id: 8, value: 8, parent: 4 },
    { id: 9, value: 9, parent: 4 },
    { id: 10, value: 10, parent: 5 },
    { id: 11, value: 11, parent: 5 },
    { id: 12, value: 12, parent: 6 },
]

const TOTAL = SOURCE.length

/* step 的含义：0 = 还没开始，1 = 已建好 Map，2..TOTAL+1 = 正在处理第 n 个元素 */
const step = ref(0)
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const atEnd = computed(() => step.value >= TOTAL + 1)
const mapCount = computed(() => (step.value >= 1 ? TOTAL : 0))
const processedCount = computed(() => Math.max(0, step.value - 1))

const progressText = computed(() => {
    if (step.value === 0) return '点「下一步」开始'
    if (step.value === 1) return `Map 索引建好了，共 ${TOTAL} 项`
    return `已处理 ${processedCount.value} / ${TOTAL} 个节点`
})

const note = computed(() => {
    if (step.value === 0) return '先把所有节点按 id 存进 Map —— 这一步是提速的关键。'
    if (step.value === 1) return `Map 里有 ${TOTAL} 个条目，之后查任意父节点都是 O(1)。`
    const item = SOURCE[step.value - 2]
    if (!item) return '全部处理完毕，树已经成型。'
    if (item.parent === null) {
        return `id=${item.id} 没有 parent → 作为根节点放进结果数组。`
    }
    return `id=${item.id} 的 parent 是 ${item.parent} → 从 Map 里找到它，push 进它的 children。`
})

/* 根据「已处理前 n 项」重建快照，避免修改源数据 */
function buildSnapshot(n: number): TreeItem[] {
    const part = SOURCE.slice(0, n).map((i) => ({ ...i, children: undefined }))
    const map = new Map<number, TreeItem>()
    part.forEach((item) => map.set(item.id, item))

    const roots: TreeItem[] = []
    part.forEach((item) => {
        if (item.parent === null) {
            roots.push(item)
            return
        }
        const parent = map.get(item.parent)
        if (!parent) return
        if (!parent.children) parent.children = [item]
        else parent.children.push(item)
    })
    return roots
}

type TreeRow = { key: string; node: TreeItem; depth: number; branch: string }

function flatten(nodes: TreeItem[], depth = 0, prefix = ''): TreeRow[] {
    const rows: TreeRow[] = []
    nodes.forEach((node, i) => {
        const isLast = i === nodes.length - 1
        const branch = depth === 0 ? '' : `${prefix}${isLast ? '└ ' : '├ '}`
        rows.push({ key: String(node.id), node, depth, branch })
        if (node.children?.length) {
            rows.push(...flatten(node.children, depth + 1, depth === 0 ? '  ' : `${prefix}${isLast ? '   ' : '│  '}`))
        }
    })
    return rows
}

const treeRows = computed<TreeRow[]>(() => flatten(buildSnapshot(processedCount.value)))

function next() {
    if (atEnd.value) return
    step.value++
}

function finish() {
    stop()
    step.value = TOTAL + 1
}

function reset() {
    stop()
    step.value = 0
}

function togglePlay() {
    if (playing.value) {
        stop()
        return
    }
    if (atEnd.value) step.value = 0
    playing.value = true
    timer = setInterval(() => {
        if (atEnd.value) {
            stop()
            return
        }
        step.value++
    }, 700)
}

function stop() {
    playing.value = false
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

onBeforeUnmount(stop)

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `function arrayToTree(arr) {
  const map = new Map()
  const roots = []

  // ① 先索引：一遍扫完，id → 节点
  for (const item of arr) {
    map.set(item.id, { ...item, children: [] })   // 建议拷贝，避免改坏源数据
  }

  // ② 再挂载：顺着 parent 找到爹，把自己塞进去
  for (const item of arr) {
    const node = map.get(item.id)
    const parent = map.get(item.parent)
    if (parent) parent.children.push(node)
    else roots.push(node)
  }

  return roots
}

// 也有写法是把 ① ② 合并成一次遍历，
// 前提是父节点一定排在子节点之前，业务数据通常不满足这个假设。`

const moreCode = `// ① 递归版：好懂但慢，每个节点都要 find 一次
function build(arr, parentId = null) {
  return arr
    .filter((item) => item.parent === parentId)
    .map((item) => ({ ...item, children: build(arr, item.id) }))
}
// 每层都全量 filter → n 层下来是 O(n²)

// ② 反过来：树转扁平（拿到级联选择器要的那份数据）
function treeToArray(tree, parentId = null) {
  const out = []
  for (const node of tree) {
    const { children, ...rest } = node
    out.push({ ...rest, parentId })
    if (children?.length) out.push(...treeToArray(children, node.id))
  }
  return out
}

// ③ 顺便：按层级排个序（常用于表格展示）
function sortByLevel(tree, level = 0) {
  const out = []
  for (const node of tree) {
    out.push({ ...node, level })
    if (node.children?.length) out.push(...sortByLevel(node.children, level + 1))
  }
  return out
}`
</script>

<style scoped>
.step-note {
    margin: 0 0 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border-left: 2px solid var(--brand);
    padding-left: 10px;
}

.att-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
    align-items: start;
}

.att-col {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 10px;
}

.flat-list {
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow-y: auto;
}

.flat-row {
    display: flex;
    gap: 6px;
    padding: 4px 8px;
    font-size: 11px;
    color: var(--text-tertiary);
    border-left: 2px solid transparent;
}
.flat-row.is-done {
    color: var(--text-secondary);
}
.flat-row.is-current {
    color: var(--brand);
    background: var(--brand-soft);
    border-left-color: var(--brand);
}

.flat-id {
    flex: none;
    width: 44px;
}
.flat-sep {
    opacity: 0.5;
}
.flat-parent {
    color: inherit;
}

.map-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-height: 300px;
    overflow-y: auto;
}

.map-chip {
    font-size: 11px;
    padding: 2px 8px;
    border: 1px solid var(--hairline);
    color: var(--text-tertiary);
    background: var(--surface);
}

.tree-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
}

.tree-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    white-space: pre;
}

.tree-branch {
    flex: none;
    font-size: 11px;
    color: var(--text-tertiary);
}

.tree-node {
    font-size: 11px;
    color: var(--text-primary);
}

.tree-id {
    color: var(--text-tertiary);
    margin-left: 4px;
}

.tree-count {
    font-size: 10px;
    color: var(--brand);
}

.queue__empty {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    opacity: 0.7;
}
</style>
