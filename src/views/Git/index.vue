<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Git</span>
                    <h2 class="panel__title">三个区域，决定了所有命令的含义</h2>
                </div>
                <span class="panel__meta">工作区 → 暂存区(index) → 版本库(HEAD)</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    学 Git 最省力的办法是先记住这三个区域：
                    <strong>工作区</strong>是你正在编辑的文件，<strong>暂存区</strong>是
                    <code>git add</code> 之后待提交的快照名单，<strong>版本库</strong>是
                    <code>git commit</code> 之后真正沉淀下来的历史。
                    所有「撤销」命令的区别，本质上就是<em>从哪一个区往回退、退到哪个区</em>。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">commit 之前</span>
                        <span class="point__v">restore / reset — 都还在本地，怎么折腾都不影响别人</span>
                    </div>
                    <div class="point">
                        <span class="point__k">commit 之后未推送</span>
                        <span class="point__v">reset --soft/--hard、rebase -i — 改的是本地历史</span>
                    </div>
                    <div class="point">
                        <span class="point__k">已经推送</span>
                        <span class="point__v">只能用 revert「反向提交」，千万别用 reset 改公共历史</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 撤销对比 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">六种「我改错了」分别该怎么撤回</h2>
                </div>
                <span class="panel__meta">点一张卡看当时的状态该怎么收场</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="s in scenarios" :key="s.key" type="button" class="w-btn"
                            :class="cur === s.key ? 'is-active' : ''" @click="cur = s.key">
                            {{ s.label }}
                        </button>
                    </div>
                    <span class="w-hint">{{ currentScenario.summary }}</span>
                </div>

                <div class="detail">
                    <p class="intro__text">{{ currentScenario.detail }}</p>
                    <div class="cmd-group">
                        <div class="cmd-group__title">
                            <span>该用的命令</span>
                            <span class="cmd-group__count">{{ currentScenario.cmds.length }}</span>
                        </div>
                        <div v-for="c in currentScenario.cmds" :key="c.code" class="cmd"
                            :class="c.danger ? 'is-danger' : ''">
                            <span class="cmd__t">{{ c.t }}</span>
                            <span class="cmd__code mono">{{ c.code }}</span>
                            <button type="button" class="cmd__copy" :class="copied === c.code ? 'is-done' : ''"
                                @click="copy(c.code, c.code)">
                                {{ copied === c.code ? '已复制' : '复制' }}
                            </button>
                        </div>
                    </div>
                    <p class="verdict__note">
                        <strong>记住这条分界线：</strong>{{ currentScenario.rule }}
                    </p>
                </div>
            </div>
        </section>

        <!-- ③ 命令手册 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reference</span>
                    <h2 class="panel__title">命令速查</h2>
                </div>
                <span class="panel__meta">红边的是会改动历史或清掉内容的操作，执行前先看一眼</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <input v-model="kw" class="cmd-search" placeholder="搜命令或说明…">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="filterAll ? 'is-active' : ''"
                            @click="kw = ''; filterAll = true">
                            全部 {{ total }}
                        </button>
                        <button type="button" class="w-btn" :class="!filterAll ? 'is-active' : ''"
                            @click="filterAll = false">
                            只看危险命令 {{ dangerTotal }}
                        </button>
                    </div>
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
                    <h2 class="panel__title">分支模型与提交规范</h2>
                </div>
                <span class="panel__meta">团队协作里比命令更重要的东西</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">一条能自动生成规范 message 的 commit 模板</div>
                    <CodeEditor :code="commitCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">多人协作的分支规矩</div>
                    <CodeEditor :code="branchCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCommandCopy } from '@/utils/useCommandCopy'

const { copied, copy } = useCommandCopy()

/* ── 撤销场景 ────────────────────────────────────────── */
type Cmd = { t: string; code: string; danger?: boolean }

