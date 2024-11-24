function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('User Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function loginUser(payload) {
  var username = payload.username;
  var password = payload.password;
  var loginSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOGIN");
  var userData = loginSheet.getRange("A:B").getValues();
  
  for (var i = 0; i < userData.length; i++) {
    if (userData[i][0] === username && userData[i][1] === password) {
      return {
        status: "success",
        data: getUserDashboardInfo(username)
      };
    }
  }
  
  return {
    status: "error",
    message: "Invalid username or password."
  };
}

function getUserDashboardInfo(username) {
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("REPORT");
  var reportData = reportSheet.getRange("A:F").getValues();
  
  var userEntries = {
    "Class": [],
    "Report": [],
    "Speaking": [],
    "Reading": []
  };
  
  reportData.forEach(function(row) {
    if (row[0] === username) {
      userEntries["Class"].push(row[1]);
      userEntries["Report"].push(row[2]);
      userEntries["Speaking"].push(row[4]);
      userEntries["Reading"].push(row[5]);
    }
  });
  
  return userEntries;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result = loginUser(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Invalid request format."
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
