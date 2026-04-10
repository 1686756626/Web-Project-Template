# 通用经验知识库 — AI Agent 交接手册

> 本仓库是所有项目的经验 + 模板代码集中存放地。
> 智能体做新项目或遇到问题时，先来这里查。

## 两个用途

### 1. 查经验（`经验/` 目录）

按分类找对应经验，每篇格式：**来源项目 → 规则 → 具体做法 → 注意事项**。

| 目录 | 内容 |
|------|------|
| `前端/` | SPA路由、Tailwind深色模式、打印样式、移动端适配 |
| `部署/` | Nginx静态站点、GitHub API反代、缓存破坏 |
| `GitHub/` | 中文文件推送变空（🔴红线）、中文路径raw返回HTML |
| `架构/` | SPA标准结构、localStorage存储、聊天面板组件 |
| `教学/` | 先练后讲、时间管理、出题流程、课后同步 |
| `数据/` | students.json课表格式 |

### 2. 复用模板代码（根目录）

新项目可以直接复制 `app.js` + `config.js` + `utils.js` + `index.html` + `pages/` + `chat-server/` 作为起点。

### 添加新页面模板

1. 创建 `pages/xxx.js`，用 `Object.assign(app, { renderXxx(el) { ... } })` 挂载
2. 在 `config.js` 的 `pages` 数组中添加页面配置
3. 在 `index.html` 底部加 `<script src="pages/xxx.js"></script>`
4. 在 `app.js` 的 route switch 中加 case

详见 `经验/前端/SPA-路由与页面组织.md`。

## 贡献新经验

1. 确认经验不属于单一项目，而是跨项目通用的
2. 在 `经验/` 对应子目录下新建 md
3. 格式：**来源项目 → 规则 → 具体做法 → 注意事项**
4. commit 时注明来自哪个项目
