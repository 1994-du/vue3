<template>
    <h4>OSI 七层模型：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层</h4>
    <h4>TCP/IP 四层模型：网络接口层、网络层、传输层、应用层</h4>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="layer" label="层级"></el-table-column>
        <el-table-column prop="protocol" label="协议/技术"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
    </el-table>
</template>

<script setup>
const tableData = [
    {
        layer: '应用层',
        protocol: 'HTTP、NNTP、IRC、SMTP、Telent、Gopher、FTP、Whois、Finger',
        description: '提供应用服务，如 Web 浏览、电子邮件、文件传输等'
    },
    {
        layer: '表示层',
        protocol: 'LPP',
        description: '数据格式转换，如加密、压缩等'
    },
    {
        layer: '会话层',
        protocol: 'SSL、TLS、DAP、LDAP、RPC',
        description: '会话管理，如加密、认证、会话密钥等'
    },
    {
        layer: '传输层',
        protocol: 'TCP、UDP',
        description: '端到端数据传输，如 Web 浏览、电子邮件、文件传输等'
    },
    {
        layer: '网络层',
        protocol: 'ICMP',
        description: '网络层数据传输，如路由选择、错误报告等'
    },
    {
        layer: '数据链路层',
        protocol: 'XTP、DCAP、MPLS、PPTP、L2TP、CDP',
        description: '数据链路层数据传输，如以太网、令牌环网等'
    },
    {
        layer: '物理层',
        protocol: 'Ethernet、Wi-Fi(IEEE 802.11)、Bluetooth、RS-232、USB、DSL、ISDN、SONET/SDH',
        description: '定义物理连接特性，如电气特性、物理拓扑、传输速率、接口标准等，是数据通信的物理媒介'
    }
]
</script>
<style scoped lang='less'>
</style>
