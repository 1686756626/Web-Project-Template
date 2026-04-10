# Nginx GitHub API 反代

> 来源：Teaching-Dashboard 项目

## 问题

前端直接调用 GitHub API 会暴露 Token，且有跨域问题。

## 解决方案

nginx 反代 GitHub API，在服务端注入 Authorization header：

```nginx
# GitHub API 反代
location /gh-api/ {
    proxy_pass https://api.github.com/;
    proxy_set_header Authorization "token YOUR_GITHUB_TOKEN";
    proxy_set_header User-Agent "nginx-proxy";
    proxy_pass_request_headers off;
    
    # 缓存（可选）
    proxy_cache_valid 200 5m;
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

- `proxy_pass_request_headers off` 防止浏览器带自己的 Authorization header
- 速率限制从 60次/小时（未认证）提升到 5000次/小时（带 Token）
- 私有仓库必须带 Token
