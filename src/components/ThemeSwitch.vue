<template>
    <el-tooltip :content="currentTheme === 'dark' ? '切换浅色模式' : '切换深色模式'" placement="bottom">
        <button
            type="button"
            class="theme-switch"
            :aria-label="currentTheme === 'dark' ? '切换浅色模式' : '切换深色模式'"
            @click="toggleTheme">
            <el-icon>
                <Sunny v-if="currentTheme === 'dark'" />
                <Moon v-else />
            </el-icon>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { persistenceHtmlTheme } from '@/utils/saveHtmlTheme'

const currentTheme = ref('light')

onMounted(() => {
    currentTheme.value = document.documentElement.getAttribute('data-theme') || 'light'
})

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    persistenceHtmlTheme(currentTheme.value)
}
</script>

<style scoped lang="scss">
.theme-switch {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
}

.theme-switch:hover {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, var(--surface));
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border-color));
}
</style>
