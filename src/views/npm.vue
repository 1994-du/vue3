<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">npm</span>
                    <h2 class="panel__title">装得对不对，看这三个文件</h2>
                </div>
                <span class="panel__meta">package.json / package-lock.json / .npmrc</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    <code>package.json</code> 声明的是<em>范围</em>（<code>^1.2.3</code> 允许升到 1.x 任意版本），
                    <code>package-lock.json</code> 记录的是<strong>精确版本</strong>（当时真正装进去的那个）。
                    所以 CI 一定要用 <code>npm ci</code> 而不是 <code>npm install</code> ——
                    前者严格照 lock 装，后者可能顺手升一下再改掉 lock 文件，
                    于是「我这儿能跑，线上跑不起来」。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">^1.2.3</span>
                        <span class="point__v">允许 minor 和 patch 升级，即 &lt;2.0.0。npm install 的默认值</span>
                    </div>
                    <div class="point">
                        <span class="point__k">~1.2.3</span>
                        <span class="point__v">只允许 patch 升级，即 &lt;1.3.0。更保守</span>
                    </div>
                    <div class="point">
                        <span class="point__k">1.2.3</span>
                        <span class="point__v">锁死。核心依赖建议这么写，或统一走 overrides 字段</span>
                    </div>
                    <div class="point">
                        <span class="point__k">npx</span>
                        <span class="point__v">临时地执行一个包，不必先装进项目</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 三个包管理器对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">同一个动作，三种写法</h2>
                </div>
                <span class="panel__meta">别在同一个项目里混用，lock 文件会打架</span>
            </div>
            <div class="panel__body">
                <div class="cmd-group">
                    <div class="cmd-group__title">
                        <span>{{ curAction.label }}</span>
                        <span class="cmd-group__count">3</span>
                    </div>
                    <div v-for="c in curAction.cmds" :key="c.t" class="cmd">
                        <span class="cmd__t">{{ c.t }}</span>
                        <span class="cmd__code mono">{{ c.code }}</span>
                        <button type="button" class="cmd__copy" :class="copied === c.code ? 'is-done' : ''"
                            @click="copy(c.code, c.code)">
                            {{ copied === c.code ? '已复制' : '复制' }}
                        </button>
                    </div>
                </div>

                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="a in actions" :key="a.key" type="button" class="w-btn"
                            :class="curAct === a.key ? 'is-active' : ''" @click="curAct = a.key">
                            {{ a.label }}
                        </button>
                    </div>
                    <span class="w-hint">点一个动作，看三家分别是怎么写的</span>
                </div>

                <p class="probe-note">
                    <strong>pnpm 为什么省空间：</strong>它把所有包放在一处全局 store，
                    项目里的 <code>node_modules</code> 只是硬链接，同一个包在十个项目里只占一份。
                    而且它天然杜绝「幽灵依赖」——没写进 package.json 的包，代码里根本引不到。
                </p>
            </div>
        </section>

        <!-- ③ 命令速查 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reference</span>
                    <h2 class="panel__title">命令速查</h2>
                </div>
                <span class="panel__meta">点右侧按钮复制</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <input v-model="kw" class="cmd-search" placeholder="搜命令或说明…">
                    <span class="w-hint">命中 {{ filteredGroups.reduce((n, g) => n + g.items.length, 0) }} 条</span>
                </div>

                <div v-for="g in filteredGroups" :key="g.title" class="cmd-group">
                    <div class="cmd-group__title">
                        <span>{{ g.title }}</span>
                        <span class="cmd-group__count">{{ g.items.length }}</span>
                    </div>
                    <div v-for="item in g.items" :key="item.code" class="cmd" :class="item.danger ? 'is-danger' : ''">
                        <span class="cmd__t">{{ item.t }}</span>
                        <span class="cmd__code mono">{{ item.code }}</span>
                        <button type="button" class="cmd__copy" :class="copied === item.code ? 'is-done' : ''"
                            @click="copy(item.code, item.code)">
                            {{ copied === item.code ? '已复制' : '复制' }}
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
                    <h2 class="panel__title">发一个自己的包</h2>
                </div>
                <span class="panel__meta">从 package.json 到 npm publish</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">一个能直接发布的最小配置</div>
                    <CodeEditor :code="pkgCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">发布流程与版本号</div>
                    <CodeEditor :code="publishCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCommandCopy } from '@/utils/useCommandCopy'

const { copied, copy } = useCommandCopy()

/* ── 三管理器对照 ────────────────────────────────────── */
const actions = [
    { key: 'init', label: '初始化项目' },
    { key: 'install', label: '安装全部依赖' },
    { key: 'add', label: '装一个包' },
    { key: 'dev', label: '装开发依赖' },
    { key: 'run', label: '执行脚本' },
    { key: 'exec', label: '临时执行' },
    { key: 'remove', label: '卸载包' },
    { key: 'update', label: '更新' },
]

