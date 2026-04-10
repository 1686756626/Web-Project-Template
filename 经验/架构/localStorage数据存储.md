# localStorage 数据存储

> 来源：Finance-Manager（收支记录存储）

## 规则

轻量数据用 localStorage，不需要后端。注意：清浏览器 = 清数据。

## 具体做法

### Store 工具类（utils.js）

```js
const Store = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
```

### 使用

```js
this.records = Store.get('finance_records') || [];
Store.set('finance_records', this.records);
```

## 注意

- localStorage 容量约 5MB，够存数千条记录
- **清浏览器数据会丢失所有记录**
- JSON.parse 失败时返回 null，用 `|| []` 兜底
- 密码验证也可以用 localStorage 存 session 状态
