<template>
    <div class="command_line">
        <h1>npm命令</h1>
        <h4>npm版本更新</h4>
        <highlightjs :code="$stripIndent`
        npm version [name];
        name:major、minor、patch`"></highlightjs>
        <h4>发布npm</h4>
        <highlightjs :code="$stripIndent`npm login
npm publish`"></highlightjs>
        <h4>查看npm下载路径</h4>
        <highlightjs :code="$stripIndent`npm config get registry`"></highlightjs>
        <h4>切换成淘宝镜像</h4>
        <highlightjs :code="$stripIndent`npm config set registry=https://registry.npm.taobao.org`"></highlightjs>
        <h4>查看已安装包信息</h4>
        <highlightjs :code="$stripIndent`npm list 或 npm ls`"></highlightjs>
        <h4>查看注册表中某个包的信息</h4>
        <highlightjs :code="$stripIndent`npm view pagename`"></highlightjs>
        <h4>npm创建vite项目</h4>
        <highlightjs :code="$stripIndent`npm create vite@latest`"></highlightjs>
    </div>
</template>

<script setup>
import 'highlight.js/styles/github-dark.css'

</script>

<style lang="less" scoped>
@import "@/styles/use_npm.less";
</style>