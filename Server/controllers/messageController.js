const { response } = require("express");
var CryptoJS = require("crypto-js");
const mongoose = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel")
const cloudinary = require('../helper/imageUpload')
const messageController = {
    sendMessage  : async (req,res)=>{
      const {user} = req;
      const { content, chatId} = req.body;
      let resultImg;
      let resultVideo;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
      console.log(req.files);
      try{
      if(req?.files?.imgChat){
        resultImg = await cloudinary.uploader.upload(req.files.imgChat[0].path,{
          public_id: `${user._id}_post${Date.now()}`,
          width: 500,
          height:500,
          crop: 'fill'
        });
      }
      if(req?.files?.imgVideo){
        resultVideo = await cloudinary.uploader.upload(req.files.imgVideo[0].path,{
          public_id: `${user._id}video_post${Date.now()}`,
          resource_type:"video",
        });
      }
      var DecryptContent = CryptoJS.AES.encrypt(content, user._id.toString()).toString();
      var newMessage = {
        sender: user._id,
        content: DecryptContent,
        chat: chatId,
        image: resultImg ? resultImg.url: '',
        video: resultVideo ? resultVideo.url: '',
      };
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
      path: "chat.users",
        select: "name pic email",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.json(message);
    }catch(error){
      console.log(error);
    }


      // var DecryptContent = CryptoJS.AES.encrypt(content, user._id.toString()).toString();

      // var newMessage = {
      //   sender: user._id,
      //   content: DecryptContent,
      //   chat: chatId,
      //   image: result ? result.url: ''
      // };

      // try {
      //   var message = await Message.create(newMessage);
      //   message = await message.populate("sender", "name pic");
      //   message = await message.populate("chat");
      //   message = await User.populate(message, {
      //     path: "chat.users",
      //       select: "name pic email",
      //     });
      //   await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      //   res.json(message);
      // } catch (error) {
      //   res.status(400);
      //   console.log(error);
      // }
    },
    allMessages : async (req,res)=>{
        try {
            const messages = await Message.find({ chat: req.params.chatId })
              .populate("sender", "name pic email")
              .populate("chat");
            var messagescv = messages.map((item)=>{
                let idme =  req.user._id.toString() == item.sender._id.toString() ? 1 : 0;
                //console.log(item+"okae");
                var bytes  = CryptoJS.AES.decrypt(item.content, item.sender._id.toString());
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                return {
                  _id: item._id,
                  text: originalText,
                  createdAt: item.createdAt,
                  user: {
                    _id: idme,
                    name: item.sender.name,
                    avatar: req.user.avatar ? req.user.avatar : 'https://placeimg.com/140/140/any',
                  },
                  image: item?.image,
                  video: item?.video,
              }
            })
            res.json(messagescv.reverse());
          } catch (error) {
            res.status(400);
            console.log(error);
        }
    },

}
module.exports = messageController;