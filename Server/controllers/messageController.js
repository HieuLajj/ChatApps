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
      let resultImg, deresultImg;
      let resultVideo, deresultVideo;
      let resultAudio, deresultAudio;
      let resultRaw;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
      try{
      if(req?.files?.imgChat){
        resultImg = await cloudinary.uploader.upload(req.files.imgChat[0].path,{
          public_id: `${user._id}_post${Date.now()}`,
          width: 500,
          height:500,
          crop: 'fill'
        });
        deresultImg = CryptoJS.AES.encrypt( resultImg.url, user._id.toString()).toString();
      }
      if(req?.files?.imgVideo){
        resultVideo = await cloudinary.uploader.upload(req.files.imgVideo[0].path,{
          public_id: `${user._id}video_post${Date.now()}`,
          resource_type:"video",
        });
        deresultVideo = CryptoJS.AES.encrypt( resultVideo.url, user._id.toString()).toString();
      }
      if(req?.files?.imgAudio){
        resultAudio = await cloudinary.uploader.upload(req.files.imgAudio[0].path,{
          public_id: `${user._id}audio_post${Date.now()}`,
          resource_type:"video",
        });
        deresultAudio = CryptoJS.AES.encrypt( resultAudio.url, user._id.toString()).toString();
        //console.log(JSON.stringify(req.files.imgAudio[0])+"ok");
      }
      console.log("fhaeh"+req?.files?.imgRaw)
      if(req?.files?.imgRaw){
        resultRaw = await cloudinary.uploader.upload(req.files.imgRaw[0].path,{
          public_id: `${user._id}raw_post${Date.now()}.pdf`,
          resource_type:"raw",
          // raw_convert: "aspose"
        });
        // console.log(JSON.stringify(req.files.imgRaw[0])+"okko");
        // console.log("--------------------------------")
      }
      var DecryptContent = CryptoJS.AES.encrypt(content, user._id.toString()).toString();
      var newMessage = {
        sender: user._id,
        content: DecryptContent,
        chat: chatId,
        image: resultImg ? deresultImg: '',
        video: resultVideo ? deresultVideo: '',
        audio: resultAudio ? deresultAudio.url: '',
        pdf: resultRaw? resultRaw.url: ''
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
            var Imgbytes,originalImg, Audiobytes, originalAudio, Videobytes, originalVideo;
            const messages = await Message.find({ chat: req.params.chatId })
              .populate("sender", "name pic email")
              .populate("chat");
            var messagescv = messages.map((item)=>{
                let idme =  req.user._id.toString() == item.sender._id.toString() ? 1 : 0;
                //console.log(item+"okae");
                var bytes  = CryptoJS.AES.decrypt(item.content, item.sender._id.toString());
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                if(item?.image!=""){
                  Imgbytes  = CryptoJS.AES.decrypt(item.image, item.sender._id.toString());
                  originalImg = Imgbytes.toString(CryptoJS.enc.Utf8);
                }
                if(item?.video!=""){
                  Videobytes  = CryptoJS.AES.decrypt(item.video, item.sender._id.toString());
                  originalVideo= Videobytes.toString(CryptoJS.enc.Utf8);
                }
                if(item?.audio!=""){
                  Audiobytes  = CryptoJS.AES.decrypt(item.audio, item.sender._id.toString());
                  originalAudio = Audiobytes.toString(CryptoJS.enc.Utf8);
                }
                return {
                  _id: item._id,
                  text: originalText,
                  createdAt: item.createdAt,
                  user: {
                    _id: idme,
                    name: item.sender.name,
                    avatar: req.user.avatar ? req.user.avatar : 'https://placeimg.com/140/140/any',
                  },
                  image: originalImg,
                  video: originalVideo,
                  audio: originalAudio
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