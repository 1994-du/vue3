<template>
    <h1>nvm使用</h1>
    <h4>
        <a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank">下载地址</a>
        选择下载nvm-setup.zip。
    </h4>
    <h4>查看可在线安装的node版本(LTS:长期支持)</h4>
    <highlightjs code="nvm list available"></highlightjs>
    <highlightjs code="|   CURRENT    |     LTS      |  OLD STABLE  | OLD UNSTABLE |
|--------------|--------------|--------------|--------------|
|    19.6.0    |   18.14.0    |   0.12.18    |   0.11.16    |
|    19.5.0    |   18.13.0    |   0.12.17    |   0.11.15    |
|    19.4.0    |   18.12.1    |   0.12.16    |   0.11.14    |"></highlightjs>
    <h4>安装node版本</h4>
    <highlightjs code="安装指定node版本 nvm install 18.14.0 
安装最新稳定node版本 nvm install stable"></highlightjs>
    <h4>查看所有已安装的node版本</h4>
    <highlightjs code="nvm list 或者 nvm ls"></highlightjs>
    <h4>切换node版本</h4>
    <highlightjs code="nvm use 18.14.0"></highlightjs>
    <h4>设置默认node版本</h4>
    <highlightjs code="nvm alias default"></highlightjs>
    <h4>卸载node版本</h4>
    <highlightjs code="nvm uninstall 18.14.0"></highlightjs>

</template>
<script setup name="nvmuse">
</script>
<style scoped>
*{
    text-align: left;
}
</style>