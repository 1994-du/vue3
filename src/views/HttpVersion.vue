<!--  -->
<template>
     <h2>http（Hypertext Transfer Protocol）超文本传输协议，最近的版本变化</h2>
    <p><strong>http 0.9</strong>:1991年发布，
        没有header，只支持Get，单词TCP连接只接收一次请求，请求完毕后TCP连接关闭</p>
    <p><strong>http 1.0</strong>:1996年发布，
        增加了请求资源头部信息HEAD，
        增加了status code用于声明请求结果,
        缺点：每请求一次资源就创建一次tcp连接、消息请求时没有传递hostname、数据没有加密</p>
    <p><strong>http 1.1</strong>:1997年发布，
        现在使用最广泛的版本，增加了host头，允许不同域名配置在同一IP地址的服务器上。
        2.连接可复用，同意TCP连接可以发送多个请求，每个域名浏览器最多同时开6个TCP。
        3.type、language、encoding等header；增加了TLS支持，即https传输</p>
    <p><strong>http 2</strong>:2015年发布，
        可以在一个tcp连接中并发发送请求；
        缺点：基于TCP传输，</p>
    <p><strong>http 3</strong>:2018年发布，</p>
    <h2>网络传输的层级：应用层、传输层、网络层、数据链路层、物理层</h2>
    <table cellspacing="0" cellpadding="10px 0">
        <tr>
            <th>层级</th>
            <th>应用层</th>
            <th>表示层</th>
            <th>会话层</th>
            <th>传输层</th>
            <th>网络层</th>
            <th>数据链路层</th>
            <th>物理层</th>
        </tr>
        <tr>
            <td>协议/技术</td>
            <td>HTTP、NNTP、IRC、SMTP、Telent、Gopher、FTP、Whois、Finger</td>
            <td>LPP</td>
            <td>SSL、TLS、DAP、LDAP、RPC</td>
            <td>TCP、UDP</td>
            <td>ICMP</td>
            <td>XTP、DCAP、MPLS、PPTP、L2TP、CDP</td>
            <td>3</td>
        </tr>
        
    </table>
</template>

<script setup>
</script>
<style lang="less" scoped>
p{
    text-align: left;
}
table{
    width: 100%;
    max-height: 400px;
    border: 1px solid #aaa;
    margin: 0;
    padding: 0;
    th{
        border: 1px solid #aaa;
    }
    th:first-of-type{
        font-weight: bold;
        background: black;
        color: white;
    }
    td{
        border: 1px solid #aaa;
    }
    td:nth-of-type(1){
        font-weight: bold;
        background: black;
        color: white;
    }
    tr:last-of-type{
        height: 200px;
    }
}
</style>