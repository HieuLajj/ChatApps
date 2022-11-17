const router = require("express").Router();
const postController= require("../controllers/postController");
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
  
{imgPost: 'image'}
router.post('/addPost',isAuth, uploads.single('imgPost'),postController.addPost);

router.get('/allPost', isAuth, postController.allPost);
module.exports = router;                                                                     