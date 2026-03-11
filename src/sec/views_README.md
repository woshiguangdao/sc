# src/views 说明

目录作用

- 存放页面级别的 Vue 组件（每个文件对应一个路由页面），例如 `Home.vue`、`Login.vue`、`UserPage.vue` 等。

关键文件清单（基于当前仓库）

- `src/views/Login.vue`：登录页面（当前仓库存在）
- `src/views/RegisterPage.vue` / `src/views/Register.vue` / `src/views/UserRegister.vue`：注册相关页面
- `src/views/Home.vue` / `src/views/Home_logined.vue`：首页（未登录/已登录差异）
- `src/views/Layout.vue`：页面布局文件（被作为顶层容器使用）
- `src/views/MerchantPage.vue`, `UserPage.vue` 等：功能页面

如何使用 / 修改指引

- 修改登录 UI：优先编辑 `src/views/Login.vue`，如果登录表单被拆分为组件，则修改对应组件（见 `src/components`）。
- 如果需要不同布局（如无 header 的登录页），可以：
  1. 新增 `src/layouts/AuthLayout.vue`，
  2. 在 `src/router/modules/public.js` 的登录路由上添加 `meta: { layout: 'AuthLayout' }` 或直接将 `Login.vue` 嵌入该布局。

与登录 UI 相关的要点

- 登录相关的逻辑点：表单校验、调用 `src/api/user.js` 登录接口、写入 `src/stores/userInfo.js`、跳转（router）和处理错误提示。
- 登录页面样式主要从 `src/assets/main.scss` 或页面内的 `<style>` 中加载/覆盖。

常见操作与注意事项

1. 页面级组件尽量保持薄（只处理交互与数据流），将复杂逻辑抽离到 services/composables/stores 中。
2. 对于大型页面使用子组件拆分，便于维护与测试。
