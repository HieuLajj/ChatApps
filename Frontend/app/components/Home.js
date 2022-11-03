import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles'
import {useDispatch,useSelector} from 'react-redux'
const Messages = [
    {
      id: '1',
      userName: 'Jenny Doe',
      userImg: require('../../assets/icon.png'),
      messageTime: '4 mins ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '2',
      userName: 'John Doe',
      userImg: require('../../assets/icon.png'),
      messageTime: '2 hours ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '3',
      userName: 'Ken William',
      userImg: require('../../assets/icon.png'),
      messageTime: '1 hours ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '4',
      userName: 'Selina Paul',
      userImg: require('../../assets/icon.png'),
      messageTime: '1 day ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '5',
      userName: 'Christy Alex',
      userImg: require('../../assets/icon.png'),
      messageTime: '2 days ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
  ];
export default function Home({navigation}) {
  const info = useSelector((state)=>state.personalInfo)
  useEffect(() => {
    console.log("bat dau kiem thu")
    console.log("ok"+ info.token +"ok")
  },[info]);
    return (
        <Container>
          <FlatList 
            data={Messages}
            keyExtractor={item=>item.id}
            renderItem={({item}) => (
              <Card onPress={() => navigation.navigate('Chat', {userName: item.userName})}>
                <UserInfo>
                  <UserImgWrapper>
                    <UserImg source={item.userImg} />
                  </UserImgWrapper>
                  <TextSection>
                    <UserInfoText>
                      <UserName>{item.userName}</UserName>
                      <PostTime>{item.messageTime}</PostTime>
                    </UserInfoText>
                    <MessageText>{item.messageText}</MessageText>
                  </TextSection>
                </UserInfo>
              </Card>
            )}
          />
        </Container>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
  });