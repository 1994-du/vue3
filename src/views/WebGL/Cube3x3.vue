<template>
    <div class="cube-page">
        <header class="page-head">
            <p class="kicker">WebGL / THREE.JS</p>
            <h1>三阶魔方 · Rubik's Cube</h1>
            <p class="subtitle">拖动贴纸转层 · 拖动空白处旋转视角 · 滚轮缩放</p>
        </header>

        <div class="cube-layout">
            <div class="stage panel">
                <div ref="stageEl" class="stage-canvas"></div>
                <transition name="pop">
                    <div v-if="solvedFlash" class="solved-banner">已复原 🎉 {{ moves }} 步 · {{ timeText }}</div>
                </transition>
            </div>

            <aside class="side">
                <section class="panel ctrl">
                    <p class="panel-title">Controls · 操作</p>
                    <div class="btn-row">
                        <button class="btn primary" :disabled="busy" @click="scramble">打乱</button>
                        <button class="btn" :disabled="busy" @click="resetCube">复原</button>
                    </div>
                    <dl class="stats">
                        <div><dt>步数</dt><dd class="mono">{{ moves }}</dd></div>
                        <div><dt>用时</dt><dd class="mono">{{ timeText }}</dd></div>
                        <div><dt>状态</dt><dd>{{ statusText }}</dd></div>
                    </dl>
                </section>

                <section class="panel">
                    <p class="panel-title">How to · 玩法</p>
                    <ul class="howto">
                        <li><strong>转动一层</strong>：按住某个贴纸沿面拖动约 1/3 格，该层顺势转 90°；斜着乱拖不触发</li>
                        <li><strong>中间层</strong>：拖中间那圈（棱块/中心块）可以单独转中层，和真实魔方一致</li>
                        <li><strong>旋转视角</strong>：在魔方以外的空白处拖动</li>
                        <li><strong>缩放</strong>：滚轮（或触控板）向前推近、向后拉远</li>
                        <li><strong>复原判定</strong>：六面各 9 块贴纸同色即复原，计时自动停止</li>
                    </ul>
                </section>

                <section class="panel">
                    <p class="panel-title">Notes · 实现要点</p>
                    <ul class="howto dim">
                        <li>27 个 cubie（含完全不可见的内核），贴纸为圆角 <code class="mono">ShapeGeometry</code>，内面深色、外面着色</li>
                        <li>转层用临时 pivot：<code class="mono">attach</code> 进出保留世界变换，结束后坐标取整、旋转矩阵元素就近吸附到 -1/0/1</li>
                        <li>层号取抓取 cubie 沿轴的坐标（-1 / 0 / 1），所以中层可单独转</li>
                        <li>拖拽方向经「面法线 × 拖拽向量」求旋转轴，吸附主轴后需置信度 &gt; 0.8 才执行</li>
                        <li>复原检测：54 张贴纸法线经 cubie 四元数变换后按朝向分桶，每桶 9 色一致</li>
                    </ul>
                </section>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
// @ts-ignore examples 目录无独立类型入口
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
const T = THREE as any

const stageEl = ref<HTMLDivElement | null>(null)
const moves = ref(0)
const elapsedMs = ref(0)
const solvedFlash = ref(false)
const busy = ref(false)
const scrambled = ref(false)

const timeText = computed(() => {
    const s = Math.floor(elapsedMs.value / 1000)
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})
const statusText = computed(() => {
    if (busy.value) return '转动中…'
    if (!scrambled.value) return '已复原'
    if (timing) return '还原中…'
    return '已打乱 · 等待第一步'
})

/* ---------- 常量 ---------- */
const SPACING = 1.0           // 相邻 cubie 中心距，坐标只有 -1 / 0 / 1 三档
const SIZE = 0.96             // cubie 方块边长
const FACE_DIRS: Record<string, { dir: [number, number, number], color: number }> = {
    px: { dir: [1, 0, 0], color: 0xe33b30 },   // 右 红
    nx: { dir: [-1, 0, 0], color: 0xff8a1e },  // 左 橙（品牌色系）
    py: { dir: [0, 1, 0], color: 0xf5f7fa },   // 上 白
    ny: { dir: [0, -1, 0], color: 0xffcf33 },  // 下 黄
    pz: { dir: [0, 0, 1], color: 0x2eb85c },   // 前 绿
    nz: { dir: [0, 0, -1], color: 0x2e7fe0 },  // 后 蓝
}

