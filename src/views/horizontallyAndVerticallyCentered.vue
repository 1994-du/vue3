<template>
   <div class="horizontally_vertically_centered">
        <h1>div水平垂直居中</h1>
        <h4>当前元素使用绝对定位+位移</h4>
<highlightjs code="position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);"></highlightjs>
<h4>父元素使用flex弹性布局</h4>
<highlightjs code="display: flex;
justify-content: center;
align-items: center;"></highlightjs>
<h4>知道元素宽高的情况(例如：宽高为100px)</h4>
<highlightjs code="position: absolute;
top: 50%;
left: 50%;
margin-top: -50px;
margin-left: -50px;"></highlightjs>
<h4>绝对定位+margin；auto</h4>
<highlightjs code="position: absolute;
left: 0;
right: 0;
top: 0;
bottom: 0;
margin: auto;"></highlightjs>
        <div class="box"></div>
   </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
.horizontally_vertically_centered{
    width: 100%;
    height: 100%;
    position: relative;
}
.box{
    width: 100px;
    height: 100px;
    background: green;
}
.box{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
</style>