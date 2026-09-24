<template>
    <div class="page audio-page">
        <!-- ① 现场演示 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Live Demo</span>
                    <h2 class="panel__title">音频频谱可视化</h2>
                </div>
                <span class="panel__meta">点播放开始绘制 —— 数据来自 Web Audio 分析器的频域采样</span>
            </div>
            <div class="panel__body">
                <div ref="stageRef" class="stage">
                    <canvas ref="canvasRef"></canvas>
                    <span v-if="!playing" class="stage__hint">▸ 点击下方播放按钮</span>
                </div>
                <div class="audio-bar">
                    <audio ref="audioRef" controls :src="audioUrl" @play="onPlay" @pause="onPause"></audio>
                </div>
            </div>
        </section>

        <!-- ② 数据链路 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Pipeline</span>
                    <h2 class="panel__title">一次播放的数据链路</h2>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import audioUrl from '@/assets/demo1.mp3'

/* ---- 主题令牌：画布读不到 CSS 变量，挂载时读一次，切主题重读 ---- */
function readBrand(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#FFA02F'
}
let brand = readBrand()

const stageRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)
const playing = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let buffer: Uint8Array | null = null
let rafId: number | null = null

/* 缓冲区 = CSS 尺寸 × dpr，坐标用 setTransform 拉回 CSS 像素 */
function resize() {
    const stage = stageRef.value
    const canvas = canvasRef.value
    if (!stage || !canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(stage.clientWidth * dpr)
    canvas.height = Math.round(stage.clientHeight * dpr)
    ctx = canvas.getContext('2d')
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

/* 音频图：一个 media element 只能建一次 source，用 audioCtx 存在性守卫 */
function ensureAudioGraph() {
    const audio = audioRef.value
    if (!audio) return
    if (audioCtx) {
        if (audioCtx.state === 'suspended') void audioCtx.resume()
        return
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AC()
    const source = audioCtx.createMediaElementSource(audio)
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 512
    buffer = new Uint8Array(analyser.frequencyBinCount)
    source.connect(analyser)
    analyser.connect(audioCtx.destination)
}

function draw() {
    rafId = requestAnimationFrame(draw)
    if (!ctx || !analyser || !buffer) return
    const stage = stageRef.value
    if (!stage) return
    const w = stage.clientWidth
    const h = stage.clientHeight

    ctx.clearRect(0, 0, w, h)
    analyser.getByteFrequencyData(buffer as unknown as Uint8Array<ArrayBuffer>)

    /* 只取前 40% 频段（乐音集中区），左右镜像铺满 */
    const len = Math.floor(buffer.length / 2.5)
    const count = len * 2
    const barW = w / count
    ctx.fillStyle = brand
    for (let i = 0; i < len; i++) {
        const barH = (buffer[i] / 255) * (h - 8)
        const x1 = i * barW + w / 2
        const x2 = w / 2 - (i + 1) * barW
        const y = h - barH
        const bw = Math.max(barW - 2, 1)
        ctx.fillRect(x1, y, bw, barH)
        ctx.fillRect(x2, y, bw, barH)
    }
}

function onPlay() {
    ensureAudioGraph()
    playing.value = true
    if (rafId === null) draw()
}

function onPause() {
    playing.value = false
    if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
}

/* ---- 数据链路说明 ---- */
const chain = [
    {
        title: '播放中的媒体流',
        api: '<audio>',
        desc: 'audio 元素自身照常出声，只是把它的输出「分一路」给音频图。',
    },
    {
        title: '变成音频源节点',
        api: 'createMediaElementSource()',
        desc: '把元素接进 Web Audio；一个元素只能接一次，重复调用会抛错。',
    },
    {
        title: '接上分析器',
        api: 'createAnalyser() · fftSize = 512',
        desc: 'fftSize 是 FFT 窗口：512 → frequencyBinCount 256 个频率桶。',
    },
    {
        title: '每帧读频域能量',
        api: 'getByteFrequencyData()',
        desc: '把 0-255 的能量值写进 Uint8Array，配 rAF 每帧读一次。',
    },
    {
        title: '清屏 → 画对称柱 → 下一帧',
        api: 'requestAnimationFrame()',
        desc: '柱高 = 能量 / 255 × 画布高；索引左右镜像，形成对称频谱。',
    },
]

/* ---- 要点 ---- */
const notes = [
    {
        title: 'AudioContext 要等用户手势',
        desc: '浏览器自动播放策略下，新建的 Context 可能是 suspended 状态，必须在 play 等手势回调里 resume()。',
    },
    {
        title: '一个元素只能建一次源',
        desc: 'createMediaElementSource 对同一元素二次调用直接抛错——用「Context 是否已存在」做守卫，别用布尔标记裸判。',
    },
    {
        title: 'fftSize 决定分辨率取舍',
        desc: 'fftSize 越大频率划分越细、但响应越迟钝；512 / 1024 是可视化常用档位。',
    },
    {
        title: '只画前 40% 频段',
        desc: '高频段大多接近静默，全画会是一排矮柱；取 buffer.length / 2.5 再左右镜像，视觉重心更稳。',
    },
    {
        title: '乘 devicePixelRatio',
        desc: '缓冲区按物理像素开、setTransform 拉回 CSS 坐标，Retina 屏上柱子边缘才不会发虚。',
    },
    {
        title: '卸载要收尾',
        desc: 'cancelAnimationFrame + audioCtx.close()，否则离开页面后音频图和 rAF 循环都还挂着。',
    },
]

/* ---- 生命周期 ---- */
let themeObserver: MutationObserver | null = null

function onResize() {
    resize()
}

onMounted(() => {
    resize()
    themeObserver = new MutationObserver(() => {
        brand = readBrand()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    onPause()
    themeObserver?.disconnect()
    themeObserver = null
    window.removeEventListener('resize', onResize)
    void audioCtx?.close()
    audioCtx = null
    analyser = null
    buffer = null
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

.stage {
    position: relative;
    height: 200px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.stage canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
}

.stage__hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--text-tertiary);
    pointer-events: none;
}

.audio-bar {
    margin-top: 10px;
    border: 1px solid var(--hairline);
    padding: 8px 10px;
    background: var(--surface-subtle);
}

.audio-bar audio {
    width: 100%;
    display: block;
}

/* ---- ② 数据链路 ---------------------------------------------------- */

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

    .stage {
        height: 160px;
    }
}
</style>
