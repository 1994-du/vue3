import { createI18n } from 'vue-i18n'
import zhCn from './zh-cn'
import enUs from './en-us'

// locale 标识用标准 BCP 47 格式（vue-i18n 的类型校验要求），文件名保持 kebab-case 不变
export type Locale = 'zh-CN' | 'en-US'

export const SUPPORT_LOCALES: { value: Locale; label: string; short: string }[] = [
    { value: 'zh-CN', label: '中文', short: '中' },
    { value: 'en-US', label: 'English', short: 'EN' }
]

const STORAGE_KEY = 'locale'

function getInitialLocale(): Locale {
    const saved = localStorage.getItem(STORAGE_KEY)
    // 兼容历史存储的 kebab-case 旧值（zh-cn / en-us）
    const normalized =
        saved === 'zh-cn' ? 'zh-CN' : saved === 'en-us' ? 'en-US' : (saved as Locale | null)
    if (normalized && SUPPORT_LOCALES.some(item => item.value === normalized)) return normalized
    // 没有本地记录时按浏览器语言初始化
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

const i18n = createI18n({
    // 组合式模式：i18n.global.locale 是 ref，可直接赋值实现响应式切换
    legacy: false,
    // 模板里保留 $t 全局可用
    globalInjection: true,
    locale: getInitialLocale(),
    fallbackLocale: 'zh-CN',
    messages: {
        'zh-CN': zhCn,
        'en-US': enUs
    },
    // 缺 key 时静默回落，避免控制台刷警告
    missingWarn: false,
    fallbackWarn: false
})

/** 切换语言并持久化 */
export function setLocale(locale: Locale): void {
    i18n.global.locale.value = locale
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.setAttribute('lang', locale)
}

document.documentElement.setAttribute('lang', i18n.global.locale.value)

export default i18n
