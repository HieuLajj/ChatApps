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
const uploads = multer({storage});

// const uploads = multer({ storage, fileFilter });

// const fileFilter2 = (req, file, cb) => {
//   if (file.mimetype.startsWith('video')) {
//     cb(null, true);
//   } else {
//     cb('invalid image file!', false);
//   }
// };

// const uploads2 = multer({ storage, fileFilter2 });
{imgChat: 'image'}{imgVideo : 'video'}{imgAudio : 'video'}{imgRaw: 'raw'}
// router.post("/sendMessage",isAuth, uploads.single('imgChat'), messageController.sendMessage);
router.post('/sendMessage',isAuth, uploads.fields([
  { name: 'imgChat'},
  { name: 'imgVideo'},
  { name: 'imgAudio'},
  {name: 'imgRaw'}
]), messageController.sendMessage)
router.get("/allMessage/:chatId",isAuth, messageController.allMessages);
// router.post("/createGroupChat",isAuth, chatController.createGroupChat);

module.exports = router;