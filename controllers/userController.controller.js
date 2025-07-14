var db = require("../config/database.config.js");

var logger = require("../middlewares/logger.js");

// GET API
exports.getUsers = function (req, res) {
  db.queryAsync("SELECT * FROM users")
    .then(function (results) {
      logger.logger("Fetched users successfully");

      // 200 OK Resopnse

      res.status(200).json({
        success: true,
        data: results,
        message: "Users fetched successfully",
        statusMessage:
          "The resource has been fetched and transmitted in the message body.",
      });
    })
    .catch(function (error) {
      logger.logger("Error fetching users: " + error);

      // 500 Internal Server Error Response
      res.status(500).json({
        success: false,
        status: "error",
        message: "Failed to fetch users",
        statusMessage:
          "The server encountered an internal error and was unable to complete your request.",
      });
    });
};

exports.getUserById = function (req, res) {
  var userId = req.params.id;

  if (isNaN(userId)) {
    logger.logger(
      "Fetching user failed for ID (Invalid ID, must be a number): " + userId
    );

    res.status(400).json({
      success: false,
      status: "Bad Request",
      message: "Invalid user ID",
      statusMessage:
        "The request could not be understood by the server due to malformed syntax.",
    });
  }

  db.queryAsync("SELECT * FROM users WHERE id = ?", [userId])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found

        res.status(400).json({
          success: false,
          status: "Not Found",
          message: "User not found",
          statusMessage:
            "The requested resource could not be found but may be available in the future.",
        });
      } else {
        logger.logger("Fetched user successfully");

        // 200 OK Response
        res.status(200).json({
          success: true,
          data: result[0],
          message: "User fetched successfully",
          statusMessage:
            "The resource has been fetched and transmitted in the message body.",
        });
      }
    })
    .catch(function (error) {
      // Yahan par Unhandled rejection Error: Can't set headers after they are sent. yeh wala error aaya tha
      // I was resending the response header when it was already sent

      if (!res.headersSent) {
        logger.logger("Error fetching users: " + error);

        // 500 Internal Server Error Response
        res.status(500).json({
          success: false,
          status: "error",
          message: "Failed to fetch users",
          statusMessage:
            "The server encountered an internal error and was unable to complete your request." +
            error,
        });
      }
    });
};

exports.createUser = function (req, res) {
  var data = req.body;

  db.queryAsync("INSERT INTO users(name, email) VALUES (?, ?)", [
    data.name,
    data.email,
  ])
    .then(function (result) {
      logger.logger("User created successfully");

      // 201 Created Response
      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          name: data.name,
          email: data.email,
        },
        message: "User created successfully",
        statusMessage:
          "The request has been fulfilled and has resulted in one or more new resources being created.",
      });
    })
    .catch(function (error) {
      logger.logger("Error creating user: " + error);

      // 500 Internal Server Error Response
      res.status(500).json({
        success: false,
        status: "error",
        message: "Failed to create user",
        statusMessage:
          "The server encountered an internal error and was unable to complete your request.",
      });
    });
};

exports.updateUser = function (req, res) {
  var userId = req.params.id;
  var data = req.body;

  db.queryAsync("SELECT * FROM users WHERE id = ?", [userId])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found Response
        logger.logger("Error updating user: User not found");
        res.status(404).json({
          success: false,
          status: "Not Found",
          message: "User not found",
          statusMessage:
            "The requested resource could not be found but may be available in the future.",
        });

        // Stop further execution by throwing
        throw new Error("User not found");
      }

      // User exists, proceed to update
      return db.queryAsync(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [data.name, data.email, userId]
      );
    })
    .then(function (result) {
      logger.logger("User updated successfully");

      // 200 OK Response
      res.status(200).json({
        success: true,
        data: {
          id: userId,
          name: data.name,
          email: data.email,
        },
        message: "User updated successfully",
        statusMessage:
          "The request has been fulfilled and has resulted in one or more existing resources being modified.",
      });
    })
    .catch(function (error) {
      // Got  Unhandled rejection Error: Can't set headers after they are sent.
      // Means once the user was found, res header was already sent but i was trying to send it again

      if (!res.headersSent) {
        logger.logger("Error updating user: " + error.message);

        // 500 Internal Server Error Response
        res.status(500).json({
          success: false,
          status: "error",
          message: "Failed to update user",
          statusMessage:
            "The server encountered an internal error and was unable to complete your request.",
        });
      }
    });
};

exports.deleteUser = function (req, res) {
  var userId = req.params.id;

  db.queryAsync("SELECT * FROM users WHERE id = ?", [userId])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found Response
        logger.logger("Error deleting user: User not found");
        res.status(404).json({
          success: false,
          status: "Not Found",
          message: "User not found",
          statusMessage:
            "The requested resource could not be found but may be available in the future.",
        });

        // Stop further execution by throwing
        throw new Error("User not found");
      }

      return db
        .queryAsync("DELETE FROM users WHERE id = ?", [userId])
        .then(function (result) {
          logger.logger("User deleted successfully");

          // 200 OK Response
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
            statusMessage:
              "The request has been fulfilled and has resulted in the deletion of one or more resources.",
          });
        });
    })
    .catch(function (error) {
      if (!res.headersSent) {
        logger.logger("Error deleting user: " + error);

        // 500 Internal Server Error Response
        res.status(500).json({
          success: false,
          status: "error",
          message: "Failed to delete user",
          statusMessage:
            "The server encountered an internal error and was unable to complete your request.",
        });
      }
    });
};
