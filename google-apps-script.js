// ============================================
//  慈燈講師壇主夏季精進班 — Google Apps Script
//  請將此程式碼貼到 Google Apps Script 編輯器中
// ============================================

// 管理後台密碼。請自行改成一組不容易猜到的文字。
// admin.html 讀取、刪除、清空資料時會要求輸入同一組 token。
var ADMIN_TOKEN = '請改成自己的管理密碼';

var HEADERS = [
  '報名時間', '姓名', '性別', '電話', '天職',
  '居住地', '接近道場/佛堂', '回來時間',
  '住宿安排', '高鐵接送', '同行家人人數', '備註'
];

function doPost(e) {
  try {
    var params = getRequestData_(e);
    var action = params.action || 'register';

    if (action === 'register') {
      return json_(register_(params));
    }

    requireAdmin_(params.token);

    if (action === 'delete') {
      return json_(deleteRow_(Number(params.id)));
    }

    if (action === 'clear') {
      return json_(clearRows_());
    }

    return json_({ status: 'error', message: '未知的操作' });
  } catch (error) {
    return json_({ status: 'error', message: error.toString() });
  }
}

function doGet(e) {
  try {
    var params = e.parameter || {};
    var action = params.action || 'list';
    requireAdmin_(params.token);

    if (action === 'list') {
      return jsonp_(params.callback, {
        status: 'success',
        registrations: getRegistrations_()
      });
    }

    if (action === 'delete') {
      return jsonp_(params.callback, deleteRow_(Number(params.id)));
    }

    if (action === 'clear') {
      return jsonp_(params.callback, clearRows_());
    }

    return jsonp_(params.callback, { status: 'error', message: '未知的操作' });
  } catch (error) {
    return jsonp_(e.parameter && e.parameter.callback, {
      status: 'error',
      message: error.toString()
    });
  }
}

function register_(data) {
  var sheet = getSheet_();
  ensureHeader_(sheet);

  var timestamp = Utilities.formatDate(
    new Date(),
    'Asia/Taipei',
    'yyyy/MM/dd HH:mm:ss'
  );

  sheet.appendRow([
    timestamp,
    data.name || '',
    data.gender || '',
    data.phone || '',
    data.role || '',
    data.location || '',
    data.nearbyTemple || '',
    data.arrivalTime || '',
    data.accommodation || '',
    data.hsrPickup || '',
    data.familyCompanions || '',
    data.notes || ''
  ]);

  return { status: 'success', message: '報名成功' };
}

function getRegistrations_() {
  var sheet = getSheet_();
  ensureHeader_(sheet);
  var data = sheet.getDataRange().getDisplayValues();
  var registrations = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i].join('') === '') continue;
    registrations.push({
      id: i + 1,
      timestamp: data[i][0] || '',
      name: data[i][1] || '',
      gender: data[i][2] || '',
      phone: data[i][3] || '',
      role: data[i][4] || '',
      location: data[i][5] || '',
      nearbyTemple: data[i][6] || '',
      arrivalTime: data[i][7] || '',
      accommodation: data[i][8] || '',
      hsrPickup: data[i][9] || '',
      familyCompanions: data[i][10] || '',
      notes: data[i][11] || ''
    });
  }

  return registrations.reverse();
}

function deleteRow_(rowId) {
  var sheet = getSheet_();
  if (!rowId || rowId <= 1 || rowId > sheet.getLastRow()) {
    throw new Error('找不到要刪除的資料');
  }
  sheet.deleteRow(rowId);
  return { status: 'success', message: '已刪除' };
}

function clearRows_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  return { status: 'success', message: '已清空' };
}

function getRequestData_(e) {
  var params = {};
  Object.keys(e.parameter || {}).forEach(function(key) {
    params[key] = e.parameter[key];
  });

  if (e.postData && e.postData.contents && e.postData.type === 'application/json') {
    var body = JSON.parse(e.postData.contents);
    Object.keys(body).forEach(function(key) {
      params[key] = body[key];
    });
  }

  return params;
}

function requireAdmin_(token) {
  if (!ADMIN_TOKEN || ADMIN_TOKEN === '請改成自己的管理密碼') {
    throw new Error('請先設定 Apps Script 裡的 ADMIN_TOKEN');
  }
  if (token !== ADMIN_TOKEN) {
    throw new Error('管理密碼不正確');
  }
}

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function ensureHeader_(sheet) {
  var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (firstRow[0] === HEADERS[0]) return;
  initSheet();
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, payload) {
  var safeCallback = String(callback || 'cidengCallback').replace(/[^\w.$]/g, '');
  return ContentService
    .createTextOutput(safeCallback + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// 初始化標題列（第一次使用時可手動執行一次）
function initSheet() {
  var sheet = getSheet_();
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a2744');
  headerRange.setFontColor('#f0d878');
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 60);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 150);
  sheet.setColumnWidth(8, 200);
  sheet.setColumnWidth(9, 80);
  sheet.setColumnWidth(10, 80);
  sheet.setColumnWidth(11, 160);
  sheet.setColumnWidth(12, 200);
}
