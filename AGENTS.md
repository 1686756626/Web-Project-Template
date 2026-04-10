# {{SITE_NAME}} — AI Agent 交接手册

> 读完本文件，你能立刻理解并维护这个项目。

---

## 一、项目定位

{{DESCRIPTION}}

**一句话说明：** 浏览器打开网页 → 加载数据 → 渲染页面。

---

## 二、技术架构

```
index.html        → 入口（CSS + HTML 外壳 + JS 引入）
config.js         → 站点配置（主题、页面列表、AI 参数）
utils.js          → 工具函数（Markdown 渲染、HTML 转义等）
app.js            → 主应用对象（路由 + 数据加载）
pages/*.js        → 各页面渲染逻辑（Object.assign 挂到 app 上）
AGENTS.md         → 本文件，Agent 交接手册
```

### 数据流

```
浏览器 → app.init() → loadData() → this.data
       → route() → 根据 hash 渲染页面
```

### 页面路由

由 `config.js` 的 `pages` 数组定义，`app.js` 的 `route()` switch 分发。

---

## 三、GitHub 仓库

| 项目 | 值 |
|------|---|
| 用户 | `1686756626` |
| 仓库名 | `{{REPO_NAME}}` |
| 分支 | `main` |
| 可见性 | 公开 |

---

## 四、服务器部署

| 项目 | 值 |
|------|---|
| IP | `131.143.251.21` |
| Web 根目录 | `/var/www/{{DEPLOY_DIR}}/` |
| Nginx 配置 | `/etc/nginx/sites-available/{{DEPLOY_DIR}}` |
| 域名 | `{{DOMAIN}}` |

### 部署步骤

```bash
cd /var/www/{{DEPLOY_DIR}}
git pull origin main

# 如有 Nginx 配置变更
sudo nginx -t && sudo nginx -s reload
```

---

## 五、修改指南

### 改主题色
编辑 `config.js` 的 `theme` 对象。

### 添加新页面
1. 创建 `pages/xxx.js`，用 `Object.assign(app, { renderXxx(el) { ... } })` 挂载
2. 在 `config.js` 的 `pages` 数组中添加 `{ key: 'xxx', label: '页面名', icon: '📋', hash: '#xxx' }`
3. 在 `index.html` 底部加 `<script src="pages/xxx.js"></script>`
4. 在 `app.js` 的 route switch 中加 `case 'xxx': this.renderXxx(contentEl); break;`

### 启用 AI 聊天
1. 编辑 `config.js`，设 `chat.enabled = true`，填入 `agentId`
2. Nginx 配置中加 `/copaw-api/` 代理到 `localhost:8088`
3. 添加 `pages/chat.js`（可从 Andy-Shihundan 仓库复制）

---

## 六、依赖

- **CoPaw API**（可选）：`localhost:8088`，通过 Nginx `/copaw-api/` 代理
- **无其他外部依赖**：纯原生 HTML/CSS/JS
