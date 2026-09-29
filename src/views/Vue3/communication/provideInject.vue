<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">provide / inject</span>
                    <h2 class="panel__title">跳过中间层，直接投喂</h2>
                </div>
                <span class="panel__meta">祖先注册，任意深度的后代按需取用</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    当数据要经过三五层才能到目标组件时，逐层写 props 就成了纯粹的体力活——
                    中间那些组件明明不关心这份数据，却被迫接一遍再传一遍。
                    <code>provide / inject</code> 解决的正是这件事：祖先在自己的
                    <code>setup</code> 里把值登记上去，<em>之后任意深度的后代都能按 key 取出来</em>，
                    中间的组件完全不需要知情。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">响应式</span>
                        <span class="point__v">provide 出去的必须是 ref / reactive，否则后代拿到死值</span>
                    </div>
                    <div class="point">
                        <span class="point__k">受控修改</span>
                        <span class="point__v">推荐 provide 一个 readonly + 修改方法，别让后代直接写</span>
                    </div>
                    <div class="point">
                        <span class="point__k">Symbol key</span>
                        <span class="point__v">大型项目用 Symbol 或单独导出 key，避免字符串撞名</span>
                    </div>
                    <div class="point">
                        <span class="point__k">别滥用</span>
                        <span class="point__v">真正要全局共享的数据应该交给 Pinia</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验一：三层真实组件树 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">中间层什么都不写</h2>
                </div>
                <span class="panel__meta">下面这棵树是真实渲染的组件，不是示意图</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">
                            切换主题
                        </button>
                        <button type="button" class="w-btn" @click="ticketStore.bump()">store.bump()</button>
                        <button type="button" class="w-btn" @click="toggleMid">
                            {{ showMid ? '干掉中间层再装回来' : '把中间层装回来' }}
                        </button>
                    </div>
                    <span class="w-hint">卸载中间层时，injected 组件会走一遍完整的卸载流程</span>
                </div>

                <div class="tree">
                    <div class="nest">
                        <div class="nest__title">
                            RootPanel （本页）
                            <span class="nest__badge">provide('theme') + provide('tickets')</span>
                        </div>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">theme 源值</span>
                                <span class="kv__v is-ok">{{ theme }}</span></div>
                            <div class="kv"><span class="kv__k">tickets 源值</span>
                                <span class="kv__v is-ok">{{ ticketStore.count }}</span></div>
                        </div>

                        <div v-if="showMid" class="nest">
                            <div class="nest__title">
                                MiddleBox
                                <span class="nest__badge">零 props、零 provide</span>
                            </div>
                            <p class="nest__note">
                                这一层的源码里既没接 props 也没写 inject，
                                它唯一做的事就是把更深的组件渲染出来。
                            </p>

                            <div class="nest">
                                <div class="nest__title">
                                    DeepCard
                                    <span class="nest__badge">inject 直达</span>
                                </div>
                                <DeepReader />
                            </div>
                        </div>
                        <div v-else class="nest">
                            <div class="nest__note">// 中间层已卸载，DeepCard 随之销毁</div>
                        </div>
                    </div>
                </div>

                <div class="log-block">
                    <div class="code-block__label">组件创建 / 销毁日志</div>
                    <div class="log-list">
                        <div v-for="l in logs" :key="l.idx" class="log-item" :class="l.tone">
                            <span class="log-item__idx">#{{ l.idx }}</span>
                            <span class="log-item__body">{{ l.msg }}</span>
                            <span class="log-item__note">{{ l.tag }}</span>
                        </div>
                        <div v-if="!logs.length" class="log-empty">// 页面加载时 DeepCard 已经 inject 过一轮了</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 实验二：直接给值 vs 受控提供 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">两种提供方式的差别</h2>
                </div>
                <span class="panel__meta">能不能被后代改，决定了以后好不好排查</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">裸提供 ref</h3>
                            <span class="card__tag is-bad">后代可随意改</span>
                        </div>
                        <p class="card__desc">
                            <code>provide('k', someRef)</code> ——后代拿到后可以直接
                            <code>.value = xxx</code>。数据是谁改的？不知道。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">值</span>
                                <span class="kv__v">{{ loose }}</span></div>
                            <div class="kv"><span class="kv__k">被改次数</span>
                                <span class="kv__v is-bad">{{ looseWrites }}</span></div>
                        </div>
                        <div class="w-btns" style="margin-top: 10px">
                            <button type="button" class="w-btn" @click="childWriteLoose">模拟后代直接写</button>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">readonly + 修改方法</h3>
                            <span class="card__tag is-good">推荐</span>
                        </div>
                        <p class="card__desc">
                            数据是只读的，要改只能走 provide 出来的那个函数。
                            <strong>所有变更都过同一道门</strong>，想打日志、想校验都很方便。
                        </p>
                        <div class="kv-grid">
                            <div class="kv"><span class="kv__k">值</span>
                                <span class="kv__v">{{ strict }}</span></div>
                            <div class="kv"><span class="kv__k">经由方法</span>
                                <span class="kv__v is-ok">{{ strictWrites }} 次</span></div>
                        </div>
                        <div class="w-btns" style="margin-top: 10px">
                            <button type="button" class="w-btn" @click="strictSetter(strict + 1)">
                                setStrict(v + 1)
                            </button>
                            <button type="button" class="w-btn" @click="tryIllegalWrite">试试直接赋值</button>
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
                    <h2 class="panel__title">实验里用到的写法</h2>
                </div>
                <span class="panel__meta">与页面真实运行的逻辑一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">受控 provide —— 官方推荐姿势</div>
                    <CodeEditor :code="controlledCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">注入时的默认值、Symbol key、工厂函数</div>
                    <CodeEditor :code="injectCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, inject, provide, readonly, ref } from 'vue'
