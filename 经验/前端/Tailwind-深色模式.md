# Tailwind 深色模式

> 来源：Teaching-Dashboard（验证通过）

## 规则

JS 模板字符串生成的 HTML 无法用 `dark:` 前缀。用 JS 注入全局 `<style>` + `!important` 覆盖。

## 具体做法

### 1. index.html 中配置 Tailwind darkMode

```html
<script>
tailwind.config = { darkMode: 'class' }
</script>
```

### 2. JS 中注入覆盖样式

```js
_initDarkMode() {
    const style = document.createElement('style');
    style.id = 'dark-override';
    style.textContent = `
        .dark body, .dark .bg-gray-50 { background: #111827 !important; }
        .dark .bg-white { background: #1f2937 !important; }
        .dark .text-gray-900 { color: #f9fafb !important; }
        .dark .text-gray-700 { color: #d1d5db !important; }
        .dark .text-gray-600 { color: #9ca3af !important; }
        .dark .text-gray-500, .dark .text-gray-400 { color: #6b7280 !important; }
        .dark .border-gray-100, .dark .border-gray-200 { border-color: #374151 !important; }
        .dark .hover\:bg-blue-50:hover { background: #374151 !important; }
        /* 渐变背景也要覆盖 */
        .dark .bg-gradient-to-r.from-blue-50 { background: #1f2937 !important; }
        /* 彩色文字 */
        .dark .text-blue-600 { color: #93c5fd !important; }
        .dark .text-green-500 { color: #34d399 !important; }
        .dark .text-red-400 { color: #f87171 !important; }
        /* 标签 */
        .dark .tag-语文 { background: rgba(251,191,36,0.15) !important; color: #fbbf24 !important; }
    `;
    document.head.appendChild(style);
}
```

### 3. 切换方法

```js
toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark ? '1' : '0');
}
```

## 注意

- 必须用 `!important`，否则 Tailwind 工具类优先级更高
- 渐变背景（`bg-gradient-to-r from-xxx`）需要单独覆盖，不能只覆盖 `bg-xxx`
- hover 状态用 `.dark .hover\:bg-blue-50:hover`（反斜杠转义冒号）
- Markdown 预览区域（`.md-preview`）的深色样式写在 index.html 的 `<style>` 中更合适
