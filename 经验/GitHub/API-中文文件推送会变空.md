# GitHub Contents API 推送中文文件会变空

> 来源：Teaching-Dashboard 项目，commit `ee02867`

## 问题

通过 GitHub REST API（Contents API）推送含中文内容的文件，API 返回 200 但文件变为 0 字节。

## 原因

GitHub Contents API 的 base64 编码对中文内容处理不稳定。API 不会报错，但文件内容丢失。

## 解决方案

**永远不要用 Contents API 推送含中文的文件。** 必须用 git clone 到本地，然后 commit + push：

```bash
git clone https://token@github.com/user/repo.git /tmp/repo
cd /tmp/repo
# 修改文件
git add -A && git commit -m "message" && git push
```

## 验证

推送后通过 API 或 raw URL 获取文件内容，确认非空再结束。
