# SPA 路由与页面组织

> 来源：Teaching-Dashboard、Finance-Manager、Andy-Shihundan

## 规则

用 hash 路由，不用 History API。所有页面逻辑独立文件。

## 具体做法

### 路由核心（app.js）

```js
route() {
    const hash = location.hash.slice(1) || 'home';
    const page = hash.split('/')[0];  // 支持 #page/param
    const contentEl = document.getElementById('content');
    switch (page) {
        case 'home':      this.renderHome(contentEl); break;
        case 'dashboard': this.renderDashboard(contentEl); break;
        // ...
        default:          this.renderHome(contentEl);
    }
}
```

### 页面文件（pages/xxx.js）

```js
Object.assign(app, {
    renderXxx(el) {
        el.innerHTML = `<div>页面内容</div>`;
    }
});
```

### 页面注册（config.js）

```js
pages: [
    { key: 'home', label: '首页', icon: '📋', hash: '#home' },
    { key: 'xxx', label: '页面名', icon: '📝', hash: '#xxx' }
]
```

### index.html 底部引入

```html
<script src="config.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>
<script src="pages/home.js"></script>
<script src="pages/xxx.js"></script>
```

## 注意

- `hashchange` 事件监听路由变化，同时要监听 `click` 事件兼容导航链接点击
- 页面间传参用 `hash.split('/')` 取路径参数，如 `#student/黄涵松`
