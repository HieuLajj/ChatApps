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

const createUser = async(inputs) => {

    try {
        const res = await client.post('/laihieu/user/add_user',{...inputs}) 
        
        // if(res.data.success){
        //   const token = res.data.token
        //   await AsyncStorage.setItem('token', token)
        // }
       console.log(JSON.stringify(inputs)+"hahahahahaha")
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

const updateUser = async(token, inputs, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };
    let a={}
    if(inputs?.name){
        a.name = inputs?.name
    }
    if(inputs?.email){
        a.email = inputs?.email
    }
    if(inputs?.phone){
        a.phone = inputs?.phone
    }

    try {
        const res = await client.post(`/laihieu/user/update`,a,config); 
          console.log(res.data)
        myCallback(res.data)  
    } catch (error) {
         console.log(error.message);    
    }
}

const followUser = async(token, id, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/user/follow/${id}`,config) 
        myCallback(res.data)  
    } catch (error) {
        console.log(error);    
    }
}

const unfollowUser = async(token, id, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/user/unfollow/${id}`,config); 
        myCallback(res.data)  
    } catch (error) {
         console.log(error.message);    
    }
}

export {
    loginUser,
    searchUser,
    followUser,
    unfollowUser,
    createUser,
    updateUser
}
 