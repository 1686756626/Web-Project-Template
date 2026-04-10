/**
 * github-api.js — GitHub API 客户端（含中文路径兼容）
 * 来源：Teaching-Dashboard
 * 
 * 用法：
 *   1. 设置 CONFIG: { owner, repo, branch, token }
 *   2. 通过 nginx 反代注入 Authorization（不要在前端暴露 token）
 *   3. API.fetchTree() / API.fetchFile() / API.downloadUrl()
 */

const API = {
    // Raw 文件 URL（快，但中文路径可能失败）
    rawUrl(repo, branch, path) {
        return `/gh-raw/${CONFIG.owner}/${repo}/${branch}/${path}`;
    },
    
    // 下载 URL
    downloadUrl(repo, branch, path) {
        return `/gh-raw/${CONFIG.owner}/${repo}/${branch}/${path}`;
    },

    // 获取仓库文件树
    async fetchTree(repo, branch) {
        const url = `/gh-api/repos/${CONFIG.owner}/${repo}/git/trees/${branch}?recursive=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return (await res.json()).tree;
    },

    // 获取文件内容（自动兼容中文路径）
    async fetchFile(repo, branch, path) {
        let text = null;
        
        // 1. 先试 raw URL（快）
        try {
            const res = await fetch(this.rawUrl(repo, branch, path));
            if (res.ok && !res.headers.get('content-type')?.includes('html')) {
                text = await res.text();
            }
        } catch (e) {}

        // 2. raw 失败则回退 Contents API（base64 解码）
        if (!text || text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
            const encoded = path.split('/').map(encodeURIComponent).join('/');
            const url = `/gh-api/repos/${CONFIG.owner}/${repo}/contents/${encoded}?ref=${branch}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
            const data = await res.json();
            const binary = atob(data.content.replace(/\n/g, ''));
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            text = new TextDecoder('utf-8').decode(bytes);
        }

        if (!text) throw new Error(`Empty response for ${path}`);
        return text;
    }
};
