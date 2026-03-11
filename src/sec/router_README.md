# src/router 说明

目录作用

- 存放路由定义、路由分模块管理（例如 `modules/public.js`, `user.js`, `merchant.js` 等）以及路由守卫（`guards.js`）。

关键文件清单（基于当前仓库）

- `src/router/index.js`：路由入口，通常负责汇聚模块路由并创建 Router 实例。
- `src/router/guards.js`：全局路由守卫（权限检查、登录跳转等）。目前仓库中 `guards.js` 存在但为空。
- `src/router/modules/public.js`：公共路由（如首页、登录、注册等）。
- `src/router/modules/user.js`、`merchant.js`、`admin.js`、`ai.js`：按角色/功能拆分的路由模块。

如何使用 / 修改指引

- 登录路由通常位于 `public.js` 或 `index.js` 中（如 `/login` 路由）。修改登录 UI 通常不需要修改路由，但若要更改 URL（如 `/auth/login`）或布局，需要在路由中更新对应的 path 或 meta（例如 `meta: { layout: 'AuthLayout' }`）。
- 路由守卫（`guards.js`）用于统一处理鉴权逻辑：登录后重定向、未登录访问受限页面的跳转等。

与登录 UI 相关的要点

- 如果你添加了 `AuthLayout.vue`，在对应的登录路由中设置 meta 或 layout 字段，以便路由渲染时使用新的布局。
- 若登录流程需要重定向到登录前页面，请在登录成功后调用 `router.replace(...)` 或 `router.push(...)` 并处理 `redirect` 查询参数。

常见操作与注意事项

1. 新增路由模块时在 `index.js` 中按需引入并合并。
2. 路由懒加载可以降低首页首屏包体积，建议对大型页面使用动态 import。
