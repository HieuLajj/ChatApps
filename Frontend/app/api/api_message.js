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

const sendMessage = async(token, contentSend, chatIdSend)=>{
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };
    // console.log(contentSend+"fawefawefaew"+contentSend.toString());
    try {
        const res = await client.post(`/laihieu/message/sendMessage`
        ,{
            content  : contentSend,
            chatId : chatIdSend,
        }
        ,config); 
        console.log("da gui tin nhan thanh cong");
        //return res.data   
    } catch (error) {
        console.log(error.message);    
    }
}
export {
    allMessages,
    sendMessage,
}
 