const scenarios = [
    {
        key: 'unstaged',
        label: '改了但没 add',
        summary: '文件还在工作区',
        detail: '你改了一堆东西，还没 git add。这时候想退回最后一次提交的样子 —— 用 restore 只还原这一个文件，别动别的。',
        cmds: [
            { t: '放弃某个文件的修改', code: 'git restore <file>' },
            { t: '放弃当前目录所有修改', code: 'git restore .', danger: true },
            { t: '先看看到底改了什么', code: 'git diff' },
        ],
        rule: 'restore 丢弃的是工作区内容，找不回来，下手前先 diff 一眼。',
    },
    {
        key: 'staged',
        label: 'add 了但没 commit',
        summary: '文件已进入暂存区',
        detail: '你已经 git add 了，但还没提交。--staged 表示「只把暂存区退回，工作区不动」，文件内容本身还是保留的。',
        cmds: [
            { t: '把某个文件撤出暂存区（改动保留）', code: 'git restore --staged <file>' },
            { t: '全部撤出暂存区', code: 'git restore --staged .' },
            { t: '看看暂存区里有什么', code: 'git diff --cached' },
        ],
        rule: '--staged 只动暂存区不动文件。想连改动一起丢，再接一句 git restore <file>。',
    },
    {
        key: 'last-commit',
        label: 'commit 信息写错了',
        summary: '只改注释，改动要保留',
        detail: '刚提交完发现 message 打错字，或者漏提交了一个文件。 amend 会把这次提交和上一条合并成一条新的。',
        cmds: [
            { t: '改写上一条提交信息', code: 'git commit --amend -m "新的信息"' },
            { t: '补一个漏掉的文件进去', code: 'git add <file> && git commit --amend --no-edit' },
        ],
        rule: 'amend 会改写本地历史。没 push 之前随便用，push 之后就别动了。',
    },
    {
        key: 'local-history',
        label: '要撤回本地几条提交',
        summary: '还没推送到远程',
        detail: 'reset 的三个参数决定了文件去留：--soft 只挪 HEAD，--mixed 连暂存区一起退（默认），--hard 连工作区内容一起抹掉。',
        cmds: [
            { t: '回退 1 条，改动回到暂存区', code: 'git reset --soft HEAD~1' },
            { t: '回退 1 条，改动回到工作区', code: 'git reset HEAD~1' },
            { t: '回退 1 条，改动直接丢弃', code: 'git reset --hard HEAD~1', danger: true },
            { t: '回退到某个具体 commit', code: 'git reset --hard <commit>' , danger: true },
        ],
        rule: '--hard 是唯一会真的弄丢内容的那个，其余两个都还能找回来。',
    },
    {
        key: 'public-history',
        label: '已经 push 出去了',
        summary: '公共历史不能改写',
        detail: '提交已经到了远程，别人可能已经基于它开发了。这时候唯一正确的做法是新增一条「反向提交」，把上次的改动抵消掉。',
        cmds: [
            { t: '生成一条反向提交（推荐）', code: 'git revert <commit>' },
            { t: '连续撤销多条', code: 'git revert <old>..<new>' },
            { t: '误用了 reset 后想强推', code: 'git push --force-with-lease', danger: true },
        ],
        rule: '已推送的提交用 revert；--force 只在确定没人基于它工作时用，而且优先 --force-with-lease。',
    },
    {
        key: 'lost',
        label: '东西丢了好几天才发现',
        summary: 'reflog 是后悔药',
        detail: 'reset --hard、误删分支之后看起来是没了，但只要没有被 GC，commit 对象还在。reflog 记着 HEAD 每一次移动。',
        cmds: [
            { t: '查看 HEAD 的移动记录', code: 'git reflog' },
            { t: '回到那一步', code: 'git reset --hard <reflog里的hash>' },
            { t: '把丢掉的分支找回成新分支', code: 'git branch recover <hash>' },
        ],
        rule: 'reflog 只记录本地操作，且默认 90 天后过期 —— 发现丢东西越早越好。',
    },
]

const cur = ref('unstaged')
const currentScenario = computed(() => scenarios.find((s) => s.key === cur.value)!)

/* ── 命令手册 ────────────────────────────────────────── */
type Group = { title: string; items: Cmd[] }

