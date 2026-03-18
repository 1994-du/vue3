export function saveHtmlTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}
// 持久化html主题
export function persistenceHtmlTheme(arg) {
    document.documentElement.setAttribute('data-theme', arg);
    localStorage.setItem('theme', arg);
}