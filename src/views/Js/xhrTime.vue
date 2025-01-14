<template>
<h2>RTT:最小请求响应时间</h2>
<h4>多个IP地址，在最短时间内找出RTT最小的IP？（并发最大为10）</h4>
<p>1.执行一批请求获取最小RTT</p>
<p>2.下一批次请求如果在最小RTT时依然未响应，就废弃。小于当前RTT就重置为当前RTT</p>
<p>3.最终返回最小RTT的IP</p>
</template>
<script setup>
</script>
<style lang='scss' scoped>
p{
    text-align: left;
}
</style>