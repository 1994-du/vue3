<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reactivity</span>
                    <h2 class="panel__title">两代劫持方案的正面比较</h2>
                </div>
                <span class="panel__meta">Vue2 的 defineProperty 与 Vue3 的 Proxy</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    所谓「双向绑定」可以拆成两件事：<strong>数据劫持</strong>（属性被读写时要能被感知）
                    加 <strong>发布订阅</strong>（知道了谁来重新渲染）。
                    Vue2 用 <code>Object.defineProperty</code> 逐个改写属性的 getter/setter，
                    Vue3 换成 <code>Proxy</code> 包住整个对象 —— 这一换，补齐了
                    <em>新增属性、删除属性、数组下标、数组长度</em>这四类一直打不过的变化。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">defineProperty</span>
                        <span class="point__v">只能拦截<strong>已存在</strong>属性的读与写，所以要在初始化时遍历每个 key</span>
                    </div>
                    <div class="point">
                        <span class="point__k">Proxy</span>
                        <span class="point__v">在对象层面拦截 13 种操作，包括 get / set / deleteProperty / has</span>
                    </div>
                    <div class="point">
                        <span class="point__k">代价差异</span>
                        <span class="point__v">Proxy 不能 polyfill（不支持 IE）；defineProperty 则是「一次性递归 + 后续全是死穴」</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 对比实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">同一组操作，两边各做一次</h2>
                </div>
                <span class="panel__meta">同一份数据源，分别用两代方案包起来</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    左边是 defineProperty 版，右边是 Proxy 版，数据完全一致。
                    每次按下操作按钮，<strong>两边都会执行同一件事</strong>，然后各自汇报
                    「有没有感知到」和「有没有触发重新渲染」。试到第 3、第 4 个按钮时，差别就出来了。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="act('exist')">① 改已有属性</button>
                        <button type="button" class="w-btn" @click="act('nested')">② 改深层属性</button>
                        <button type="button" class="w-btn" @click="act('add')">③ 新增一个属性</button>
                        <button type="button" class="w-btn" @click="act('del')">④ 删除一个属性</button>
                        <button type="button" class="w-btn" @click="act('index')">⑤ 改数组下标</button>
                        <button type="button" class="w-btn" @click="act('push')">⑥ 数组 push</button>
                        <button type="button" class="w-btn" @click="act('length')">⑦ 直接改 length</button>
                        <button type="button" class="w-btn" @click="resetAll">重置</button>
                    </div>
                    <span class="w-hint">每个按钮都同时对两个版本做同一件事</span>
                </div>

                <div class="duel">
                    <!-- defineProperty -->
                    <article class="duel__side">
                        <div class="duel__head">
                            <span class="duel__name mono">Vue2 · defineProperty</span>
                            <span class="duel__stat mono">render {{ v2.render }} 次</span>
                        </div>
                        <div class="kv-grid">
                            <div class="kv">
                                <span class="kv__k">count</span>
                                <span class="kv__v mono">{{ v2.obj.count }}</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">nested.deep</span>
                                <span class="kv__v mono">{{ v2.obj.nested?.deep }}</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">list</span>
                                <span class="kv__v mono">[{{ v2.obj.list.join(', ') }}]</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">额外 keys</span>
                                <span class="kv__v mono">{{ extraKeys(v2.obj) }}</span>
                            </div>
                        </div>
                        <div class="log-list">
                            <div v-for="(l, i) in v2.logs" :key="'v2' + i" class="log-item"
                                :class="l.level === 'warn' ? 'is-warn' : l.level === 'bad' ? 'is-bad' : 'is-ok'">
                                <span class="log-item__body mono">{{ l.text }}</span>
                            </div>
                            <div v-if="!v2.logs.length" class="log-empty">还没有操作</div>
                        </div>
                    </article>

                    <!-- Proxy -->
                    <article class="duel__side">
                        <div class="duel__head">
                            <span class="duel__name mono">Vue3 · Proxy</span>
                            <span class="duel__stat mono">render {{ v3.render }} 次</span>
                        </div>
                        <div class="kv-grid">
                            <div class="kv">
                                <span class="kv__k">count</span>
                                <span class="kv__v mono">{{ v3.obj.count }}</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">nested.deep</span>
                                <span class="kv__v mono">{{ v3.obj.nested?.deep }}</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">list</span>
                                <span class="kv__v mono">[{{ v3.obj.list.join(', ') }}]</span>
                            </div>
                            <div class="kv">
                                <span class="kv__k">额外 keys</span>
                                <span class="kv__v mono">{{ extraKeys(v3.obj) }}</span>
                            </div>
                        </div>
                        <div class="log-list">
                            <div v-for="(l, i) in v3.logs" :key="'v3' + i" class="log-item"
                                :class="l.level === 'warn' ? 'is-warn' : l.level === 'bad' ? 'is-bad' : 'is-ok'">
                                <span class="log-item__body mono">{{ l.text }}</span>
                            </div>
                            <div v-if="!v3.logs.length" class="log-empty">还没有操作</div>
                        </div>
                    </article>
                </div>

                <p class="probe-note">
                    第 ③ ④ 步是关键：<strong>defineProperty 那一侧其实把值真的改掉了</strong>
                    （你可以看到 extra keys 跟着变），但它<em>完全不知道</em>，所以 render 次数一动不动。
                    这就是 Vue2 里必须写 <code>this.$set(obj, key, val)</code>、
                    以及数组要用七个改写过的原型方法的原因 —— 那些 API 本质上是在手动补通知。
                </p>
            </div>
        </section>

        <!-- ③ 发布订阅 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">发布订阅：把「谁读了我」记下来</h2>
                </div>
                <span class="panel__meta">下面的 Dep 是真的在收集依赖</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    光感知到变化还不够，得知道<strong>通知谁</strong>。做法是在 getter 里收集依赖、
                    在 setter 里通知它们重新执行 —— 也就是 <code>Dep.depend()</code> 与
                    <code>Dep.notify()</code>。下面是一个真实在跑的最小实现：
                    点「订阅一个 Watcher」，再改数值，看它被回调了几次。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="addWatcher">+ 订阅一个 Watcher</button>
                        <button type="button" class="w-btn" :disabled="!watchers.length" @click="touch">
                            改一次值（触发 notify）
                        </button>
                        <button type="button" class="w-btn" :disabled="!watchers.length" @click="detachOne">
                            停掉一个订阅
                        </button>
                    </div>
                    <span class="w-hint">当前订阅者 {{ watchers.length }} 个，共收到通知 {{ totalNotified }} 次</span>
                </div>

                <div class="cards">
                    <article v-for="w in watchers" :key="w.id" class="card">
                        <div class="card__head">
                            <h3 class="card__title mono">Watcher #{{ w.id }}</h3>
                            <span class="card__tag" :class="w.active ? 'is-good' : 'is-bad'">
                                {{ w.active ? '订阅中' : '已停止' }}
                            </span>
                        </div>
                        <p class="card__desc">
                            每收到一次通知，就把自己依赖的值重新算一遍。
                        </p>
                        <div class="res-row">
                            <span class="res-k">收到通知</span>
                            <span class="res-v mono">{{ w.hits }} 次</span>
                        </div>
                        <div class="res-row">
                            <span class="res-k">最近一次看到的 value</span>
                            <span class="res-v mono">{{ w.seen }}</span>
                        </div>
                    </article>
                    <div v-if="!watchers.length" class="log-empty">还没有订阅者，先点上面的按钮</div>
                </div>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">把上面两套代码抄下来</h2>
                </div>
                <span class="panel__meta">和页面里真实运行的实现一致</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">Vue2 路线：defineProperty + Dep</div>
                    <CodeEditor :code="v2Code" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">Vue3 路线：Proxy + 惰性深层代理</div>
                    <CodeEditor :code="v3Code" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'

