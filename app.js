var express = require("express");

var bodyParser = require("body-parser");

var app = express();

var port = 5000;

// Import Datbase connection
var db = require("./controllers/databaseController.controller.js");

db.connectAsync();

// Import my routes
var userRoutes = require("./routes/userRoutes.routes.js");
var walletRoutes = require("./routes/walletRoutes.routes.js");

app.use(bodyParser.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wallets", walletRoutes);

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
