<template>
    <div class="div_center">
        <h1>div水平垂直居中</h1>
        <h4>当前元素使用绝对定位+位移</h4>
        <div class="code">
            <pre>position: absolute;</pre>
            <pre>top: 50%;</pre>
            <pre>left: 50%;</pre>
            <pre>transform: translate(-50%,-50%);</pre>
        </div>
        <h4>父元素使用flex弹性布局</h4>
        <div class="code">
            <pre>display: flex;</pre>
            <pre>justify-content: center;</pre>
            <pre>align-items: center;</pre>
        </div>
        <h4>知道元素宽高的情况(例如：宽高为100px)</h4>
        <div class="code">
            <pre>position: absolute;</pre>
            <pre>top: 50%;</pre>
            <pre>left: 50%;</pre>
            <pre>margin-top: -50px;</pre>
            <pre>margin-left: -50px;</pre>
        </div>
        <h4>绝对定位+margin；auto</h4>
        <div class="code">
            <pre>position: absolute;</pre>
            <pre>left: 0;</pre>
            <pre>right: 0;</pre>
            <pre>top: 0;</pre>
            <pre>bottom: 0;</pre>
            <pre>margin: auto;</pre>
        </div>
   </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
.div_center{
    width: 100%;
    height: 100%;
    position: relative;
}
</style>