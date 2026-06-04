import type { Directive, App, DirectiveHook } from 'vue'

function loop(el: Element): HTMLInputElement | undefined {
    if (el.tagName === 'INPUT') {
        ;(el as HTMLInputElement).focus()
        return el as HTMLInputElement
    } else {
        return loop(el.children[0])
    }
}

const customDirective = (app: App): void => {
    app.directive('focus', {
        // 指令第一次绑定到元素时调用（初始化时）
        created(el: HTMLElement): void {
            // el: 指令绑定的DOM元素
        },

        // 元素插入父DOM前调用
        beforeMount(el: HTMLElement, binding: any): void {},

        // 元素插入父DOM时调用（常用）
        mounted(el: HTMLElement, binding: any): void {
            loop(el)
        },

        // 父组件更新前调用
        beforeUpdate(el: HTMLElement, binding: any): void {},

        // 父组件和子组件都更新后调用
        updated(el: HTMLElement, binding: any): void {},

        // 父组件卸载前调用
        beforeUnmount(el: HTMLElement, binding: any): void {},

        // 指令与元素解绑时调用（常用）
        unmounted(el: HTMLElement, binding: any): void {}
    })
}

export default customDirective
