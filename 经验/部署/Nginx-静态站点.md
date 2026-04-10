# Nginx 静态站点部署

> 来源：所有项目

## 规则

每个项目一个 nginx 配置文件，部署目录在 `/var/www/` 下。

## 具体做法

### 配置文件模板（/etc/nginx/sites-available/xxx）

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/xxx;
    index index.html;

    # SPA 路由：所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

### 部署流程

```bash
cd /var/www/xxx && git pull origin main
# 或手动 cp
cp -r /path/to/repo/* /var/www/xxx/
# 修改后重载
nginx -t && nginx -s reload
```

### 多站点共存

```
/var/www/teaching/   → http://131.143.251.21/
/var/www/finance/    → http://finance.131.143.251.21.nip.io/
/var/www/andy/       → http://andyshihundan.icu/
```

## 注意

- `try_files` 必须有，否则 hash 路由刷新会 404
- `must-revalidate` 确保版本号变更后浏览器会请求新文件
