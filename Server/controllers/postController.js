const { response } = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chatModel");
const user = require("../models/user");
const Post  = require("../models/Post")
const cloudinary = require('../helper/imageUpload')
const chatController = {
    addPost : async (req,res)=>{
        console.log("add post +++++")
        const {user} = req;
        let {post} = req.body
        try {
            const result = await cloudinary.uploader.upload(req.file.path,{
                public_id: `${user._id}_post${Date.now()}`,
                width: 500,
                height:500,
                crop: 'fill'
              });
            const exp = await Post({
                userId: user._id,
                post,
                postImg : result.url
            })
            await exp.save();
            res.status(201).json({
                success: true,
                message: 'Add Post thanh cong',
                data : exp 
            })
        } catch (error) {
            console.log(error);
        }

    },

    allPost : async(req,res) => {
        const {user} = req;
        try {
            const exp = await Post.find().populate("userId")
            let exp2 = Promise.all(exp.map(async(item)=>{
                let friendId = null
                if(user._id != item.userId._id){
                    const chatfriend = await Chat.find({ 
                        users: { $elemMatch: { $eq: user._id },
                                $elemMatch: { $eq: item.userId._id}
                    }})
                    friendId = chatfriend[0]._id
                }              
                return{
                    id: item._id,
                    userName: item.userId.name,
                    userImg: item.userId.avatar,
                    postTime: item.createdAt,
                    post: item.post,
                    postImg: item?.postImg ? item.postImg : 'none',
                    liked: false,
                    likes: item.likes.length,
                    comments:'0',
                    friendId: friendId? friendId : "none"
                }
            })).then(
                data => {
                    res.status(201).json({
                        success: true,
                        data: data,
                    })
                }
            )
        } catch (error) {
           res.status(500).json(error);  
        }
    },
    allPostAUser : async(req,res) => {
        const {userId} = req.body;
        console.log("hahahah"+userId);
        try {
            const exp = await Post.find({"userId": userId}).populate("userId")
            let exp2 = exp.map((item)=>{
               
                return{
                    id: item._id,
                    userName: item.userId.name,
                    userImg: item.userId.avatar,
                    postTime: item.createdAt,
                    post: item.post,
                    postImg: item?.postImg ? item.postImg : 'none',
                    liked: false,
                    likes: item.likes.length,
                    comments:'0',
                }
            })       
            res.status(201).json({
                success: true,
                data: exp2,
            })      
        } catch (error) {
           res.status(500).json(error);  
        }
    }
}
module.exports = chatController;