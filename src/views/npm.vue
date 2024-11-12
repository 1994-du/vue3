<template>
    <div class="command_line">
        <h1>npm命令</h1>
        <h4>npm版本更新</h4>
        <code>
            <pre>npm version [name]</pre>
            <pre>name:major \ minor \ patch</pre>
            <pre>npm version patch</pre>
        </code>
        <h4>发布npm</h4>
        <code>
            <pre>npm login</pre>
            <pre>npm publish</pre>
        </code>
        <h4>查看npm下载路径</h4>
        <code>
            <pre>npm config get registry</pre>
        </code>
        <h4>切换成淘宝镜像</h4>
        <code>
            <pre>npm config set registry=https://registry.npm.taobao.org</pre>
        </code>
        <h4>查看已安装包信息</h4>
        <code>
            <pre>npm list \ npm ls</pre>
        </code>
        <h4>查看注册表中某个包的信息 \ 查看本地依赖包信息</h4>
        <code>
            <pre>npm view pagename \ npm list pagename</pre>
        </code>
        <h4>npm创建vite项目</h4>
        <code>
            <pre>npm create vite@latest</pre>
        </code>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
</style>