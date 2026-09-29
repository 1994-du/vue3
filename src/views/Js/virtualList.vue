<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Virtual List</span>
                    <h2 class="panel__title">只画看得见的那一屏</h2>
                </div>
                <span class="panel__meta">全屏容器不动，撑高度的是占位块</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    一万条数据全渲染成一万个 DOM 节点，光是布局就够卡了。
                    虚拟列表的做法是：<em>一个可滚动的外壳</em> + <em>一个总高的占位层</em>，
                    再根据 <code>scrollTop</code> 算出当前该显示哪几项，只把这几项渲染出来，
                    并用 <code>transform</code> 把它们挪到正确的位置。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">外壳</span>
                        <span class="point__v">固定高度 + overflow-y: auto，负责产生滚动</span>
                    </div>
                    <div class="point">
                        <span class="point__k">占位</span>
                        <span class="point__v">高度 = 项数 × 项高，用于把滚动条拉到真实长度</span>
                    </div>
                    <div class="point">
                        <span class="point__k">缓冲</span>
                        <span class="point__v">上下各多渲染几项，避免快速滚动时看到白屏</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">{{ total.toLocaleString('en-US') }} 条数据滚起来试试</h2>
                </div>
                <span class="panel__meta">滚动时盯一下「实际渲染节点数」</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <span class="w-label">数据量</span>
                    <div class="w-btns">
                        <button
                            v-for="n in TOTALS"
                            :key="n"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': total === n }"
                            @click="total = n">
                            {{ n.toLocaleString('en-US') }}
                        </button>
                    </div>
                    <span class="w-hint">换成 10 万条也一样流畅</span>
                </div>

                <div class="w-row">
                    <span class="w-label">项高</span>
                    <div class="w-btns">
                        <button
                            v-for="h in HEIGHTS"
                            :key="h"
                            type="button"
                            class="w-btn"
                            :class="{ 'is-active': itemHeight === h }"
                            @click="itemHeight = h">
                            {{ h }} px
                        </button>
                    </div>
                </div>

                <!-- 实时指标 -->
                <div class="stat-grid vl-stats">
                    <div class="stat">
                        <span class="stat__label">数据总量</span>
                        <span class="stat__value">{{ total.toLocaleString('en-US') }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">实际渲染节点</span>
                        <span class="stat__value is-brand">{{ visibleData.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">全量渲染需要</span>
                        <span class="stat__value">{{ total.toLocaleString('en-US') }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">渲染占比</span>
                        <span class="stat__value is-brand">{{ ratio }}%</span>
                    </div>
                </div>

                <!-- 列表 -->
                <div ref="container" class="vl-shell" @scroll="handleScroll">
                    <div class="vl-phantom" :style="{ height: totalHeight + 'px' }">
                        <div
                            v-for="item in visibleData"
                            :key="item.id"
                            class="vl-item"
                            :style="{ height: itemHeight + 'px', transform: `translateY(${item.top}px)` }">
                            <span class="vl-index mono">#{{ item.id }}</span>
                            <span class="vl-text">{{ item.label }}</span>
                        </div>
                    </div>
                </div>

                <p class="vl-tip">
                    起始索引 <code class="mono">{{ startIndex }}</code> ·
                    当前显示第 <code class="mono">{{ startIndex + 1 }}</code> ～
                    <code class="mono">{{ startIndex + visibleData.length }}</code> 条 ·
                    列表总高 <code class="mono">{{ totalHeight.toLocaleString('en-US') }} px</code>
                </p>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">核心就三步</h2>
                </div>
                <span class="panel__meta">算范围 → 切片 → 挪位置</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">滚动时该显示哪几项</div>
                    <CodeEditor :code="coreCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">结构：外壳 + 占位层 + 可见项</div>
                    <CodeEditor :code="tplCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const TOTALS = [1000, 10000, 100000] as const
const HEIGHTS = [48, 60, 80] as const

const OVERSCAN = 3 // 上下各多渲染几条，防止快速滚动露白

const total = ref<number>(10000)
const itemHeight = ref<number>(60)

const container = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(480)

type Row = { id: number; label: string; top: number }

const data = computed(() =>
    Array.from({ length: total.value }, (_, i) => ({
        id: i + 1,
        label: `虚拟列表的第 ${i + 1} 行数据`,
    })),
)

const totalHeight = computed(() => total.value * itemHeight.value)

const startIndex = computed(() => {
    const raw = Math.floor(scrollTop.value / itemHeight.value) - OVERSCAN
    return Math.max(0, raw)
})

const endIndex = computed(() => {
    const count = Math.ceil(viewportHeight.value / itemHeight.value) + OVERSCAN * 2
    return Math.min(total.value, startIndex.value + count)
})

const visibleData = computed<Row[]>(() =>
    data.value.slice(startIndex.value, endIndex.value).map((item, i) => ({
        ...item,
        top: (startIndex.value + i) * itemHeight.value,
    })),
)

const ratio = computed(() => ((visibleData.value.length / total.value) * 100).toFixed(2))

function handleScroll() {
    if (!container.value) return
    scrollTop.value = container.value.scrollTop
}

function measure() {
    if (container.value) viewportHeight.value = container.value.clientHeight
}

let rafId = 0
function onResize() {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(measure)
}

watch([total, itemHeight], () => {
    if (container.value) container.value.scrollTop = 0
    scrollTop.value = 0
})

onMounted(() => {
    measure()
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(rafId)
})

/* ── 展示用源码 ───────────────────────────────────────── */
const coreCode = `const OVERSCAN = 3       // 上下缓冲，避免快速滚动时白屏

// ① 滚动位置换算成起始索引
const startIndex = computed(() => {
  const raw = Math.floor(scrollTop.value / itemHeight.value) - OVERSCAN
  return Math.max(0, raw)
})

// ② 可见区域能装几项 → 结束索引
const endIndex = computed(() => {
  const count = Math.ceil(viewportHeight.value / itemHeight.value) + OVERSCAN * 2
  return Math.min(total.value, startIndex.value + count)
})

// ③ 只切这一小段出来渲染，并算出每项的偏移
const visibleData = computed(() =>
  data.value.slice(startIndex.value, endIndex.value).map((item, i) => ({
    ...item,
    top: (startIndex.value + i) * itemHeight.value   // 撑起正确位置
  }))
)

const totalHeight = computed(() => total.value * itemHeight.value)`

const tplCode = `<template>
  <!-- 外壳：固定高度 + 滚动 -->
  <div ref="container" class="vl-shell" @scroll="handleScroll">
    <!-- 占位层：把滚动条拉到真实长度 -->
    <div class="vl-phantom" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="item in visibleData"
        :key="item.id"
        class="vl-item"
        :style="{ height: itemHeight + 'px', transform: \`translateY(\${item.top}px)\` }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style>
.vl-shell   { height: 480px; overflow-y: auto; }
.vl-phantom { position: relative; }
.vl-item    { position: absolute; top: 0; left: 0; right: 0; }
</style>`
</script>

<style scoped>
.vl-stats {
    margin-bottom: 14px;
}

.is-brand {
    color: var(--brand);
}

.vl-shell {
    height: 480px;
    overflow-y: auto;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.vl-phantom {
    position: relative;
}

.vl-item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    border-bottom: 1px solid var(--hairline);
    background: var(--surface);
    box-sizing: border-box;
}

.vl-index {
    flex: none;
    font-size: 11px;
    color: var(--brand);
    opacity: 0.8;
}

.vl-text {
    font-size: 12px;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vl-tip {
    margin: 12px 0 0;
    font-size: 12px;
    color: var(--text-tertiary);
}
.vl-tip code {
    font-family: var(--font-mono);
    color: var(--text-secondary);
}
</style>
