# Tailwind 深色模式覆盖方案

> 来源：Teaching-Dashboard 项目

## 问题

纯前端 SPA 中所有 HTML 都是 JS 模板字符串动态生成的，无法在每处加 `dark:` 前缀。Tailwind 的 `dark:` class 方案不适用。

## 解决方案

用 JS 动态注入一个全局 `<style>` 覆盖样式，用 `!important` 强制覆盖：

```js
_initDarkMode() {
    const darkStyle = document.createElement('style');
    darkStyle.id = 'dark-override';
    darkStyle.textContent = `
        .dark body { background: #111827 !important; }
        .dark .bg-white { background: #1f2937 !important; }
        .dark .text-gray-900 { color: #f9fafb !important; }
        .dark .text-gray-700 { color: #d1d5db !important; }
        .dark .border-gray-100 { border-color: #374151 !important; }
        /* ... 按需补充 */
    `;
    document.head.appendChild(darkStyle);
}
```

切换时 toggle `<html>` 的 `dark` class：

```js
toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}
```

## 注意

- 必须用 `!important`，否则 Tailwind 的工具类优先级更高
- 渐变背景（`bg-gradient-to-r from-xxx`）需要单独选择器覆盖
- 标签（`.tag-语文`）等自定义 class 也要覆盖
- 需要覆盖 `hover:` 状态：`.dark .hover\:bg-blue-50:hover`
