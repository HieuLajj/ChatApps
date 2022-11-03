import{CAP_NHAT_EMAIL,CAP_NHAT_PHONE,CAP_NHAT_TOKEN,CAP_NHAT_NAME,CAP_NHAT_AVATAR,CAP_NHAT,} from '../reducers/infoReducer';
export const updateInfomation=(id,email,name,phone,token,avg,avatar)=> async dispatch =>{
    try {
        dispatch({
            type: CAP_NHAT,
            id:id,
            email:email,
            name:name,
            phone:phone,
            token:token,
            avg:avg,
            avatar:avatar,
        })
    } catch (error) {     
    }
}