var express = require("express");
var router = express.Router();

var walletController = require("../controllers/walletController.controller.js");

// GET: Fetch wallet by user ID
router.get("/:id", walletController.getWalletByUserId);

// POST: Credit money to user's wallet
router.post("/:id/credit", walletController.creditInWallet);

// POST: Debit money from user's wallet
router.post("/:id/debit", walletController.debitFromWallet);

module.exports = router;
