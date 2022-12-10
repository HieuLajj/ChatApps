import client from './client'

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

const sendMessage = async(token, contentSend, chatIdSend, image,video)=>{
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
        console.log(error);    
    }
}
export {
    allMessages,
    sendMessage,
}
 