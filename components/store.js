/**
 * store.js — localStorage 读写工具
 * 来源：Finance-Manager
 * 用法：Store.get('key') / Store.set('key', value)
 */
const Store = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
