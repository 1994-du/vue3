<template>
    <div class="page theme-page">
        <!-- ① 现场演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Live Demo</span>
                    <h2 class="panel__title">图片主题色提取</h2>
                </div>
                <span class="panel__meta">缩小采样 → 颜色量化 → 频次统计，虚线框颜色即每张图的主导色</span>
            </div>
            <div class="panel__body">
                <div class="theme-grid">
                    <theme-img v-for="value in source" :key="value.id" :src="value.src"></theme-img>
                </div>
            </div>
        </section>

        <!-- ② 提取流程 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Pipeline</span>
                    <h2 class="panel__title">四步取出主导色</h2>
                </div>
            </div>
            <div class="panel__body">
                <ol class="chain">
                    <li v-for="(step, i) in chain" :key="step.title" class="chain__item">
                        <span class="chain__no">{{ String(i + 1).padStart(2, '0') }}</span>
                        <div>
                            <p class="chain__title">
                                {{ step.title }}
                                <code v-if="step.api" class="chain__api">{{ step.api }}</code>
                            </p>
                            <p class="chain__desc">{{ step.desc }}</p>
                        </div>
                    </li>
                </ol>
            </div>
        </section>

        <!-- ③ 使用要点 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">使用要点</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="note-grid">
                    <div v-for="note in notes" :key="note.title" class="note">
                        <span class="note__mark" aria-hidden="true">▸</span>
                        <div>
                            <p class="note__title">{{ note.title }}</p>
                            <p class="note__desc">{{ note.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import themeImg from './components/theme-img.vue'

const source = [
    { id: 1, src: new URL('@/assets/1.jpg', import.meta.url).href },
    { id: 2, src: new URL('@/assets/22.png', import.meta.url).href },
    { id: 3, src: new URL('@/assets/kenan.png', import.meta.url).href },
    { id: 4, src: new URL('@/assets/vue.svg', import.meta.url).href },
]

const chain = [
    {
        title: '画到小画布上重采样',
        api: 'drawImage(img, 0, 0, w, h, 0, 0, 64, 64)',
        desc: '无论原图多大，先压成 64×64：几百万像素变四千，抗锯齿自带去噪，getImageData 也快。',
    },
    {
        title: '读出像素数据',
        api: 'getImageData(0, 0, 64, 64)',
        desc: '拿到 Uint8ClampedArray，每 4 个字节一个像素（r, g, b, a）。',
    },
    {
        title: '颜色量化分桶',
        api: "(r >> 3) << 10 | (g >> 3) << 5 | (b >> 3)",
        desc: '每个通道取高 5 位拼成一个 key（32768 个桶），相近颜色落进同一桶累计频次。',
    },
    {
        title: '取最高频桶',
        desc: '频次最高的桶就是主导色；统计前过滤半透明（a < 125）与近白像素，白底图才不会提出白色。',
    },
]

const notes = [
    {
        title: '跨域画布是只读的',
        desc: '别人域名的图没配 CORS 头时，画布被「污染」，getImageData 直接抛 SecurityError——必须 try/catch 兜底。',
    },
    {
        title: 'crossorigin 要配套',
        desc: 'img 上加 crossorigin="anonymous" 只是申请，服务端返回 Access-Control-Allow-Origin 才真的放行，两者缺一不可。',
    },
    {
        title: '缓存命中没有 onload',
        desc: '图片已在缓存里时 onload 不会再触发，先判 img.complete，命中就立刻提取。',
    },
    {
        title: '量化粒度可调',
        desc: '桶越细（高位越多）颜色越准但越分散；取高 5 位是「准」与「聚」的平衡点，纯色 logo 可以调细。',
    },
    {
        title: '主色不等于平均色',
        desc: '直接平均所有像素会得到一坨脏灰色；「分桶 + 频次」取出的是真实出现过的颜色，观感完全不同。',
    },
    {
        title: '典型用途',
        desc: '专辑封面配色边框、图片占位底色、按封面色分区换肤——本页的虚线框就是第一个用途的现场演示。',
    },
]
</script>

<style scoped lang="scss">
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* ---- ① 演示 -------------------------------------------------------- */

.theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 8px;
}

/* ---- ② 提取流程 ---------------------------------------------------- */

.chain {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
}

.chain__item {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    border-left: 2px solid var(--hairline);
}

.chain__item + .chain__item {
    border-top: 1px dashed var(--hairline);
}

.chain__no {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--brand);
    padding-top: 2px;
    font-variant-numeric: tabular-nums;
}

.chain__title {
    margin: 0 0 3px;
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.chain__api {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
    padding: 1px 6px;
    word-break: break-all;
}

.chain__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- ③ 要点 -------------------------------------------------------- */

.note-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.note {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
}

.note__mark {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    padding-top: 2px;
    user-select: none;
}

.note__title {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.note__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- Responsive ---------------------------------------------------- */

@media (max-width: 760px) {
    .note-grid {
        grid-template-columns: 1fr;
    }
}
</style>
