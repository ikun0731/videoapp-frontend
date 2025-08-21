# 渔鱼网 - 视频分享平台前端

一个基于 Vue 3 和 Element Plus 开发的视频分享平台前端项目，支持视频上传、播放、评论、搜索等功能。

## 项目链接

**在线访问地址：** [video.yuyuwang.online](http://video.yuyuwang.online)
**后端仓库地址：** https://github.com/ikun0731/videoapp-backend

## 项目简介

渔鱼网是一个视频分享社区，用户可以上传、观看、点赞和评论视频内容。平台使用"鱼币"作为内部虚拟货币，用户可以通过每日签到获得鱼币，并用来打赏喜欢的视频。

### 主要功能

- 用户注册与登录（邮箱验证）
- 视频上传、观看、编辑和删除
- 视频搜索和排序（最新、最热、最受欢迎）
- 视频点赞和评论
- 用户个人主页
- 通知系统
- 响应式设计，支持移动端和桌面端

## 技术栈

- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Element Plus** - UI组件库
- **Axios** - HTTP请求

## 开发环境准备

### 必要条件

- Node.js 16.0+
- npm 或 yarn

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/ikun0731/videoapp-frontend.git
cd mini-video-site-frontend
```

2. 安装依赖

```bash
npm install
# 或
yarn
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 在浏览器中访问 `http://localhost:5173`

## 项目构建

为生产环境构建项目：

```bash
npm run build
# 或
yarn build
```

预览构建产物：

```bash
npm run preview
# 或
yarn preview
```

## 项目结构

```
mini-video-site-frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/             # API请求
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML模板
├── package.json         # 依赖配置
├── vite.config.js       # Vite配置
└── README.md            # 项目说明
```

## API接口

项目默认连接 `/api` 前缀的后端接口。如需连接到不同的API地址，可以在 `.env` 文件中设置：

```
VITE_APP_BASE_URL=http://your-api-server.com
```

## 部署

1. 构建生产版本

```bash
npm run build
```

2. 将 `dist` 目录下的文件部署到 Web 服务器

## 贡献指南

1. Fork 项目
2. 创建您的特性分支: `git checkout -b my-new-feature`
3. 提交您的改动: `git commit -am '添加新特性'`
4. 推送到分支: `git push origin my-new-feature`
5. 提交 Pull Request

## 许可

[MIT](LICENSE)
