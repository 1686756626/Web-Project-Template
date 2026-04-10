# 通用经验知识库 — AI Agent 交接手册

> 本仓库是所有项目的经验 + 可复用组件 + 模板代码集中存放地。
> 智能体做新项目或遇到问题时，先来这里查。

## 三个用途

### 1. 查经验（`经验/` 目录）

按分类找对应经验，每篇格式：**来源项目 → 规则 → 具体做法 → 注意事项**。

| 目录 | 内容 |
|------|------|
| `前端/` | SPA路由、Tailwind深色模式、打印样式、移动端适配 |
| `部署/` | Nginx静态站点、GitHub API反代、缓存破坏、cron定时任务 |
| `GitHub/` | 中文文件推送变空（🔴红线）、中文路径raw返回HTML |
| `架构/` | SPA标准结构、localStorage存储、聊天面板组件 |
| `教学/` | 先练后讲、时间管理、出题流程、课后同步、多科目系统结构 |
| `数据/` | students.json课表格式 |

### 2. 复用组件（`components/` 目录）

直接复制到新项目使用的独立功能模块：

| 组件 | 来源项目 | 一句话说明 |
|------|---------|-----------|
| `store.js` | Finance-Manager | localStorage 读写 |
| `auth.js` | Finance-Manager | 前端密码验证 |
| `github-api.js` | Teaching-Dashboard | GitHub API 客户端（中文路径兼容） |
| `markdown-preview.js` | Teaching-Dashboard | Markdown 预览弹窗 |
| `download-batch.js` | Teaching-Dashboard | ZIP 批量下载 |

### 3. 复用模板代码（根目录）

新项目可以直接复制 `app.js` + `config.js` + `utils.js` + `index.html` + `pages/` + `chat-server/` 作为起点。

## 联动项目

| 项目 | 贡献内容 | 反向引用 |
|------|---------|---------|
| Teaching-Dashboard | 3 个组件 + 8 篇经验 | AGENTS.md §10 |
| Finance-Manager | 2 个组件 + 3 篇经验 | AGENTS.md §9 |
| Andy-Shihundan | 3 篇经验 | AGENTS.md §8 |
| CXL | 6 篇经验 | README.md |

每个项目的 AGENTS.md 都有"通用经验知识库联动"章节指向本仓库。

## 贡献新内容

1. **新经验**：确认跨项目通用 → `经验/` 对应子目录 → 格式：来源→规则→做法→注意
2. **新组件**：从某项目提取可独立使用的代码 → `components/` → 带注释说明来源和用法
3. commit 时注明来自哪个项目
