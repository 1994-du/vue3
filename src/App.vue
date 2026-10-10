<template>
    <el-config-provider :locale="epLocale">
        <RouterView></RouterView>
    </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import enUs from 'element-plus/es/locale/lang/en'

// Element Plus 内置组件（分页、日期选择、弹窗按钮等）的语言跟随当前 locale
const EP_LOCALES = { 'zh-CN': zhCn, 'en-US': enUs } as const
const { locale } = useI18n()
const epLocale = computed(() => EP_LOCALES[locale.value as keyof typeof EP_LOCALES] ?? zhCn)
</script>

<style lang="scss"></style>
