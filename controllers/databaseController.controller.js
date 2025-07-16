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

  // one time connectivity check
  connectAsync: function () {
    return db
      .getConnectionAsync()
      .then(function (conn) {
        console.log("Database connected successfully!");
        // It grabs a connection from the pool and holds onto it forever, reducing your available pool size by 1 every time it's called.

        // Must release the connection back to the pool when you're done with it.
        conn.release();
      })
      .catch(function (error) {
        console.log("Error connecting to database: " + error);
      });
  },

  getConnection: function () {
    return db.getConnectionAsync().then(function (connection) {
      Bluebird.promisifyAll(connection);
      return connection;
    });
  },
};

module.exports = dbController;
