# 纯前端 SPA 目录结构

> 来源：Teaching-Dashboard、Finance-Manager 项目验证

## 推荐结构

```
repo/
├── index.html          ← 入口（CSS + HTML 外壳）
├── config.js           ← 站点配置（主题、页面列表）
├── utils.js            ← 工具函数（Markdown 渲染、HTML 转义）
├── app.js              ← 主应用对象（路由 + 数据加载）
├── pages/              ← 各页面渲染逻辑
│   ├── home.js
│   ├── dashboard.js
│   └── settings.js
├── lib/                ← 第三方库（本地副本，不依赖 CDN）
│   ├── marked.min.js
│   ├── jszip.min.js
│   └── tailwind.js
└── AGENTS.md           ← AI Agent 交接手册
```

## 核心模式

1. **app 对象单例**：所有数据、方法挂在 `app` 上
2. **hash 路由**：`location.hash` 驱动，`switch` 分发到各 `renderXxx()`
3. **模板字符串拼 HTML**：不用框架，直接 `` `<div>${data}</div>` ``
4. **页面 JS 独立文件**：`Object.assign(app, { renderXxx() {} })` 挂载

## 路由示例

```js
route() {
    const page = location.hash.slice(1) || 'home';
    const contentEl = document.getElementById('content');
    switch (page) {
        case 'home':      this.renderHome(contentEl); break;
        case 'dashboard': this.renderDashboard(contentEl); break;
        default:          this.renderHome(contentEl);
    }
}
```

## 优点

- 零构建、零依赖、零 npm
- 一个 `app.js` 就是一个完整应用
- 部署只需 `cp` 到 nginx 静态目录
