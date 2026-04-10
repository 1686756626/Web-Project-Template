# 纯前端 SPA 标准结构

> 来源：Teaching-Dashboard、Finance-Manager、Andy-Shihundan（三项目验证）

## 规则

零框架、零构建、零 npm。纯原生 HTML/CSS/JS。

## 标准目录

```
repo/
├── index.html          ← 入口（CSS + HTML 外壳 + script 引入）
├── config.js           ← 站点配置（主题、页面列表、功能开关）
├── utils.js            ← 工具函数（Markdown 渲染、Store、格式化）
├── app.js              ← 主应用对象（init + route + 数据加载）
├── pages/              ← 各页面渲染（Object.assign 挂到 app）
│   ├── home.js
│   └── xxx.js
├── lib/                ← 第三方库本地副本
│   ├── marked.min.js
│   └── tailwind.js
├── AGENTS.md           ← 智能体交接手册
└── .gitignore
```

## 核心模式

1. **app 单例**：所有数据和方法挂在 `app` 对象上
2. **hash 路由**：`location.hash` → `switch` → `renderXxx()`
3. **模板字符串**：`` `<div>${data}</div>` ``，不用框架
4. **页面独立文件**：`Object.assign(app, { renderXxx() {} })`
5. **config.js 集中配置**：页面列表、主题色、功能开关

## 优点

- 部署只需 `cp` 或 `git pull` 到 nginx 目录
- 一个 `app.js` 就是一个完整应用
- 不依赖 Node.js 构建流程