import { useTicketStore } from './provideParts'

/* ── 日志 ───────────────────────────────────────────── */
type LogLine = { idx: number; msg: string; tag: string; tone?: string }
const logs = ref<LogLine[]>([])
let seq = 0

function push(msg: string, tag: string, tone?: string) {
    seq += 1
    logs.value = [{ idx: seq, msg, tag, tone }, ...logs.value].slice(0, 30)
}

/* ── provide：主题 + 一个 store ─────────────────────── */
const theme = ref<'dark' | 'light'>('dark')
const setTheme = (t: 'dark' | 'light') => {
    theme.value = t
    push(`祖先组件把 theme 改成 ${t}，所有后代同步收到`, 'provide', 'is-ok')
}

provide('demo-theme', readonly(theme))
provide('demo-setTheme', setTheme)
provide('demo-tickets', readonly(useTicketStore()))

// 本页自己也读同一个 store（readonly 包一层后，嵌套的 ref 会被自动解包，
// 模板里就能直接写 ticketStore.count 而不用 .value）
const ticketStore = readonly(useTicketStore())

/* ── 深层孙子组件：真正做 inject 的地方 ─────────────── */
const DeepReader = defineComponent({
    name: 'DeepReader',
    setup() {
        const t = inject<ReturnType<typeof readonly>>('demo-theme')
        const setT = inject<(v: 'dark' | 'light') => void>('demo-setTheme')
        const tickets = inject<ReturnType<typeof useTicketStore>>('demo-tickets')
        const missing = inject('i-do-not-exist', '这是兜底默认值')

        push('DeepCard setup：inject 三个 key，中间隔了 1 层', 'inject', 'is-ok')
        push(`inject 一个不存在的 key → 拿到默认值「${missing}」`, 'inject')

        const switchLabel = computed(() => (t && 'value' in t ? t.value : String(t)))

        return () =>
            h('div', { class: 'deep' }, [
                h('div', { class: 'kv-grid' }, [
                    h('div', { class: 'kv' }, [
                        h('span', { class: 'kv__k' }, 'inject theme'),
                        h('span', { class: 'kv__v is-ok' }, String(switchLabel.value)),
                    ]),
                    h('div', { class: 'kv' }, [
                        h('span', { class: 'kv__k' }, 'inject tickets'),
                        h('span', { class: 'kv__v is-ok' }, String(tickets?.count ?? '—')),
                    ]),
                    h('div', { class: 'kv' }, [
                        h('span', { class: 'kv__k' }, '兜底默认值'),
                        h('span', { class: 'kv__v is-warn' }, String(missing)),
                    ]),
                ]),
                h(
                    'div',
                    { class: 'w-btns', style: 'margin-top:10px' },
                    [
                        h(
                            'button',
                            {
                                type: 'button',
                                class: 'w-btn',
                                onClick: () => setT?.(switchLabel.value === 'dark' ? 'light' : 'dark'),
                            },
                            '后代里调 setTheme',
                        ),
                        h(
                            'button',
                            {
                                type: 'button',
                                class: 'w-btn',
                                onClick: () => tickets?.bump(),
                            },
                            '后代里调 tickets.bump()',
                        ),
                    ],
                ),
            ])
    },
})

