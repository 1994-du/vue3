<template>
    <h4>自定义Ref</h4>
    <span>{{ textVal }}</span>
    <el-input v-model="iptVal" @input="changeIpt"></el-input>
    <code>
        <pre>import { customRef } from 'vue'
export function useDebouncedRef(value,delay = 200) {
  let timer = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            value = newValue
            trigger() // 触发更新
        }, delay)
      }
    }
  })
}</pre>
    </code>
</template>
<script setup>
import { useDebouncedRef } from '@/utils/useCustomRef'
import { ref } from 'vue';
let iptVal = ref('')
let textVal = useDebouncedRef('',2000)
console.log('textVal',textVal);
const changeIpt = () => {
    textVal.value = iptVal.value
}
</script>
<style scoped lang="scss">

</style>