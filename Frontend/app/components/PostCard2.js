import React, {useState, useEffect} from "react";
import { TouchableOpacity } from "react-native";
import {Container, Card, UserInfo, UserImg, UserInfoText, UserName, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider} from '../styles/FeedStyles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch,useSelector} from 'react-redux'
import { likePost } from "../api/api_post";
const PostCard2 = ({item}) => {
    const info = useSelector((state)=>state.personalInfo)
    let commentText=""
    const [likeIcon, setLikeIcon] = useState("");
    const [likeIconColor, setLikeIconColor] = useState("");
    const [likeText, setLikeText] = useState("");
    function funcLikeText(data){
        if (data == 1) {
          return  '1 Like';
        } else if (data > 1) {
          return data + ' Likes';
        } else {
          return 'Like';
        }
    }
    useEffect(() => {
        setLikeIcon(item.liked ? 'heart' : "heart-outline")
        setLikeIconColor(item.liked ? '#2e64e5' : '#333')
        setLikeText(funcLikeText(item.likes))
    },[])
    return(
        <Card>
        <UserInfo>
          
            {/* <UserImg source={{uri:  item.userImg}}/> */}
            <UserInfoText>
                <PostTime>{item.postTime}</PostTime>
            </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg != "none" ? <PostImg 
        source={{uri:  item.postImg}}
        />:
        <Divider/>
        }
        <InteractionWrapper>
            <Interaction active={item.liked} onPress={()=>{
                likePost(info.token,item.id,(data)=>{
                    console.log(data)
                    setLikeIcon(data ? 'heart' : "heart-outline")
                    setLikeIconColor(data? '#2e64e5' : '#333')
                    if(data == 1){
                      item.likes += 1;
                      setLikeText(funcLikeText(item.likes))
                    }else if(data == 0){
                      item.likes -= 1;
                      setLikeText(funcLikeText(item.likes))
                    }
                })
            }}>
                <Ionicons name={likeIcon} size={25} color={likeIconColor}/>
                <InteractionText>{likeText}</InteractionText>
            </Interaction>
        </InteractionWrapper>
    </Card>
    );
}
export default PostCard2;