export function saveHtmlTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme)
}

// 持久化html主题
export function persistenceHtmlTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
}