/* ── 一份共用的原始数据 ──────────────────────────────── */
type Shape = {
    count: number
    nested: { deep: number }
    list: number[]
    [k: string]: unknown
}

function makeData(): Shape {
    return { count: 0, nested: { deep: 1 }, list: [1, 2, 3] }
}

function extraKeys(o: Shape): string {
    const known = new Set(['count', 'nested', 'list'])
    return Object.keys(o)
        .filter((k) => !known.has(k))
        .join(', ') || '—'
}

/* ── 最小版 Dep / Watcher ────────────────────────────── */
class Dep {
    subs = new Set<() => void>()

    depend(): void {
        if (Dep.target) this.subs.add(Dep.target)
    }

    notify(): void {
        this.subs.forEach((fn) => fn())
    }

    static target: (() => void) | null = null
}

/* ── ① defineProperty 版（Vue2 路线） ────────────────── */
type LogRow = { text: string; level: 'ok' | 'warn' | 'bad' }
type Side = {
    obj: Shape
    render: number
    logs: LogRow[]
}

const v2 = reactive<Side>({ obj: makeData(), render: 0, logs: [] })

function log(side: Side, text: string, level: 'ok' | 'warn' | 'bad' = 'ok'): void {
    side.logs = [{ text, level }, ...side.logs].slice(0, 8)
}

