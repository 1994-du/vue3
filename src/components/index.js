const registryComponents = (app) => {
    // 1. 深度扫描所有 vue 文件
    const modules = import.meta.glob('./**/*.vue', { eager: true });

    Object.entries(modules).forEach(([path, module]) => {
        // 移除开头 ./ 和 .vue 后缀
        const cleanPath = path.replace('./', '').replace('.vue', '');

        const parts = cleanPath.split('/');

        let name = '';

        if (parts[parts.length - 1] === 'index') {
            // index.vue → 使用所在文件夹名称
            name = parts[parts.length - 2];
        } else {
            // 普通组件 → 使用文件名
            name = parts[parts.length - 1];
        }

        // 注册组件
        app.component(name, module.default);
    });
};

export default registryComponents;