import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {allMessages, sendMessage} from '../api/api_message'
import {useDispatch,useSelector} from 'react-redux'
import io from 'socket.io-client'
const ENDPOINT = "http:// 169.254.225.93:8000"
let socket;
export default function Chat(props) {
    const info = useSelector((state)=>state.personalInfo)
    const [messages, setMessages] = useState([]);
    useEffect(()=>{
      socket = io("http://192.168.1.234:8000")
      socket.emit("join chat", props.route.params.chatId);
    },[])
    useEffect(() => {
      //console.log(props.route.params.chatId+"okookokkokokokok"+props.route.params.userYourId);
      allMessages(info.token, props.route.params.chatId,(data)=>{
        setMessages(data)
      })
      socket.on("message recieved",(data)=>{
        let messages2 = JSON.parse(data);
        setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages2),
      );
      })
      // setMessages([
      //   {
      //     _id: "Fawefjokawehf",
      //     text: 'Hello developer',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 2,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     },
      //   },
      //   {
      //     _id: "fahwehyfawjh",
      //     text: 'Hellogrr world',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 1,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     },
      //   },
      //   {
      //       _id: 3,
      //       text: 'tran thu ha',
      //       createdAt: new Date(),
      //       user: {
      //         _id: 1,
      //         name: 'React Native',
      //         avatar: 'https://placeimg.com/140/140/any',
      //       },
      //   },
      //   {
      //       _id: 4,
      //       text: 'Laivanhihieu',
      //       createdAt: new Date(),
      //       user: {
      //         _id: 0,
      //         name: 'React Native',
      //         avatar: 'https://placeimg.com/140/140/any',
      //       },
      //   },
      // ]);
    }, []);
  
    const onSend = useCallback((messages = []) => {    
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );
    }, []);
  
    const renderSend = (props) => {
      return (
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
              sendMessage(info.token, messages[0].text, props.route.params.chatId)
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