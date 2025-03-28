<template>
    <el-switch
        v-model="value1"
        :active-action-icon="Sunny"
        :inactive-action-icon="Moon"
        @change="toggleTheme"
    />
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
const value1 = ref(true)
onMounted(() => {
  const currentTheme = localStorage.getItem('theme') || 'light'
  value1.value = currentTheme === 'light'
  document.documentElement.setAttribute('data-theme', currentTheme)
})

const toggleTheme = () => {
  const theme = value1.value ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>
<style scoped lang='less'>
</style>