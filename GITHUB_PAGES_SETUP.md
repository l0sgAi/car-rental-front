# GitHub Pages 部署配置说明

## 问题背景

Vue SPA（单页应用）使用 HTML5 History 模式时，在 GitHub Pages 上部署会遇到路由问题：

- 当用户直接访问非根路径（如 `/car-rental-front/my-orders`）或刷新页面时
- GitHub Pages 找不到对应的 HTML 文件
- 返回 GitHub Pages 默认的 404 页面
- Vue Router 的 404 捕获路由无法被触发
- 用户看不到项目的 `NotFound.vue` 组件

## 解决方案

### 1. 创建 404.html（已配置 ✅）

GitHub Pages 会在找不到页面时自动返回 `404.html`。我们通过以下方式确保每次构建都会创建它：

**vite.config.js** 中添加了自定义插件：

```javascript
{
  name: 'generate-404',
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html')
  }
}
```

这样，当 GitHub Pages 返回 404 时：

1. 加载 `404.html`（实际上是 `index.html` 的副本）
2. Vue 应用启动
3. Vue Router 接管路由
4. 匹配到 `/:pathMatch(.*)*` 路由
5. 显示 `NotFound.vue` 组件

### 2. .nojekyll 文件（已存在 ✅）

`dist/.nojekyll` 文件告诉 GitHub Pages 不要使用 Jekyll 处理：

- 防止忽略以 `_` 开头的文件（如 Vite 生成的资源文件）
- 确保所有资源文件都能正确访问

### 3. base 路径配置（已配置 ✅）

`vite.config.js` 中的 `base: '/car-rental-front/'` 确保：

- 所有资源路径正确指向 GitHub Pages 的子路径
- 路由系统正确处理基础路径

## 工作流程

### 正常路由访问

```
用户访问 https://xxx.github.io/car-rental-front/my-orders
  ↓
GitHub Pages 找不到 /my-orders 文件
  ↓
返回 404.html（等同于 index.html）
  ↓
Vue 应用加载
  ↓
Vue Router 尝试匹配 /my-orders 路由
  ↓
找到对应路由 → 显示正确页面
```

### 404 路由访问

```
用户访问 https://xxx.github.io/car-rental-front/invalid-page
  ↓
GitHub Pages 找不到文件
  ↓
返回 404.html
  ↓
Vue 应用加载
  ↓
Vue Router 尝试匹配 /invalid-page
  ↓
没有匹配的路由
  ↓
触发 /:pathMatch(.*)* 捕获路由
  ↓
显示 NotFound.vue 组件 ✓
```

## 部署步骤

1. **构建项目**

   ```bash
   npm run build
   ```

   会自动生成 `dist/404.html`

2. **部署到 GitHub Pages**

   ```bash
   npm run deploy
   ```

   或手动推送 dist 目录到 gh-pages 分支

3. **验证**
   - 访问首页：`https://xxx.github.io/car-rental-front/`
   - 刷新任意页面（如订单页）
   - 访问不存在的路径（应显示 NotFound.vue）

## 注意事项

### ✅ 已解决的问题

- ✅ 404.html 自动生成
- ✅ .nojekyll 文件存在
- ✅ base 路径配置正确
- ✅ Vue Router 有 404 捕获路由

### ⚠️ 需要注意

1. **每次构建后检查**：确保 `dist/404.html` 存在
2. **路由守卫**：NotFound.vue 不需要认证，已正确配置（没有 `meta: { requiresAuth: true }`）
3. **浏览器刷新**：现在所有路由刷新都会正常工作
4. **直接访问**：用户可以直接访问或收藏任何路由 URL

### 🔧 如果还有问题

如果部署后仍然看到 GitHub Pages 默认 404：

1. **检查 dist/404.html 是否存在**

   ```bash
   ls dist/404.html
   ```

2. **检查 404.html 内容是否与 index.html 一致**

   ```bash
   diff dist/index.html dist/404.html
   ```

3. **清除缓存**：清除浏览器缓存或使用无痕模式测试

4. **GitHub Pages 设置**：确保在仓库 Settings → Pages 中正确配置了部署分支

## 总结

✅ **现在你的项目已经完全配置好了！**

- 所有路由刷新都能正常工作
- 不存在的路径会显示你的 NotFound.vue 组件
- 不需要切换到 Hash 模式（保持 History 模式的优雅 URL）
- 每次构建都会自动创建 404.html
