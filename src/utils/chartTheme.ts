/**
 * 图表取色：ECharts 画在 canvas 里，CSS 变量不会自动生效。
 * 挂载时用 getComputedStyle 把设计令牌读成具体色值，切主题时由调用方重设 option。
 *
 * 用法：
 *   const t = readChartTheme()
 *   chart.setOption(buildOption(t))
 *   watchTheme(() => chart.setOption(buildOption(readChartTheme()), { notMerge: true }))
 */

export interface ChartTheme {
    brand: string
    success: string
    danger: string
    info: string
    text: string
    secondary: string
    tertiary: string
    hairline: string
    hairlineStrong: string
    surface: string
    font: string
}

function read(name: string, fallback: string): string {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return v || fallback
}

export function readChartTheme(): ChartTheme {
    return {
        brand: read('--brand', '#FFA02F'),
        success: read('--success', '#00B96B'),
        danger: read('--danger', '#F23645'),
        info: read('--info', '#5CB8D8'),
        text: read('--text-primary', '#E8ECF4'),
        secondary: read('--text-secondary', 'rgba(232, 236, 244, 0.72)'),
        tertiary: read('--text-tertiary', '#5E6680'),
        hairline: read('--hairline', '#2A3050'),
        hairlineStrong: read('--hairline-strong', '#3A4268'),
        surface: read('--surface-raised', '#161D33'),
        font: read('--font-mono', 'ui-monospace, monospace'),
    }
}

/** #RRGGBB / #RGB → rgba(r,g,b,a)，用于渐变第二站、半透明刻线。非 hex 原样返回。 */
export function withAlpha(color: string, alpha: number): string {
    const hex = color.trim()
    if (!hex.startsWith('#')) return hex
    const full = hex.length === 4
        ? hex.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3')
        : hex
    const n = parseInt(full.slice(1), 16)
    if (Number.isNaN(n)) return hex
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 监听 <html data-theme> 变化。返回 disconnect 函数，在 onBeforeUnmount 里调用。
 */
export function watchTheme(callback: () => void): () => void {
    const observer = new MutationObserver(callback)
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
}
