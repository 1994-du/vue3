import { customRef } from 'vue'

export function useDebouncedRef<T>(value: T, delay: number = 200) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return customRef((track, trigger) => {
        return {
            get() {
                track() // 收集依赖
                return value
            },
            set(newValue: T) {
                if (timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newValue
                    trigger() // 触发更新
                }, delay)
            }
        }
    })
}