let scene: any, camera: any, renderer: any, cubeGroup: any, raycaster: any, ndc: any
let cubies: any[] = []
let stickers: { mesh: any, cubie: any, base: any, color: number }[] = []
let pivot: any
let animationId = 0
let timerId: number | undefined

/* 拖拽状态机：orbit 转视角 / pending 等待判定转哪层 */
let drag: null | {
    mode: 'orbit' | 'pending',
    x: number, y: number,
    cubie?: any, pointW?: any, normalW?: any,
} = null

/* 首次交互前的缓慢自转，用于第一印象 */
let autoRotate = true

/* 转层动画：pivot 从 0° 缓动到 ±90° */
let spin: null | {
    axis: any, target: number, t: number, dur: number, layer: any[], onDone: () => void,
} = null
const moveQueue: { axis: 'x' | 'y' | 'z', layer: -1 | 0 | 1, dir: 1 | -1 }[] = []

/* ---------- 场景 ---------- */
const initScene = () => {
    const el = stageEl.value!
    const w = el.clientWidth, h = el.clientHeight

    scene = new T.Scene()
    camera = new T.PerspectiveCamera(42, w / h, 0.1, 100)
    camera.position.set(5.6, 5.2, 7.1)
    camera.lookAt(0, 0, 0)

    renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    scene.add(new T.AmbientLight(0xffffff, 0.85))
    const key = new T.DirectionalLight(0xffffff, 2.1)
    key.position.set(5, 8, 6)
    scene.add(key)
    const fill = new T.DirectionalLight(0xffb35c, 0.55)
    fill.position.set(-6, -2, -4)
    scene.add(fill)
    const rim = new T.DirectionalLight(0x6fa8ff, 0.7)
    rim.position.set(-4, 6, -7)
    scene.add(rim)

    // 底部软阴影：径向渐变贴图，不随魔方翻转
    const shadowTex = (() => {
        const c = document.createElement('canvas')
        c.width = c.height = 256
        const ctx = c.getContext('2d')!
        const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 126)
        g.addColorStop(0, 'rgba(0,0,0,0.42)')
        g.addColorStop(0.55, 'rgba(0,0,0,0.16)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 256, 256)
        return new T.CanvasTexture(c)
    })()
    const shadow = new T.Mesh(
        new T.PlaneGeometry(5.6, 5.6),
        new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -2.15
    scene.add(shadow)

    cubeGroup = new T.Group()
    scene.add(cubeGroup)
    pivot = new T.Group()
    cubeGroup.add(pivot)

    raycaster = new T.Raycaster()
    ndc = new T.Vector2()

    buildCubes()
}

const roundedSquareGeo = (() => {
    let cached: any = null
    return () => {
        if (cached) return cached
        const s = 0.39, r = 0.1
        const sh = new T.Shape()
        sh.moveTo(-s + r, -s)
        sh.lineTo(s - r, -s); sh.quadraticCurveTo(s, -s, s, -s + r)
        sh.lineTo(s, s - r); sh.quadraticCurveTo(s, s, s - r, s)
        sh.lineTo(-s + r, s); sh.quadraticCurveTo(-s, s, -s, s - r)
        sh.lineTo(-s, -s + r); sh.quadraticCurveTo(-s, -s, -s + r, -s)
        cached = new T.ShapeGeometry(sh, 6)
        return cached
    }
})()

const buildCubes = () => {
    const bodyMat = new T.MeshStandardMaterial({ color: 0x0b0e15, roughness: 0.32, metalness: 0.45 })
    const bodyGeo = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 4, 0.07)
    const stickerGeo = roundedSquareGeo()
    const colorMats: Record<number, any> = {}

    for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) {
        const cubie = new T.Group()
        cubie.position.set(x * SPACING, y * SPACING, z * SPACING)
        cubie.userData.isCubie = true
        cubie.add(new T.Mesh(bodyGeo, bodyMat))

        const coord = new T.Vector3(x, y, z)
        for (const key of Object.keys(FACE_DIRS)) {
            const { dir, color } = FACE_DIRS[key]
            const d = new T.Vector3(dir[0], dir[1], dir[2])
            // 只有位于最外侧（坐标点积为 1）的面才贴贴纸，内部块无贴纸
            if (coord.dot(d) !== 1) continue
            if (!colorMats[color]) colorMats[color] = new T.MeshPhysicalMaterial({
                color, roughness: 0.28, metalness: 0.02,
                clearcoat: 0.65, clearcoatRoughness: 0.3,
            })
            const st = new T.Mesh(stickerGeo, colorMats[color])
            st.position.copy(d).multiplyScalar(SIZE / 2 + 0.004)
            st.lookAt(d.clone().multiplyScalar(2))
            cubie.add(st)
            stickers.push({ mesh: st, cubie, base: d, color })
        }
        cubeGroup.add(cubie)
        cubies.push(cubie)
    }
}

