<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">MySQL</span>
                    <h2 class="panel__title">先分清三层：实例、库、表</h2>
                </div>
                <span class="panel__meta">连上去之后，绝大多数操作都是对「库」和「表」做的</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    一个 MySQL <strong>实例</strong>里可以有很多个<strong>库</strong>（schema），
                    每个库里是若干<strong>表</strong>。命令行进去之后第一件事通常是
                    <code>use 库名</code> —— 忘了这一步，后面所有语句都会报
                    <em>No database selected</em>。另外，生产库上执行 UPDATE / DELETE 之前，
                    先把 WHERE 条件写成 SELECT 跑一遍，确认命中的行数对得上。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">DDL</span>
                        <span class="point__v">CREATE / ALTER / DROP —— 改结构，线上执行要评估锁表时间</span>
                    </div>
                    <div class="point">
                        <span class="point__k">DML</span>
                        <span class="point__v">INSERT / UPDATE / DELETE —— 改数据，务必带 WHERE</span>
                    </div>
                    <div class="point">
                        <span class="point__k">DCL</span>
                        <span class="point__v">GRANT / REVOKE —— 权限。应用账号只给必要的那几张表</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 危险操作对照 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">三个最容易出事故的命令</h2>
                </div>
                <span class="panel__meta">它们的区别只在于「保留什么」</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article v-for="c in dangers" :key="c.name" class="card">
                        <div class="card__head">
                            <h3 class="card__title mono">{{ c.name }}</h3>
                            <span class="card__tag is-bad">{{ c.tag }}</span>
                        </div>
                        <p class="card__desc">{{ c.desc }}</p>
                        <div class="res-row">
                            <span class="res-k">能否回滚</span>
                            <span class="res-v is-bad">{{ c.rollback }}</span>
                        </div>
                        <div class="res-row">
                            <span class="res-k">替代方案</span>
                            <span class="res-v is-ok">{{ c.alt }}</span>
                        </div>
                    </article>
                </div>

                <p class="probe-note">
                    <strong>一条保命习惯：</strong>写 DELETE / UPDATE 时先用同样的 WHERE 跑一次
                    <code>SELECT COUNT(*)</code>，看看是不是你以为的那些行；
                    确认无误再把 SELECT 换成 DELETE。MySQL 默认不是 autocommit=0，执行完就真没了。
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
                <span class="panel__meta">红边的是会清掉数据的操作</span>
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
                    <h2 class="panel__title">慢查询怎么查</h2>
                </div>
                <span class="panel__meta">EXPLAIN 是唯一要背会的排查工具</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">EXPLAIN：看这条 SQL 到底走了索引没有</div>
                    <CodeEditor :code="explainCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">备份与恢复</div>
                    <CodeEditor :code="dumpCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCommandCopy } from '@/utils/useCommandCopy'

const { copied, copy } = useCommandCopy()

/* ── 危险操作对照 ────────────────────────────────────── */
const dangers = [
    {
        name: 'DELETE',
        tag: '只删数据',
        desc: '逐行删除，会写 binlog、会触发触发器、会占用事务。不带 WHERE 就是清空整张表，但表结构还在。',
        rollback: '事务内可回滚；已提交就只能用备份或 binlog 恢复',
        alt: '大量删除用分批：DELETE ... LIMIT 1000 循环跑，避免长事务锁表',
    },
    {
        name: 'TRUNCATE',
        tag: '清空并重置',
        desc: '一次性把表清空并把自增 ID 归零。它是 DDL，不走事务、不写逐行 binlog，所以速度极快。',
        rollback: '不可回滚，触发器也不会触发',
        alt: '需要能回滚就别用它，改用 DELETE',
    },
    {
        name: 'DROP',
        tag: '连表一起删',
        desc: '把整张表（结构 + 数据 + 索引 + 权限）从库里移除。空间立刻释放。',
        rollback: '不可回滚。生产环境基本等于事故',
        alt: '先 RENAME 成 xxx_bak_日期，观察几天确认没人用再 DROP',
    },
]

/* ── 命令速查 ────────────────────────────────────────── */
type Cmd = { t: string; code: string; danger?: boolean }
type Group = { title: string; items: Cmd[] }

