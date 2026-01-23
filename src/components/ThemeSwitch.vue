<template>
  <div class="theme_icon">
    <Sunny v-if="currentTheme === 'dark'" @click="toggleTheme" />
    <Moon v-else @click="toggleTheme" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
const currentTheme = ref()
onMounted(() => {
  // document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light')
  currentTheme.value = document.documentElement.getAttribute('data-theme') || 'light'
})
function toggleTheme() {
  const theme = currentTheme.value === 'light' ? 'dark' : 'light'
  const root = document.documentElement
  currentTheme.value = theme
  root.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>
<style scoped lang='less'>
.theme_icon {
  display: flex;
  cursor: pointer;
  user-select: none;
  svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>