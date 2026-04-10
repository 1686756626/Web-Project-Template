# Web-Project-Template

> 所有项目的通用经验知识库。前端开发中踩过的坑、验证过的方案、最佳实践，集中存放于此。

## 这是什么

每个项目（Teaching-Dashboard、Finance-Manager、Andy-Shihundan、CXL 等）在开发过程中都会积累经验——某个 CSS 方案的取舍、Nginx 配置的踩坑、GitHub API 的中文文件问题等。这些经验不属于任何一个项目，而是跨项目通用的。

本仓库就是这些经验的集中存放地。

## 目录结构

```
经验/
├── 前端/
│   ├── SPA-纯JS路由方案.md
│   ├── Tailwind-深色模式覆盖方案.md
│   ├── 打印样式优化.md
│   └── 移动端适配.md
├── 部署/
│   ├── Nginx-静态站点配置.md
│   ├── Nginx-GitHub-API反代.md
│   └── 浏览器缓存破坏方案.md
├── GitHub/
│   ├── API-中文文件推送会变空.md
│   └── API-中文路径raw返回HTML.md
└── 架构/
    └── 纯前端SPA-目录结构.md
```

## 和各项目的关系

| 项目 | 仓库 | 可以从这里学到/参考什么 |
|------|------|------------------------|
| Teaching-Dashboard | `Teaching-Dashboard` | SPA 路由、Markdown 渲染、GitHub API 代理、打印样式 |
| Finance-Manager | `Finance-Manager` | 聊天面板、数据持久化、图表 |
| Andy-Shihundan | `Andy-Shihundan` | 轻量 SPA、娱乐功能 |
| CXL | `CXL` | 多科目教学系统、知识讲解+练习题结构 |

## 贡献方式

遇到新的通用经验时：
1. 在对应的 `经验/` 子目录下新建 md 文件
2. 写清楚：问题 → 原因 → 解决方案 → 验证结果
3. 提交时注明来自哪个项目

## 技术栈

纯前端单页应用：原生 HTML/CSS/JS，零框架依赖。

详见 [AGENTS.md](./AGENTS.md)。
