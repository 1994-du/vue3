<template>
    <div class="page render-page">
        <!-- ① 流水线总览 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Render Pipeline</span>
                    <h2 class="panel__title">从源码到像素的六步</h2>
                </div>
                <span class="panel__meta">点击节点查看对应阶段的说明</span>
            </div>
            <div class="panel__body">
                <ol class="pipeline">
                    <template v-for="(step, i) in steps" :key="step.id">
                        <li class="pipeline__item">
                            <button
                                type="button"
                                class="pipe-node"
                                :class="{ 'is-active': activeId === step.id }"
                                @click="locate(step.id)">
                                <span class="pipe-node__no">{{ step.no }}</span>
                                <span class="pipe-node__name">{{ step.name }}</span>
                                <span class="pipe-node__en">{{ step.en }}</span>
                            </button>
                        </li>
                        <li v-if="i < steps.length - 1" class="pipe-arrow" aria-hidden="true">▸</li>
                    </template>
                </ol>
            </div>
        </section>

        <!-- ② 分步详解 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Stage Detail</span>
                    <h2 class="panel__title">分步详解</h2>
                </div>
            </div>
            <div class="panel__body">
                <article
                    v-for="step in steps"
                    :key="step.id"
                    :id="'stage-' + step.id"
                    class="stage"
                    :class="{ 'is-active': activeId === step.id }">
                    <div class="stage__rail">
                        <span class="stage__no">{{ step.no }}</span>
                    </div>
                    <div class="stage__main">
                        <h3 class="stage__title">
                            {{ step.name }}
                            <span class="stage__en">{{ step.en }}</span>
                        </h3>
                        <p class="stage__desc">{{ step.desc }}</p>
                        <ul class="stage__points">
                            <li v-for="point in step.points" :key="point">{{ point }}</li>
                        </ul>
                    </div>
                </article>
            </div>
        </section>

        <!-- ③ 成本模型 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Cost Model</span>
                    <h2 class="panel__title">一次变更要付多少代价</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="cost-grid">
                    <article v-for="cost in costs" :key="cost.en" class="cost">
                        <div class="cost__head">
                            <div class="head-group">
                                <span class="cost__name">{{ cost.name }}</span>
                                <span class="cost__en">{{ cost.en }}</span>
                            </div>
                            <span class="cost__level" :class="cost.levelClass">{{ cost.level }}</span>
                        </div>
                        <p class="cost__desc">{{ cost.desc }}</p>
                        <div class="cost__chips">
                            <code v-for="chip in cost.chips" :key="chip">{{ chip }}</code>
                        </div>
                        <p class="cost__tip">{{ cost.tip }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- ④ 优化清单 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Checklist</span>
                    <h2 class="panel__title">让改动只走最短路径</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="check-grid">
                    <div v-for="item in checklist" :key="item.title" class="check">
                        <span class="check__mark" aria-hidden="true">▸</span>
                        <div>
                            <p class="check__title">{{ item.title }}</p>
                            <p class="check__desc">{{ item.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Stage = {
    id: string
    no: string
    name: string
    en: string
    desc: string
    points: string[]
}

type Cost = {
    name: string
    en: string
    level: string
    levelClass: string
    desc: string
    chips: string[]
    tip: string
}

const steps: Stage[] = [
    {
        id: 'dom',
        no: '01',
        name: '解析 HTML',
        en: 'Parse → DOM',
        desc: '浏览器把收到的字节流按编码解码成字符，经词法分析切成 Token，逐个挂到树上，最终得到 DOM 树。它是页面的结构语义，也是后面一切步骤的输入。',
        points: [
            '解析是增量的：不必等整个文档下载完，先到的部分先处理',
            '无 defer / async 的同步 <script> 会暂停解析，下载执行完才继续',
            'defer 在 DOMContentLoaded 前按序执行，async 下载完即执行，都不阻塞解析',
        ],
    },
    {
        id: 'cssom',
        no: '02',
        name: '解析 CSS',
        en: 'Parse → CSSOM',
        desc: 'CSS 同样被切成 Token 重建为 CSSOM 树，每个节点持有计算后的样式规则。渲染树需要完整样式，所以 CSSOM 没建好之前浏览器不会绘制任何内容。',
        points: [
            '<link> 放在 <head> 中越早出现越好，首屏关键 CSS 可以直接内联',
            '被媒体查询排除的样式表（如 print）不参与计算、不阻塞渲染',
            '选择器从右向左匹配，链路越短计算越快',
        ],
    },
    {
        id: 'render-tree',
        no: '03',
        name: '合并生成渲染树',
        en: 'Attach → Render Tree',
        desc: '从 DOM 的根出发遍历每个可见节点，到 CSSOM 里取回它匹配的规则，合并出渲染树。结构与样式在这里第一次见面。',
        points: [
            'display: none 的子树整个不进渲染树——不布局、不绘制',
            'visibility: hidden 的节点仍在渲染树里：看不见，但占位',
            '::before / ::after 等伪元素也会成为渲染树节点',
        ],
    },
    {
        id: 'layout',
        no: '04',
        name: '布局',
        en: 'Layout / Reflow',
        desc: '从渲染树根递归而下，计算每个节点在视口内的精确几何——位置与大小。这一步的产物是盒模型的坐标与尺寸。',
        points: [
            '几何属性一变就要重新布局，即「重排」，是三种变更里最贵的',
            '改动通常自上而下波及：改 body 宽度等于让整棵树重新布局',
            '只改视觉属性（颜色、阴影等）可以跳过这一步',
        ],
    },
    {
        id: 'paint',
        no: '05',
        name: '绘制',
        en: 'Paint / Rasterize',
        desc: '布局结果被栅格化成真正的像素：填文字、画边框、上阴影，通常按图层分别绘制。改外观属性只需重走这一步，即「重绘」。',
        points: [
            '绘制发生在图层上，阴影、渐变这类复杂元素画起来更贵',
            '重绘面积越大越耗时——这是避免大面积动效的原因',
            '绘制完成后像素仍按图层存放，还没拼成最终画面',
        ],
    },
    {
        id: 'composite',
        no: '06',
        name: '分层合成',
        en: 'Composite',
        desc: '分层技术把不同元素放进不同图层，GPU 按深度顺序把它们拼合成一帧画面输出到屏幕。分层让动画可以只重复合成，不碰布局与绘制。',
        points: [
            'transform / opacity 动画只走合成，主线程保持空闲',
            'will-change 与 3D 变换可以把元素提升为独立图层',
            '图层不是越多越好：每一层都要占显存与合成时间',
        ],
    },
]

const costs: Cost[] = [
    {
        name: '重排',
        en: 'Reflow',
        level: '代价 高',
        levelClass: 'is-high',
        desc: '几何变了，Layout → Paint → Composite 全链路重跑，渲染树可能大面积重新计算。',
        chips: ['width', 'height', 'margin', 'padding', 'top/left', 'font-size'],
        tip: '改法：动画改用 transform；批量改样式，别读写交替造成布局抖动。',
    },
    {
        name: '重绘',
        en: 'Repaint',
        level: '代价 中',
        levelClass: 'is-mid',
        desc: '跳过布局，但受影响的图层要重新栅格化，再送合成。',
        chips: ['color', 'background', 'border-color', 'box-shadow', 'visibility'],
        tip: '改法：控制重绘面积——小范围改色没问题，大面积阴影 / 渐变动效要谨慎。',
    },
    {
        name: '合成',
        en: 'Composite',
        level: '代价 低',
        levelClass: 'is-low',
        desc: '只由合成线程重新拼图层，主线程零参与，通常能稳定跑满 60fps。',
        chips: ['transform', 'opacity', 'filter'],
        tip: '改法：给持续动画的元素提升图层，但要克制，防止图层爆炸吃光显存。',
    },
]

const checklist = [
    {
        title: '动画只用 transform 与 opacity',
        desc: '它们绕过布局和绘制，直接走 GPU 合成，是代价最低的两条动画路径。',
    },
    {
        title: '克制地使用 will-change',
        desc: '只给真正持续动画的元素提升图层，动画结束就移除，避免图层爆炸。',
    },
    {
        title: '消灭布局抖动',
        desc: '别在循环里交替读 offsetWidth、写 style：先批量读，再批量写。',
    },
    {
        title: '别让脚本卡住解析',
        desc: 'CSS 放 <head>、关键样式内联；JS 加 defer / async，避免同步脚本暂停 HTML 解析。',
    },
    {
        title: 'scroll / resize 节流',
        desc: '回调放进 requestAnimationFrame，一帧最多执行一次，别让事件跑在渲染前面。',
    },
    {
        title: '屏外内容先不渲染',
        desc: '长列表用 content-visibility: auto 或虚拟滚动，跳过看不见的布局与绘制。',
    },
]

const activeId = ref<string | null>(null)

function locate(id: string) {
    activeId.value = activeId.value === id ? null : id
    if (!activeId.value) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
        .getElementById('stage-' + id)
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
}
</script>

<style scoped lang="scss">
/* 面包屑组：kicker 在上、标题在下。 */
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* ---- ① 流水线总览 -------------------------------------------------- */

.pipeline {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: stretch;
    gap: 6px;
}

.pipeline__item {
    display: flex;
    flex: 1 1 0;
    min-width: 0;
}

.pipe-arrow {
    flex: 0 0 auto;
    align-self: center;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
    padding: 0 1px;
    user-select: none;
}

.pipe-node {
    flex: 1;
    min-width: 0;
    appearance: none;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    background: transparent;
    border: 1px solid var(--hairline);
    color: inherit;
    cursor: pointer;
    transition: border-color 120ms linear, background-color 120ms linear;
}

.pipe-node:hover,
.pipe-node.is-active {
    border-color: var(--brand);
}

.pipe-node.is-active {
    background: color-mix(in srgb, var(--brand) 8%, transparent);
}

.pipe-node:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}

.pipe-node__no {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--brand);
    font-variant-numeric: tabular-nums;
}

.pipe-node__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pipe-node__en {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ---- ② 分步详解 ---------------------------------------------------- */

.stage {
    display: flex;
    gap: 14px;
    padding: 12px;
    border-left: 2px solid var(--hairline);
    transition: border-color 120ms linear, background-color 120ms linear;
}

.stage + .stage {
    margin-top: 8px;
}

.stage.is-active {
    border-left-color: var(--brand);
    background: color-mix(in srgb, var(--brand) 6%, transparent);
}

.stage__rail {
    flex: 0 0 auto;
    padding-top: 1px;
}

.stage__no {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--text-tertiary);
    font-variant-numeric: tabular-nums;
    transition: color 120ms linear;
}

.stage.is-active .stage__no {
    color: var(--brand);
}

.stage__main {
    flex: 1;
    min-width: 0;
}

.stage__title {
    margin: 0 0 6px;
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.stage__en {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.stage__desc {
    margin: 0 0 8px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--text-secondary);
}

.stage__points {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stage__points li {
    position: relative;
    padding-left: 15px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.stage__points li::before {
    content: '▸';
    position: absolute;
    left: 0;
    top: 3px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--brand);
}

/* ---- ③ 成本模型 ---------------------------------------------------- */

.cost-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.cost {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
}

.cost__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}

.cost__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.cost__en {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.cost__level {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    padding: 2px 8px;
    border: 1px solid currentColor;
}

.cost__level.is-high {
    color: var(--danger);
}

.cost__level.is-mid {
    color: var(--warning);
}

.cost__level.is-low {
    color: var(--success);
}

.cost__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.cost__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.cost__chips code {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
    padding: 2px 6px;
}

.cost__tip {
    margin: 0;
    padding-top: 8px;
    border-top: 1px dashed var(--hairline);
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- ④ 优化清单 ---------------------------------------------------- */

.check-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.check {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
}

.check__mark {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    padding-top: 2px;
    user-select: none;
}

.check__title {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.check__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- Responsive ---------------------------------------------------- */

@media (max-width: 900px) {
    .pipeline {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .pipe-arrow {
        display: none;
    }

    .cost-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 760px) {
    .pipeline {
        grid-template-columns: 1fr;
    }

    .check-grid {
        grid-template-columns: 1fr;
    }
}
</style>