const groups: Group[] = [
    {
        title: '连接与服务',
        items: [
            { t: '命令行连接（回车后输密码）', code: 'mysql -uroot -p' },
            { t: '指定主机和端口', code: 'mysql -h 127.0.0.1 -P 3306 -uroot -p' },
            { t: '直接连到某个库', code: 'mysql -uroot -p db_name' },
            { t: '断开连接', code: '\\q 或 exit' },
            { t: 'Windows 启动服务（管理员 cmd）', code: 'net start mysql' },
            { t: 'Windows 停止服务', code: 'net stop mysql' },
            { t: 'Linux 查看状态', code: 'systemctl status mysqld' },
            { t: 'Linux 启动 / 重启', code: 'systemctl start mysqld / systemctl restart mysqld' },
        ],
    },
    {
        title: '库',
        items: [
            { t: '查看所有库', code: 'SHOW DATABASES;' },
            { t: '进入某个库', code: 'USE db_name;' },
            { t: '查看当前在哪个库', code: 'SELECT DATABASE();' },
            { t: '建库（指定 utf8mb4）', code: 'CREATE DATABASE db_name DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' },
            { t: '删库', code: 'DROP DATABASE db_name;', danger: true },
            { t: '查看建库语句', code: 'SHOW CREATE DATABASE db_name;' },
        ],
    },
    {
        title: '表',
        items: [
            { t: '查看所有表', code: 'SHOW TABLES;' },
            { t: '查看表结构', code: 'DESC table_name;' },
            { t: '查看建表语句（含索引）', code: 'SHOW CREATE TABLE table_name;' },
            { t: '查看表状态', code: 'SHOW TABLE STATUS LIKE "table_name";' },
            { t: '改表名', code: 'RENAME TABLE old TO new;' },
            { t: '删表', code: 'DROP TABLE table_name;', danger: true },
            { t: '建表', code: 'CREATE TABLE t (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);' },
            { t: '加字段', code: 'ALTER TABLE t ADD COLUMN age INT DEFAULT 0;' },
            { t: '改字段类型', code: 'ALTER TABLE t MODIFY COLUMN age TINYINT;' },
            { t: '删字段', code: 'ALTER TABLE t DROP COLUMN age;' },
            { t: '加索引', code: 'CREATE INDEX idx_name ON t (name);' },
            { t: '加唯一索引', code: 'CREATE UNIQUE INDEX uk_email ON t (email);' },
            { t: '查看索引', code: 'SHOW INDEX FROM t;' },
        ],
    },
    {
        title: '增删改查',
        items: [
            { t: '插入一行', code: 'INSERT INTO t (name, age) VALUES ("张三", 18);' },
            { t: '批量插入', code: 'INSERT INTO t (name, age) VALUES ("a", 1), ("b", 2);' },
            { t: '存在则更新（upsert）', code: 'INSERT INTO t (id, name) VALUES (1, "a") ON DUPLICATE KEY UPDATE name = "a";' },
            { t: '更新（一定要带 WHERE）', code: 'UPDATE t SET age = 20 WHERE id = 1;' },
            { t: '删除（一定要带 WHERE）', code: 'DELETE FROM t WHERE id = 1;', danger: true },
            { t: '查询', code: 'SELECT * FROM t WHERE age > 18 ORDER BY id DESC LIMIT 10;' },
            { t: '分页', code: 'SELECT * FROM t LIMIT 20 OFFSET 40;' },
            { t: '聚合', code: 'SELECT age, COUNT(*) AS n FROM t GROUP BY age HAVING n > 1;' },
            { t: '连表', code: 'SELECT u.name, o.amount FROM users u LEFT JOIN orders o ON o.user_id = u.id;' },
        ],
    },
    {
        title: '用户与权限',
        items: [
            { t: '创建用户', code: 'CREATE USER "app"@"%" IDENTIFIED BY "password";' },
            { t: '改密码', code: 'ALTER USER "root"@"localhost" IDENTIFIED BY "new_password";' },
            { t: '授权（只给某库某表）', code: 'GRANT SELECT, INSERT, UPDATE ON db_name.* TO "app"@"%";' },
            { t: '收回权限', code: 'REVOKE UPDATE ON db_name.* FROM "app"@"%";' },
            { t: '让授权生效', code: 'FLUSH PRIVILEGES;' },
            { t: '查看某用户的权限', code: 'SHOW GRANTS FOR "app"@"%";' },
            { t: '删除用户', code: 'DROP USER "app"@"%";', danger: true },
        ],
    },
    {
        title: '排查',
        items: [
            { t: '查看执行计划', code: 'EXPLAIN SELECT * FROM t WHERE name = "x";' },
            { t: '看实际执行细节', code: 'EXPLAIN ANALYZE SELECT * FROM t WHERE name = "x";' },
            { t: '查看当前有哪些连接', code: 'SHOW PROCESSLIST;' },
            { t: '杀掉某个查询', code: 'KILL <id>;', danger: true },
            { t: '查看正在锁等待的事务', code: 'SELECT * FROM information_schema.INNODB_TRX;' },
            { t: '查看慢查询是否开启', code: 'SHOW VARIABLES LIKE "slow_query_log";' },
            { t: '查看超时设置', code: 'SHOW VARIABLES LIKE "%timeout%";' },
            { t: '查看最大连接数', code: 'SHOW VARIABLES LIKE "max_connections";' },
            { t: '查看版本', code: 'SELECT VERSION();' },
        ],
    },
    {
        title: '事务',
        items: [
            { t: '开启事务', code: 'START TRANSACTION;' },
            { t: '提交', code: 'COMMIT;' },
            { t: '回滚', code: 'ROLLBACK;' },
            { t: '查看当前隔离级别', code: 'SELECT @@transaction_isolation;' },
            { t: '设置隔离级别', code: 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;' },
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
const explainCode = `-- 在 SQL 前面加 EXPLAIN 就够了
EXPLAIN SELECT * FROM users WHERE phone = '13800000000';

-- 重点看四列：
-- type     ALL = 全表扫描（要优化）；ref / range / const 才是走了索引
-- key      实际用到的索引；NULL 表示没走索引
-- rows     预计要扫描多少行，越小越好
-- Extra    Using filesort / Using temporary 通常意味着要加索引或改写法

-- 常见的不走索引写法（即使建了索引也白搭）：
WHERE LEFT(name, 1) = 'a'            -- 对列用了函数
WHERE age + 1 > 20                   -- 对列做了运算
WHERE name LIKE '%abc'               -- 前缀通配符
WHERE name = 123                     -- 类型不一致，字符串列传了数字
WHERE a = 1 OR b = 2                 -- OR 会导致只用一个索引

-- 联合索引的「最左前缀」原则：
-- 索引 (a, b, c)
-- ✅ WHERE a = 1
-- ✅ WHERE a = 1 AND b = 2
-- ✅ WHERE a = 1 AND b = 2 ORDER BY c
-- ❌ WHERE b = 2           ← 跳过了最左边的 a，用不上
-- ❌ WHERE a = 1 AND c = 3 ← 中间断了，c 用不上

-- 覆盖索引：查询的列都在索引里，就不用回表了
-- 索引 (name, age)
SELECT age FROM users WHERE name = 'x';   -- Extra 会出现 Using index`

const dumpCode = `# ── 备份 ─────────────────────────────────────────────
# 备份单个库（最常用）
mysqldump -uroot -p db_name > db_name_$(date +%F).sql

# 只备份结构
mysqldump -uroot -p --no-data db_name > schema.sql

# 只备份数据
mysqldump -uroot -p --no-create-info db_name > data.sql

# 带事务一致性地备份（InnoDB 用这个，不锁表）
mysqldump -uroot -p --single-transaction db_name > backup.sql

# 备份所有库
mysqldump -uroot -p --all-databases > all.sql

# 顺便把存储过程和事件也带上
mysqldump -uroot -p --routines --events --triggers db_name > full.sql

# ── 恢复 ─────────────────────────────────────────────
mysql -uroot -p db_name < backup.sql

# 或者连进去之后
source /path/to/backup.sql;

# ── 定时备份（crontab）────────────────────────────────
0 3 * * * mysqldump -uroot -p'密码' db_name | gzip > /data/backup/db_$(date +\\%F).sql.gz
# 注意：密码写进 crontab 不安全，推荐放在 ~/.my.cnf 里
# [client]
# user=root
# password=xxxx
# 然后 chmod 600 ~/.my.cnf，命令里就不用带 -p 了

# 只保留最近 7 天
find /data/backup -name "*.sql.gz" -mtime +7 -delete`
</script>

<style lang="scss" scoped>
.cards .card .res-row {
    margin-top: 6px;
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-tertiary);
}
</style>
