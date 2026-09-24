<template>
    <div class="page canvas-page">
        <!-- ① 基础概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Concepts</span>
                    <h2 class="panel__title">先搞清四件事</h2>
                </div>
                <span class="panel__meta">绝大多数 Canvas 的「诡异 bug」都出在这四点上</span>
            </div>
            <div class="panel__body">
                <div class="concept-grid">
                    <article v-for="c in concepts" :key="c.title" class="concept">
                        <span class="concept__no">{{ c.no }}</span>
                        <h3 class="concept__title">{{ c.title }}</h3>
                        <p class="concept__desc">{{ c.desc }}</p>
                        <code v-if="c.snippet" class="concept__code">{{ c.snippet }}</code>
                    </article>
                </div>
            </div>
        </section>

        <!-- ② API 地图 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">API Map</span>
                    <h2 class="panel__title">常用 API 分组速查</h2>
                </div>
                <span class="panel__meta">getContext('2d') 之后，画一切都在这套词汇里</span>
            </div>
            <div class="panel__body">
                <div class="api-grid">
                    <article v-for="g in apiGroups" :key="g.name" class="api-group">
                        <div class="api-group__head">
                            <span class="api-group__name">{{ g.name }}</span>
                            <span class="api-group__en">{{ g.en }}</span>
                        </div>
                        <p class="api-group__desc">{{ g.desc }}</p>
                        <div class="api-group__chips">
                            <code v-for="api in g.apis" :key="api">{{ api }}</code>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 动画循环模板 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Animation Loop</span>
                    <h2 class="panel__title">动画循环模板</h2>
                </div>
                <span class="panel__meta">所有 Canvas 动画都是这一个骨架，照抄即可</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <pre v-for="line in loopCode" :key="line.no" class="code-line">
<span class="code-no">{{ line.no }}</span><span :class="{ 'code-cm': line.cm }">{{ line.text }}</span></pre>
                </div>
                <div class="loop-notes">
                    <p>▸ <strong>先排队再画</strong>：进入 frame 第一行就排下一帧，中途报错也不会让循环断掉。</p>
                    <p>▸ <strong>update 与 render 分离</strong>：状态更新和绘制分开写，回放、单步调试都容易。</p>
                    <p>▸ <strong>离开页面必须 cancel</strong>：rAF 循环持有闭包，不取消就是内存泄漏。</p>
                </div>
            </div>
        </section>

        <!-- ④ Canvas vs SVG -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Canvas vs SVG</span>
                    <h2 class="panel__title">什么时候用谁</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="vs-grid">
                    <article class="vs">
                        <div class="vs__head">
                            <span class="vs__name">Canvas</span>
                            <span class="vs__tag is-brand">即时绘制</span>
                        </div>
                        <ul class="vs__list">
                            <li>位图：画完就是像素，放大失真，重绘是唯一更新方式</li>
                            <li>元素多且每帧都变：粒子、游戏、图表、音频可视化</li>
                            <li>像素级操作：滤镜、抠图、取色（getImageData）</li>
                            <li>事件要自己做命中检测（isPointInPath / 手算坐标）</li>
                        </ul>
                    </article>
                    <article class="vs">
                        <div class="vs__head">
                            <span class="vs__name">SVG / DOM</span>
                            <span class="vs__tag">保留模式</span>
                        </div>
                        <ul class="vs__list">
                            <li>矢量：节点在文档里，无损缩放，CSS 可直接改样式</li>
                            <li>元素少且要交互：图标、流程图、可点击的示意图</li>
                            <li>事件原生支持，浏览器替你做命中检测</li>
                            <li>上千个节点会拖垮 DOM，这时才是 Canvas 的主场</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>

        <!-- ⑤ 性能清单 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Checklist</span>
                    <h2 class="panel__title">性能清单</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="note-grid">
                    <div v-for="note in perfNotes" :key="note.title" class="note">
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
/* ---- ① 概念 ---- */
const concepts = [
    {
        no: '01',
        title: '位图，不是矢量',
        desc: '画上去的就是像素，放大失真；想改只能清屏重画。要无损缩放、单个元素可交互，请用 SVG。',
        snippet: '',
    },
    {
        no: '02',
        title: '两套尺寸别混淆',
        desc: 'width / height 属性是绘图缓冲区大小，CSS 决定显示大小；两者不成比例时画面被拉伸模糊。',
        snippet: 'canvas.width = cssW * dpr',
    },
    {
        no: '03',
        title: 'DPR 适配',
        desc: '高分屏上 1 CSS 像素对应多个物理像素：缓冲区按物理像素开，再用 setTransform 把坐标拉回 CSS 像素。',
        snippet: "ctx.setTransform(dpr, 0, 0, dpr, 0, 0)",
    },
    {
        no: '04',
        title: '坐标系与状态机',
        desc: '原点在左上，x 向右 y 向下；变换都围绕原点，先 translate 再 rotate。样式一旦设置就一直生效，直到被覆盖——这是「状态机」心智的来源。',
        snippet: '',
    },
]

