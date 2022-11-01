const express = require("express");
const router = require("express").Router();
const chatController= require("../controllers/chatController");
const messageController = require("../controllers/messageController")
const { isAuth } = require("../middlewares/validations/auth");
const { validateUserSignUp, userVlidation, validateUserSignIn } = require("../middlewares/validations/user");

router.post("/sendMessage",isAuth, messageController.sendMessage);
router.get("/allMessage/:chatId",isAuth, messageController.allMessages);
// router.post("/createGroupChat",isAuth, chatController.createGroupChat);

module.exports = router;