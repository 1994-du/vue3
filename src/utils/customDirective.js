function loop(el) {
    if (el.tagName === 'INPUT') {
        el.focus()
        return el
    } else {
        loop(el.children[0])
    }
}
const customDirective = (app) => {
    app.directive('focus', {
        // 指令第一次绑定到元素时调用（初始化时）
        // 注意：只调用一次，而不是每次组件更新时调用。
        created(el, binding, vnode, prevVnode) {
            // el: 指令绑定的DOM元素
            // binding: 包含以下属性的对象：
            //   value: 指令的绑定值
            //   oldValue: 之前的值（仅在update和componentUpdated中可用）
            //   arg: 传给指令的参数（如v-focus:foo中的foo）
            //   modifiers: 包含修饰符的对象（如v-focus.sync中的{sync: true}）
            // vnode: 当前虚拟节点
            // prevVnode: 上一个虚拟节点（仅在update和componentUpdated中可用）
        },
        
        // 元素插入父DOM前调用
        beforeMount(el, binding, vnode, prevVnode) {},
        
        // 元素插入父DOM时调用（常用）
        mounted(el, binding) {
            loop(el)
        },
        
        // 父组件更新前调用
        beforeUpdate(el, binding, vnode, prevVnode) {},
        
        // 父组件和子组件都更新后调用
        updated(el, binding, vnode, prevVnode) {},
        
        // 父组件卸载前调用
        beforeUnmount(el, binding, vnode, prevVnode) {},
        
        // 指令与元素解绑时调用（常用）
        unmounted(el, binding, vnode, prevVnode) {}
    })
}

export default customDirective