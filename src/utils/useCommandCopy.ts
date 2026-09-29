import { ref } from 'vue'

/**
 * 命令速查类页面共用的「复制一条命令」小工具。
 *
 * 优先用异步的 Clipboard API；在 http 页面或旧浏览器上它不可用，
 * 退回到 textarea + execCommand 的老办法。
 * 复制成功后 copied 会短暂变成被点中的那条 key，用来在按钮上显示反馈。
 */
export function useCommandCopy(resetDelay = 1200) {
    const copied = ref('')
    let timer: number | null = null

    async function copy(key: string, text: string): Promise<void> {
        let ok = false

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
                ok = true
            }
        } catch {
            ok = false
        }

        if (!ok) {
            const ta = document.createElement('textarea')
            ta.value = text
            ta.setAttribute('readonly', '')
            ta.style.position = 'fixed'
            ta.style.top = '-1000px'
            ta.style.opacity = '0'
            document.body.appendChild(ta)
            ta.select()
            try {
                ok = document.execCommand('copy')
            } catch {
                ok = false
            }
            document.body.removeChild(ta)
        }

        if (!ok) return

        copied.value = key
        if (timer !== null) clearTimeout(timer)
        timer = window.setTimeout(() => {
            copied.value = ''
            timer = null
        }, resetDelay)
    }

    return { copied, copy }
}