const actionMap: Record<string, { key: string; label: string; cmds: { t: string; code: string }[] }> = {
    init: {
        key: 'init',
        label: '初始化项目',
        cmds: [
            { t: 'npm', code: 'npm init -y' },
            { t: 'pnpm', code: 'pnpm init' },
            { t: 'yarn', code: 'yarn init -y' },
        ],
    },
    install: {
        key: 'install',
        label: '安装全部依赖',
        cmds: [
            { t: 'npm（按 lock 严格装，CI 用这个）', code: 'npm ci' },
            { t: 'pnpm', code: 'pnpm install --frozen-lockfile' },
            { t: 'yarn', code: 'yarn install --frozen-lockfile' },
        ],
    },
    add: {
        key: 'add',
        label: '装一个包',
        cmds: [
            { t: 'npm', code: 'npm i axios' },
            { t: 'pnpm', code: 'pnpm add axios' },
            { t: 'yarn', code: 'yarn add axios' },
        ],
    },
    dev: {
        key: 'dev',
        label: '装开发依赖',
        cmds: [
            { t: 'npm', code: 'npm i -D vite' },
            { t: 'pnpm', code: 'pnpm add -D vite' },
            { t: 'yarn', code: 'yarn add -D vite' },
        ],
    },
    run: {
        key: 'run',
        label: '执行脚本',
        cmds: [
            { t: 'npm', code: 'npm run dev' },
            { t: 'pnpm（run 可省）', code: 'pnpm dev' },
            { t: 'yarn', code: 'yarn dev' },
        ],
    },
    exec: {
        key: 'exec',
        label: '临时执行',
        cmds: [
            { t: 'npm', code: 'npx create-vite@latest' },
            { t: 'pnpm', code: 'pnpm dlx create-vite@latest' },
            { t: 'yarn', code: 'yarn dlx create-vite@latest' },
        ],
    },
    remove: {
        key: 'remove',
        label: '卸载包',
        cmds: [
            { t: 'npm', code: 'npm uninstall axios' },
            { t: 'pnpm', code: 'pnpm remove axios' },
            { t: 'yarn', code: 'yarn remove axios' },
        ],
    },
    update: {
        key: 'update',
        label: '更新',
        cmds: [
            { t: 'npm', code: 'npm update' },
            { t: 'pnpm', code: 'pnpm update' },
            { t: 'yarn', code: 'yarn upgrade' },
        ],
    },
}

const curAct = ref('install')
const curAction = computed(() => actionMap[curAct.value])

/* ── 命令速查 ────────────────────────────────────────── */
type Cmd = { t: string; code: string; danger?: boolean }
type Group = { title: string; items: Cmd[] }

const groups: Group[] = [
    {
        title: '安装与依赖',
        items: [
            { t: '按 lock 严格安装（CI 必用）', code: 'npm ci' },
            { t: '安装 package.json 里的依赖', code: 'npm install' },
            { t: '安装生产依赖', code: 'npm i <pkg>' },
            { t: '安装开发依赖', code: 'npm i -D <pkg>' },
            { t: '安装指定版本', code: 'npm i <pkg>@1.2.3' },
            { t: '安装某个大版本下的最新', code: 'npm i <pkg>@^2' },
            { t: '全局安装', code: 'npm i -g <pkg>' },
            { t: '卸载', code: 'npm uninstall <pkg>' },
            { t: '更新某个包', code: 'npm update <pkg>' },
            { t: '检查哪些包过期了', code: 'npm outdated' },
            { t: '查看依赖树', code: 'npm ls' },
            { t: '看看某个包被谁引了', code: 'npm ls <pkg>' },
        ],
    },
    {
        title: '信息查询',
        items: [
            { t: '查看包在仓库里的信息', code: 'npm view <pkg>' },
            { t: '查看所有版本', code: 'npm view <pkg> versions' },
            { t: '查看本地已装版本', code: 'npm list <pkg>' },
            { t: '查看包的依赖', code: 'npm view <pkg> dependencies' },
            { t: '查看 npm 自身的版本', code: 'npm -v' },
            { t: '审计安全漏洞', code: 'npm audit' },
            { t: '自动修能修的漏洞', code: 'npm audit fix' },
        ],
    },
    {
        title: '镜像源',
        items: [
            { t: '查看当前源', code: 'npm config get registry' },
            { t: '切到国内镜像（官方源已停服）', code: 'npm config set registry https://registry.npmmirror.com' },
            { t: '临时用一次指定源', code: 'npm i <pkg> --registry=https://registry.npmmirror.com' },
            { t: '切回官方源', code: 'npm config set registry https://registry.npmjs.org' },
            { t: '查看全部配置', code: 'npm config list' },
            { t: '删除某项配置', code: 'npm config delete registry' },
        ],
    },
    {
        title: '缓存与清理',
        items: [
            { t: '查看缓存目录', code: 'npm config get cache' },
            { t: '清缓存（装包莫名失败时试试）', code: 'npm cache clean --force', danger: true },
            { t: '删除 node_modules 重装', code: 'rm -rf node_modules package-lock.json && npm i', danger: true },
            { t: '清理没被引用的依赖', code: 'npm prune' },
            { t: '验证缓存完整性', code: 'npm cache verify' },
        ],
    },
    {
        title: '脚本与执行',
        items: [
            { t: '列出所有可用脚本', code: 'npm run' },
            { t: '执行脚本', code: 'npm run <script>' },
            { t: '临时执行包，不落进依赖', code: 'npx <pkg>' },
            { t: '传参给脚本（-- 之后的部分）', code: 'npm run build -- --mode staging' },
            { t: '串行执行多个脚本', code: 'npm run a && npm run b' },
            { t: '并行执行（Linux/macOS）', code: 'npm run a & npm run b' },
        ],
    },
    {
        title: '版本号与发布',
        items: [
            { t: '升 patch（1.0.0 → 1.0.1）', code: 'npm version patch' },
            { t: '升 minor（1.0.0 → 1.1.0）', code: 'npm version minor' },
            { t: '升 major（1.0.0 → 2.0.0）', code: 'npm version major' },
            { t: '登录', code: 'npm login' },
            { t: '查看当前登录身份', code: 'npm whoami' },
            { t: '先演练一遍发布内容', code: 'npm publish --dry-run' },
            { t: '发布', code: 'npm publish' },
            { t: '发布带 tag 的预发布版', code: 'npm publish --tag beta' },
            { t: '撤销刚发布的版本（限时）', code: 'npm unpublish <pkg>@<version>', danger: true },
        ],
    },
    {
        title: '项目管理',
        items: [
            { t: '用 Vite 脚手架建项目', code: 'npm create vite@latest' },
            { t: '初始化（跳过提问）', code: 'npm init -y' },
            { t: '在某个目录执行（不改 cwd）', code: 'npm --prefix ./app install' },
            { t: '查看 npm 的 bin 目录', code: 'npm bin' },
            { t: '本地 link 调试一个包', code: 'npm link <pkg>' },
        ],
    },
]

