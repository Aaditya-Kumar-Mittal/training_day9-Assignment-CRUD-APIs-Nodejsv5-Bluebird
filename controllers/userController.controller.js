// var db = require("../config/database.config.js");

var dbController = require("./databaseController.controller.js");

var logger = require("../middlewares/logger.js");

var reqResponse = require("../utils/responseUtil.util.js");

// GET API
exports.getUsers = function (req, res) {
  dbController
    .query("SELECT * FROM users WHERE isActive = ?", [1])
    .then(function (results) {
      logger.logger("Fetched users successfully");

      reqResponse.sendResponse(
        res,
        200,
        true,
        "Users fetched successfully",
        "The resource has been fetched and transmitted in the message body.",
        results
      );
    })
    .catch(function (error) {
      logger.logger("Error fetching users: " + error);

      // 500 Internal Server Error Response
      /*
      res.status(500).json({
        success: false,
        status: "error",
        message: "Failed to fetch users",
        statusMessage:
          "The server encountered an internal error and was unable to complete your request.",
      });
      */

      reqResponse.sendResponse(
        res,
        500,
        false,
        "Failed to fetch users",
        "The resource has been fetched and transmitted in the message body."
      );
    });
};

exports.getUserById = function (req, res) {
  // Extracting user id from URL
  var userId = req.params.id;

  if (isNaN(userId)) {
    logger.logger(
      "Fetching user failed for ID (Invalid ID, must be a number): " + userId
    );

    /*
    res.status(400).json({
      success: false,
      status: "Bad Request",
      message: "Invalid user ID",
      statusMessage:
        "The request could not be understood by the server due to malformed syntax.",
    });
    */

    reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid user ID",
      "The request could not be understood by the server due to malformed syntax."
    );
  }

  dbController
    .query("SELECT * FROM users WHERE id = ? AND isActive = ?", [userId, 1])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found
        /*
        res.status(400).json({
          success: false,
          status: "Not Found",
          message: "User not found",
          statusMessage:
            "The requested resource could not be found but may be available in the future.",
        });
        */

        reqResponse.sendResponse(
          res,
          400,
          false,
          "User not found",
          "The requested resource could not be found but may be available in the future."
        );
      } else {
        logger.logger("Fetched user successfully");

        // 200 OK Response
        /*
        res.status(200).json({
          success: true,
          data: result[0],
          message: "User fetched successfully",
          statusMessage:
            "The resource has been fetched and transmitted in the message body.",
        });
        */

        reqResponse.sendResponse(
          res,
          200,
          true,
          "User fetched successfully",
          "The resource has been fetched and transmitted in the message body.",
          result[0]
        );
      }
    })
    .catch(function (error) {
      // Yahan par Unhandled rejection Error: Can't set headers after they are sent. yeh wala error aaya tha
      // I was resending the response header when it was already sent

      if (!res.headersSent) {
        logger.logger("Error fetching users: " + error);

        // 500 Internal Server Error Response
        /*
        res.status(500).json({
          success: false,
          status: "error",
          message: "Failed to fetch users",
          statusMessage:
            "The server encountered an internal error and was unable to complete your request." +
            error,
        });
        */

        reqResponse.sendResponse(
          res,
          500,
          false,
          "Failed to fetch users",
          "The server encountered an internal error and was unable to complete your request.",
          error
        );
      }
    });
};

