# 通用经验知识库 — AI Agent 交接手册

> 本仓库是所有项目的经验 + 可复用组件 + 模板代码集中存放地。
> 智能体做新项目或遇到问题时，先来这里查。

---

## 三个用途

### 1. 查经验（`经验/` 目录）

按分类找对应经验，每篇格式：**来源项目 → 规则 → 具体做法 → 注意事项**。

| 目录 | 内容 |
|------|------|
| `前端/` | SPA路由、Tailwind深色模式、打印样式、移动端适配 |
| `部署/` | Nginx静态站点、GitHub API反代、缓存破坏、cron定时任务 |
| `GitHub/` | 中文文件推送变空（🔴红线）、中文路径raw返回HTML |
| `架构/` | SPA标准结构、localStorage存储、聊天面板组件 |
| `教学/` | 先练后讲、时间管理、出题流程、课后同步、多科目系统结构 |
| `数据/` | students.json课表格式 |

### 2. 复用组件（`components/` 目录）

直接复制到新项目使用的独立功能模块。每个文件头部有来源和用法注释。

### 3. 复用模板代码（根目录）

新项目可以直接复制 `app.js` + `config.js` + `utils.js` + `index.html` + `pages/` + `chat-server/` 作为起点。

---

## 联动机制

### 知识库侧

- `knowledge-map.json` — 全局索引，记录每个项目贡献了什么、使用了什么
- `贡献规范.md` — 定义什么该贡献、什么不该、格式要求、目录规则

### 项目侧

每个项目根目录有 `knowledge-map.json`，结构：

```json
{
  "_知识库": "https://github.com/1686756626/Web-Project-Template",
  "_贡献规范": "Web-Project-Template/贡献规范.md",
  "contributes": [
    { "knowledge": "经验/前端/xxx.md", "source": "说明", "status": "verified", "since": "日期" }
  ],
  "uses": [
    { "knowledge": "components/store.js", "purpose": "用途说明" }
  ],
  "pending": [
    { "idea": "待提取的经验想法", "reason": "暂不提取的原因" }
  ]
}
```

### 智能体行为规则

1. **接手任何项目时**：读 `knowledge-map.json` → 知道本项目和知识库的关联
2. **发现新的通用经验时**：
   - 读 `贡献规范.md` 判断是否该贡献
   - 按规范编写经验文档或组件
   - 更新本项目的 `knowledge-map.json`（contributes 数组）
   - 更新知识库的 `knowledge-map.json`（索引）
   - 两个仓库分别 commit + push
3. **做新项目时**：
   - 先来知识库查有没有现成的经验和组件
   - 在新项目的 `knowledge-map.json` 的 `uses` 数组中记录用了什么

### status 字段说明

| 值 | 含义 |
|----|------|
| `verified` | 已在 ≥1 个项目中实际验证通过 |
| `co-contributor` | 多项目共同贡献，非单一来源 |
| `red-line` | 红线规则，违反会导致严重故障 |
| `draft` | 草稿，尚未验证 |

### pending 字段

记录"觉得有用但还没提取"的想法。等第二个项目也需要时再提取，不提前抽象。
