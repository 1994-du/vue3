<template>
    <h4>TCP的三次握手</h4>
    <code>
        <pre>1.客户端发送同步序列号报文，请求连接，告知服务器客户端的初始序列号</pre>
        <pre>2.服务端确认收到请求，并告知客户 服务端的序列号</pre>
        <pre>3.客户端确认响应，完成连接</pre>
    </code>
    <h4>TCP四次挥手</h4>
    <code>
        <pre>1.客户端发送终止请求给服务器</pre>
        <pre>2.服务器确认收到终止请求，发送确认</pre>
        <pre>3.服务器发送剩余数据，并发送终止请求给客户端</pre>
        <pre>4.客户端确认服务器的终止请求，发送确认</pre>
        <pre>5.连接终止</pre>
    </code>
</template>

<script setup>

</script>
<style scoped lang='less'>
</style>