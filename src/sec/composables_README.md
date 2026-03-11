# src/composables 说明

目录作用

- 存放可复用的 Composition API 函数（useXxx.js），用于封装逻辑如分页、加载状态、权限判断等，以便在多个组件中复用。

期望/建议的常见 composables

- `usePagination.js`：封装分页逻辑
- `useLoading.js`：统一处理加载指示器状态
- `usePermission.js`：封装权限判断/路由守卫相关逻辑

当前仓库状况

- `src/composables/` 目录存在，但可能为空或未包含上述示例文件（请按需新增）。

如何使用 / 修改指引

- 将通用逻辑抽离到 composables，而不是放到组件的 methods 中，可提高复用性和可测试性。
- composable 应避免直接依赖具体组件实例，使用参数或返回值进行通信。

与登录 UI 相关的要点

- 登录表单的验证或提交状态（例如 `useLoading`）可以抽成 composable，以便在注册或忘记密码页面复用。
- 权限相关的 hooks（如 `usePermission`）可与登录后获取的角色信息配合使用。
