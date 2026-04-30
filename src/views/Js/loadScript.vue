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
  <CodeEditor class="my-[10px]" code="async function init() {
  await loadScript('a.js')
  await loadScript('b.js')
  console.log('顺序加载完成')
}

init()"></CodeEditor>
</template>

<script setup>
const loadScript =(src)=> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}
</script>
<style scoped lang='less'>
</style>