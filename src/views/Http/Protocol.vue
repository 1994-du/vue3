<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Protocols</span>
                    <h2 class="panel__title">协议就是「提前说好的格式」</h2>
                </div>
                <span class="panel__meta">语法、语义、时序，三样缺一不可</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    两个网络设备要能对话，必须事先约定三件事：<strong>语法</strong>（数据长什么样、字段顺序如何）、
                    <strong>语义</strong>（每个字段什么意思、收到后该做什么）、<strong>时序</strong>（谁先发、什么时候发）。
                    这三样合起来叫协议。所谓 TCP/IP 协议族，就是一整套按分层组织起来的这类约定 ——
                    每层拿上层的数据加自己的头，交给下层去送。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">有状态 / 无状态</span>
                        <span class="point__v">HTTP 无状态（每次请求独立），TCP 有状态（要维护连接与窗口）</span>
                    </div>
                    <div class="point">
                        <span class="point__k">可靠 / 尽力</span>
                        <span class="point__v">TCP 保证不丢不重不乱序；UDP 只管发出，丢了不赔</span>
                    </div>
                    <div class="point">
                        <span class="point__k">端口号</span>
                        <span class="point__v">传输层用来区分同一台机器上的不同程序，HTTP 80、HTTPS 443、DNS 53</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 协议浏览器 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Browse</span>
                    <h2 class="panel__title">按层翻一翻</h2>
                </div>
                <span class="panel__meta">点任何一个看它的定位与取舍</span>
            </div>
            <div class="panel__body">
                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" :class="filter === 'all' ? 'is-active' : ''"
                            @click="filter = 'all'">全部 {{ protocols.length }}</button>
                        <button v-for="l in layerKeys" :key="l" type="button" class="w-btn"
                            :class="filter === l ? 'is-active' : ''" @click="filter = l">
                            {{ l }}（{{ countOf(l) }}）
                        </button>
                    </div>
                    <input v-model="kw" class="cfg__input mono" placeholder="搜协议名 / 端口 / 用途">
                </div>

                <div class="proto-grid">
                    <button v-for="p in listed" :key="p.name" type="button" class="proto"
                        :class="cur === p.name ? 'is-active' : ''" @click="cur = p.name">
                        <span class="proto__name mono">{{ p.name }}</span>
                        <span class="proto__layer">{{ p.layer }}</span>
                    </button>
                    <div v-if="!listed.length" class="log-empty">没有匹配的协议</div>
                </div>

                <div v-if="current" class="detail">
                    <div class="detail__head">
                        <span class="detail__name mono">{{ current.name }}</span>
                        <span class="detail__badge">{{ current.layer }}</span>
                        <span v-if="current.port" class="detail__badge mono">{{ current.port }}</span>
                    </div>
                    <p class="intro__text">{{ current.desc }}</p>
                    <div class="kv-grid">
                        <div class="kv">
                            <span class="kv__k">用在哪</span>
                            <span class="kv__v">{{ current.usage }}</span>
                        </div>
                        <div class="kv">
                            <span class="kv__k">取舍</span>
                            <span class="kv__v" :class="current.tradeoff.startsWith('缺') ? 'is-bad' : 'is-ok'">
                                {{ current.tradeoff }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ③ 关键对比 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Compare</span>
                    <h2 class="panel__title">传输层这三个，决定了应用的性格</h2>
                </div>
                <span class="panel__meta">选错了，后面全是补丁</span>
            </div>
            <div class="panel__body">
                <div class="cards">
                    <article v-for="t in transports" :key="t.name" class="card">
                        <div class="card__head">
                            <h3 class="card__title">{{ t.name }}</h3>
                            <span class="card__tag">{{ t.tag }}</span>
                        </div>
                        <p class="card__desc">{{ t.desc }}</p>
                        <div v-for="row in t.rows" :key="row.k" class="res-row">
                            <span class="res-k">{{ row.k }}</span>
                            <span class="res-v" :class="row.bad ? 'is-bad' : row.good ? 'is-ok' : ''">{{ row.v }}</span>
                        </div>
                    </article>
                </div>

                <p class="probe-note">
                    一句话：<strong>TCP 要的是可靠，UDP 要的是及时，QUIC 想在 UDP 上把两者都做到</strong>。
                    视频会议丢一帧画面远比卡一下好，所以走 UDP；转账少一分钱都不行，所以走 TCP。
                </p>
            </div>
        </section>

        <!-- ④ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">开发中真用得上的几条</h2>
                </div>
                <span class="panel__meta">端口、DNS 与 WebSocket 升级</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">WebSocket：一次 HTTP 握手，换来 101 之后的长连接</div>
                    <CodeEditor :code="wsCode" />
                </div>
                <div class="code-block">
                    <div class="code-block__label">DNS 与其他查错命令</div>
                    <CodeEditor :code="dnsCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Proto = {
    name: string
    layer: string
    port: string
    desc: string
    usage: string
    tradeoff: string
}

