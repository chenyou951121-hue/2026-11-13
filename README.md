# 日序｜個人行程與目標

日序是個人行程、任務與長期目標管理的網頁原型。Google 登入使用 Firebase Authentication。Firebase 專案 `class-1106` 已啟用 Google 提供者，Web app 設定放在 `firebase-config.js`。

## 在本機使用 Google 登入

1. 在專案目錄執行 `python -m http.server 8000`。
2. 開啟 `http://localhost:8000`，按右上角的「Google 登入」。
3. 若部署到其他網域，先在 Firebase Console 的 **Authentication → Settings → Authorized domains** 加入該網域；正式網站需使用 HTTPS。

Firebase Web app 設定會出現在前端，因此不是私密憑證。請勿放入 Firebase service account 私鑰；並在 Google Cloud/Firebase 限制 API key 可使用的網站網域。登入目前只負責驗證帳號，範例行程和目標尚未儲存或同步到雲端。