/* ---------- 转层 ---------- */
const snapCubie = (c: any) => {
    const snap = (v: number) => Math.round(v / SPACING) * SPACING
    c.position.set(snap(c.position.x), snap(c.position.y), snap(c.position.z))
    const m = new T.Matrix4().makeRotationFromQuaternion(c.quaternion)
    const e = m.elements
    for (let i = 0; i < 16; i++) e[i] = Math.round(e[i])
    c.quaternion.setFromRotationMatrix(m)
}

const startSpin = (axis: 'x' | 'y' | 'z', layer: -1 | 0 | 1, dir: 1 | -1, onDone: () => void, dur = 200) => {
    const axisVec = new T.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0)
    const members = cubies.filter(c => Math.round(c.position[axis] / SPACING) === layer)
    pivot.quaternion.identity()
    pivot.updateMatrixWorld(true)
    members.forEach(c => pivot.attach(c))
    spin = { axis: axisVec, target: dir * Math.PI / 2, t: 0, dur, layer: members, onDone }
}

const finishSpin = () => {
    if (!spin) return
    pivot.setRotationFromAxisAngle(spin.axis, spin.target)
    pivot.updateMatrixWorld(true)
    spin.layer.forEach(c => { cubeGroup.attach(c); snapCubie(c) })
    const done = spin.onDone
    spin = null
    done()
}

const enqueue = (axis: 'x' | 'y' | 'z', layer: -1 | 0 | 1, dir: 1 | -1) => moveQueue.push({ axis, layer, dir })

/* ---------- 复原检测 ---------- */
const checkSolved = () => {
    const dirs = Object.values(FACE_DIRS).map(f => new T.Vector3(...(f.dir as [number, number, number])))
    for (const d of dirs) {
        let color = -1
        let count = 0
        for (const st of stickers) {
            const wn = st.base.clone().applyQuaternion(st.cubie.quaternion)
            if (wn.dot(d) < 0.9) continue
            count++
            if (color < 0) color = st.color
            else if (color !== st.color) return false
        }
        if (count !== 9) return false
    }
    return true
}

/* ---------- 计时 ---------- */
let timerStart = 0
let timing = false
const startTimer = () => {
    if (timing) return
    timing = true
    timerStart = Date.now() - elapsedMs.value
    timerId = window.setInterval(() => { elapsedMs.value = Date.now() - timerStart }, 250)
}
const stopTimer = () => {
    timing = false
    if (timerId !== undefined) { clearInterval(timerId); timerId = undefined }
}

/* ---------- 指针交互 ---------- */
const setNdc = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect()
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
}

const handleDown = (e: PointerEvent) => {
    if (!renderer) return
    autoRotate = false
    setNdc(e)
    raycaster.setFromCamera(ndc, camera)
    const hits = raycaster.intersectObjects(cubies, true)
    renderer.domElement.setPointerCapture(e.pointerId)

    if (hits.length && !spin && moveQueue.length === 0) {
        const hit = hits[0]
        let obj: any = hit.object
        while (obj && !obj.userData.isCubie) obj = obj.parent
        const normalW = hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
        drag = { mode: 'pending', x: e.clientX, y: e.clientY, cubie: obj, pointW: hit.point.clone(), normalW }
    } else {
        drag = { mode: 'orbit', x: e.clientX, y: e.clientY }
    }
}

