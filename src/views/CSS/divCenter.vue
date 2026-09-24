<template>
    <div class="page center-page">
        <!-- ① 方案对比 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Methods</span>
                    <h2 class="panel__title">五种居中方案</h2>
                </div>
                <span class="panel__meta">每个演示都是真实运行的对应方案</span>
            </div>
            <div class="panel__body">
                <div class="method-grid">
                    <article v-for="method in methods" :key="method.en" class="method-card">
                        <div class="method-card__head">
                            <div class="head-group">
                                <h3 class="method-card__name">
                                    {{ method.no }} {{ method.name }}
                                    <span class="method-card__en">{{ method.en }}</span>
                                </h3>
                            </div>
                            <span class="method-card__tag">{{ method.tag }}</span>
                        </div>
                        <div class="stage" :class="'s-' + method.cls">
                            <div class="box">DIV</div>
                        </div>
                        <div class="method-card__code">
                            <pre v-for="line in method.code" :key="line">{{ line }}</pre>
                        </div>
                        <p class="method-card__note">{{ method.note }}</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- ② 试验台 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">尺寸变了，还居中吗</h2>
                </div>
                <span class="panel__meta">选「无固定宽高」再切方案，看哪些方案开始失效</span>
            </div>
            <div class="panel__body">
                <div class="pg__controls">
                    <div class="pg__row">
                        <span class="pg__label">方案</span>
                        <div class="pg__btns">
                            <button
                                v-for="m in pgMethods"
                                :key="m.cls"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': pgMethod === m.cls }"
                                @click="pgMethod = m.cls">
                                {{ m.label }}
                            </button>
                        </div>
                    </div>
                    <div class="pg__row">
                        <span class="pg__label">元素</span>
                        <div class="pg__btns">
                            <button
                                v-for="s in pgSizes"
                                :key="s.cls"
                                type="button"
                                class="pg__btn"
                                :class="{ 'is-active': pgSize === s.cls }"
                                @click="pgSize = s.cls">
                                {{ s.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="pg-stage" :class="'s-' + pgMethod">
                    <div class="box" :class="'size-' + pgSize">DIV</div>
                </div>
            </div>
        </section>

        <!-- ③ 选择建议 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">怎么选</h2>
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

type Method = {
    no: string
    name: string
    en: string
    cls: string
    tag: string
    code: string[]
    note: string
}

const methods: Method[] = [
    {
        no: '01',
        name: '绝对定位 + 位移',
        en: 'absolute + translate',
        cls: 'translate',
        tag: '无需知道宽高',
        code: [
            'position: absolute;',
            'top: 50%;',
            'left: 50%;',
            'transform: translate(-50%, -50%);',
        ],
        note: '通解：先定位到中点，再用位移把自己挪回半个宽高。注意 transform 会让元素成为 fixed 后代的包含块。',
    },
    {
        no: '02',
        name: '父元素 Flex',
        en: 'flex',
        cls: 'flex',
        tag: '现代首选',
        code: ['display: flex;', 'justify-content: center;', 'align-items: center;'],
        note: '写在父元素上，子元素不脱离文档流，无需知道宽高，多子元素同样成立。',
    },
    {
        no: '03',
        name: '父元素 Grid',
        en: 'grid',
        cls: 'grid',
        tag: '写法最短',
        code: ['display: grid;', 'place-items: center;'],
        note: 'place-items 是 align-items + justify-items 的合写，一行搞定，效果与 Flex 居中一致。',
    },
    {
        no: '04',
        name: '绝对定位 + 负 margin',
        en: 'absolute + negative margin',
        cls: 'neg',
        tag: '需已知宽高',
        code: [
            'position: absolute;',
            'top: 50%;',
            'left: 50%;',
            'margin-top: -20px;',
            'margin-left: -32px;',
        ],
        note: '偏移量是宽高的一半，写死在 CSS 里——内容尺寸一变就偏，只剩兼容老浏览器的价值。',
    },
    {
        no: '05',
        name: '四边归零 + margin auto',
        en: 'absolute + margin auto',
        cls: 'auto',
        tag: '需显式宽高',
        code: ['position: absolute;', 'inset: 0;', 'margin: auto;'],
        note: 'inset: 0 等价于四边全 0。必须有显式的 width / height，否则 auto 计算不出来，块会被拉满整行。',
    },
]

const pgMethods = [
    { label: 'translate', cls: 'translate' },
    { label: 'flex', cls: 'flex' },
    { label: '负 margin', cls: 'neg' },
    { label: 'margin auto', cls: 'auto' },
]

const pgSizes = [
    { label: '64 × 40', cls: 'm' },
    { label: '96 × 64', cls: 'l' },
    { label: '无固定宽高', cls: 'auto' },
]

const notes = [
    {
        title: '优先 Flex / Grid',
        desc: '不脱离文档流、无需知道宽高、天然适配内容变化；Grid 的 place-items: center 写法最短。',
    },
    {
        title: '脱离文档流就选 translate',
        desc: '需要在叠层里居中时用绝对定位 + 位移；但 transform 会让元素成为 fixed 后代的包含块，嵌套定位时留意。',
    },
    {
        title: '负 margin 与 margin:auto 是昨天的答案',
        desc: '前者把宽高写死，后者必须显式设宽高，改内容就失效。现代场景只剩维护旧代码时会遇到。',
    },
    {
        title: '居中的是盒子，不是内容',
        desc: '块级盒子居中用上面五种方案；行内文本的水平居中是 text-align，单行垂直居中是 line-height，别混用。',
    },
    {
        title: '面试口径',
        desc: '讲清每个方案的适用前提（是否知道宽高、是否脱离文档流、对内容变化的鲁棒性）比背代码更加分。',
    },
]

const pgMethod = ref('flex')
const pgSize = ref('m')
</script>

<style scoped lang="scss">
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* ---- 被居中的元素 -------------------------------------------------- */

.box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 40px;
    background: var(--brand);
    color: var(--app-bg);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
}

.size-m {
    width: 64px;
    height: 40px;
}

.size-l {
    width: 96px;
    height: 64px;
}

/* 无固定宽高：宽度交给内容撑开 —— 负 margin 与 margin:auto 在这里开始失效。 */
.size-auto {
    width: auto;
    height: 32px;
    padding: 0 24px;
}

/* ---- 五种方案的舞台 ------------------------------------------------ */

.stage,
.pg-stage {
    position: relative;
    border: 1px dashed var(--hairline);
    display: flex;
    justify-content: center;
    align-items: center;
}

.stage {
    height: 140px;
}

.pg-stage {
    height: 260px;
}

/* 01 translate：自身定位到中点，再挪回半宽高 */
.s-translate .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 02 flex：父级弹性布局 */
.s-flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 03 grid：一行 place-items */
.s-grid {
    display: grid;
    place-items: center;
}

/* 04 负 margin：偏移量写死为宽高的一半（64×40 → -32 / -20） */
.s-neg .box {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -32px;
}

/* 05 margin auto：四边归零 + auto 回弹，需要显式宽高 */
.s-auto .box {
    position: absolute;
    inset: 0;
    margin: auto;
}

/* ---- ① 方案卡 ------------------------------------------------------ */

.method-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 8px;
}

.method-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
    min-width: 0;
}

.method-card__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}

.method-card__name {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.method-card__en {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.method-card__tag {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--brand);
    border: 1px solid var(--brand);
    padding: 2px 8px;
    white-space: nowrap;
}

.method-card__code {
    border: 1px solid var(--hairline);
    padding: 8px 10px;
    overflow-x: auto;
}

.method-card__code pre {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    line-height: 1.8;
    color: var(--brand);
}

.method-card__note {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ---- ② 试验台 ------------------------------------------------------ */

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
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    width: 44px;
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

/* ---- ③ 选择建议 ---------------------------------------------------- */

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

    .pg-stage {
        height: 200px;
    }
}
</style>
