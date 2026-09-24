<template>
    <div class="page clip-page">
        <!-- ① 基本形状库 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Basic Shapes</span>
                    <h2 class="panel__title">四种基本形状</h2>
                </div>
                <span class="panel__meta">鼠标悬停预览块，查看形状之间的过渡</span>
            </div>
            <div class="panel__body">
                <div class="shape-grid">
                    <article v-for="shape in shapes" :key="shape.en" class="shape-card">
                        <div class="shape-card__demo" :class="'demo--' + shape.en">
                            <div class="blob" :class="'blob--' + shape.en"></div>
                        </div>
                        <h3 class="shape-card__name">
                            {{ shape.no }} {{ shape.name }}
                            <span class="shape-card__en">{{ shape.en }}</span>
                        </h3>
                        <code class="shape-card__syntax">clip-path: {{ shape.syntax }};</code>
                        <p class="shape-card__desc">{{ shape.desc }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- ② 试验台 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">试验台</h2>
                </div>
                <span class="panel__meta">同一函数之间平滑插值，跨函数（如 circle → polygon）直接跳变</span>
            </div>
            <div class="panel__body pg">
                <div class="pg__stage">
                    <div class="blob blob--live" :style="{ clipPath: current }"></div>
                </div>
                <div class="pg__side">
                    <div class="pg__btns">
                        <button
                            v-for="preset in presets"
                            :key="preset.label"
                            type="button"
                            class="pg__btn"
                            :class="{ 'is-active': currentLabel === preset.label }"
                            @click="apply(preset)">
                            {{ preset.label }}
                        </button>
                    </div>
                    <code class="pg__code">clip-path: {{ current }};</code>
                </div>
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
import { ref } from 'vue'

/* 五角星与旋转 36° 后的五角星：同一组 10 个顶点只转角度，点数相同才能插值。
   SCSS 与试验台按钮各要用一份，值必须保持一致。 */
const STAR =
    'polygon(50% 0%, 61.2% 34.6%, 97.6% 34.5%, 68.2% 55.9%, 79.4% 90.5%, 50% 69.1%, 20.6% 90.5%, 31.8% 55.9%, 2.4% 34.5%, 38.8% 34.6%)'
const STAR_ROTATED =
    'polygon(79.4% 9.5%, 68.2% 44.1%, 97.6% 65.5%, 61.2% 65.4%, 50% 100%, 38.8% 65.4%, 2.4% 65.5%, 31.8% 44.1%, 20.6% 9.5%, 50% 30.9%)'

type ShapeInfo = {
    no: string
    name: string
    en: string
    syntax: string
    desc: string
}

type Preset = {
    label: string
    value: string
}

const shapes: ShapeInfo[] = [
    {
        no: '01',
        name: '圆形',
        en: 'circle',
        syntax: 'circle(50% at 50% 50%)',
        desc: 'circle(半径 at 圆心)。悬停看半径收成 25% —— 同函数之间可以平滑过渡。',
    },
    {
        no: '02',
        name: '椭圆',
        en: 'ellipse',
        syntax: 'ellipse(50% 35% at 50% 50%)',
        desc: 'ellipse(水平半轴 垂直半轴 at 圆心)。悬停把椭圆压扁成一条缝。',
    },
    {
        no: '03',
        name: '矩形 / 圆角矩形',
        en: 'inset',
        syntax: 'inset(0 round 0)',
        desc: 'inset(四边内缩 round 圆角)，语义类似 padding。悬停内缩并长出大圆角。',
    },
    {
        no: '04',
        name: '多边形',
        en: 'polygon',
        syntax: 'polygon(x1 y1, x2 y2, …)',
        desc: '一组顶点坐标，能画出任意直边形状。悬停是同一组顶点旋转 36° 的五角星——点数相同即可插值。',
    },
]

const presets: Preset[] = [
    { label: '圆形', value: 'circle(50% at 50% 50%)' },
    { label: '椭圆', value: 'ellipse(50% 35% at 50% 50%)' },
    { label: '矩形', value: 'inset(0 round 0)' },
    { label: '圆角矩形', value: 'inset(12% round 18px)' },
    { label: '三角形', value: 'polygon(50% 0%, 100% 100%, 0% 100%)' },
    { label: '菱形', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    { label: '五角星', value: STAR },
    { label: '旋转五角星', value: STAR_ROTATED },
]

const current = ref(STAR)
const currentLabel = ref('五角星')

function apply(preset: Preset) {
    current.value = preset.value
    currentLabel.value = preset.label
}

const notes = [
    {
        title: '裁掉的不只是像素',
        desc: '裁剪区域外完全不可见，连点击、悬停事件也收不到——这点和 opacity: 0 完全不同。',
    },
    {
        title: '过渡与动画的插值条件',
        desc: '只有同一形状函数且坐标数相同时（polygon ↔ polygon 且点数一致）才能平滑插值，否则直接跳变。',
    },
    {
        title: '裁剪不影响布局',
        desc: '元素仍占据原来的盒子空间，周围内容不会因裁剪回流。需要改占位就动 margin 或尺寸。',
    },
    {
        title: 'path() 与响应式',
        desc: 'path() 能写任意 SVG 路径，但坐标只接受 px，不能像基本形状那样用百分比自适应。',
    },
    {
        title: '兼容性',
        desc: '现代浏览器全支持基本形状；旧 Safari 需要 -webkit-clip-path 前缀。',
    },
    {
        title: '调试技巧',
        desc: '在 DevTools 里勾选元素的 clip-path 值可实时改参数；配合 :hover 规则能直接看过渡效果。',
    },
]
</script>

<style scoped lang="scss">
/* 五角星与旋转 36° 后的五角星：同一组 10 个顶点，只转角度 —— 点数相同才能插值。 */
$star: polygon(
    50% 0%,
    61.2% 34.6%,
    97.6% 34.5%,
    68.2% 55.9%,
    79.4% 90.5%,
    50% 69.1%,
    20.6% 90.5%,
    31.8% 55.9%,
    2.4% 34.5%,
    38.8% 34.6%
);
$star-rotated: polygon(
    79.4% 9.5%,
    68.2% 44.1%,
    97.6% 65.5%,
    61.2% 65.4%,
    50% 100%,
    38.8% 65.4%,
    2.4% 65.5%,
    31.8% 44.1%,
    20.6% 9.5%,
    50% 30.9%
);

.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* 被裁剪的形状本体：只用令牌色。 */
.blob {
    width: 96px;
    height: 96px;
    background: var(--brand);
    transition: clip-path 450ms ease;
}

/* ---- ① 基本形状库 -------------------------------------------------- */

.shape-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
}

.shape-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
}