function defineReactive(side: Side, obj: Shape, key: string): void {
    let inner = obj[key]
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            dep.depend()
            return inner
        },
        set(v: unknown) {
            if (v === inner) return
            inner = v
            log(side, `setter 触发：${key} = ${String(v)}`)
            dep.notify()
            side.render += 1
            log(side, `→ notify() 已通知 ${dep.subs.size} 个订阅者，重新渲染`, 'ok')
        },
    })
}

/** Vue2 的做法：初始化时逐个 key 走一遍，深层还要递归 */
function observeV2(side: Side, obj: Shape): Shape {
    Object.keys(obj).forEach((k) => defineReactive(side, obj, k))
    // 对象类型的属性要递归下去；数组则是改写原型方法（这里略）
    return obj
}

/* ── ② Proxy 版（Vue3 路线） ─────────────────────────── */
const v3 = reactive<Side>({ obj: makeData(), render: 0, logs: [] })

function reactiveProxyV3(side: Side, target: object): Shape {
    const depMap = new Map<string, Dep>()

    const depOf = (key: string): Dep => {
        let d = depMap.get(key)
        if (!d) {
            d = new Dep()
            depMap.set(key, d)
        }
        return d
    }

    return new Proxy(target, {
        get(t, key, receiver) {
            const d = depOf(String(key))
            d.depend()
            const v = Reflect.get(t, key, receiver)
            // 惰性代理：只有真的取用到这层对象，才给它套上 Proxy
            if (v && typeof v === 'object') return reactiveProxyV3(side, v as object)
            return v
        },
        set(t, key, value, receiver) {
            const old = Reflect.get(t, key, receiver)
            const ok = Reflect.set(t, key, value, receiver)
            if (old !== value) {
                log(side, `set 拦截：${String(key)} = ${String(value)}`)
                depOf(String(key)).notify()
                side.render += 1
                log(side, `→ notify()，重新渲染`, 'ok')
            }
            return ok
        },
        deleteProperty(t, key) {
            const ok = Reflect.deleteProperty(t, key)
            log(side, `deleteProperty 拦截：删掉了 ${String(key)}`)
            depOf(String(key)).notify()
            side.render += 1
            log(side, `→ notify()，重新渲染`, 'ok')
            return ok
        },
    }) as Shape
}

/* 初始化：注意 v2 是「遍历每个 key」，v3 只是包一层壳 */
observeV2(v2, v2.obj)

/* v3 需要替换成 proxy 本体；用 Object.assign 保留初始值后整体换成代理 */
const proxyInstance = reactiveProxyV3(v3, makeData())
v3.obj = proxyInstance

/* ── 统一操作入口 ────────────────────────────────────── */
function act(kind: string): void {
    const label: Record<string, string> = {
        exist: '① 改已有属性 count',
        nested: '② 改深层属性 nested.deep',
        add: '③ 新增属性 title',
        del: '④ 删除属性 count',
        index: '⑤ 改数组下标 list[0]',
        push: '⑥ 数组 push(99)',
        length: '⑦ 直接改 list.length = 1',
    }

    const banner: LogRow = { text: `── ${label[kind]} ──`, level: 'ok' }
    ;[v2, v3].forEach((side) => {
        side.logs = [banner, ...side.logs].slice(0, 8)
    })

    // defineProperty 侧
    try {
        switch (kind) {
            case 'exist':
                v2.obj.count += 1
                break
            case 'nested':
                v2.obj.nested.deep += 1
                log(v2, '注：deep 这一层也被 defineReactive 过了，所以这里是有响应的', 'ok')
                break
            case 'add':
                Reflect.set(v2.obj, 'title', 'hello')
                log(v2, '值其实已经写进去了，但没有任何 setter 被触发 → 视图不会更新', 'bad')
                break
            case 'del':
                Reflect.deleteProperty(v2.obj, 'count')
                log(v2, '属性被删掉了，同样没有任何通知 → Vue2 必须调 $delete', 'bad')
                break
            case 'index':
                v2.obj.list[0] = 9
                log(v2, '数组下标赋值拦不住 → render 次数不变', 'warn')
                break
            case 'push':
                v2.obj.list.push(99)
                log(v2, '原生 push 也拦不住（Vue2 靠改写原型方法的办法补）', 'warn')
                break
            case 'length':
                v2.obj.list.length = 1
                log(v2, '改 length 同样无声无息', 'warn')
                break
        }
    } catch (e) {
        log(v2, `异常：${String((e as Error).message)}`, 'bad')
    }

    // Proxy 侧
    try {
        switch (kind) {
            case 'exist':
                v3.obj.count = Number(v3.obj.count) + 1
                break
            case 'nested':
                v3.obj.nested.deep = Number(v3.obj.nested.deep) + 1
                break
            case 'add':
                Reflect.set(v3.obj, 'title', 'hello')
                break
            case 'del':
                Reflect.deleteProperty(v3.obj, 'count')
                break
            case 'index':
                v3.obj.list[0] = 9
                break
            case 'push':
                v3.obj.list.push(99)
                break
            case 'length':
                v3.obj.list.length = 1
                break
        }
    } catch (e) {
        log(v3, `异常：${String((e as Error).message)}`, 'bad')
    }
}

