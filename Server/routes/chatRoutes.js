const router = require("express").Router();
const chatController= require("../controllers/chatController");
const { isAuth } = require("../middlewares/validations/auth");
const { validateUserSignUp, userVlidation, validateUserSignIn } = require("../middlewares/validations/user");

router.post("/accessChat",isAuth, chatController.accessChat);
router.get("/fetchChats",isAuth, chatController.fetchChats);
// router.post("/createGroupChat",isAuth, chatController.createGroupChat);
// router.put("/renameGroup", isAuth, chatController.renameGroup);
// router.put("/addToGroup",isAuth,chatController.addToGroup);
// router.put("/removeFromGroup",isAuth,chatController.removeFromGroup);

module.exports = router;