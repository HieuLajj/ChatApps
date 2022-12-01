import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
//import client from '../api/client';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import {loginUser} from "../api/api_user"
import {useDispatch,useSelector} from 'react-redux';
import {updateInfomation,updateEmail, updatePhone,updateName,updateToken,updateAvatar} from '../redux/actions/updateAction';
const LoginForm = ({navigation}) => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { email, password } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Required all fields!', setError);

    if (!isValidEmail(email)) return updateError('Invalid email!', setError);

    if (!password.trim() || password.length < 8)
      return updateError('Password is too short!', setError);

    return true;
  };
  const loginAPI = async(inputs) =>{
    loginUser(inputs).then((data)=>{
      data.user.avatar?
      dispatch(updateInfomation(data.user.id,data.user.email,data.user.name,data.user.phone,data.token,data.user.avg,data.user.avatar,data.user.followers, data.user.followins))
      :
      dispatch(updateInfomation(data.user.id,data.user.email,data.user.name,data.user.phone,data.token,data.user.avg,'https://sieupet.com/sites/default/files/pictures/images/1-1473150685951-5.jpg',data.user.followers, data.user.followins))
      console.log(JSON.stringify(data)+"goi api thanh cong")
      navigation.navigate('MyTabs');
    })
  }

  const submitForm = async () => {
   // if (isValidForm()) {
        //console.log(userInfo)
        await loginAPI(userInfo)
    //   try {
    //     const res = await client.post('/sign-in', { ...userInfo });

    //     if (res.data.success) {
    //       setUserInfo({ email: '', password: '' });
    //       setProfile(res.data.user);
    //       setIsLoggedIn(true);
    //     }

    //     console.log(res.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //}
  };

  return (
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <FormInput
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        label='Email'
        placeholder='example@email.com'
        autoCapitalize='none'
      />
      <FormInput
        value={password}
        onChangeText={value => handleOnChangeText(value, 'password')}
        label='Password'
        placeholder='********'
        autoCapitalize='none'
        secureTextEntry
      />
      <FormSubmitButton onPress={submitForm} title='Login' />
    </FormContainer>
  );
};

const styles = StyleSheet.create({});

export default LoginForm;