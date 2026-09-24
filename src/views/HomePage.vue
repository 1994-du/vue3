<template>
    <section class="cockpit">
        <!-- ticker: commits marquee, the terminal's market tape -->
        <div v-if="tickerRows.length" class="ticker">
            <span class="ticker-label">COMMITS</span>
            <div class="ticker-track">
                <span v-for="(row, index) in tickerRows" :key="`${row.sha}-${index}`" class="ticker-item">
                    <span class="ticker-sha">{{ shortSha(row, 7) }}</span>
                    <span class="commit-type" :data-kind="commitType(row)">{{ commitType(row) }}</span>
                    <span class="ticker-msg">{{ commitSubject(row) }}</span>
                    <span class="ticker-time">{{ formatStamp(row) }}</span>
                </span>
            </div>
        </div>

        <header class="cockpit-hero">
            <div class="cockpit-hero__text">
                <span class="data-label">REPOSITORY PULSE</span>
                <h1>代码变更</h1>
                <p>追踪 Knowledge Engine 的最新提交。每条 commit 按时间倒序铺在等宽列里，琥珀色只留给关键数据。</p>
            </div>
            <div class="cockpit-hero__meta">
                <span class="meta-chip">{{ branch }}</span>
                <span class="meta-chip" :data-state="isLoading ? 'busy' : 'idle'">
                    <span class="status-dot" :class="{ 'is-busy': isLoading }"></span>
                    {{ isLoading ? '同步中' : '已连接' }}
                </span>
            </div>
        </header>

        <div class="stat-grid">
            <div class="stat-pane">
                <span class="data-label">本页提交</span>
                <strong class="data-value">{{ tableData.length }}</strong>
                <span class="stat-note">per page {{ pageSize }}</span>
            </div>
            <div class="stat-pane">
                <span class="data-label">当前分支</span>
                <strong class="data-value data-value--ink">{{ branch }}</strong>
                <span class="stat-note">mainline</span>
            </div>
            <div class="stat-pane">
                <span class="data-label">每页数量</span>
                <strong class="data-value data-value--ink">{{ pageSize }}</strong>
                <span class="stat-note">per page</span>
            </div>
            <div class="stat-pane">
                <span class="data-label">上次同步</span>
                <strong class="data-value data-value--ink">{{ lastSync || '--:--' }}</strong>
                <span class="stat-note">local time</span>
            </div>
        </div>

        <div class="log-pane">
            <div class="log-head">
                <span class="log-title">RECENT COMMITS · 最近提交</span>
                <span class="log-source">SOURCE: api.github.com/repos/1994-du/vue3</span>
            </div>

            <el-table v-loading="isLoading" :data="tableData" style="width: 100%">
                <el-table-column label="SHA" width="140">
                    <template #default="{ row }">
                        <code class="col-sha">{{ shortSha(row, 12) }}</code>
                    </template>
                </el-table-column>
                <el-table-column prop="commit.author.name" label="Author" width="130" />
                <el-table-column label="Message" min-width="320">
                    <template #default="{ row }">
                        <span class="commit-type" :data-kind="commitType(row)">{{ commitType(row) }}</span>
                        <span class="col-message">{{ commitSubject(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Date" width="170" align="right">
                    <template #default="{ row }">
                        <span class="col-date">{{ formatStamp(row) }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="log-foot">
                <span class="log-count">PAGE <span class="log-count__strong">{{ pageNum }}</span> · TOTAL <span class="log-count__strong">100</span></span>
                <el-pagination :current-page="pageNum" :page-size="pageSize" :total="100" layout="prev, pager, next"
                    @current-change="handlePageChange" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import Axios from 'axios'
import { breadcrumbKey } from '@/utils/breadcrumb'

interface CommitRow {
    sha?: string
    commit?: {
        message?: string
        author?: { name?: string; date?: string }
    }
}

const breadcrumb = inject(breadcrumbKey)

breadcrumb?.setItems([
    { label: '工作台', to: '/home' },
    { label: '代码变更' }
])

const tableData = ref<CommitRow[]>([])
const pageSize = ref(10)
const pageNum = ref(1)
const branch = ref('master')
const isLoading = ref(false)
const lastSync = ref('')

/* 终端行情带要无缝滚动，所以把当前页的提交复制一份接在后面；
   CSS 动画跑 50% 位移，循环时正好接回起点，中间不会露空。 */
const tickerRows = computed<CommitRow[]>(() => {
    if (!tableData.value.length) return []
    return [...tableData.value, ...tableData.value]
})

const shortSha = (row: CommitRow, length: number): string => row.sha?.slice(0, length) ?? ''

/* GitHub 的提交信息遵循 conventional commits：`type(scope): subject`。
   解析出 type 作为彩色芯片，正文只留 subject 一行——终端不做多行折行。 */
const commitType = (row: CommitRow): string => {
    const message = row.commit?.message ?? ''
    const matched = message.match(/^([a-z]+)(\(.+?\))?:/i)
    return matched ? matched[1].toLowerCase() : 'chore'
}

const commitSubject = (row: CommitRow): string => {
    const message = (row.commit?.message ?? '').split('\n')[0]
    return message.replace(/^([a-z]+)(\(.+?\))?:\s*/i, '')
}

/* 固定宽度的时间戳：终端的时间列必须定长，否则等宽字体也救不了对齐。 */
const formatStamp = (row: CommitRow): string => {
    const raw = row.commit?.author?.date
    if (!raw) return ''
    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return ''
    const pad = (value: number): string => String(value).padStart(2, '0')
    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const handlePageChange = (page: number): void => {
    pageNum.value = page
    fetchData()
}

const fetchData = (): void => {
    isLoading.value = true
    Axios.get(`https://api.github.com/repos/1994-du/vue3/commits?per_page=${pageSize.value}&page=${pageNum.value}&sha=${branch.value}`)
        .then((res) => {
            tableData.value = res.data
            const now = new Date()
            const pad = (value: number): string => String(value).padStart(2, '0')
            lastSync.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        .finally(() => {
            isLoading.value = false
        })
}

onMounted(() => {
    fetchData()
})
</script>

<style lang="scss" scoped>
.cockpit {
    min-height: 100%;
    color: var(--text-primary);
}

/* --------------------------------------------------------------------------
   Ticker — the market tape
   ----------------------------------------------------------------------- */

.ticker {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 32px;
    margin: -16px -16px 16px;
    padding: 0 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--hairline);
    overflow: hidden;
    white-space: nowrap;
    font-size: 11px;
}

.ticker-label {
    flex-shrink: 0;
    color: var(--brand);
    font-weight: 500;
    letter-spacing: 0.14em;
}

.ticker-track {
    display: flex;
    gap: 32px;
    animation: ticker-scroll 60s linear infinite;
}

.ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.ticker-sha {
    color: var(--brand);
}

.ticker-msg {
    color: var(--text-secondary);
}

.ticker-time {
    color: var(--text-tertiary);
}

@keyframes ticker-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
    .ticker-track {
        animation: none;
    }
}

/* --------------------------------------------------------------------------
   Hero
   ----------------------------------------------------------------------- */

.cockpit-hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--hairline);
    margin-bottom: 16px;
}

.cockpit-hero__text h1 {
    margin: 6px 0 6px;
    color: var(--text-primary);
    font-size: 22px;
    line-height: 1.15;
    font-weight: 500;
    letter-spacing: -0.01em;
}

.cockpit-hero__text p {
    max-width: 560px;
    margin: 0;
    color: var(--text-tertiary);
    font-size: 12px;
    line-height: 1.7;
}

.cockpit-hero__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 9px;
    color: var(--text-secondary);
    background: var(--surface);
    border: 1px solid var(--hairline);
    font-size: 11px;
    letter-spacing: 0.04em;
}

/* --------------------------------------------------------------------------
   Stat panes — 4-up data grid
   ----------------------------------------------------------------------- */

.stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    border: 1px solid var(--hairline);
    margin-bottom: 16px;
}

.stat-pane {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border-right: 1px solid var(--hairline);
}

.stat-pane:last-child {
    border-right: 0;
}

.stat-note {
    color: var(--text-tertiary);
    font-size: 10px;
    letter-spacing: 0.06em;
}

/* --------------------------------------------------------------------------
   Commit log pane
   ----------------------------------------------------------------------- */

.log-pane {
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.log-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 14px;
    background: var(--table-header-bg);
    border-bottom: 1px solid var(--hairline);
}

.log-title {
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.log-source {
    color: var(--text-tertiary);
    font-size: 10px;
    letter-spacing: 0.06em;
}

.col-sha {
    color: var(--brand);
    font-family: var(--font-mono);
    font-size: 12px;
}

.col-message {
    color: var(--text-secondary);
}

.col-date {
    color: var(--text-tertiary);
    font-size: 11px;
}

.commit-type {
    display: inline-block;
    margin-right: 8px;
    padding: 1px 5px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
    font-size: 10px;
    letter-spacing: 0.04em;
}

.commit-type[data-kind='feat'] {
    color: var(--success);
    border-color: color-mix(in srgb, var(--success) 42%, transparent);
}

.commit-type[data-kind='fix'] {
    color: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 42%, transparent);
}

.commit-type[data-kind='refactor'] {
    color: var(--brand);
    border-color: color-mix(in srgb, var(--brand) 42%, transparent);
}

.log-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 14px;
    background: var(--table-header-bg);
    border-top: 1px solid var(--hairline);
}

.log-count {
    color: var(--text-tertiary);
    font-size: 10px;
    letter-spacing: 0.1em;
}

.log-count__strong {
    color: var(--text-primary);
}

/* --------------------------------------------------------------------------
   Responsive
   ----------------------------------------------------------------------- */

@media (max-width: 900px) {
    .stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .stat-pane:nth-child(2) {
        border-right: 0;
    }

    .stat-pane:nth-child(1),
    .stat-pane:nth-child(2) {
        border-bottom: 1px solid var(--hairline);
    }

    .cockpit-hero {
        align-items: flex-start;
        flex-direction: column;
    }

    .log-source {
        display: none;
    }
}

@media (max-width: 560px) {
    .stat-grid {
        grid-template-columns: 1fr;
    }

    .stat-pane {
        border-right: 0;
        border-bottom: 1px solid var(--hairline);
    }

    .stat-pane:last-child {
        border-bottom: 0;
    }
}
</style>
