import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __dirname = dirname(fileURLToPath(import.meta.url));

// 视图文件夹路径
const viewsDir = join(__dirname, '../src/views');

// 生成路由配置
function generateRoutes(dir, parentPath = '', groupName = '') {
    const routes = [];
    const files = readdirSync(dir);

    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            // 如果是目录，递归生成子路由
            const childGroupName = basename(filePath);
            const childRoutes = generateRoutes(filePath, join(parentPath, file), childGroupName);
            routes.push(...childRoutes);
        } else if (file.endsWith('.vue')) {
            // 如果是Vue文件，生成路由
            const routePath = join(parentPath, file.replace('.vue', '')).replace(/\\/g, '/');
            const routeName = file.replace('.vue', '');
            const componentName = file.replace('.vue', '');

            routes.push({
                path: routePath,
                name: routeName,
                meta: {
                    groupName: basename(dir) // 使用当前目录名称作为 groupName
                },
                component: `() => import('@/views/${routePath}.vue')`
            });
        }
    });

    return routes;
}

// 生成路由配置并写入文件
const routes = generateRoutes(viewsDir);
const routesContent = `export default [
    ${routes.map(route => `{
        path: '${route.path}',
        name: '${route.name}',
        meta: ${JSON.stringify(route.meta)},
        component: ${route.component}
    }`).join(',\n    ')}
]`;

writeFileSync(join(__dirname, '../src/router/newRoutes.js'), routesContent);