const kw = ref('')

const filteredGroups = computed<Group[]>(() =>
    groups
        .map((g) => ({
            title: g.title,
            items: g.items.filter((i) => {
                const q = kw.value.trim().toLowerCase()
                if (!q) return true
                return i.code.toLowerCase().includes(q) || i.t.toLowerCase().includes(q)
            }),
        }))
        .filter((g) => g.items.length > 0),
)

/* ── 展示用源码 ─────────────────────────────────────── */
const pkgCode = `{
  "name": "my-utils",                 // 全小写，不能有空格
  "version": "1.0.0",                 // 语义化版本：主.次.补丁
  "description": "一句话说清它是干嘛的",
  "main": "dist/index.cjs",            // CommonJS 入口
  "module": "dist/index.mjs",          // ESM 入口
  "types": "dist/index.d.ts",          // 类型声明，TS 用户靠它
  "exports": {                         // 现代写法，优先级高于 main
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],                   // 只有这些会被打进 tarball
  "sideEffects": false,                // 允许打包工具做 tree-shaking
  "engines": { "node": ">=18" },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "prepublishOnly": "npm run build"  // 发布前自动构建，防止忘了 build
  },
  "keywords": ["utils"],
  "license": "MIT"
}

// 发布前自己确认三件事：
// 1. 到底哪些文件会被传上去 —— npm publish --dry-run 会列出来
// 2. files 字段别写漏 dist，否则用户装到的是一个空壳
// 3. 版本号必须比线上已有的大，同一个版本号不能发两次`

const publishCode = `# ── 完整发布流程 ──────────────────────────────────────
npm login                        # 先登录（会要一次性的 OTP）
npm whoami                       # 确认身份

npm run build                    # 或者靠 prepublishOnly 自动触发
npm publish --dry-run            # 演练：列出将要上传的文件
npm publish                      # 正式发布
npm publish --tag beta           # 发布预发布版，用户要显式指定 @beta 才装到

# ── 版本号怎么定（semver）──────────────────────────────
# 1.0.0 → 1.0.1   patch：修 bug，接口没变
# 1.0.0 → 1.1.0   minor：加了新功能，老用法照旧
# 1.0.0 → 2.0.0   major：有不兼容的破坏性变更
# 0.x.x 阶段可以随意一点：0.1.0 → 0.2.0 也可能有破坏性变更

npm version patch                # 自动改 package.json + 打 git tag
git push && git push --tags

# ── 常用但容易忘的 ────────────────────────────────────
npm unpublish my-utils@1.0.1     # 24 小时内可撤销，且只能撤自己的
npm deprecate my-utils@"<2.0.0" "请升级到 2.x"   # 提示而不是直接删

# ── 调试本地包：不出网就能试 ───────────────────────────
cd my-utils && npm link          # 在包目录里注册
cd ../my-app && npm link my-utils # 在应用里软链过来
# 注意：link 用的是软链，构建工具的行为和真实安装不完全一样，
# 最终还是要发个 beta 版真装一遍才算验过`
</script>

<style lang="scss" scoped>
.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}
</style>
