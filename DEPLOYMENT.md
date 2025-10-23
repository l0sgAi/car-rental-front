# GitHub Pages 部署指南

## 项目配置说明

本项目已配置好所有必需的 GitHub Pages 部署文件，可以通过 GitHub Actions 自动部署。

### 已完成的配置

1. **vite.config.js** - 已设置正确的 base 路径: `/car-rental-front/`
2. **.env.production** - 生产环境配置，指向后端 API 地址: `http://p383f6cc.natappfree.cc`
3. **GitHub Actions 工作流** - `.github/workflows/deploy.yml` 自动部署配置
4. **.nojekyll** - 放置在 public 目录，防止 GitHub Pages 使用 Jekyll 处理
5. **package.json** - 添加了部署脚本

### 部署步骤

#### 方法 1: 使用 GitHub Actions 自动部署（推荐）

1. **启用 GitHub Pages**

   - 打开 GitHub 仓库：https://github.com/l0sgAi/car-rental-front
   - 进入 `Settings` -> `Pages`
   - 在 `Source` 下拉菜单中选择 `GitHub Actions`

2. **推送代码到 main 分支**

   ```bash
   git add .
   git commit -m "配置GitHub Pages部署"
   git push origin main
   ```

3. **查看部署状态**
   - 进入仓库的 `Actions` 标签页
   - 查看工作流运行状态
   - 部署成功后，网站将在以下地址访问：
     **https://l0sgai.github.io/car-rental-front/**

#### 方法 2: 手动部署（备用）

如果需要手动部署，运行以下命令：

```bash
# 构建生产版本
npm run build

# 部署到GitHub Pages
npm run deploy
```

注意：手动部署需要先安装 `gh-pages` 包：

```bash
npm install -D gh-pages
```

### 环境变量配置

项目使用以下环境变量：

- **开发环境** (`npm run dev`)

  - 使用 vite.config.js 中的代理配置
  - API 请求通过 `/api` 代理到 `http://127.0.0.1:8575`

- **生产环境** (`npm run build`)
  - 使用 `.env.production` 中的配置
  - API 请求直接发送到: `http://p383f6cc.natappfree.cc`

### 配置文件说明

#### .github/workflows/deploy.yml

自动化部署工作流，在代码推送到 main 分支时自动触发：

- 使用 Node.js 20 构建项目
- 上传构建产物到 GitHub Pages
- 自动部署

#### .env.production

生产环境变量配置：

```
VITE_API_BASE_URL=http://p383f6cc.natappfree.cc
```

#### vite.config.js

Vite 配置文件，关键配置：

- `base: '/car-rental-front/'` - 设置应用的基础 URL 路径
- 代码分割优化，将 Vue、Vue Router 和 Naive UI 分别打包

#### src/utils/request.js

HTTP 请求工具，会自动使用 `VITE_API_BASE_URL` 环境变量

### 部署后访问

部署成功后，访问地址：

- **生产环境**: https://l0sgai.github.io/car-rental-front/
- **后端 API**: http://p383f6cc.natappfree.cc

### 注意事项

1. **CORS 配置**: 确保后端 API 允许来自 GitHub Pages 域名的跨域请求
2. **HTTPS**: GitHub Pages 使用 HTTPS，但后端 API 使用 HTTP，可能会有混合内容警告
3. **路由模式**: 使用 HTML5 History 模式，GitHub Pages 需要特殊处理 404，已通过 Actions 配置处理
4. **环境变量**: 生产环境的 API 地址已配置在 `.env.production` 中

### 故障排除

如果部署失败，检查以下几点：

1. **GitHub Pages 是否启用**

   - 在仓库 Settings -> Pages 中确认 Source 设置为 GitHub Actions

2. **权限问题**

   - 确保 GitHub Actions 有写入 Pages 的权限
   - 在 Settings -> Actions -> General -> Workflow permissions 中选择 "Read and write permissions"

3. **构建错误**

   - 查看 Actions 标签页中的工作流日志
   - 确保所有依赖都在 package.json 中正确声明

4. **API 连接问题**
   - 检查浏览器控制台是否有 CORS 错误
   - 确认后端 API 地址 `http://p383f6cc.natappfree.cc` 可正常访问
   - 后端需要配置允许来自 `https://l0sgai.github.io` 的跨域请求

### 更新 API 地址

如果需要更新后端 API 地址，修改 `.env.production` 文件：

```env
VITE_API_BASE_URL=新的API地址
```

然后重新推送代码，GitHub Actions 会自动重新部署。

### 本地预览生产构建

在部署前可以本地预览生产版本：

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

注意：本地预览时可能无法正确访问生产 API，因为环境变量的差异。

## 完成！

现在你的 Vue 项目已经准备好部署到 GitHub Pages 了。只需要在 GitHub 仓库设置中启用 GitHub Pages，然后推送代码即可。