exports.createUser = function (req, res) {
  var data = req.body;

  if (!data.name || !data.email) {
    logger.logger("User creation failed (Invalid data)");

    reqResponse.sendResponse(
      res,
      404,
      false,
      "Invalid data",
      "The request could not be performed as the data is invalid."
    );
  } else {
    dbController
      .query("INSERT INTO users(name, email) VALUES (?, ?)", [
        data.name,
        data.email,
      ])
      .then(function (result) {
        logger.logger("User created successfully");

        // 201 Created Response
        /*
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
        */

        reqResponse.sendResponse(
          res,
          201,
          true,
          "User created successfully",
          "The request has been fulfilled and has resulted in one or more new resources being created.",
          {
            id: result.insertId,
            name: data.name,
            email: data.email,
          }
        );
      })
      .catch(function (error) {
        logger.logger("Error creating user: " + error);

        // 500 Internal Server Error Response
        /*
        res.status(500).json({
          success: false,
          status: "error",
          message: "Failed to create user",
          statusMessage:
            "The server encountered an internal error and was unable to complete your request.",
        });
        */

        reqResponse.sendResponse(
          res,
          500,
          false,
          "Failed to create user",
          "The server encountered an internal error and was unable to complete your request."
        );
      });
  }
};

exports.updateUser = function (req, res) {
  var userId = parseInt(req.params.id);
  var data = req.body;

  // Common test cases
  // No data is given to update
  // Invalid user ID, or user does not exist

  if (isNaN(userId)) {
    logger.logger("User update failed (Invalid user ID)");

    reqResponse.sendResponse(
      res,
      404,
      false,
      "Invalid user ID",
      "The request could not be performed as the user ID is invalid."
    );
  }

  if (!data.name || !data.email) {
    logger.logger("User update failed (Invalid data)");

    reqResponse.sendResponse(
      res,
      404,
      false,
      "Invalid data",
      "The request could not be performed as the data is invalid."
    );
  }

  dbController
    .query("SELECT * FROM users WHERE id = ? AND isActive = ?", [userId, 1])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found Response
        logger.logger("Error updating user: User not found");
        reqResponse.sendResponse(
          res,
          404,
          false,
          "User not found",
          "The requested user does not exist."
        );
      }

      return dbController.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [data.name, data.email, userId]
      );
    })
    .then(function (result) {
      logger.logger("User updated successfully");

      // 200 OK Response
      reqResponse.sendResponse(
        res,
        200,
        true,
        "User updated successfully",
        "The request has been fulfilled and has resulted in one or more existing resources being modified.",
        {
          id: userId,
          name: data.name,
          email: data.email,
        }
      );
    })
    .catch(function (error) {
      // Got  Unhandled rejection Error: Can't set headers after they are sent.
      // Means once the user was found, res header was already sent but i was trying to send it again

      if (!res.headersSent) {
        logger.logger("Error updating user: " + error.message);

        // 500 Internal Server Error Response
        return reqResponse.sendResponse(
          res,
          500,
          false,
          "Failed to update user",
          "The server encountered an internal error: " + error.message
        );
      }
    });
};

exports.deleteUser = function (req, res) {
  var userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    logger.logger("User update failed (Invalid user ID)");

    reqResponse.sendResponse(
      res,
      404,
      false,
      "Invalid user ID",
      "The request could not be performed as the user ID is invalid."
    );
  }

  dbController
    .query("SELECT * FROM users WHERE id = ? AND isActive = ?", [userId, 1])
    .then(function (result) {
      if (result.length === 0) {
        // 404 Not Found Response
        logger.logger("Error updating user: User not found");
        reqResponse.sendResponse(
          res,
          404,
          false,
          "User not found",
          "The requested user does not exist."
        );
      }

      return dbController
        .query("UPDATE users SET isActive = 0 WHERE id = ? AND isActive = 1", [userId])
        .then(function (result) {
          logger.logger("User deleted successfully");

          // 200 OK Response
          reqResponse.sendResponse(
            res,
            200,
            true,
            "User deleted successfully",
            "The request has been fulfilled and has resulted in one or more existing resources being modified.",
            {
              id: userId,
            }
          );
        });
    })
    .catch(function (error) {
      if (!res.headersSent) {
        logger.logger("Error deleting user: " + error);

        // 500 Internal Server Error Response
        reqResponse.sendResponse(
          res,
          500,
          false,
          "Failed to delete user",
          "The server encountered an internal error: " + error.message
        );
      }
    });
};
