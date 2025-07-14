var fs = require("fs");
var path = require("path");

var logDir = path.join(__dirname, "../logs"); 
var logFilePath = path.join(logDir, "server.log"); 

// Bhai check kar agar directory hain ki nahi
// Resolves no directory error
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function logger(message) {
  var timeStamp = new Date().toISOString();
  var logMessage = `${timeStamp} - ${message}\n`;

  fs.appendFile(logFilePath, logMessage, function (err) {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

module.exports = {
  logger: logger
};
