var express = require("express");

var userController = require("../controllers/userController.controller.js");

var router = express.Router();

// Define routes
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.put("/:id/deactivate", userController.deleteUser);
router.put("/:id/recover", userController.recoverUser);

module.exports = router;