const APP = '应用层'
const SESSION = '会话/表示层'
const TRANS = '传输层'
const NET = '网络层'
const LINK = '链路层'
const PHY = '物理层'

const protocols: Proto[] = [
    { name: 'HTTP', layer: APP, port: '80', desc: '超文本传输协议，Web 的基石，明文传输。', usage: '网页浏览、REST API', tradeoff: '优：简单通用。缺：明文、无状态、一次请求一次响应' },
    { name: 'HTTPS', layer: APP, port: '443', desc: 'HTTP over TLS，在 HTTP 与 TCP 之间插入加密层。', usage: '一切对外服务', tradeoff: '优：机密性与完整性。缺：握手开销，证书要维护' },
    { name: 'WebSocket', layer: APP, port: '80/443', desc: '借 HTTP 握手升级成全双工长连接，之后不再是 HTTP。', usage: '聊天、行情推送、协同编辑', tradeoff: '优：服务端可主动推。缺：要自己做心跳、重连、容灾' },
    { name: 'DNS', layer: APP, port: '53', desc: '域名到 IP 的分布式查询系统，通常跑在 UDP 上。', usage: '一切网络访问的第一步', tradeoff: '优：简单快速。缺：明文可被劫持（可用 DoH/DoT 加固）' },
    { name: 'FTP', layer: APP, port: '20/21', desc: '文件传输协议，控制连接与数据连接分开。', usage: '批量文件传输', tradeoff: '优：支持断点续传、目录操作。缺：明文传输，多端口穿越防火墙麻烦' },
    { name: 'SFTP', layer: APP, port: '22', desc: 'SSH 之上的文件传输，与 FTP 毫无关系。', usage: '服务器运维传文件', tradeoff: '优：全程加密、单端口。缺：开销略大' },
    { name: 'SSH', layer: APP, port: '22', desc: '加密的远程登录协议，也是 Git 推拉的主流方式之一。', usage: '登录服务器、git clone', tradeoff: '优：加密且支持密钥免密。缺：首次连接的指纹校验要留意' },
    { name: 'SMTP', layer: APP, port: '25/587', desc: '简单邮件传输协议，负责把邮件从客户端送到邮件服务器。', usage: '发邮件', tradeoff: '优：标准统一。缺：只管发不管收（收件是 POP3/IMAP）' },
    { name: 'DHCP', layer: APP, port: '67/68', desc: '动态主机配置，自动下发 IP、掩码、网关、DNS。', usage: '接上网线就能上网的前提', tradeoff: '优：零配置。缺：跑在 UDP 广播上，跨网段需要中继' },
    { name: 'NNTP', layer: APP, port: '119', desc: '网络新闻传输协议，早期 Usenet 新闻组用。', usage: '新闻组阅读/发布', tradeoff: '优：批量拉取文章高效。缺：基本退出了历史舞台' },
    { name: 'IRC', layer: APP, port: '6667', desc: '互联网中继聊天协议，实时文字聊天。', usage: '聊天室', tradeoff: '优：延迟低、协议简单。缺：明文、无历史消息' },
    { name: 'Telnet', layer: APP, port: '23', desc: '远程登录协议，所有内容（含密码）都是明文。', usage: '（已被 SSH 取代）', tradeoff: '缺：明文传输，公网绝对不要用' },
    { name: 'Gopher', layer: APP, port: '70', desc: 'HTTP 之前的信息检索协议，纯菜单式导航。', usage: '早期互联网资源检索', tradeoff: '缺：结构表达能力弱，已被 HTTP 完全替代' },
    { name: 'WHOIS', layer: APP, port: '43', desc: '查询域名/IP 的注册信息。', usage: '查域名归属、找滥用联系人', tradeoff: '优：公开可查。缺：隐私法规收紧后很多字段被隐藏' },

    { name: 'TLS', layer: SESSION, port: '—', desc: '传输层安全协议，SSL 的继任者，负责加密与身份认证。', usage: 'HTTPS 里的那个 S', tradeoff: '优：证书体系 + 前向安全。缺：握手往返多，TLS1.3 已大幅优化' },
    { name: 'SSL', layer: SESSION, port: '—', desc: 'TLS 的前身，各版本均已爆出漏洞被弃用。', usage: '（历史遗留）', tradeoff: '缺：POODLE、心脏出血等漏洞，禁止再启用' },
    { name: 'RPC', layer: SESSION, port: '—', desc: '远程过程调用：像调本地函数一样调远端（gRPC 的现代实现）。', usage: '微服务内部通信', tradeoff: '优：调用直观、有 IDL 约束。缺：调试不如 REST 直观' },
    { name: 'LDAP', layer: SESSION, port: '389', desc: '轻量目录访问协议，用于读取目录服务。', usage: '企业统一账号/单点登录', tradeoff: '优：查询组织架构高效。缺：写操作弱，模型偏重' },
    { name: 'DAP', layer: SESSION, port: '—', desc: '目录访问协议，LDAP 的前身。', usage: '（历史协议）', tradeoff: '缺：过重，已被 LDAP 取代' },

    { name: 'TCP', layer: TRANS, port: '—', desc: '面向连接、可靠、有序、带流控和拥塞控制。', usage: '网页、文件、邮件、数据库', tradeoff: '优：可靠有序。缺：头大、握手与重传带来延迟' },
    { name: 'UDP', layer: TRANS, port: '—', desc: '无连接的数据报，发出去就算完，不保证到达与顺序。', usage: '音视频通话、在线游戏、DNS', tradeoff: '优：头小开销低延迟小。缺：丢包与乱序要应用层自己处理' },
    { name: 'QUIC', layer: TRANS, port: '443(UDP)', desc: '基于 UDP 重做的可靠传输，把可靠性下沉到每条流。', usage: 'HTTP/3', tradeoff: '优：0-RTT、丢包只影响一条流、换网不断线。缺：依赖 UDP 端口放行' },

    { name: 'IP', layer: NET, port: '—', desc: '网际协议，负责跨网络的寻址与分包转发，本身不可靠。', usage: '一切跨网段通信', tradeoff: '优：简单可扩展。缺：无可靠性保证，需要上层补' },
    { name: 'ICMP', layer: NET, port: '—', desc: '控制消息协议，用来报告差错和探测连通性。', usage: 'ping、traceroute', tradeoff: '优：诊断利器。缺：常被防火墙禁掉，不能作为健康检查唯一手段' },
    { name: 'ARP', layer: NET, port: '—', desc: '把 IP 地址解析成同一链路内的 MAC 地址。', usage: '局域网通信前的必经一步', tradeoff: '优：自动完成。缺：无认证，局域网内的 ARP 欺骗由此而来' },
    { name: 'IGMP', layer: NET, port: '—', desc: '组管理协议，让主机能加入/退出组播组。', usage: 'IPTV、组播推送', tradeoff: '优：一份流给多人。缺：跨公网部署复杂' },
    { name: 'OSPF', layer: NET, port: '—', desc: '内部网关路由协议，基于链路状态计算最短路径。', usage: '企业内网路由', tradeoff: '优：收敛快。缺：配置和调参复杂' },
    { name: 'BGP', layer: NET, port: '179', desc: '边界网关协议，互联网骨干之间的路由协议。', usage: '运营商自治系统之间', tradeoff: '优：策略灵活。缺：配置错误会引发大范围故障' },

    { name: 'Ethernet', layer: LINK, port: '—', desc: '以太网，局域网最主流的成帧与介质访问方式。', usage: '有线局域网', tradeoff: '优：成熟便宜。缺：CSMA/CD 时代的冲突概念已被全双工交换取代' },
    { name: 'Wi-Fi (802.11)', layer: LINK, port: '—', desc: '无线局域网，需要 CSMA/CA 做冲突避免。', usage: '无线接入', tradeoff: '优：免布线。缺：共享介质，干扰和穿墙损耗明显' },
    { name: 'PPP / PPPoE', layer: LINK, port: '—', desc: '点对点协议，拨号宽带常用。', usage: '宽带拨号、专线', tradeoff: '优：带认证。缺：多一层封装，MTU 要相应调小' },
    { name: 'VLAN (802.1Q)', layer: LINK, port: '—', desc: '在同一张物理网络上划分多个广播域。', usage: '网络隔离、按部门分段', tradeoff: '优：隔离广播。缺：跨 VLAN 必须走三层' },
    { name: 'MPLS', layer: LINK, port: '—', desc: '多协议标签交换，用标签替代查路由表做快速转发。', usage: '运营商骨干、专线', tradeoff: '优：转发快、支持流量工程。缺：设备成本和配置复杂度高' },
    { name: 'CDP', layer: LINK, port: '—', desc: 'Cisco 私有邻居发现协议，用来看清拓扑。', usage: '网络设备发现', tradeoff: '优：快速摸清邻居。缺：仅 Cisco 设备、有信息泄露风险' },

    { name: 'RS-232', layer: PHY, port: '—', desc: '串行通信接口标准，定义了电气特性与时序。', usage: '串口调试、工控设备', tradeoff: '优：简单可靠。缺：速率低' },
    { name: 'USB', layer: PHY, port: '—', desc: '通用串行总线，同时管物理连接与供电。', usage: '外设连接', tradeoff: '优：即插即用。缺：线缆长度受限' },
    { name: 'DSL', layer: PHY, port: '—', desc: '在电话铜线上做高频调制传输数据。', usage: '早期宽带入户', tradeoff: '优：复用已有电话线。缺：速率与距离强相关' },
    { name: 'SDH / SONET', layer: PHY, port: '—', desc: '同步光纤网络，运营商骨干的物理层标准。', usage: '长途骨干传输', tradeoff: '优：可靠性高、有保护倒换。缺：成本高' },
]

