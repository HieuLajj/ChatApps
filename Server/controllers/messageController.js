const { response } = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel")
const cloudinary = require('../helper/imageUpload')
const messageController = {
    sendMessage  : async (req,res)=>{
      const {user} = req;
      const { content, chatId} = req.body;
      let result;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
      if(req?.file?.path){
        result = await cloudinary.uploader.upload(req.file.path,{
          public_id: `${user._id}_post${Date.now()}`,
          width: 500,
          height:500,
          crop: 'fill'
        });
      }

      var newMessage = {
        sender: user._id,
        content: content,
        chat: chatId,
        image: result ? result.url: ''
      };

      try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
            select: "name pic email",
          });
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
      } catch (error) {
        res.status(400);
        console.log(error);
      }
    },
    allMessages : async (req,res)=>{
        try {
            const messages = await Message.find({ chat: req.params.chatId })
              .populate("sender", "name pic email")
              .populate("chat");
            var messagescv = messages.map((item)=>{
                let idme =  req.user._id.toString() == item.sender._id.toString() ? 1 : 0;
                //console.log(item+"okae");
                
                return {
                  _id: item._id,
                  text: item.content,
                  createdAt: item.createdAt,
                  user: {
                    _id: idme,
                    name: item.sender.name,
                    avatar: req.user.avatar ? req.user.avatar : 'https://placeimg.com/140/140/any',
                  },
                  image: item?.image
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