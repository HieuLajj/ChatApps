import React, {useState, useEffect, useCallback} from 'react';
import { Audio, Video } from 'expo-av';
import {View, ScrollView, Text, Button, StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {allMessages, sendMessage} from '../api/api_message'
import {useDispatch,useSelector} from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { StorageAccessFramework } from 'expo-file-system';
import Slider from '@react-native-community/slider'
import io from 'socket.io-client'
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
const ENDPOINT = "http:// 169.254.225.93:8000"
let socket;

export default function Chat(props) {
  
    const info = useSelector((state)=>state.personalInfo)
    const [messages, setMessages] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [videoData, setVideoData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [playbackObj, setPlayBackObj] = React.useState(null);
    const [playing, SetPlaying] = React.useState(false);
    const [sound, setSound] = useState('');
    const [raw, setRaw] = useState('')

    useEffect(()=>{
      socket = io("http://192.168.1.234:8000")
      socket.emit("join chat", props.route.params.chatId);
      
    },[])
    useEffect(() => {
      //console.log(props.route.params.chatId+"okookokkokokokok"+props.route.params.userYourId);
      allMessages(info.token, props.route.params.chatId,(data)=>{
        var data2 = data.map((data)=>{
          return{
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt,
                user: {
                  _id: data.user._id,
                  name: data.user.name,
                  avatar: props.route.params.avatar
                },
                image: data?.image ? data.image : null,
                video: data?.video ? data.video : null,
                audio: data?.audio ? data.audio : null,
                pdf: data?.pdf ? data.pdf: null
          }
        })
        setMessages(data2)
        // console.log(data2)
        // setMessages([
        //   {
        //     _id: 1,
        //     text: 'Hello developer',
        //     audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        //     pdf: "https://res.cloudinary.com/hieulajj/image/upload/v1671547207/6360856168609521ddd9ff31_post1671547201619.jpg",
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
        //     video: 'https://res.cloudinary.com/hieulajj/video/upload/v1670650831/63608957cf813b532672b321video_post1670650826362.mp4',
        //     audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        //     // Mark the message as sent, using one tick
        //     //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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
    async function startRecording() {
      try {
        const permission = await Audio.requestPermissionsAsync();
  
        if (permission.status === "granted") {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true
          });
          
          const { recording } = await Audio.Recording.createAsync(
            {
              android: {
                extension: '.m4a',
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
              },
              ios: {
                extension: '.caf',
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
              },
            }
          );
  
          setRecording(recording);
        } else {
          console.log("Please grant permission to app to access microphone");
        }
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  
    async function stopRecording() {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
  
      let updatedRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI()
      });
      setSound(recording.getURI())
      setRecordings(updatedRecordings);
    }
    function getDurationFormatted(millis) {
      const minutes = millis / 1000 / 60;
      const minutesDisplay = Math.floor(minutes);
      const seconds = Math.round((minutes - minutesDisplay) * 60);
      const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutesDisplay}:${secondsDisplay}`;
    }
  
    function getRecordingLines() {
      return recordings.map((recordingLine, index) => {
        return (
          <View key={index} style={styles.row}>
            <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
            <TouchableOpacity
              onPress={
                ()=>{
                  recordingLine.sound.replayAsync()
                  // setSound(recordingLine.file)
                  // console.log(recordingLine.file)
                }
              }
            >
            <MaterialCommunityIcons
              name="play"
              //style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
            </TouchableOpacity>

             <TouchableOpacity
              onPress={
                ()=>{
                  setRecordings([]);
                }
              }
              >
            <MaterialCommunityIcons
              name="stop"
              //style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
            </TouchableOpacity>
          </View>
        );
      });
    }
    
  const PlayAudio = async (tracksound) => {
    console.log("Loading Sound"+tracksound);
    // const { sound } = await Audio.Sound.createAsync({uri:tracksound});

    const playbackObj = new Audio.Sound();
    const sound = await playbackObj.loadAsync({uri:tracksound},{shouldPlay: true});
    setPlayBackObj(playbackObj);
    //setSound(sound);
    // await sound.playAsync();
  };
  
  const PauseAudio = async () => {
    try {
      const status = await playbackObj.setStatusAsync({shouldPlay: false});  
    } catch (error) {
      console.log(error)
    }
  };
    const OpenCamera = async () => {
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
    const OpenVideo = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality:1
      })
      if(!result.cancelled){
        setVideoData(result.uri)
        //console.log(result.uri)
      }
    }

    const onSend = useCallback((messages = []) => {    
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );
    }, []);
    const renderMessageVideo = (props) => {
      const { currentMessage } = props;
      return (
        <View style={{ padding: 20 }}>
          {currentMessage ? 
            <Video
              style={styles.video}
              resizeMode="contain"
              useNativeControls
              shouldPlay={false}
              isLooping
              source={{ uri: currentMessage.video }}
            />
            :null
          }
        </View>
      );
    };

    const renderAudio = (props) =>{
      const { currentMessage } = props;
      return (
        <View style={{}}>
          {currentMessage?.audio != null ?
            <View style={{
              flexDirection:'row'
            }}>
              <TouchableOpacity
                onPress={
                  ()=>{
                    if(playing){
                      PauseAudio();
                    }else{
                      PlayAudio(currentMessage.audio);
                      //PlayAudio("https://res.cloudinary.com/hieulajj/video/upload/v1671332945/63608957cf813b532672b321audio_post1671332943423.m4a");
                    }
                    SetPlaying(!playing);
                  }
                }
              >
              <Image style={{
                width:100,
                height:30,
              }}
                source={require('../../assets/voice.png')}
              />
              {/* {playing ?
                <MaterialCommunityIcons
                  name="play"
                  //style={{marginBottom: 5, marginRight: 5}}
                  size={32}
                  color="#2e64e5"
                />:
                <MaterialCommunityIcons
                  name="pause"
                  //style={{marginBottom: 5, marginRight: 5}}
                  size={32}
                  color="#2e64e5"
                />       
              } */}
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={
                  ()=>{
                    
                    PauseAudio();
                    SetPlaying(!playing);
                  }
                }
              >
                <MaterialCommunityIcons
                  name="pause"
                  //style={{marginBottom: 5, marginRight: 5}}
                  size={32}
                  color="#2e64e5"
                />
              </TouchableOpacity> */}
              {/* <Image style={{
                width:100,
                height:30,
              }}
                source={require('../../assets/voice.png')}
              /> */}
            </View>
            :null
          }
        </View>
      );
    }

  
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
          {getRecordingLines()}
          <TouchableOpacity
            title={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons
              name="record-circle"
              //style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              OpenVideo();
            }}
          >
            <MaterialCommunityIcons
              name="video"
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
          <TouchableOpacity
            onPress={async()=>{
              let result = await DocumentPicker.getDocumentAsync({
                type: "*/*"
              })
              console.log(result);
              setRaw(result);
            }}
          >
            <MaterialCommunityIcons
              name="file-upload"
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
    const renderCustomView = (props) => {
      if (props?.currentMessage?.pdf) {
        return(
          <TouchableOpacity onPress={()=>{
            console.log(props?.currentMessage?.pdf)
            downloadFile(props?.currentMessage?.pdf);
            console.log("hahahah")
          }}>
            <Text>Day la file pdf
            </Text>
          </TouchableOpacity>
        );
      }
    }
    const downloadFile=(uri)=>{
      // const uri = "http://techslides.com/demos/sample-videos/small.mp4"
      let fileUri = FileSystem.documentDirectory + "small.jpg";
      FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
          //Linking.openURL(uri);
          saveFile(uri);
          //console.log(uri+"nakan")
        })
        .catch(error => {
          console.error(error+"jojojo");
        })
  }
  
  const saveFile = async (fileUri) => {
    console.log("ffff"+fileUri)
    const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (perm.status != 'granted') {
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
    // if (album == null) {
    //   await MediaLibrary.createAlbumAsync('Download', asset, false);
    //   console.log("Bbbb");
    // } else {
    //   await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    //   console.log("aaa");
    // }
    console.log("fhajhfwjs"+album)
    } catch (e) {
      console.log(e);
    }
  }
  
    const scrollToBottomComponent = () => {
      return(
        <FontAwesome name='angle-double-down' size={22} color='#333' />
      );
    }
    
    return (
        

        <GiftedChat
            messages={messages}
            onSend={(messages) =>{
              messages[0].image  = imageData;
              messages[0].video = videoData;
              messages[0].audio = sound;
              messages[0].pdf = raw;
        
              // image: data?.image ? data.image : null,
              //   video: data?.video ? data.video : null,
              //   audio: data?.audio ? data.audio : null,
              onSend(messages)
              sendMessage(info.token, messages[0].text, props.route.params.chatId,imageData, videoData, sound, raw)
              setSound("")
              setRaw("")
              setRecordings([]);
              setImageData(null);
              setVideoData(null);
              socket.emit('message recieved',JSON.stringify(messages))
            }}
            user={{
            _id: 1,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderMessageVideo={renderMessageVideo}
            renderMessageAudio={renderAudio}
            renderCustomView={renderCustomView}
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
    video:{
      height:200,
      width: 200,
      alignSelf:'stretch'
    },
    progressContainer:{
      width: 250,
      flexDirection: 'row'
    }
  });