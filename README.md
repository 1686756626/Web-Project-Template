# Web-Project-Template

> 所有项目的通用经验知识库 + 通用模板代码。智能体做新项目或遇到问题时，先来这里查。

## 里面有什么

### 经验文档（`经验/`）

```
经验/
├── 前端/          SPA路由、Tailwind深色模式、打印样式、移动端适配
├── 部署/          Nginx静态站点、GitHub API反代、缓存破坏
├── GitHub/        中文文件推送会变空（红线）、中文路径raw返回HTML
├── 架构/          SPA标准结构、localStorage存储、聊天面板组件
├── 教学/          先练后讲、时间管理、出题流程、课后同步
└── 数据/          students.json课表格式
```

每篇格式：**来源项目 → 规则 → 具体做法**。照着做就行。

### 通用模板代码

可直接复制到新项目的基础组件：

| 文件 | 用途 |
|------|------|
| `app.js` | SPA 主应用（路由 + 数据加载） |
| `config.js` | 站点配置（主题、页面列表、AI 聊天参数） |
| `utils.js` | 工具函数（Markdown 渲染、HTML 转义） |
| `index.html` | 入口（CSS + HTML 外壳 + 聊天面板样式） |
| `pages/home.js` | 首页模板 |
| `pages/chat.js` | AI 聊天面板（浮动按钮 + SSE 流式 + 会话管理） |
| `chat-server/` | 聊天消息持久化服务（Node.js + SQLite） |

## 经验来源

| 项目 | 仓库 | 贡献了什么经验 |
|------|------|----------------|
| Teaching-Dashboard | 教学系统前端 | SPA路由、GitHub API、打印、深色模式、缓存 |
| Finance-Manager | 个人财务系统 | localStorage、登录验证、聊天面板、收入分流 |
| Andy-Shihundan | 搞笑网站 | 轻量SPA、JSON数据源、暗黑风格 |
| CXL | 高考冲刺教学 | 多科目教学、cron定时任务、时间管理、教学规范 |
