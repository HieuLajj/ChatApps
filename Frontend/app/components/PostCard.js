import React from "react";
import {Container, Card, UserInfo, UserImg, UserInfoText, UserName, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider} from '../styles/FeedStyles'
import Ionicons from 'react-native-vector-icons/Ionicons';
const PostCard = ({item}) => {
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
        commentText = '1 Comment';
      } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
      } else {
        commentText = 'Comment';
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
        {item.postImg != "none" ? <PostImg source={item.postImg}/>:
        <Divider/>
        }
        {/* <PostImg source={require('../../assets/favicon.png')}/>
        <Divider/> */}
        <InteractionWrapper>
            <Interaction active={item.liked}>
                <Ionicons name={likeIcon} size={25} color={likeIconColor}/>
                <InteractionText>{likeText}</InteractionText>
            </Interaction>
            <Interaction>
                <Ionicons name="md-chatbubble-outline" size={25}/>
                <InteractionText>{commentText}</InteractionText>
            </Interaction>
        </InteractionWrapper>
    </Card>
    );
}
export default PostCard;