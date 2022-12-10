const { response } = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chatModel");
const user = require("../models/user");
var CryptoJS = require("crypto-js");
const chatController = {
  
  accessChat : async (req,res)=>{
    const { userId } = req.body;
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  },

    fetchChats : async (req,res)=>{
        try{
          Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            var map = results.map((item)=>{
              let useryour =  item.users[0].name == req.user.name ? item.users[1] : item.users[0]
              let message = item?.latestMessage
              let messDec="";
              let time =  message?.updatedAt;
              let timecv = time?.toLocaleString("en-US");
              if(message!=null){
                var bytes = CryptoJS.AES.decrypt(message.content, message.sender._id.toString());
                messDec = bytes.toString(CryptoJS.enc.Utf8);
              }
              return {
                id: item._id,
                idUser: useryour._id,
                userName: useryour.name,
                userImg: useryour.avatar,
                messageTime: timecv,
                messageText: messDec
              }
            })
            //res.status(200).send(results);
            res.status(200).send(map);
          });
        }catch(error){
          res.status(400);
          throw new Error(error.message);
        }
    },
    fetchoneChats : async (req,res)=>{
      const { friendId } = req.body;
      try{
        let exp = await Chat.find({ users: { $elemMatch: { $eq: req.user._id },
          $elemMatch: { $eq: friendId}
        }}) 
          res.json(exp);
      }catch(error){
        console.log(error)
      }
  },
    // createGroupChat  : async (req,res)=>{
    //   if (!req.body.users || !req.body.name) {
    //     return res.status(400).send({ message: "Please Fill all the feilds" });
    //   }
    
    //   var users = JSON.parse(req.body.users);
    
    //   if (users.length < 2) {
    //     return res
    //       .status(400)
    //       .send("More than 2 users are required to form a group chat");
    //   }
    
    //   users.push(req.user);
    
    //   try {
    //     const groupChat = await Chat.create({
    //       chatName: req.body.name,
    //       users: users,
    //       isGroupChat: true,
    //       groupAdmin: req.user,
    //     });
    
    //     const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    //       .populate("users", "-password")
    //       .populate("groupAdmin", "-password");
    
    //     res.status(200).json(fullGroupChat);
    //   } catch (error) {
    //     res.status(400);
    //     throw new Error(error.message);
    //   }
    // },
    // renameGroup : async (req,res)=>{
    //   const { chatId, chatName } = req.body;

    //   const updatedChat = await Chat.findByIdAndUpdate(
    //   chatId,
    //   {
    //     chatName: chatName,
    //   },
    //   {
    //     new: true,
    //   }
    // )
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password");

    // if (!updatedChat) {
    //   res.status(404);
    //   throw new Error("Chat Not Found");
    // } else {
    //   res.json(updatedChat);
    // }
    // },
    // addToGroup : async (req,res)=>{
    //   const { chatId, userId } = req.body;

    //    // check if the requester is admin

    //   const added = await Chat.findByIdAndUpdate(
    //   chatId,
    //   {
    //     $push: { users: userId },
    //   },
    //   {
    //     new: true,
    //   }
    //   )
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password");

    //   if (!added) {
    //     res.status(404);
    //     throw new Error("Chat Not Found");
    //   } else {
    //     res.json(added);
    //   }
    // },
    // removeFromGroup : async (req,res)=>{
    //   const { chatId, userId } = req.body;

    //   // check if the requester is admin

    //   const removed = await Chat.findByIdAndUpdate(
    //   chatId,
    //   {
    //     $pull: { users: userId },
    //   },
    //   {
    //     new: true,
    //   }
    //    )
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password");

    //   if (!removed) {
    //   res.status(404);
    //   throw new Error("Chat Not Found");
    //   } else {
    //   res.json(removed);
    //   }

    // }
}
module.exports = chatController;