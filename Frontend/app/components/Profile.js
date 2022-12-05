import React, {useState, useEffect, useCallback} from 'react';
import {View, SafeAreaView, StyleSheet, FlatList, RefreshControl} from 'react-native';
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
import { allPostAUser } from '../api/api_post';
export default function Profile({navigation}) {
  const info = useSelector((state)=>state.personalInfo)
  const [post, setPost] = useState([]);
  const [reset,setReset] = useState(false)
  const [refreshControl,setRefreshControl] = useState(false)
  useEffect(() => {
    allPostAUser(info.token, info.id,(data)=>{
      setPost(data.data);
    });
  },[reset])
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
        data={post}
        renderItem={({item})=>
          <PostCard2 item={item}/>
        }
        keyExtractor = {item => item.id}
        showsVerticalScrollIndicator= {false}
        refreshControl = {
          <RefreshControl refreshing = {refreshControl} onRefresh={()=>{
            setRefreshControl(true)
            setReset(!reset)
            setRefreshControl(false)
          }} colors={['red']}
          />
        }
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