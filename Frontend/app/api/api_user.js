import client from './client'
const loginUser = async(inputs) => {

    try {
        const res = await client.post('/laihieu/user/sign_in',{...inputs}) 
        
        // if(res.data.success){
        //   const token = res.data.token
        //   await AsyncStorage.setItem('token', token)
        // }
       
        return res.data   
     } catch (error) {
         console.log(error.message);    
     }
}

const searchUser = async(token, text, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/user/searchuser?search=${text}`,config); 
        myCallback(res.data)  
    } catch (error) {
         console.log(error.message);    
    }
}
export {
    loginUser,
    searchUser
}
 