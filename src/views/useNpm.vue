<template>
    <div class="command_line">
        <h1>npm命令</h1>
        <h4>npm版本更新</h4>
        <highlightjs code="npm version [name];name:major、minor、patch"></highlightjs>
        <h4>发布npm</h4>
        <p>npm login <br> npm publish</p>
        <h4>查看npm下载路径</h4>
        <p>npm config get registry</p>
        <h4>切换成淘宝镜像</h4>
        <p>npm config set registry=https://registry.npm.taobao.org/</p>
        <h4>查看已安装包信息</h4>
        <p>npm list 或 npm ls</p>
        <h4>查看注册表中某个包的信息</h4>
        <p>npm view pagename</p>
        <h4>npm创建vite项目</h4>
        <p>npm create vite@latest</p>
    </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
@import "@/styles/use_npm.less";
</style>