<template>
    <div class="page">
        <!-- ① 概念 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Network Model</span>
                    <h2 class="panel__title">分层不是为了画图好看，是为了能换</h2>
                </div>
                <span class="panel__meta">OSI 七层是教科书，TCP/IP 四层是现实</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    网络通信要处理的事情太多：怎么把电脉冲变成 0 和 1、怎么在一堆机器里找到目标、
                    怎么保证包没丢、怎么让浏览器看懂服务端回了什么。分层做的事就是<em>把这些问题切开</em>，
                    每层只解决一个，并向上提供一个干净的<strong>服务接口</strong>。
                    这样换掉某一层时，其他层不用动 —— 你可以把网线换成 WiFi（只动下面两层），
                    上面跑的 HTTP 完全没感觉。
                </p>
                <div class="intro__points">
                    <div class="point">
                        <span class="point__k">OSI 七层</span>
                        <span class="point__v">理论模型，概念清晰，考试和排障用语里到处是它</span>
                    </div>
                    <div class="point">
                        <span class="point__k">TCP/IP 四层</span>
                        <span class="point__v">实际在跑的协议栈，把 OSI 的上三层合并成了「应用层」</span>
                    </div>
                    <div class="point">
                        <span class="point__k">封装</span>
                        <span class="point__v">数据往下走时逐层加头，往上走时逐层剥头 —— 中间设备只读自己关心的那层</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ② 封装动画 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 01</span>
                    <h2 class="panel__title">一封 GET 请求是怎么被打包的</h2>
                </div>
                <span class="panel__meta">从应用层一路往下，每过一层就多一个头</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    你在地址栏敲下回车，浏览器要发的是一句 <code>GET / HTTP/1.1</code>。
                    它每往下走一层就会被<strong>包上一层新的头</strong>，名字也跟着变：
                    报文 → 段 → 包 → 帧 → 比特。点「往下走一层」，看看每层往里面塞了什么。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button type="button" class="w-btn" @click="down" :disabled="step >= layers.length">
                            往下封装一层 ↓
                        </button>
                        <button type="button" class="w-btn" @click="up" :disabled="step <= 0">
                            ↑ 往回剥一层
                        </button>
                        <button type="button" class="w-btn" @click="step = 0">重置</button>
                        <button type="button" class="w-btn" @click="step = layers.length">一次性打完</button>
                    </div>
                    <span class="w-hint">
                        当前处于：{{ step === 0 ? '还没开始' : layers[step - 1].osi }}
                    </span>
                </div>

                <!-- 洋葱式封装可视化 -->
                <div class="onion">
                    <div class="onion__inner">
                        <span class="onion__label">应用层数据</span>
                        <code class="onion__data mono">GET / HTTP/1.1\r\nHost: demo.local\r\n</code>
                    </div>
                    <div v-for="(l, i) in visibleLayers" :key="l.key" class="onion__layer"
                        :style="{ '--depth': i + 1, '--shift': (layers.length - (i + 1)) * 10 + 'px' }">
                        <div class="onion__head">
                            <span class="onion__unit mono">{{ l.unit }}</span>
                            <span class="onion__name">{{ l.osi }}</span>
                        </div>
                        <div class="onion__fields">
                            <span v-for="f in l.header" :key="f" class="onion__chip mono">{{ f }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="step === 0" class="lane-empty">现在还是裸的应用数据，一层都没包</div>

                <p class="probe-note">
                    注意每一层<strong>只关心自己的头</strong>：传输层的 TCP 头管端口和顺序，
                    网络层的 IP 头管跨网段寻址，链路层的以太头管「这一跳要给谁」。
                    它们互相不看对方的内容 —— 这就是分层的意义。
                </p>
            </div>
        </section>

        <!-- ③ 设备视角 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Experiment 02</span>
                    <h2 class="panel__title">同一个包，不同设备看到的样子</h2>
                </div>
                <span class="panel__meta">这就是为什么叫「二层交换机」「三层路由器」</span>
            </div>
            <div class="panel__body">
                <p class="intro__text">
                    包在路上经过的每个设备，<em>都有自己能读到的一层</em>。读完就照着那一层的信息转发，
                    更里面的内容它既不拆也不需要懂。点一下设备，看它的视野边界在哪。
                </p>

                <div class="w-row">
                    <div class="w-btns">
                        <button v-for="d in devices" :key="d.key" type="button" class="w-btn"
                            :class="curDev === d.key ? 'is-active' : ''" @click="curDev = d.key">
                            {{ d.name }}
                        </button>
                    </div>
                    <span class="w-hint">{{ curDevice.summary }}</span>
                </div>

                <div class="device-view">
                    <div v-for="l in deviceLayers" :key="l.key" class="device-layer"
                        :class="deviceCanSee(l.key) ? 'is-visible' : 'is-blind'">
                        <span class="device-layer__name">{{ l.osi }}</span>
                        <span class="device-layer__act">
                            {{ deviceCanSee(l.key) ? '能读，可以据此做决策' : '看不见，整段当数据搬运' }}
                        </span>
                    </div>
                </div>

                <p class="verdict__note">
                    <strong>{{ curDevice.name }}：</strong>{{ curDevice.detail }}
                </p>
            </div>
        </section>

        <!-- ④ 七层对照表 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Reference</span>
                    <h2 class="panel__title">OSI 七层 ↔ TCP/IP 四层</h2>
                </div>
                <span class="panel__meta">点一行看这一层的协议、数据单位和寻址方式</span>
            </div>
            <div class="panel__body">
                <div class="stack">
                    <div class="stack__col stack__col--head">
                        <span>OSI 七层</span>
                        <span>TCP/IP（合并后）</span>
                        <span>数据单位</span>
                        <span>寻址</span>
                    </div>
                    <div v-for="g in groups" :key="g.osi" class="stack__head">
                        <span class="stack__osi">{{ g.osi }}</span>
                        <span class="stack__tcpip">{{ g.tcpip }}</span>
                        <span class="stack__unit mono">{{ g.unit }}</span>
                        <span class="stack__addr">{{ g.addr }}</span>
                    </div>
                </div>

                <div class="w-row" style="margin-top: 14px">
                    <div class="w-btns">
                        <button v-for="l in [...layers].reverse()" :key="l.key" type="button" class="w-btn"
                            :class="curLayer === l.key ? 'is-active' : ''" @click="curLayer = l.key">
                            {{ l.osi }}
                        </button>
                    </div>
                    <span class="w-hint">{{ curLayerInfo.tcpip }} 层</span>
                </div>

                <div class="kv-grid">
                    <div class="kv">
                        <span class="kv__k">主要协议</span>
                        <span class="kv__v">{{ curLayerInfo.protos }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">数据单位</span>
                        <span class="kv__v mono">{{ curLayerInfo.unit }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">典型设备</span>
                        <span class="kv__v">{{ curLayerInfo.device }}</span>
                    </div>
                    <div class="kv">
                        <span class="kv__k">负责</span>
                        <span class="kv__v">{{ curLayerInfo.desc }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ⑤ Source -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Source</span>
                    <h2 class="panel__title">排障时按分层往下查</h2>
                </div>
                <span class="panel__meta">自底向上，一条命令一层</span>
            </div>
            <div class="panel__body">
                <div class="code-block">
                    <div class="code-block__label">从「通不通」到「为什么慢」，逐层定位</div>
                    <CodeEditor :code="debugCode" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

type Layer = {
    key: string
    osi: string
    tcpip: string
    unit: string
    addr: string
    protos: string
    device: string
    desc: string
    header: string[] // 往下封装时这一层加的头字段
}

const layers: Layer[] = [
    {
        key: 'app',
        osi: '应用层',
        tcpip: '应用层',
        unit: '报文 Message',
        addr: '主机名 / URL',
        protos: 'HTTP、HTTPS、DNS、FTP、SMTP、SSH、 WebSocket',
        device: ' —（运行在终端和服务器上）',
        desc: '定义应用之间交换的数据格式，直接服务于用户',
        header: ['GET / HTTP/1.1', 'Host: demo.local'],
    },
    {
        key: 'pres',
        osi: '表示层',
        tcpip: '应用层',
        unit: '报文',
        addr: '—',
        protos: 'TLS/SSL、JPEG/PNG/MP4、ASCII/UTF-8、gzip',
        device: '—',
        desc: '数据格式转换、加密压缩，让两端能看懂彼此的字节',
        header: ['TLS Record Header', '加密后的密文'],
    },
    {
        key: 'sess',
        osi: '会话层',
        tcpip: '应用层',
        unit: '报文',
        addr: '—',
        protos: 'RPC、NetBIOS、Socket 会话管理',
        device: '—',
        desc: '建立、维持和断开会话，负责断点恢复与同步',
        header: ['Session ID'],
    },
    {
        key: 'trans',
        osi: '传输层',
        tcpip: '传输层',
        unit: '段 Segment（TCP）/ 数据报（UDP）',
        addr: '端口号',
        protos: 'TCP、UDP',
        device: '—（由操作系统内核实现）',
        desc: '端到端的可靠传输：端口复用、分包重组、重传、流量与拥塞控制',
        header: ['源端口 54321', '目的端口 443', 'seq / ack', '窗口大小'],
    },
    {
        key: 'net',
        osi: '网络层',
        tcpip: '网际层 IP',
        unit: '包 Packet',
        addr: 'IP 地址',
        protos: 'IP、ICMP、IGMP、OSPF、BGP、ARP',
        device: '路由器 Router',
        desc: '跨网段寻址与路由选择，把包从一个网络送到另一个网络',
        header: ['源 IP 192.168.1.10', '目的 IP 106.15.207.57', 'TTL=64', '协议号 TCP'],
    },
    {
        key: 'link',
        osi: '数据链路层',
        tcpip: '网络接口层',
        unit: '帧 Frame',
        addr: 'MAC 地址',
        protos: 'Ethernet、Wi-Fi(802.11)、PPP、VLAN、MPLS',
        device: '交换机 Switch / 网桥 Bridge',
        desc: '在相邻节点之间交付帧，做差错校验和介质访问控制',
        header: ['源 MAC aa:bb:cc:dd:ee:ff', '下一跳的 MAC', '以太类型 0x0800', 'FCS 校验'],
    },
    {
        key: 'phy',
        osi: '物理层',
        tcpip: '网络接口层',
        unit: '比特 Bit',
        addr: '—',
        protos: 'RJ45、双绞线、光纤、无线电波、RS-232',
        device: '集线器 Hub、中继器、光模块',
        desc: '把比特流变成电信号或光信号发出去，只关心怎么表示 0 和 1',
        header: ['前导码 + 帧起始符', '01001010…（高低电平）'],
    },
]

/* ── 封装演示 ────────────────────────────────────────── */
const step = ref(0)
const visibleLayers = computed(() => layers.slice(0, step.value).reverse())

function down() {
    if (step.value < layers.length) step.value += 1
}
function up() {
    if (step.value > 0) step.value -= 1
}

/* ── 设备视角 ────────────────────────────────────────── */
type Device = {
    key: string
    name: string
    summary: string
    sees: string[] // 它能处理的层（自底向上）
    detail: string
}

const devices: Device[] = [
    {
        key: 'host',
        name: '你的主机',
        summary: '完整的七层，全部都要处理',
        sees: ['phy', 'link', 'net', 'trans', 'sess', 'pres', 'app'],
        detail: '发送端从上往下逐层加头，接收端从下往上逐层剥头。应用层（浏览器）最终拿到的，正是最初那份 HTTP 报文 —— 中间怎么走的它一概不知。',
    },
    {
        key: 'hub',
        name: '集线器 Hub',
        summary: '物理层设备，连 Frame 都不认识',
        sees: ['phy'],
        detail: '它只做一件事：把一个口收到的电信号放大后转发给所有其他口。不知道 MAC、不知道 IP，所以所有主机共享带宽、共享冲突域 —— 这就是它被交换机淘汰的原因。',
    },
    {
        key: 'switch',
        name: '二层交换机',
        summary: '读取数据链路层，靠 MAC 表转发',
        sees: ['phy', 'link'],
        detail: '它看以太帧里的目的 MAC，查自己的 MAC 地址表决定从哪个口出去，IP 头和应用数据一概不动。同一个 VLAN 内部的转发全靠它。',
    },
    {
        key: 'router',
        name: '三层路由器',
        summary: '读到网络层，靠路由表选下一跳',
        sees: ['phy', 'link', 'net'],
        detail: '它剥到 IP 头，看目的 IP 查路由表决定下一跳。转发时会重写链路层的帧头（MAC 换成下一跳的），但 IP 头里的源目地址保持不变 —— 这也是「MAC 管一跳、IP 管全程」这句话的由来。',
    },
    {
        key: 'lb',
        name: '四层负载均衡',
        summary: '看到传输层，能读懂端口',
        sees: ['phy', 'link', 'net', 'trans'],
        detail: 'LVS、云厂商的 NLB 属于这一类：它根据 IP + 端口做转发，效率高，但看不见 URL 和 Host，也就做不到按路径分流。',
    },
    {
        key: 'gw',
        name: '七层网关 / Nginx',
        summary: '一路读到应用层，能看懂 URL 和 Host',
        sees: ['phy', 'link', 'net', 'trans', 'sess', 'pres', 'app'],
        detail: '反向代理、WAF、API 网关都在这一层。它能按域名、路径、Header 分流，也能终止 TLS —— 代价是必须完整解析应用层协议，性能和数据面直转不是一个量级。',
    },
]

const curDev = ref('router')
const curDevice = computed(() => devices.find((d) => d.key === curDev.value)!)
const deviceLayers = computed(() => layers)

function deviceCanSee(key: string): boolean {
    return curDevice.value.sees.includes(key)
}

/* ── 层详情 ──────────────────────────────────────────── */
const curLayer = ref('trans')
const curLayerInfo = computed(() => layers.find((l) => l.key === curLayer.value)!)

const groups = [...layers].reverse()

/* ── 展示用源码 ─────────────────────────────────────── */
const debugCode = `# 排障要顺着分层往上走，每一层一条命令

# ── 物理层 / 链路层：网卡起来了没、MAC 学到了没
ip link show                    # 看网卡状态是否 UP
ethtool eth0                    # 速率、双工、是否真的协商上了（半双工会巨慢）

# ── 网络层：IP 通不通、路由对不对
ip addr show                    # 本机 IP 配对了没
ip route get 106.15.207.57      # 这到底是会从哪个口出去
ping -c 4 106.15.207.57         # ICMP 通不通（注意：有些机器禁 ping）
traceroute -n 106.15.207.57     # 卡在第几跳，就能判断是内网还是运营商

# ── 传输层：端口开没开、连接状态如何
ss -tlnp | grep 80              # 服务到底 listen 了没有
ss -tan state established '( sport = :443 )'   # 现有连接
nc -vz 106.15.207.57 443        # 从本机探一下端口是否可达（防火墙/安全组）

# ── 应用层：TLS 握手、证书、HTTP 语句本身
openssl s_client -connect demo.local:443 -servername demo.local   # 证书链与协商结果
curl -v https://demo.local/api/users/me          # 完整请求/响应头
curl -o /dev/null -s -w "DNS:%{time_namelookup}s 连接:%{time_connect}s TLS:%{time_appconnect}s 首字节:%{time_starttransfer}s 总计:%{time_total}s\\n" https://demo.local

# 时间构成是分層排障的捷径：
# time_namelookup 大 → DNS 的问题
# time_connect   大 → 网络链路或握手的问题
# time_starttransfer 大 → 服务端处理慢（应用层）
# time_total - time_starttransfer 大 → 响应体太大或带宽受限`
</script>

<style lang="scss" scoped>
.onion {
    margin: 14px 0 12px;
}

.onion__inner {
    padding: 12px;
    border: 1px dashed var(--hairline);
    background: var(--app-bg);
}

.onion__label {
    display: block;
    margin-bottom: 6px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.onion__data {
    display: block;
    font-size: 12px;
    color: var(--brand);
    word-break: break-all;
}

.onion__layer {
    padding: 10px 12px;
    margin-top: 6px;
    border: 1px solid var(--hairline);
    border-left: 3px solid var(--brand);
    background: var(--surface);
}

.onion__head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
}

.onion__unit {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand);
}

.onion__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.onion__fields {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.onion__chip {
    padding: 2px 7px;
    font-size: 11px;
    color: var(--text-secondary);
    border: 1px solid var(--hairline);
    background: var(--surface-muted);
}

.lane-empty {
    font-size: 12px;
    color: var(--text-tertiary);
}

.device-view {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 12px 0;
}

.device-layer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border: 1px solid var(--hairline);
    font-size: 12px;

    &.is-visible {
        border-left: 3px solid var(--brand);
        background: color-mix(in srgb, var(--brand) 8%, var(--surface));
    }

    &.is-blind {
        opacity: 0.45;
        border-left: 3px solid var(--hairline);
    }
}

.device-layer__name {
    flex-shrink: 0;
    min-width: 92px;
    color: var(--text-primary);
}

.device-layer__act {
    color: var(--text-tertiary);
}

.verdict__note {
    margin: 0;
    padding: 10px 12px;
    font-size: 12px;
    line-height: 1.75;
    color: var(--text-secondary);
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.stack {
    border: 1px solid var(--hairline);
}

.stack__col--head {
    display: grid;
    grid-template-columns: 1.1fr 1.3fr 1.4fr 1fr;
    gap: 8px;
    padding: 8px 12px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    background: var(--surface-raised);
    border-bottom: 1px solid var(--hairline);
}

.stack__head {
    display: grid;
    grid-template-columns: 1.1fr 1.3fr 1.4fr 1fr;
    gap: 8px;
    padding: 8px 12px;
    font-size: 12px;
    border-bottom: 1px solid var(--hairline);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: var(--surface-muted);
    }
}

.stack__osi {
    color: var(--text-primary);
}

.stack__tcpip,
.stack__addr {
    color: var(--text-secondary);
}

.stack__unit {
    font-size: 11px;
    color: var(--text-tertiary);
}

.probe-note {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-tertiary);
}

@media (max-width: 760px) {
    .stack__col--head,
    .stack__head {
        grid-template-columns: 1fr;
        gap: 2px;
    }

    .stack__col--head span:not(:first-child) {
        display: none;
    }
}
</style>
