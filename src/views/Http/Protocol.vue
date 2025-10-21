<template>
    <el-table :data="tableData" height="800px">
        <el-table-column label="协议" prop="protocol"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="用途" prop="usage"></el-table-column>
        <el-table-column label="优缺点" prop="note"></el-table-column>
        <el-table-column label="示例" prop="example"></el-table-column>
    </el-table>
</template>

<script setup>
const tableData = [
    {
        protocol: 'HTTP',
        description: '超文本传输协议，用于在Web浏览器和Web服务器之间传输超文本。',
        usage: '网页浏览、文件下载等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '网页浏览、文件下载等'
    },
    {
        protocol: 'NNTP',
        description: '网络新闻传输协议，用于在新闻服务器和新闻客户端之间传输新闻文章。',
        usage: '新闻阅读、新闻发布等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '新闻阅读、新闻发布等'
    },
    {
        protocol: 'IRC',
        description: '互联网中继聊天协议，用于在IRC服务器和IRC客户端之间传输聊天消息。',
        usage: '聊天、游戏等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '聊天、游戏等'
    },
    {
        protocol: 'SMTP',
        description: '简单邮件传输协议，用于在邮件服务器和邮件客户端之间传输邮件。',
        usage: '发送邮件、接收邮件等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '发送邮件、接收邮件等'
    },
    {
        protocol: 'Telnet',
        description: '远程登录协议，用于在本地计算机上登录远程计算机。',
        usage: '登录远程计算机',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '登录远程计算机'
    },
    {
        protocol: 'Gopher',
        description: '超文本传输协议，用于在Web浏览器和Web服务器之间传输超文本。',
        usage: '文件传输、目录列表等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '文件传输、目录列表等'
    },
    {
        protocol: 'FTP',
        description: '文件传输协议，用于在本地计算机和远程计算机之间传输文件。',
        usage: '文件传输',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '文件传输'
    },
    {
        protocol: 'WHOIS',
        description: '域名查询协议，用于查询域名的注册信息，如域名的注册人、注册时间、注册邮箱等。',
        usage: '查询域名注册信息',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '查询域名注册信息'
    },
    {
        protocol: 'Finger',
        description: '用户信息查询协议，用于查询用户的注册信息，如用户名、注册时间、注册邮箱等。',
        usage: '查询用户注册信息',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '查询用户注册信息'
    },
    {
        protocol: 'LPP',
        description: '本地过程调用协议，用于在本地计算机上调用本地过程。',
        usage: '本地过程调用',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '本地过程调用'
    },
    {
        protocol: 'SSL',
        description: '安全套接层协议，用于在应用层和传输层之间加密通信，保护数据的机密性和完整性。',
        usage: '加密通信',
        note: '优点：加密通信、保护数据机密性和完整性。缺点：头大、开销大、延迟高、复杂。',
        example: 'https、ssl、tls'
    },
    {
        protocol: 'TLS',
        description: '传输层安全协议，用于在应用层和传输层之间加密通信，保护数据的机密性和完整性。',
        usage: '加密通信',
        note: '优点：加密通信、保护数据机密性和完整性。缺点：头大、开销大、延迟高、复杂。',
        example: 'https、ssl、tls'
    },
    {
        protocol: 'DAP',
        description: '目录访问协议，用于在目录服务器和目录客户端之间传输目录信息。',
        usage: '目录查询',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '目录查询'
    },
    {
        protocol: 'LDAP',
        description: '轻量级目录访问协议，用于在目录服务器和目录客户端之间传输目录信息。',
        usage: '目录查询',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '目录查询'
    },
    {
        protocol: 'RPC',
        description: '远程过程调用协议，用于在不同计算机上调用远程过程。',
        usage: '远程过程调用',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '远程过程调用'
    },
    {
        protocol: 'TCP',
        description: '传输控制协议，用于可靠的、有序的、流控制的、拥塞控制的应用，如文件传输、网页浏览等。',
        usage: '文件传输、网页浏览等',
        note: '优点：可靠、有序、流量控制、拥塞控制。缺点：头大、开销大、延迟高、复杂。',
        example: 'telnet、ftp、ssh'
    },
    {
        protocol: 'UDP',
        description: '用户数据报协议，用于实时应用，如视频会议、在线游戏等。',
        usage: '视频会议、在线游戏等',
        note: '优点：头小、开销低、延迟低、简单、易于 NAT 穿透。缺点：不可靠、无顺序、不安全（需上层实现）、无拥塞控制风险网络拥塞。',
        example: 'voip、在线游戏等'
    },
    {
        protocol: 'QUIC',
        description: '快速UDP互联网连接，结合了TCP和UDP的优点，如低延迟、高吞吐量、流量控制、拥塞控制等。',
        usage: '视频会议、在线游戏等',
        note: '优点：低延迟、高吞吐量、流量控制、拥塞控制。缺点：头大、开销大、复杂。',
        example: '视频会议、在线游戏等'
    },
    {
        protocol: 'ICMP',
        description: '互联网控制消息协议，用于在IP网络中发送错误消息和操作信息，如ping、traceroute等。',
        usage: 'ping、traceroute等',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: 'ping、traceroute等'
    },
    {
        protocol: 'IGMP',
        description: '互联网组管理协议，用于在IPv4网络中管理组播组，如在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'IP',
        description: '互联网协议，用于在网络中传输数据报，如在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'ARP',
        description: '地址解析协议，用于将IP地址解析为MAC地址，如在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'NDP',
        description: '邻居发现协议，用于在IPv6网络中发现邻居节点，如在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'DHCP',
        description: '动态主机配置协议，用于自动分配IP地址、子网掩码、网关、DNS等网络参数，如在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'XTP',
        description: '扩展传输协议，用于在不同计算机上调用远程过程。',
        usage: '远程过程调用',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '远程过程调用'
    },
    {
        protocol: 'DCAP',
        description: '分布式计算协议，用于在不同计算机上调用远程过程。',
        usage: '远程过程调用',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '远程过程调用'
    },
    {
        protocol: 'MPLS',
        description: '多协议标签交换协议，用于在IP网络中实现流量工程和QoS。',
        usage: '流量工程和QoS',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '流量工程和QoS'
    },
    {
        protocol: 'PPTP',
        description: '点对点隧道协议，用于在IP网络中实现VPN。',
        usage: 'VPN',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: 'VPN'
    },
    {
        protocol: 'L2TP',
        description: '第二层隧道协议，用于在IP网络中实现VPN。',
        usage: 'VPN',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: 'VPN'
    },
    {
        protocol: 'CDP',
        description: ' Cisco 设备发现协议，用于在 Cisco 网络中发现设备。',
        usage: '在 Cisco 网络中发现设备',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在 Cisco 网络中发现设备'
    },
    {
        protocol: 'Ethernet',
        description: '以太网协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'WiFi',
        description: '无线局域网协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'Bluetooth',
        description: '蓝牙协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'RS-232',
        description: '串口协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'USB',
        description: '通用串行总线协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'DSL',
        description: '数字 subscriber line 协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'ISDN',
        description: '集成服务数字网络协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'SDH',
        description: '同步数字 hierarchy 协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    },
    {
        protocol: 'SONET',
        description: '同步光网络协议，用于在本地网络中通信。',
        usage: '在本地网络中通信',
        note: '优点：简单、易于实现。缺点：不可靠、无顺序、不安全（需上层实现）。',
        example: '在本地网络中通信'
    }
];

</script>
<style scoped lang='less'>
</style>