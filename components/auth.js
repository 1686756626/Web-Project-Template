/**
 * auth.js — 简易前端登录验证
 * 来源：Finance-Manager
 * 
 * 用法：
 *   1. config.js 中设置 auth: { password: 'xxx', sessionKey: 'app_auth' }
 *   2. app.init() 中调用 this.checkAuth()
 *   3. 未登录时显示登录表单，登录后存 localStorage
 */

// 在 app 对象中添加：
checkAuth() {
    if (Store.get(CONFIG.auth.sessionKey)) return true;
    this.showLogin();
    return false;
},

showLogin() {
    document.getElementById('content').innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:100vh">
            <div style="text-align:center;padding:2rem;background:white;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                <h2>请输入密码</h2>
                <input type="password" id="login-pw" placeholder="密码" 
                    onkeydown="if(event.key==='Enter')app.doLogin()" style="margin:1rem 0;padding:0.5rem;width:200px">
                <br>
                <button onclick="app.doLogin()" style="padding:0.5rem 2rem">进入</button>
                <div id="login-err" style="color:red;margin-top:0.5rem"></div>
            </div>
        </div>`;
    setTimeout(() => document.getElementById('login-pw')?.focus(), 100);
},

doLogin() {
    const pw = document.getElementById('login-pw').value;
    if (pw === CONFIG.auth.password) {
        Store.set(CONFIG.auth.sessionKey, true);
        this.loadData();
        this.route();
    } else {
        document.getElementById('login-err').textContent = '密码错误';
    }
}
