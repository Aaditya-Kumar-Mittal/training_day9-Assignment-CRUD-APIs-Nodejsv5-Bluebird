var fs = require("fs");
var path = require("path");

// Directory to start from
var baseDir = "E:/jugnoo_training/day9-assignment";
var outputFile = "file_list.txt";

var results = [];

// Recursive function to read directories and list files
function readDirRecursive(dirPath) {
  var entries = fs.readdirSync(dirPath);

  entries.forEach((entry) => {
    var fullPath = path.join(dirPath, entry);
    var stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readDirRecursive(fullPath); // Recurse into subdirectory
    } else {
      results.push(fullPath); // Save full path of file
    }
  });
}

// Execute the recursive file listing
readDirRecursive(baseDir);

// Write the results to file
fs.writeFileSync(outputFile, results.join("\n"), "utf8");

console.log(`✅ File list saved to '${outputFile}'`);
