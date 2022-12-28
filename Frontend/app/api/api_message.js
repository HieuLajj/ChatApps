import client from './client'
import * as DocumentPicker from 'expo-document-picker';
const allMessages = async(token, id, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/message/allMessage/${id}`,config); 
        myCallback(res.data);
        //return res.data   
    } catch (error) {
        console.log(error.message);    
    }
}

const sendMessage = async(token, contentSend, chatIdSend, image, video, audio, imgRaw)=>{
    const formData = new FormData();
    if (image != null){
        formData.append('imgChat',{
            name: new Date() + 'post',
            uri: image,
            type: 'image/jpg'
        })
    }
    if (video != null){
        formData.append('imgVideo',{
            name: new Date() + 'videopost',
            uri: video,
            type: 'video/mp4'
        })
    }
    if (audio != ""){
        formData.append('imgAudio',{
            name: new Date() + 'audiopost',
            uri: audio,
            type: 'audio/m4a'
        })
    }
    console.log("hihihi"+JSON.stringify(imgRaw))
    if (imgRaw != ""){
        formData.append('imgRaw',{
            name: new Date() + 'affffudiopost',
            uri: imgRaw.uri,
            type: imgRaw.type
        })
        console.log("okmedi")
    }
    formData.append('content', contentSend)
    formData.append('chatId', chatIdSend)
    const config = {
        headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           Authorization: `jwt ${token}`
        },
    };
    try {
        const res = await client.post(`/laihieu/message/sendMessage`
        ,
        formData
        ,config); 
        console.log("da gui tin nhan thanh cong");
        //return res.data   
    } catch (error) {
        console.log(error+'aaaaaa');    
    }
}
export {
    allMessages,
    sendMessage,
}
 