const layerKeys = [APP, SESSION, TRANS, NET, LINK, PHY]

const filter = ref('all')
const kw = ref('')
const cur = ref('HTTP')

function countOf(l: string): number {
    return protocols.filter((p) => p.layer === l).length
}

const listed = computed(() =>
    protocols.filter((p) => {
        if (filter.value !== 'all' && p.layer !== filter.value) return false
        if (!kw.value.trim()) return true
        const q = kw.value.trim().toLowerCase()
        return [p.name, p.layer, p.usage, p.desc, p.port].join(' ').toLowerCase().includes(q)
    }),
)

const current = computed(() => protocols.find((p) => p.name === cur.value) ?? null)

/* ── 传输层对比 ──────────────────────────────────────── */
const transports = [
    {
        name: 'TCP',
        tag: '可靠优先',
        desc: 'Web 世界的默认选择。宁可慢一点，也不能错一个字节。',
        rows: [
            { k: '是否连接', v: '面向连接（三次握手）' },
            { k: '可靠性', v: '重传 + 排序 + 去重，包必达', good: true },
            { k: '流量控制', v: '滑动窗口' },
            { k: '拥塞控制', v: '慢启动、拥塞避免、快重传' },
            { k: '队头阻塞', v: '丢包后后续数据即使已到也不能交付', bad: true },
            { k: '适用场景', v: '网页、文件、邮件、数据库' },
        ],
    },
    {
        name: 'UDP',
        tag: '实时优先',
        desc: '发出去就算完。可靠性这件事交给应用层按需实现。',
        rows: [
            { k: '是否连接', v: '无连接' },
            { k: '可靠性', v: '不保证到达、顺序、去重', bad: true },
            { k: '头部开销', v: '8 字节（TCP 至少 20）', good: true },
            { k: '拥塞控制', v: '没有（可能拖垮网络）', bad: true },
            { k: 'NAT 穿透', v: '更容易打洞' },
            { k: '适用场景', v: '音视频通话、在线游戏、DNS、IoT' },
        ],
    },
    {
        name: 'QUIC',
        tag: '两者都要',
        desc: '在 UDP 上重做一套可靠传输，并把「可靠」从连接下沉到每条流。',
        rows: [
            { k: '底层', v: 'UDP 443，需放行该 UDP 端口' },
            { k: '握手', v: '内置 TLS1.3，可做到 0-RTT', good: true },
            { k: '队头阻塞', v: '每条 stream 独立，丢包互不牵连', good: true },
            { k: '连接迁移', v: '用 Connection ID，换网不断线', good: true },
            { k: '部署难度', v: '中间件和旧设备支持仍在铺', bad: true },
            { k: '适用场景', v: 'HTTP/3、弱网与移动端优先的业务' },
        ],
    },
]

