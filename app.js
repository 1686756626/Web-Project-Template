/**
 * app.js — 主应用
 *
 * 架构概览：
 *   config.js  → CONFIG（站点配置）
 *   utils.js   → 工具函数
 *   app.js     → 本文件，路由 + 数据加载（单页应用）
 *   pages/*.js → 各页面渲染逻辑（Object.assign 挂到 app 上）
 *
 * 数据流：
 *   init() → loadData() → 加载项目数据
 *         → route() → 根据 hash 渲染对应页面
 *
 * 扩展方式：
 *   1. 创建 pages/xxx.js
 *   2. Object.assign(app, { renderXxx(el) { ... } })
 *   3. 在 config.js 的 pages 数组中添加 { key: 'xxx', label: '页面名', icon: '📋', hash: '#xxx' }
 *   4. 在 route() 的 switch 中加 case
 */

const app = {
    data: null,
    currentPage: 'home',

    async init() {
        await this.loadData();
        window.addEventListener('hashchange', () => this.route());
        this.route();
    },

    /** 加载数据 — 按项目需求改写 */
    async loadData() {
        this.data = {};
    },

    /** Hash 路由 */
    route() {
        const hash = location.hash.slice(1) || 'home';
        const page = hash.split('/')[0];
        this.currentPage = page;

        // 更新导航高亮
        document.querySelectorAll('.nav-tab').forEach(el => {
            el.classList.toggle('active', el.dataset.page === page);
        });

        const contentEl = document.getElementById('content');
        if (!contentEl) return;

        switch (page) {
            case 'home': this.renderHome(contentEl); break;
            default:     this.renderHome(contentEl);
        }

        window.scrollTo(0, 0);
    },

    // 占位，由 pages/*.js 通过 Object.assign 挂载
    renderHome() {},
};

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', () => app.init());
