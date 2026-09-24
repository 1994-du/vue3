<template>
    <div class="page snow-page">
        <!-- ① 现场演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Live Demo</span>
                    <h2 class="panel__title">粒子雪幕</h2>
                </div>
                <span class="panel__meta">requestAnimationFrame 驱动的经典粒子系统：状态 → update → draw</span>
            </div>
            <div class="panel__body">
                <div class="pg__controls">
                    <div class="pg__row">
                        <span class="pg__label">密度</span>
                        <div class="pg__btns">
                            <button
                                v-for="d in densities"
                                :key="d.value"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': density === d.value }"
                                @click="density = d.value">
                                {{ d.label }}
                            </button>
                        </div>
                    </div>
                    <div class="pg__row">
                        <span class="pg__label">风向</span>
                        <div class="pg__btns">
                            <button
                                v-for="w in winds"
                                :key="w.value"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': wind === w.value }"
                                @click="wind = w.value">
                                {{ w.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div ref="stageRef" class="stage">
                    <canvas ref="canvasRef"></canvas>
                </div>
            </div>
        </section>

        <!-- ② 使用要点 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">全屏背景怎么做、怎么不卡</h2>
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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

/* ---- 主题令牌 ---- */
function readTheme() {
    const s = getComputedStyle(document.documentElement)
    const v = (n: string) => s.getPropertyValue(n).trim()
    return {
        surface: v('--surface-raised') || '#11172A',
        text: v('--text-primary') || '#E8ECF4',
    }
}
let theme = readTheme()

/* hex → rgba，雪片颜色要带透明度 */
function alpha(color: string, a: number): string {
    const hex = color.trim()
    if (!hex.startsWith('#')) return hex
    const full = hex.length === 4 ? hex.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3') : hex
    const n = parseInt(full.slice(1), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* ---- 粒子状态 ---- */
type Flake = { x: number; y: number; r: number; vy: number; phase: number }

const stageRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let flakes: Flake[] = []
let rafId: number | null = null

const densities = [
    { label: '稀疏', value: 60 },
    { label: '常规', value: 150 },
    { label: '密集', value: 300 },
]
const winds = [
    { label: '无风', value: 0 },
    { label: '左飘', value: -0.6 },
    { label: '右飘', value: 0.6 },
]
const density = ref(150)
const wind = ref(0)

function makeFlake(w: number, fromTop = false): Flake {
    return {
        x: Math.random() * w,
        y: fromTop ? -Math.random() * 20 : Math.random() * 340,
        r: Math.random() * 1.8 + 0.8,
        vy: Math.random() * 0.9 + 0.35,
        phase: Math.random() * Math.PI * 2,
    }
}

function rebuild() {
    const stage = stageRef.value
    if (!stage) return
    flakes = Array.from({ length: density.value }, () => makeFlake(stage.clientWidth))
}

function resize() {
    const stage = stageRef.value
    const canvas = canvasRef.value
    if (!stage || !canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(stage.clientWidth * dpr)
    canvas.height = Math.round(stage.clientHeight * dpr)
    ctx = canvas.getContext('2d')
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    /* 尺寸变了之后把越界粒子收回顶部 */
    for (const f of flakes) {
        if (f.x > stage.clientWidth) f.x = Math.random() * stage.clientWidth
    }
}

function frame() {
    rafId = requestAnimationFrame(frame)
    if (!ctx) return
    const stage = stageRef.value
    if (!stage) return
    const w = stage.clientWidth
    const h = stage.clientHeight

    /* 不透明底色清屏：铺在 panel 里，不透明才不会透出下层 */
    ctx.fillStyle = theme.surface
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = alpha(theme.text, 0.85)

    for (const f of flakes) {
        f.phase += 0.02
        f.x += wind.value + Math.sin(f.phase) * 0.4
        f.y += f.vy
        if (f.y - f.r > h) {
            f.y = -f.r * 2
            f.x = Math.random() * w
        }
        if (f.x < -4) f.x = w + 4
        else if (f.x > w + 4) f.x = -4
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
    }
}

/* ---- 要点 ---- */
const notes = [
    {
        title: '经典粒子系统三件套',
        desc: '粒子状态（位置 / 半径 / 速度）+ update() 更新 + draw() 绘制，rAF 每帧走一遍。所有 Canvas 动画都是这个骨架。',
    },
    {
        title: '清屏的两招',
        desc: 'fillRect 铺不透明底色最省事；要拖影效果就铺半透明底（globalAlpha 叠加），透明底则用 clearRect 配 CSS 背景。',
    },
    {
        title: '做全屏页面背景',
        desc: 'canvas 设 position: fixed; inset: 0; z-index: -1（或做一个 pointer-events: none 的装饰层），内容照常排版，别把内容画进画布。',
    },
    {
        title: 'rAF 必须能停',
        desc: '组件卸载要 cancelAnimationFrame，否则循环和闭包内存一起泄漏；本页在 onBeforeUnmount 收尾，离开页面循环即停。',
    },
    {
        title: '粒子数就是每帧成本',
        desc: '粒子是 O(n) 逐个画圆；上百个之后把「不变的雪片」预渲染到离屏 canvas，每帧 drawImage 贴图会快一个量级。',
    },
    {
        title: 'sin 相位做自然摆动',
        desc: '每片雪一个 phase，x += sin(phase) × 0.4 让下落自带左右摇曳；比每帧随机抖动顺眼得多，成本为零。',
    },
]

/* ---- 生命周期 ---- */
let themeObserver: MutationObserver | null = null

function onResize() {
    resize()
}

onMounted(() => {
    resize()
    rebuild()
    if (rafId === null) frame()
    themeObserver = new MutationObserver(() => {
        theme = readTheme()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
})

watch(density, rebuild)

onBeforeUnmount(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
    themeObserver?.disconnect()
    themeObserver = null
    window.removeEventListener('resize', onResize)
    flakes = []
})
</script>

<style scoped lang="scss">
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* ---- ① 演示 -------------------------------------------------------- */

.pg__controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.pg__row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.pg__label {
    flex-shrink: 0;
    width: 44px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
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

.stage {
    position: relative;
    height: 340px;
    border: 1px solid var(--hairline);
}

.stage canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
}

/* ---- ② 要点 -------------------------------------------------------- */

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

    .stage {
        height: 260px;
    }
}
</style>
