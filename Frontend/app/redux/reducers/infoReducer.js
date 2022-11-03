export const CAP_NHAT_EMAIL = "CAP_NHAT_EMAIL";
export const CAP_NHAT_NAME = "CAP_NHAT_NAME";
export const CAP_NHAT_PHONE = "CAP_NHAT_PHONE";
export const CAP_NHAT_TOKEN = "CAP_NHAT_TOKEN";
export const CAP_NHAT_AVATAR = "CAP_NHAT_AVATAR";
export const CAP_NHAT = "CAP_NHAT";
const initialState = {
    id:"",
    email: "",
    name: "",
    phone: "",
    token: "",
    avg: "",
    avatar: "",
}
export default function actionForReducer(state = initialState, payload){
    switch(payload.type){
        case CAP_NHAT:
            return{
                ...state,
                id: payload.id,
                email: payload.email,
                name: payload.name,
                phone: payload.phone,
                token: payload.token,
                avg:   payload.avg,
                avatar:payload.avatar,
            }
        default:
            return state
    }
}