# Vue3 Knowledge Workspace

基于 Vue 3、Vite、TypeScript、Pinia 和 Vue Router 的前端知识工作台。

## 开发环境

- Node.js 20+
- npm 10+
- 使用 `package-lock.json` 作为依赖锁定文件

安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

默认地址为 `http://localhost:3002`。

## 常用命令

```bash
npm run dev        # 启动开发服务器
npm run typecheck  # 检查 TypeScript 和 Vue SFC
npm run audit:prod # 检查生产依赖的 high/critical 风险
npm run build      # 生产构建
npm run preview    # 预览生产构建
```

`buildv` 目前是 `build` 的兼容别名。项目暂未配置单元测试和 lint 命令，新增功能应至少通过 `typecheck` 与 `build`。

## 环境变量

在项目根目录创建 `.env.local`：

```env
VITE_PROXY=http://localhost:8080
VITE_PROJECT_URL=/
```

- `VITE_PROXY`：开发环境 `/api` 代理目标。
- `VITE_PROJECT_URL`：应用部署基础路径，同时用于 Vue Router history。

生产环境需要由网关或部署平台提供同等的 `/api` 前缀和后端地址配置。

## 认证与权限

认证相关代码分为两层：

- [src/utils/authStorage.ts](src/utils/authStorage.ts)：只负责 token 存储、JWT 过期时间读取和认证状态判断。
- [src/utils/tokenManager.ts](src/utils/tokenManager.ts)：负责过期定时器、清理 Pinia 状态、移除动态路由和跳转登录页。

后端菜单中的 `component` 字段必须对应 `src/views` 下的 Vue 文件，例如：

```json
{
  "path": "http/cache",
  "name": "缓存",
  "component": "Http/cacheDetail"
}
```

动态路由只会注册存在且格式有效的组件。组件缺失时会输出路由诊断日志，不会把不可访问页面作为默认入口。

## API 约定

API 请求统一从 [src/api/index.ts](src/api/index.ts) 发出，默认前缀为 `/api`。

- `needAuth` 默认启用，公开接口显式设置为 `false`。
- `operationType: 'operate'` 默认显示成功消息，查询接口使用 `query`。
- `showLoading: true` 才显示全局 Loading，查询请求不会默认阻塞页面。
- 业务响应使用 `ApiResponse<T>`，请求扩展配置定义在 [src/api/types.ts](src/api/types.ts)。

上传接口使用 `FormData`，不要手动把 JSON `Content-Type` 覆盖到文件请求上。

## 旧数据迁移

用户状态持久化键为 `userInfo-store`。旧版本单独保存的 `menus` 键会在首次读取到有效数组后迁移到 Pinia，并删除旧键。

如果 token 无法解析出有效的 `exp`，认证状态会被清理并回到登录页。客户端只用于过期提示，后端仍必须负责真正的 token 校验。

## 构建说明

构建输出目录为 `dist`，构建前会清理旧产物，避免残留 chunk 被部署。大体积依赖通过 Vite `manualChunks` 分组，包括 Element Plus、ECharts、Three.js 和 Monaco Editor。
