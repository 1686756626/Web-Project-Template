# Nginx GitHub API 反代

> 来源：Teaching-Dashboard

## 规则

前端不直接调 GitHub API（暴露 Token + 跨域问题）。nginx 反代并注入 Authorization。

## 具体做法

```nginx
# GitHub API 反代
location /gh-api/ {
    proxy_pass https://api.github.com/;
    proxy_set_header Authorization "token YOUR_GITHUB_TOKEN";
    proxy_set_header User-Agent "nginx-proxy";
    proxy_pass_request_headers off;
}

# GitHub Raw 文件反代
location /gh-raw/ {
    proxy_pass https://raw.githubusercontent.com/;
    proxy_set_header Authorization "token YOUR_GITHUB_TOKEN";
}
```

前端调用：

```js
// 之前：https://api.github.com/repos/user/repo/contents/path
// 现在：/gh-api/repos/user/repo/contents/path
const res = await fetch('/gh-api/repos/1686756626/Teaching-Materials/git/trees/master?recursive=1');
```

## 注意

- `proxy_pass_request_headers off` 防止浏览器带自己的 Authorization
- 带 Token 后速率限制从 60次/小时 → 5000次/小时
- 私有仓库必须带 Token
