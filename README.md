# 日序｜個人行程與目標

日序是個人行程、任務與長期目標管理的網頁原型。Google 登入使用 Firebase Authentication；目前登入只負責驗證帳號，範例行程和目標尚未儲存或同步到雲端。

## 啟用 Google 登入

1. 在 [Firebase Console](https://console.firebase.google.com/) 建立專案，新增 Web app，複製 Firebase Web app 設定。
2. 將設定填入根目錄的 `firebase-config.js`，取代 `YOUR_API_KEY`、`YOUR_PROJECT_ID` 和 `YOUR_APP_ID` 等範例值。
3. 在 Firebase Console 的 **Authentication → Sign-in method** 啟用 **Google**，並選擇支援電子郵件。
4. 到 **Authentication → Settings → Authorized domains**，加入要使用的網域。正式網站需使用 HTTPS。
5. 透過本機伺服器或 HTTPS 網站開啟 `index.html`。例如在專案目錄執行 `python -m http.server 8000`，再瀏覽 `http://localhost:8000`。

Firebase Web app 設定會出現在前端，因此不是私密憑證。請勿放入 Firebase service account 私鑰；並在 Google Cloud/Firebase 限制 API key 可使用的網站網域。
