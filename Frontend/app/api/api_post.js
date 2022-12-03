import client from './client'

const allPost = async(token, myCallback) => {
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/post/allPost`,config); 
        myCallback(res.data);
        //return res.data   
    } catch (error) {
        console.log(error.message);    
    }
}

const allPostAUser = async(token, id, myCallback)=>{
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.post(`/laihieu/post/allPostaUser`,{
            userId: id
        },config); 
        myCallback(res.data);
        //return res.data   
    } catch (error) {
        console.log(error.message);    
    }
}

const createPost = async(token,postyy,image, myCallback) => {
    const formData = new FormData();
    formData.append('imgPost',{
        name: new Date() + 'post',
        uri: image,
        type: 'image/jpg'
    })
    formData.append('post',postyy)
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.post(`/laihieu/post/addPost`,formData,config); 
        myCallback(res.data);
        console.log("gui thanh cong");
        //return res.data   
    } catch (error) {
        console.log(":)))")
        console.log(error);    
    }
}

const likePost = async(token, id, myCallback)=>{
    const config = {
        headers: {
          Authorization: `jwt ${token}`
        },
    };

    try {
        const res = await client.get(`/laihieu/post/like/${id}`,config);
        myCallback(res.data.result);
        //return res.data   
    } catch (error) {
        console.log(error.message);    
    }
}

export {
    allPost,
    createPost,
    allPostAUser,
    likePost
}