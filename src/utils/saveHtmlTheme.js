export function saveHtmlTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}
// 持久化html主题
export function persistenceHtmlTheme(arg) {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', arg || theme)
    localStorage.setItem('theme', arg);
}