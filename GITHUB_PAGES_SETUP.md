# GitHub Pages + Google Sheets 設定步驟

## 一、Google Sheets 後端

1. 到 Google Drive 建立一份新的 Google 試算表。
2. 開啟試算表後，點選「擴充功能」->「Apps Script」。
3. 刪掉預設內容，貼上本資料夾的 `google-apps-script.js`。
4. 將最上方這行改成你的管理密碼：

```js
var ADMIN_TOKEN = '請改成自己的管理密碼';
```

5. 儲存後，先執行 `initSheet`，並依畫面完成授權。
6. 點「部署」->「新增部署作業」。
7. 類型選「網頁應用程式」。
8. 「執行身分」選「我」。
9. 「誰可以存取」選「任何人」。
10. 部署完成後，複製「網頁應用程式網址」。
11. 回到 `config.js`，貼上網址：

```js
window.CIDENG_CONFIG = {
  GOOGLE_SCRIPT_URL: '貼上你的 Web App URL',
  ADMIN_TOKEN_STORAGE_KEY: 'cideng_admin_token'
};
```

## 二、GitHub Pages 上線

如果你用 GitHub 網頁操作：

1. 登入 GitHub。
2. 建立新的 repository，例如 `cideng-event`。
3. 上傳本資料夾內所有檔案。
4. 進入 repository 的 `Settings`。
5. 點左側 `Pages`。
6. `Build and deployment` 的 Source 選 `Deploy from a branch`。
7. Branch 選 `main`，資料夾選 `/root`。
8. 儲存後等待 1 到 3 分鐘。

完成後網址會像這樣：

```text
https://你的帳號.github.io/cideng-event/
```

後台網址：

```text
https://你的帳號.github.io/cideng-event/admin.html
```

## 三、測試

1. 打開公開報名頁，填一筆測試資料。
2. 到 Google Sheets 確認資料有新增。
3. 打開 `admin.html`。
4. 輸入 `ADMIN_TOKEN` 設定的管理密碼。
5. 確認後台可以看到同一筆資料。
