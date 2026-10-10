<template>
    <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
        <button
            type="button"
            class="lang-switch"
            :aria-label="$t('common.language')"
            :title="$t('common.language')">
            {{ currentShort }}
        </button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in SUPPORT_LOCALES"
                    :key="item.value"
                    :command="item.value">
                    <el-icon v-if="item.value === currentLocale"><Check /></el-icon>
                    <span v-else class="lang-switch_placeholder"></span>
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from '@element-plus/icons-vue'
import { SUPPORT_LOCALES, setLocale, type Locale } from '@/lang'

const { locale } = useI18n({ useScope: 'global' })
const currentLocale = computed(() => locale.value as Locale)
const currentShort = computed(
    () => SUPPORT_LOCALES.find(item => item.value === currentLocale.value)?.short ?? '中'
)

const handleCommand = (command: Locale) => {
    if (command !== currentLocale.value) setLocale(command)
}
</script>

<style scoped lang="scss">
/* 与 ThemeSwitch 保持同一套视觉：方角、hairline 描边，只换文字色 */
.lang-switch {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    display: grid;
    place-items: center;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    transition: color var(--transition-fast), border-color var(--transition-fast),
        background-color var(--transition-fast);
}

.lang-switch:hover {
    color: var(--brand);
    background: var(--surface-muted);
    border-color: var(--brand);
}

.lang-switch:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}

.lang-switch_placeholder {
    width: 14px;
    display: inline-block;
}
</style>
