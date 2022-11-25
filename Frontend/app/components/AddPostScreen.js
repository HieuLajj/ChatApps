import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Animated
} from 'react-native';
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost'
import {useDispatch,useSelector} from 'react-redux'
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker'
import { createPost } from '../api/api_post';
import Constants from 'expo-constants'
export default function AddPostScreen() {
  const info = useSelector((state)=>state.personalInfo)
  const [post, setPost] = useState(null);
  const [image, setImage] = useState(null);
  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  const [icon_3] = useState(new Animated.Value(40));

  const [pop, setPop] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  const PickImage = async () => {
    console.log("dang pick Image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect:[4,3],
      quality:1
    })
    console.log(result)
    if(!result.cancelled){
      setImage(result.uri)
    }
  }

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
      </InputWrapper>

      
      <Animated.View style={[styles.circle, { bottom: icon_1}]}>
        <TouchableOpacity onPress={()=>{
          PickImage();
        }}>
          <Icon name="photo" size={25} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { bottom: icon_2, right: icon_2}]}>
        <TouchableOpacity>
          <Icon name="print" size={25} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { right: icon_3}]}>
        <TouchableOpacity onPress={()=>{
          console.log("dang tien hanh");
          createPost(info.token,post,image,()=>{
            console.log("hahahaha");
          })
        }}>
          <Icon name="send" size={25} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.circle}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <Icon name="plus" size={25} color="#FFFF" />
      </TouchableOpacity>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  circle: {
    backgroundColor: '#f52d56',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 40,
    right: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
 }
});