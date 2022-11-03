import { StyleSheet, View } from 'react-native';
import AppForm from './app/components/AppForm';
import Home from './app/components/Home';
import Chat from './app/components/Chat';
import Profile from './app/components/Profile';
import {Provider} from 'react-redux'
import {store} from './app/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  function MyTabs() {
    return (
      <Tab.Navigator  screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='AppForm' screenOptions={{headerShown: false}}>
          <Stack.Screen name="AppForm" component={AppForm} />
          <Stack.Screen name="MyTabs" component={MyTabs} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
