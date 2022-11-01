const jwt =  require('jsonwebtoken');
const User = require("../models/user");
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const cloudinary = require('../helper/imageUpload')
const userController = {
    //ADD USER
    add_user: async(req,res)=>{
        const {name,email,password,phone} = req.body
        const isNewUser = await User.isThisEmailInUse(email);
        if (!isNewUser){
            return res.json({
                success: false,
                message: 'This email is already in use, try sign-in',
            });}
        else{
            const user = await User({
               name,
               email,
               password,
               phone,
            });
            await user.save();
            res.json(user);
        }
    },

    //SIGN IN
    userSignIn: async(req,res)=>{
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user){
        return res.json({
          success: false,
          message: 'user not found, with the given email!',
        });
      }    
      const isMatch = await user.comparePassword(password);
      if (!isMatch){
        return res.json({
          success: false,
          message: 'email / password does not match!',
        });
      }
      const token =  jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:'1y'});      
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar ? user.avatar : '',
      }
      res.json({success: true,user:userInfo, token})
  },
  
  userSignOut: async (req,res) =>{
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail!' });
      }
      const tokens = req.user.tokens;
      const newTokens = tokens.filter(t => t.token !== token);
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'Sign out successfully!' });
    }
  },
  // update
  updateProfileMain: async (req,res) => {
    const {user} = req;
    if(req.body.password!=null){
      bcrypt.hash(req.body.password, 8, async (err, hash) => {
        if (err) return next(err);
        req.body.password = hash;
        const { name, email, phone, password} = req.body;
        try {
          const exp = await User.findByIdAndUpdate(
            user._id,
            {
              name,
              email,
              phone,
              password,
            },
            { new: true, runValidators: true }
            )
            res.json({success: true, exp});
        } catch (error) {
          res.json(error)
        }
      }) 
    }else{
      const { name, email, phone, password} = req.body;
      try {
        const exp = await User.findByIdAndUpdate(
          user._id,
          {
            name,
            email,
            phone,
            password,
          },
          { new: true, runValidators: true }
          )
          res.json({success: true, exp});
      } catch (error) {
        res.json(error)
      }
    }
  }, 

  //UPLOAD PROFILE
    uploadProfile : async (req,res)=>{
      const {user} = req;
      if(!user) return res
          .status(401)
          .json({success:false, message: 'unauthorized acesss'
           })
      try {
        const result = await cloudinary.uploader.upload(req.file.path,{
          public_id: `${user._id}_profile`,
          width: 500,
          height:500,
          crop: 'fill'
        });
        const exp = await User.findByIdAndUpdate(user._id,{avatar: result.url})
        res.status(201).json({
          success: true,
          message: 'Your Profile has updateed',
          data : exp 
        })
  
      } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Server error,try after some time'
      })
         console.log('Eroor while uploading profile imge',error.message)
      }
    },

    //GET ALL AUTHORS
    getAllAuthors: async(req,res)=>{
       try{
           const authors = await User.find();
           res.status(200).json(authors);
       }catch(err){
           res.status(500).json(err);
       }
    },

    allUsers : async(req,res) =>{
      const keyword = req.query.search
        ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
          }
        : {};

      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
      res.send(users);
    }
}

module.exports = userController;