const showMid = ref(true)

function toggleMid() {
    showMid.value = !showMid.value
    push(showMid.value ? '中间层重新挂载，DeepCard 随之重建' : '中间层卸载，DeepCard 一起销毁', 'lifecycle',
        showMid.value ? 'is-ok' : 'is-warn')
}

/* ── 实验二 ─────────────────────────────────────────── */
const loose = ref(0)
const looseWrites = ref(0)
provide('loose-counter', loose)

function childWriteLoose() {
    loose.value += 1
    looseWrites.value += 1
    push('某个后代直接改了 loose.value —— 数据源头不明', 'write', 'is-bad')
}

const strictInner = ref(0)
const strictWrites = ref(0)
const strictSetter = (v: number) => {
    strictInner.value = v
    strictWrites.value += 1
    push(`走 setStrict(${v}) 修改，来源明确可追溯`, 'write', 'is-ok')
}
provide('strict-counter', readonly(strictInner))
provide('strict-setter', strictSetter)

const strict = computed(() => strictInner.value)

function tryIllegalWrite() {
    const s = inject<ReturnType<typeof readonly>>('strict-counter')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(s as any).value = 999
    push('尝试绕过后直接写 readonly 的 inject 值 → 控制台会警告且不生效', 'write', 'is-bad')
}

/* ── 展示用源码 ─────────────────────────────────────── */
const controlledCode = `// ① 祖先：把「值」和「改法」一起给出去
<script setup lang="ts">
import { provide, readonly, ref } from 'vue'

const theme = ref<'dark' | 'light'>('dark')

// 值用 readonly 包一层：后代只能读
provide('theme', readonly(theme))
// 改法单独提供：所有变更都从这里过
provide('setTheme', (t: 'dark' | 'light') => {
  theme.value = t
})
<\/script>

// ② 任意深度的后代
<script setup lang="ts">
import { inject, type Ref } from 'vue'

const theme = inject<Readonly<Ref<'dark' | 'light'>>>('theme')
const setTheme = inject<(t: 'dark' | 'light') => void>('setTheme')

setTheme?.('light')        // ✅ 走正规通道
theme!.value = 'x'         // ⚠️ 写了不生效，控制台只给警告
<\/script>`

const injectCode = `// ① 拿不到时的兜底默认值
const theme = inject('theme', 'light')

// ② 默认值也可以是个工厂（第三个参数表示「当默认值」）
const cache = inject('cache', () => new Map(), true)

// ③ 大型项目推荐用 Symbol 做 key，彻底避免字符串撞名
// keys.ts
export const THEME_KEY = Symbol('theme') as InjectionKey<Ref<string>>
// 祖先
provide(THEME_KEY, theme)
// 后代 —— inject 会自动推断出 Ref<string> 类型
const theme = inject(THEME_KEY)

// ④ 一次性 provide 多个值：把一整个对象塞进去也是常见做法
provide('form', {
  values: readonly(values),
  errors: readonly(errors),
  setValue,
  validate,
})`
</script>

<style scoped>
.tree {
    margin-top: 4px;
}

.nest__note {
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}

.deep {
    padding: 10px;
    border: 1px solid var(--brand);
    background: var(--brand-soft);
}

.log-block {
    margin-top: 14px;
}
</style>
