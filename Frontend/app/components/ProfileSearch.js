import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  RefreshControl
} from 'react-native';
import {Container} from '../styles/FeedStyles'
import FormButton from './FormButton';
import PostCard2 from './PostCard2';
import {useDispatch,useSelector} from 'react-redux'
import { allPostAUser } from '../api/api_post';
import { followUser, unfollowUser } from '../api/api_user';
const ProfileSearch = ({navigation, route}) => {
  const info = useSelector((state)=>state.personalInfo)
  let [userData, setUserData] = useState()
  const [post, setPost] = useState([]);
  const [follow, setFollow] = useState("");
  const [reset,setReset] = useState(false)
  const [refreshControl,setRefreshControl] = useState(false)
  useEffect(() => {
    if(route.params.item.followers.includes(info.id)){
      setFollow("UnFollow")
    }else{
      setFollow("Follow")
    }
    setUserData(route.params.item)
    allPostAUser(info.token, route.params.item._id,(data)=>{
      setPost(data.data);
    });
  },[reset]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{uri: userData ? userData.avatar || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
        />
        <Text style={styles.userName}>{userData ? userData.name : 'Lai van hieu'}</Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>
        {userData ? userData.about || 'No details added.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {
                if(follow == "Follow"){
                  followUser(info.token, userData._id,(data)=>{console.log(data)})
                  setFollow("UnFollow")
                }else{
                  unfollowUser(info.token, userData._id,(data)=>{console.log(data)})
                  setFollow("Follow")
                }
              }}>
                <Text style={styles.userBtnTxt}>{follow}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{post.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{route.params.item.followers.length}</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{route.params.item.followins.length}</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>
      </ScrollView>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileSearch;