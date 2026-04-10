# GitHub Raw URL 中文路径返回 HTML

> 来源：Teaching-Dashboard 项目

## 问题

通过 GitHub Raw URL（`raw.githubusercontent.com`）获取中文路径的文件（如 `profiles/杨紫泠.md`），返回的不是文件内容而是 HTML 错误页面（400 Bad Request）。

## 原因

Raw URL 对中文路径编码处理不稳定，尤其是经过 nginx 反代后。

## 解决方案

前端获取中文路径文件时，先尝试 raw URL，如果返回的是 HTML 则回退到 Contents API（base64 解码）：

```js
async fetchFile(repo, branch, path) {
    // 优先用 raw URL（快）
    let text = null;
    try {
        const res = await fetch(rawUrl);
        if (res.ok && !res.headers.get('content-type')?.includes('html')) {
            text = await res.text();
        }
    } catch (e) {}

    // 回退到 Contents API（支持中文路径）
    if (!text || text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
        const encoded = path.split('/').map(encodeURIComponent).join('/');
        const res = await fetch(`/gh-api/repos/${owner}/${repo}/contents/${encoded}?ref=${branch}`);
        const data = await res.json();
        // base64 → UTF-8 解码
        const binary = atob(data.content.replace(/\n/g, ''));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        text = new TextDecoder('utf-8').decode(bytes);
    }
    return text;
}
```

## 注意

Contents API 有频率限制（60次/小时未认证），通过 nginx 反代加 Authorization header 可提高到 5000次/小时。
