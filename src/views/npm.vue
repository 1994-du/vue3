<template>
    <div class="masonry">
      <code>
        <pre>// npm版本更新</pre>
        <pre>npm version [name]</pre>
        <pre>name:major \ minor \ patch</pre>
        <pre>npm version patch</pre>
      </code>
      <code>
        <pre>// 发布npm</pre>
        <pre>npm login</pre>
        <pre>npm publish</pre>
      </code>
      <code>
        <pre>// 查看npm下载路径</pre>
        <pre>npm config get registry</pre>
      </code>
      <code>
        <pre>// 切换成淘宝镜像</pre>
        <pre>npm config set registry=https://registry.npm.taobao.org</pre>
      </code>
      <code>
        <pre>// 查看已安装包信息</pre>
        <pre>npm list \ npm ls</pre>
      </code>
      <code>
        <pre>// 查看注册表中某个包的信息 \ 查看本地依赖包信息</pre>
        <pre>npm view pagename \ npm list pagename</pre>
      </code>
      <code>
        <pre>// npm创建vite项目</pre>
        <pre>npm init @vitejs/app</pre>
      </code>
    </div>
  </template>

<script setup>

</script>

<style lang="less" scoped>
.masonry {
	display: flex;
	flex-wrap: wrap;
	gap:0 10px; /* 设置间距 */
}
code {
	flex: 1 1 auto;
    margin: 0;
	margin-bottom: 10px;
}
</style>