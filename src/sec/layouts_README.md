# src/layouts 说明

目录作用

- 存放页面级布局组件（例如主布局、带侧边栏的管理后台布局、认证页的最小布局等）。

期望文件（建议）

- `src/layouts/MainLayout.vue`：站点主布局（头部 + 主内容 + 底部）
- `src/layouts/AuthLayout.vue`：认证相关页面（登录/注册）使用的简洁布局
- `src/layouts/AdminLayout.vue`：管理员后台的侧边栏布局

当前仓库状况（可能差异）

- 仓库中存在 `src/views/Layout.vue`（可能作为全局 Layout 使用），但 `src/layouts` 目录内没有明确的 `MainLayout.vue`、`AuthLayout.vue` 等文件。在这种情况下，可以：
  - 继续使用 `src/views/Layout.vue`；或
  - 创建 `src/layouts/` 并迁移/新增更语义化的布局组件。

如何使用 / 修改指引

- 若要修改登录页整体结构（例如移除头部、使用不同背景），建议将登录页放入 `AuthLayout.vue`，这样可以在路由层通过 meta 或 layout 字段控制哪种布局被使用。
- 修改布局时注意 slots 的设计，确保子页面能正确渲染插槽内容。

常见操作与注意事项

1. 为不同类型页面（公共/用户/管理员）准备单独布局，便于在路由守卫或页面 meta 中切换。
2. 布局组件通常包含顶部导航、侧边栏、页脚，避免在每个页面重复这些结构。