const handleMove = (e: PointerEvent) => {
    if (!drag) return

    if (drag.mode === 'orbit') {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y
        drag.x = e.clientX; drag.y = e.clientY
        const qy = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), dx * 0.0045)
        const qx = new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), dy * 0.0045)
        cubeGroup.quaternion.premultiply(qy).premultiply(qx)
        return
    }

    /* pending：把拖拽投影到贴纸所在平面，超过阈值即判定旋转轴与层 */
    setNdc(e)
    raycaster.setFromCamera(ndc, camera)
    const plane = new T.Plane().setFromNormalAndCoplanarPoint(drag.normalW, drag.pointW)
    const cur = new T.Vector3()
    if (!raycaster.ray.intersectPlane(plane, cur)) return
    const dragVec = cur.sub(drag.pointW)
    // 阈值：约 1/3 个方块（0.18 太灵敏，轻微抖动就会转层）
    if (dragVec.length() < 0.34) return

    // 世界系旋转轴 = 面法线 × 拖拽方向，再变回 cubeGroup 本地系并吸附主轴
    const axisW = drag.normalW.clone().cross(dragVec).normalize()
    const invQ = cubeGroup.quaternion.clone().invert()
    const axisL = axisW.clone().applyQuaternion(invQ)
    const AXES: [('x' | 'y' | 'z'), any][] = [['x', new T.Vector3(1, 0, 0)], ['y', new T.Vector3(0, 1, 0)], ['z', new T.Vector3(0, 0, 1)]]
    let best: [('x' | 'y' | 'z'), any] = AXES[0]
    let bestDot = -2
    for (const cand of AXES) {
        for (const s of [1, -1] as const) {
            const dot = axisL.dot(cand[1].clone().multiplyScalar(s))
            if (dot > bestDot) { bestDot = dot; best = cand }
        }
    }
    const [axisName, axisVecL] = best
    // 方向置信：斜着乱拖（吸附后点积偏低）不执行，避免误转
    if (bestDot < 0.8) return
    const layer = (Math.round(drag.cubie.position[axisName] / SPACING) as -1 | 0 | 1)

    // 方向：本地主轴经 cubeGroup 变换后与拖拽世界轴同向则 +90°，反向则 -90°
    const worldOfLocal = axisVecL.clone().applyQuaternion(cubeGroup.quaternion)
    const dir: 1 | -1 = worldOfLocal.dot(axisW) > 0 ? 1 : -1

    drag = null
    moves.value++
    if (scrambled.value) startTimer()
    busy.value = true
    startSpin(axisName, layer, dir, () => {
        busy.value = false
        if (scrambled.value && checkSolved()) {
            scrambled.value = false
            stopTimer()
            solvedFlash.value = true
            setTimeout(() => { solvedFlash.value = false }, 2600)
        }
    })
}

const handleUp = () => { drag = null }

const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const z = camera.position.length()
    const next = Math.min(15, Math.max(5.4, z + e.deltaY * 0.0025))
    camera.position.multiplyScalar(next / z)
}

/* ---------- 打乱 / 复原 ---------- */
const scramble = () => {
    if (busy.value || moveQueue.length) return
    stopTimer()
    elapsedMs.value = 0
    moves.value = 0
    scrambled.value = true
    busy.value = true

    let lastAxis = ''
    for (let i = 0; i < 25; i++) {
        const axis = (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)]
        const layer: -1 | 0 | 1 = ([1, 0, -1] as const)[Math.floor(Math.random() * 3)]
        const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
        if (axis === lastAxis) { i--; continue }
        lastAxis = axis
        enqueue(axis, layer, dir)
    }
}

const resetCube = () => {
    if (busy.value || moveQueue.length) return
    moveQueue.length = 0
    spin = null
    cubies.forEach((c, i) => {
        c.position.set(
            (Math.floor(i / 9) - 1) * SPACING,
            (Math.floor((i % 9) / 3) - 1) * SPACING,
            (i % 3 - 1) * SPACING,
        )
        c.quaternion.identity()
    })
    cubeGroup.quaternion.identity()
    moves.value = 0
    elapsedMs.value = 0
    scrambled.value = false
    stopTimer()
}