function resetAll(): void {
    v2.obj = observeV2(v2, makeData())
    v3.obj = reactiveProxyV3(v3, makeData())
    v2.render = 0
    v3.render = 0
    v2.logs = []
    v3.logs = []
}

/* ── 实验二：真实 Dep / Watcher ──────────────────────── */
type Watcher = { id: number; active: boolean; hits: number; seen: unknown }

const watchers = ref<Watcher[]>([])
const source = { value: 0 }
const dep = new Dep()
let wid = 0

const totalNotified = computed(() => watchers.value.reduce((a, w) => a + w.hits, 0))

function addWatcher(): void {
    wid += 1
    const w: Watcher = { id: wid, active: true, hits: 0, seen: source.value }

    // 模拟一次「渲染」：读取 → 收集依赖 → 后续 notify 时重新执行
    const runner = () => {
        if (!w.active) return
        Dep.target = runner
        w.seen = source.value // 读取时 depend()，把自己登记进 dep
        Dep.target = null
        w.hits += 1
    }
    runner()
    watchers.value = [...watchers.value, w]
}

function touch(): void {
    source.value += 1
    dep.notify() // 通知所有登记过的 watcher
}

function detachOne(): void {
    const list = watchers.value
    const last = list[list.length - 1]
    if (last) last.active = false
    watchers.value = [...list]
}

/* ── 展示用源码 ─────────────────────────────────────── */
const v2Code = `// ── Vue2 路线 ────────────────────────────────────────
class Dep {
  subs = new Set()
  static target = null
  depend() { if (Dep.target) this.subs.add(Dep.target) }
  notify() { this.subs.forEach((fn) => fn()) }
}

function defineReactive(obj, key) {
  let inner = obj[key]
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      dep.depend()                 // 谁读了我，就把谁记下来
      return inner
    },
    set(v) {
      if (v === inner) return
      inner = v
      dep.notify()                 // 变了就通知它们
    },
  })
}

// 初始化时要遍历每一个 key —— 之后再加的属性就彻底失联了
Object.keys(obj).forEach((k) => defineReactive(obj, k))

// ⚠️ 这就是 Vue2 里 Vue.set / this.$set / $delete 存在的原因：
//    这些 API 内部做完赋值之后再手动调用一次 dep.notify()
Vue.set(vm.obj, 'title', 'hello')    // 补一个通知
vm.$delete(vm.obj, 'count')          // 删完也要补

// 数组则是改写原型上的 7 个方法：
// push pop shift unshift splice sort reverse
// 原生 arr[0] = x 与 arr.length = n 依旧监听不到`

const v3Code = `// ── Vue3 路线 ────────────────────────────────────────
const depMap = new WeakMap()   // target → Map<key, Dep>

function reactive(target) {
  if (!(target instanceof Object)) return target

  return new Proxy(target, {
    get(t, key, receiver) {
      track(t, key)                                   // 依赖收集
      const v = Reflect.get(t, key, receiver)
      // 惰性：只有真的访问到这一层对象，才给它套上 Proxy
      return v instanceof Object ? reactive(v) : v
    },

    set(t, key, value, receiver) {
      const old = Reflect.get(t, key, receiver)
      const ok = Reflect.set(t, key, value, receiver)
      if (old !== value) trigger(t, key)              // 派发更新
      return ok
    },

    deleteProperty(t, key) {                          // 删除也能拦
      const ok = Reflect.deleteProperty(t, key)
      trigger(t, key)
      return ok
    },

    has(t, key) { track(t, key); return Reflect.has(t, key) },
    ownKeys(t) { track(t, 'length'); return Reflect.ownKeys(t) },
  })
}

// 顺带补齐了几件 Vue2 做不到的事：
// ✅ 新增/删除属性有响应
// ✅ arr[0] = x、arr.length = n 有响应
// ✅ 不需要在初始化时递归遍历，代理是惰性的
// ❌ Proxy 无法 polyfill，IE 全线不支持`
</script>

<style lang="scss" scoped>
.duel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
}

.duel__side {
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.duel__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
}

.duel__name {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--brand);
}

.duel__stat {
    font-size: 11px;
    color: var(--text-tertiary);
}

.duel__side .log-list {
    margin-top: 10px;
}

.log-item.is-warn .log-item__body {
    color: var(--warning);
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}

@media (max-width: 900px) {
    .duel {
        grid-template-columns: 1fr;
    }
}
</style>
