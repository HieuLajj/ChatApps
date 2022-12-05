const express = require("express");
const router = require("express").Router();
const chatController= require("../controllers/chatController");
const messageController = require("../controllers/messageController")
const { isAuth } = require("../middlewares/validations/auth");
const { validateUserSignUp, userVlidation, validateUserSignIn } = require("../middlewares/validations/user");
const multer = require('multer');
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
};

const uploads = multer({ storage, fileFilter });
{imgChat: 'image'}
router.post("/sendMessage",isAuth, uploads.single('imgChat'), messageController.sendMessage);
router.get("/allMessage/:chatId",isAuth, messageController.allMessages);
// router.post("/createGroupChat",isAuth, chatController.createGroupChat);

module.exports = router;