import client from './client'

const fetchChats = async(token, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get('/laihieu/chat/fetchChats',config); 
        myCallback(res.data);
        //return res.data   
    } catch (error) {
         console.log(error.message);    
    }
}
const accessChat = async(token,userId, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.post('/laihieu/chat/accessChat',
        {
            "userId": userId
        },config); 
        myCallback(res.data);
        //return res.data   
    } catch (error) {
         console.log(error.message);    
    }
}
export {
    fetchChats,
    accessChat
}
 