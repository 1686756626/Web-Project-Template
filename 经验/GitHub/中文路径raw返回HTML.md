# GitHub Raw URL 中文路径返回 HTML

> 来源：Teaching-Dashboard

## 规则

获取中文路径文件时，先试 raw URL，失败则回退 Contents API（base64 解码）。

## 具体做法

```js
async fetchFile(repo, branch, path) {
    let text = null;
    // 1. 先试 raw URL（快）
    try {
        const res = await fetch(rawUrl);
        if (res.ok && !res.headers.get('content-type')?.includes('html')) {
            text = await res.text();
        }
    } catch (e) {}

    // 2. 回退 Contents API（支持中文路径）
    if (!text || text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
        const encoded = path.split('/').map(encodeURIComponent).join('/');
        const res = await fetch(`/gh-api/repos/${owner}/${repo}/contents/${encoded}?ref=${branch}`);
        const data = await res.json();
        const binary = atob(data.content.replace(/\n/g, ''));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        text = new TextDecoder('utf-8').decode(bytes);
    }
    return text;
}
```

## 判断失败的标志

返回内容以 `<!` 或 `<html` 开头，说明 raw URL 返回了 HTML 错误页而非文件内容。
