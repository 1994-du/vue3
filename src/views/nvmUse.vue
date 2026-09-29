<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">nvm</span>
                    <h2 class="panel__title">一台机器装多个 Node，各用各的</h2>
                </div>
                <span class="panel__meta">Node Version Manager</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    不同项目对 Node 版本的要求常常打架：老项目只认 14，新项目要 18 以上。
                    nvm 的做法是每个版本装在自己的目录里，切换时<em>只改 PATH 的指向</em> ——
                    全局 npm 包也跟着版本走，所以<strong>换版本后要重新全局安装一次</strong>（比如 pnpm、yarn）。
                    另外记得加 <code>.nvmrc</code>：把版本号写进项目，别人 clone 下来一条命令就能对齐。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">Windows 与 macOS 不是同一个</span>
                        <span class="point__v">Windows 用 nvm-windows，命令基本一致但下载包不同</span>
                    </div>
                    <div class="point">
                        <span class="point__k">LTS 是什么</span>
                        <span class="point__v">Long Term Support，长期维护版。生产环境一律用偶数版 LTS</span>
                    </div>
                    <div class="point">
                        <span class="point__k">默认版本</span>
                        <span class="point__v">nvm alias default 决定新开终端时用哪个版本，不然每次都要 nvm use</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 版本类型 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Guide</span>
                    <h2 class="panel__title">该装哪一个版本</h2>
                </div>
                <span class="panel__meta">生产环境永远选 LTS</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article v-for="c in channels" :key="c.name" class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ c.name }}</h3>
                            <span class="card__tag" :class="c.good ? 'is-good' : 'is-bad'">{{ c.tag }}</span>
                        </div>
                        <p class="card__desc">{{ c.desc }}</p>
                        <div class="res-row">
                            <span class="res-k">谁用它</span>
                            <span class="res-v">{{ c.who }}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 命令速查 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reference</span>
                    <h2 class="panel__title">命令速查</h2>
                </div>
                <span class="panel__meta">Windows（nvm-windows）与 macOS/Linux 写法不同的一并列出</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <input v-model="kw" class="cmd-search" placeholder="搜命令或说明…">
                    <div class="w-btns">
                        <button v-for="p in platforms" :key="p.key" type="button" class="w-btn"
                            :class="platform === p.key ? 'is-active' : ''" @click="platform = p.key">
                            {{ p.label }}
                        </button>
                    </div>
                    <span class="w-hint">命中 {{ filteredGroups.reduce((n, g) => n + g.items.length, 0) }} 条</span>
                </div>

                <div v-for="g in filteredGroups" :key="g.title" class="cmd-group">
                    <div class="cmd-group__title">
                        <span>{{ g.title }}</span>
                        <span class="cmd-group__count">{{ g.items.length }}</span>
                    </div>
                    <div v-for="item in g.items" :key="item.t" class="cmd" :class="item.danger ? 'is-danger' : ''">
                        <span class="cmd__t">{{ item.t }}</span>
                        <span class="cmd__code mono">{{ pick(item) }}</span>
                        <button type="button" class="cmd__copy" :class="copied === pick(item) ? 'is-done' : ''"
                            @click="copy(pick(item), pick(item))">
                            {{ copied === pick(item) ? '已复制' : '复制' }}
                        </button>
                    </div>
                </div>
                <div v-if="!filteredGroups.length" class="log-empty">没有匹配的命令</div>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">把版本锁进项目</h2>
                </div>
                <span class="panel__meta">.nvmrc + package.json 的 engines</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">团队协作：让别人一 clone 就对齐版本</div>
                    <CodeEditor :code="nvmrcCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">本项目当前的版本情况</div>
                    <CodeEditor :code="projectCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCommandCopy } from '@/utils/useCommandCopy'

const { copied, copy } = useCommandCopy()

/* ── 版本通道 ────────────────────────────────────────── */
const channels = [
    {
        name: 'LTS（偶数版本）',
        tag: '生产用这个',
        good: true,
        desc: '发布后进入 30 个月的长期维护，只修 bug 和安全问题。Node 18 / 20 / 22 都属于这一档。',
        who: '线上服务、公司项目、一切要长期维护的东西',
    },
    {
        name: 'Current（奇数版本）',
        tag: '尝鲜用',
        good: false,
        desc: '最新特性都在这条线上，但只维护半年。下一个偶数版本发布后它就不再更新了。',
        who: '想提前试用新 API、给 Node 自己提 issue 的场景',
    },
    {
        name: 'Old Stable',
        tag: '已停止维护',
        good: false,
        desc: '过了维护期的版本，不再收到安全补丁。除非老项目实在升不动，否则不要留着。',
        who: '升不动的历史项目（同时意味着它有已知漏洞）',
    },
]

/* ── 平台切换 ────────────────────────────────────────── */
const platforms = [
    { key: 'win', label: 'Windows' },
    { key: 'unix', label: 'macOS / Linux' },
]

const platform = ref('win')
const kw = ref('')

type Cmd = { t: string; win: string; unix: string; danger?: boolean }
type Group = { title: string; items: Cmd[] }