const groups: Group[] = [
    {
        title: '配置与初始化',
        items: [
            { t: '配置用户名（提交者身份）', code: 'git config --global user.name "Your Name"' },
            { t: '配置邮箱', code: 'git config --global user.email "you@example.com"' },
            { t: '查看所有配置及来源文件', code: 'git config --list --show-origin' },
            { t: '初始化仓库', code: 'git init' },
            { t: '克隆远程仓库', code: 'git clone <url>' },
            { t: '给命令起别名（这条定义 git lg）', code: 'git config --global alias.lg "log --oneline --graph --all"' },
        ],
    },
    {
        title: '日常提交',
        items: [
            { t: '查看当前状态', code: 'git status' },
            { t: '查看简洁状态', code: 'git status -s' },
            { t: '把文件加入暂存区', code: 'git add <file>' },
            { t: '把当前目录全部加入', code: 'git add .' },
            { t: '交互式挑着加（同一个文件拆多次提交）', code: 'git add -p' },
            { t: '提交', code: 'git commit -m "message"' },
            { t: '跳过钩子的提交（慎用）', code: 'git commit --no-verify' },
            { t: '查看尚未推送的提交', code: 'git log origin/master..HEAD' },
        ],
    },
    {
        title: '分支',
        items: [
            { t: '查看本地分支', code: 'git branch' },
            { t: '查看全部分支（含远程）', code: 'git branch -a' },
            { t: '新建分支', code: 'git branch <name>' },
            { t: '切换分支', code: 'git checkout <name>' },
            { t: '新建并切换（推荐写法）', code: 'git switch -c <name>' },
            { t: '切换回上一个分支', code: 'git checkout -' },
            { t: '重命名当前分支', code: 'git branch -m <new-name>' },
            { t: '重命名任意分支', code: 'git branch -m <old> <new>' },
            { t: '合并某分支到当前分支', code: 'git merge <name>' },
            { t: '变基（把当前分支挪到目标分支之后）', code: 'git rebase <name>' },
            { t: '交互式整理最近 3 条提交', code: 'git rebase -i HEAD~3' },
            { t: '删除已合并的分支', code: 'git branch -d <name>' },
            { t: '强制删除未合并的分支', code: 'git branch -D <name>', danger: true },
        ],
    },
    {
        title: '远程',
        items: [
            { t: '查看远程仓库', code: 'git remote -v' },
            { t: '添加远程仓库', code: 'git remote add <name> <url>' },
            { t: '修改远程地址（换源时常用）', code: 'git remote set-url <name> <new-url>' },
            { t: '拉取并合并', code: 'git pull' },
            { t: '拉取时 rebase 而不是 merge', code: 'git pull --rebase' },
            { t: '只下载不合并', code: 'git fetch' },
            { t: '推送并建立上游跟踪', code: 'git push -u origin <branch>' },
            { t: '删除远程分支', code: 'git push origin --delete <branch>', danger: true },
            { t: '推送单个标签（稍后标签区也有）', code: 'git push origin <tagname>' },
            { t: '清理远程已删除的本地分支引用', code: 'git remote prune origin' },
        ],
    },
    {
        title: '撤销与救急',
        items: [
            { t: '放弃工作区某个文件的修改', code: 'git restore <file>' },
            { t: '把文件撤出暂存区', code: 'git restore --staged <file>' },
            { t: '改写上一条提交', code: 'git commit --amend' },
            { t: '反向提交抵消某次改动', code: 'git revert <commit>' },
            { t: '回退 HEAD 但保留改动', code: 'git reset --soft HEAD~1' },
            { t: '彻底回退并丢弃改动', code: 'git reset --hard HEAD~1', danger: true },
            { t: '清理未跟踪的文件（先看 -n 演练）', code: 'git clean -fd', danger: true },
            { t: '查看 HEAD 的移动历史（找回误删）', code: 'git reflog' },
            { t: '临时保存未提交的改动', code: 'git stash' },
            { t: '保存时带上说明', code: 'git stash push -m "说明"' },
            { t: '恢复并删除 stash', code: 'git stash pop' },
            { t: '恢复但保留 stash', code: 'git stash apply' },
        ],
    },
    {
        title: '查看与排查',
        items: [
            { t: '简洁的一行日志', code: 'git log --oneline' },
            { t: '带分支图的日志', code: 'git log --oneline --graph --all' },
            { t: '看某个文件是谁改的（逐行）', code: 'git blame <file>' },
            { t: '二分查找引入 bug 的提交', code: 'git bisect start' },
            { t: '查看某次提交改了什么', code: 'git show <commit>' },
            { t: '查看工作区改动', code: 'git diff' },
            { t: '查看暂存区改动', code: 'git diff --cached' },
            { t: '在两个分支之间比较', code: 'git diff <branch1>..<branch2>' },
        ],
    },
    {
        title: '标签',
        items: [
            { t: '打一个轻量标签', code: 'git tag <name>' },
            { t: '打带说明的附注标签（推荐）', code: 'git tag -a v1.0.0 -m "首个正式版本"' },
            { t: '列出标签', code: 'git tag' },
            { t: '推送单个标签', code: 'git push origin <tagname>' },
            { t: '一次推送所有标签', code: 'git push origin --tags' },
            { t: '删除本地标签', code: 'git tag -d <name>' },
        ],
    },
]

