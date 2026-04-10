/**
 * markdown-preview.js — Markdown 预览弹窗组件
 * 来源：Teaching-Dashboard
 * 
 * 依赖：marked.min.js（lib/marked.min.js）
 * 用法：app.previewFile(url, '文件名.md')
 */

previewFile(url, name) {
    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('preview-content');
    const title = document.getElementById('preview-title');
    
    title.textContent = name;
    content.innerHTML = '<div class="preview-loading">加载中...</div>';
    modal.classList.add('active');

    fetch(url).then(r => {
        if (!r.ok || r.headers.get('content-type')?.includes('html')) throw new Error('fail');
        return r.text();
    }).then(md => {
        content.innerHTML = `<div class="md-preview">${marked.parse(md)}</div>`;
    }).catch(() => {
        // 中文路径回退 GitHub API
        API.fetchFile(CONFIG.materials.repo, CONFIG.materials.branch, 
            url.split('/' + CONFIG.materials.branch + '/')[1])
        .then(md => {
            content.innerHTML = `<div class="md-preview">${marked.parse(md)}</div>`;
        }).catch(() => {
            content.innerHTML = '<p style="color:red">文件加载失败</p>';
        });
    });
},

closePreview() {
    document.getElementById('preview-modal').classList.remove('active');
},

printPreview() {
    window.print();
}
