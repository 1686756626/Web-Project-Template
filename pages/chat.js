/**
 * pages/chat.js — 自包含 AI 聊天面板（浮动 + 会话列表 + 服务端持久化）
 * 
 * 依赖：config.js 中 CONFIG.chat 配置项
 * 依赖：utils.js 中 escapeHtml 函数
 * 不依赖 app 对象，可独立运行
 */
(function() {
    // ---- 配置检查 ----
    const cfg = (typeof CONFIG !== 'undefined' && CONFIG.chat) || {};
    if (!cfg.enabled) return;

    const API = cfg.chatApiBase || '/chat-api';
    const COPAW = cfg.apiBase || '/copaw-api';
    const AGENT = cfg.agentId;
    const USER_ID = cfg.userId || 'user';

    if (!AGENT) { console.warn('[chat] agentId 未配置，跳过初始化'); return; }

    // ---- 状态 ----
    let sessionId = null;
    let streaming = false;
    let controller = null;
    let historyLoaded = false;
    let sessionsOpen = false;

    // ---- 工具 ----
    function esc(t) {
        if (typeof escapeHtml === 'function') return escapeHtml(t);
        if (!t) return '';
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    }

    function store(key, val) {
        if (val === undefined) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
        localStorage.setItem(key, JSON.stringify(val));
    }

    function formatTime(ts) {
        if (!ts) return '';
        const d = new Date(ts.replace ? ts.replace(' ', 'T') : ts);
        const now = new Date();
        const hh = String(d.getHours()).padStart(2,'0');
        const mm = String(d.getMinutes()).padStart(2,'0');
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = today - that;
        if (diff === 0) return '今天 ' + hh + ':' + mm;
        if (diff <= 86400000) return '昨天 ' + hh + ':' + mm;
        return (d.getMonth()+1) + '/' + d.getDate() + ' ' + hh + ':' + mm;
    }

    // ---- 构建DOM ----
    function build() {
        // session id 持久化
        sessionId = store('chat_session_id');
        if (!sessionId) { sessionId = String(Date.now()); store('chat_session_id', sessionId); }

        // 浮动按钮
        const fab = document.createElement('div');
        fab.id = 'chat-fab';
        fab.innerHTML = '💬';
        fab.onclick = toggle;
        document.body.appendChild(fab);

        // 面板
        const panel = document.createElement('div');
        panel.id = 'chat-panel';
        panel.innerHTML = `
            <div class="chat-panel-header">
                <button class="chat-header-btn" id="chat-sessions-btn" title="会话列表">📋</button>
                <span class="chat-header-title" id="chat-title-btn">💬 聊天</span>
                <button class="chat-close" id="chat-close-btn">✕</button>
            </div>
            <div class="chat-session-sidebar" id="chat-sessions">
                <div class="chat-sessions-header">
                    <span>历史会话</span>
                    <button class="chat-new-btn" id="chat-new-btn">＋ 新会话</button>
                </div>
                <div class="chat-sessions-list" id="chat-sessions-list"></div>
            </div>
            <div class="chat-panel-body" id="chat-body">
                <div class="chat-welcome">
                    <div class="chat-welcome-icon">💬</div>
                    <p>${cfg.placeholder || '有什么想聊的？'}</p>
                </div>
            </div>
            <div class="chat-panel-input">
                <textarea id="chat-input" rows="1" placeholder="${cfg.placeholder || '输入消息...'}"></textarea>
                <button id="chat-send-btn">➤</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('chat-close-btn').onclick = toggle;
        document.getElementById('chat-sessions-btn').onclick = toggleSessions;
        document.getElementById('chat-title-btn').onclick = toggleSessions;
        document.getElementById('chat-new-btn').onclick = function(e) { e.stopPropagation(); newSession(); };
        document.getElementById('chat-send-btn').onclick = send;
        document.getElementById('chat-input').addEventListener('input', function() {
            this.style.height = '40px';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
        document.getElementById('chat-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
    }

    function toggle() {
        const p = document.getElementById('chat-panel');
        const open = p.classList.toggle('open');
        if (open && !historyLoaded) loadHistory();
        if (open) document.getElementById('chat-input')?.focus();
        if (!open && sessionsOpen) { sessionsOpen = false; p.classList.remove('sessions-open'); }
    }

    function toggleSessions() {
        const p = document.getElementById('chat-panel');
        sessionsOpen = !sessionsOpen;
        p.classList.toggle('sessions-open', sessionsOpen);
        if (sessionsOpen) loadSessionList();
    }

    // ---- 历史消息 ----
    async function loadHistory() {
        try {
            const r = await fetch(API + '/messages?session_id=' + encodeURIComponent(sessionId) + '&limit=200');
            const j = await r.json();
            if (j.ok && j.data && j.data.length) {
                const body = document.getElementById('chat-body');
                const w = body.querySelector('.chat-welcome');
                if (w) w.remove();
                j.data.forEach(m => {
                    const d = document.createElement('div');
                    d.className = 'chat-msg ' + m.role;
                    d.innerHTML = '<div class="chat-bubble">' + esc(m.content) + '</div>';
                    body.appendChild(d);
                });
                body.scrollTop = body.scrollHeight;
            }
        } catch(e) { console.warn('[chat] 加载历史失败:', e); }
        historyLoaded = true;
    }

    // ---- 会话列表 ----
    async function loadSessionList() {
        const el = document.getElementById('chat-sessions-list');
        el.innerHTML = '<div class="chat-loading">加载中...</div>';
        try {
            const r = await fetch(API + '/sessions?limit=50');
            const j = await r.json();
            if (!j.ok) throw 0;
            if (!j.data.length) { el.innerHTML = '<div class="chat-empty">还没有会话记录</div>'; return; }
            el.innerHTML = j.data.map(s => {
                const active = s.session_id === sessionId;
                return '<div class="chat-session-item' + (active ? ' active' : '') + '" data-sid="' + s.session_id + '">' +
                    '<div class="chat-session-title">' + esc(s.title) + '</div>' +
                    '<div class="chat-session-meta"><span>' + s.msg_count + ' 条</span><span>' + formatTime(s.updated_at) + '</span></div>' +
                    (active ? '' : '<button class="chat-session-del" data-del="' + s.session_id + '" title="删除">🗑</button>') +
                '</div>';
            }).join('');
            // 绑定点击
            el.querySelectorAll('.chat-session-item').forEach(item => {
                item.onclick = function() {
                    const sid = this.dataset.sid;
                    if (sid === sessionId) { toggleSessions(); return; }
                    switchSession(sid);
                };
            });
            el.querySelectorAll('.chat-session-del').forEach(btn => {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    const sid = this.dataset.del;
                    if (!confirm('删除这个会话？')) return;
                    deleteSession(sid);
                };
            });
        } catch(e) { el.innerHTML = '<div class="chat-empty">加载失败</div>'; }
    }

    async function switchSession(sid) {
        sessionId = sid;
        store('chat_session_id', sid);
        historyLoaded = false;
        document.getElementById('chat-body').innerHTML = '';
        await loadHistory();
        sessionsOpen = false;
        document.getElementById('chat-panel').classList.remove('sessions-open');
    }

    function newSession() {
        sessionId = String(Date.now());
        store('chat_session_id', sessionId);
        historyLoaded = true;
        document.getElementById('chat-body').innerHTML =
            '<div class="chat-welcome"><div class="chat-welcome-icon">💬</div><p>' +
            (cfg.placeholder || '有什么想聊的？') + '</p></div>';
        sessionsOpen = false;
        document.getElementById('chat-panel').classList.remove('sessions-open');
        document.getElementById('chat-input')?.focus();
    }

    async function deleteSession(sid) {
        try { await fetch(API + '/sessions/' + encodeURIComponent(sid), { method: 'DELETE' }); } catch(e) {}
        if (sid === sessionId) newSession();
        loadSessionList();
    }

    // ---- 消息 ----
    function appendMsg(role, html) {
        const body = document.getElementById('chat-body');
        const w = body.querySelector('.chat-welcome');
        if (w) w.remove();
        const d = document.createElement('div');
        d.className = 'chat-msg ' + role;
        d.innerHTML = '<div class="chat-bubble">' + html + '</div>';
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
        return d;
    }

    async function saveMsg(role, content) {
        try {
            await fetch(API + '/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, role, content })
            });
        } catch(e) { console.warn('[chat] 保存失败:', e); }
    }

    async function send() {
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('chat-send-btn');
        const text = input.value.trim();
        if (!text || streaming) return;
        input.value = '';
        input.style.height = '40px';
        appendMsg('user', esc(text));
        saveMsg('user', text);

        streaming = true;
        btn.disabled = true;
        btn.innerHTML = '⏳';

        try {
            controller = new AbortController();
            const resp = await fetch(COPAW + '/agents/' + AGENT + '/console/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: [{ content: [{ type: 'text', text }] }],
                    session_id: sessionId,
                    user_id: USER_ID,
                    channel: 'console'
                }),
                signal: controller.signal
            });
            if (!resp.ok) throw new Error('API ' + resp.status);

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let aiDiv = appendMsg('ai', '<span style="color:var(--text-muted, #999)">思考中...</span>');
            let bubble = aiDiv.querySelector('.chat-bubble');
            let fullText = '';
            let buffer = '';
            let timer = null;

            const flush = () => {
                timer = null;
                if (fullText) bubble.innerHTML = esc(fullText);
                document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
            };
            const schedule = () => { if (!timer) timer = setTimeout(flush, 80); };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const chunks = buffer.split('\n\n');
                buffer = chunks.pop() || '';
                for (const chunk of chunks) {
                    for (const line of chunk.split('\n')) {
                        if (!line.startsWith('data: ')) continue;
                        const raw = line.slice(6).trim();
                        if (!raw || raw === '[DONE]') continue;
                        try {
                            const p = JSON.parse(raw);
                            if (p.text) fullText = p.text;
                            else if (p.content) {
                                const parts = Array.isArray(p.content) ? p.content : [p.content];
                                let t = '';
                                for (const x of parts) { if (x.type === 'text' && x.text) t += x.text; }
                                if (t) fullText = t;
                            } else if (p.delta && p.delta.text) {
                                fullText += p.delta.text;
                            }
                        } catch(e) {}
                    }
                    schedule();
                }
            }
            if (timer) { clearTimeout(timer); flush(); }
            if (fullText) {
                bubble.innerHTML = esc(fullText);
                saveMsg('ai', fullText);
            } else {
                bubble.innerHTML = '<span style="color:var(--text-muted, #999)">（无回复）</span>';
            }
        } catch(err) {
            if (err.name !== 'AbortError') appendMsg('ai', '<span style="color:#ef4444">⚠️ ' + esc(err.message) + '</span>');
        } finally {
            streaming = false;
            btn.disabled = false;
            btn.innerHTML = '➤';
            controller = null;
        }
    }

    // ---- 启动 ----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(build, 100));
    } else {
        setTimeout(build, 100);
    }
})();
