import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import io from 'socket.io-client'
const ENDPOINT = "http:// 169.254.225.93:8000"
let socket;
export default function Chat() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
      
      socket = io("http://192.168.187.177:8000")
      socket.on("message recieved",(data)=>{
        let messages2 = JSON.parse(data);
        setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages2),
      );
      })
      setMessages([
        {
          _id: "Fawefjokawehf",
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: "fahwehyfawjh",
          text: 'Hellogrr world',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
            _id: 3,
            text: 'tran thu ha',
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
        },
        {
            _id: 4,
            text: 'Laivanhihieu',
            createdAt: new Date(),
            user: {
              _id: 0,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
        },
      ]);
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
              // console.log(messages)
              socket.emit('data',JSON.stringify(messages))
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