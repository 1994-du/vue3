<template>
    <div class="command_line">
        <h1>npm命令</h1>
        <h4>npm版本更新</h4>
        <pre>
            <code>npm version [name]</code>
            <code>name:major、minor、patch</code>   
        </pre>
        
        <h4>发布npm</h4>
        <pre>
            <code>npm login</code>
            <code>npm publish</code>
        </pre>
        <h4>查看npm下载路径</h4>
        <pre>
            <code>npm config get registry</code>
        </pre>
        <h4>切换成淘宝镜像</h4>
        <pre>
            <code>npm config set registry=https://registry.npm.taobao.org</code>
        </pre>
        <h4>查看已安装包信息</h4>
        <pre>
            <code>npm list</code>
        </pre>
        <h4>查看注册表中某个包的信息</h4>
        <pre>
            <code>npm view pagename</code>
        </pre>
        <h4>npm创建vite项目</h4>
        <pre>
            <code>npm create vite@latest</code>
        </pre>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
</style>