<template>
    <section ref="pageRootRef" class="home-page">
        <header class="home-page__hero">
            <div>
                <span class="home-page__kicker">REPOSITORY PULSE</span>
                <h1>代码变更</h1>
                <p>追踪 Knowledge Engine 的最新提交，快速了解工作区正在发生什么。</p>
            </div>
            <div class="home-page__meta">
                <span class="home-page__branch">{{ branch }}</span>
                <span class="home-page__sync" :class="{ 'is-loading': isLoading }">
                    <i aria-hidden="true"></i>
                    {{ isLoading ? '同步中' : '已连接' }}
                </span>
            </div>
        </header>

        <div class="home-page__stats" aria-label="提交概览">
            <div class="home-page__stat">
                <span>本页提交</span>
                <strong>{{ tableData.length }}</strong>
            </div>
            <div class="home-page__stat">
                <span>当前分支</span>
                <strong>{{ branch }}</strong>
            </div>
            <div class="home-page__stat">
                <span>每页数量</span>
                <strong>{{ pageSize }}</strong>
            </div>
        </div>

        <div class="home-page__table-shell">
            <div class="home-page__table-heading">
                <div>
                    <span class="home-page__section-kicker">RECENT COMMITS</span>
                    <h2>最近提交</h2>
                </div>
                <span class="home-page__table-note">GitHub API</span>
            </div>
            <el-table
                v-loading="isLoading"
                :data="tableData"
                style="width: 100%"
                border
                stripe
                :header-cell-style="{ background: 'var(--surface-subtle)', color: 'var(--text-primary)', fontWeight: 'bold' }"
                :cell-style="{ color: 'var(--text-secondary)' }"
                :row-class-name="(row, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')">
                <el-table-column prop="sha" label="SHA" width="300">
                    <template #default="{ row }">
                        <code class="commit-sha">{{ row.sha?.slice(0, 12) }}</code>
                    </template>
                </el-table-column>
                <el-table-column prop="commit.author.name" label="Author" width="150" />
                <el-table-column prop="commit.message" label="Message" min-width="280" show-overflow-tooltip />
                <el-table-column prop="commit.author.date" label="Date" width="200">
                    <template #default="{ row }">
                        <span class="commit-date">{{ new Date(row.commit.author.date).toLocaleString() }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="home-page__pagination">
                <el-pagination
                    :current-page="pageNum"
                    :page-size="pageSize"
                    :total="100"
                    layout="prev, pager, next"
                    @current-change="(page) => { pageNum = page; fetchData(); }" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Axios from 'axios';
import { gsap } from 'gsap'

const pageRootRef = ref<HTMLElement | null>(null)
const tableData = ref<any[]>([])
const pageSize = ref(10)
const pageNum = ref(1)
const branch = ref('master')
const isLoading = ref(false)
let pageAnimationMedia: ReturnType<typeof gsap.matchMedia> | null = null

onMounted(() => {
    pageAnimationMedia = gsap.matchMedia()
    pageAnimationMedia.add(
        { reduceMotion: '(prefers-reduced-motion: reduce)' },
        ({ conditions }) => {
            if (conditions.reduceMotion || !pageRootRef.value) return
            gsap.from('.home-page__hero > *, .home-page__stats > *, .home-page__table-shell', {
                autoAlpha: 0,
                y: 16,
                duration: 0.46,
                ease: 'power3.out',
                stagger: 0.07,
                clearProps: 'transform,opacity,visibility'
            })
        },
        pageRootRef.value
    )
    fetchData()
})

onUnmounted(() => {
    pageAnimationMedia?.revert()
})

const fetchData = () => {
    isLoading.value = true
    Axios.get(`https://api.github.com/repos/1994-du/vue3/commits?per_page=${pageSize.value}&page=${pageNum.value}&sha=${branch.value}`)
        .then((res) => {
            tableData.value = res.data
        })
        .finally(() => {
            isLoading.value = false
        })
}
</script>

<style lang="scss" scoped>
.home-page {
    min-height: 100%;
    padding: clamp(4px, 1vw, 12px);
    color: var(--text-primary);
}

.home-page__hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    padding: 8px 4px 24px;
}

.home-page__kicker,
.home-page__section-kicker {
    display: block;
    color: var(--brand);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
}

.home-page__hero h1 {
    margin: 8px 0 6px;
    font-size: clamp(24px, 2vw, 34px);
    line-height: 1.15;
    letter-spacing: 0;
}

.home-page__hero p {
    max-width: 620px;
    margin: 0;
    color: var(--text-tertiary);
    font-size: 13px;
    line-height: 1.7;
}

.home-page__meta {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
}

.home-page__branch,
.home-page__sync,
.home-page__table-note {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 9px;
    color: var(--text-secondary);
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xs);
    font-size: 11px;
    font-weight: 700;
}

.home-page__sync i {
    width: 6px;
    height: 6px;
    display: block;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--success) 14%, transparent);
}

.home-page__sync.is-loading i {
    background: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
}

.home-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
}

.home-page__stat {
    min-height: 82px;
    padding: 15px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface);
}

.home-page__stat span {
    color: var(--text-tertiary);
    font-size: 11px;
    font-weight: 700;
}

.home-page__stat strong {
    color: var(--text-primary);
    font-size: 22px;
    line-height: 1;
}

.home-page__table-shell {
    overflow: hidden;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
}

.home-page__table-heading {
    min-height: 72px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid var(--border-color);
}

.home-page__table-heading h2 {
    margin: 5px 0 0;
    color: var(--text-primary);
    font-size: 16px;
    line-height: 1.3;
}

.commit-sha {
    color: var(--brand);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
}

.commit-date {
    color: var(--text-tertiary);
    font-size: 12px;
}

.home-page__pagination {
    min-height: 58px;
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid var(--border-color);
    background: var(--surface-subtle);
}

@media (max-width: 700px) {
    .home-page__hero {
        align-items: flex-start;
        flex-direction: column;
        padding-bottom: 18px;
    }

    .home-page__meta {
        width: 100%;
    }

    .home-page__stats {
        gap: 7px;
    }

    .home-page__stat {
        min-height: 72px;
        padding: 12px;
    }

    .home-page__stat strong {
        font-size: 18px;
    }

    .home-page__table-heading {
        padding: 14px;
    }
}

@media (max-width: 480px) {
    .home-page__stats {
        grid-template-columns: 1fr;
    }

    .home-page__stat {
        min-height: 60px;
        gap: 8px;
    }

    .home-page__table-note {
        display: none;
    }
}
</style>
