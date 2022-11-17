const { response } = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel")
const messageController = {
    sendMessage  : async (req,res)=>{
      const { content, chatId } = req.body;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }

      var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
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
                
                return {
                  _id: item._id,
                  text: item.content,
                  createdAt: item.createdAt,
                  user: {
                    _id: idme,
                    name: item.sender.name,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
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