/* ---------- 主循环 ---------- */
const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (autoRotate && !spin && !moveQueue.length && !drag) {
        const q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), 0.0028)
        cubeGroup.quaternion.premultiply(q)
    }

    if (!spin && moveQueue.length) {
        const mv = moveQueue.shift()!
        startSpin(mv.axis, mv.layer, mv.dir, () => {
            busy.value = moveQueue.length > 0
        }, 140)
    }

    if (spin) {
        spin.t += 16.7
        const k = Math.min(1, spin.t / spin.dur)
        // easeOutBack：轻微回弹，转层更有「咔哒」手感
        const c1 = 1.4
        const ease = 1 + (c1 + 1) * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2)
        pivot.setRotationFromAxisAngle(spin.axis, spin.target * ease)
        if (k >= 1) finishSpin()
    }

    renderer.render(scene, camera)
}

const handleResize = () => {
    const el = stageEl.value
    if (!el || !renderer) return
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(el.clientWidth, el.clientHeight)
}

onMounted(() => {
    initScene()
    animate()
    const el = stageEl.value!
    el.addEventListener('pointerdown', handleDown)
    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerup', handleUp)
    el.addEventListener('pointercancel', handleUp)
    el.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    stopTimer()
    const el = stageEl.value
    if (el) {
        el.removeEventListener('pointerdown', handleDown)
        el.removeEventListener('pointermove', handleMove)
        el.removeEventListener('pointerup', handleUp)
        el.removeEventListener('pointercancel', handleUp)
        el.removeEventListener('wheel', handleWheel)
    }
    window.removeEventListener('resize', handleResize)
    if (renderer) renderer.dispose()
    cubies = []
    stickers = []
})
</script>

<style scoped lang="scss">
.cube-page {
    padding: 28px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.page-head {
    h1 {
        margin: 6px 0 6px;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.06em;
        color: var(--text-primary);
    }

    .subtitle {
        margin: 0;
        color: var(--text-tertiary);
        font-size: 12px;
        letter-spacing: 0.04em;
    }
}

.cube-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 14px;
    align-items: start;
}

.stage {
    position: relative;
    overflow: hidden;
}

.stage-canvas {
    height: min(62vh, 560px);
    min-height: 380px;
    touch-action: none;
    cursor: grab;
    /* 舞台渐晕：中心微微提亮，四周沉下去，突出魔方主体 */
    background:
        radial-gradient(ellipse 70% 55% at 50% 44%,
            color-mix(in srgb, var(--brand) 7%, transparent),
            transparent 70%),
        radial-gradient(ellipse 120% 100% at 50% 50%,
            transparent 55%,
            color-mix(in srgb, var(--app-bg) 55%, transparent) 100%);

    &:active {
        cursor: grabbing;
    }

    canvas {
        display: block;
    }
}

.solved-banner {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 18px;
    background: var(--brand);
    color: var(--app-bg);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    z-index: 5;
}

.pop-enter-active,
.pop-leave-active {
    transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-6px);
}

.side {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.panel-title {
    margin: 0 0 12px;
    font-size: 11px;
    letter-spacing: 0.14em;
    color: var(--text-tertiary);
    text-transform: uppercase;
}

.btn-row {
    display: flex;
    gap: 10px;
}

.btn {
    flex: 1;
    max-width: 150px;
    padding: 8px 0;
    font-size: 12px;
    letter-spacing: 0.14em;
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--hairline-strong);
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);

    &:hover:not(:disabled) {
        border-color: var(--brand);
        color: var(--brand);
    }

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &.primary {
        background: var(--brand);
        border-color: var(--brand);
        color: var(--app-bg);

        &:hover:not(:disabled) {
            background: var(--brand-hover);
            color: var(--app-bg);
        }
    }
}

.stats {
    margin: 16px 0 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    div {
        border: 1px solid var(--hairline);
        padding: 8px 10px;
    }

    dt {
        font-size: 11px;
        color: var(--text-tertiary);
        margin-bottom: 4px;
    }

    dd {
        margin: 0;
        font-size: 14px;
        color: var(--text-primary);
    }
}

.howto {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);

    strong {
        color: var(--text-primary);
        font-weight: 600;
    }

    code {
        color: var(--brand);
        font-size: 11px;
    }

    &.dim {
        color: var(--text-tertiary);
    }
}

@media (max-width: 980px) {
    .cube-layout {
        grid-template-columns: 1fr;
    }
}
</style>
