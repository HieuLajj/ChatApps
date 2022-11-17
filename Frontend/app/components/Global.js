import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Container, Card, UserInfo, UserImg, UserInfoText, UserName, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider} from '../styles/FeedStyles'
import PostCard from './PostCard';
import {allPost} from '../api/api_post'
import { useSelector } from 'react-redux';
const Posts = [
    {
      id: '1',
      userName: 'Jenny Doe',
      userImg: require('../../assets/icon.png'),
      postTime: '4 mins ago',
      post:
        'Hey there, this is my test for a post of my social app in React Native.',
      postImg: require('../../assets/favicon.png'),
      liked: true,
      likes: '14',
      comments: '5',
    },
    {
      id: '2',
      userName: 'John Doe',
      userImg: require('../../assets/icon.png'),
      postTime: '2 hours ago',
      post:
        'Hey there, this is my test for a post of my social app in React Native.',
      postImg: 'none',
      liked: false,
      likes: '8',
      comments: '0',
    },
    {
      id: '3',
      userName: 'Ken William',
      userImg:require('../../assets/icon.png'),
      postTime: '1 hours ago',
      post:
        'Hey there, this is my test for a post of my social app in React Native.',
      postImg: require('../../assets/favicon.png'),
      liked: true,
      likes: '1',
      comments: '0',
    },
  ];
  
export default function Global({navigation}) {
  const info = useSelector((state)=>state.personalInfo)
  const [post, setPost] = useState([]);
  useEffect(()=>{
    allPost(info.token,(data)=>{
      console.log("======================")
      console.log(data.data)
      setPost(data.data)
    })
  },[])
  return (
    <Container>
       <FlatList
        data={post}
        renderItem={({item})=>
            <PostCard item={item}/>
        }
        keyExtractor = {item => item.id}
        showsVerticalScrollIndicator= {false}
       />
    </Container>
  );
}