/* ── 展示用源码 ─────────────────────────────────────── */
const wsCode = `// WebSocket 最妙的地方：它第一次握手用的就是 HTTP。
// 客户端发出 Upgrade 请求，服务端若同意，就回 101 Switching Protocols
// —— 从这一刻起，这条连接上的内容不再是 HTTP。

// 请求（浏览器自动带上）
// GET /ws HTTP/1.1
// Upgrade: websocket
// Connection: Upgrade
// Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
// Sec-WebSocket-Version: 13

// 响应
// HTTP/1.1 101 Switching Protocols
// Upgrade: websocket
// Connection: Upgrade

const ws = new WebSocket('wss://demo.local/ws')

ws.onopen = () => ws.send(JSON.stringify({ type: 'hello' }))
ws.onmessage = (e) => console.log('收到推送', e.data)
ws.onclose = () => console.log('断开了，准备重连')

// 生产必须自己补的三件事：
// 1) 心跳：定时 send ping，超时没 pong 就判定断线
// 2) 重连：指数退避（1s / 2s / 4s …封顶 30s），别写成死循环狂重连
// 3) 重连后要重新订阅 —— 服务端并不知道你「回来了」`

const dnsCode = `# DNS 解析链路，出问题就顺着往下查
dig example.com +trace          # 从根服务器一路查下来，看卡在哪一级
dig @8.8.8.8 example.com A      # 指定 DNS 服务器，判断是不是本地 DNS 的锅
nslookup example.com            # Windows 上也有

# 本机 DNS 缓存
ipconfig /displaydns            # Windows 查看
ipconfig /flushdns              # Windows 清空（改完 hosts 一定要这个）
systemd-resolve --flush-caches  # Linux (systemd-resolved)

# hosts 优先级最高，本地开发常用
cat /etc/hosts                  # Linux/macOS
type C:\\Windows\\System32\\drivers\\etc\\hosts   # Windows

# 端口层面
ss -tlnp                        # 本机监听了哪些端口
nc -vz host port                # 对方端口通不通
curl -v http://host:port/health # 应用层是否真的能响应`
</script>

<style lang="scss" scoped>
.cfg__input {
    flex: 0 0 260px;
    padding: 6px 10px;
    font-size: 12px;
    color: var(--text-primary);
    background: var(--app-bg);
    border: 1px solid var(--hairline);
    border-radius: 0;
    outline: none;

    &:focus {
        border-color: var(--brand);
    }
}

.proto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 6px;
    margin: 12px 0;
}

.proto {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 10px;
    text-align: left;
    cursor: pointer;
    background: var(--surface);
    border: 1px solid var(--hairline);
    transition: border-color var(--transition-fast), background-color var(--transition-fast);

    &:hover {
        border-color: var(--brand);
    }

    &.is-active {
        border-color: var(--brand);
        background: color-mix(in srgb, var(--brand) 10%, var(--surface));
    }
}

.proto__name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
}

.proto__layer {
    font-size: 10px;
    color: var(--text-tertiary);
}

.detail {
    padding: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.detail__head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.detail__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--brand);
}

.detail__badge {
    padding: 1px 7px;
    font-size: 11px;
    color: var(--text-tertiary);
    border: 1px solid var(--hairline);
}

.cards .card .res-row {
    margin-top: 6px;
}

.probe-note {
    margin: 14px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}
</style>
