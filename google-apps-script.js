/*
 * LedgerHouse — Google Apps Script Data Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 *    Name it "LedgerHouse Data"
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Click Deploy > New deployment
 * 5. Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Click Deploy, authorize, and copy the Web App URL
 * 7. Paste that URL into the LedgerHouse dashboard settings
 */

const SHEET_NAME = "data";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange("A1").setValue("{}");
  }

  const method = (e.parameter && e.parameter.action) || "get";

  if (method === "save") {
    const data = e.postData ? JSON.parse(e.postData.contents) : {};
    data._lastSync = new Date().toISOString();
    sheet.getRange("A1").setValue(JSON.stringify(data));
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok", ts: data._lastSync })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // GET — return stored data
  const raw = sheet.getRange("A1").getValue();
  let data = {};
  try { data = JSON.parse(raw); } catch(err) { data = {}; }
  return ContentService.createTextOutput(
    JSON.stringify(data)
  ).setMimeType(ContentService.MimeType.JSON);
}
