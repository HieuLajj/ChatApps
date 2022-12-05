import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {allMessages, sendMessage} from '../api/api_message'
import {useDispatch,useSelector} from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import io from 'socket.io-client'
const ENDPOINT = "http:// 169.254.225.93:8000"
let socket;
export default function Chat(props) {
    const info = useSelector((state)=>state.personalInfo)
    const [messages, setMessages] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    useEffect(()=>{
      socket = io("http://192.168.1.234:8000")
      socket.emit("join chat", props.route.params.chatId);
    },[])
    useEffect(() => {
      //console.log(props.route.params.chatId+"okookokkokokokok"+props.route.params.userYourId);
      allMessages(info.token, props.route.params.chatId,(data)=>{
        var data2 = data.map((data)=>{
          //console.log(data)
          return{
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt,
                user: {
                  _id: data.user._id,
                  name: data.user.name,
                  avatar: props.route.params.avatar
                },
                image: data?.image ? data.image : null
          }
        })
        setMessages(data2)
        // console.log(data2)
        // setMessages([
        //   {
        //     _id: 1,
        //     text: 'Hello developer',
        //     createdAt: new Date(),
        //     user: {
        //       _id: 2,
        //       name: 'React Native',
        //       avatar: 'https://placeimg.com/140/140/any',
        //     },
        //   },
        //   {
        //     _id: 2,
        //     text: 'My message',
        //     createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        //     user: {
        //       _id: 2,
        //       name: 'React Native',
        //       avatar: 'https://placeimg.com/140/140/any',
        //     },
        //     image: 'https://placeimg.com/140/140/any',
        //     // You can also add a video prop:
        //     //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        //     // Mark the message as sent, using one tick
        //     sent: true,
        //     // Mark the message as received, using two tick
        //     received: true,
        //     // Mark the message as pending with a clock loader
        //     pending: true,
        //     // Any additional custom parameters are passed through
        //   }
        // ])
        
      })
      socket.on("message recieved",(data)=>{
        let messages2 = JSON.parse(data);
        setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages2),
      );
      })
    }, []);
  
    const OpenCamera = async () => {
      console.log("dang pick Image");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[4,3],
        quality:1
      })
      if(!result.cancelled){
        // setImage(result.uri)
        setImageData(result.uri)
      }
    }
    const onSend = useCallback((messages = []) => {    
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );
    }, []);

  
    const renderSend = (props) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            source={{uri: imageData}}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              // position: 'absolute'
            }}
          />
          <TouchableOpacity
            onPress={()=>{
              //OpenCamera();
            }}
          >
            <MaterialCommunityIcons
              name="attachment"
              //style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              OpenCamera();
            }}
          >
            <MaterialCommunityIcons
              name="camera"
              //style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
          </TouchableOpacity>
          <Send {...props}>
            <View>
              <MaterialCommunityIcons
                name="send-circle"
                style={{marginBottom: 5, marginRight: 5}}
                size={32}
                color="#2e64e5"
              />
            </View>
          </Send>
        </View>
      );
    };
  
    const renderBubble = (props) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#2e64e5',
            },
          }}
          textStyle={{
            right: {
              color: '#fff',
            },
          }}
        />
      );
    };
  
    const scrollToBottomComponent = () => {
      return(
        <FontAwesome name='angle-double-down' size={22} color='#333' />
      );
    }
    
    return (
        

        <GiftedChat
            messages={messages}
            onSend={(messages) =>{
              onSend(messages)
              sendMessage(info.token, messages[0].text, props.route.params.chatId,imageData)
              socket.emit('message recieved',JSON.stringify(messages))
            }}
            user={{
            _id: 1,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
        />
    
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });