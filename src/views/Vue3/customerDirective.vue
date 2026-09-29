<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Custom Directive</span>
                    <h2 class="panel__title">组件搞不定的脏活，交给指令</h2>
                </div>
                <span class="panel__meta">直接操作 DOM 的正规入口</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    组件负责结构和状态，指令负责<em>同一个 DOM 元素的底层行为</em>：聚焦、拖拽、懒加载、
                    权限点隐藏、埋点。
                    它拿到的是真实节点，所以<strong>凡是「要摸 DOM」的需求，指令比组件更顺手</strong>。
                    在 <code>&lt;script setup&gt;</code> 里只要声明 <code>const vXxx = {…}</code>
                    就会被自动注册，连 app.directive 都不用写。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">命名</span>
                        <span class="point__v">变量写 vFocus，模板里就用 v-focus，大小写自动转换</span>
                    </div>
                    <div class="point">
                        <span class="point__k">钩子</span>
                        <span class="point__v">created / beforeMount / mounted / beforeUpdate / updated / beforeUnmount / unmounted</span>
                    </div>
                    <div class="point">
                        <span class="point__k">简化写法</span>
                        <span class="point__v">传函数等于同时写了 mounted 和 updated</span>
                    </div>
                    <div class="point">
                        <span class="point__k">别滥用</span>
                        <span class="point__v">能靠 CSS 或组件状态解决的，不要上指令</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：钩子顺序 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">七个钩子，一次看全</h2>
                </div>
                <span class="panel__meta">日志就是指令里真实打出来的，不是模拟的</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="count++">改绑定值 → updated</button>
                        <button type="button" class="w-btn" @click="shown = !shown">
                            {{ shown ? '卸载元素 → unmounted' : '挂载元素 → mounted' }}
                        </button>
                        <button type="button" class="w-btn" @click="logs = []">清空日志</button>
                    </div>
                    <span class="w-hint">反复挂载/卸载几次，顺序会稳定重复</span>
                </div>

                <div class="stage">
                    <div v-if="shown" v-trace="count" class="stage__box">
                        <span class="stage__box-label mono">v-trace="{{ count }}"</span>
                        <span class="stage__box-text">{{ count }}</span>
                    </div>
                    <div v-else class="stage__empty mono">// 元素已被卸载</div>
                </div>

                <div class="stat-grid">
                    <div v-for="s in hookStats" :key="s.name" class="stat">
                        <span class="stat__label">{{ s.name }}</span>
                        <span class="stat__value mono">{{ s.times || '—' }}</span>
                    </div>
                </div>

                <div class="log-block">
                    <div class="code-block__label">钩子调用日志（最新在上）</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 页面加载时 created → beforeMount → mounted 已经跑过一轮了</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：四把常用指令 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">四个真实在跑的指令</h2>
                </div>
                <span class="panel__meta">含参数、修饰符、函数简写</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">v-focus</h3>
                            <span class="card__tag">mounted 里干活</span>
                        </div>
                        <p class="card__desc">
                            挂载后立刻 <code>el.focus()</code>。注意 Vue 的自动聚焦要等 DOM 插入之后，
                            所以放在 mounted 而不是 created。
                        </p>
                        <input v-if="focusShown" v-focus class="text-input mono" type="text"
                            placeholder="挂载后自动聚焦到这里" />
                        <div class="w-btns" style="margin-top: 10px">
                            <button type="button" class="w-btn" @click="focusShown = !focusShown">
                                {{ focusShown ? '卸载输入框' : '挂载并聚焦' }}
                            </button>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">v-pin:top</h3>
                            <span class="card__tag">带参数 + 修饰符</span>
                        </div>
                        <p class="card__desc">
                            <code>arg</code> 决定贴哪边，<code>modifiers</code> 是那些 <code>.xxx</code>。
                            这里用它在演示块里钉一个小标签。
                        </p>
                        <div class="pin-box">
                            <span v-pin:[dir].warn class="pin-tag mono">{{ dir }}</span>
                            <span class="pin-box__text">这块区域里的标签位置由 v-pin 的参数决定</span>
                        </div>
                        <div class="w-btns" style="margin-top: 10px">
                            <button v-for="d in dirs" :key="d" type="button" class="w-btn"
                                :class="{ 'is-active': dir === d }" @click="dir = d">
                                v-pin:{{ d }}
                            </button>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">v-highlight</h3>
                            <span class="card__tag is-good">函数简写</span>
                        </div>
                        <p class="card__desc">
                            传一个函数而不是对象，等价于把函数同时挂到
                            <code>mounted</code> 和 <code>updated</code> 上。
                            只关心这两个钩子时最省事。
                        </p>
                        <div class="w-btns" style="margin-bottom: 10px">
                            <button type="button" class="w-btn" @click="hl = pickColor()">换个颜色</button>
                        </div>
                        <p v-highlight="hl" class="hl-text mono">这段文字的背景色由 v-highlight="{{ hl }}" 控制</p>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">v-click-outside</h3>
                            <span class="card__tag">unmounted 里收尾</span>
                        </div>
                        <p class="card__desc">
                            给 document 挂监听的典型例子，也最能说明<strong>为什么要写 unmounted</strong>：
                            不解绑就会泄漏一个全局监听器。
                        </p>
                        <div v-click-outside="onOutside" class="outside-box"
                            :class="{ 'is-hot': outsideHit }">
                            {{ outsideHit ? '点到外面了' : '点这里的外面试试' }}
                        </div>
                        <div class="kv-grid" style="margin-top: 10px">
                            <div class="kv"><span class="kv__k">命中次数</span>
                                <span class="kv__v is-ok">{{ outsideCount }}</span></div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ④ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">实验里跑的指令定义</h2>
                </div>
                <span class="panel__meta">与页面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">七个钩子的执行时机</div>
                    <CodeEditor :code="hookCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">四个常用指令的完整实现</div>
                    <CodeEditor :code="implCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, type Directive, type DirectiveBinding } from 'vue'

/* ── 日志 ───────────────────────────────────────────── */
type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 40)
}

/* ── 实验一：记录七个钩子的调用次数与顺序 ───────────── */
const count = ref(0)
const shown = ref(true)

const hookCounts = ref<Record<string, number>>({
    created: 0,
    beforeMount: 0,
    mounted: 0,
    beforeUpdate: 0,
    updated: 0,
    beforeUnmount: 0,
    unmounted: 0,
})

const hookNames = [
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeUnmount',
    'unmounted',
] as const

const hookStats = computed(() =>
    hookNames.map((n) => ({ name: n, times: hookCounts.value[n] })),
)

function hit(name: string, extra = '') {
    hookCounts.value[name] = (hookCounts.value[name] ?? 0) + 1
    push(`${name}${extra ? ' — ' + extra : ''}`, name)
}

// ① 完整对象写法：七个钩子一个不少
const vTrace: Directive<HTMLElement, number> = {
    created(el, binding) {
        hit('created', `value=${binding.value}，此时还没插入 DOM`)
    },
    beforeMount(el) {
        hit('beforeMount', `el.isConnected = ${el.isConnected}`)
    },
    mounted(el, binding) {
        hit('mounted', `已进文档，可以安心操作 DOM（value=${binding.value}）`)
    },
    beforeUpdate(el, binding) {
        hit('beforeUpdate', `oldValue=${binding.oldValue} → value=${binding.value}`)
    },
    updated(el, binding) {
        hit('updated', `DOM 已更新，oldValue=${binding.oldValue}`)
    },
    beforeUnmount(el) {
        hit('beforeUnmount', '元素还在，赶紧做最后的清理')
    },
    unmounted(el) {
        hit('unmounted', '元素已从文档移除')
    },
}

/* ── 实验二 ─────────────────────────────────────────── */
// ② mounted 里聚焦
const focusShown = ref(true)
const vFocus: Directive<HTMLInputElement> = {
    mounted(el) {
        el.focus()
        push('v-focus: mounted 里调用了 el.focus()', 'focus', 'is-ok')
    },
}

// ③ 带 arg 和 modifiers
const dirs = ['top', 'right', 'bottom', 'left'] as const
const dir = ref<(typeof dirs)[number]>('top')
const vPin: Directive<HTMLElement, void> = {
    mounted(el, binding: DirectiveBinding) {
        el.style.position = 'absolute'
        const side = String(binding.arg ?? 'top')
        if (side === 'top') { el.style.top = '8px'; el.style.left = '8px' }
        else if (side === 'right') { el.style.top = '8px'; el.style.right = '8px' }
        else if (side === 'bottom') { el.style.bottom = '8px'; el.style.left = '8px' }
        else { el.style.top = '8px'; el.style.left = 'calc(100% - 70px)' }
        el.dataset.modifiers = Object.keys(binding.modifiers).join(',')
    },
    updated(el, binding: DirectiveBinding) {
        const side = String(binding.arg ?? 'top')
        void side
        void el
    },
}

// ④ 函数简写：等价于 mounted + updated
const hl = ref('#FFA02F')
function pickColor(): string {
    return ['#FFA02F', '#4FC1FF', '#7BC96F', '#E06C75'][Math.floor(Math.random() * 4)]
}
const vHighlight = (el: HTMLElement, binding: DirectiveBinding<string>) => {
    el.style.background = binding.value
    el.style.color = '#111'
}

