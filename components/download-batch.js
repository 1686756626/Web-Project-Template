/**
 * download-batch.js — 批量下载文件（打包 ZIP）
 * 来源：Teaching-Dashboard
 * 
 * 依赖：jszip.min.js（lib/jszip.min.js）
 * 用法：app.batchDownload([{url, name}, ...], '作业.zip')
 */

async batchDownload(files, zipName) {
    if (!files || !files.length) return;
    
    // 单文件直接下载
    if (files.length === 1) {
        const a = document.createElement('a');
        a.href = files[0].url;
        a.download = files[0].name;
        a.click();
        return;
    }

    // 多文件打包 ZIP
    const zip = new JSZip();
    const promises = files.map(async f => {
        try {
            const res = await fetch(f.url);
            if (res.ok) {
                const blob = await res.blob();
                zip.file(f.name, blob);
            }
        } catch (e) { /* 跳过失败的 */ }
    });
    await Promise.all(promises);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = zipName;
    a.click();
    URL.revokeObjectURL(a.href);
}
