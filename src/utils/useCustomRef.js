import { customRef } from 'vue'
export function useDebouncedRef(value,delay = 200) {
  let timer = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            value = newValue
            trigger() // 触发更新
        }, delay)
      }
    }
  })
}