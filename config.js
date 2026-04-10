/**
 * config.js — 站点配置
 * 
 * 每个项目修改这里的值即可。
 */

const CONFIG = {
    siteName: '{{SITE_NAME}}',
    domain: '{{DOMAIN}}',
    description: '{{DESCRIPTION}}',
    version: '1.0.0',

    // 主题色
    theme: {
        primary: '#3b82f6',
        primaryLight: '#60a5fa',
        primaryDark: '#2563eb',
        bg: '#ffffff',
        bgCard: '#ffffff',
        border: '#e5e7eb',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textMuted: '#9ca3af',
    },

    // 页面列表（导航栏自动生成）
    pages: [
        { key: 'home', label: '首页', icon: '🏠', hash: '#home' }
    ],

    // AI 聊天（可选，删除此块则不启用）
    chat: {
        enabled: false,
        agentId: '',
        apiBase: '/copaw-api',
        userId: 'visitor',
        placeholder: '输入消息...'
    }
};