// ⑤ 全局监听必须在 unmounted 里收尾
const outsideCount = ref(0)
const outsideHit = ref(false)

function onOutside() {
    outsideCount.value += 1
    outsideHit.value = true
    setTimeout(() => { outsideHit.value = false }, 600)
    push('v-click-outside 命中：点了这块区域外面', 'outside', 'is-warn')
}

const vClickOutside: Directive<HTMLElement, () => void> = {
    mounted(el, binding) {
        const handler = (e: MouseEvent) => {
            if (!el.contains(e.target as Node)) binding.value()
        }
        // 把 handler 挂在元素自己身上，unmounted 时才能取回来
        ;(el as HTMLElement & { __clickOutside?: (e: MouseEvent) => void }).__clickOutside = handler
        document.addEventListener('click', handler)
    },
    unmounted(el) {
        const h = (el as HTMLElement & { __clickOutside?: (e: MouseEvent) => void }).__clickOutside
        if (h) document.removeEventListener('click', h)
        push('v-click-outside: unmounted 里移除了 document 监听', 'outside', 'is-ok')
    },
}

/* ── 展示用源码 ─────────────────────────────────────── */
const hookCode = `// <script setup> 里声明 const vXxx 即自动注册，
// 模板中用 v-xxx。对象写法可以覆盖全部七个钩子：
const vTrace: Directive<HTMLElement, number> = {
  created(el, binding) {},        // 元素属性/事件已建立，但还没插入文档
  beforeMount(el) {},             // 和组件自己的 beforeMount 同期
  mounted(el) {},                 // ⭐ 最常用：DOM 就位，可以 focus / 量尺寸 / 初始化库
  beforeUpdate(el) {},            // 组件更新前（还没渲染）
  updated(el) {},                 // ⭐ 组件及其子树全部更新完成后触发
  beforeUnmount(el) {},           // 元素即将被移除，实例还完好
  unmounted(el) {},               // ⭐ 移除事件监听、销毁第三方实例的最后机会
}

// 钩子参数签名：
// (el, binding, vnode, prevVnode)
// binding 里有 value / oldValue / arg / modifiers / instance`

const implCode = `// ① 自动聚焦
const vFocus: Directive<HTMLInputElement> = {
  mounted(el) { el.focus() },
}

// ② 带参数与修饰符：<span v-pin:top.warn>
const vPin: Directive = {
  mounted(el, binding) {
    el.style.position = 'absolute'
    if (binding.arg === 'top') el.style.top = '8px'
    if (binding.modifiers.warn) el.style.color = 'var(--warning)'
  },
}

// ③ 函数简写 —— 等价于同时挂 mounted 和 updated
const vHighlight = (el: HTMLElement, binding: DirectiveBinding<string>) => {
  el.style.background = binding.value
}

// ④ 全局事件必须成对收尾，否则泄漏到下一次 刷新
const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    const handler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    (el as any).__h = handler
    document.addEventListener('click', handler)
  },
  unmounted(el) {
    document.removeEventListener('click', (el as any).__h)
  },
}`
</script>

<style scoped>
.stage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 92px;
    margin-bottom: 14px;
    border: 1px dashed var(--hairline);
    background: var(--surface-subtle);
}

.stage__box {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 12px 18px;
    border: 1px solid var(--brand);
    background: var(--brand-soft);
}

.stage__box-label {
    font-size: 11px;
    color: var(--text-tertiary);
}

.stage__box-text {
    font-family: var(--font-mono);
    font-size: 22px;
    color: var(--brand);
}

.stage__empty {
    font-size: 11px;
    color: var(--text-tertiary);
}

.text-input {
    width: 100%;
    padding: 8px 10px;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--surface-subtle);
    border: 1px solid var(--hairline);
    outline: none;
}

.text-input:focus {
    border-color: var(--brand);
}

.pin-box {
    position: relative;
    min-height: 76px;
    padding: 10px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}

.pin-tag {
    padding: 3px 8px;
    font-size: 11px;
    color: var(--warning);
    border: 1px solid var(--warning);
    background: var(--surface);
}

.pin-box__text {
    display: block;
    margin-top: 34px;
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-tertiary);
}

.hl-text {
    margin: 0;
    padding: 10px 12px;
    font-size: 12px;
    transition: background 0.2s;
}

.outside-box {
    padding: 16px 12px;
    text-align: center;
    font-size: 12px;
    color: var(--text-secondary);
    border: 1px dashed var(--hairline);
    background: var(--surface-subtle);
    transition: border-color 0.15s, color 0.15s;
}

.outside-box.is-hot {
    border-color: var(--brand);
    color: var(--brand);
}

.log-block {
    margin-top: 14px;
}
</style>
