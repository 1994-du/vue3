<template>
  <div class="theme_icon">
    <Sunny v-if="currentTheme === 'dark'" @click="toggleTheme" />
    <Moon v-else @click="toggleTheme" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { persistenceHtmlTheme } from '@/utils/saveHtmlTheme.js'
const currentTheme = ref()
onMounted(() => {
  currentTheme.value = document.documentElement.getAttribute('data-theme') || 'light'
})
function toggleTheme() {
  const theme = currentTheme.value === 'light' ? 'dark' : 'light'
  persistenceHtmlTheme(theme)
  currentTheme.value = theme
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