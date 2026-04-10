/**
 * chat-server — 聊天消息持久化服务（通用）
 * SQLite 存储，Express API，端口 3099
 *
 * API:
 *   GET  /sessions                → 获取会话列表（按最近活跃排序）
 *   GET  /messages?session_id=x   → 获取某个会话的消息历史
 *   POST /messages                → 保存一条消息 {session_id, role, content}
 *   POST /messages/batch          → 批量保存
 *   DELETE /sessions/:session_id  → 删除某个会话
 *   GET  /health                  → 健康检查
 */
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const PORT = process.env.CHAT_PORT || 3099;
const DB_PATH = path.join(__dirname, 'chat.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, id);
  CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
`);
console.log(`[chat-server] SQLite ready: ${DB_PATH}`);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 会话列表
app.get('/sessions', (req, res) => {
  const { limit = 50 } = req.query;
  const rows = db.prepare(`
    SELECT
      m.session_id,
      COUNT(*) AS msg_count,
      MIN(m.created_at) AS created_at,
      MAX(m.created_at) AS updated_at,
      (SELECT m2.content FROM messages m2 WHERE m2.session_id = m.session_id AND m2.role = 'user' ORDER BY m2.id ASC LIMIT 1) AS title,
      (SELECT m3.content FROM messages m3 WHERE m3.session_id = m.session_id ORDER BY m3.id DESC LIMIT 1) AS last_msg
    FROM messages m
    GROUP BY m.session_id
    ORDER BY MAX(m.id) DESC
    LIMIT ?
  `).all(Number(limit));
  res.json({ ok: true, data: rows.map(r => ({ ...r, title: (r.title || '新会话').slice(0, 30), last_msg: (r.last_msg || '').slice(0, 50) })) });
});

// 消息历史
app.get('/messages', (req, res) => {
  const { session_id, limit = 200, before_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id required' });
  let sql = 'SELECT * FROM messages WHERE session_id = ?';
  const params = [session_id];
  if (before_id) { sql += ' AND id < ?'; params.push(Number(before_id)); }
  sql += ' ORDER BY id ASC LIMIT ?';
  params.push(Number(limit));
  res.json({ ok: true, data: db.prepare(sql).all(...params) });
});

// 保存一条消息
app.post('/messages', (req, res) => {
  const { session_id, role, content } = req.body;
  if (!session_id || !role || !content) return res.status(400).json({ error: 'session_id, role, content required' });
  const info = db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)').run(session_id, role, content);
  res.json({ ok: true, id: info.lastInsertRowid });
});

// 批量保存
app.post('/messages/batch', (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'messages array required' });
  const insert = db.prepare('INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)');
  const ids = db.transaction((msgs) => msgs.map(m => insert.run(m.session_id, m.role, m.content, m.created_at || undefined).lastInsertRowid))(messages);
  res.json({ ok: true, ids });
});

// 删除会话
app.delete('/sessions/:session_id', (req, res) => {
  db.prepare('DELETE FROM messages WHERE session_id = ?').run(req.params.session_id);
  res.json({ ok: true });
});

app.get('/health', (req, res) => res.json({ ok: true, service: 'chat-server' }));

app.listen(PORT, '127.0.0.1', () => console.log(`[chat-server] Listening on http://127.0.0.1:${PORT}`));