const kw = ref('')
const filterAll = ref(true)

const dangerTotal = computed(() => groups.reduce((n, g) => n + g.items.filter((i) => i.danger).length, 0))
const total = computed(() => groups.reduce((n, g) => n + g.items.length, 0))

const filteredGroups = computed<Group[]>(() =>
    groups
        .map((g) => ({
            title: g.title,
            items: g.items.filter((i) => {
                if (!filterAll.value) return Boolean(i.danger)
                return true
            }).filter((i) => {
                const q = kw.value.trim().toLowerCase()
                if (!q) return true
                return i.code.toLowerCase().includes(q) || i.t.toLowerCase().includes(q)
            }),
        }))
        .filter((g) => g.items.length > 0),
)

/* ── 展示用源码 ─────────────────────────────────────── */
const commitCode = `# 让团队写得整齐：commitizen + commitlint
npm i -D @commitlint/cli @commitlint/config-conventional cz-conventional-changelog

# commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] }

# package.json
{
  "config": { "commitizen": { "path": "cz-conventional-changelog" } },
  "scripts": { "commit": "cz" }
}

# 之后写提交一律走：
git cz
# 它会一步步问你：类型 / 影响范围 / 简短描述 / 有没有破坏性变更

# 生成的 message 长这样：
# feat(api): 用户列表支持按角色筛选
# fix: 修复分页在最后一页为空时的报错
# docs: 补充部署文档
# BREAKING CHANGE: 移除已废弃的 v1 接口

# 有了规范的 message 才能自动生成 CHANGELOG：
npx conventional-changelog -p angular -i CHANGELOG.md -s`

const branchCode = `# ── 推荐的分支模型 ────────────────────────────────────
# master     只放可发布的版本，只能通过 merge request 合入
# develop    集成分支，日常联调用
# feature/*  每人一个功能分支，从 develop 切出去，完成后合回 develop
# release/*  发布前的预发分支，只修 bug
# hotfix/*   线上紧急修复，从 master 切，修完同时合回 master 和 develop

# ── 一条完整的开发流程 ────────────────────────────────
git switch develop
git pull --rebase
git switch -c feature/user-filter

# ...开发，分多次小步提交...
git add -p
git commit -m "feat: 添加用户筛选表单"
git commit -m "test: 补筛选的单元测试"

# 合回前先把 develop 的最新进度变基过来，冲突在本地解决
git fetch origin
git rebase origin/develop
# 有冲突就 git status → 改文件 → git add . → git rebase --continue

git push -u origin feature/user-filter
# 然后提 Merge Request，评审通过再合

# ── 几条铁律 ──────────────────────────────────────────
# 1. 永远不要对已经推送到公共仓库的提交做 rebase
# 2. push -f 之前先确认这是一条只有你在用的分支
# 3. 一个 commit 只做一件事 —— 回滚时你会感谢自己`
</script>

<style lang="scss" scoped>
.detail {
    margin-top: 12px;
}

.verdict__note {
    margin: 12px 0 0;
    padding: 10px 12px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    border: 1px solid var(--hairline);
    background: var(--surface);
}
</style>
