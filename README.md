<p align="center">
  <img src="./public/logo.svg" alt="Moyune" width="120" height="120" />
</p>

<h1 align="center">墨韵 Moyune</h1>

<p align="center">一个优雅的第三方开源阅读 Web 应用，畅享静读时光。</p>

<p align="center">
  <img src="./docs/screenshots/home.png" alt="书架" width="45%" />
  &nbsp;&nbsp;
  <img src="./docs/screenshots/reader.png" alt="阅读器" width="45%" />
</p>

---

## 功能特性

- **📚 书架管理** — 展示、浏览所有书籍，支持封面、作者、最新章节等信息的快速预览
- **📖 双页阅读器** — 仿书本翻页布局，基于 `ResizeObserver` 自适应分页，窗口缩放自动重排
- **🎨 阅读个性化** — 字体大小、字重、字体族、行间距、段落间距、首行缩进、文字间距等全部可调
- **🌓 暗色 / 亮色主题** — 双阶段初始化防闪烁（FOUC），跟随系统或手动切换
- **🔗 自定义服务器** — 支持连接自建后端（如 [Legado](https://github.com/gedoor/legado) Web 服务），生产环境可通过设置页配置地址与端口
- **⌨️ 键盘快捷键** — 阅读器内支持键盘翻页、切换章节等操作
- **💾 阅读进度保存** — 防抖自动保存（1s），离开页面时也会主动保存

## 技术栈

| 类别     | 选型                                          |
| -------- | --------------------------------------------- |
| 框架     | Vue 3.5（Composition API + `<script setup>`） |
| 路由     | Vue Router 5（路由懒加载）                    |
| 样式     | Tailwind CSS 4（`@tailwindcss/vite` 插件）    |
| 图标     | Lucide Vue                                    |
| HTTP     | ky                                            |
| 语言     | TypeScript 6                                  |
| 构建     | Vite 8                                        |
| 代码质量 | oxlint + oxfmt                                |

## 快速开始

**环境要求：** Node.js ≥ 18，[pnpm](https://pnpm.io/installation) ≥ 8

```bash
# 克隆仓库
git clone https://github.com/your-username/moyune.git
cd moyune

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env        # 编辑 .env，填入你的后端地址
cp .env.example .env.development

# 启动开发服务器
pnpm dev
```

### 环境变量

```env
# .env / .env.development
VITE_BASE_URL=http://192.168.31.217    # 后端 API 地址
VITE_PORT=1122                         # 后端端口
```

生产构建（`.env.production`）中 `VITE_BASE_URL` 留空，用户可在应用内「设置 → 服务器配置」页面自行填写。

## 项目结构

```
src/
├── main.ts                        # 应用入口
├── App.vue                        # 根布局：侧边栏 + RouterView
├── style.css                      # Tailwind + CSS 自定义属性
├── router/index.ts                # 路由定义（3 条懒加载路由）
├── utils/api.ts                   # ky 实例（10s 超时）
├── api/
│   ├── books.ts                   # 书架 API + 三级缓存
│   └── reader.ts                  # 章节列表 / 内容 / 进度保存
├── composables/
│   ├── useAppConfig.ts            # 服务器地址配置（localStorage 持久化）
│   ├── useReaderConfig.ts         # 阅读排版设置
│   ├── useReaderChapter.ts        # 章节加载
│   ├── useReaderPagination.ts     # 分页计算
│   ├── useReaderSave.ts           # 进度保存
│   └── useReaderHotkeys.ts        # 键盘快捷键
├── components/
│   ├── sidebar/                   # 侧边栏组件
│   ├── book/                      # 书籍卡片组件
│   └── reader/                    # 阅读器组件
└── view/
    ├── Home.vue                   # 书架页
    ├── Reader.vue                 # 阅读器页
    └── Settings.vue               # 设置页
```

## 常用命令

```bash
pnpm dev        # 启动开发服务器（HMR）
pnpm build      # 类型检查 + 生产构建
pnpm preview    # 本地预览生产构建
pnpm lint       # oxlint 代码检查
pnpm format     # oxfmt 代码格式化
pnpm check      # lint + format
```

## 路线图

- [ ] 支持更多阅读布局（滚动、单页）
- [ ] 阅读统计
- [ ] 国际化（i18n）

## 致谢

- [Legado_web_bookshelf](https://github.com/gedoor/legado_web_bookshelf) — 本项目的主要参考
- [Lucide](https://lucide.dev/) — 精美开源图标库
- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的 CSS 框架

## 许可

[MIT](./LICENSE)
