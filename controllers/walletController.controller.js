var dbController = require("./databaseController.controller.js");
var logger = require("../middlewares/logger.js");
var reqResponse = require("../utils/responseUtil.util.js");

exports.getWalletByUserId = function (req, res) {
  var userId = parseInt(req.params.id);

  if (isNaN(userId) || userId <= 0) {
    return reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid user ID",
      "User ID must be a positive number."
    );
  }

  dbController
    .query("SELECT * FROM users_wallet1 WHERE user_id = ?", [userId])
    .then(function (result) {
      if (result.length === 0) {
        return reqResponse.sendResponse(
          res,
          404,
          false,
          "Wallet not found",
          "No wallet exists for this user."
        );
      }

      reqResponse.sendResponse(
        res,
        200,
        true,
        "Wallet fetched successfully",
        "Balance details",
        result[0]
      );
    })
    .catch(function (err) {
      logger.logger("Failed to fetch wallet: " + err.message);
      reqResponse.sendResponse(res, 500, false, "Database error", err.message);
    });
};

exports.creditInWallet = function (req, res) {
  var userId = parseInt(req.params.id);
  var amount = parseFloat(req.body.amount);

  if (isNaN(userId)) {
    return reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid user ID",
      "Invalid user ID."
    );
  }

  if (isNaN(amount) || amount <= 0) {
    return reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid amount",
      "Amount must be a number greater than zero."
    );
  }

  dbController.getConnection().then(function (conn) {
    return conn
      .beginTransactionAsync()
      .then(function () {
        return conn.queryAsync(
          "SELECT balance FROM users_wallet1 WHERE user_id = ?",
          [userId]
        );
      })
      .then(function (result) {
        if (result.length === 0) {
          // Wallet does not exist, create to add amount
          return conn.queryAsync(
            "INSERT INTO users_wallet1 (user_id, balance) VALUES (?, ?)",
            [userId, amount]
          );
        } else {
          var currentBalance = parseFloat(result[0].balance);
          var newBalance = currentBalance + amount;
          return conn.queryAsync(
            "UPDATE users_wallet1 SET balance = ? WHERE user_id = ?",
            [newBalance, userId]
          );
        }
      })
      .then(function () {
        return conn.commitAsync().then(function () {
          logger.logger("Wallet credited successfully for user ID: " + userId);
          reqResponse.sendResponse(
            res,
            200,
            true,
            "Amount credited successfully",
            "Wallet updated."
          );
        });
      })
      .catch(function (err) {
        return conn.rollbackAsync().then(function () {
          logger.logger("Credit wallet failed: " + err.message);
          reqResponse.sendResponse(
            res,
            500,
            false,
            "Credit failed",
            err.message
          );
        });
      })
  });
};

exports.debitFromWallet = function (req, res) {
  var userId = parseInt(req.params.id);
  var amount = parseFloat(req.body.amount);

  if (isNaN(userId)) {
    return reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid user ID",
      "Invalid user ID."
    );
  }

  if (isNaN(amount) || amount <= 0) {
    return reqResponse.sendResponse(
      res,
      400,
      false,
      "Invalid amount",
      "Amount must be a number greater than zero."
    );
  }

  dbController.getConnection().then(function (conn) {
    return conn
      .beginTransactionAsync()
      .then(function () {
        return conn.queryAsync(
          "SELECT balance FROM users_wallet1 WHERE user_id = ?",
          [userId]
        );
      })
      .then(function (result) {
        if (result.length === 0) throw new Error("Wallet not found");

        var currentBalance = parseFloat(result[0].balance);
        if (currentBalance < amount) throw new Error("Insufficient funds");

        var newBalance = currentBalance - amount;
        return conn.queryAsync(
          "UPDATE users_wallet1 SET balance = ? WHERE user_id = ?",
          [newBalance, userId]
        );
      })
      .then(function () {
        return conn.commitAsync().then(function () {
          logger.logger("Wallet debited successfully for user ID: " + userId);
          reqResponse.sendResponse(
            res,
            200,
            true,
            "Amount debited successfully",
            "Wallet updated."
          );
        });
      })
      .catch(function (err) {
        return conn.rollbackAsync().then(function () {
          logger.logger("Debit wallet failed: " + err.message);
          reqResponse.sendResponse(
            res,
            500,
            false,
            "Debit failed",
            err.message
          );
        });
      })
  });
};
