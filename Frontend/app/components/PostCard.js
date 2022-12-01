import React from "react";
import { TouchableOpacity } from "react-native";
import {Container, Card, UserInfo, UserImg, UserInfoText, UserName, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider} from '../styles/FeedStyles'
import Ionicons from 'react-native-vector-icons/Ionicons';
const PostCard = ({item,navigation}) => {
    let likeText=""
    let commentText=""
    let likeIcon = item.liked ? 'heart' : "heart-outline"
    let  likeIconColor = item.liked ? '#2e64e5' : '#333';
    if (item.likes == 1) {
        likeText = '1 Like';
      } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
      } else {
        likeText = 'Like';
      }
    
    if (item.comments == 1) {
        commentText = '1 Chat';
      } else if (item.comments > 1) {
        commentText = item.comments + ' Chats';
      } else {
        commentText = 'Chat';
    }
    return(
        <Card>
        <UserInfo>
          
            <UserImg source={{uri:  item.userImg}}/>
            <UserInfoText>
                <UserName>{item.userName}</UserName>
                <PostTime>{item.postTime}</PostTime>
            </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg != "none" ? <PostImg 
        //source={item.postImg}
        source={{uri:  item.postImg}}
        />:
        <Divider/>
        }
        {/* <PostImg source={require('../../assets/favicon.png')}/>
        <Divider/> */}
        <InteractionWrapper>
            <Interaction active={item.liked} onPress={()=>{console.log("dang an like")}}>
                <Ionicons name={likeIcon} size={25} color={likeIconColor}/>
                <InteractionText>{likeText}</InteractionText>
            </Interaction>
            <Interaction onPress={()=>{
              console.log(item.name)
              navigation.navigate('Chat', {chatId: item.friendId, userYourId: item.idUser, avatar: item.avatar})
            }}>
                <Ionicons name="md-chatbubble-outline" size={25}/>
                <InteractionText>{commentText}</InteractionText>
            </Interaction>
        </InteractionWrapper>
    </Card>
    );
}
export default PostCard;