/* ---- ② API 分组 ---- */
const apiGroups = [
    {
        name: '状态与变换',
        en: 'State / Transform',
        desc: 'save/restore 成对出现；变换叠加在当前状态上。',
        apis: ['save', 'restore', 'translate', 'rotate', 'scale', 'setTransform'],
    },
    {
        name: '路径',
        en: 'Path',
        desc: 'beginPath 开一段新路径，fill/stroke 才真正落到画布。',
        apis: ['beginPath', 'moveTo', 'lineTo', 'arc', 'rect', 'closePath', 'fill', 'stroke'],
    },
    {
        name: '样式',
        en: 'Style',
        desc: 'fillStyle / strokeStyle 接受任意 CSS 颜色与 CanvasGradient。',
        apis: ['fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'createLinearGradient', 'createRadialGradient', 'createPattern'],
    },
    {
        name: '文本',
        en: 'Text',
        desc: 'font 语法与 CSS font 简写一致；measureText 做自定义排版。',
        apis: ['font', 'fillText', 'strokeText', 'measureText', 'textAlign', 'textBaseline'],
    },
    {
        name: '图像与像素',
        en: 'Image / Pixel',
        desc: 'drawImage 能画 img/canvas/video；getImageData 是唯一的像素读取口。',
        apis: ['drawImage', 'createImageBitmap', 'getImageData', 'putImageData'],
    },
    {
        name: '合成与特效',
        en: 'Composite / FX',
        desc: 'globalCompositeOperation 的 "destination-in" 就是裁剪抠图的原理。',
        apis: ['globalAlpha', 'globalCompositeOperation', 'shadowBlur', 'shadowColor', 'clip'],
    },
]

/* ---- ③ 动画循环模板 ---- */
const loopCode = [
    { no: '01', cm: false, text: 'const dpr = window.devicePixelRatio || 1' },
    { no: '02', cm: false, text: 'canvas.width = cssWidth * dpr          // 缓冲区按物理像素开' },
    { no: '03', cm: false, text: 'ctx.setTransform(dpr, 0, 0, dpr, 0, 0)  // 坐标仍按 CSS 像素画' },
    { no: '04', cm: true, text: '' },
    { no: '05', cm: false, text: 'let rafId: number' },
    { no: '06', cm: false, text: 'function frame() {' },
    { no: '07', cm: false, text: '  rafId = requestAnimationFrame(frame)  // 先排队再画' },
    { no: '08', cm: false, text: '  update()                              // 更新状态' },
    { no: '09', cm: false, text: '  render()                              // 清屏 + 重绘' },
    { no: '10', cm: false, text: '}' },
    { no: '11', cm: false, text: 'rafId = requestAnimationFrame(frame)' },
    { no: '12', cm: true, text: '' },
    { no: '13', cm: false, text: '// 组件卸载 / 离开页面时' },
    { no: '14', cm: false, text: 'cancelAnimationFrame(rafId)' },
]

/* ---- ⑤ 性能清单 ---- */
const perfNotes = [
    {
        title: '分层画布',
        desc: '静止背景与动态前景各一张 canvas 叠放，每帧只重绘变化的那层，省掉大块静态重画。',
    },
    {
        title: '离屏预渲染',
        desc: '不变的复杂图形（图标、雪片、噪点）先画到离屏 canvas，每帧 drawImage 贴上去，比逐个重画快一个量级。',
    },
    {
        title: '别在帧内造对象',
        desc: '渐变、pattern 缓存成变量复用；每帧 new 一个 LinearGradient 是最常见的隐形开销。',
    },
    {
        title: '减少状态切换',
        desc: '同色的图元攒一批一起画；fillStyle / font 的切换都有成本，路径也是能合就合。',
    },
    {
        title: 'rAF，不用 setInterval',
        desc: 'rAF 与屏幕刷新对齐、页面不可见时自动暂停；setInterval 在后台照样跑，切回来一堆积压帧。',
    },
    {
        title: 'getImageData 是同步锁',
        desc: '读像素会阻塞渲染流水线，绝不要每帧读；要反复用就读一次存下来。',
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

/* ---- ① 概念 -------------------------------------------------------- */

.concept-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.concept {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border: 1px solid var(--hairline);
}

.concept__no {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--brand);
    font-variant-numeric: tabular-nums;
}

.concept__title {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.concept__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.concept__code {
    align-self: flex-start;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--brand);
    border: 1px solid var(--hairline);
    padding: 2px 6px;
}

/* ---- ② API 地图 ---------------------------------------------------- */

.api-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.api-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
}

.api-group__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.api-group__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.api-group__en {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.api-group__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.api-group__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.api-group__chips code {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
    padding: 2px 6px;
}

/* ---- ③ 动画模板 ---------------------------------------------------- */

.code-block {
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
    padding: 10px 12px;
    overflow-x: auto;
}

.code-line {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.9;
    white-space: pre;
    color: var(--text-primary);
}

.code-no {
    display: inline-block;
    width: 30px;
    color: var(--text-tertiary);
    user-select: none;
}

.code-cm {
    color: var(--text-tertiary);
}

.loop-notes {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.loop-notes p {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.loop-notes strong {
    font-weight: 500;
    color: var(--text-primary);
}

/* ---- ④ Canvas vs SVG ----------------------------------------------- */

.vs-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.vs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
}

.vs__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.vs__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.vs__tag {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
    padding: 2px 8px;
}

.vs__tag.is-brand {
    color: var(--brand);
    border-color: var(--brand);
}

.vs__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.vs__list li {
    position: relative;
    padding-left: 15px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

.vs__list li::before {
    content: '▸';
    position: absolute;
    left: 0;
    top: 3px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--brand);
}

/* ---- ⑤ 性能清单 ---------------------------------------------------- */

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

@media (max-width: 900px) {
    .api-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    .concept-grid,
    .vs-grid,
    .note-grid,
    .api-grid {
        grid-template-columns: 1fr;
    }
}
</style>