.shape-card__demo {
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--hairline);
}

.shape-card__name {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.shape-card__en {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.shape-card__syntax {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    line-height: 1.6;
    color: var(--brand);
    word-break: break-all;
}

.shape-card__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* hover 变换：circle ↔ circle、ellipse ↔ ellipse、inset ↔ inset 都可插值。 */
.demo--circle:hover .blob--circle {
    clip-path: circle(25% at 50% 50%);
}

.demo--ellipse:hover .blob--ellipse {
    clip-path: ellipse(45% 12% at 50% 50%);
}

.demo--inset:hover .blob--inset {
    clip-path: inset(12% round 28px);
}

/* 五角星 → 旋转 36°：顶点数相同，动画是一段平滑的旋转。 */
.demo--polygon:hover .blob--polygon {
    clip-path: $star-rotated;
}

.blob--circle {
    clip-path: circle(50% at 50% 50%);
}

.blob--ellipse {
    clip-path: ellipse(50% 35% at 50% 50%);
}

.blob--inset {
    clip-path: inset(0 round 0);
}

.blob--polygon {
    clip-path: $star;
}

/* ---- ② 试验台 ------------------------------------------------------ */

.pg {
    display: flex;
    gap: 16px;
    align-items: stretch;
    flex-wrap: wrap;
}

.pg__stage {
    flex: 0 0 auto;
    width: 200px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--hairline);
    background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 19px,
        color-mix(in srgb, var(--hairline) 55%, transparent) 19px,
        color-mix(in srgb, var(--hairline) 55%, transparent) 20px
    );
}

.blob--live {
    width: 160px;
    height: 160px;
}

.pg__side {
    flex: 1;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
}

.pg__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.pg__btn {
    appearance: none;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    padding: 6px 12px;
    cursor: pointer;
    transition: border-color 120ms linear, color 120ms linear, background-color 120ms linear;
}

.pg__btn:hover {
    border-color: var(--brand);
    color: var(--text-primary);
}

.pg__btn.is-active {
    border-color: var(--brand);
    color: var(--brand);
    background: color-mix(in srgb, var(--brand) 8%, transparent);
}

.pg__btn:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}

.pg__code {
    display: block;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.8;
    color: var(--brand);
    border: 1px solid var(--hairline);
    padding: 8px 10px;
    word-break: break-all;
}

/* ---- ③ 使用要点 ---------------------------------------------------- */

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

@media (max-width: 1100px) {
    .shape-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    .shape-grid,
    .note-grid {
        grid-template-columns: 1fr;
    }

    .pg {
        flex-direction: column;
    }

    .pg__stage {
        width: 100%;
    }
}
</style>
