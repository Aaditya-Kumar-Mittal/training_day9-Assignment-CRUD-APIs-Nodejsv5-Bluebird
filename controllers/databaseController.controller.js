var db = require("../config/database.config.js");
var Bluebird = require("bluebird");

var dbController = {
  query: function (sql, params) {
    if (!sql) {
      return Bluebird.reject(new Error("SQL query is required"));
    }
    if (!params) {
      params = [];
    }
    return db.queryAsync(sql, params);
  },

  connectAsync: function () {
    return db
      .getConnectionAsync()
      .then(function () {
        console.log("Database connected successfully!");
      })
      .catch(function (error) {
        console.log("Error connecting to database: " + error);
      });
  },
};

module.exports = dbController;
