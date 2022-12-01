import React from 'react';
import {View, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import PostCard2 from './PostCard2';
import {useDispatch,useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Container} from '../styles/FeedStyles'
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
export default function Profile({navigation}) {
  const info = useSelector((state)=>state.personalInfo)
  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.userInfoSection}>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <Avatar.Image 
          source={{
            uri: info.avatar,
          }}
          size={80}
        />
        <View style={{marginLeft: 20}}>
          <Title style={[styles.title, {
            marginTop:15,
            marginBottom: 5,
          }]}>{info.name}</Title>
        </View>
      </View>
    </View>

    <View style={styles.userInfoSection}>
      <View style={styles.row}>
        <Icon name="phone" color="#777777" size={20}/>
        <Text style={{color:"#777777", marginLeft: 20}}>{info.phone}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="email" color="#777777" size={20}/>
        <Text style={{color:"#777777", marginLeft: 20}}>{info.email}</Text>
      </View>
    </View>

    <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
          borderRightColor: '#dddddd',
          borderRightWidth: 1
        }]}>
          <Title>{info.followers.length}</Title>
          <Caption>Flower</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>{info.followins.length}</Title>
          <Caption>Flowing</Caption>
        </View>
    </View>

    <View style={styles.menuWrapper}>
      <TouchableRipple
        onPress={()=>{
          navigation.navigate('EditProfileScreen')
        }} 
      
      >
        <View style={styles.menuItem}>
          <Icon name="account-settings" color="#2e64e5" size={25}/>
          <Text style={styles.menuItemText}>Settings</Text>
        </View>
      </TouchableRipple>
      <View style={styles.menuItem}>
        <Icon name="account-check-outline" color="#000000" size={25}/>
        <Text style={styles.menuItemText}>Post</Text>
      </View>
    </View>
    <Container>
      <FlatList
        data={Posts}
        renderItem={({item})=>
          <PostCard2 item={item}/>
        }
        keyExtractor = {item => item.id}
        showsVerticalScrollIndicator= {false}
      />
    </Container>
  </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});