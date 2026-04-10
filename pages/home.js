/**
 * pages/home.js — 首页
 */
Object.assign(app, {
    renderHome(el) {
        el.innerHTML = `
            <div class="hero">
                <h1>${CONFIG.siteName}</h1>
                <p>${CONFIG.description}</p>
            </div>
            <div class="container">
                <p style="text-align:center; color:var(--text-secondary); padding:40px 0;">
                    🚧 页面内容待填充
                </p>
            </div>
        `;
    }
});
