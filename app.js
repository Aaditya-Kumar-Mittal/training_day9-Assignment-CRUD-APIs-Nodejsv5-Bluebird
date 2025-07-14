var express = require("express");

var bodyParser = require("body-parser");

var app = express();

var port = 5000;

// Import Datbase connection
var db = require("./config/database.config.js");

// Import my routes
var userRoutes = require("./routes/userRoutes.routes.js");

app.use(bodyParser.json());

app.use("/api/v1/users", userRoutes);

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
