<template>
    <CodeEditor code="function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

// 顺序加载
loadScript('a.js')
  .then(() => loadScript('b.js'))
  .then(() => {
    console.log('全部加载完成')
  })
  .catch(err => {
    console.error('加载失败', err)
  })"></CodeEditor>
</template>

<script setup>
</script>
<style scoped lang='less'>
</style>