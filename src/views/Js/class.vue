<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Class</span>
                    <h2 class="panel__title">静态的、实例的、私有的，各住各的地方</h2>
                </div>
                <span class="panel__meta">三者的归属与可见范围完全不同</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    用 <code>static</code> 声明的东西属于<em>类本身</em>，所有实例看见的都是同一份；
                    直接写成 <code>this.xxx</code> 的是<em>实例属性</em>，每个对象一份；
                    带上 <code>#</code> 前缀的<em>私有字段</em>则受语言保护 ——
                    不光外部读不到，连 <code>Object.keys</code> 都看不见它。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">static</span>
                        <span class="point__v">挂在类上，实例共享，改一处全变</span>
                    </div>
                    <div class="point">
                        <span class="point__k">#private</span>
                        <span class="point__v">真正的私有，运行时也拿不到，不是 TS 的擦除式约定</span>
                    </div>
                    <div class="point">
                        <span class="point__k">注意</span>
                        <span class="point__v">class 内部默认严格模式，且必须 new，不能当函数直接调</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 实验 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Playground</span>
                    <h2 class="panel__title">两个账户，一个银行</h2>
                </div>
                <span class="panel__meta">存取看看私有字段怎么变，再试试能不能从外面摸到它</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ staticBank }}</h3>
                            <span class="card__tag">static bank</span>
                        </div>
                        <p class="card__desc">
                            静态属性属于类本身。改它会影响所有账户头上印的银行名。
                        </p>
                        <button type="button" class="w-btn card__btn" @click="renameBank">
                            改名：{{ nextBankName }}
                        </button>
                        <div class="res-row">
                            <span class="res-k">类名</span>
                            <span class="res-v mono">BankAccount.bank</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ accA.owner }} 的账户</h3>
                            <span class="card__tag is-good">#balance 私有</span>
                        </div>
                        <div class="balance mono">¥ {{ balA.toLocaleString('zh-CN') }}</div>
                        <div class="w-btns card__ops">
                            <button type="button" class="w-btn" @click="deposit('A', 100)">存 100</button>
                            <button type="button" class="w-btn" @click="withdraw('A', 50)">取 50</button>
                        </div>
                        <div class="res-row">
                            <span class="res-k">银行</span>
                            <span class="res-v mono">{{ staticBank }}</span>
                        </div>
                    </article>

                    <article class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ accB.owner }} 的账户</h3>
                            <span class="card__tag is-good">#balance 私有</span>
                        </div>
                        <div class="balance mono">¥ {{ balB.toLocaleString('zh-CN') }}</div>
                        <div class="w-btns card__ops">
                            <button type="button" class="w-btn" @click="deposit('B', 100)">存 100</button>
                            <button type="button" class="w-btn" @click="withdraw('B', 50)">取 50</button>
                        </div>
                        <div class="res-row">
                            <span class="res-k">银行</span>
                            <span class="res-v mono">{{ staticBank }}</span>
                        </div>
                    </article>
                </div>

                <p class="cls-note">
                    两个账户各自存取互不影响（实例属性），但银行名是同一份（静态属性）。
                    接下来试着从外部偷看 <code>#balance</code>：
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="tryReadPrivate">
                            account['#balance'] 试试
                        </button>
                        <button type="button" class="w-btn" @click="tryListKeys">
                            Object.getOwnPropertyNames
                        </button>
                    </div>
                    <span class="w-hint">真实执行，不是写死的文案</span>
                </div>

                <div class="probe">
                    <div class="res-row">
                        <span class="res-k">结果</span>
                        <span class="res-v mono" :class="probeKind">{{ probeText }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 源码 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">页面里那个类的完整写法</h2>
                </div>
                <span class="panel__meta">以及几个容易栽跟头的细节</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">BankAccount · 静态 + 实例 + 私有字段</div>
                    <CodeEditor :code="implCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">延伸：继承里的 super、私有字段与 this 绑定顺序</div>
                    <CodeEditor :code="extCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

class BankAccount {
    static bank = '钱多多银行'

    owner: string
    #balance = 0

    constructor(owner: string, init = 0) {
        this.owner = owner
        this.#balance = init
    }

    deposit(amount: number) {
        this.#balance += amount
        return this.#balance
    }

    withdraw(amount: number) {
        this.#balance -= amount
        return this.#balance
    }

    // 私有字段只能通过类内部的方法暴露
    get balance() {
        return this.#balance
    }
}

const accA = new BankAccount('Alice', 1000)
const accB = new BankAccount('Bob', 500)

const balA = ref(accA.balance)
const balB = ref(accB.balance)
const staticBank = ref(BankAccount.bank)

const NAMES = ['钱多多银行', '宇宙第一行', '存就对了银行']
let nameIdx = 0
const nextBankName = ref(NAMES[1])

function renameBank() {
    nameIdx = (nameIdx + 1) % NAMES.length
    BankAccount.bank = NAMES[nameIdx]
    staticBank.value = BankAccount.bank
    nextBankName.value = NAMES[(nameIdx + 1) % NAMES.length]
}

function deposit(which: 'A' | 'B', amount: number) {
    if (which === 'A') balA.value = accA.deposit(amount)
    else balB.value = accB.deposit(amount)
}

function withdraw(which: 'A' | 'B', amount: number) {
    if (which === 'A') balA.value = accA.withdraw(amount)
    else balB.value = accB.withdraw(amount)
}

/* ── 私有字段探测（真实执行） ─────────────────────────── */
const probeText = ref('尚未探测')
const probeKind = ref('')

function tryReadPrivate() {
    // 私有字段在语言层面就不可访问，这里只能用字符串 key 去试
    const leaked = (accA as unknown as Record<string, unknown>)['#balance']
    if (leaked === undefined) {
        probeText.value = "accA['#balance'] → undefined —— 拿到的只是一个普通的不存在属性"
        probeKind.value = 'is-bad'
    } else {
        probeText.value = `竟然读到了：${String(leaked)}`
        probeKind.value = 'is-ok'
    }
}

function tryListKeys() {
    const own = Object.getOwnPropertyNames(accA)
    probeText.value = `Object.getOwnPropertyNames(accA) → ${JSON.stringify(own)} —— 没有 #balance`
    probeKind.value = 'is-bad'
}

/* ── 展示用源码 ───────────────────────────────────────── */
const implCode = `class BankAccount {
  static bank = '钱多多银行'      // ① 静态：所有实例共享这一份

  owner = ''                      // ② 实例属性：每个对象一份
  #balance = 0                    // ③ 私有字段：外部摸不到

  constructor(owner, init = 0) {
    this.owner = owner
    this.#balance = init
  }

  deposit(amount) {
    this.#balance += amount
    return this.#balance
  }

  // 想让外面看到余额，就得自己开个口子
  get balance() {
    return this.#balance
  }
}

const a = new BankAccount('Alice', 1000)
const b = new BankAccount('Bob', 500)

a.deposit(100)        // a 的余额 1100，b 毫无变化
BankAccount.bank = '宇宙第一行'
// a 和 b 看到的银行名都跟着变了`

const extCode = `// ① 继承：子类必须在 super() 之后才能用 this
class SavingsAccount extends BankAccount {
  #rate = 0.03

  constructor(owner, init) {
    super(owner, init)      // ← 先把父类那套初始化完
    // 在 super() 之前访问 this 会直接抛 ReferenceError
  }

  addInterest() {
    return this.deposit(this.balance * this.#rate)
  }
}

// ② 私有字段不会被子类继承，各是各的
// 子类里的 #rate 和父类的 #balance 井水不犯河水

// ③ 静态方法里的 this 指向类本身，可以被继承
class Base {
  static create() { return new this() }   // this === 调用它的那个类
}
class Sub extends Base {}
Sub.create()      // Sub 的实例，而不是 Base 的

// ④ class 默认严格模式，且不能直接调用
const B = BankAccount
B('Alice')        // TypeError: Class constructor cannot be invoked without 'new'`
</script>

<style scoped>
.balance {
    font-size: 24px;
    line-height: 1.2;
    color: var(--brand);
    padding: 4px 0 12px;
}

.card__ops {
    gap: 8px;
    margin-bottom: 12px;
}
.card__ops .w-btn {
    flex: 1;
    text-align: center;
}

.cls-note {
    margin: 14px 0 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}
.cls-note code {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 1px 5px;
}

.probe {
    padding: 10px 12px;
    border: 1px solid var(--hairline);
    background: var(--surface-subtle);
}
.probe .res-k {
    width: 34px;
}
.probe .is-ok {
    color: var(--success);
}
.probe .is-bad {
    color: var(--danger);
}
</style>