const groups: Group[] = [
    {
        title: '查看',
        items: [
            { t: '查看已安装的版本', win: 'nvm list', unix: 'nvm ls' },
            { t: '查看可在线安装的版本', win: 'nvm list available', unix: 'nvm ls-remote --lts' },
            { t: '查看当前正在用哪个', win: 'nvm current', unix: 'nvm current' },
            { t: '查看 Node 版本', win: 'node -v', unix: 'node -v' },
            { t: '查看 npm 版本', win: 'npm -v', unix: 'npm -v' },
        ],
    },
    {
        title: '安装与卸载',
        items: [
            { t: '安装指定版本', win: 'nvm install 18.14.0', unix: 'nvm install 18.14.0' },
            { t: '安装最新的 LTS', win: 'nvm install lts', unix: 'nvm install --lts' },
            { t: '安装最新稳定版', win: 'nvm install latest', unix: 'nvm install node' },
            { t: '卸载某个版本', win: 'nvm uninstall 18.14.0', unix: 'nvm uninstall 18.14.0', danger: true },
            { t: '重装并迁移全局包', win: '（nvm-windows 不支持，需手动重装）', unix: 'nvm reinstall-packages 18.14.0' },
        ],
    },
    {
        title: '切换',
        items: [
            { t: '切换到指定版本', win: 'nvm use 18.14.0', unix: 'nvm use 18.14.0' },
            { t: '切到已装的 LTS', win: 'nvm use lts', unix: 'nvm use --lts' },
            { t: '设置默认版本（新终端生效）', win: 'nvm alias default 18.14.0', unix: 'nvm alias default 18' },
            { t: '只在当前 shell 临时用某个版本', win: 'nvm use 18.14.0', unix: 'nvm use 18.14.0（同样只对当前终端有效）' },
        ],
    },
    {
        title: '别名',
        items: [
            { t: '给版本起个别名', win: 'nvm alias legacy 14.21.3', unix: 'nvm alias legacy 14.21.3' },
            { t: '查看所有别名', win: 'nvm alias', unix: 'nvm alias' },
            { t: '删除别名', win: 'nvm unalias legacy', unix: 'nvm unalias legacy' },
        ],
    },
    {
        title: '跑特定版本',
        items: [
            { t: '临时用某个版本执行一条命令（不改当前 shell）', win: 'nvm run 18.14.0 app.js', unix: 'nvm run 18.14.0 app.js' },
            { t: '开一个子 shell 切过去', win: 'nvm exec 18.14.0 node -v', unix: 'nvm exec 18.14.0 node -v' },
        ],
    },
    {
        title: '常见问题',
        items: [
            { t: '切完版本后 node 命令找不到 → 用管理员权限再试', win: '以管理员身份运行终端后执行 nvm use 18.14.0', unix: '检查 shell 配置里是否 source 了 nvm.sh' },
            { t: '切换后全局包没了 → 每个版本的全局包是独立的', win: 'npm i -g pnpm（在当前版本下重装）', unix: 'npm i -g pnpm（在当前版本下重装）' },
            { t: 'nvm 命令本身找不到', win: '检查环境变量 NVM_HOME 与 PATH', unix: 'source ~/.nvm/nvm.sh' },
        ],
    },
]

function pick(item: Cmd): string {
    return platform.value === 'win' ? item.win : item.unix
}

const filteredGroups = computed<Group[]>(() =>
    groups
        .map((g) => ({
            title: g.title,
            items: g.items.filter((i) => {
                const q = kw.value.trim().toLowerCase()
                if (!q) return true
                return pick(i).toLowerCase().includes(q) || i.t.toLowerCase().includes(q)
            }),
        }))
        .filter((g) => g.items.length > 0),
)

/* ── 展示用源码 ─────────────────────────────────────── */
const nvmrcCode = `# ① 项目根目录放一个 .nvmrc，内容就是版本号
echo "18.14.0" > .nvmrc

# 别人 clone 之后：
nvm install      # 没有这个版本就装，装完自动切过去
nvm use          # 已装的话直接切

# ② 在 package.json 里也声明一次，双保险
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}

# 想让 npm 真的拦住版本不符的安装（默认只是警告）：
# .npmrc 里加一行
engine-strict=true

# ③ CI 里怎么用（GitHub Actions 示例）
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'    # 直接读 .nvmrc
    cache: 'npm'
- run: npm ci

# ④ 顺手也管住包管理器：corepack 会按 packageManager 字段自动切 pnpm/yarn
{
  "packageManager": "pnpm@9.12.0"
}
corepack enable`

const projectCode = `# 这台机器上现在的状态（供对照）
node -v       # 项目要求 ≥18，本机装的是 20 / 22 都可以
npm -v

# 本机环境速查（Windows）
where node        # 看 node.exe 到底在哪
nvm list          # 列出已装版本，当前用的前面有 *

# 顺便记住两件事：
# 1. 切 Node 版本后，全局装的包（pnpm / yarn / vue-cli）要重装一次，
#    因为它们装在各自版本的目录里
# 2. 编辑器和终端读的 PATH 可能不一样 —— IDE 里 node -v 和终端不一致时，
#    重启一下 IDE 让它重新读 PATH`
</script>

<style lang="scss" scoped>
.cards .card .res-row {
    margin-top: 6px;
}
</style>
