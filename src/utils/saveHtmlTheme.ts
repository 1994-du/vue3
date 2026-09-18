const THEME_COLOR: Record<string, string> = {
    dark: '#0a0b1a',
    light: '#f1f2fb'
}

// 同步 <meta name="theme-color">，让移动端浏览器地址栏跟随主题
function syncMetaTheme(theme: string): void {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
        meta.setAttribute('content', THEME_COLOR[theme] || THEME_COLOR.dark)
    }
}

export function saveHtmlTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme)
    syncMetaTheme(theme)
}

// 持久化html主题
export function persistenceHtmlTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    syncMetaTheme(theme)
}
