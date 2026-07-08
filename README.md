# 慈燈講師壇主夏季精進班報名網站

這個網站使用 GitHub Pages 免費上線，並使用 Google Sheets + Google Apps Script 免費收集報名資料。

## 檔案

- `index.html`：公開報名頁
- `admin.html`：報名管理後台
- `style.css`：網站樣式
- `script.js`：報名送出程式
- `config.js`：Google Apps Script Web App 網址設定
- `google-apps-script.js`：貼到 Google Apps Script 的後端程式

## 上線前設定

1. 建立 Google 試算表。
2. 在試算表中開啟「擴充功能」->「Apps Script」。
3. 貼上 `google-apps-script.js`。
4. 把 `ADMIN_TOKEN` 改成自己的管理密碼。
5. 執行一次 `initSheet`。
6. 部署成「網頁應用程式」。
7. 複製 Web App URL，貼到 `config.js` 的 `GOOGLE_SCRIPT_URL`。
8. 把整個資料夾推到 GitHub，並開啟 GitHub Pages。

## 網址

- 報名頁：`https://你的帳號.github.io/你的repo名稱/`
- 後台：`https://你的帳號.github.io/你的repo名稱/admin.html`
