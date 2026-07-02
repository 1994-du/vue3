<template>
    <div class="webworker">Web Worker</div>
    <CodeEditor code="// work.ts
self.onmessage = (data)=>{
    console.log('worker接受的数据',data); 
    console.time('耗时')
    let sum = 0
    for (let i = 0; i < 10_000_000_000; i++) {
        sum += i
    }
    console.timeEnd('耗时')
    self.postMessage('worker返回数据')
}"/>

    <CodeEditor code="// index
const worker = new Worker(
  new URL('./work.ts', import.meta.url),
  {
    type: 'module'
  }
)
worker.postMessage('1111')
worker.onmessage = (e)=>{
    console.log('e',e);
    //终止worker，终止后不能再次使用。需重新创建实例
    worker.terminate()
}


"></CodeEditor>
</template>
<script lang="ts" setup>

const worker = new Worker(
  new URL('./work.ts', import.meta.url),
  {
    type: 'module'
  }
)
console.log('worker',worker);
worker.postMessage('1111')
worker.onmessage = (e)=>{
    console.log('e',e);
    worker.terminate()
}
</script>