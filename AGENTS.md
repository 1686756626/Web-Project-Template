# {{SITE_NAME}} — AI Agent 交接手册

> 读完本文件，你能立刻理解并维护这个项目。

---

## 一、项目定位

{{DESCRIPTION}}

**一句话说明：** 浏览器打开网页 → 加载数据 → 渲染页面。

---

## 二、技术架构

```
index.html        → 入口（CSS + HTML 外壳 + 聊天面板样式）
config.js         → 站点配置（主题、页面列表、AI 聊天参数）
utils.js          → 工具函数（Markdown 渲染、HTML 转义等）
app.js            → 主应用对象（路由 + 数据加载）
pages/*.js        → 各页面渲染逻辑（Object.assign 挂到 app 上）
chat-server/      → 聊天消息持久化服务（Node.js + SQLite）
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

## 五、AI 聊天面板

### 启用方式

编辑 `config.js`：

```js
chat: {
    enabled: true,
    agentId: 'YOUR_AGENT_ID',
    apiBase: '/copaw-api',
    chatApiBase: '/chat-api',
    userId: 'visitor',
    placeholder: '输入消息...'
}
```

### 需要的后端服务

**1. CoPaw API（Agent 对话）**
- 端口：8088
- Nginx 代理：`/copaw-api/` → `localhost:8088/api/`

**2. chat-server（消息持久化）**
- 端口：3099（可通过环境变量 `CHAT_PORT` 修改）
- Nginx 代理：`/chat-api/` → `localhost:3099/`
- 启动：
  ```bash
  cd chat-server && npm install && node server.js
  ```
- systemd 示例：见 `chat-server/finance-chat.service.example`

### chat-server API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/sessions` | 获取会话列表（按最近活跃排序） |
| GET | `/messages?session_id=xxx` | 获取某个会话的消息历史 |
| POST | `/messages` | 保存一条消息 `{session_id, role, content}` |
| POST | `/messages/batch` | 批量保存消息 |
| DELETE | `/sessions/:session_id` | 删除某个会话 |
| GET | `/health` | 健康检查 |

### 聊天面板功能
- ✅ 右下角 💬 浮动按钮，自动出现（enabled: true 时）
- ✅ SSE 流式对话（通过 CoPaw API）
- ✅ 📋 按钮 → 会话列表侧边栏（切换/新建/删除）
- ✅ 消息自动持久化到 SQLite，刷新不丢
- ✅ 自包含组件，不依赖 `app` 对象，无需改代码即可使用

### Nginx 配置示例

```nginx
location /copaw-api/ {
    proxy_pass http://127.0.0.1:8088/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 86400s;
    proxy_buffering off;
}

location /chat-api/ {
    proxy_pass http://127.0.0.1:3099/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 六、修改指南

### 改主题色
编辑 `config.js` 的 `theme` 对象。

### 添加新页面
1. 创建 `pages/xxx.js`，用 `Object.assign(app, { renderXxx(el) { ... } })` 挂载
2. 在 `config.js` 的 `pages` 数组中添加 `{ key: 'xxx', label: '页面名', icon: '📋', hash: '#xxx' }`
3. 在 `index.html` 底部加 `<script src="pages/xxx.js"></script>`
4. 在 `app.js` 的 route switch 中加 `case 'xxx': this.renderXxx(contentEl); break;`

---

## 七、依赖

- **CoPaw API**（可选）：`localhost:8088`，通过 Nginx `/copaw-api/` 代理
- **chat-server**（可选）：`localhost:3099`，通过 Nginx `/chat-api/` 代理
- **无其他外部依赖**：纯原生 HTML/CSS/JS
