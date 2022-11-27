<template>
    <div class="command_line">
        <h2>npm版本更新</h2>
        <p>npm version [name] name:major、minor、patch</p> 
        <h2>发布npm</h2>
        <p>npm login <br> npm publish</p>
        <h2>查看npm下载路径</h2>
        <p>npm config get registry</p>
        <h2>切换成淘宝镜像</h2>
        <p>npm config set registry=https://registry.npm.taobao.org/</p>
        <h2>查看已安装包信息</h2>
        <p>npm list 或 npm ls</p>
        <h2>查看注册表中某个包的信息</h2>
        <p>npm view pagename</p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "~@/styles/command_line.less";
</style>