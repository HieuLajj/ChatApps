import React from "react";
import { TouchableOpacity } from "react-native";
import {Container, Card, UserInfo, UserImg, UserInfoText, UserName, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider} from '../styles/FeedStyles'
import Ionicons from 'react-native-vector-icons/Ionicons';
const PostCard2 = ({item}) => {
    let likeText=""
    let likeIcon = item.liked ? 'heart' : "heart-outline"
    let  likeIconColor = item.liked ? '#2e64e5' : '#333';
    if (item.likes == 1) {
        likeText = '1 Like';
      } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
      } else {
        likeText = 'Like';
      }
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
        source={item.postImg}
        />:
        <Divider/>
        }
        <InteractionWrapper>
            <Interaction active={item.liked} onPress={()=>{console.log("dang an like")}}>
                <Ionicons name={likeIcon} size={25} color={likeIconColor}/>
                <InteractionText>{likeText}</InteractionText>
            </Interaction>
        </InteractionWrapper>
    </Card>
    );
}
export default PostCard2;