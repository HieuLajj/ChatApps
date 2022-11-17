import { View, Text, Button, StyleSheet, FlatList, Image, StatusBar ,TouchableOpacity } from 'react-native';
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
import {fetchChats} from '../api/api_chat'
import {searchUser} from '../api/api_user'
import SearchBar from './SearchBar';
const Messages = [
    {
      name: 'Jenny Doe',
      avatar: 'https://placeimg.com/140/140/any',
      email: 'laivanhieu@gmail.com',
    },
    {
      name: 'Jenny Doe',
      avatar: 'https://placeimg.com/140/140/any',
      email: 'phamthua@gmail.com',
    },
    {
      name: 'Jenny Doe',
      avatar: '../../assets/icon.png',
      email: 'trando@gmail.com',
    },
    {
      name: 'Jenny Doe',
      avatar: 'https://placeimg.com/140/140/any',
      email: 'Toiyeuem@gamil.com',
    },
  ];
export default function Home({navigation}) {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const info = useSelector((state)=>state.personalInfo)
  useEffect(() => {
    setLoading(true);
    fetchChats(info.token,(data)=>{
      console.log(data)
      setMessages(data)
      console.log(JSON.stringify(messages)+"Fe")
    })
    setLoading(false);
    //  console.log(JSON.stringify(data)+"feeee"+info.token)
    //  setMessages(data)
    // fetchChats(info.token).then((data)=>{
    //   setMessages(data)
    //   console.log("===========================")
    // })
  },[]);

  const searchSubmit = () => {
    searchUser(info.token,searchText, (data)=>{
      setProfiles(data)
    })
  }
    return (
        <View style={{flex:1, backgroundColor: "#ffffff",}}>
        <SearchBar searchText={searchText} setSearchText={setSearchText} onSubmit={searchSubmit}/>
        {
        searchText ?
        <FlatList
          //horizontal
          data={profiles}
          contentContainerStyle ={{
            paddingHorizontal:20,
          }}
          renderItem={({ item,index }) => (
            <TouchableOpacity style={{flexDirection:'row', padding:5, marginBottom:5, borderRadius:12, backgroundColor:'rgba(236, 240, 241,0.8)',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height:10
                            },
                            shadowOpacity: 0.3,
                            shadowRadius:20,
                            width:350                       
                            }}
                onPress={()=>{navigation.navigate('ProfileSearch',{item: item})} } 
            >
              <Image source={{uri:  item.avatar}}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 70,
                      marginRight: 10,
                    }}
              />
              <View>
                <Text style={{fontSize:18, fontWeight:'700'}}>{item.name}</Text>
                <Text style={{fontSize:12, opacity:.5}}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.email}
        />
        :<Container>
          <FlatList 
            data={messages}
            keyExtractor={item=>item.id}
            renderItem={({item}) => (
              <Card onPress={() => navigation.navigate('Chat', {chatId: item.id, userYourId: item.idUser})}>
                <UserInfo>
                  <UserImgWrapper>
                    <UserImg source={{uri: item.userImg}} />
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
        }
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
  });