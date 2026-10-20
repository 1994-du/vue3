import { defineAsyncComponent, type App, type Component } from 'vue'

const registryComponents = (app: App): void => {
    // 懒加载：每个组件独立成 chunk，仅在首次渲染时才下载，
    // 避免把 CodeEditor(monaco-editor) 等重型组件拉进首屏。
    const modules = import.meta.glob<{ default: Component }>('./**/*.vue')

    Object.entries(modules).forEach(([path, loader]) => {
        // 移除开头 ./ 和 .vue 后缀
        const cleanPath = path.replace('./', '').replace('.vue', '')

        const parts = cleanPath.split('/')

        let name = ''

        if (parts[parts.length - 1] === 'index') {
            // index.vue → 使用所在文件夹名称
            name = parts[parts.length - 2]
        } else {
            // 普通组件 → 使用文件名
            name = parts[parts.length - 1]
        }

        // 注册为异步组件，按需加载对应 chunk
        app.component(name, defineAsyncComponent(loader as () => Promise<{ default: Component }>))
    })
}

export default registryComponents
